"""
report_analytics.py
--------------------
Rapor atlası için tablo 14-19 verilerini üreten yardımcı katman.

Bu modül, mevcut veri üreticisini ve DDR çözümlerini kullanarak:
 - aylık büyük örnek özetlerini,
 - 1B k-means bazlı talep kümelendirmesini,
 - tekli DDR kuralları için özet + ANOVA/Tukey çıktısını,
 - kombine DDR kuralları için özet + ANOVA/regresyon çıktısını
tek bir JSON dostu bundle içinde toplar.
"""
from __future__ import annotations

from collections import defaultdict
from dataclasses import asdict
from functools import lru_cache
from math import sqrt
from statistics import mean, pstdev
from typing import Any

import numpy as np
import pandas as pd
from statsmodels.formula.api import ols
from statsmodels.stats.anova import anova_lm
from statsmodels.stats.multicomp import pairwise_tukeyhsd

from app.data_generator import generate_problem
from app.ddr_heuristic import run_all_rules


MONTH_LABELS = [
    "2019-01", "2019-02", "2019-03", "2019-04", "2019-05", "2019-06",
    "2019-07", "2019-08", "2019-09", "2019-10", "2019-11", "2019-12",
    "2020-01", "2020-02", "2020-03", "2020-04", "2020-05", "2020-06",
]

MONTH_JOB_COUNTS = [
    244, 248, 252, 256, 260, 264, 268, 272, 276,
    280, 284, 288, 292, 295, 298, 294, 289, 283,
]

MONTH_SCENARIOS = ["low"] * 9 + ["high"] * 9


def _safe_std(values: list[float]) -> float:
    return float(pstdev(values)) if len(values) > 1 else 0.0


def _average_pair(values: list[float]) -> float:
    return float(mean(values)) if values else 0.0


def _setup_stats(problem: dict) -> tuple[float, float]:
    family = problem["family"]
    setup = problem["S"]
    meta = problem["metadata"]
    n = meta["n"]
    m = meta["m"]

    same_values: list[float] = []
    diff_values: list[float] = []

    for i in range(n):
        for j in range(n):
            if i == j:
                continue
            same_family = family[str(i)] == family[str(j)]
            for k in range(m):
                value = float(setup[str(i)][str(j)][str(k)])
                if same_family:
                    same_values.append(value)
                else:
                    diff_values.append(value)

    return _average_pair(same_values), _average_pair(diff_values)


def _eligibility_ratio(problem: dict) -> float:
    np_matrix = problem["NP"]
    meta = problem["metadata"]
    n = meta["n"]
    m = meta["m"]
    eligible = 0
    total = n * m
    for j in range(n):
        for k in range(m):
            eligible += 1 if int(np_matrix[str(j)][str(k)]) == 1 else 0
    return eligible / total if total else 0.0


def _instance_summary(problem: dict, month_label: str, scenario: str) -> dict[str, Any]:
    meta = problem["metadata"]
    n = int(meta["n"])
    m = int(meta["m"])
    P = problem["P"]
    D = problem["D"]

    eligible_p = [
        float(P[str(j)][str(k)])
        for j in range(n)
        for k in range(m)
        if float(P[str(j)][str(k)]) < 9999
    ]
    due_dates = [float(D[str(j)]) for j in range(n)]
    same_setup, diff_setup = _setup_stats(problem)

    return {
        "month": month_label,
        "scenario": scenario,
        "seed": int(meta["seed"]),
        "jobs": n,
        "machines": m,
        "families": len(set(problem["family"].values())),
        "eligible_ratio": round(_eligibility_ratio(problem), 4),
        "avg_processing": round(_average_pair(eligible_p), 4),
        "avg_due_date": round(_average_pair(due_dates), 4),
        "min_due_date": round(min(due_dates), 4) if due_dates else 0.0,
        "max_due_date": round(max(due_dates), 4) if due_dates else 0.0,
        "avg_setup_same": round(same_setup, 4),
        "avg_setup_diff": round(diff_setup, 4),
        "total_due": round(sum(due_dates), 4),
    }


