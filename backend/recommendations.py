def generate_recommendations(biorhythm):
    recommendations = []

    if biorhythm["physical"] > 50:
        recommendations.append("Подходящий день для физической активности")
    elif biorhythm["physical"] < -50:
        recommendations.append("Не перегружай себя физическими нагрузками")
    else:
        recommendations.append("Поддерживай привычный уровень активности")

    if biorhythm["emotional"] > 50:
        recommendations.append("Удели время общению и новым знакомствам")
    elif biorhythm["emotional"] < -50:
        recommendations.append("Выдели время для отдыха и спокойных занятий")
    else:
        recommendations.append("Поддерживай привычный ритм общения")

    if biorhythm["intellectual"] > 50:
        recommendations.append("Попробуй заняться сложными задачами")
    elif biorhythm["intellectual"] < -50:
        recommendations.append("Начни с простых и привычных задач")
    else:
        recommendations.append("Чередуй сложные и простые задачи")

    return recommendations
