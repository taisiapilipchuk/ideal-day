from datetime import date
from math import sin, pi

CYCLES = {
    "physical": 23,
    "emotional": 28,
    "intellectual": 33,
}


def calculate_biorhythm(birth_date: date, target_date: date):
    days = (target_date - birth_date).days
    previous_days = days - 1

    values = {}
    critical_cycles = []

    for cycle_name, period in CYCLES.items():
        current_value = sin(2 * pi * days / period)
        previous_value = sin(2 * pi * previous_days / period)

        values[cycle_name] = round(current_value * 100, 2)

        if abs(current_value) < 1e-9 or previous_value * current_value < 0:
            critical_cycles.append(cycle_name)

    values["critical_cycles"] = critical_cycles

    return values
