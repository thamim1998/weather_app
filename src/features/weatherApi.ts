import { createApi } from "@reduxjs/toolkit/query/react";
import type { Coordinates, ForecastData, GeocodingData, WeatherData } from "@/api/types";
import { weatherAPI } from "@/api/weather";

// Custom base query that uses weatherAPI methods
const customBaseQuery = async (args: { endpoint: keyof typeof weatherAPI; coordinates?: Coordinates; query?: string }) => {
  try {
    let data;
    if (args.endpoint === "searchLocation") {
      data = await weatherAPI[args.endpoint](args.query!);
    } else {
      data = await weatherAPI[args.endpoint](args.coordinates!);
    }
    return { data };
  } catch (error) {
    return { error };
  }
};

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: customBaseQuery, //baseurl
  keepUnusedDataFor: 60 * 60, 
  refetchOnMountOrArgChange: 60 * 60,
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
    searchLocation: builder.query<GeocodingData[], string>({
      query: (query) => ({
        endpoint: "searchLocation",
        query
      })
    })
  }),
});

export const {
  useGetCurrentWeatherQuery,
  useGetCurrentForecastQuery,
  useGetReverseGeocodeQuery,
  useSearchLocationQuery
} = weatherApi;
