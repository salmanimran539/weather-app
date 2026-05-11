"""Application entry point for the desktop weather app."""

from weather_app.controllers.weather_controller import WeatherController
from weather_app.services.weather_service import WeatherService
from weather_app.ui.main_window import MainWindow


def main() -> None:
    """Start the weather application."""
    service = WeatherService()
    controller = WeatherController(service)
    window = MainWindow(controller)
    window.run()


if __name__ == "__main__":
    main()
