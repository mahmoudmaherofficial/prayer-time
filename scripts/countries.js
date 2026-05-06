// Declaring countries & cities
let oldCountries = [
  {
    name: "مصر",
    key: "EG",
    cities: [
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
    cities: [
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

let countries = [
  {
    name: "مصر",
    key: "EG",
    cities: [
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
    cities: [
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
  {
    name: "أفغانستان",
    key: "AF",
    cities: [
      { name: "كابول", key: "Kabul" },
      { name: "هرات", key: "Herat" },
      { name: "قندهار", key: "Kandahar" },
      { name: "مزار شريف", key: "Mazar-i-Sharif" },
      { name: "جلال آباد", key: "Jalalabad" },
    ],
  },
  {
    name: "ألبانيا",
    key: "AL",
    cities: [
      { name: "تيرانا", key: "Tirana" },
      { name: "دورس", key: "Durres" },
      { name: "فلوره", key: "Vlore" },
      { name: "شكودر", key: "Shkoder" },
      { name: "إلباسان", key: "Elbasan" },
    ],
  },
  {
    name: "الجزائر",
    key: "DZ",
    cities: [
      { name: "الجزائر العاصمة", key: "Algiers" },
      { name: "وهران", key: "Oran" },
      { name: "قسنطينة", key: "Constantine" },
      { name: "عنابة", key: "Annaba" },
      { name: "تلمسان", key: "Tlemcen" },
    ],
  },
  {
    name: "أندورا",
    key: "AD",
    cities: [{ name: "أندورا لا فيلا", key: "Andorra la Vella" }],
  },
  {
    name: "أنغولا",
    key: "AO",
    cities: [
      { name: "لواندا", key: "Luanda" },
      { name: "هوانبو", key: "Huambo" },
      { name: "مبيندا", key: "Lubango" },
      { name: "بنغيلا", key: "Benguela" },
    ],
  },
  {
    name: "أنتيغوا وبربودا",
    key: "AG",
    cities: [{ name: "سانت جونز", key: "St. John's" }],
  },
  {
    name: "الأرجنتين",
    key: "AR",
    cities: [
      { name: "بوينس آيرس", key: "Buenos Aires" },
      { name: "كوردوبا", key: "Córdoba" },
      { name: "روزاريو", key: "Rosario" },
      { name: "لا بلاتا", key: "La Plata" },
    ],
  },
  {
    name: "أرمينيا",
    key: "AM",
    cities: [
      { name: "يريفان", key: "Yerevan" },
      { name: "غغاركونيك", key: "Gegharkunik" },
      { name: "شيراز", key: "Shirak" },
    ],
  },
  {
    name: "أستراليا",
    key: "AU",
    cities: [
      { name: "كانبرا", key: "Canberra" },
      { name: "سيدني", key: "Sydney" },
      { name: "ميلبورن", key: "Melbourne" },
      { name: "بريسبان", key: "Brisbane" },
      { name: "بيرث", key: "Perth" },
    ],
  },
  {
    name: "النمسا",
    key: "AT",
    cities: [
      { name: "فيينا", key: "Vienna" },
      { name: "سالزبورغ", key: "Salzburg" },
      { name: "غراتس", key: "Graz" },
      { name: "إنسبروك", key: "Innsbruck" },
    ],
  },
  {
    name: "إمبراطورية النمسا",
    key: "AT-Empire",
    cities: [], // Fill with historical cities if needed
  },
  {
    name: "أذربيجان",
    key: "AZ",
    cities: [
      { name: "باكو", key: "Baku" },
      { name: "غنجة", key: "Ganja" },
      { name: "لنكوران", key: "Lankaran" },
    ],
  },
  // Continue filling in data for the rest of the countries...
  {
    name: "الولايات المتحدة الأمريكية",
    key: "US",
    cities: [
      { name: "واشنطن", key: "Washington" },
      { name: "نيويورك", key: "New York" },
      { name: "لوس أنجلوس", key: "Los Angeles" },
      { name: "شيكاغو", key: "Chicago" },
      { name: "هيوستن", key: "Houston" },
    ],
  },
  {
    name: "اليمن",
    key: "YE",
    cities: [
      { name: "صنعاء", key: "Sana'a" },
      { name: "عدن", key: "Aden" },
      { name: "تعز", key: "Taiz" },
      { name: "المخا", key: "Al-Mokha" },
    ],
  },
  {
    name: "زامبيا",
    key: "ZM",
    cities: [
      { name: "لوساكا", key: "Lusaka" },
      { name: "كابوي", key: "Kabwe" },
    ],
  },
  {
    name: "زمبابوي",
    key: "ZW",
    cities: [
      { name: "هراري", key: "Harare" },
      { name: "بولاوايو", key: "Bulawayo" },
    ],
  },
];
