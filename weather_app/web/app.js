const form = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const plannerButtons = document.querySelectorAll("[data-plan]");
const worldCities = [
  { city: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276 },
  { city: "New York", country: "United States", latitude: 40.7128, longitude: -74.0060 },
  { city: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { city: "Dubai", country: "United Arab Emirates", latitude: 25.2048, longitude: 55.2708 },
  { city: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { city: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198 },
  { city: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093 },
  { city: "Istanbul", country: "Turkey", latitude: 41.0082, longitude: 28.9784 },
  { city: "Lahore", country: "Pakistan", latitude: 31.5204, longitude: 74.3587 },
  { city: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357 },
  { city: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832 },
  { city: "Cape Town", country: "South Africa", latitude: -33.9249, longitude: 18.4241 }
];
const knownLocations = {
  germany: { city: "Berlin", country: "Germany", latitude: 52.5200, longitude: 13.4050 },
  pakistan: { city: "Islamabad", country: "Pakistan", latitude: 33.6844, longitude: 73.0479 },
  india: { city: "New Delhi", country: "India", latitude: 28.6139, longitude: 77.2090 },
  china: { city: "Beijing", country: "China", latitude: 39.9042, longitude: 116.4074 },
  japan: { city: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  france: { city: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  italy: { city: "Rome", country: "Italy", latitude: 41.9028, longitude: 12.4964 },
  spain: { city: "Madrid", country: "Spain", latitude: 40.4168, longitude: -3.7038 },
  canada: { city: "Ottawa", country: "Canada", latitude: 45.4215, longitude: -75.6972 },
  australia: { city: "Canberra", country: "Australia", latitude: -35.2809, longitude: 149.1300 },
  brazil: { city: "Brasilia", country: "Brazil", latitude: -15.7939, longitude: -47.8828 },
  egypt: { city: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357 },
  turkey: { city: "Ankara", country: "Turkey", latitude: 39.9334, longitude: 32.8597 },
  "south africa": { city: "Pretoria", country: "South Africa", latitude: -25.7479, longitude: 28.2293 },
  "united kingdom": { city: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276 },
  uk: { city: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276 },
  england: { city: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276 },
  "united states": { city: "Washington", country: "United States", latitude: 38.9072, longitude: -77.0369 },
  usa: { city: "Washington", country: "United States", latitude: 38.9072, longitude: -77.0369 },
  america: { city: "Washington", country: "United States", latitude: 38.9072, longitude: -77.0369 },
  uae: { city: "Abu Dhabi", country: "United Arab Emirates", latitude: 24.4539, longitude: 54.3773 },
  "united arab emirates": { city: "Abu Dhabi", country: "United Arab Emirates", latitude: 24.4539, longitude: 54.3773 },
  "saudi arabia": { city: "Riyadh", country: "Saudi Arabia", latitude: 24.7136, longitude: 46.6753 },
  russia: { city: "Moscow", country: "Russia", latitude: 55.7558, longitude: 37.6173 },
  bangladesh: { city: "Dhaka", country: "Bangladesh", latitude: 23.8103, longitude: 90.4125 },
  indonesia: { city: "Jakarta", country: "Indonesia", latitude: -6.2088, longitude: 106.8456 },
  malaysia: { city: "Kuala Lumpur", country: "Malaysia", latitude: 3.1390, longitude: 101.6869 },
  singapore: { city: "Singapore", country: "Singapore", latitude: 1.3521, longitude: 103.8198 },
  thailand: { city: "Bangkok", country: "Thailand", latitude: 13.7563, longitude: 100.5018 },
  iran: { city: "Tehran", country: "Iran", latitude: 35.6892, longitude: 51.3890 },
  iraq: { city: "Baghdad", country: "Iraq", latitude: 33.3152, longitude: 44.3661 },
  afghanistan: { city: "Kabul", country: "Afghanistan", latitude: 34.5553, longitude: 69.2075 },
  nepal: { city: "Kathmandu", country: "Nepal", latitude: 27.7172, longitude: 85.3240 },
  sri_lanka: { city: "Colombo", country: "Sri Lanka", latitude: 6.9271, longitude: 79.8612 },
  "sri lanka": { city: "Colombo", country: "Sri Lanka", latitude: 6.9271, longitude: 79.8612 },
  mexico: { city: "Mexico City", country: "Mexico", latitude: 19.4326, longitude: -99.1332 },
  argentina: { city: "Buenos Aires", country: "Argentina", latitude: -34.6037, longitude: -58.3816 },
  nigeria: { city: "Abuja", country: "Nigeria", latitude: 9.0765, longitude: 7.3986 },
  kenya: { city: "Nairobi", country: "Kenya", latitude: -1.2921, longitude: 36.8219 },
  murree: { city: "Murree", country: "Pakistan", latitude: 33.9070, longitude: 73.3943 },
  lahore: { city: "Lahore", country: "Pakistan", latitude: 31.5204, longitude: 74.3587 },
  karachi: { city: "Karachi", country: "Pakistan", latitude: 24.8607, longitude: 67.0011 },
  islamabad: { city: "Islamabad", country: "Pakistan", latitude: 33.6844, longitude: 73.0479 },
  faisalabad: { city: "Faisalabad", country: "Pakistan", latitude: 31.4504, longitude: 73.1350 },
  faislabad: { city: "Faisalabad", country: "Pakistan", latitude: 31.4504, longitude: 73.1350 },
  multan: { city: "Multan", country: "Pakistan", latitude: 30.1575, longitude: 71.5249 },
  peshawar: { city: "Peshawar", country: "Pakistan", latitude: 34.0151, longitude: 71.5249 },
  quetta: { city: "Quetta", country: "Pakistan", latitude: 30.1798, longitude: 66.9750 },
  sialkot: { city: "Sialkot", country: "Pakistan", latitude: 32.4945, longitude: 74.5229 },
  gujranwala: { city: "Gujranwala", country: "Pakistan", latitude: 32.1877, longitude: 74.1945 },
  hyderabad: { city: "Hyderabad", country: "Pakistan", latitude: 25.3960, longitude: 68.3578 },
  kasur: { city: "Kasur", country: "Pakistan", latitude: 31.1187, longitude: 74.4500 },
  sheikhupura: { city: "Sheikhupura", country: "Pakistan", latitude: 31.7131, longitude: 73.9783 },
  okara: { city: "Okara", country: "Pakistan", latitude: 30.8138, longitude: 73.4534 },
  sahiwal: { city: "Sahiwal", country: "Pakistan", latitude: 30.6682, longitude: 73.1114 },
  bahawalpur: { city: "Bahawalpur", country: "Pakistan", latitude: 29.3956, longitude: 71.6836 },
  rahim_yar_khan: { city: "Rahim Yar Khan", country: "Pakistan", latitude: 28.4202, longitude: 70.2952 },
  "rahim yar khan": { city: "Rahim Yar Khan", country: "Pakistan", latitude: 28.4202, longitude: 70.2952 },
  london: { city: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276 },
  tokyo: { city: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  "new york": { city: "New York", country: "United States", latitude: 40.7128, longitude: -74.0060 },
  dubai: { city: "Dubai", country: "United Arab Emirates", latitude: 25.2048, longitude: 55.2708 }
};
const weatherCodes = {
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
  99: "Thunderstorm with heavy hail"
};
let activePlan = "outdoor";
let latestData = null;
let activeRequestId = 0;
let worldWeatherStarted = false;
let activeCityLoading = false;
let currentWorldController = null;

const elements = {
  location: document.querySelector("#location"),
  condition: document.querySelector("#condition"),
  temperature: document.querySelector("#temperature"),
  feelsLike: document.querySelector("#feelsLike"),
  humidity: document.querySelector("#humidity"),
  wind: document.querySelector("#wind"),
  forecastGrid: document.querySelector("#forecastGrid"),
  worldGrid: document.querySelector("#worldGrid"),
  updatedAt: document.querySelector("#updatedAt"),
  plannerTitle: document.querySelector("#plannerTitle"),
  plannerSummary: document.querySelector("#plannerSummary"),
  plannerResult: document.querySelector("#plannerResult"),
  bestDay: document.querySelector("#bestDay"),
  bestDayText: document.querySelector("#bestDayText"),
  rainDay: document.querySelector("#rainDay"),
  rainDayText: document.querySelector("#rainDayText"),
  source: document.querySelector("#source")
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadWeather(cityInput.value.trim() || "Lahore");
});

plannerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    plannerButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activePlan = button.dataset.plan;
    updatePlanner();
  });
});

