(function attachGeoService(global) {
  const countriesApiUrl = "https://countriesnow.space/api/v0.1/countries";
  const egyptStatesApiUrl =
    "https://countriesnow.space/api/v0.1/countries/states/q?country=Egypt";

  async function loadCountries() {
    const [countriesResponse, egyptStatesResponse] = await Promise.all([
      axios.get(countriesApiUrl),
      axios.get(egyptStatesApiUrl),
    ]);

    const countryData = countriesResponse.data?.data;
    const egyptStates = egyptStatesResponse.data?.data?.states;

    if (!Array.isArray(countryData) || !Array.isArray(egyptStates)) {
      throw new Error("Invalid geo data response");
    }

    return countryData.map((country) =>
      country.iso2 === "EG"
        ? buildEgyptCountry(country, egyptStates)
        : buildCountryWithCities(country),
    );
  }

  function buildCountryWithCities(country) {
    return {
      name: country.country,
      key: country.iso2,
      cities: normalizeCityLocations(country.cities || []),
    };
  }

  function buildEgyptCountry(country, states) {
    return {
      name: country.country,
      key: country.iso2,
      cities: states.map((state) => {
        const normalizedName = normalizeEgyptGovernorateName(state.name);

        return {
          name: normalizedName,
          key: buildLocationKey(normalizedName),
          prayerQuery: normalizedName,
        };
      }),
    };
  }

  function normalizeCityLocations(cityNames) {
    return cityNames
      .filter((cityName) => typeof cityName === "string" && cityName.trim())
      .map((cityName) => {
        const normalizedName = cityName.trim();

        return {
          name: normalizedName,
          key: buildLocationKey(normalizedName),
          prayerQuery: normalizedName,
        };
      });
  }

  function normalizeEgyptGovernorateName(stateName) {
    return stateName.replace(/\s+Governorate$/i, "").trim();
  }

  function buildLocationKey(name) {
    return name.replace(/\s+/g, "-");
  }

  global.GeoService = {
    loadCountries,
  };
})(window);
