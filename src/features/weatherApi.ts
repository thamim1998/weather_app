// src/api/weatherApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { Coordinates, ForecastData, GeocodingData, WeatherData } from "@/api/types";
import { weatherAPI } from "@/api/weather";

// Custom base query that uses your existing weatherAPI methods
const customBaseQuery = async (args: { endpoint: keyof typeof weatherAPI; coordinates: Coordinates }) => {
  try {
    const data = await weatherAPI[args.endpoint](args.coordinates);
    return { data };
  } catch (error) {
    return { error };
  }
};

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: customBaseQuery,
  keepUnusedDataFor: 60 * 60, // Keep unused data for 1 hour
  refetchOnMountOrArgChange: 60 * 5, // Refetch if cache is older than 
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<WeatherData, Coordinates>({
      query: (coordinates) => ({
        endpoint: "getCurrentWeather",
        coordinates,
      }),
    }),
    getCurrentForecast: builder.query<ForecastData, Coordinates>({
      query: (coordinates) => ({
        endpoint: "getForecast",
        coordinates,
      }),
    }),
    getReverseGeocode: builder.query<GeocodingData[], Coordinates>({
      query: (coordinates) => ({
        endpoint: "reverseGeocode",
        coordinates,
      }),
    }),
  }),
});

export const {
  useGetCurrentWeatherQuery,
  useGetCurrentForecastQuery,
  useGetReverseGeocodeQuery
} = weatherApi;
