import json
from app.data_generator import generate_problem
from app.ddr_heuristic import run_ddr, RULE_SCT
from app.solver import ProblemData

def run_test(n, m, seed=42, n_families=7, np_ratio=0.2):
    print(f"--- TEST: n={n}, m={m} ---")
    problem = generate_problem(n, m, seed, n_families, np_ratio)
    P = problem["P"]
    S = problem["S"]
    D = problem["D"]
    NP = problem["NP"]
    
    # parse keys to int
    P_int = {int(j): {int(k): P[j][k] for k in P[j]} for j in P}
    S_int = {int(i): {int(j): {int(k): S[i][j][k] for k in S[i][j]} for j in S[i]} for i in S}
    D_int = {int(j): float(D[j]) for j in D}
    NP_int = {int(j): {int(k): NP[j][k] for k in NP[j]} for j in NP}
    
    res = run_ddr(n, m, P_int, S_int, D_int, NP_int, RULE_SCT, None, 999999, verbose=False)
    
    # Count tardy jobs
    num_tardy = sum(1 for j in D_int if any(j == job_id and e_time > D_int[j] for k_val, jobs_list in res.schedule.items() for job_id, s_time, e_time in jobs_list))
    avg_d = sum(D_int.values()) / n
    print(f"Cmax: {res.Cmax:.1f}, Total Tardiness: {res.total_tardiness:.1f}, Tardy Jobs: {num_tardy}/{n}")
    print(f"Average Due Date: {avg_d:.1f}")
    print(f"Max Due Date: {max(D_int.values()):.1f}")
    print()

print("1) Orijinal kullanici testi (n=400, m=8)")
run_test(400, 8)

print("2) İs sayisini düsürdük (n=200, m=8)")
run_test(200, 8)

print("3) Makine sayisini artirdik (n=400, m=16)")
run_test(400, 16)
