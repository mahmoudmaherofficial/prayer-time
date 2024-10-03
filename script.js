let countries = [
  {
    name: "مصر",
    key: "EG",
    gov: [
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
    gov: [
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

document.addEventListener("DOMContentLoaded", function () {
  getPrayers("EG", "Monufia");
});

let countryInput = document.getElementById("country");
for (const country of countries) {
  countryInput.innerHTML += `
    <option value="${country.key}">${country.name}</option>
  `;
}
let govInput = document.getElementById("location");
countryInput.addEventListener("change", function () {
  for (const country of countries) {
    if (country.key === this.value) {
      govInput.innerHTML = "";
      for (const gov of country.gov) {
        govInput.innerHTML += `
      <option value="${gov.key}">${gov.name}</option>
    `;
      }
    }
  }
  if (countryInput.value != "none") {
    govInput.removeAttribute("disabled");
    getPrayers(countryInput.value, govInput.value);
  } else {
    govInput.innerHTML = "";
    govInput.setAttribute("disabled", "disabled");
  }
});
govInput.addEventListener("change", function () {
  getPrayers(countryInput.value, govInput.value);
});

let currentDate = document.getElementById("date");
let date = new Date();
currentDate.innerHTML = `${date.getDate()}-${
  date.getMonth() + 1
}-${date.getFullYear()}`;

let prayers = document.getElementById("prayers");
function getPrayers(country, location) {
  axios
    .get(
      `https://api.aladhan.com/v1/timingsByCity/date=${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}?city=${location}&country=${country}`
    )
    .then((response) => {
      // console.log(response.data.data.timings);
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
