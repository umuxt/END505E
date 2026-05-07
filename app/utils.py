"""
utils.py
--------
Terminal arayüzü için renklendirme ve Gantt şeması çizdirme araçları.
"""

import os
import time

class Colors:
    HEADER = '\033[95m'
    MAGENTA= '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def get_html_summary_table(schedule: dict, instance: dict) -> str:
    """
    Çizelgeleme sonuçlarını detaylı bir tablo (Tezgâh, İş, Pⱼ,ₖ, Sᵢ,ⱼ,ₖ, Cⱼ, Dⱼ, Lⱼ, Tⱼ) olarak döndürür.
    Makale notasyonuna (j, k, P, S, C, D, L, T) ve ders notlarına uyumlu hale getirilmiştir.
    """
    P = instance.get("P", {})
    S = instance.get("S", {})
    D = instance.get("D", {})
    
    html = [
        "<div style='margin-top: 20px; font-size: 12px;'>",
        "  <h2 style='color: #2c3e50; border-bottom: 2px solid #34495e;'>Detaylı Çizelgeleme Analizi (Makale Notasyonu)</h2>",
        "  <p style='background: #f8f9fa; padding: 10px; border-left: 5px solid #3498db;'>",
        "    <strong>Notasyon ve Terminoloji (Legend):</strong> <br>",
        "    • <strong>Tezgâh (k):</strong> Makale notasyonunda <i>Machine (k)</i>, ders notlarında <i>Tezgâh (T)</i>. <br>",
        "    • <strong>İş (j):</strong> Makale notasyonunda <i>Job (j)</i>, ders notlarında <i>İş (I)</i>. <br>",
        "    • <strong>Pⱼ,ₖ:</strong> İşlem Süresi (Processing Time) <br>",
        "    • <strong>Sᵢ,ⱼ,ₖ:</strong> Sıra ve Tezgâh Bağımlı Hazırlık Süresi (Sequence & Machine-Dependent Setup Time) <br>",
        "    • <strong>Cⱼ:</strong> Tamamlanma Zamanı (Completion Time) <br>",
        "    • <strong>Dⱼ:</strong> Teslim Tarihi (Due Date) <br>",
        "    • <strong>Lⱼ:</strong> Gecikme (Lateness) [Cⱼ - Dⱼ] <br>",
        "    • <strong>Tⱼ (eⱼ⁺):</strong> Teslim Gecikmesi Süresi (Tardiness) [max(0, Lⱼ)]",
        "  </p>",

        "  <table style='width: 100%; border-collapse: collapse; margin-top: 10px;'>",
        "    <thead>",
        "      <tr style='background: #34495e; color: white; text-align: left;'>",
        "        <th style='padding: 8px; border: 1px solid #ddd; text-align: center;'>Tezgâh (k)</th>",
        "        <th style='padding: 8px; border: 1px solid #ddd;'>İş (j)</th>",
        "        <th style='padding: 8px; border: 1px solid #ddd;'>Pⱼ,ₖ</th>",
        "        <th style='padding: 8px; border: 1px solid #ddd;'>Sᵢ,ⱼ,ₖ</th>",
        "        <th style='padding: 8px; border: 1px solid #ddd;'>P+S</th>",
        "        <th style='padding: 8px; border: 1px solid #ddd;'>Cⱼ</th>",
        "        <th style='padding: 8px; border: 1px solid #ddd;'>Dⱼ</th>",
        "        <th style='padding: 8px; border: 1px solid #ddd;'>Lⱼ</th>",
        "        <th style='padding: 8px; border: 1px solid #ddd;'>eⱼ⁺</th>",
        "      </tr>",
        "    </thead>",
        "    <tbody>"
    ]

    for k in sorted(schedule.keys()):
        jobs = schedule[k]
        num_jobs_on_m = len(jobs)
        
        if num_jobs_on_m == 0:
            # Handle machine with no jobs
            bg = "#ffffff"
            html.append(f"      <tr style='background: {bg};'>")
            html.append(f"        <td style='padding: 6px; border: 1px solid #ddd; text-align: center; background: #ecf0f1; font-weight: bold;'>M{k}</td>")
            html.append("        <td colspan='8' style='padding: 6px; border: 1px solid #ddd; text-align: center; color: #7f8c8d; font-style: italic;'>No Jobs Assigned</td>")
            html.append("      </tr>")
            continue

        prev_j = -1
        for i, (j, start, end) in enumerate(jobs):
            pj = P.get(str(j), {}).get(str(k), P.get(j, {}).get(k, 0))
            setup = S.get(str(prev_j), {}).get(str(j), {}).get(str(k), 
                    S.get(prev_j, {}).get(j, {}).get(k, 0))
            
            dj = D.get(str(j), D.get(j, 0))
            ci = end
            li = ci - dj
            ti = max(0, li)
            
            bg = "#ffffff" if i % 2 == 0 else "#f9f9f9"
            tardiness_style = "color: #e74c3c; font-weight: bold;" if ti > 0 else "color: #27ae60;"
            
            html.append(f"      <tr style='background: {bg};'>")
            
            # Rowspan for Machine column (Centered)
            if i == 0:
                html.append(f"        <td rowspan='{num_jobs_on_m}' style='padding: 6px; border: 1px solid #ddd; text-align: center; vertical-align: middle; background: #ecf0f1; font-weight: bold;'>M{k}</td>")
            
            html.append(f"        <td style='padding: 6px; border: 1px solid #ddd;'>J{j}</td>")
            html.append(f"        <td style='padding: 6px; border: 1px solid #ddd;'>{pj:.2f}</td>")
            html.append(f"        <td style='padding: 6px; border: 1px solid #ddd;'>{setup:.2f}</td>")
            html.append(f"        <td style='padding: 6px; border: 1px solid #ddd;'>{pj+setup:.2f}</td>")
            html.append(f"        <td style='padding: 6px; border: 1px solid #ddd;'>{ci:.2f}</td>")
            html.append(f"        <td style='padding: 6px; border: 1px solid #ddd;'>{dj:.2f}</td>")
            html.append(f"        <td style='padding: 6px; border: 1px solid #ddd;'>{li:.2f}</td>")
            html.append(f"        <td style='padding: 6px; border: 1px solid #ddd; {tardiness_style}'>{ti:.2f}</td>")
            html.append("      </tr>")
            prev_j = j

    html.append("    </tbody>")
    html.append("  </table>")
    html.append(f"  <div class='report-footer' style='margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; font-size: 10px; color: #bdc3c7; text-align: right;'>UPMSP DSS v1.0 | Academic Release | {time.strftime('%Y-%m-%d')}</div>")
    html.append("</div>")
    
    return "\n".join(html)


