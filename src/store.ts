import { configureStore } from '@reduxjs/toolkit';

  import { weatherApi } from './features/weatherApi';

export const store = configureStore({
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;