"""Small standard-library web server for the WeatherScope website."""

from __future__ import annotations

import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from weather_app.controllers.weather_controller import WeatherController
from weather_app.services.weather_service import WeatherService, friendly_weather_error


ROOT = Path(__file__).resolve().parent
STATIC_DIR = ROOT / "web"


class WeatherRequestHandler(SimpleHTTPRequestHandler):
    """Serves static files and the forecast JSON API."""

    def __init__(self, *args: object, **kwargs: object) -> None:
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/weather":
            self._handle_weather_api(parsed.query)
            return
        if parsed.path == "/":
            self.path = "/index.html"
        super().do_GET()

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        super().end_headers()

    def _handle_weather_api(self, query: str) -> None:
        params = parse_qs(query)
        city = params.get("city", ["Lahore"])[0]
        controller = WeatherController(WeatherService())

        try:
            payload = {"ok": True, "data": controller.get_weekly_weather(city).to_dict()}
            status = 200
        except ValueError as error:
            payload = {"ok": False, "error": str(error)}
            status = 400
        except Exception as error:
            payload = {"ok": False, "error": friendly_weather_error(error)}
            status = 503

        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def run(host: str = "127.0.0.1", port: int = 8000) -> None:
    """Run the local website server."""
    server = ThreadingHTTPServer((host, port), WeatherRequestHandler)
    print(f"WeatherScope running at http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run()
