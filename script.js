const defaultSelection = {
  country: "EG",
  city: "Monufia",
};

const prayerConfig = [
  { key: "Fajr", label: "الفجر", note: "بداية اليوم" },
  { key: "Sunrise", label: "الشروق", note: "شروق الشمس" },
  { key: "Dhuhr", label: "الظهر", note: "منتصف النهار" },
  { key: "Asr", label: "العصر", note: "آخر النهار" },
  { key: "Maghrib", label: "المغرب", note: "وقت الإفطار" },
  { key: "Isha", label: "العشاء", note: "ختام اليوم" },
];

const countryInput = document.getElementById("country");
const cityInput = document.getElementById("location");
const prayersContainer = document.getElementById("prayers");
const currentDateElement = document.getElementById("date");
const currentHijriDateElement = document.getElementById("hijri-date");
const statusMessageElement = document.getElementById("status-message");
const selectedCountryLabel = document.getElementById("selected-country-label");
const selectedCityLabel = document.getElementById("selected-city-label");
const nextPrayerLabel = document.getElementById("next-prayer-label");

const today = new Date();
const apiDate = `${String(today.getDate()).padStart(2, "0")}-${String(
  today.getMonth() + 1
).padStart(2, "0")}-${today.getFullYear()}`;

const appState = {
  selectedCountry: defaultSelection.country,
  selectedCity: defaultSelection.city,
  isLoading: false,
  errorMessage: "",
  prayers: [],
  readableDate: new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(today),
  hijriDate: "--",
};

let latestRequestId = 0;

document.addEventListener("DOMContentLoaded", () => {
  populateCountries();
  syncLocationOptions(appState.selectedCountry, appState.selectedCity);
  updateHeaderDates();
  renderSelectionSummary();
  renderLoadingState();
  getPrayers(appState.selectedCountry, appState.selectedCity);
});

countryInput.addEventListener("change", () => {
  appState.selectedCountry = countryInput.value;

  if (!appState.selectedCountry) {
    cityInput.innerHTML = "";
    cityInput.setAttribute("disabled", "disabled");
    appState.selectedCity = "";
    appState.prayers = [];
    appState.errorMessage = "";
    updateStatusMessage("اختر دولة أولاً ثم حدد المنطقة لعرض المواقيت.");
    renderSelectionSummary();
    renderEmptyState();
    return;
  }

  syncLocationOptions(appState.selectedCountry);
  getPrayers(appState.selectedCountry, appState.selectedCity);
});

cityInput.addEventListener("change", () => {
  appState.selectedCity = cityInput.value;
  renderSelectionSummary();
  getPrayers(appState.selectedCountry, appState.selectedCity);
});

prayersContainer.addEventListener("click", (event) => {
  if (event.target.id === "retry-fetch") {
    getPrayers(appState.selectedCountry, appState.selectedCity);
  }
});

function populateCountries() {
  const options = [
    `<option value="">اختر الدولة المناسبة</option>`,
    ...countries.map(
      (country) =>
        `<option value="${country.key}">${country.name}</option>`
    ),
  ];

  countryInput.innerHTML = options.join("");
  countryInput.value = appState.selectedCountry;
}

function syncLocationOptions(countryKey, preferredCityKey) {
  const selectedCountry = countries.find((country) => country.key === countryKey);

  if (!selectedCountry) {
    cityInput.innerHTML = `<option value="">اختر المنطقة</option>`;
    cityInput.setAttribute("disabled", "disabled");
    return;
  }

  const targetCity =
    preferredCityKey && selectedCountry.cities.some((city) => city.key === preferredCityKey)
      ? preferredCityKey
      : selectedCountry.cities[0].key;

  cityInput.innerHTML = selectedCountry.cities
    .map((city) => `<option value="${city.key}">${city.name}</option>`)
    .join("");
  cityInput.removeAttribute("disabled");
  cityInput.value = targetCity;
  appState.selectedCity = targetCity;
  renderSelectionSummary();
}

function updateHeaderDates() {
  currentDateElement.textContent = appState.readableDate;
  currentHijriDateElement.textContent = appState.hijriDate;
}

function renderSelectionSummary() {
  const country = countries.find((item) => item.key === appState.selectedCountry);
  const city = country?.cities.find((item) => item.key === appState.selectedCity);

  selectedCountryLabel.textContent = country?.name || "لم يتم الاختيار بعد";
  selectedCityLabel.textContent = city?.name || "بانتظار تحديد المنطقة";
}

