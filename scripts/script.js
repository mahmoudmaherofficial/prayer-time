const defaultSelection = {
  country: "EG",
  city: "Monufia",
};

const countryInput = document.getElementById("country");
const cityInput = document.getElementById("location");
const prayersContainer = document.getElementById("prayers");
const currentDateElement = document.getElementById("date");
const currentHijriDateElement = document.getElementById("hijri-date");
const statusMessageElement = document.getElementById("status-message");
const selectedCountryLabel = document.getElementById("selected-country-label");
const selectedCityLabel = document.getElementById("selected-city-label");
const nextPrayerLabel = document.getElementById("next-prayer-label");

let countries = [];
let locationPrayerQueryMap = new Map();
let latestRequestId = 0;

const today = new Date();
const apiDate = PrayerService.buildApiDate(today);

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

document.addEventListener("DOMContentLoaded", async () => {
  updateHeaderDates();
  renderSelectionSummary();
  renderLoadingState();
  await initializeApp();
});

countryInput.addEventListener("change", handleCountryChange);
cityInput.addEventListener("change", handleCityChange);
prayersContainer.addEventListener("click", handleRetryClick);

async function initializeApp() {
  try {
    countries = await GeoService.loadCountries();
    populateCountries();
    syncLocationOptions(appState.selectedCountry, appState.selectedCity);
    getPrayers(appState.selectedCountry, appState.selectedCity);
  } catch (error) {
    handleLocationLoadFailure();
  }
}

function handleCountryChange() {
  appState.selectedCountry = countryInput.value;

  if (!appState.selectedCountry) {
    resetLocationSelection();
    appState.prayers = [];
    appState.errorMessage = "";
    updateStatusMessage("اختر دولة أولاً ثم حدد المنطقة لعرض المواقيت.");
    renderSelectionSummary();
    renderEmptyState();
    return;
  }

  syncLocationOptions(appState.selectedCountry);
  getPrayers(appState.selectedCountry, appState.selectedCity);
}

function handleCityChange() {
  appState.selectedCity = cityInput.value;
  renderSelectionSummary();
  getPrayers(appState.selectedCountry, appState.selectedCity);
}

function handleRetryClick(event) {
  if (event.target.id === "retry-fetch") {
    getPrayers(appState.selectedCountry, appState.selectedCity);
  }
}

function handleLocationLoadFailure() {
  countries = [];
  locationPrayerQueryMap = new Map();
  countryInput.innerHTML = `<option value="">تعذر تحميل الدول</option>`;
  cityInput.innerHTML = `<option value="">تعذر تحميل المناطق</option>`;
  countryInput.setAttribute("disabled", "disabled");
  cityInput.setAttribute("disabled", "disabled");
  appState.errorMessage = "تعذر تحميل قائمة الدول والمناطق من الخدمة الخارجية.";
  updateStatusMessage(
    "تعذر تحميل قائمة الدول من الخدمة الخارجية. يرجى المحاولة مرة أخرى بعد قليل.",
  );
  renderSelectionSummary();
  renderErrorState();
}

function populateCountries() {
  const options = [
    `<option value="">اختر الدولة المناسبة</option>`,
    ...countries.map(
      (country) => `<option value="${country.key}">${country.name}</option>`,
    ),
  ];

  countryInput.innerHTML = options.join("");
  countryInput.value = appState.selectedCountry;
  countryInput.removeAttribute("disabled");
}

function syncLocationOptions(countryKey, preferredCityKey) {
  const selectedCountry = countries.find(
    (country) => country.key === countryKey,
  );

  if (!selectedCountry) {
    resetLocationSelection();
    return;
  }

  if (!selectedCountry.cities.length) {
    cityInput.innerHTML = `<option value="">لا توجد مناطق متاحة</option>`;
    cityInput.setAttribute("disabled", "disabled");
    appState.selectedCity = "";
    locationPrayerQueryMap = new Map();
    renderSelectionSummary();
    return;
  }

  const targetCity =
    preferredCityKey &&
    selectedCountry.cities.some((city) => city.key === preferredCityKey)
      ? preferredCityKey
      : selectedCountry.cities[0].key;

  locationPrayerQueryMap = new Map(
    selectedCountry.cities.map((city) => [
      city.key,
      city.prayerQuery || city.key,
    ]),
  );
  cityInput.innerHTML = selectedCountry.cities
    .map((city) => `<option value="${city.key}">${city.name}</option>`)
    .join("");
  cityInput.removeAttribute("disabled");
  cityInput.value = targetCity;
  appState.selectedCity = targetCity;
  renderSelectionSummary();
}

function resetLocationSelection() {
  cityInput.innerHTML = `<option value="">اختر المنطقة</option>`;
  cityInput.setAttribute("disabled", "disabled");
  appState.selectedCity = "";
  locationPrayerQueryMap = new Map();
}

function updateHeaderDates() {
  currentDateElement.textContent = appState.readableDate;
  currentHijriDateElement.textContent = appState.hijriDate;
}

function renderSelectionSummary() {
  const country = countries.find(
    (item) => item.key === appState.selectedCountry,
  );
  const city = country?.cities.find(
    (item) => item.key === appState.selectedCity,
  );

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

  const nextPrayer = PrayerService.getNextPrayer(appState.prayers);
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

  PrayerService.fetchPrayerTimes(
    apiDate,
    country,
    locationPrayerQueryMap.get(city) || city,
  )
    .then((result) => {
      if (requestId !== latestRequestId) {
        return;
      }

      appState.prayers = result.prayers;
      appState.hijriDate = result.hijriDate;
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