async function loadWeather(city) {
  const requestId = ++activeRequestId;
  activeCityLoading = true;
  if (currentWorldController) {
    currentWorldController.abort();
    currentWorldController = null;
  }
  setLoading(city);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 18000);

  try {
    const data = await fetchWeatherWithFallback(city, controller.signal);
    if (requestId !== activeRequestId) {
      return;
    }
    latestData = data;
    renderWeather(data);
  } catch (error) {
    if (requestId !== activeRequestId) {
      return;
    }
    const message = error.name === "AbortError"
      ? "Live weather request took too long. Check your internet connection and search again."
      : error.message;
    latestData = null;
    elements.location.textContent = city;
    elements.condition.textContent = message;
    elements.temperature.textContent = "-- C";
    elements.feelsLike.textContent = "-- C";
    elements.humidity.textContent = "--%";
    elements.wind.textContent = "-- km/h";
    elements.forecastGrid.innerHTML = `
      <article class="forecast-card error-card">
        <strong>Live data unavailable</strong>
        <span>No offline weather is being shown</span>
        <p>${message}</p>
      </article>
    `;
    elements.updatedAt.textContent = "Live update failed";
    elements.bestDay.textContent = "--";
    elements.bestDayText.textContent = "Connect to the internet and search again.";
    elements.rainDay.textContent = "--";
    elements.rainDayText.textContent = "Rain watch needs live forecast data.";
    elements.source.textContent = "No fake data";
    elements.plannerTitle.textContent = "Live data needed";
    elements.plannerSummary.textContent = "The planner only works with real forecast data.";
    elements.plannerResult.textContent = "Try another city or run the Python server again.";
  } finally {
    window.clearTimeout(timeoutId);
    if (requestId === activeRequestId) {
      activeCityLoading = false;
    }
  }
}

