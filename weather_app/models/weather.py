"""Weather domain models."""

from dataclasses import asdict, dataclass
from datetime import date, datetime


@dataclass(frozen=True)
class WeatherReport:
    """A normalized weather report shown by the UI."""

    city: str
    country: str
    temperature_c: float
    feels_like_c: float
    humidity: int
    wind_kph: float
    condition: str
    observation_time: datetime
    source: str

    @property
    def temperature_label(self) -> str:
        return f"{self.temperature_c:.1f} C"

    @property
    def feels_like_label(self) -> str:
        return f"{self.feels_like_c:.1f} C"

    @property
    def humidity_label(self) -> str:
        return f"{self.humidity}%"

    @property
    def wind_label(self) -> str:
        return f"{self.wind_kph:.1f} km/h"

    def to_dict(self) -> dict[str, object]:
        data = asdict(self)
        data["observation_time"] = self.observation_time.isoformat()
        data["temperature_label"] = self.temperature_label
        data["feels_like_label"] = self.feels_like_label
        data["humidity_label"] = self.humidity_label
        data["wind_label"] = self.wind_label
        return data


@dataclass(frozen=True)
class ForecastDay:
    """A normalized one-day forecast."""

    date: date
    min_c: float
    max_c: float
    average_c: float
    humidity: int
    wind_kph: float
    chance_of_rain: int
    uv_index: int
    condition: str

    @property
    def day_name(self) -> str:
        return self.date.strftime("%A")

    @property
    def short_date(self) -> str:
        return self.date.strftime("%b %d")

    @property
    def comfort_score(self) -> int:
        temp_penalty = min(abs(self.average_c - 22) * 3, 35)
        rain_penalty = self.chance_of_rain * 0.25
        humidity_penalty = max(self.humidity - 60, 0) * 0.25
        wind_penalty = max(self.wind_kph - 18, 0) * 0.4
        score = 100 - temp_penalty - rain_penalty - humidity_penalty - wind_penalty
        return max(1, min(100, round(score)))

    @property
    def plan_label(self) -> str:
        if self.chance_of_rain >= 70:
            return "Indoor focus"
        if self.uv_index >= 8:
            return "Early outdoor window"
        if self.comfort_score >= 78:
            return "Best day to go out"
        if self.wind_kph >= 28:
            return "Wind-aware plans"
        return "Flexible day"

    @property
    def outfit_tip(self) -> str:
        if self.max_c >= 34:
            return "Light breathable clothes, water, and shade."
        if self.min_c <= 12:
            return "Layer up and keep a warmer outer layer nearby."
        if self.chance_of_rain >= 55:
            return "Carry an umbrella or rain jacket."
        return "Comfortable casual outfit should work well."

    def to_dict(self) -> dict[str, object]:
        data = asdict(self)
        data["date"] = self.date.isoformat()
        data["day_name"] = self.day_name
        data["short_date"] = self.short_date
        data["comfort_score"] = self.comfort_score
        data["plan_label"] = self.plan_label
        data["outfit_tip"] = self.outfit_tip
        return data


@dataclass(frozen=True)
class WeeklyWeather:
    """Current conditions plus a weekly forecast and planning intelligence."""

    current: WeatherReport
    forecast: list[ForecastDay]

    @property
    def best_day(self) -> ForecastDay:
        return max(self.forecast, key=lambda day: day.comfort_score)

    @property
    def rainiest_day(self) -> ForecastDay:
        return max(self.forecast, key=lambda day: day.chance_of_rain)

    @property
    def week_summary(self) -> str:
        best = self.best_day
        rainiest = self.rainiest_day
        return (
            f"{best.day_name} looks best for outdoor plans with a {best.comfort_score}/100 "
            f"comfort score. Keep an eye on {rainiest.day_name}, where rain chance reaches "
            f"{rainiest.chance_of_rain}%."
        )

    def to_dict(self) -> dict[str, object]:
        return {
            "current": self.current.to_dict(),
            "forecast": [day.to_dict() for day in self.forecast],
            "best_day": self.best_day.to_dict(),
            "rainiest_day": self.rainiest_day.to_dict(),
            "week_summary": self.week_summary,
        }
