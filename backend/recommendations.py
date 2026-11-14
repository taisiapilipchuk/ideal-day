def generate_recommendations(biorhythm):
    recommendations = []
    critical_cycles = biorhythm.get("critical_cycles", [])

    # Физический цикл
    if "physical" in critical_cycles:
        recommendations.append(
            "Физический цикл в критическом дне: избегай интенсивных нагрузок и отдохни"
        )
    elif biorhythm["physical"] > 50:
        recommendations.append("Подходящий день для физической активности")
    elif biorhythm["physical"] < -50:
        recommendations.append("Не перегружай себя физическими нагрузками")
    else:
        recommendations.append("Поддерживай привычный уровень активности")

    # Эмоциональный цикл
    if "emotional" in critical_cycles:
        recommendations.append(
            "Эмоциональный цикл в критическом дне: избегай стрессовых ситуаций"
        )
    elif biorhythm["emotional"] > 50:
        recommendations.append("Удели время общению и новым знакомствам")
    elif biorhythm["emotional"] < -50:
        recommendations.append("Выдели время для отдыха и спокойных занятий")
    else:
        recommendations.append("Поддерживай привычный ритм общения")

    # Интеллектуальный цикл
    if "intellectual" in critical_cycles:
        recommendations.append(
            "Интеллектуальный цикл в критическом дне: избегай сложных задач"
        )
    elif biorhythm["intellectual"] > 50:
        recommendations.append("Попробуй заняться сложными задачами")
    elif biorhythm["intellectual"] < -50:
        recommendations.append("Начни с простых и привычных задач")
    else:
        recommendations.append("Чередуй сложные и простые задачи")

    return recommendations
