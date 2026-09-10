// ---------------------------------------------------------------
// Weather Dashboard
// Fetches live data from Open-Meteo's free, keyless REST APIs:
//   1. Geocoding API  — resolves a city name to coordinates
//   2. Forecast API   — returns current conditions + a daily outlook
// ---------------------------------------------------------------

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 8000;

// WMO weather codes -> human-readable label + icon.
// https://open-meteo.com/en/docs (see "WMO Weather interpretation codes")
const WEATHER_CODES = {
  0: ['Clear sky', '☀️'],
  1: ['Mainly clear', '🌤️'],
  2: ['Partly cloudy', '⛅'],
  3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'],
  48: ['Depositing rime fog', '🌫️'],
  51: ['Light drizzle', '🌦️'],
  53: ['Moderate drizzle', '🌦️'],
  55: ['Dense drizzle', '🌦️'],
  56: ['Light freezing drizzle', '🌧️'],
  57: ['Dense freezing drizzle', '🌧️'],
  61: ['Slight rain', '🌧️'],
  63: ['Moderate rain', '🌧️'],
  65: ['Heavy rain', '🌧️'],
  66: ['Light freezing rain', '🌧️'],
  67: ['Heavy freezing rain', '🌧️'],
  71: ['Slight snow fall', '🌨️'],
  73: ['Moderate snow fall', '🌨️'],
  75: ['Heavy snow fall', '🌨️'],
  77: ['Snow grains', '🌨️'],
  80: ['Slight rain showers', '🌦️'],
  81: ['Moderate rain showers', '🌦️'],
  82: ['Violent rain showers', '⛈️'],
  85: ['Slight snow showers', '🌨️'],
  86: ['Heavy snow showers', '🌨️'],
  95: ['Thunderstorm', '⛈️'],
  96: ['Thunderstorm, slight hail', '⛈️'],
  99: ['Thunderstorm, heavy hail', '⛈️'],
};

function describeWeatherCode(code) {
  return WEATHER_CODES[code] || ['Unknown conditions', '❓'];
}

function weekdayLabel(isoDate) {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

// Wraps fetch() with a timeout, since a hung request is as much a
// failure mode as a rejected one and needs its own handling.
async function fetchJSON(url, { signal } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // If the caller passed their own signal (e.g. to cancel a stale
  // search), forward its abort into our controller too.
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The request timed out. Check your connection and try again.');
    }
    if (err instanceof TypeError) {
      // fetch() throws a TypeError for network failures (offline, DNS, CORS)
      throw new Error('Network error — check your connection and try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function geocodeCity(name, signal) {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(name)}&count=5&language=en&format=json`;
  const data = await fetchJSON(url, { signal });

  if (!data.results || data.results.length === 0) {
    throw new Error(`Couldn't find "${name}". Try a different spelling or a nearby major city.`);
  }
  return data.results;
}

async function fetchForecast(latitude, longitude, timezone, signal) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: timezone || 'auto',
    forecast_days: 6,
  });

  return fetchJSON(`${FORECAST_URL}?${params.toString()}`, { signal });
}

