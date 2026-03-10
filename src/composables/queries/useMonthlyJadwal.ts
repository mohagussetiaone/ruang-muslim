import { useQuery } from "@tanstack/vue-query";
import type { PrayerTime } from "@/types";

async function fetchMonthlyJadwal(lat: number, lng: number, month: number, year: number) {
  const method = 20; // KEMENAG RI
  const url = `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lng}&method=${method}&month=${month}&year=${year}`;
  const res = await fetch(url);
  const data = await res.json();

  const monthly: Record<string, PrayerTime[]> = {};
  data.data.forEach((day: { date: { gregorian: { date: string } }; timings: { Fajr: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string } }) => {
    const gregorianDate = day.date.gregorian.date;
    const timings = day.timings;
    monthly[gregorianDate] = [
      { key: "Fajr", name: "Subuh", time: timings.Fajr.slice(0, 5) },
      { key: "Dhuhr", name: "Dzuhur", time: timings.Dhuhr.slice(0, 5) },
      { key: "Asr", name: "Ashar", time: timings.Asr.slice(0, 5) },
      { key: "Maghrib", name: "Maghrib", time: timings.Maghrib.slice(0, 5) },
      { key: "Isha", name: "Isya'", time: timings.Isha.slice(0, 5) },
    ];
  });
  return monthly;
}

export function useMonthlyJadwal(lat: number, lng: number, month: number, year: number) {
  return useQuery({
    queryKey: ["monthlyJadwal", lat, lng, month, year],
    queryFn: () => fetchMonthlyJadwal(lat, lng, month, year),
    enabled: !!lat && !!lng,
  });
}
