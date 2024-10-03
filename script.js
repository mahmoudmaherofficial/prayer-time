// Declaring countries & Locations
let countries = [
  {
    name: "مصر",
    key: "EG",
    locations: [
      {
        name: "المنوفية",
        key: "Monufia",
      },
      {
        name: "القاهرة",
        key: "Cairo",
      },
      {
        name: "الجيزة",
        key: "Giza",
      },
      {
        name: "الإسكندرية",
        key: "Alexandria",
      },
    ],
  },
  {
    name: "السعودية",
    key: "SA",
    locations: [
      {
        name: "مكة",
        key: "Mecca",
      },
      {
        name: "المدينة",
        key: "Madinah",
      },
      {
        name: "الرياض",
        key: "Riyadh",
      },
      {
        name: "جدة",
        key: "Jeddah",
      },
    ],
  },
];

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

// filling dropdown list with locations of selected country
let locationsInput = document.getElementById("location");
countryInput.addEventListener("change", function () {
  for (const country of countries) {
    if (country.key === this.value) {
      locationsInput.innerHTML = "";
      for (const locations of country.locations) {
        locationsInput.innerHTML += `
      <option value="${locations.key}">${locations.name}</option>
    `;
      }
    }
  }
  if (countryInput.value != "none") {
    locationsInput.removeAttribute("disabled");
    getPrayers(countryInput.value, locationsInput.value);
  } else {
    locationsInput.innerHTML = "";
    locationsInput.setAttribute("disabled", "disabled");
  }
});

// changing timings based on selected location
locationsInput.addEventListener("change", function () {
  getPrayers(countryInput.value, locationsInput.value);
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
