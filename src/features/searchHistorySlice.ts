// searchHistorySlice.ts
import { SearchHistoryItem } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SearchHistoryItem[] = [];

const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<Omit<SearchHistoryItem, "id" | "searchedAt">>) => {
      const newSearch: SearchHistoryItem = {
        ...action.payload,
        id: `${action.payload.lat}-${action.payload.lon}-${Date.now()}`,
        searchedAt: Date.now(),
      };

      const filteredHistory = state.filter(
        (item) => !(item.lat === action.payload.lat && item.lon === action.payload.lon)
      );
      const newHistory = [newSearch, ...filteredHistory].slice(0, 10);

      return newHistory;
    },
    
    clearHistory: () => {
      return [];
    },
  },
});

export const { addToHistory, clearHistory } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;
