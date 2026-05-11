"""Tkinter user interface for the weather app."""

from __future__ import annotations

import threading
import tkinter as tk
from tkinter import ttk

from weather_app.controllers.weather_controller import WeatherController
from weather_app.models.weather import WeatherReport


class MainWindow:
    """Main desktop window."""

    def __init__(self, controller: WeatherController) -> None:
        self._controller = controller
        self._root = tk.Tk()
        self._root.title("Weather App")
        self._root.geometry("520x430")
        self._root.minsize(460, 390)

        self._city_var = tk.StringVar(value="Lahore")
        self._status_var = tk.StringVar(value="Enter a city and press Search.")
        self._location_var = tk.StringVar(value="-")
        self._condition_var = tk.StringVar(value="-")
        self._temperature_var = tk.StringVar(value="-")
        self._feels_like_var = tk.StringVar(value="-")
        self._humidity_var = tk.StringVar(value="-")
        self._wind_var = tk.StringVar(value="-")
        self._updated_var = tk.StringVar(value="-")
        self._source_var = tk.StringVar(value="-")

        self._search_button: ttk.Button | None = None
        self._build()

    def run(self) -> None:
        """Open the window and start the Tkinter loop."""
        self._root.mainloop()

    def _build(self) -> None:
        self._configure_styles()

        container = ttk.Frame(self._root, padding=24, style="App.TFrame")
        container.pack(fill=tk.BOTH, expand=True)
        container.columnconfigure(0, weight=1)

        title = ttk.Label(container, text="Weather App", style="Title.TLabel")
        title.grid(row=0, column=0, sticky="w")

        search_row = ttk.Frame(container, style="App.TFrame")
        search_row.grid(row=1, column=0, sticky="ew", pady=(18, 16))
        search_row.columnconfigure(0, weight=1)

        city_entry = ttk.Entry(search_row, textvariable=self._city_var, font=("Segoe UI", 12))
        city_entry.grid(row=0, column=0, sticky="ew", ipady=6)
        city_entry.bind("<Return>", lambda _event: self._search())

        self._search_button = ttk.Button(search_row, text="Search", command=self._search)
        self._search_button.grid(row=0, column=1, padx=(10, 0), ipady=4)

        panel = ttk.Frame(container, padding=18, style="Panel.TFrame")
        panel.grid(row=2, column=0, sticky="nsew")
        panel.columnconfigure(0, weight=1)
        panel.columnconfigure(1, weight=1)

        ttk.Label(panel, textvariable=self._location_var, style="Location.TLabel").grid(
            row=0, column=0, columnspan=2, sticky="w"
        )
        ttk.Label(panel, textvariable=self._condition_var, style="Condition.TLabel").grid(
            row=1, column=0, columnspan=2, sticky="w", pady=(2, 14)
        )

        self._add_metric(panel, 2, 0, "Temperature", self._temperature_var)
        self._add_metric(panel, 2, 1, "Feels like", self._feels_like_var)
        self._add_metric(panel, 3, 0, "Humidity", self._humidity_var)
        self._add_metric(panel, 3, 1, "Wind", self._wind_var)

        footer = ttk.Frame(panel, style="Panel.TFrame")
        footer.grid(row=4, column=0, columnspan=2, sticky="ew", pady=(18, 0))
        footer.columnconfigure(1, weight=1)

        ttk.Label(footer, text="Updated", style="Meta.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Label(footer, textvariable=self._updated_var, style="MetaValue.TLabel").grid(
            row=0, column=1, sticky="e"
        )
        ttk.Label(footer, text="Source", style="Meta.TLabel").grid(row=1, column=0, sticky="w", pady=(4, 0))
        ttk.Label(footer, textvariable=self._source_var, style="MetaValue.TLabel").grid(
            row=1, column=1, sticky="e", pady=(4, 0)
        )

        status = ttk.Label(container, textvariable=self._status_var, style="Status.TLabel")
        status.grid(row=3, column=0, sticky="w", pady=(14, 0))

        city_entry.focus()

    def _configure_styles(self) -> None:
        style = ttk.Style()
        style.theme_use("clam")
        self._root.configure(bg="#f6f8fb")
        style.configure("App.TFrame", background="#f6f8fb")
        style.configure("Panel.TFrame", background="#ffffff", relief="flat")
        style.configure("Title.TLabel", background="#f6f8fb", foreground="#1f2937", font=("Segoe UI", 22, "bold"))
        style.configure("Location.TLabel", background="#ffffff", foreground="#111827", font=("Segoe UI", 17, "bold"))
        style.configure("Condition.TLabel", background="#ffffff", foreground="#4b5563", font=("Segoe UI", 11))
        style.configure("MetricLabel.TLabel", background="#ffffff", foreground="#6b7280", font=("Segoe UI", 10))
        style.configure("MetricValue.TLabel", background="#ffffff", foreground="#111827", font=("Segoe UI", 16, "bold"))
        style.configure("Meta.TLabel", background="#ffffff", foreground="#6b7280", font=("Segoe UI", 9))
        style.configure("MetaValue.TLabel", background="#ffffff", foreground="#374151", font=("Segoe UI", 9))
        style.configure("Status.TLabel", background="#f6f8fb", foreground="#4b5563", font=("Segoe UI", 10))
        style.configure("TButton", font=("Segoe UI", 11), padding=(14, 7))

    def _add_metric(self, parent: ttk.Frame, row: int, column: int, label: str, variable: tk.StringVar) -> None:
        frame = ttk.Frame(parent, style="Panel.TFrame")
        frame.grid(row=row, column=column, sticky="ew", padx=(0 if column == 0 else 10, 10 if column == 0 else 0), pady=8)
        ttk.Label(frame, text=label, style="MetricLabel.TLabel").pack(anchor="w")
        ttk.Label(frame, textvariable=variable, style="MetricValue.TLabel").pack(anchor="w", pady=(3, 0))

    def _search(self) -> None:
        city = self._city_var.get()
        self._set_loading(True)

        thread = threading.Thread(target=self._load_weather, args=(city,), daemon=True)
        thread.start()

    def _load_weather(self, city: str) -> None:
        try:
            report = self._controller.get_weather(city)
        except ValueError as error:
            self._root.after(0, lambda: self._show_error(str(error)))
            return
        except Exception as error:
            self._root.after(0, lambda: self._show_error(f"Live weather unavailable: {error}"))
            return

        self._root.after(0, lambda: self._show_report(report))

    def _set_loading(self, loading: bool) -> None:
        if self._search_button is not None:
            self._search_button.configure(state=tk.DISABLED if loading else tk.NORMAL)
        self._status_var.set("Loading weather..." if loading else "Ready.")

    def _show_report(self, report: WeatherReport) -> None:
        self._location_var.set(f"{report.city}, {report.country}")
        self._condition_var.set(report.condition)
        self._temperature_var.set(report.temperature_label)
        self._feels_like_var.set(report.feels_like_label)
        self._humidity_var.set(report.humidity_label)
        self._wind_var.set(report.wind_label)
        self._updated_var.set(report.observation_time.strftime("%Y-%m-%d %H:%M"))
        self._source_var.set(report.source)
        self._status_var.set("Weather loaded.")
        self._set_loading(False)

    def _show_error(self, message: str) -> None:
        self._status_var.set(message)
        self._set_loading(False)
