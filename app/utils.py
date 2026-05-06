"""
utils.py
--------
Terminal arayüzü için renklendirme ve Gantt şeması çizdirme araçları.
"""

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


def get_html_gantt(schedule: dict, cmax: float, families: dict) -> str:
    """PDF için geniş, detaylı ve yatay bir HTML Gantt şeması üretir."""
    if cmax <= 0: return "<p>Çizelgelenmiş iş yok.</p>"
    
    html = [
        "<div style='page-break-before: always;'></div>",
        "<style>",
        "  @page { size: A4 landscape; margin: 0.5cm; }",
        "  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }",
        "  .gantt-wrapper { width: 2500px; margin-top: 20px; border: 1px solid #ccc; background: #fff; }",
        "  .m-row { display: flex; border-bottom: 1px solid #eee; position: relative; height: 50px; }",
        "  .m-label { width: 60px; background: #34495e; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; z-index: 10; }",
        "  .gantt-data { position: relative; flex-grow: 1; background: #fdfdfd; overflow: hidden; }",
        "  .block { position: absolute; height: 36px; top: 7px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 8px; line-height: 1; color: white; border-radius: 2px; box-shadow: inset 0 0 2px rgba(0,0,0,0.2); overflow: hidden; }",
        "  .setup { background: #9b59b6; opacity: 0.8; z-index: 1; }",
        "  .job { background: #27ae60; z-index: 2; border: 1px solid #1e8449; }",
        "  .time-scale { display: flex; justify-content: space-between; margin-left: 60px; padding: 5px 0; font-size: 11px; font-weight: bold; color: #2c3e50; border-top: 2px solid #34495e; }",
        "  h2 { color: #2c3e50; border-bottom: 2px solid #34495e; padding-bottom: 5px; }",
        "</style>",
        "<div style='width: 100%; overflow-x: visible;'>",
        "  <h2>Yüksek Çözünürlüklü Makine Çizelgesi (Gantt Şeması)</h2>",
        "  <div class='gantt-wrapper'>",
    ]

    for k in sorted(schedule.keys()):
        html.append(f"    <div class='m-row'><div class='m-label'>M{k}</div><div class='gantt-data'>")
        current_t = 0.0
        for (j, start, end) in schedule[k]:
            # Setup
            s_dur = start - current_t
            if s_dur > 0:
                left = (current_t / cmax) * 100
                width = (s_dur / cmax) * 100
                html.append(f"<div class='block setup' style='left:{left}%; width:{width}%;'>S</div>")
            
            # Job
            j_dur = end - start
            left = (start / cmax) * 100
            width = (j_dur / cmax) * 100
            f_code = families.get(str(j), "?")
            # Metin sığmıyorsa sadece J numarasını yaz
            label = f"J{j}<br>F{f_code}" if width > 2 else f"{j}"
            html.append(f"<div class='block job' style='left:{left}%; width:{width}%;' title='İş {j} (Aile {f_code})'>{label}</div>")
            current_t = end
        html.append("    </div></div>")

    html.append("  </div>")
    html.append(f"  <div class='time-scale'><span>BAŞLANGIÇ (0)</span><span>TAMAMLANMA ZAMANI ({cmax:.1f} saat)</span></div>")
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


def print_gantt_chart(schedule: dict, cmax: float, width: int = 70) -> None:
    """
    Terminal üzerinde basit bir Gantt şeması (Zaman Çizelgesi) çizer.
    """
    print("\n" + Colors.CYAN + Colors.BOLD + "  GANTT ŞEMASI (ZAMAN ÇİZELGESİ)" + Colors.ENDC)
    print(f"  {Colors.BOLD}Y EKSENİ:{Colors.ENDC} Makineler   |   {Colors.BOLD}X EKSENİ:{Colors.ENDC} Zaman")
    print(f"  {Colors.MAGENTA}▒▒▒{Colors.ENDC} = Hazırlık (Setup) Süresi   |   {Colors.GREEN}███{Colors.ENDC} = İşlem Süresi")
    print("  " + "═" * (width + 12))
    
    # Büyük veri setleri için terminal Gantt şeması okunmaz, özet geçelim
    num_jobs = sum(len(v) for v in schedule.values())
    if num_jobs > 50:
        print(f"\n  [BİLGİ] {num_jobs} iş için terminal Gantt şeması çok yoğun.")
        print(Colors.YELLOW + "  [BİLGİ] Tam (yüksek çözünürlüklü) şema PDF raporunda mevcuttur." + Colors.ENDC)
        print("\n  Makine yük özetleri:")
        for k in sorted(schedule.keys()):
            jobs = schedule[k]
            if not jobs: continue
            total_p = sum(e-s for j,s,e in jobs)
            print(f"    M{k:2d}: {len(jobs):3d} İş | Toplam İşlem: {total_p:8.2f} | Bitiş: {jobs[-1][2]:8.2f}")
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
