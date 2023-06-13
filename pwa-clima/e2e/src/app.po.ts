import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return browser.getTitle();
  }

  getSearchInput() {
    return element(by.id('city'));
  }

  getAddCityButton() {
    return element(by.css('.btn-link'));
  }

  getCityButtons() {
    return element.all(by.css('table tr td button'));
  }

  getWeatherInformation() {
    return element(by.id('contenidoHTMLClima'));
  }

  getForecastInformation() {
    return element(by.id('contenidoHTMLPronostico'));
  }
}

