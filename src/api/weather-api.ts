import errorMessage from "../format/error.js";
import type { CityCoordinates } from "../types/weather.js";
import "dotenv/config";

async function getCity(city: string) {
  let cityResult = await fetch(
    `${process.env.GEOCODING_URL}?name=${city}&count=1&language=ru&format=json`,
  );

  if (!cityResult.ok) {
    errorMessage("Ошибка API", cityResult.status);
  }

  const data = await cityResult.json();

  return data;
}

async function getCoords(cities: string[]) {
  const results = await Promise.allSettled(cities.map((city) => getCity(city)));

  const data: CityCoordinates[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      if (result.value.results?.[0]) {
        const city = result.value.results[0];

        data.push({
          status: "success",
          city: city.name,
          country: city.country,
          lat: city.latitude,
          lon: city.longitude,
        });
      } else {
        data.push({
          status: "not-found",
        });
      }
    }
  });

  return data;
}

export default async function getWeather(cities: string[], days: number) {
  let cords = await getCoords(cities);

  const data = await Promise.allSettled(
    cords.map(async (cord) => {
      if (cord.status === "success") {
        const cityResult = await fetch(
          `${process.env.FORECAST_URL}?latitude=${cord.lat}&longitude=${cord.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=${days}&timezone=auto`,
        );

        const weather = await cityResult.json();

        return {
          city: cord.city,
          country: cord.country,
          lat: cord.lat,
          lon: cord.lon,
          days: weather.daily.time.map((date: string, index: number) => ({
            date,
            min: weather.daily.temperature_2m_min[index],
            max: weather.daily.temperature_2m_max[index],
            precipitation: weather.daily.precipitation_sum[index],
          })),
        };
      } else {
        console.error(`Ошибка: некорректное название города`);
      }
    }),
  );

  return data;
}
