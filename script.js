// Making "Monufia" as the default location
document.addEventListener("DOMContentLoaded", function () {
  getPrayers("EG", "Monufia");
});

// Filling the dropdown list with countries
let countryInput = document.getElementById("country");
for (const country of countries) {
  countryInput.innerHTML += `
    <option value="${country.key}">${country.name}</option>
  `;
}

// filling dropdown list with cities of selected country
let citiesInput = document.getElementById("location");
countryInput.addEventListener("change", function () {
  for (const country of countries) {
    if (country.key === this.value) {
      citiesInput.innerHTML = "";
      for (const cities of country.cities) {
        citiesInput.innerHTML += `
      <option value="${cities.key}">${cities.name}</option>
    `;
      }
    }
  }
  if (this.value != "none") {
    citiesInput.removeAttribute("disabled");
    getPrayers(this.value, citiesInput.value);
  } else {
    citiesInput.innerHTML = `<option value="">توقيت المنوفية : تلقائي</option>`;
    citiesInput.setAttribute("disabled", "disabled");
    getPrayers("EG", "Monufia");
  }
});

// changing timings based on selected location
citiesInput.addEventListener("change", function () {
  getPrayers(countryInput.value, this.value);
});

// ==================== FUNCTIONS ==================== //

// GET DATE FUNCTION
let currentDate = document.getElementById("date");
let date = new Date();
let finalDate = `${date.getDate()}-${
  date.getMonth() + 1
}-${date.getFullYear()}`;
currentDate.innerHTML = finalDate;

// GET PRAYERS FUNCTION
let prayers = document.getElementById("prayers");
function getPrayers(country, location) {
  axios
    .get(
      `https://api.aladhan.com/v1/timingsByCity/date=${finalDate}?city=${location}&country=${country}`
    )
    .then((response) => {
      let timings = response.data.data.timings;
      let markup = `
            <tr>
              <td>الفجر</td>
              <td>${timings.Fajr}</td>
            </tr>
            <tr>
              <td>الشروق</td>
              <td>${timings.Sunrise}</td>
            </tr>
            <tr>
              <td>الظهر</td>
              <td>${timings.Dhuhr}</td>
            </tr>
            <tr>
              <td>العصر</td>
              <td>${timings.Asr}</td>
            </tr>
            <tr>
              <td>المغرب</td>
              <td>${timings.Maghrib}</td>
            </tr>
            <tr>
              <td>العشاء</td>
              <td>${timings.Isha}</td>
            </tr>
          `;
      prayers.innerHTML = markup;
    });
}