def _kmeans_1d(values: list[float], max_iter: int = 50) -> dict[str, Any]:
    if not values:
        return {"centers": [], "labels": [], "silhouette": 0.0, "clusters": []}

    centers = [min(values), max(values)]
    labels = [0] * len(values)

    for _ in range(max_iter):
        new_labels = []
        for value in values:
            distances = [abs(value - center) for center in centers]
            new_labels.append(0 if distances[0] <= distances[1] else 1)

        new_centers = []
        for cluster_id in (0, 1):
            cluster_values = [value for value, label in zip(values, new_labels) if label == cluster_id]
            if cluster_values:
                new_centers.append(float(mean(cluster_values)))
            else:
                new_centers.append(float(centers[cluster_id]))

        if new_labels == labels and all(abs(a - b) < 1e-9 for a, b in zip(new_centers, centers)):
            break

        labels = new_labels
        centers = new_centers

    # Küçük merkez önce gelsin ki düşük/yüksek mantığı okunabilir olsun
    ordered = sorted(enumerate(centers), key=lambda item: item[1])
    remap = {old: new for new, (old, _) in enumerate(ordered)}
    centers = [float(center) for _, center in ordered]
    labels = [remap[label] for label in labels]

    clusters = []
    silhouettes = []
    for cluster_id in (0, 1):
        members = [idx for idx, label in enumerate(labels) if label == cluster_id]
        cluster_values = [values[idx] for idx in members]
        if not cluster_values:
            clusters.append({"cluster_id": cluster_id, "count": 0, "center": None, "members": []})
            continue

        for idx in members:
            same = [abs(values[idx] - values[j]) for j in members if j != idx]
            a = float(mean(same)) if same else 0.0
            other_cluster = 1 - cluster_id
            other_members = [j for j, label in enumerate(labels) if label == other_cluster]
            other = [abs(values[idx] - values[j]) for j in other_members]
            b = float(mean(other)) if other else 0.0
            s = 0.0 if max(a, b) == 0 else (b - a) / max(a, b)
            silhouettes.append(s)

        clusters.append(
            {
                "cluster_id": cluster_id,
                "count": len(members),
                "center": round(centers[cluster_id], 4),
                "members": members,
            }
        )

    return {
        "centers": [round(center, 4) for center in centers],
        "labels": labels,
        "clusters": clusters,
        "silhouette": round(float(mean(silhouettes)) if silhouettes else 0.0, 4),
    }


def _build_dataframe(records: list[dict[str, Any]]) -> pd.DataFrame:
    df = pd.DataFrame(records)
    if df.empty:
        return df
    for column in ("Cmax", "T", "L"):
        if column in df.columns:
            if column == "L":
                df[column] = df[column].astype(int)
            else:
                df[column] = df[column].astype(float)
    return df


def _anova_rows(model_df: pd.DataFrame, formula: str, metric: str) -> list[dict[str, Any]]:
    if model_df.empty:
        return []
    
    # Eğer tek bir senaryo varsa etkileşim terimi (interaction) hesaplanamaz
    # Formülü veriye göre basitleştirelim
    if "scenario" in formula and model_df["scenario"].nunique() < 2:
        formula = formula.replace(" * C(scenario)", "").replace(" + C(scenario)", "")
    
    try:
        model = ols(formula, data=model_df).fit()
        table = anova_lm(model, typ=2).reset_index()
        table = table.rename(columns={"index": "term", "sum_sq": "sum_sq", "df": "df", "F": "F", "PR(>F)": "p_value"})
        table["metric"] = metric
        
        # NaN ve Inf değerlerini JSON dostu hale getir (None)
        table = table.replace([np.nan, np.inf, -np.inf], None)
        
        return table.to_dict(orient="records")
    except Exception as exc:
        import traceback
        print(f"ANOVA Error ({metric}): {exc}\n{traceback.format_exc()}")
        return [{"metric": metric, "error": str(exc)}]


