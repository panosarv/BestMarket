import { createContext } from "react";

export const WeatherContext = createContext({
   weatherData: { lat: null, lng: null, condition: '' },
   setWeatherData: () => {},
});