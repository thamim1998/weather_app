import {  useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Button } from "./ui/button";
import { Clock, Loader2, Search, XCircle } from "lucide-react";
import { useCustomSearchLocationQuery } from "@/hooks/useWeather";
import { CommandSeparator } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { SearchHistoryItem } from "@/api/types";
import { addToHistory, clearHistory } from "@/features/searchHistorySlice";
import { format } from "date-fns/format";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const history = useSelector((state: RootState) => state.searchHistory);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToHistory = (search: Omit<SearchHistoryItem, "id" | "searchedAt">) => {
    dispatch(addToHistory(search));
  };

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  const navigate = useNavigate();

  const { data: locations, isLoading } = useCustomSearchLocationQuery(query);

  console.log(locations);

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");

    setOpen(false);

    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);

    const searchItem: Omit<SearchHistoryItem, "id" | "searchedAt"> = {
      query: name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      name,
      country,
    };

    handleAddToHistory(searchItem);
    setQuery("");
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <Search className="mr-2 h-4 w-4" />
        Search Cities...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search cities..." value={query} onValueChange={setQuery} />
        <CommandList>
          {query.length > 2 && !isLoading && <CommandEmpty>No Cities found.</CommandEmpty>}

          {history.length > 0 && !query.length && (
            <CommandGroup heading="Recent Searches">
              <Button variant="ghost" size="sm" onClick={handleClearHistory}>
                <XCircle className="h-4 w-4" />
                Clear
              </Button>
              {history.length > 0 && history.map((city) => 
              <CommandItem key={city.lon}>
                <Clock className="mr-2 h-4 w-4 text-muted-foreground"/>{city.name}
              {city.state && (
                <span className="text-sm text-muted-foreground">,{city.state}</span>
              )}
                <span className="text-sm text-muted-foreground">, {city.country}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {format(city.searchedAt,"MMM d, h:mm a")}
                   </span>
              </CommandItem>)}
              <CommandSeparator />
            </CommandGroup>
          )}

          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations?.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>{location.name}</span>
                  {location.state && <span className="text-sm text-muted-foreground">, {location.state}</span>}
                  <span className="text-sm text-muted-foreground">, {location.country}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
