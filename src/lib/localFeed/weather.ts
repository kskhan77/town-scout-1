/** Open-Meteo WMO weather interpretation (https://open-meteo.com/en/docs). */
export function describeWeatherCode(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: "Clear", emoji: "☀️" };
  if (code === 1) return { label: "Mostly clear", emoji: "🌤️" };
  if (code === 2) return { label: "Partly cloudy", emoji: "⛅" };
  if (code === 3) return { label: "Overcast", emoji: "☁️" };
  if (code >= 45 && code <= 48) return { label: "Foggy", emoji: "🌫️" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", emoji: "🌦️" };
  if (code >= 61 && code <= 67) return { label: "Rain", emoji: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "Snow", emoji: "❄️" };
  if (code >= 80 && code <= 82) return { label: "Showers", emoji: "🌧️" };
  if (code >= 85 && code <= 86) return { label: "Snow showers", emoji: "❄️" };
  if (code >= 95) return { label: "Thunderstorm", emoji: "⛈️" };
  return { label: "Mixed", emoji: "🌤️" };
}

export const FLINT_MI = { lat: 43.0125, lon: -83.6875 };

export type OpenMeteoCurrent = {
  temperature_2m: number;
  weather_code: number;
  apparent_temperature?: number;
};

export async function fetchOpenMeteoCurrent(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<OpenMeteoCurrent | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,weather_code,apparent_temperature",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal,
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    current?: OpenMeteoCurrent;
  };
  return data.current ?? null;
}
