import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ForecastComponent } from './forecast.component';
import { WeatherService } from '../../services/weather.service';
import { HttpClientModule } from '@angular/common/http';

describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;
  let weatherService: WeatherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForecastComponent],
      providers: [WeatherService],
      imports: [ HttpClientModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.get(WeatherService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch weather forecast data on initialization', () => {
    const forecastData = {
      list: [
        {
          dt_txt: '2023-06-12 12:00:00',
          main: {
            temp: 25,
            humidity: 50,
          },
          weather: [
            {
              description: 'Sunny',
            },
          ],
        },
      ],
    };

    spyOn(weatherService, 'getWeatherForecast').and.returnValue(of(forecastData));

    component.ngOnInit();

    expect(weatherService.getWeatherForecast).toHaveBeenCalledWith(40.4165000, -3.7025600);
    expect(component.weatherForecast.length).toBe(1);
    expect(component.weatherForecast[0].temperature).toBe(-248);
    expect(component.weatherForecast[0].humidity).toBe(50);
    expect(component.weatherForecast[0].conditions).toBe('Sunny');
  });

  it('should format date correctly', () => {
    const dateString = '2023-06-12 12:00:00';
    const formattedDate = component.formatDate(dateString);
    expect(formattedDate).toBe('12/06/2023');
  });

  it('should convert temperature from Kelvin to Celsius correctly', () => {
    const kelvinTemperature = 298.15;
    const celsiusTemperature = component.kelvinACentigrados(kelvinTemperature);
    expect(celsiusTemperature).toBe(25);
  });
});
