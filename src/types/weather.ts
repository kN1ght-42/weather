export type CityCoordinates =
    | {
          status: 'success'
          city: string
          country: string
          lat: number
          lon: number
      }
    | {
          status: 'not-found'
      }
    | {
          status: 'error'
      }

export interface WeatherDays {
    date: Date
    min: string
    max: string
    precipitation: number
}

export interface WeatherData {
    city: string
    country: string
    lat: number
    lon: number
    days: WeatherDays[]
}
