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

let countryEl;
const countryRegionEl = document.querySelector(".country--info-region span");
const countryCapitalEl = document.querySelector(".country--info-capital span");
const numberConvert = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

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

    inputSelect.onchange = (e) => {
      inputSearch.value = "";
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });

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
    try {
      const response = await fetch(`https://restcountries.eu/rest/v2/all`);

      if (!response.ok)
        throw new Error(
          `Unable to get the countries, error(${response.status})`
        );

      const data = await response.json();
      this._countries = data;

      localStorage.setItem("countries", JSON.stringify(this._countries));
      this._renderCountries(this._countries);
    } catch (error) {
      alert(error);
    }
  }

  _createCountries(data) {
    //   Convert numbers to format (used for population)

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

    // Need to refactor this, is not a good location to call the event
    countryEl = document.querySelectorAll(".country");
    countryEl.forEach((el) => {
      el.addEventListener("click", (e) => {
        window.location.href = "country.html";
      });
    });
  }

  _renderCountries(region) {
    this._createCountries(region);
  }

  _searchCountry() {
    const input = inputSearch.value.toLowerCase().trim();
    const select = inputSelect.value;
    const filterCountries = this._countries.filter((country) => {
      if (select === "") {
        return country.name.toLowerCase().startsWith(input);
      }

      return (
        country.name.toLowerCase().startsWith(input) &&
        country.region === select
      );
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
