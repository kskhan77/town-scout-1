"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  FLINT_MI,
  describeWeatherCode,
  fetchOpenMeteoCurrent,
} from "@/lib/localFeed/weather";

type NewsArticle = {
  title: string;
  url: string;
  source?: string;
  publishedAt?: string;
};

type WeatherSnap = {
  temp: number;
  feels?: number;
  emoji: string;
  label: string;
};

export function LocalPulseWidget() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherSnap | null>(null);
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(false);
  const newsFetched = useRef(false);

  const refreshWeather = useCallback(
    async (lat: number, lon: number, showLoading: boolean) => {
      if (showLoading) setWeatherLoading(true);
      try {
        const current = await fetchOpenMeteoCurrent(lat, lon);
        if (current) {
          const { label, emoji } = describeWeatherCode(current.weather_code);
          setWeather({
            temp: Math.round(current.temperature_2m),
            feels:
              current.apparent_temperature !== undefined
                ? Math.round(current.apparent_temperature)
                : undefined,
            emoji,
            label,
          });
        }
      } finally {
        if (showLoading) setWeatherLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void refreshWeather(FLINT_MI.lat, FLINT_MI.lon, true);
  }, [refreshWeather]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void refreshWeather(
          pos.coords.latitude,
          pos.coords.longitude,
          false,
        );
      },
      () => {},
      {
        enableHighAccuracy: false,
        timeout: 15_000,
        maximumAge: 600_000,
      },
    );
  }, [refreshWeather]);

  useEffect(() => {
    if (!open || newsFetched.current) return;
    newsFetched.current = true;
    setNewsLoading(true);
    setNewsError(false);
    fetch("/api/local-news")
      .then((r) => r.json())
      .then((d: { articles?: NewsArticle[] }) => {
        setNewsItems(Array.isArray(d.articles) ? d.articles : []);
      })
      .catch(() => {
        setNewsError(true);
        setNewsItems([]);
      })
      .finally(() => setNewsLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const tempDisplay = weatherLoading
    ? "…"
    : weather
      ? `${weather.temp}°`
      : "—";

  return (
    <div
      className="fixed z-[100] flex flex-col items-end gap-2"
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        right: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      {open ? (
        <div
          id={panelId}
          role="region"
          aria-label="Around you — weather and Flint-area headlines"
          className="w-[min(calc(100vw-2rem),20rem)] max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white/98 p-4 shadow-2xl shadow-[#002d5b]/15 ring-1 ring-slate-900/5 backdrop-blur-md"
        >
          <div className="mb-3 flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0ea5c4]">
                Around you
              </p>
              <h2 className="text-base font-bold text-[#002d5b]">
                Weather & local pulse
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 rounded-xl bg-gradient-to-br from-[#e8f6fa] to-slate-50 px-3 py-3">
            {weatherLoading ? (
              <p className="text-sm text-slate-600">Loading weather…</p>
            ) : weather ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-3xl" aria-hidden>
                    {weather.emoji}
                  </span>
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-[#002d5b]">
                      {weather.temp}°F
                    </p>
                    <p className="text-xs font-medium text-slate-600">
                      {weather.label}
                      {weather.feels !== undefined
                        ? ` · Feels ${weather.feels}°`
                        : null}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] leading-snug text-slate-500">
                  Location uses your device when allowed; otherwise Flint,
                  Michigan. Weather from Open-Meteo.
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-600">Weather unavailable.</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Flint area — headlines
            </p>
            {newsLoading ? (
              <p className="text-sm text-slate-600">Loading news…</p>
            ) : newsError ? (
              <p className="text-sm text-slate-600">
                Couldn&apos;t load headlines. Try again later.
              </p>
            ) : newsItems.length === 0 ? (
              <p className="text-sm text-slate-600">No articles right now.</p>
            ) : (
              <ul className="space-y-2">
                {newsItems.map((a, i) => (
                  <li key={`${a.url}-${i}`}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-transparent px-1 py-1.5 text-left text-sm leading-snug text-[#002d5b] transition hover:border-slate-200 hover:bg-slate-50"
                    >
                      <span className="font-medium text-slate-800">
                        {a.title}
                      </span>
                      {a.source ? (
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {a.source}
                        </span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-3.5 py-2.5 text-left shadow-lg shadow-[#002d5b]/12 ring-1 ring-slate-900/5 backdrop-blur-md transition hover:brightness-[1.02] active:scale-[0.98]"
      >
        <span className="text-2xl leading-none" aria-hidden>
          {weather?.emoji ?? "🌤️"}
        </span>
        <span className="min-w-[2.75rem] text-base font-bold tabular-nums text-[#002d5b]">
          {tempDisplay}
        </span>
        <span className="sr-only">
          {weather && !weatherLoading
            ? `${weather.temp}°F, ${weather.label}. `
            : ""}
          {open ? "Close" : "Open"} local weather and Flint-area news panel.
        </span>
      </button>
    </div>
  );
}
