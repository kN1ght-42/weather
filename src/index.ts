import errorMessage from './format/error.js'
import weatherService from './services/service.js'
import { cacheFile, fileExists, readFile } from './storage/storage.js'
import type { WeatherData, WeatherDays } from './types/weather.js'
import 'dotenv/config'

const args = process.argv.slice(2)

function getArgument(name: string) {
    const argIndex = args.indexOf(name)

    return args[argIndex + 1]
}

const citiesArg = getArgument('--city')
const daysArg = getArgument('--days')

if (!citiesArg) {
    errorMessage("Ошибка: параметр '--city' обязателен")
    process.exit(1)
}

const cities = citiesArg.split(',').map(city => city.trim())

if (cities.length === 0) {
    errorMessage('Ошибка: укажите хотя бы один город')
    process.exit(1)
}

let days = 3

if (daysArg) {
    days = Number(daysArg)

    if (!Number.isInteger(days) || days < 1 || days > 7) {
        console.error('Ошибка: --days должен быть целым числом от 1 до 7.')
        process.exit(1)
    }
}

const today = new Date().toISOString().split('T')[0]

async function showWeather(weather: WeatherData) {
    console.log(`\n${weather.city}`)
    console.log(`${weather.country}`)
    console.log(`Координаты: ${weather.lat}, ${weather.lon}`)

    console.table(
        weather.days.map((day: WeatherDays) => ({
            Дата: day.date,
            'Мин. °C': day.min,
            'Макс. °C': day.max,
            'Осадки, мм': day.precipitation
        }))
    )
}

const citiesWithoutCache: string[] = []

for (const city of cities) {
    const filePath = `${process.env.REPORTS_DIR}/${city}-${today}.json`

    if (!args.includes('--no-cache') && (await fileExists(filePath))) {
        const data = await readFile(filePath)
        const weather: WeatherData = JSON.parse(data)

        showWeather(weather)
    } else {
        citiesWithoutCache.push(city)
    }
}

if (citiesWithoutCache.length > 0) {
    const data = await weatherService(citiesWithoutCache, days)

    for (const result of data) {
        if (result.status === 'fulfilled' && result.value !== undefined) {
            const weather = result.value

            showWeather(weather)

            cacheFile(
                `${process.env.REPORTS_DIR}/${weather.city}-${today}.json`,
                weather
            )
        }
    }
}