def get_html_gantt(schedule: dict, cmax: float, families: dict) -> str:
    """PDF için geniş, detaylı ve zaman dilimli (chunked) bir HTML Gantt şeması üretir."""
    if cmax <= 0: return "<p>Çizelgelenmiş iş yok.</p>"
    
    # Çok büyük süreler için parçalama limiti (her 250 saat bir blok)
    CHUNK_SIZE = 250.0
    num_chunks = int(cmax // CHUNK_SIZE) + (1 if cmax % CHUNK_SIZE > 0 else 0)
    
    html = [
        "<style>",
        "  @page { size: A4 landscape; margin: 0.5cm; }",
        "  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }",
        "  .chunk-container { margin-bottom: 30px; page-break-inside: avoid; }",
        "  .gantt-wrapper { width: 100%; border: 1px solid #ccc; background: #fff; box-sizing: border-box; }",
        "  .m-row { display: flex; border-bottom: 1px solid #eee; position: relative; height: 40px; }",
        "  .m-label { width: 50px; background: #34495e; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; flex-shrink: 0; z-index: 10; border-right: 1px solid #2c3e50; }",
        "  .gantt-data { position: relative; flex-grow: 1; background: #fdfdfd; overflow: hidden; }",
        "  .block { position: absolute; height: 26px; top: 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8px; line-height: 1; color: white; border-radius: 2px; box-shadow: inset 0 0 2px rgba(0,0,0,0.2); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; padding: 0 1px; }",
        "  .setup { background: #9b59b6; opacity: 0.8; z-index: 1; }",
        "  .job { background: #27ae60; z-index: 2; border: 1px solid #1e8449; }",
        "  .time-scale { display: flex; justify-content: space-between; margin-left: 50px; padding: 3px 0; font-size: 10px; font-weight: bold; color: #2c3e50; border-top: 2px solid #34495e; background: #ecf0f1; }",
        "  h2 { color: #2c3e50; border-bottom: 2px solid #34495e; padding-bottom: 5px; font-size: 18px; margin-bottom: 10px; }",
        "  h3 { color: #7f8c8d; font-size: 14px; margin: 5px 0; }",
        "  .report-footer { margin-top: 50px; border-top: 1px solid #eee; padding-top: 10px; font-size: 10px; color: #bdc3c7; text-align: right; }",
        "</style>",
        "<div style='width: 100%; overflow-x: visible;'>",
        "  <h2>Yüksek Çözünürlüklü Makine Çizelgesi (Gantt Şeması)</h2>",
    ]

    for chunk_idx in range(num_chunks):
        t_start = chunk_idx * CHUNK_SIZE
        t_end = min((chunk_idx + 1) * CHUNK_SIZE, cmax)
        chunk_duration = t_end - t_start
        
        html.append(f"  <div class='chunk-container'>")
        html.append(f"    <h3>Zaman Dilimi: {t_start:.1f} - {t_end:.1f} saat</h3>")
        html.append("    <div class='gantt-wrapper'>")
        
        for k in sorted(schedule.keys()):
            html.append(f"      <div class='m-row'><div class='m-label'>M{k}</div><div class='gantt-data'>")
            
            # Sadece bu zaman dilimine giren işleri veya setupları çiz
            current_t = 0.0
            for (j, start, end) in schedule[k]:
                # Setup
                s_dur = start - current_t
                if s_dur > 0:
                    s_start_clamped = max(current_t, t_start)
                    s_end_clamped = min(start, t_end)
                    if s_end_clamped > s_start_clamped:
                        left = ((s_start_clamped - t_start) / chunk_duration) * 100
                        width = ((s_end_clamped - s_start_clamped) / chunk_duration) * 100
                        html.append(f"<div class='block setup' style='left:{left}%; width:{width}%;'>S</div>")
                
                # Job
                j_dur = end - start
                j_start_clamped = max(start, t_start)
                j_end_clamped = min(end, t_end)
                if j_end_clamped > j_start_clamped:
                    left = ((j_start_clamped - t_start) / chunk_duration) * 100
                    width = ((j_end_clamped - j_start_clamped) / chunk_duration) * 100
                    f_code = families.get(str(j), "?")
                    
                    # Eğer blok çok dar ise yazıyı kısalt
                    if width < 1.5:
                        label = ""
                    elif width < 3:
                        label = f"{j}"
                    else:
                        label = f"J{j}<br>F{f_code}"
                        
                    html.append(f"<div class='block job' style='left:{left}%; width:{width}%;' title='İş {j} (Aile {f_code})'>{label}</div>")
                
                current_t = end
            html.append("      </div></div>")

        html.append("    </div>")
        html.append(f"    <div class='time-scale'><span>{t_start:.1f}</span><span>{t_end:.1f}</span></div>")
        html.append("  </div>")

    html.append(f"  <div class='report-footer' style='margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; font-size: 10px; color: #bdc3c7; text-align: right;'>UPMSP DSS v1.0 | Academic Release | {time.strftime('%Y-%m-%d')}</div>")
    html.append("</div>")
    
    return "\n".join(html)


def get_gantt_str(schedule: dict, cmax: float, width: int = 100) -> str:
    """Gantt şemasını metin (string) olarak döndürür."""
    if cmax <= 0: return "Çizelgelenmiş iş yok."
    output = []
    for k in sorted(schedule.keys()):
        line = f"M{k:2d} | "
        current_t = 0.0
        for (j, start, end) in schedule[k]:
            setup_time = start - current_t
            if setup_time > 0:
                line += "▒" * max(1, int((setup_time / cmax) * width))
            job_time = end - start
            line += "█" * max(1, int((job_time / cmax) * width))
            current_t = end
        output.append(line)
    output.append("-" * (width + 8))
    output.append(f"     0 {' ' * (width-4)} {cmax:.1f}")
    return "\n".join(output)


def system_health_check() -> bool:
    """Sistemin çalışması için gerekli bileşenleri kontrol eder."""
    print("\n  ─── System Health Check ──────────────────────────────")
    all_ok = True
    
    # 1. OR-Tools Kontrolü
    try:
        from ortools.sat.python import cp_model
        print(f"  [OK] Google OR-Tools: Found")
    except ImportError:
        print(f"  [!!] Google OR-Tools: NOT FOUND (pip install ortools)")
        all_ok = False
        
    # 2. md-to-pdf Kontrolü
    import subprocess
    try:
        res = subprocess.run(["npx", "--version"], capture_output=True, text=True)
        if res.returncode == 0:
            print(f"  [OK] Node.js/npx: Found ({res.stdout.strip()})")
        else:
            raise Exception()
    except:
        print(f"  [!!] Node.js/npx: NOT FOUND (Required for PDF generation)")
        all_ok = False
        
    # 3. Veri Dizini Kontrolü
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
    if os.path.exists(data_dir):
        print(f"  [OK] Data Directory: Found")
    else:
        try:
            os.makedirs(data_dir)
            print(f"  [OK] Data Directory: Created")
        except:
            print(f"  [!!] Data Directory: Could not be created")
            all_ok = False
            
    print("  " + "─" * 56)
    if all_ok:
        print(f"  {Colors.GREEN}{Colors.BOLD}✓ System is healthy and ready.{Colors.ENDC}")
    else:
        print(f"  {Colors.RED}{Colors.BOLD}✗ System has configuration issues.{Colors.ENDC}")
    print("  " + "─" * 56 + "\n")
    return all_ok


def print_gantt_chart(schedule: dict, cmax: float, width: int = 70) -> None:
    """
    Terminal üzerinde basit bir Gantt şeması (Time-Phased Chart) çizer.
    """
    print("\n" + Colors.CYAN + Colors.BOLD + "  GANTT CHART (TIME-PHASED SCHEDULE)" + Colors.ENDC)
    print(f"  {Colors.BOLD}Y-AXIS:{Colors.ENDC} Machines (k)   |   {Colors.BOLD}X-AXIS:{Colors.ENDC} Time (hours)")
    print(f"  {Colors.MAGENTA}▒▒▒{Colors.ENDC} = Setup Time (Sᵢ,ⱼ,ₖ)   |   {Colors.GREEN}███{Colors.ENDC} = Processing Time (Pⱼ,ₖ)")
    print("  " + "═" * (width + 12))
    
    # Büyük veri setleri için terminal Gantt şeması okunmaz, özet geçelim
    num_jobs = sum(len(v) for v in schedule.values())
    if num_jobs > 50:
        print(f"\n  [INFO] Terminal Gantt is too dense for {num_jobs} jobs.")
        print(Colors.YELLOW + "  [INFO] A high-resolution chunked Gantt chart is available in the PDF report." + Colors.ENDC)
        print("\n  Machine Load Summary:")
        for k in sorted(schedule.keys()):
            jobs = schedule[k]
            if not jobs: continue
            total_p = sum(e-s for j,s,e in jobs)
            print(f"    M{k:2d}: {len(jobs):3d} Jobs | Total Processing: {total_p:8.2f} | Completion (Ck): {jobs[-1][2]:8.2f}")
        return

    # Eğer Cmax çok küçükse, ölçeği çok büyütmeyelim
    cmax = max(cmax, 1)

    for k in sorted(schedule.keys()):
        line = f"  {Colors.BOLD}M{k:2d}{Colors.ENDC} │ "
        
        current_t = 0.0
        
        for (j, start, end) in schedule[k]:
            # Setup Süresi (start - current_t)
            setup_time = start - current_t
            if setup_time > 0:
                setup_chars = max(1, int((setup_time / cmax) * width))
                line += Colors.MAGENTA + "▒" * setup_chars + Colors.ENDC
                
            # İş Bloğu
            job_time = end - start
            job_chars = max(1, int((job_time / cmax) * width))
            
            # İş ismini bloğun içine sığdırmaya çalışalım
            j_str = f"J{j}"
            if len(j_str) > job_chars:
                block = Colors.GREEN + "█" * job_chars + Colors.ENDC
            else:
                pad_l = (job_chars - len(j_str)) // 2
                pad_r = job_chars - len(j_str) - pad_l
                block = Colors.GREEN + "█" * pad_l + Colors.YELLOW + Colors.BOLD + j_str + Colors.ENDC + Colors.GREEN + "█" * pad_r + Colors.ENDC
                
            line += block
            current_t = end
            
        print(line)
        
    print("  " + "─" * (width + 12))
    print(f"       0 {' ' * (width-4)} {cmax:.1f}\n")
