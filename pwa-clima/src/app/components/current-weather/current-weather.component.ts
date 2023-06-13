import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { Weather } from '../../models/weather';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css'],
})
export class CurrentWeatherComponent implements OnInit {
  weather!: Weather;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    const city = 'Madrid'; // Reemplaza 'YourCityName' con el nombre de tu ciudad
    this.weatherService.getCurrentWeather(city).subscribe((data) => {
      this.weather = {
        city: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        conditions: data.weather[0].description,
      };
    });
  }
}
