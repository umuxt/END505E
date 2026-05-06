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
