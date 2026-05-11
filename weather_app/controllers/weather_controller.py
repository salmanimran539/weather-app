"""Controller logic between the UI and weather service."""

from weather_app.models.weather import WeatherReport, WeeklyWeather
from weather_app.services.weather_service import WeatherService


class WeatherController:
    """Coordinates weather lookups and basic input validation."""

    def __init__(self, weather_service: WeatherService) -> None:
        self._weather_service = weather_service

    def get_weather(self, city: str) -> WeatherReport:
        """Return a weather report for a city name."""
        return self.get_weekly_weather(city).current

    def get_weekly_weather(self, city: str) -> WeeklyWeather:
        """Return current weather and a week forecast for a city name."""
        cleaned_city = city.strip()
        if not cleaned_city:
            raise ValueError("Please enter a city name.")

        return self._weather_service.fetch_weekly_weather(cleaned_city)
