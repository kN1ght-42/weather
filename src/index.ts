import getWeather from "./api/weather-api.js";
import errorMessage from "./format/error.js";
import weatherService from "./services/service.js";
import type { WeatherData, WeatherDays } from "./types/weather.js";

const args = process.argv.slice(2);

function getArgument(name: string) {
  const argIndex = args.indexOf(name);

  return args[argIndex + 1];
}

const citiesArg = getArgument("--city");
const daysArg = getArgument("--days");

if (!citiesArg) {
  errorMessage("Ошибка: параметр '--city' обязателен");
  process.exit(1);
}

let cities = citiesArg.split(",").map((city) => city.trim());

if (cities.length === 0) {
  errorMessage("Ошибка: укажите хотя бы один город");
  process.exit(1);
}

let days = 3;

if (daysArg) {
  days = Number(daysArg);

  if (!Number.isInteger(days) || days < 1 || days > 7) {
    console.error("Ошибка: --days должен быть целым числом от 1 до 7.");
    process.exit(1);
  }
}

const data = await weatherService(cities, days);

data.forEach((result) => {
  if (result.status === "fulfilled") {
    const weather = result.value;

    if (weather !== undefined) {
      console.log(`\n${weather.city}`);
      console.log(`Координаты: ${weather.lat}, ${weather.lon}`);

      console.table(
        weather.days.map((day: WeatherDays) => ({
          Дата: day.date,
          "Мин. °C": day.min,
          "Макс. °C": day.max,
          "Осадки, мм": day.precipitation,
        })),
      );
    }
  }
});

// console.table(table);
