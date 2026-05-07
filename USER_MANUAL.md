# UPMSP Decision Support System - User Manual

Welcome to the **Unrelated Parallel Machine Scheduling Problem (UPMSP)** solver and reporter. This system is designed based on the latest academic research (Tai et al., 2024) and optimized for both precision and performance.

---

## 🚀 Quick Start
To launch the system, use the following command in your terminal:
```bash
python app/main.py
```

### Main Menu Navigation
1.  **[1] Academic Flow:** Uses the **SCIP** solver to verify the exact mathematical equations from the paper. Recommended for small instances (n < 12).
2.  **[1.1] Article Simulation:** Runs the full-scale simulation described in Section 5.2 of the paper (~250 jobs, 10 machines). Generates a high-fidelity PDF report.
3.  **[2] Performance Flow:** Uses the **CP-SAT** engine for high-speed industrial solving. Can handle much larger instances than academic MILP.
4.  **[8] Decision Analysis:** 
    *   **TOPSIS:** Ranks the 39 heuristic configurations based on your priority weights (e.g., is minimizing delay more important than speed?).
    *   **AUGMECON:** Generates a Pareto Set of solutions, allowing you to choose between different trade-offs of Makespan and Tardiness.

---

## 📊 Understanding the Metrics
The system uses academic notation standardized with the research paper:

*   **$C_{max}$ (Makespan):** The total time required to complete all jobs. Lower is better (higher productivity).
*   **Total Tardiness ($T$):** The sum of all delays beyond the promised due dates. Lower is better (higher customer satisfaction).
*   **Number of Tardy Jobs ($L$):** The total count of jobs that finished late. Lower is better (reliability).
*   **$P_{j,k}$:** Processing time of job $j$ on machine $k$.
*   **$S_{i,j,k}$:** Setup time required on machine $k$ when transitioning from job $i$ to job $j$.

---

## 📄 Reporting Features
The system generates a PDF report (**12_DENEYSEL_SONUCLAR_RAPORU.pdf**) with:
*   **Row-Merged Tables:** Machines are grouped vertically for better visual hierarchy.
*   **Time-Phased Gantt:** The timeline is split into 250-unit chunks. If a job spans across a chunk boundary, it is correctly carried over to the next row.
*   **Empty Machine Handling:** Even machines with zero workload are listed to ensure a complete system overview.

---

## 🛠 Troubleshooting
*   **KeyError in Option 4:** Ensure the job size is small. MILP models are complex and require high memory for large n.
*   **PDF Generation Error:** Ensure `md-to-pdf` is installed via npm (`npm install -g md-to-pdf`).
*   **Optimization Timeout:** You can increase the "Saniye" (Seconds) limit in individual solver flows to allow the engines more time to find the optimal solution.

---
*Developed for END505E - ITU Industrial Engineering*
