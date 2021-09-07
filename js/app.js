"use strict";

// Elements

const form = document.querySelector(".form");
const title = document.querySelector(".nav--title");
const darkModeBtn = document.querySelector(".btn--darkMode");
const inputSelect = document.querySelector(".form-select");
const inputSearch = document.querySelector(".input--search");
const countryContainerEl = document.querySelector(".countries");
const countryFlag = document.querySelector(".country--img-flag");
const countryNameEl = document.querySelector(".country--info-name");
const countryPopulationEl = document.querySelector(
  ".country--population-number"
);
const countryRegionEl = document.querySelector(".country--info-region span");
const countryCapitalEl = document.querySelector(".country--info-capital span");

class App {
  _countries;
  _selectedCountry;
  constructor() {
    inputSearch.value = "";
    inputSelect.value = "";
    this._loadCountries();

    inputSearch.onkeyup = (e) => {
      e.preventDefault();
      this._searchCountry();
    };

    countryContainerEl.addEventListener("click", (e) => {
      this._selectCountry(e);
    });

    title.onclick = () => (location.href = "index.html");

    inputSelect.addEventListener("change", (e) => {
      e.preventDefault();
      this._filterCountryRegion();
    });
  }

  async _loadCountries() {
    const countries = await fetch(`https://restcountries.eu/rest/v2/all`);
    const data = await countries.json();
    this._countries = data;

    this._renderCountries(this._countries);
  }

  _createCountries(data) {
    //   Convert numbers to format (used for population)
    const numberConvert = (number) => {
      return new Intl.NumberFormat("en-US").format(number);
    };

    countryContainerEl.innerHTML = "";
    data.forEach((country) => {
      const html = `
       <div class="country" data-id="${country.alpha3Code}">
          <div class="country--img" style="background: url(${
            country.flag
          }) no-repeat center; background-size: cover">
          </div>
          <div class="country--info">
            <h2 class="country--info-name">${country.name}</h2>
            <h3 class="country--info-population">
              Population:
              <span class="country--population-number">${numberConvert(
                country.population
              )}</span>
            </h3>
            <h3 class="country--info-region">
              Region:
              <span>${country.region}</span>
            </h3>
            <h3 class="country--info-capital">
              Capital:
              <span>${country.capital}</span>
            </h3>
          </div>
        </div>
      
      `;
      countryContainerEl.insertAdjacentHTML("beforeend", html);
    });
  }

  _renderCountries(region) {
    this._createCountries(region);
  }

  _searchCountry() {
    console.log(`searching`);
    const input = inputSearch.value.toLowerCase().trim();
    const filterCountries = this._countries.filter((country) => {
      return country.name.toLowerCase().startsWith(input);
    });
    this._renderCountries(filterCountries);
  }

  _filterCountryRegion() {
    const input = inputSelect.value.toLowerCase().trim();
    const filterCountries = this._countries.filter((country) => {
      return country.region.toLowerCase().startsWith(input);
    });
    this._renderCountries(filterCountries);
  }

  _selectCountry(e) {
    const countryEl = e.target.closest(".country");
    if (!countryEl) return;

    const country = this._countries.find(
      (el) => el.alpha3Code === countryEl.dataset.id
    );

    this._selectedCountry = country;

    // Save the selected country on LocalStorage
    this._setLocalStorage(country);
  }

  _setLocalStorage(data) {
    localStorage.setItem("country", JSON.stringify(data));
  }
}

const app = new App();
