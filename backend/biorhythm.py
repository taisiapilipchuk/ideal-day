from datetime import date
from math import sin, pi


def calculate_biorhythm(birth_date: date, target_date: date):
    days = (target_date - birth_date).days

    return {
        "physical": round(sin(2 * pi * days / 23) * 100, 2),
        "emotional": round(sin(2 * pi * days / 28) * 100, 2),
        "intellectual": round(sin(2 * pi * days / 33) * 100, 2),
    }