// ---------------------------------------------------------------
// DOM wiring
// ---------------------------------------------------------------
(function () {
  const form = document.getElementById('wx-form');
  const input = document.getElementById('wx-city');
  const status = document.getElementById('wx-status');
  const picker = document.getElementById('wx-picker');
  const result = document.getElementById('wx-result');
  const chips = document.querySelectorAll('.wx-chip');
  const geoBtn = document.getElementById('wx-geo');

  if (!form) return;

  let activeController = null;

  function setStatus(message, kind) {
    status.textContent = message || '';
    status.className = 'wx-status' + (message ? ' is-visible' : '') + (kind ? ' ' + kind : '');
  }

  function hidePicker() {
    picker.innerHTML = '';
    picker.classList.remove('is-visible');
  }

  function hideResult() {
    result.classList.remove('is-visible');
  }

  function showPicker(places) {
    picker.innerHTML = '';
    places.forEach((place) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';

      const region = [place.admin1, place.country].filter(Boolean).join(', ');
      btn.innerHTML = `${place.name}<span class="place-meta">${region}</span>`;
      btn.addEventListener('click', () => loadForecastFor(place));
      li.appendChild(btn);
      picker.appendChild(li);
    });
    picker.classList.add('is-visible');
  }

  function renderResult(place, forecast) {
    const current = forecast.current;
    const daily = forecast.daily;
    const units = forecast.current_units || {};

    const [conditionLabel, conditionIcon] = describeWeatherCode(current.weather_code);

    document.getElementById('wx-icon').textContent = conditionIcon;
    document.getElementById('wx-temp').textContent =
      `${Math.round(current.temperature_2m)}${units.temperature_2m || '°C'}`;
    document.getElementById('wx-condition').textContent = conditionLabel;

    const region = [place.admin1, place.country].filter(Boolean).join(', ');
    document.getElementById('wx-place').textContent = region ? `${place.name}, ${region}` : place.name;

    document.getElementById('wx-feels-like').textContent =
      `${Math.round(current.apparent_temperature)}${units.apparent_temperature || '°C'}`;
    document.getElementById('wx-humidity').textContent =
      `${Math.round(current.relative_humidity_2m)}${units.relative_humidity_2m || '%'}`;
    document.getElementById('wx-wind').textContent =
      `${Math.round(current.wind_speed_10m)} ${units.wind_speed_10m || 'km/h'}`;

    const updated = new Date();
    document.getElementById('wx-updated').textContent =
      `Updated ${updated.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;

    // Nested daily arrays -> a 6-day outlook strip
    const dailyEl = document.getElementById('wx-daily');
    dailyEl.innerHTML = '';
    daily.time.forEach((isoDate, i) => {
      const [, icon] = describeWeatherCode(daily.weather_code[i]);
      const card = document.createElement('div');
      card.className = 'wx-day';
      card.innerHTML = `
        <div class="day-name">${i === 0 ? 'Today' : weekdayLabel(isoDate)}</div>
        <div class="day-icon" aria-hidden="true">${icon}</div>
        <div class="day-range">
          <span class="hi">${Math.round(daily.temperature_2m_max[i])}°</span>
          <span class="lo">${Math.round(daily.temperature_2m_min[i])}°</span>
        </div>`;
      dailyEl.appendChild(card);
    });

    result.classList.add('is-visible');
  }

  async function loadForecastFor(place) {
    hidePicker();
    setStatus('Loading forecast…', 'loading');
    hideResult();

    if (activeController) activeController.abort();
    activeController = new AbortController();

    try {
      const forecast = await fetchForecast(
        place.latitude,
        place.longitude,
        place.timezone,
        activeController.signal
      );
      renderResult(place, forecast);
      setStatus('');
    } catch (err) {
      setStatus(err.message || 'Something went wrong fetching the forecast.', 'error');
    }
  }

  async function searchCity(name) {
    hidePicker();
    hideResult();
    setStatus('Searching…', 'loading');

    if (activeController) activeController.abort();
    activeController = new AbortController();

    try {
      const places = await geocodeCity(name, activeController.signal);
      if (places.length === 1) {
        await loadForecastFor(places[0]);
      } else {
        setStatus(`Multiple matches for "${name}" — pick one:`, '');
        showPicker(places);
      }
    } catch (err) {
      setStatus(err.message || 'Something went wrong. Please try again.', 'error');
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = input.value.trim();
    if (!name) {
      setStatus('Type a city name to search.', 'error');
      return;
    }
    searchCity(name);
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.city;
      searchCity(chip.dataset.city);
    });
  });

  if (geoBtn && 'geolocation' in navigator) {
    geoBtn.addEventListener('click', () => {
      setStatus('Locating you…', 'loading');
      hidePicker();
      hideResult();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const place = {
            name: 'Your location',
            admin1: '',
            country: '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timezone: 'auto',
          };
          loadForecastFor(place);
        },
        () => {
          setStatus('Location access was denied or unavailable. Try searching a city instead.', 'error');
        },
        { timeout: REQUEST_TIMEOUT_MS }
      );
    });
  } else if (geoBtn) {
    geoBtn.disabled = true;
    geoBtn.title = 'Geolocation is not supported in this browser';
  }
})();
