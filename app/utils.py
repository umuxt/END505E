"""
utils.py
--------
Terminal arayüzü için renklendirme ve Gantt şeması çizdirme araçları.
"""

class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def print_gantt_chart(schedule: dict, cmax: float, width: int = 60) -> None:
    """
    Terminal üzerinde basit bir Gantt şeması (Zaman Çizelgesi) çizer.
    
    Args:
        schedule: {k: [(j, start, end), ...]} formatında çizelge sözlüğü
        cmax: Maksimum tamamlanma zamanı (ölçekleme için)
        width: Gantt şemasının terminaldeki maksimum karakter genişliği
    """
    print("\n" + Colors.CYAN + Colors.BOLD + "  GANTT ŞEMASI (ZAMAN ÇİZELGESİ)" + Colors.ENDC)
    print("  " + "═" * 70)
    
    if cmax == 0:
        print("  Çizelgelenmiş iş yok.")
        return

    # Eğer Cmax çok küçükse, ölçeği çok büyütmeyelim
    cmax = max(cmax, 1)

    for k in sorted(schedule.keys()):
        line = f"  {Colors.BOLD}Makine {k:2d}{Colors.ENDC} │"
        
        current_t = 0.0
        
        for (j, start, end) in schedule[k]:
            # Boşluk (Hazırlık veya Bekleme)
            idle_time = start - current_t
            if idle_time > 0:
                idle_chars = int((idle_time / cmax) * width)
                line += " " * idle_chars
                
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
                block = Colors.GREEN + "█" * pad_l + Colors.YELLOW + j_str + Colors.GREEN + "█" * pad_r + Colors.ENDC
                
            line += block
            current_t = end
            
        print(line)
        
    print("  " + "─" * 70)
    print(f"  Zaman: 0 {' ' * (width-8)} {cmax:.2f}\n")