function updateStatusMessage(message) {
  statusMessageElement.textContent = message;
}

function renderLoadingState() {
  prayersContainer.innerHTML = `
    <div class="state-card loading-state">
      <h3>جارٍ تحميل المواقيت</h3>
      <p>نقوم الآن بجلب مواقيت الصلاة لليوم الحالي حسب اختيارك.</p>
    </div>
    <div class="skeleton-grid" aria-hidden="true">
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    </div>
  `;
  nextPrayerLabel.textContent = "جارٍ التحديث...";
}

function renderEmptyState() {
  prayersContainer.innerHTML = `
    <div class="state-card">
      <h3>اختر موقعًا لعرض المواقيت</h3>
      <p>بعد اختيار الدولة والمنطقة ستظهر لك مواقيت الصلاة الخاصة بهذا اليوم.</p>
    </div>
  `;
  nextPrayerLabel.textContent = "--";
}

function renderErrorState() {
  prayersContainer.innerHTML = `
    <div class="state-card error-state">
      <h3>تعذر تحميل المواقيت</h3>
      <p>${appState.errorMessage}</p>
      <button id="retry-fetch" class="retry-button" type="button">إعادة المحاولة</button>
    </div>
  `;
  nextPrayerLabel.textContent = "--";
}

function renderPrayers() {
  if (!appState.prayers.length) {
    renderEmptyState();
    return;
  }

  const nextPrayer = getNextPrayer(appState.prayers);
  nextPrayerLabel.textContent = nextPrayer
    ? `${nextPrayer.label} - ${nextPrayer.time}`
    : "انتهت مواقيت اليوم";

  prayersContainer.innerHTML = appState.prayers
    .map((prayer, index) => {
      const isNext = nextPrayer?.key === prayer.key;

      return `
        <article class="prayer-card${isNext ? " is-next" : ""}">
          <div class="prayer-main">
            <span class="prayer-index">${String(index + 1).padStart(2, "0")}</span>
            <div>
              <span class="prayer-name">موعد الصلاة</span>
              <strong class="prayer-label">${prayer.label}</strong>
              <span class="prayer-note">${isNext ? "الصلاة القادمة" : prayer.note}</span>
            </div>
          </div>
          <strong class="prayer-time">${prayer.time}</strong>
        </article>
      `;
    })
    .join("");
}

function getPrayers(country, city) {
  if (!country || !city) {
    renderEmptyState();
    return;
  }

  appState.isLoading = true;
  appState.errorMessage = "";
  const requestId = ++latestRequestId;
  updateStatusMessage("جارٍ تحديث المواقيت بناءً على اختيارك...");
  renderLoadingState();

  axios
    .get(`https://api.aladhan.com/v1/timingsByCity/${apiDate}`, {
      params: {
        city,
        country,
      },
    })
    .then((response) => {
      if (requestId !== latestRequestId) {
        return;
      }

      const timings = response.data?.data?.timings;
      const dateInfo = response.data?.data?.date;

      appState.prayers = prayerConfig.map((prayer) => ({
        key: prayer.key,
        label: prayer.label,
        note: prayer.note,
        time: sanitizePrayerTime(timings?.[prayer.key] || "--"),
      }));

      appState.hijriDate = `${dateInfo?.hijri?.weekday?.ar || ""} ${
        dateInfo?.hijri?.date || ""
      }`.trim() || "--";

      updateHeaderDates();
      renderSelectionSummary();
      updateStatusMessage("تم تحديث المواقيت بنجاح.");
      renderPrayers();
    })
    .catch(() => {
      if (requestId !== latestRequestId) {
        return;
      }

      appState.prayers = [];
      appState.errorMessage =
        "تعذر الاتصال بخدمة المواقيت حاليًا. يرجى المحاولة مرة أخرى بعد لحظات.";
      updateStatusMessage("حدث خطأ أثناء تحميل البيانات.");
      renderErrorState();
    })
    .finally(() => {
      if (requestId === latestRequestId) {
        appState.isLoading = false;
      }
    });
}

function sanitizePrayerTime(value) {
  return value.split(" ")[0];
}

function getNextPrayer(prayers) {
  const now = new Date();

  for (const prayer of prayers) {
    const prayerDate = buildPrayerDate(prayer.time, now);

    if (prayerDate && prayerDate >= now) {
      return prayer;
    }
  }

  return null;
}

function buildPrayerDate(time, referenceDate) {
  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const prayerDate = new Date(referenceDate);
  prayerDate.setHours(hours, minutes, 0, 0);
  return prayerDate;
}
