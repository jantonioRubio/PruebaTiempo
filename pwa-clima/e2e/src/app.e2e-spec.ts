import { AppPage } from './app.po';
import { browser, by, element, ExpectedConditions } from 'protractor';
import { Key, WebDriver, WebElement, until } from 'selenium-webdriver';

describe('App', () => {
  beforeEach(() => {
    browser.get('/');
  });

  it('should display title', () => {
    expect(browser.getTitle()).toEqual('PwaClima');
  });

  it('should display search input', () => {
    expect(element(by.id('city')).isDisplayed()).toBeTruthy();
  });

  it('should display add city button', () => {
    expect(element(by.css('.btn-link')).isDisplayed()).toBeTruthy();
  });

  it('should add a city', () => {
    const cityInput = element(by.id('city'));
    cityInput.sendKeys('New York');
    element(by.css('.btn-link')).click();

    const cityButtons = element.all(by.css('table tr td button'));
    expect(cityButtons.count()).toBe(8);
  });

  it('should remove a city', () => {
    const cityButtons = element.all(by.css('table tr td button'));
    const cityCountBefore = cityButtons.count();

    cityButtons.first().click();

    const cityCountAfter = cityButtons.count();
    expect(cityCountAfter).toBe(6);
  });

  it('should display weather information', () => {
    const cityButtons = element.all(by.css('table tr td button'));
    cityButtons.first().click();

    expect(element(by.id('contenidoHTMLClima')).isDisplayed()).toBeTruthy();
  });

  it('should display forecast information', () => {
    const cityButtons = element.all(by.css('table tr td button'));
    cityButtons.first().click();

    expect(element(by.id('contenidoHTMLPronostico')).isDisplayed()).toBeTruthy();
  });

});
