import { CityCoordinates } from "../types/weather";

async function getCity(city: string) {
  let cityResult = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=ru&format=json`,
  );

  if (!cityResult.ok) {
    throw new Error(`API error: ${cityResult.status}`);
  }

  const data = await cityResult.json();

  return data;
}

async function getCords(cities: string[]) {
  const results = await Promise.allSettled(cities.map((city) => getCity(city)));

  const data: CityCoordinates[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      if (result.value.results?.[0]) {
        const city = result.value.results[0];

        data.push({
          status: "success",
          city: city.name,
          lat: city.latitude,
          lon: city.longitude,
        });
      } else {
        data.push({
          status: "not-found",
        });
      }
    } else {
      data.push({
        status: "not-found",
      });
    }
  });

  return data;
}

export default async function getWeather(cities: string[]) {
  let cords = await getCords(cities);

  const data = await Promise.allSettled(
    cords.map(async (cord) => {
      if (cord.status === "success") {
        const cityResult = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${cord.lat}&longitude=${cord.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=3&timezone=auto`,
        );

        const weather = await cityResult.json();

        return weather;
      } else {
        console.log("Ошибка");
      }
    }),
  );

  return data;
}
