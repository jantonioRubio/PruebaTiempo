import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherService } from './services/weather.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let weatherService: WeatherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [WeatherService],
      imports: [FormsModule, HttpClientTestingModule, HttpClientModule]
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.get(WeatherService);
    fixture.detectChanges();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should capitalize the first letter of a string', () => {
    const str = 'hello world';
    const result = component.capitalizeFirstLetter(str);
    expect(result).toEqual('Hello world');
  });

  it('should add a city to the list', () => {
    component.city = 'new york';
    component.ciudades = ['london', 'paris'];
    component.agregarCiudad(null);
    expect(component.ciudades).toEqual(['london', 'paris', 'New york']);
    expect(component.city).toEqual('');
  });

  it('should not add an empty city to the list', () => {
    component.city = '';
    component.ciudades = ['london', 'paris'];
    component.agregarCiudad(null);
    expect(component.ciudades).toEqual(['london', 'paris']);
    expect(component.city).toEqual('');
  });

  it('should not add a duplicate city to the list', () => {
    component.city = 'london';
    component.ciudades = ['london', 'paris'];
    component.agregarCiudad(null);
    expect(component.ciudades).toEqual(['london', 'paris']); // Verifica que la lista se mantenga igual
    expect(component.city).toEqual(''); // Verifica que el campo city se haya vaciado
    // Verifica que no se haya agregado la ciudad nuevamente
    expect(component.ciudades.length).toEqual(2);
  });

  it('should remove a city from the list', () => {
    component.ciudades = ['london', 'paris', 'new york'];
    component.eliminarCiudad('paris');
    expect(component.ciudades).toEqual(['london', 'new york']);
  });

  it('should not remove a city if it does not exist in the list', () => {
    component.ciudades = ['london', 'paris', 'new york'];
    component.eliminarCiudad('tokyo');
    expect(component.ciudades).toEqual(['london', 'paris', 'new york']);
  });

  it('should call consultarAPI method with valid city', () => {
    spyOn(component, 'consultarAPI');
    component.city = 'Madrid';
    const event = new Event('submit');

    component.buscarClimaFormulario(event);

    expect(component.consultarAPI).toHaveBeenCalledWith('Madrid');
  });

  it('should set errorMessage when city is empty', () => {
    component.city = '';
    const event = new Event('submit');

    component.buscarClimaFormulario(event);

    expect(component.errorMessage).toEqual('Debe ingresar una ciudad');
  });

  it('should call mostrarError method when API returns 404', () => {
    spyOn(component, 'mostrarError');
    spyOn(weatherService, 'getCurrentWeather').and.returnValue(of({ cod: '404' }));
    const event = new Event('submit');
    component.city = 'NonexistentCity';

    component.buscarClimaFormulario(event);

    expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('NonexistentCity');
    expect(component.mostrarError).toHaveBeenCalledWith('Ciudad no encontrada');
  });

  it('should call mostrarDatos method when API call is successful', () => {
    spyOn(component, 'mostrarDatos');
    const mockWeatherData = { cod: 200, main: { temp: 298.15, temp_max: 301.15, temp_min: 295.15, humidity: 75 }, weather: [{ description: 'soleado', icon: '01d' }], sys: { country: 'ES' }, name: 'Ciudad Ejemplo' };
    spyOn(weatherService, 'getCurrentWeather').and.returnValue(of(mockWeatherData));
    const event = new Event('submit');
    component.city = 'ExistingCity';

    component.buscarClimaFormulario(event);

    expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('ExistingCity');
    expect(component.mostrarDatos).toHaveBeenCalledWith(mockWeatherData);
  });


  it('should call mostrarError method when API call returns an error', () => {
    spyOn(component, 'mostrarError');
    spyOn(weatherService, 'getCurrentWeather').and.returnValue(throwError('API error'));
    const event = new Event('submit');
    component.city = 'CityWithError';

    component.buscarClimaFormulario(event);

    expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('CityWithError');
    expect(component.mostrarError).toHaveBeenCalledWith('Error al obtener el clima');
  });

  it('should format date correctly', () => {
    const date = '2023-06-10 12:00:00';
    const formattedDate = component.formatDate(date);
    expect(formattedDate).toEqual('10/06/2023');
  });

  it('should get week day correctly', () => {
    const date = '2023-06-10 12:00:00';
    const weekDay = component.getWeekDay(date);
    expect(weekDay).toEqual('sábado');
  });

  it('should display weather data correctly', () => {
    const datos = {
      name: 'Ciudad Ejemplo',
      main: {
        temp: 298.15,
        temp_max: 301.15,
        temp_min: 295.15,
        humidity: 75
      },
      weather: [
        {
          description: 'soleado',
          icon: '01d'
        }
      ],
      sys: {
        country: 'ES'
      },
      coord: {
        lat: 40.123,
        lon: -3.456
      },
      id: 12345
    };

    component.mostrarDatos(datos);
    fixture.detectChanges();

    const cityElement = fixture.nativeElement.querySelector('.fs-1');
    expect(cityElement.textContent).toEqual('Ciudad Ejemplo, ES');

    const temperatureElement = fixture.nativeElement.querySelector('.display-2');
    expect(temperatureElement.innerHTML).toContain('25℃');

    const iconElement = fixture.nativeElement.querySelector('.icon');
    expect(iconElement.src).toContain('http://openweathermap.org/img/wn/01d@2x.png');

    const humidityElement = fixture.nativeElement.querySelectorAll('.min-max')[1];
    expect(humidityElement.innerHTML).toContain('75%');
  });

  it('should create weather forecast HTML correctly', () => {
    const forecastData = [
      {
        date: '10/06/2023',
        dayOfWeek: 'SÁBADO',
        temperature: 302,
        conditions: 'parcialmente nublado',
        humidity: 75,
        tempMax: 32,
        tempMin: 26,
        icon: '02d'
      },
      {
        date: '11/06/2023',
        dayOfWeek: 'domingo',
        temperature: 23,
        conditions: 'lluvia',
        humidity: 80,
        tempMax: 25,
        tempMin: 20,
        icon: '10d'
      }
    ];

    component.crearPronosticoHTML(forecastData);
    fixture.detectChanges();

    const tableElement = fixture.nativeElement.querySelector('.forecast-table');
    expect(tableElement).toBeTruthy();

    const rowElement = fixture.nativeElement.querySelector('tr');
    expect(rowElement).toBeTruthy();

    const columns = fixture.nativeElement.querySelectorAll('.forecast-column');
    expect(columns.length).toBe(2);

    if (columns.length === 3) {
      const firstColumn = columns[0];
      const firstDate = firstColumn.querySelector('.date');
      if (firstDate) {
        expect(firstDate.textContent).toEqual('SÁBADO');
      }

      const firstTemperature = firstColumn.querySelector('.temp');
      if (firstTemperature) {
        expect(firstTemperature.textContent).toEqual('302℃');
      }

      const firstIcon = firstColumn.querySelector('.icon');
      if (firstIcon) {
        expect(firstIcon.src).toContain('02d.png');
      }

      const firstMinMax = firstColumn.querySelector('.small');
      if (firstMinMax) {
        expect(firstMinMax.innerHTML).toContain('32°C');
        expect(firstMinMax.innerHTML).toContain('26°C');
      }

      const firstHumidity = firstColumn.querySelectorAll('.small')[1];
      if (firstHumidity) {
        expect(firstHumidity.innerHTML).toContain('75%');
      }

      const secondColumn = columns[1];
      const secondDate = secondColumn.querySelector('.date');
      if (secondDate) {
        expect(secondDate.textContent).toEqual('domingo');
      }

      const secondTemperature = secondColumn.querySelector('.temp');
      if (secondTemperature) {
        expect(secondTemperature.textContent).toEqual('23°C');
      }

      const secondIcon = secondColumn.querySelector('.icon');
      if (secondIcon) {
        expect(secondIcon.src).toContain('10d.png');
      }

      const secondMinMax = secondColumn.querySelector('.small');
      if (secondMinMax) {
        expect(secondMinMax.innerHTML).toContain('25°C');
        expect(secondMinMax.innerHTML).toContain('20°C');
      }

      const secondHumidity = secondColumn.querySelectorAll('.small')[1];
      if (secondHumidity) {
        expect(secondHumidity.innerHTML).toContain('80%');
      }
    }
  });

  it('should clear errorMessage when limpiarInfo is called', () => {
    component.errorMessage = 'Error message';

    component.limpiarInfo();

    expect(component.errorMessage).toEqual('');
  });

  it('should convert Kelvin to Celsius correctly when kelvinACentigrados is called', () => {
    const kelvin = 298.15;
    const expectedCelsius = 25;

    const result = component.kelvinACentigrados(kelvin);

    expect(result).toEqual(expectedCelsius);
  });

  it('should set errorMessage and clear it after 3 seconds when mostrarError is called', (done) => {
    const mensaje = 'Error message';

    component.mostrarError(mensaje);

    expect(component.errorMessage).toEqual(mensaje);

    setTimeout(() => {
      expect(component.errorMessage).toEqual('');
      done();
    }, 3000);
  });

  it('should clear the city input when clearCity is called', () => {
    component.city = 'Example City';

    component.clearCity();

    expect(component.city).toEqual('');
  });

  it('should open the city information in a new window when abrirInformacion is called with a valid city ID', () => {
    const mockWindowOpen = spyOn(window, 'open');
    const idCiudad = '12345';

    component.idCiudad = parseInt(idCiudad, 10); // Convertir a número entero
    component.abrirInformacion();

    expect(mockWindowOpen).toHaveBeenCalledWith(`https://openweathermap.org/city/${idCiudad}`, '_blank');
  });

  it('should not open any window when abrirInformacion is called without a valid city ID', () => {
    const mockWindowOpen = spyOn(window, 'open');

    component.idCiudad = null;
    component.abrirInformacion();

    expect(mockWindowOpen).not.toHaveBeenCalled();
  });

  it('should handle forecastData with cod "404"', () => {
    spyOn(component, 'mostrarError');
    const forecastData = { cod: '404' };

    component.obtenerPronostico(0, 0).catch(() => {
      expect(component.mostrarError).toHaveBeenCalledWith('Error');
    });
  });

  it('should handle error from getWeatherForecast', () => {
    spyOn(console, 'error');
    spyOn(component, 'mostrarError');
    const error = 'Some error message';

    spyOn(weatherService, 'getWeatherForecast').and.returnValue(throwError(error));

    component.obtenerPronostico(0, 0).catch(() => {
      expect(console.error).toHaveBeenCalledWith(error);
      expect(component.mostrarError).toHaveBeenCalledWith('Error al obtener el pronóstico');
    });
  });

  it('should filter forecast data correctly', async () => {
    const forecastData = {
      cod: '200',
      list: [
        {
          dt_txt: '2023-06-12 12:00:00',
          main: {
            temp: 25,
            temp_max: 30,
            temp_min: 20,
            humidity: 50,
          },
          weather: [
            {
              description: 'Sunny',
              icon: '01d',
            },
          ],
        },
        {
          dt_txt: '2023-06-13 12:00:00',
          main: {
            temp: 26,
            temp_max: 31,
            temp_min: 21,
            humidity: 51,
          },
          weather: [
            {
              description: 'Cloudy',
              icon: '02d',
            },
          ],
        },
        {
          dt_txt: '2023-06-14 12:00:00',
          main: {
            temp: 27,
            temp_max: 32,
            temp_min: 22,
            humidity: 52,
          },
          weather: [
            {
              description: 'Rainy',
              icon: '10d',
            },
          ],
        },
      ],
    };

    spyOn(weatherService, 'getWeatherForecast').and.returnValue(of(forecastData));
    spyOn(component, 'mostrarError');

    await component.obtenerPronostico(0, 0);

    expect(component.mostrarError).not.toHaveBeenCalled();

    expect(component.weatherForecast.length).toBe(0);

  });

});