def _tukey_rows(df: pd.DataFrame, metric: str, group_col: str) -> list[dict[str, Any]]:
    if df.empty or df[group_col].nunique() < 2:
        return []
    try:
        result = pairwise_tukeyhsd(endog=df[metric].astype(float), groups=df[group_col].astype(str), alpha=0.05)
        rows = []
        for row in result._results_table.data[1:]:
            # NaN kontrolü
            def clean(val):
                if isinstance(val, (float, np.float64, np.float32)) and (np.isnan(val) or np.isinf(val)):
                    return None
                return val

            rows.append(
                {
                    "metric": metric,
                    "group1": row[0],
                    "group2": row[1],
                    "mean_diff": clean(float(row[2])),
                    "p_adj": clean(float(row[3])),
                    "lower": clean(float(row[4])),
                    "upper": clean(float(row[5])),
                    "reject": bool(row[6]),
                }
            )
        return rows
    except Exception as exc:
        return [{"metric": metric, "error": str(exc)}]


def _summarize_rule_groups(df: pd.DataFrame) -> list[dict[str, Any]]:
    if df.empty:
        return []
    grouped = (
        df.groupby(["scenario", "rule_name"], as_index=False)
        .agg(
            runs=("rule_name", "size"),
            mean_Cmax=("Cmax", "mean"),
            std_Cmax=("Cmax", "std"),
            mean_T=("T", "mean"),
            std_T=("T", "std"),
            mean_L=("L", "mean"),
            std_L=("L", "std"),
        )
    )
    grouped["std_Cmax"] = grouped["std_Cmax"].fillna(0.0)
    grouped["std_T"] = grouped["std_T"].fillna(0.0)
    grouped["std_L"] = grouped["std_L"].fillna(0.0)
    grouped = grouped.sort_values(["scenario", "rule_name"])
    return grouped.to_dict(orient="records")


def _parse_combined_rule(rule_name: str) -> dict[str, Any]:
    import re

    match = re.match(r"\[(.+?) & (.+?): (\d+)\]", rule_name)
    if not match:
        return {"pair_label": rule_name, "switch_time": None, "first_rule": None, "second_rule": None}
    first_rule, second_rule, switch_time = match.groups()
    return {
        "pair_label": f"[{first_rule} & {second_rule}]",
        "switch_time": int(switch_time),
        "first_rule": first_rule,
        "second_rule": second_rule,
    }


def _best_rules_by_metric(df: pd.DataFrame, group_col: str) -> dict[str, list[dict[str, Any]]]:
    best = {}
    for scenario in sorted(df["scenario"].unique()):
        scenario_df = df[df["scenario"] == scenario]
        best[scenario] = []
        for metric in ("Cmax", "T", "L"):
            grouped = (
                scenario_df.groupby(group_col, as_index=False)[metric]
                .mean()
                .sort_values(metric, ascending=True)
            )
            if grouped.empty:
                continue
            top_row = grouped.iloc[0]
            best[scenario].append(
                {
                    "metric": metric,
                    "rule_name": top_row[group_col],
                    "mean_value": float(top_row[metric]),
                }
            )
    return best


