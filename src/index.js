import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const containerEl = document.querySelector('.country-info');
// fetchCountries('ukraine');

inputEl.addEventListener('input', debounce(onInputAction, DEBOUNCE_DELAY));

function onInputAction(evt) {
  if (evt.target.value.trim() === '') {
    clearAll();
    return;
  }
  fetchCountries(evt.target.value.trim()).then(response => {
    onCheck(response);
  });
}

function onCheck(response) {
  if (!Array.isArray(response)) {
    console.clear();
    clearAll();
    Notiflix.Notify.failure('Oops, there is no country with that name');
  } else if (response.length > 10) {
    clearAll();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (response.length >= 2 && response.length <= 10) {
    renderCountriesList(response);
  } else if (response.length === 1) {
    renderCountryInfo(response);
  }
}

function clearAll() {
  listEl.innerHTML = '';
  containerEl.innerHTML = '';
}

function renderCountriesList(countries) {
  clearAll();
  const itemEl = countries
    .map(country => {
      return `<li class = "country-item"><div class= "country-box"><img src="${country.flags.svg}" width = "20" alt="flag"/></div><p>${country.name.official}</p></li>`;
    })
    .join('');
  listEl.insertAdjacentHTML('beforeend', itemEl);
}

function renderCountryInfo(country) {
  clearAll();
  const markup = country
    .map(info => {
      return `<ul class = "county-info-list">
      <li class = "country-item">
      <div class= "country-box"><img src="${
        info.flags.svg
      }" width = "20" alt="flag"/></div>
      <p>${info.name.official}</p></li>
      <li class = "country-item"><p>Capital: ${info.capital[0]}</p></li>
      <li class = "country-item"><p>Population: ${info.population}</p></li>
      <li class = "country-item"><p>Languages: ${Object.values(
        info.languages
      )}</p></li>
      </ul>`;
    })
    .join('');
  containerEl.innerHTML = markup;
}
