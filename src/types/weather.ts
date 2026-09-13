export interface CityCoordinates {
  status: "success" | "not-found" | "error";
  city?: string;
  country?: string;
  lat?: number;
  lon?: number;
}

export interface WeatherDays {
  date: Date;
  min: string;
  max: string;
  precipitation: number;
}

export interface WeatherData {
  city: string;
  lat: string;
  lon: string;
  days: WeatherDays[];
}