async function fetchWeatherWithFallback(city, signal) {
  const cleanedCity = cleanSearchInput(city);
  try {
    return await fetchBackendWeather(cleanedCity, signal);
  } catch (backendError) {
    try {
      return await fetchLiveWeather(cleanedCity, signal);
    } catch (_directError) {
      throw backendError;
    }
  }
}

async function fetchBackendWeather(city, signal) {
  const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
    signal,
    cache: "no-store"
  });
  const payload = await response.json();
  if (!payload.ok) {
    throw new Error(payload.error || "Could not load weather.");
  }
  return payload.data;
}

async function loadWorldWeather() {
  if (!elements.worldGrid || worldWeatherStarted) {
    return;
  }
  worldWeatherStarted = true;

  elements.worldGrid.innerHTML = worldCities.map((location) => `
    <article class="world-card">
      <strong>${location.city}</strong>
      <span>Loading live weather...</span>
    </article>
  `).join("");

  const results = [];
  for (const location of worldCities) {
    while (activeCityLoading) {
      await delay(1000);
    }
    results.push(await settleWorldCity(location));
    elements.worldGrid.innerHTML = renderWorldResults(results);
  }
}

async function settleWorldCity(location) {
  try {
    return { status: "fulfilled", value: await fetchWorldCity(location) };
  } catch (error) {
    return { status: "rejected", reason: error };
  }
}

function renderWorldResults(results) {
  return results.map((result, index) => {
    if (result.status !== "fulfilled") {
      return `
        <article class="world-card">
          <strong>${worldCities[index].city}</strong>
          <span>Live update unavailable</span>
          <p>Try again after checking internet.</p>
        </article>
      `;
    }

    const item = result.value;
    return `
      <article class="world-card">
        <strong>${item.city}, ${item.country}</strong>
        <div class="world-temp">${item.temperature}</div>
        <span>${item.condition}</span>
        <p>Humidity ${item.humidity} | Wind ${item.wind}</p>
      </article>
    `;
  }).join("") + worldCities.slice(results.length).map((location) => `
    <article class="world-card">
      <strong>${location.city}</strong>
      <span>Waiting for live update...</span>
    </article>
  `).join("");
}

async function fetchWorldCity(location) {
  const controller = new AbortController();
  currentWorldController = controller;
  const timeoutId = window.setTimeout(() => controller.abort(), 18000);
  try {
    const payload = await fetchForecastByCoordinates(location, controller.signal);
    const data = normalizeOpenMeteo(location, payload);
    return {
      city: data.current.city,
      country: data.current.country,
      temperature: data.current.temperature_label,
      condition: data.current.condition,
      humidity: data.current.humidity_label,
      wind: data.current.wind_label
    };
  } finally {
    window.clearTimeout(timeoutId);
    if (currentWorldController === controller) {
      currentWorldController = null;
    }
  }
}

