# UPMSP System - Developer & Extensibility Guide

This guide is intended for technical reviewers and developers who wish to understand the inner workings of the **UPMSP Decision Support System** or extend its capabilities.

---

## 🏗 1. Dual-Solver Architecture
The system employs a dual-solver strategy managed through an abstraction layer in `app/solver.py`:
*   **SCIP (MILP):** Implemented in `app/solver_milp.py`. It uses traditional Mixed-Integer Linear Programming. It is highly precise but computationally expensive.
*   **CP-SAT (Constraint Programming):** Implemented in `app/solver.py`. It uses a search-based constraint satisfaction approach, which is significantly faster for industrial-scale scheduling.

### How to Switch:
The `flow_pipeline` function in `main.py` accepts a `solver_mode` parameter. Simply passing `"academic"` vs `"performance"` toggles the engine.

---

## 🧪 2. Extending the Heuristic Engine (DDR)
The DDR engine in `app/ddr_heuristic.py` is designed to be modular.

### Adding a New Dispatching Rule:
1.  **Define the Selection Logic:** Create a new private function (e.g., `_select_new_rule`).
2.  **Register the Rule:** Add a constant at the top of the file.
3.  **Update `_apply_rule`:** Add your new rule to the `if/elif` block.

```python
def _select_my_custom_rule(remaining, eligible, machine_end, last_job, P, S, D, m):
    # Your logic here (e.g., balance machine workload)
    return j_star, k_star
```

---

## 📊 3. Decision Analysis Customization
The TOPSIS logic in `app/topsis.py` can be modified to include more criteria (e.g., Machine Utilization).
*   **Normalization:** We use $min/x$ for cost criteria. If you add a benefit criterion (where higher is better), use $x/max$.
*   **AUGMECON Grids:** The number of grid points in `app/augmecon.py` determines the density of the Pareto set. Increasing `grid_T` and `grid_L` provides more solutions but increases run time.

---

## 🎨 4. Reporting & PDF Generation
The reporting engine in `app/utils.py` uses raw HTML/CSS templates.
*   **Gantt Chunking:** Controlled by `CHUNK_SIZE` in `get_html_gantt`.
*   **Row Merging:** Implemented via the `rowspan` logic in `get_html_summary_table`. It calculates the number of jobs per machine before rendering the table rows.

---
## 🛡 5. Health Check Mechanism
If you add a new dependency (e.g., `matplotlib`), remember to update `system_health_check()` in `app/utils.py` to ensure the environment remains verified.

---
*ITU Industrial Engineering - Technical Maintenance Guide*
