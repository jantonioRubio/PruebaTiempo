/* import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { Forecast } from '../../models/weather';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  weatherForecast: Forecast[] = [];

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    const lat = 40.4165000;
    const lon =  -3.7025600;

    this.weatherService.getWeatherForecast(lat, lon).subscribe({
      next: (forecastData: any) => {
        const forecastList = forecastData.list;
        this.weatherForecast = forecastList.map((forecast: any) => ({
          date: this.formatDate(forecast.dt_txt),
          temperature: this.kelvinACentigrados(forecast.main.temp),
          conditions: forecast.weather[0].description,
          humidity: forecast.main.humidity
        }));
      },
      error: (error: any) => {
        console.error(error);
      }
    });


  }

  kelvinACentigrados(gradosKelvin: number) {
    return Math.round(gradosKelvin - 273.15);
  }

  formatDate(dateString: string): string {
    alert(dateString);
    const dateParts = dateString.split(" ")[0].split("-");
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    return day + month + year;
  }
}

 */

import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { Forecast } from '../../models/weather';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  weatherForecast: Forecast[] = [];

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    const lat = 40.4165000;
    const lon = -3.7025600;

    this.weatherService.getWeatherForecast(lat, lon).subscribe(
      (forecastData: any) => {
        const forecastList = forecastData.list;
        this.weatherForecast = forecastList.map((forecast: any) => ({
          date: this.formatDate(forecast.dt_txt),
          temperature: this.kelvinACentigrados(forecast.main.temp),
          conditions: forecast.weather[0].description,
          humidity: forecast.main.humidity,
        }));
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  kelvinACentigrados(gradosKelvin: number): number {
    return Math.round(gradosKelvin - 273.15);
  }

  formatDate(dateString: string): string {
    const dateParts = dateString.split(' ')[0].split('-');
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    return day + '/' + month + '/' + year;
  }
}