async function fetchLiveWeather(city, signal) {
  const cleanedCity = cleanSearchInput(city);
  const knownLocation = knownLocations[normalizeSearch(cleanedCity)] || findKnownLocationFromParts(cleanedCity);
  if (knownLocation) {
    const payload = await fetchForecastByCoordinates(knownLocation, signal);
    return normalizeOpenMeteo(knownLocation, payload);
  }

  const location = await geocodeAnyPlace(cleanedCity, signal);
  if (!location) {
    throw new Error(`No live weather location found for "${cleanedCity}".`);
  }

  const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
  const forecastPayload = await fetchForecastByCoordinates(location, signal);
  return normalizeOpenMeteo(location, forecastPayload);
}

async function geocodeAnyPlace(value, signal) {
  const queries = buildSearchQueries(value);

  for (const query of queries) {
    const location = knownLocations[normalizeSearch(query)] || await geocodeQuery(query, signal);
    if (location) {
      return location;
    }
  }

  return null;
}

async function geocodeQuery(query, signal) {
  const geocodeUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geocodeUrl.search = new URLSearchParams({
    name: query,
    count: "10",
    language: "en",
    format: "json"
  });

  const locationPayload = await fetchJsonWithRetry(geocodeUrl, signal, "Could not reach the live location service.");
  const results = locationPayload.results || [];
  return chooseBestLocation(results, query);
}

function buildSearchQueries(value) {
  const normalized = normalizeSearch(value);
  const parts = normalized
    .split(/[,/|]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const words = normalized
    .split(/\s+/)
    .filter((word) => word.length > 2);

  return [...new Set([normalized, ...parts, ...words])].filter(Boolean);
}

function chooseBestLocation(results, query) {
  if (!results.length) {
    return null;
  }

  const normalizedQuery = normalizeSearch(query);
  const exact = results.find((item) => normalizeSearch(item.name || "") === normalizedQuery);
  if (exact) {
    return exact;
  }

  const populatedPlace = results.find((item) => String(item.feature_code || "").toUpperCase().startsWith("PPL"));
  return populatedPlace || results[0];
}

function normalizeSearch(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function cleanSearchInput(value) {
  const normalized = normalizeSearch(value);
  const parts = normalized
    .split(/[,/|]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1 && knownLocations[parts[0]]) {
    return parts[0];
  }

  return normalized;
}

function findKnownLocationFromParts(value) {
  const parts = normalizeSearch(value)
    .split(/[,/|]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (knownLocations[part]) {
      return knownLocations[part];
    }
  }

  return null;
}

async function fetchForecastByCoordinates(location, signal) {
  const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
  forecastUrl.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_probability_max,wind_speed_10m_max,uv_index_max",
    timezone: "auto",
    forecast_days: "7"
  });

  return fetchJsonWithRetry(forecastUrl, signal, "Could not reach the live forecast service.");
}

async function fetchJsonWithRetry(url, parentSignal, errorMessage) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    if (parentSignal.aborted) {
      throw new DOMException("Request aborted", "AbortError");
    }

    const attemptController = new AbortController();
    const timeoutId = window.setTimeout(() => attemptController.abort(), 9000);
    const abortAttempt = () => attemptController.abort();
    parentSignal.addEventListener("abort", abortAttempt, { once: true });

    try {
      const requestUrl = new URL(url.toString());
      requestUrl.searchParams.set("_", `${Date.now()}-${attempt}`);
      const response = await fetch(requestUrl, {
        signal: attemptController.signal,
        cache: "no-store"
      });
      if (!response.ok) {
        throw new Error(errorMessage);
      }
      return response.json();
    } catch (error) {
      lastError = error;
      if (parentSignal.aborted) {
        throw error;
      }
      await delay(500 * attempt);
    } finally {
      window.clearTimeout(timeoutId);
      parentSignal.removeEventListener("abort", abortAttempt);
    }
  }

  if (lastError?.name === "AbortError") {
    throw new Error(`${errorMessage} Please try again.`);
  }
  throw lastError || new Error(errorMessage);
}

