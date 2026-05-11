from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from functools import lru_cache
import os
import sys

# ROOT dizinini ekle ki app klasörüne erişebilelim
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from app.data_generator import generate_problem
from app.ddr_heuristic import run_all_rules
from app.topsis import run_topsis
from app.solver import ProblemData

app = FastAPI(title="UPMSP Backend API")

from fastapi.responses import JSONResponse
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    err = traceback.format_exc()
    print(f"!!! GLOBAL HATA !!!\n{err}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Sistem Hatası: {str(exc)}", "traceback": err},
    )

# Geliştirme ortamında (Vite vb.) CORS hatalarını önlemek için
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    n: int = 10
    m: int = 3
    seed: int = 42
    n_families: int = 3
    np_ratio: float = 0.0
    scenario: str = "high"

@app.post("/api/generate")
def api_generate(req: GenerateRequest):
    try:
        problem = generate_problem(
            n=req.n, 
            m=req.m, 
            seed=req.seed, 
            n_families=req.n_families, 
            np_ratio=req.np_ratio,
            scenario=req.scenario
        )
        # S matrisini devasa boyutu nedeniyle göndermiyoruz.
        light_data = {
            "metadata": problem["metadata"],
            "family": problem["family"],
            "NP": problem["NP"],
            "P": problem["P"],
            "D": problem["D"]
        }
        return {"status": "success", "data": light_data}
    except Exception as e:
        import traceback
        with open("backend_error.log", "a") as f:
            f.write(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

class DDRRequest(BaseModel):
    problem: dict

@app.post("/api/solve_ddr")
def api_solve_ddr(req: DDRRequest):
    try:
        raw = req.problem
        meta = raw["metadata"]
        n, m = meta["n"], meta["m"]

        # Python dictlerine parse
        P  = {int(j): {int(k): raw["P"][str(j)][str(k)] for k in range(m)} for j in range(n)}
        S  = {int(i): {int(j): {int(k): raw["S"][str(i)][str(j)][str(k)] for k in range(m)} for j in range(n)}
              for i in list(range(n)) + [-1]}
        D  = {int(j): float(raw["D"][str(j)]) for j in range(n)}
        NP = {int(j): {int(k): raw.get("NP", {str(j): {str(k): 1 for k in range(m)}})[str(j)][str(k)]
                   for k in range(m)} for j in range(n)}

        results = run_all_rules(n, m, P, S, D, NP, verbose=False)
        
        # Sonuçları serialize et
        output = []
        for r in results:
            output.append({
                "rule_name": r.rule_name,
                "Cmax": r.Cmax,
                "T": r.total_tardiness,
                "L": r.num_tardy,
                "solve_time": r.solve_time,
                "schedule": r.schedule # schedule dict: {k: [(j, start, end)]}
            })
            
        return {"status": "success", "results": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DDRParamsRequest(BaseModel):
    n: int
    m: int
    seed: int
    n_families: int
    np_ratio: float
    scenario: str

@app.post("/api/solve_ddr_by_params")
def api_solve_ddr_by_params(req: DDRParamsRequest):
    try:
        problem = generate_problem(
            n=req.n, m=req.m, seed=req.seed, 
            n_families=req.n_families, np_ratio=req.np_ratio,
            scenario=req.scenario
        )
        
        n, m = req.n, req.m
        P  = {int(j): {int(k): problem["P"][str(j)][str(k)] for k in range(m)} for j in range(n)}
        S  = {int(i): {int(j): {int(k): problem["S"][str(i)][str(j)][str(k)] for k in range(m)} for j in range(n)}
              for i in list(range(n)) + [-1]}
        D  = {int(j): float(problem["D"][str(j)]) for j in range(n)}
        NP = {int(j): {int(k): problem["NP"][str(j)][str(k)] for k in range(m)} for j in range(n)}

        # run_all_rules artık kendi içinde paralelliği yönetiyor
        results = run_all_rules(n, m, P, S, D, NP, verbose=False)
        
        output = []
        for r in results:
            # Schedule verisini JSON dostu listelere çevir
            clean_schedule = {str(k): [list(step) for step in steps] for k, steps in r.schedule.items()}
            output.append({
                "rule_name": r.rule_name,
                "Cmax": float(r.Cmax),
                "T": float(r.total_tardiness),
                "L": int(r.num_tardy),
                "solve_time": float(r.solve_time),
                "schedule": clean_schedule
            })
            
        return {"status": "success", "results": output}
    except Exception as e:
        import traceback
        error_msg = f"DDR Error: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

class SingleDDRRequest(BaseModel):
    n: int = 10
    m: int = 3
    seed: int = 42
    n_families: int = 3
    np_ratio: float = 0.5
    scenario: str = "high"
    rule_name: str

@lru_cache(maxsize=128)
def solve_single_ddr_logic(n, m, seed, n_families, np_ratio, scenario, rule_name):
    problem = generate_problem(n, m, seed, n_families, np_ratio, scenario)
    
    # Veri hazırlama (Integer key dönüşümü)
    P  = {int(j): {int(k): problem["P"][str(j)][str(k)] for k in range(m)} for j in range(n)}
    S  = {int(i): {int(j): {int(k): problem["S"][str(i)][str(j)][str(k)] for k in range(m)} for j in range(n)}
          for i in list(range(n)) + [-1]}
    D  = {int(j): float(problem["D"][str(j)]) for j in range(n)}
    NP = {int(j): {int(k): problem["NP"][str(j)][str(k)] for k in range(m)} for j in range(n)}

    from app.ddr_heuristic import run_ddr
    # Kural ismini ayrıştır
    if "&" in rule_name:
        import re
        parts = re.findall(r"\[(.*) & (.*): (\d+)\]", rule_name)
        if parts:
            r1, r2, ts = parts[0]
            res = run_ddr(n, m, P, S, D, NP, r1, r2, float(ts))
        else:
            raise ValueError(f"Geçersiz kural formatı: {rule_name}")
    else:
        res = run_ddr(n, m, P, S, D, NP, rule_name)

    return {
        "rule_name": res.rule_name,
        "Cmax": res.Cmax,
        "T": res.total_tardiness,
        "L": res.num_tardy,
        "solve_time": res.solve_time,
        "schedule": {str(k): [list(step) for step in steps] for k, steps in res.schedule.items()}
    }

@app.post("/api/solve_single_ddr")
def api_solve_single_ddr(req: SingleDDRRequest):
    try:
        result = solve_single_ddr_logic(
            req.n, req.m, req.seed, req.n_families, req.np_ratio, req.scenario, req.rule_name
        )
        return {"status": "success", "result": result}
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(f"ERROR: {error_msg}")
        raise HTTPException(status_code=500, detail=str(e))

class SetupPageRequest(BaseModel):
    n: int
    m: int
    seed: int
    n_families: int
    np_ratio: float
    scenario: str
    k: int
    page: int
    page_size: int = 50

@app.post("/api/get_setup_page")
def api_get_setup_page(req: SetupPageRequest):
    """Sadece görüntüleme için S matrisinin bir sayfasını üretir ve döndürür."""
    try:
        problem = generate_problem(req.n, req.m, req.seed, req.n_families, req.np_ratio, req.scenario)
        S = problem["S"]
        
        # Seçilen makine (k) için sayfalandırılmış veri
        start = req.page * req.page_size
        end = min(req.n, start + req.page_size)
        
        page_data = {}
        for i in range(start, end):
            page_data[str(i)] = {str(j): S[str(i)][str(j)][str(req.k)] for j in range(req.n)}
        
        # Kukla iş (-1) her zaman dahil
        page_data["-1"] = {str(j): S["-1"][str(j)][str(req.k)] for j in range(req.n)}
        
        return {"status": "success", "page_data": page_data, "range": [start, end]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class TopsisRequest(BaseModel):
    candidates: list
    wC: float = 0.334
    wT: float = 0.333
    wL: float = 0.333

@app.post("/api/topsis")
def api_topsis(req: TopsisRequest):
    try:
        # TOPSIS modülü 'name' anahtarını bekliyor, DDR 'rule_name' dönüyor.
        # Bu dönüşümü burada yapalım.
        formatted_candidates = []
        for c in req.candidates:
            formatted_candidates.append({
                "name": c.get("rule_name", "Unknown"),
                "Cmax": c["Cmax"],
                "T": c["T"],
                "L": c["L"]
            })
        results = run_topsis(formatted_candidates, req.wC, req.wT, req.wL)
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CPSATRequest(BaseModel):
    n: int
    m: int
    seed: int
    n_families: int = 3
    np_ratio: float = 0.5
    scenario: str = "high"
    obj_type: str = 'Cmax'
    time_limit: int = 10

@lru_cache(maxsize=32)
def solve_cpsat_logic(n, m, seed, n_families, np_ratio, scenario, obj_type, time_limit):
    problem = generate_problem(n, m, seed, n_families, np_ratio, scenario)
    
    # Python dictlerine parse
    P  = {int(j): {int(k): problem["P"][str(j)][str(k)] for k in range(m)} for j in range(n)}
    S  = {int(i): {int(j): {int(k): problem["S"][str(i)][str(j)][str(k)] for k in range(m)} for j in range(n)}
          for i in list(range(n)) + [-1]}
    D  = {int(j): float(problem["D"][str(j)]) for j in range(n)}
    NP = {int(j): {int(k): problem["NP"][str(j)][str(k)] for k in range(m)} for j in range(n)}

    from app.solver import solve, ProblemData, SolverConfig
    p_data = ProblemData(n=n, m=m, P=P, S=S, D=D, NP=NP)
    cfg = SolverConfig(obj_type=obj_type, time_limit=time_limit)
    
    result = solve(p_data, cfg)
    
    return {
        "Cmax": result.Cmax,
        "T": result.total_tardiness,
        "L": result.num_tardy,
        "solve_time": result.solve_time,
        "schedule": {str(k): [list(step) for step in steps] for k, steps in result.schedule.items()}
    }

@app.post("/api/solve_cpsat")
def api_solve_cpsat(req: CPSATRequest):
    try:
        res = solve_cpsat_logic(
            req.n, req.m, req.seed, req.n_families, req.np_ratio, req.scenario,
            req.obj_type, req.time_limit
        )
        return {"status": "success", "results": res}
    except Exception as e:
        import traceback
        print(f"CPSAT ERROR: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

# Ana giriş noktası (test için)
@app.get("/")
def read_root():
    return {"message": "UPMSP API is running"}
