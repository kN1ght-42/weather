import getWeather from "../api/weather-api.js";

export default async function weatherService(cities: string[], days: number) {
  const data = await getWeather(cities, days);

  return data;
}
