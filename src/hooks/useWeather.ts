// src/hooks/useWeather.ts
import { useGetCurrentForecastQuery, useGetCurrentWeatherQuery, useGetReverseGeocodeQuery, useSearchLocationQuery } from "../features/weatherApi";
import type { Coordinates } from "@/api/types";

export function useWeatherQuery(coordinates: Coordinates | null) {
  return useGetCurrentWeatherQuery(coordinates ?? { lat: 0, lon: 0 }, {
    skip: !coordinates,
  });
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useGetCurrentForecastQuery(coordinates ?? { lat: 0, lon: 0 }, {
    skip: !coordinates,
  });
}

export function useGeocodeQuery(coordinates: Coordinates | null) {
  return useGetReverseGeocodeQuery(coordinates ?? { lat: 0, lon: 0 }, {
    skip: !coordinates,
  });
}

export function useCustomSearchLocationQuery(location: string) {
  return useSearchLocationQuery(
    location ?? "paris", {
      skip: !location, }
  );
}