function normalizeOpenMeteo(location, payload) {
  const current = payload.current;
  const forecast = payload.daily.time.map((day, index) => {
    const minC = Number(payload.daily.temperature_2m_min[index]);
    const maxC = Number(payload.daily.temperature_2m_max[index]);
    const apparentMax = Number(payload.daily.apparent_temperature_max[index]);
    const averageC = (minC + maxC) / 2;
    const humidity = estimateHumidity(maxC, apparentMax);
    const item = {
      date: day,
      min_c: minC,
      max_c: maxC,
      average_c: averageC,
      humidity,
      wind_kph: Number(payload.daily.wind_speed_10m_max[index]),
      chance_of_rain: Number(payload.daily.precipitation_probability_max[index] || 0),
      uv_index: Math.round(Number(payload.daily.uv_index_max[index] || 0)),
      condition: describeWeather(Number(payload.daily.weather_code[index]))
    };
    item.day_name = formatDayName(item.date);
    item.short_date = formatShortDate(item.date);
    item.comfort_score = comfortScore(item);
    item.plan_label = planLabel(item);
    item.outfit_tip = outfitTip(item);
    return item;
  });

  const bestDay = [...forecast].sort((a, b) => b.comfort_score - a.comfort_score)[0];
  const rainiestDay = [...forecast].sort((a, b) => b.chance_of_rain - a.chance_of_rain)[0];

  return {
    current: {
      city: location.name || location.city,
      country: location.country,
      temperature_c: Number(current.temperature_2m),
      feels_like_c: Number(current.apparent_temperature),
      humidity: Number(current.relative_humidity_2m),
      wind_kph: Number(current.wind_speed_10m),
      condition: describeWeather(Number(current.weather_code)),
      observation_time: current.time,
      source: "Open-Meteo live forecast",
      temperature_label: `${Number(current.temperature_2m).toFixed(1)} C`,
      feels_like_label: `${Number(current.apparent_temperature).toFixed(1)} C`,
      humidity_label: `${Number(current.relative_humidity_2m)}%`,
      wind_label: `${Number(current.wind_speed_10m).toFixed(1)} km/h`
    },
    forecast,
    best_day: bestDay,
    rainiest_day: rainiestDay,
    week_summary: `${bestDay.day_name} looks best for outdoor plans with a ${bestDay.comfort_score}/100 comfort score. Keep an eye on ${rainiestDay.day_name}, where rain chance reaches ${rainiestDay.chance_of_rain}%.`
  };
}

function describeWeather(code) {
  return weatherCodes[code] || `Weather code ${code}`;
}

function estimateHumidity(temperatureC, apparentC) {
  const difference = apparentC - temperatureC;
  return Math.max(20, Math.min(95, Math.round(55 + difference * 8)));
}

function comfortScore(day) {
  const tempPenalty = Math.min(Math.abs(day.average_c - 22) * 3, 35);
  const rainPenalty = day.chance_of_rain * 0.25;
  const humidityPenalty = Math.max(day.humidity - 60, 0) * 0.25;
  const windPenalty = Math.max(day.wind_kph - 18, 0) * 0.4;
  return Math.max(1, Math.min(100, Math.round(100 - tempPenalty - rainPenalty - humidityPenalty - windPenalty)));
}

function planLabel(day) {
  if (day.chance_of_rain >= 70) {
    return "Indoor focus";
  }
  if (day.uv_index >= 8) {
    return "Early outdoor window";
  }
  if (day.comfort_score >= 78) {
    return "Best day to go out";
  }
  if (day.wind_kph >= 28) {
    return "Wind-aware plans";
  }
  return "Flexible day";
}

function outfitTip(day) {
  if (day.max_c >= 34) {
    return "Light breathable clothes, water, and shade.";
  }
  if (day.min_c <= 12) {
    return "Layer up and keep a warmer outer layer nearby.";
  }
  if (day.chance_of_rain >= 55) {
    return "Carry an umbrella or rain jacket.";
  }
  return "Comfortable casual outfit should work well.";
}

function formatDayName(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString([], { weekday: "long" });
}

function formatShortDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString([], { month: "short", day: "numeric" });
}

