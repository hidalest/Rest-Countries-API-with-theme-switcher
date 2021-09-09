"use strict";

// Elements
const countryContainer = document.querySelector(".main2");
const btnBack = document.querySelector(".btn--back");
const numberConvert = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

class Country {
  _country;
  constructor() {
    this._getLocalStorage();
    btnBack.addEventListener("click", this._goToHomePage);
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("country"));
    if (!data) return;
    this._country = data;
    this._createCountry(data);
  }

  //FIXME DELETEE
  _showData() {
    console.log(this._country);
    return this._country;
  }

  _createCountry(data) {
    // const dataLanguage =>
    const html = `
      <section class="selectedCountry">
        <div class="flag">
          <img src="${data.flag}" alt="Country Flag" />
        </div>

        <!-- Info of the country -->
        <div class="pannel">
          <h1 class="pannel--country">${data.name}</h1>
          <article class="pannelInfo">
            <div>
              <p class="pannelInfo--native"><span>Native Name: </span>${
                data.altSpellings[0]
              }</p>
              <p class="pannelInfo--population">
                <span>Population: </span> ${numberConvert(data.population)}
              </p>
              <p class="pannelInfo--region"><span>Region: </span> ${
                data.region
              }</p>
              <p class="pannelInfo--subRegion">
                <span>Sub Region: </span>${data.subregion}
              </p>
              <p class="pannelInfo--capital"><span>Capital: </span>${
                data.capital
              }</p>
            </div>
            <div>
              <p class="pannelInfo--tld">
                <span>Top Level Domain: </span>${data.topLevelDomain}
              </p>
              <p class="pannelInfo--currency">
                <span>Currencies: </span> ${data.currencies[0].code}
              </p>
              <p class="pannelInfo--language">
                <span>Languages: </span>${data.languages
                  .map((el) => el.name)
                  .join(", ")}
              </p>
            </div>
          </article>

          <!-- Borders -->
          <p class="pannelInfo--b-countries">Border countries</p>
          <div class="pannelInfo--borders">
          </div>
        </div>
      </section>
      
      `;

    countryContainer.insertAdjacentHTML("beforeend", html);

    const bordersContainer = document.querySelector(".pannelInfo--borders");

    if (data.borders.length === 0) {
      const bordersHTML = `<p class="border1 btn">No borders :(</p>`;
      bordersContainer.insertAdjacentHTML("beforeend", bordersHTML);
    }

    data.borders.forEach((border) => {
      const bordersHTML = `<button class="border1 btn">${border}</button>`;
      bordersContainer.insertAdjacentHTML("beforeend", bordersHTML);
    });
  }

  _goToHomePage() {
    window.location.href = "index.html";
  }
}

const c = new Country();
