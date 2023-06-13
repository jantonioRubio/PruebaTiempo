
export interface Weather {
  city: string;
  temperature: number;
  humidity: number;
  conditions: string;
}

export interface Forecast {
  date: string;
  temperature: number;
  conditions: string;
  humidity: number;
}

export interface WeatherForecast {
  date: string;
  dayOfWeek: string;
  temperature: number;
  conditions: string;
  humidity: number;
  tempMax: number;
  tempMin: number;
  icon: string;
}
