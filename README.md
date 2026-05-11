# WeatherScope

A complete Python weather project with both a Tkinter desktop app and a professional browser website. It searches current weather by city, shows a seven-day prediction, and includes a planning engine that turns weather into practical weekly suggestions.

## Features

- City weather search
- Current temperature, feels-like, humidity, and wind speed
- Seven-day weather prediction
- Professional responsive website
- Tkinter desktop interface
- Life Weather Planner for outdoor plans, commute timing, and laundry windows
- Layered project structure with models, services, controllers, and UI
- No API key required
- Real live data only; no fake repeated weather is shown

## Project Structure

```text
weather_app/
  app.py
  controllers/
    weather_controller.py
  models/
    weather.py
  services/
    weather_service.py
  ui/
    main_window.py
  web/
    index.html
    styles.css
    app.js
  web_server.py
requirements.txt
README.md
```

## Run Website

From the project folder:

```bash
python -m weather_app.web_server
```

Then open:

```text
http://127.0.0.1:8000
```

## Run Desktop App

```bash
python -m weather_app.app
```

## Notes

The project uses Open-Meteo live geocoding and forecast APIs. If internet access is blocked or the weather service is unavailable, the website shows an error instead of fake weather data.
