# UPMSP Scheduling Project (END505E)

This project implements the Unrelated Parallel Machine Scheduling Problem (UPMSP) with Sequence-Dependent Setup Times (SDST) based on the article:
*"A multi-objective production scheduling model and dynamic dispatching rules for unrelated parallel machines with sequence-dependent set-up times"* (Tai et al., 2024).

## Features
- **Exact Solver:** Uses Google OR-Tools CP-SAT to solve MILP models (M1, M2, M3).
- **Multi-Objective Optimization:** Implements the **AUGMECON** (Augmented ε-constraint) method to find Pareto-optimal solutions.
- **Heuristics:** Implements **Dynamic Dispatching Rules (DDR)** with 39 different configurations (SCT, SC-LPT, SC-EDD and their combinations).
- **MCDM:** Includes **TOPSIS** analysis to select the best compromise solution based on decision-maker weights.
- **Reporting:** Automatic GANTT chart visualization and PDF report generation.

## Project Structure
- `app/`: Python source code.
  - `solver.py`: CP-SAT model implementation.
  - `ddr_heuristic.py`: Heuristic algorithm implementation.
  - `augmecon.py`: Pareto frontier generation.
  - `topsis.py`: Multi-criteria decision analysis.
- `data/`: JSON input data and results cache.
- `ders_notlari/`: Course reference materials.

## Installation
Ensure you have Python 3.10+ installed.
```bash
pip install -r requirements.txt
```

## Usage
Run the main terminal application:
```bash
python app/main.py
```
From the menu, you can:
- **[0]** Run the full pipeline (Generate data -> DDR -> TOPSIS -> AUGMECON).
- **[1]** Generate new problem instances.
- **[2]** Solve using MILP (Small instances recommended).
- **[3]** Run all 39 DDR configurations.
- **[6]** Perform Pareto analysis using AUGMECON.

## Technical Notes
We have identified and fixed several typographical errors found in the original article's mathematical formulation:
- **Eq (9):** Fixed the summation index consistency for machine eligibility.
- **Eq (16):** Fixed the equality to an inequality (`<=`) for correct tardiness logic.
- **Heuristic Selection:** Fixed the missing cumulative time ($C_{i,k}$) in the rule selection criteria.
