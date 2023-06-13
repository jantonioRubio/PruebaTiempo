import { Component } from '@angular/core';
import { Weather, Forecast, WeatherForecast } from './models/weather';
import { WeatherService } from './services/weather.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  city!: string;
  weather!: Weather;
  weatherForecast: Forecast[];
  errorMessage: string;
  ciudades: string[];
  idCiudad: number | undefined;
  filteredForecast: any;

  constructor(private weatherService: WeatherService) {
    this.ciudades = ['Madrid', 'Barcelona', 'Londres'];
    this.city = '';
    this.weather = null;
    this.weatherForecast = [];
    this.errorMessage = '';
    this.filteredForecast = [];
  }

  ngOnInit(): void {
    this.consultarAPI('madrid');
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  agregarCiudad(event: Event) {
    const ciudad = this.capitalizeFirstLetter(this.city);

    if (!ciudad || ciudad.trim() === '') {
      return;
    }

    const ciudadExistente = this.ciudades.find(c => c.toLowerCase() === ciudad.toLowerCase());
    if (!ciudadExistente) {
      this.ciudades.push(ciudad);
      console.log('Ciudad agregada:', ciudad);
    } else {
      console.log('La ciudad ya existe:', ciudad);
    }

    this.city = '';
  }

  eliminarCiudad(ciudad: string) {
    const indice = this.ciudades.indexOf(ciudad);
    if (indice !== -1) {
      this.ciudades.splice(indice, 1);
    }
  }

  buscarClimaFormulario(event: Event) {
    event.preventDefault();
    this.limpiarInfo();

    if (!this.city) {
      this.errorMessage = 'Debe ingresar una ciudad';
      return;
    }

    this.consultarAPI(this.city);
  }

  consultarAPI(ciudad: string) {
    this.weatherService.getCurrentWeather(ciudad).subscribe({
      next: (datos: any) => {
        if (datos.cod === '404') {
          this.mostrarError('Ciudad no encontrada');
          return;
        }

        this.mostrarDatos(datos);
      },
      error: (error: any) => {
        console.error(error);
        this.mostrarError('Error al obtener el clima');
      }
    });
  }

  obtenerPronostico(lat: number, lon: number): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      this.weatherService.getWeatherForecast(lat, lon).subscribe({
        next: (forecastData: any) => {
          if (forecastData.cod === '404') {
            this.mostrarError('Error');
            return;
          }

          const forecastList = forecastData.list;

          const currentDate = new Date(); // Fecha actual
          currentDate.setHours(12, 0, 0, 0); // Establecer la hora a las 12:00:00

          const uniqueDates = new Set(); // Conjunto para almacenar fechas únicas
          const filteredForecast = [];

          // Filtrar los registros con fechas distintas y posteriores a la fecha actual a las 12:00:00
          for (const forecast of forecastList) {
            const forecastDate = new Date(forecast.dt_txt);
            forecastDate.setHours(12, 0, 0, 0); // Establecer la hora a las 12:00:00

            console.log('Fecha actual:', currentDate);
            console.log('Fecha pronóstico:', forecastDate);

            // Omitir los registros con fecha anterior o igual a la fecha actual a las 12:00:00
            if (forecastDate.getTime() <= currentDate.getTime()) {
              console.log('Se omitió el registro con fecha anterior o igual a la fecha actual.');
              continue;
            }

            // Obtener los primeros tres registros de días distintos
            if (!uniqueDates.has(forecastDate.toDateString())) {
              console.log('Se agregó el registro con fecha:', forecastDate.toDateString());
              uniqueDates.add(forecastDate.toDateString());
              filteredForecast.push(forecast);
            }

            if (filteredForecast.length === 3) {
              console.log('Se obtuvieron los tres primeros registros de días distintos y posteriores a la fecha actual.');
              break; // Se han obtenido los tres primeros registros de días distintos y posteriores a la fecha actual
            }
          }

          const weatherForecast = filteredForecast.map((forecast: any) => ({
            date: this.formatDate(forecast.dt_txt),
            dayOfWeek: this.getWeekDay(forecast.dt_txt),
            temperature: this.kelvinACentigrados(forecast.main.temp),
            conditions: forecast.weather[0].description,
            humidity: forecast.main.humidity,
            tempMax: this.kelvinACentigrados(forecast.main.temp_max),
            tempMin: this.kelvinACentigrados(forecast.main.temp_min),
            icon: forecast.weather[0].icon
          }));

          console.log('Pronóstico filtrado:', weatherForecast);

          this.crearPronosticoHTML(weatherForecast);
          resolve();
        },
        error: (error: any) => {
          console.error(error);
          reject('Error al obtener el pronóstico');
        }
      });
    });
  }

  getWeekDay(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }


  crearPronosticoHTML(forecast: WeatherForecast[]): void {
    const container = document.getElementById('contenidoHTMLPronostico');

    if (container) {
      // Limpiar el contenido existente en el contenedor
      container.innerHTML = '';

      // Crear la tabla
      const table = document.createElement('table');
      table.classList.add('forecast-table');

      const row = document.createElement('tr');

      for (const item of forecast) {
        // Crear una columna por cada registro
        const column = document.createElement('td');
        column.classList.add('forecast-column');

        const dateElement = document.createElement('p');
        dateElement.classList.add('date', 'fw-bold', 'small');
        dateElement.innerHTML = `${item.dayOfWeek.toUpperCase()}`;
        console.log('Fecha:', item.dayOfWeek);

        const temperatureElement = document.createElement('p');
        temperatureElement.classList.add('fw-bold');
        temperatureElement.innerHTML = `${item.temperature}&#8451;`;
        console.log('Temperatura:', item.temperature);

        const iconElement = document.createElement('img');
        iconElement.src = `http://openweathermap.org/img/wn/${item.icon}@2x.png`;
        iconElement.alt = 'Icono del clima';
        iconElement.classList.add('icon', 'small-icon');
        console.log('Icono:', item.icon);

        const minMaxElement = document.createElement('p');
        minMaxElement.classList.add('small');
        minMaxElement.innerHTML = `<span class="fw-bold small text-info">${item.tempMax}&#8451;</span> / <span class="fw-bold small text-white">${item.tempMin}&#8451;</span>`;
        console.log('Mínima:', item.tempMin);
        console.log('Máxima:', item.tempMax);

        const humidityElement = document.createElement('p');
        humidityElement.classList.add('small');
        humidityElement.innerHTML = `Humedad: <span class="fw-bold small text-info">${item.humidity}&#37;</span>`;
        console.log('Humedad:', item.humidity);

        column.appendChild(dateElement);
        column.appendChild(temperatureElement);
        column.appendChild(iconElement);
        column.appendChild(minMaxElement);
        column.appendChild(humidityElement);

        // Agregar la columna a la fila
        row.appendChild(column);
      }

      // Agregar la fila a la tabla
      table.appendChild(row);

      // Agregar la tabla al contenedor
      container.appendChild(table);
    } else {
      console.error('El elemento con ID "contenidoHTMLPronostico" no se encontró en el HTML.');
    }
  }


  mostrarDatos(datos: any) {
    const name = datos.name;
    const temp = datos.main.temp;
    const temp_max = datos.main.temp_max;
    const temp_min = datos.main.temp_min;
    const description = datos.weather[0].description;
    const icon = datos.weather[0].icon;
    const country = datos.sys.country;
    const temperatura = this.kelvinACentigrados(temp);
    const minima = this.kelvinACentigrados(temp_min);
    const maxima = this.kelvinACentigrados(temp_max);
    const humidity = datos.main.humidity;
    this.idCiudad = datos.id;

    this.weather = {
      city: `${name}, ${country}`,
      temperature: temperatura,
      humidity: datos.main.humidity,
      conditions: description
    };

    this.weatherForecast = [];
    this.obtenerPronostico(datos.coord.lat, datos.coord.lon);

    const contenidoElement = document.getElementById('contenidoHTMLClima');

    if (contenidoElement) {
      contenidoElement.innerHTML = ''; // Limpiamos el contenido existente

      const h2 = document.createElement('h2');
      h2.classList.add('fs-1');
      h2.textContent = `${name}, ${country}`;

      const temperaturaParagraph = document.createElement('p');
      temperaturaParagraph.classList.add('text-white', 'fw-bold', 'display-2');
      temperaturaParagraph.innerHTML = `${temperatura}&#8451;`;

      const iconImg = document.createElement('img');
      iconImg.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      iconImg.alt = 'Icono del clima';
      iconImg.classList.add('icon');

      const minMaxParagraph = document.createElement('p');
      minMaxParagraph.classList.add('min-max');
      minMaxParagraph.innerHTML = `Min:
                                  <span class="fw-bold text-info">${minima}&#8451;</span>
                                  / Max:
                                  <span class="fw-bold text-white">${maxima}&#8451;</span>`;

      const humidityParagraph = document.createElement('p');
      humidityParagraph.classList.add('min-max');
      humidityParagraph.innerHTML = `Humedad:
                                    <span class="fw-bold text-info">${humidity}&#37;</span>`;

      contenidoElement.appendChild(h2);
      contenidoElement.appendChild(temperaturaParagraph);
      contenidoElement.appendChild(iconImg);
      contenidoElement.appendChild(minMaxParagraph);
      contenidoElement.appendChild(humidityParagraph);
    }

  }

  formatDate(dateString: string): string {

    const dateParts = dateString.split(" ")[0].split("-");
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    return day + "/" + month + "/" + year;
  }


  limpiarInfo() {
    this.errorMessage = '';
  }

  kelvinACentigrados(gradosKelvin: number) {
    return Math.round(gradosKelvin - 273.15);
  }

  mostrarError(mensaje: string) {
    this.errorMessage = mensaje;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  clearCity() {
    this.city = ''; // Borra el contenido del input
  }

  abrirInformacion() {
    if (this.idCiudad) {
      window.open(`https://openweathermap.org/city/${this.idCiudad}`, '_blank');
    }
  }

}
