# UPMSP Scheduling Project - Submission Manifest

This document provides a structured roadmap of all files and deliverables included in the **Unrelated Parallel Machine Scheduling Problem (UPMSP)** project for **END505E**.

---

## 📂 1. Source Code (`app/`)
*Standardized, bug-free implementation of the decision support system.*

| File | Purpose | Key Features |
| :--- | :--- | :--- |
| `main.py` | **Main Entry Point** | CLI Menu, Hybrid Turkish/English UI, Pipeline Management. |
| `solver_milp.py` | **Academic Solver** | %100 Paper-aligned MILP equations using Google OR-Tools SCIP. |
| `solver.py` | **Performance Solver** | High-speed industrial CP-SAT engine. |
| `ddr_heuristic.py`| **Heuristic Engine** | 39 Dynamic Dispatching Rule configurations (SCT, LPT, EDD). |
| `augmecon.py` | **Pareto Analysis** | Implementation of the ε-constraint method for multi-objective optimization. |
| `topsis.py` | **Ranking System** | TOPSIS-based decision making for selecting the best rule configuration. |
| `utils.py` | **Reporting Engine** | Time-phased Gantt charts (250-unit chunks) and row-merged tables. |
| `data_generator.py`| **Data Synthesizer** | Replicates Article scenarios (Low/High Demand) with family-based setups. |

---

## 📜 2. Documentation & Reports
*Academic theory, experimental results, and user guidance.*

| File | Type | Description |
| :--- | :--- | :--- |
| `11_UPMSP_Proje_Raporu_Final.md` | **Academic Report** | Full theoretical analysis, LaTeX formulas, and comparative data. |
| `12_DENEYSEL_SONUCLAR_RAPORU.pdf`| **Result Output** | High-fidelity visualization of the 250-job article simulation. |
| `USER_MANUAL.md` | **Guide** | Instructions for system operation and metric interpretation. |
| `09_makale_ders_eslestirme.md` | **Academic Map** | Explicit links between lecture chapters and project features. |
| `10_uygulama_teorik_akis.md` | **Architecture** | Visual flowcharts (Mermaid/ASCII) of the data and logic pipeline. |
| `FINAL_AGENT_AUDIT_REPORT.md` | **QA Audit** | Final verification sign-off from the 5-agent simulation team. |
| `07_sunum_hazirlama_rehberi.md`| **Presentation** | Slide-by-slide plan with integrated GAP analysis data points. |

---

## 🛠 3. Technical Verification Tools
*Scripts used to ensure mathematical and logical accuracy.*

*   `verify_calculations.py`: Validates heuristic steps against the article's numerical examples.
*   `test_runs.py`: Conducts stability tests on large-scale (n=400) instances.
| `requirements.txt` | **Dependencies** | Lists all necessary Python libraries (OR-Tools, Tabulate, etc.). |

---

## 🏁 Final Status: READY FOR SUBMISSION
The project is verified to be technically robust, academically aligned, and visually professional. All remaining tasks have been completed.

**ITU Industrial Engineering - END505E**
