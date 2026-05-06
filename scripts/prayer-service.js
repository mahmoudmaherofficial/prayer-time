(function attachPrayerService(global) {
  const prayerConfig = [
    { key: "Fajr", label: "الفجر", note: "بداية اليوم" },
    { key: "Sunrise", label: "الشروق", note: "شروق الشمس" },
    { key: "Dhuhr", label: "الظهر", note: "منتصف النهار" },
    { key: "Asr", label: "العصر", note: "آخر النهار" },
    { key: "Maghrib", label: "المغرب", note: "وقت الإفطار" },
    { key: "Isha", label: "العشاء", note: "ختام اليوم" },
  ];

  function buildApiDate(referenceDate) {
    return `${String(referenceDate.getDate()).padStart(2, "0")}-${String(
      referenceDate.getMonth() + 1,
    ).padStart(2, "0")}-${referenceDate.getFullYear()}`;
  }

  async function fetchPrayerTimes(apiDate, country, city) {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity/${apiDate}`,
      {
        params: {
          city,
          country,
        },
      },
    );

    const timings = response.data?.data?.timings;
    const dateInfo = response.data?.data?.date;

    return {
      prayers: prayerConfig.map((prayer) => ({
        key: prayer.key,
        label: prayer.label,
        note: prayer.note,
        time: sanitizePrayerTime(timings?.[prayer.key] || "--"),
      })),
      hijriDate:
        `${dateInfo?.hijri?.weekday?.ar || ""} ${dateInfo?.hijri?.date || ""}`.trim() ||
        "--",
    };
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

  global.PrayerService = {
    buildApiDate,
    fetchPrayerTimes,
    getNextPrayer,
  };
})(window);
