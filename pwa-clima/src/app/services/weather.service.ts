import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private appID = '7b93448994e4b5681ae4ddd2a73b5bff';
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<any> {
    const url = `${this.baseUrl}/weather?q=${city}&appid=${this.appID}&lang=es`;
    return this.http.get(url);
  }

  getWeatherForecast(lat: number, lon: number): Observable<any> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.appID}&lang=es`;
    return this.http.get(url);
  }
}