function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function setLoading(city) {
  latestData = null;
  elements.location.textContent = city;
  elements.condition.textContent = "Loading forecast...";
  elements.temperature.textContent = "-- C";
  elements.feelsLike.textContent = "-- C";
  elements.humidity.textContent = "--%";
  elements.wind.textContent = "-- km/h";
  elements.updatedAt.textContent = "Loading live update...";
  elements.bestDay.textContent = "--";
  elements.bestDayText.textContent = "Waiting for live forecast data.";
  elements.rainDay.textContent = "--";
  elements.rainDayText.textContent = "Waiting for rain prediction.";
  elements.source.textContent = "Loading";
  elements.plannerTitle.textContent = "Loading planner";
  elements.plannerSummary.textContent = "Reading live weather patterns.";
  elements.plannerResult.textContent = "Please wait for the real forecast.";
  elements.forecastGrid.innerHTML = `
    <article class="forecast-card loading-card">
      <strong>Loading live forecast</strong>
      <span>Connecting to Open-Meteo</span>
      <p>No offline weather is displayed.</p>
    </article>
  `;
}

function renderWeather(data) {
  const current = data.current;
  elements.location.textContent = `${current.city}, ${current.country}`;
  elements.condition.textContent = current.condition;
  elements.temperature.textContent = current.temperature_label;
  elements.feelsLike.textContent = current.feels_like_label;
  elements.humidity.textContent = current.humidity_label;
  elements.wind.textContent = current.wind_label;
  elements.source.textContent = current.source;
  elements.updatedAt.textContent = `Updated ${formatDateTime(current.observation_time)}`;

  elements.bestDay.textContent = `${data.best_day.day_name} (${data.best_day.comfort_score}/100)`;
  elements.bestDayText.textContent = `${data.best_day.condition}. ${data.best_day.outfit_tip}`;
  elements.rainDay.textContent = `${data.rainiest_day.day_name} (${data.rainiest_day.chance_of_rain}%)`;
  elements.rainDayText.textContent = `${data.rainiest_day.condition}. Keep flexible plans ready.`;

  elements.forecastGrid.innerHTML = data.forecast.map(renderForecastCard).join("");
  updatePlanner();
}

function renderForecastCard(day) {
  return `
    <article class="forecast-card">
      <strong>${day.day_name}</strong>
      <span>${day.short_date}</span>
      <div class="forecast-icon">${weatherSymbol(day)}</div>
      <strong>${Math.round(day.min_c)}-${Math.round(day.max_c)} C</strong>
      <span>${day.condition}</span>
      <div>
        <span>Comfort ${day.comfort_score}/100</span>
        <div class="score-bar" style="--score: ${day.comfort_score}%"><i></i></div>
      </div>
      <p>${day.plan_label}</p>
      <p>${day.outfit_tip}</p>
    </article>
  `;
}

function weatherSymbol(day) {
  const text = day.condition.toLowerCase();
  if (day.chance_of_rain >= 55 || text.includes("rain") || text.includes("shower")) {
    return "RAIN";
  }
  if (text.includes("cloud") || text.includes("overcast")) {
    return "CLD";
  }
  if (day.uv_index >= 7 || text.includes("sun")) {
    return "SUN";
  }
  return "SKY";
}

function updatePlanner() {
  if (!latestData) {
    return;
  }

  const days = latestData.forecast;
  let chosen;
  let detail;

  if (activePlan === "commute") {
    chosen = [...days].sort((a, b) => {
      const riskA = a.chance_of_rain + Math.max(a.wind_kph - 15, 0) * 2;
      const riskB = b.chance_of_rain + Math.max(b.wind_kph - 15, 0) * 2;
      return riskA - riskB;
    })[0];
    detail = `${chosen.day_name} has the lowest travel friction: ${chosen.chance_of_rain}% rain chance and ${chosen.wind_kph} km/h wind.`;
  } else if (activePlan === "laundry") {
    chosen = [...days].sort((a, b) => {
      const dryA = a.chance_of_rain + a.humidity - a.max_c;
      const dryB = b.chance_of_rain + b.humidity - b.max_c;
      return dryA - dryB;
    })[0];
    detail = `${chosen.day_name} is the strongest drying window: ${chosen.max_c} C high, ${chosen.humidity}% humidity, ${chosen.chance_of_rain}% rain chance.`;
  } else {
    chosen = latestData.best_day;
    detail = `${chosen.day_name} is the outdoor pick with ${chosen.comfort_score}/100 comfort. ${chosen.outfit_tip}`;
  }

  elements.plannerTitle.textContent = `${chosen.day_name} is your best match`;
  elements.plannerSummary.textContent = latestData.week_summary;
  elements.plannerResult.textContent = detail;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function boot() {
  await loadWeather(cityInput.value);
  window.setTimeout(loadWorldWeather, 8000);
}

boot();