@lru_cache(maxsize=8)
def build_report_bundle(seed: int = 2024, months: int = 6) -> dict[str, Any]:
    """Tablo 14-19 için tek bir JSON dostu bundle üretir."""
    monthly_records: list[dict[str, Any]] = []
    rule_records: list[dict[str, Any]] = []

    for idx, (month_label, jobs, scenario) in enumerate(zip(MONTH_LABELS[:months], MONTH_JOB_COUNTS[:months], MONTH_SCENARIOS[:months])):
        problem = generate_problem(
            n=jobs,
            m=10,
            seed=seed + idx,
            n_families=26,
            np_ratio=0.2,
            scenario=scenario,
        )
        monthly_records.append(_instance_summary(problem, month_label, scenario))

        P = {int(j): {int(k): problem["P"][str(j)][str(k)] for k in range(10)} for j in range(jobs)}
        S = {int(i): {int(j): {int(k): problem["S"][str(i)][str(j)][str(k)] for k in range(10)} for j in range(jobs)} for i in list(range(jobs)) + [-1]}
        D = {int(j): float(problem["D"][str(j)]) for j in range(jobs)}
        NP = {int(j): {int(k): problem["NP"][str(j)][str(k)] for k in range(10)} for j in range(jobs)}

        ddr_results = run_all_rules(jobs, 10, P, S, D, NP, verbose=False)
        for result in ddr_results:
            parsed = _parse_combined_rule(result.rule_name)
            rule_records.append(
                {
                    "month": month_label,
                    "scenario": scenario,
                    "rule_name": result.rule_name,
                    "pair_label": parsed["pair_label"],
                    "switch_time": parsed["switch_time"],
                    "rule_kind": "single" if parsed["switch_time"] is None else "combined",
                    "Cmax": float(result.Cmax),
                    "T": float(result.total_tardiness),
                    "L": int(result.num_tardy),
                    "solve_time": float(result.solve_time),
                }
            )

    instances_df = _build_dataframe(monthly_records)
    results_df = pd.DataFrame(rule_records)
    if not results_df.empty:
        results_df["Cmax"] = results_df["Cmax"].astype(float)
        results_df["T"] = results_df["T"].astype(float)
        results_df["L"] = results_df["L"].astype(int)

    single_df = results_df[results_df["rule_kind"] == "single"].copy() if not results_df.empty else pd.DataFrame()
    combined_df = results_df[results_df["rule_kind"] == "combined"].copy() if not results_df.empty else pd.DataFrame()

    table14 = {
        "instances": monthly_records,
        "summary": {
            "months": len(monthly_records),
            "job_range": [int(instances_df["jobs"].min()) if not instances_df.empty else 0, int(instances_df["jobs"].max()) if not instances_df.empty else 0],
            "scenario_counts": instances_df.groupby("scenario").size().to_dict() if not instances_df.empty else {},
            "avg_jobs": round(float(instances_df["jobs"].mean()), 2) if not instances_df.empty else 0.0,
            "avg_processing": round(float(instances_df["avg_processing"].mean()), 4) if not instances_df.empty else 0.0,
            "avg_setup_same": round(float(instances_df["avg_setup_same"].mean()), 4) if not instances_df.empty else 0.0,
            "avg_setup_diff": round(float(instances_df["avg_setup_diff"].mean()), 4) if not instances_df.empty else 0.0,
        },
    }

    demand_values = [float(item["jobs"]) for item in monthly_records]
    cluster_info = _kmeans_1d(demand_values)
    cluster_labels = ["low" if label == 0 else "high" for label in cluster_info["labels"]]
    table15 = {
        "points": [
            {
                "month": item["month"],
                "jobs": item["jobs"],
                "scenario": item["scenario"],
                "cluster": cluster_labels[idx],
            }
            for idx, item in enumerate(monthly_records)
        ],
        "clusters": [
            {
                "label": "low",
                "center_jobs": cluster_info["centers"][0] if cluster_info["centers"] else None,
                "count": cluster_info["clusters"][0]["count"] if cluster_info["clusters"] else 0,
                "members": [monthly_records[i]["month"] for i in cluster_info["clusters"][0]["members"]] if cluster_info["clusters"] else [],
            },
            {
                "label": "high",
                "center_jobs": cluster_info["centers"][1] if len(cluster_info["centers"]) > 1 else None,
                "count": cluster_info["clusters"][1]["count"] if len(cluster_info["clusters"]) > 1 else 0,
                "members": [monthly_records[i]["month"] for i in cluster_info["clusters"][1]["members"]] if len(cluster_info["clusters"]) > 1 else [],
            },
        ],
        "silhouette": cluster_info["silhouette"],
    }

    table16_summary = _summarize_rule_groups(single_df) if not single_df.empty else []
    table16_anova = {
        metric: _anova_rows(single_df.rename(columns={metric: metric}), f"{metric} ~ C(rule_name) * C(scenario)", metric)
        for metric in ("Cmax", "T", "L")
    } if not single_df.empty else {}
    table16_tukey = {
        scenario: {
            metric: _tukey_rows(single_df[single_df["scenario"] == scenario].copy(), metric, "rule_name")
            for metric in ("Cmax", "T", "L")
        }
        for scenario in single_df["scenario"].unique()
    } if not single_df.empty else {}

    combined_df = combined_df.copy()
    if not combined_df.empty:
        combined_df["switch_time"] = combined_df["switch_time"].astype(int)

    table17_anova = {
        metric: _anova_rows(
            combined_df,
            f"{metric} ~ C(pair_label) * C(scenario) * C(switch_time)",
            metric,
        )
        for metric in ("Cmax", "T", "L")
    } if not combined_df.empty else {}

    table18_regression = {}
    if not combined_df.empty:
        for metric in ("Cmax", "T", "L"):
            try:
                model = ols(f"{metric} ~ C(pair_label) + C(scenario) + C(switch_time)", data=combined_df).fit()
                
                def clean_float(val):
                    if val is None or (isinstance(val, float) and (np.isnan(val) or np.isinf(val))):
                        return 0.0
                    return float(val)

                table18_regression[metric] = {
                    "intercept": clean_float(model.params.get("Intercept")),
                    "coefficients": {str(key): clean_float(value) for key, value in model.params.items() if key != "Intercept"},
                    "r_squared": clean_float(model.rsquared),
                    "adj_r_squared": clean_float(model.rsquared_adj),
                }
            except Exception as exc:
                table18_regression[metric] = {"error": str(exc)}

    table19_best = _best_rules_by_metric(combined_df, "pair_label") if not combined_df.empty else {}
    table19_tukey = {
        scenario: {
            metric: _tukey_rows(
                combined_df[(combined_df["scenario"] == scenario) & (combined_df["pair_label"].isin([item["rule_name"] for item in table19_best.get(scenario, [])]))].copy(),
                metric,
                "pair_label",
            )
            for metric in ("Cmax", "T", "L")
        }
        for scenario in combined_df["scenario"].unique()
    } if not combined_df.empty else {}

    return {
        "table14": table14,
        "table15": table15,
        "table16": {
            "summary": table16_summary,
            "anova": table16_anova,
            "tukey": table16_tukey,
        },
        "table17": {
            "anova": table17_anova,
        },
        "table18": {
            "regression": table18_regression,
        },
        "table19": {
            "best_rules": table19_best,
            "tukey": table19_tukey,
        },
    }


