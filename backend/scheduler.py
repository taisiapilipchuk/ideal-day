from datetime import datetime, timedelta


def create_schedule(tasks):
    start_time = datetime.strptime("09:00", "%H:%M")
    end_time = datetime.strptime("18:00", "%H:%M")

    schedule = []
    occupied = []
    flexible_tasks = []

    # Разделяем задачи на фиксированные и свободные
    for task in tasks:
        # Пропускаем завершённые задачи
        if task.is_completed:
            continue

        if task.start_time is None:
            flexible_tasks.append(task)
            continue

        task_start = datetime.strptime(task.start_time.strftime("%H:%M"), "%H:%M")

        if task.end_time is not None:
            task_end = datetime.strptime(task.end_time.strftime("%H:%M"), "%H:%M")
        else:
            task_end = task_start + timedelta(minutes=task.duration)

        if task_start < start_time or task_end > end_time or task_end <= task_start:
            continue

        occupied.append((task_start, task_end, task))

    # Сортируем фиксированные задачи по времени
    occupied.sort(key=lambda item: item[0])

    # Добавляем фиксированные задачи без пересечений
    valid_occupied = []

    for task_start, task_end, task in occupied:
        if valid_occupied and task_start < valid_occupied[-1][1]:
            continue

        valid_occupied.append((task_start, task_end))

        schedule.append(
            {
                "task_id": task.id,
                "title": task.title,
                "start_time": task_start.strftime("%H:%M"),
                "end_time": task_end.strftime("%H:%M"),
            }
        )

    occupied = valid_occupied

    # Сортируем остальные задачи по приоритету
    flexible_tasks.sort(key=lambda task: task.priority, reverse=True)

    # Ищем свободное время для каждой задачи
    for task in flexible_tasks:
        current_time = start_time
        task_end = current_time + timedelta(minutes=task.duration)

        for busy_start, busy_end in sorted(occupied):
            if task_end <= busy_start:
                break

            if current_time < busy_end:
                current_time = busy_end
                task_end = current_time + timedelta(minutes=task.duration)

        if task_end > end_time:
            continue

        schedule.append(
            {
                "task_id": task.id,
                "title": task.title,
                "start_time": current_time.strftime("%H:%M"),
                "end_time": task_end.strftime("%H:%M"),
            }
        )

        occupied.append((current_time, task_end))
        occupied.sort()

    schedule.sort(key=lambda item: item["start_time"])

    return schedule
