
def calculate_metrics(schedule, jobs_data, setup_times):
    completion_times = {}
    machine_times = {1: 0, 2: 0}
    machine_last_job = {1: 0, 2: 0}
    
    # schedule: {1: [job_ids], 2: [job_ids]}
    # We need to process jobs in order they were added across all machines?
    # Actually, the heuristic process jobs one by one.
    # To calculate metrics, we just follow the machine sequences.
    
    for m_id in sorted(schedule.keys()):
        for j_id in schedule[m_id]:
            prev_j = machine_last_job[m_id]
            setup = setup_times[m_id][prev_j][j_id] if prev_j != 0 else 0
            processing = jobs_data[j_id][f'P{m_id}']
            start_time = machine_times[m_id]
            comp_time = start_time + setup + processing
            completion_times[j_id] = comp_time
            machine_times[m_id] = comp_time
            machine_last_job[m_id] = j_id
            
    makespan = max(machine_times.values())
    tardiness = {j_id: max(0, completion_times[j_id] - jobs_data[j_id]['Dj']) for j_id in completion_times}
    total_tardiness = sum(tardiness.values())
    num_tardy = sum(1 for t in tardiness.values() if t > 0)
    
    return makespan, total_tardiness, num_tardy, completion_times

# Data from Table 2
jobs_data = {
    1: {'P1': 9, 'P2': 6, 'Dj': 30},
    2: {'P1': 22, 'P2': 16, 'Dj': 20},
    3: {'P1': 28, 'P2': 22, 'Dj': 32}
}

# Setup times: {machine_id: {prev_job: {next_job: time}}}
s1 = {
    0: {1: 0, 2: 0, 3: 0},
    1: {2: 0.5, 3: 5},
    2: {1: 0.5, 3: 5},
    3: {1: 5, 2: 5}
}
s2 = {
    0: {1: 0, 2: 0, 3: 0},
    1: {2: 0.5, 3: 3},
    2: {1: 0.5, 3: 3},
    3: {1: 3, 2: 3}
}
setup_times = {1: s1, 2: s2}

def run_sct():
    remaining_jobs = [1, 2, 3]
    machine_times = {1: 0, 2: 0}
    machine_last_job = {1: 0, 2: 0}
    schedule = {1: [], 2: []}
    
    while remaining_jobs:
        best_comp = float('inf')
        best_job = None
        best_m = None
        
        for j in remaining_jobs:
            for m in [1, 2]:
                prev_j = machine_last_job[m]
                setup = setup_times[m][prev_j][j]
                comp = machine_times[m] + setup + jobs_data[j][f'P{m}']
                if comp < best_comp:
                    best_comp = comp
                    best_job = j
                    best_m = m
        
        schedule[best_m].append(best_job)
        machine_times[best_m] = best_comp
        machine_last_job[best_m] = best_job
        remaining_jobs.remove(best_job)
    return schedule

def run_combined(ts=5):
    remaining_jobs = [1, 2, 3]
    machine_times = {1: 0, 2: 0}
    machine_last_job = {1: 0, 2: 0}
    schedule = {1: [], 2: []}
    
    while remaining_jobs:
        current_max_c = max(machine_times.values())
        rule = "SCT" if current_max_c <= ts else "SC-LPT"
        
        best_comp = float('inf')
        best_job = None
        best_m = None
        
        if rule == "SCT":
            for j in remaining_jobs:
                for m in [1, 2]:
                    prev_j = machine_last_job[m]
                    setup = setup_times[m][prev_j][j]
                    comp = machine_times[m] + setup + jobs_data[j][f'P{m}']
                    if comp < best_comp:
                        best_comp = comp
                        best_job = j
                        best_m = m
        else: # SC-LPT
            max_p = -1
            target_j = None
            for j in remaining_jobs:
                for m in [1, 2]:
                    if jobs_data[j][f'P{m}'] > max_p:
                        max_p = jobs_data[j][f'P{m}']
                        target_j = j
            
            best_job = target_j
            for m in [1, 2]:
                prev_j = machine_last_job[m]
                setup = setup_times[m][prev_j][best_job]
                comp = machine_times[m] + setup + jobs_data[best_job][f'P{m}']
                if comp < best_comp:
                    best_comp = comp
                    best_m = m
                    
        schedule[best_m].append(best_job)
        machine_times[best_m] = best_comp
        machine_last_job[best_m] = best_job
        remaining_jobs.remove(best_job)
    return schedule

def run_lpt():
    remaining_jobs = [1, 2, 3]
    machine_times = {1: 0, 2: 0}
    machine_last_job = {1: 0, 2: 0}
    schedule = {1: [], 2: []}
    
    while remaining_jobs:
        max_p = -1
        target_j = None
        for j in remaining_jobs:
            for m in [1, 2]:
                if jobs_data[j][f'P{m}'] > max_p:
                    max_p = jobs_data[j][f'P{m}']
                    target_j = j
        
        best_job = target_j
        best_comp = float('inf')
        best_m = None
        for m in [1, 2]:
            prev_j = machine_last_job[m]
            setup = setup_times[m][prev_j][best_job]
            comp = machine_times[m] + setup + jobs_data[best_job][f'P{m}']
            if comp < best_comp:
                best_comp = comp
                best_m = m
        
        schedule[best_m].append(best_job)
        machine_times[best_m] = best_comp
        machine_last_job[best_m] = best_job
        remaining_jobs.remove(best_job)
    return schedule

def run_edd():
    remaining_jobs = [1, 2, 3]
    machine_times = {1: 0, 2: 0}
    machine_last_job = {1: 0, 2: 0}
    schedule = {1: [], 2: []}
    
    while remaining_jobs:
        min_d = float('inf')
        target_j = None
        for j in remaining_jobs:
            if jobs_data[j]['Dj'] < min_d:
                min_d = jobs_data[j]['Dj']
                target_j = j
        
        best_job = target_j
        best_comp = float('inf')
        best_m = None
        for m in [1, 2]:
            prev_j = machine_last_job[m]
            setup = setup_times[m][prev_j][best_job]
            comp = machine_times[m] + setup + jobs_data[best_job][f'P{m}']
            if comp < best_comp:
                best_comp = comp
                best_m = m
        
        schedule[best_m].append(best_job)
        machine_times[best_m] = best_comp
        machine_last_job[best_m] = best_job
        remaining_jobs.remove(best_job)
    return schedule

def print_results(name, sch):
    m, t, l, c = calculate_metrics(sch, jobs_data, setup_times)
    print(f"--- {name} Results ---")
    print(f"Schedule: {sch}")
    print(f"Completion Times: {c}")
    print(f"Makespan: {m}, Total Tardiness: {t}, Tardy Jobs: {l}")
    print()

print_results("SCT", run_sct())
print_results("Combined (SCT & SC-LPT: ts=5)", run_combined(ts=5))
print_results("LPT", run_lpt())
print_results("EDD", run_edd())