def _format_table(headers: list[str], rows: list[list[Any]]) -> str:
    if not rows:
        return ""
    header_line = "| " + " | ".join(headers) + " |"
    divider = "| " + " | ".join(["---"] * len(headers)) + " |"
    body = []
    for row in rows:
        body.append("| " + " | ".join(str(value) for value in row) + " |")
    return "\n".join([header_line, divider, *body])


def render_report_bundle_markdown(bundle: dict[str, Any], max_rows: int = 8) -> str:
    """Report bundle çıktısını PDF/Markdown ekine dönüştürür."""
    lines: list[str] = []

    table14 = bundle.get("table14", {})
    table15 = bundle.get("table15", {})
    table16 = bundle.get("table16", {})
    table17 = bundle.get("table17", {})
    table18 = bundle.get("table18", {})
    table19 = bundle.get("table19", {})

    lines.append("## Rapor Atlası Ekleri: Tablo 14-19\n")

    lines.append("### Tablo 14 - Büyük Örnek Özeti\n")
    summary14 = table14.get("summary", {})
    lines.append(
        f"Ay sayısı: {summary14.get('months', 0)} | İş aralığı: {summary14.get('job_range', [0, 0])[0]}-{summary14.get('job_range', [0, 0])[1]} | "
        f"Ortalama iş: {summary14.get('avg_jobs', 0)} | Ortalama işlem: {summary14.get('avg_processing', 0)} | "
        f"Ortalama setup (aynı): {summary14.get('avg_setup_same', 0)} | Ortalama setup (farklı): {summary14.get('avg_setup_diff', 0)}\n"
    )
    rows14 = [
        [row.get("month"), row.get("scenario"), row.get("jobs"), row.get("families"), f"{row.get('eligible_ratio', 0) * 100:.1f}%", row.get("avg_processing"), row.get("avg_setup_same"), row.get("avg_setup_diff")]
        for row in table14.get("instances", [])[:max_rows]
    ]
    if rows14:
        lines.append(_format_table(["Ay", "Senaryo", "İş", "Aile", "Elig%", "Avg P", "Setup S", "Setup D"], rows14))
        lines.append("")

    lines.append("### Tablo 15 - Talep Kümeleme\n")
    lines.append(f"Silhouette: {table15.get('silhouette', 0)}\n")
    rows15 = [
        [point.get("month"), point.get("jobs"), point.get("scenario"), point.get("cluster")]
        for point in table15.get("points", [])[:max_rows]
    ]
    if rows15:
        lines.append(_format_table(["Ay", "İş", "Senaryo", "Küme"], rows15))
        lines.append("")

    lines.append("### Tablo 16 - Tekli DDR Sonuçları\n")
    rows16 = [
        [row.get("scenario"), row.get("rule_name"), row.get("runs"), f"{row.get('mean_Cmax', 0):.2f}", f"{row.get('mean_T', 0):.2f}", f"{row.get('mean_L', 0):.2f}"]
        for row in table16.get("summary", [])[:max_rows]
    ]
    if rows16:
        lines.append(_format_table(["Senaryo", "Kural", "Runs", "Mean Cmax", "Mean T", "Mean L"], rows16))
        lines.append("")

    lines.append("### Tablo 17 - ANOVA Özeti\n")
    anova17 = table17.get("anova", {})
    rows17 = []
    for metric, rows in anova17.items():
        for row in rows[:max_rows]:
            if row.get("term") and row.get("term") != "Residual":
                rows17.append([metric, row.get("term"), row.get("df"), row.get("F"), row.get("p_value")])
    if rows17:
        lines.append(_format_table(["Metric", "Terim", "df", "F", "p"], rows17))
        lines.append("")

    lines.append("### Tablo 18 - Regresyon Özeti\n")
    rows18 = []
    for metric, payload in table18.get("regression", {}).items():
        if "error" in payload:
            rows18.append([metric, "error", payload["error"]])
        else:
            rows18.append([metric, f"R²={payload.get('r_squared', 0):.4f}", f"Adj R²={payload.get('adj_r_squared', 0):.4f}"])
    if rows18:
        lines.append(_format_table(["Metric", "Model", "Detail"], rows18))
        lines.append("")

    lines.append("### Tablo 19 - Etkili Kombine Kurallar\n")
    rows19 = []
    for scenario, rows in table19.get("best_rules", {}).items():
        for row in rows[:max_rows]:
            rows19.append([scenario, row.get("metric"), row.get("rule_name"), f"{row.get('mean_value', 0):.2f}"])
    if rows19:
        lines.append(_format_table(["Senaryo", "Metric", "Kural", "Ortalama"], rows19))
        lines.append("")

    return "\n".join(lines)