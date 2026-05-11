"""Weather lookup service using OpenWeatherMap live data."""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from weather_app.models.weather import ForecastDay, WeatherReport, WeeklyWeather


class WeatherService:
    """Fetches and normalizes weather data."""

    API_KEY = "c71ce856cdde1ad1a66e3e56bbbbbe5c0"
    OPENWEATHER_GEOCODING_URL = "https://api.openweathermap.org/geo/1.0/direct"
    OPENWEATHER_ONE_CALL_URL = "https://api.openweathermap.org/data/3.0/onecall"
    OPENWEATHER_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
    OPENWEATHER_CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather"
    GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
    FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
    WEATHER_CODES = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
    }
    KNOWN_LOCATIONS = {
        "lahore": {"name": "Lahore", "country": "Pakistan", "latitude": 31.5204, "longitude": 74.3587},
        "karachi": {"name": "Karachi", "country": "Pakistan", "latitude": 24.8607, "longitude": 67.0011},
        "islamabad": {"name": "Islamabad", "country": "Pakistan", "latitude": 33.6844, "longitude": 73.0479},
        "rawalpindi": {"name": "Rawalpindi", "country": "Pakistan", "latitude": 33.5651, "longitude": 73.0169},
        "faisalabad": {"name": "Faisalabad", "country": "Pakistan", "latitude": 31.4504, "longitude": 73.1350},
        "faislabad": {"name": "Faisalabad", "country": "Pakistan", "latitude": 31.4504, "longitude": 73.1350},
        "kasur": {"name": "Kasur", "country": "Pakistan", "latitude": 31.1187, "longitude": 74.4500},
        "murree": {"name": "Murree", "country": "Pakistan", "latitude": 33.9070, "longitude": 73.3943},
        "berlin": {"name": "Berlin", "country": "Germany", "latitude": 52.5200, "longitude": 13.4050},
        "germany": {"name": "Berlin", "country": "Germany", "latitude": 52.5200, "longitude": 13.4050},
        "london": {"name": "London", "country": "United Kingdom", "latitude": 51.5072, "longitude": -0.1276},
        "tokyo": {"name": "Tokyo", "country": "Japan", "latitude": 35.6762, "longitude": 139.6503},
        "dubai": {"name": "Dubai", "country": "United Arab Emirates", "latitude": 25.2048, "longitude": 55.2708},
    }

    def fetch_weather(self, city: str) -> WeatherReport:
        """Fetch live weather and return the current report."""
        return self.fetch_weekly_weather(city).current

    def fetch_weekly_weather(self, city: str) -> WeeklyWeather:
        """Fetch live current weather and a seven-day forecast."""
        location = self._geocode_city(city)
        try:
            payload = self._request_openweather_one_call(location)
            return self._parse_openweather_one_call(location, payload)
        except Exception:
            try:
                current_payload = self._request_openweather_current(location)
                forecast_payload = self._request_openweather_forecast(location)
                return self._parse_openweather_forecast(location, current_payload, forecast_payload)
            except Exception:
                payload = self._request_forecast(location)
                return self._parse_weekly_report(location, payload)

    def _geocode_city(self, city: str) -> dict[str, Any]:
        known = self._known_location(city)
        if known:
            return known

        params = urlencode({"name": self._clean_city(city), "count": 1, "language": "en", "format": "json"})
        data = self._get_json(f"{self.GEOCODING_URL}?{params}")
        results = data.get("results", [])
        if not results:
            raise ValueError(f"No live weather location found for '{city}'. Try a nearby city name.")
        return results[0]

    def _known_location(self, city: str) -> dict[str, Any] | None:
        cleaned = self._clean_city(city)
        if cleaned in self.KNOWN_LOCATIONS:
            return self.KNOWN_LOCATIONS[cleaned]

        for part in cleaned.replace("/", ",").replace("|", ",").split(","):
            part = part.strip()
            if part in self.KNOWN_LOCATIONS:
                return self.KNOWN_LOCATIONS[part]

        return None

    def _clean_city(self, city: str) -> str:
        return " ".join(city.strip().lower().split())

    def _request_forecast(self, location: dict[str, Any]) -> dict[str, Any]:
        params = urlencode(
            {
                "latitude": location["latitude"],
                "longitude": location["longitude"],
                "current": "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
                "daily": (
                    "weather_code,temperature_2m_max,temperature_2m_min,"
                    "apparent_temperature_max,precipitation_probability_max,"
                    "wind_speed_10m_max,uv_index_max"
                ),
                "timezone": "auto",
                "forecast_days": 7,
            }
        )
        return self._get_json(f"{self.FORECAST_URL}?{params}")

    def _request_openweather_one_call(self, location: dict[str, Any]) -> dict[str, Any]:
        params = urlencode(
            {
                "lat": location["latitude"],
                "lon": location["longitude"],
                "appid": self.API_KEY,
                "units": "metric",
                "exclude": "minutely,hourly,alerts",
            }
        )
        return self._get_json(f"{self.OPENWEATHER_ONE_CALL_URL}?{params}")

    def _request_openweather_current(self, location: dict[str, Any]) -> dict[str, Any]:
        params = urlencode(
            {
                "lat": location["latitude"],
                "lon": location["longitude"],
                "appid": self.API_KEY,
                "units": "metric",
            }
        )
        return self._get_json(f"{self.OPENWEATHER_CURRENT_URL}?{params}")

    def _request_openweather_forecast(self, location: dict[str, Any]) -> dict[str, Any]:
        params = urlencode(
            {
                "lat": location["latitude"],
                "lon": location["longitude"],
                "appid": self.API_KEY,
                "units": "metric",
            }
        )
        return self._get_json(f"{self.OPENWEATHER_FORECAST_URL}?{params}")

    def _get_json(self, url: str) -> dict[str, Any]:
        request = Request(url, headers={"User-Agent": "WeatherScope/1.0"})
        with urlopen(request, timeout=8) as response:
            body = response.read().decode("utf-8")

        return json.loads(body)

    def _parse_report(self, location: dict[str, Any], data: dict[str, Any]) -> WeatherReport:
        current = data["current"]
        condition = self._weather_description(int(current["weather_code"]))

        return WeatherReport(
            city=str(location.get("name", "Unknown")),
            country=str(location.get("country", "Unknown")),
            temperature_c=float(current["temperature_2m"]),
            feels_like_c=float(current["apparent_temperature"]),
            humidity=int(current["relative_humidity_2m"]),
            wind_kph=float(current["wind_speed_10m"]),
            condition=condition,
            observation_time=self._parse_open_meteo_datetime(current["time"]),
            source="Open-Meteo live forecast",
        )

    def _parse_weekly_report(self, location: dict[str, Any], data: dict[str, Any]) -> WeeklyWeather:
        current = self._parse_report(location, data)
        forecast_days = self._parse_forecast_days(data)
        if not forecast_days:
            raise ValueError("Weather response did not include forecast days.")

        return WeeklyWeather(current=current, forecast=forecast_days)

    def _parse_openweather_one_call(self, location: dict[str, Any], data: dict[str, Any]) -> WeeklyWeather:
        current_data = data["current"]
        current = WeatherReport(
            city=str(location.get("name", location.get("city", "Unknown"))),
            country=str(location.get("country", "Unknown")),
            temperature_c=float(current_data["temp"]),
            feels_like_c=float(current_data["feels_like"]),
            humidity=int(current_data["humidity"]),
            wind_kph=float(current_data.get("wind_speed", 0)) * 3.6,
            condition=self._openweather_description(current_data),
            observation_time=datetime.fromtimestamp(int(current_data["dt"])),
            source="OpenWeatherMap live forecast",
        )
        forecast = [self._parse_openweather_daily(day) for day in data.get("daily", [])[:7]]
        if not forecast:
            raise ValueError("OpenWeatherMap did not return daily forecast data.")
        return WeeklyWeather(current=current, forecast=forecast)

    def _parse_openweather_daily(self, day: dict[str, Any]) -> ForecastDay:
        min_c = float(day["temp"]["min"])
        max_c = float(day["temp"]["max"])
        return ForecastDay(
            date=datetime.fromtimestamp(int(day["dt"])).date(),
            min_c=min_c,
            max_c=max_c,
            average_c=(min_c + max_c) / 2,
            humidity=int(day.get("humidity", 0)),
            wind_kph=float(day.get("wind_speed", 0)) * 3.6,
            chance_of_rain=round(float(day.get("pop", 0)) * 100),
            uv_index=round(float(day.get("uvi", 0))),
            condition=self._openweather_description(day),
        )

    def _parse_openweather_forecast(
        self,
        location: dict[str, Any],
        current_payload: dict[str, Any],
        forecast_payload: dict[str, Any],
    ) -> WeeklyWeather:
        current = WeatherReport(
            city=str(location.get("name", location.get("city", "Unknown"))),
            country=str(location.get("country", "Unknown")),
            temperature_c=float(current_payload["main"]["temp"]),
            feels_like_c=float(current_payload["main"]["feels_like"]),
            humidity=int(current_payload["main"]["humidity"]),
            wind_kph=float(current_payload.get("wind", {}).get("speed", 0)) * 3.6,
            condition=self._openweather_description(current_payload),
            observation_time=datetime.fromtimestamp(int(current_payload["dt"])),
            source="OpenWeatherMap live forecast",
        )
        forecast = self._aggregate_openweather_three_hour_forecast(forecast_payload.get("list", []))
        if not forecast:
            raise ValueError("OpenWeatherMap did not return forecast data.")
        return WeeklyWeather(current=current, forecast=forecast)

    def _aggregate_openweather_three_hour_forecast(self, items: list[dict[str, Any]]) -> list[ForecastDay]:
        grouped: dict[str, list[dict[str, Any]]] = {}
        for item in items:
            day_key = datetime.fromtimestamp(int(item["dt"])).date().isoformat()
            grouped.setdefault(day_key, []).append(item)

        forecast = []
        for day_key, day_items in list(grouped.items())[:7]:
            temps = [float(item["main"]["temp"]) for item in day_items]
            humidity_values = [int(item["main"]["humidity"]) for item in day_items]
            wind_values = [float(item.get("wind", {}).get("speed", 0)) * 3.6 for item in day_items]
            rain_values = [float(item.get("pop", 0)) for item in day_items]
            midday = day_items[len(day_items) // 2]
            forecast.append(
                ForecastDay(
                    date=datetime.fromisoformat(day_key).date(),
                    min_c=min(temps),
                    max_c=max(temps),
                    average_c=sum(temps) / len(temps),
                    humidity=round(sum(humidity_values) / len(humidity_values)),
                    wind_kph=round(max(wind_values), 1),
                    chance_of_rain=round(max(rain_values) * 100),
                    uv_index=0,
                    condition=self._openweather_description(midday),
                )
            )
        return forecast

    def _parse_forecast_days(self, data: dict[str, Any]) -> list[ForecastDay]:
        daily = data["daily"]
        days = []
        for index, day_text in enumerate(daily["time"]):
            min_c = float(daily["temperature_2m_min"][index])
            max_c = float(daily["temperature_2m_max"][index])
            apparent_max = float(daily["apparent_temperature_max"][index])
            average_c = (min_c + max_c) / 2
            humidity = self._estimate_humidity_from_apparent_temp(max_c, apparent_max)
            days.append(
                ForecastDay(
                    date=datetime.strptime(day_text, "%Y-%m-%d").date(),
                    min_c=min_c,
                    max_c=max_c,
                    average_c=average_c,
                    humidity=humidity,
                    wind_kph=float(daily["wind_speed_10m_max"][index]),
                    chance_of_rain=int(daily["precipitation_probability_max"][index] or 0),
                    uv_index=round(float(daily["uv_index_max"][index] or 0)),
                    condition=self._weather_description(int(daily["weather_code"][index])),
                )
            )
        return days

    def _parse_open_meteo_datetime(self, value: str) -> datetime:
        return datetime.fromisoformat(value)

    def _estimate_humidity_from_apparent_temp(self, temperature_c: float, apparent_c: float) -> int:
        difference = apparent_c - temperature_c
        return max(20, min(95, round(55 + difference * 8)))

    def _weather_description(self, code: int) -> str:
        return self.WEATHER_CODES.get(code, f"Weather code {code}")

    def _openweather_description(self, data: dict[str, Any]) -> str:
        weather = data.get("weather", [])
        if weather:
            description = str(weather[0].get("description", "Unknown"))
            return description[:1].upper() + description[1:]
        return "Unknown"


class WeatherServiceError(RuntimeError):
    """Raised when live weather data cannot be loaded."""


def friendly_weather_error(error: Exception) -> str:
    """Convert low-level network/API errors into a user-facing message."""
    if isinstance(error, HTTPError):
        return "Live weather service returned an error. Please try again in a moment."
    if isinstance(error, URLError):
        return "Live weather service cannot be reached. Check your internet connection and try again."
    if isinstance(error, (KeyError, json.JSONDecodeError)):
        return "Live weather service returned unexpected data. Please try again later."
    return str(error)
