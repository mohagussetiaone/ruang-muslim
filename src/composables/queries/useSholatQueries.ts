import { computed } from "vue";
import type { Ref, ComputedRef } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { sholatService } from "@/services/sholatService";
import type { PrayerTime } from "@/types";

export const sholatKeys = {
  all: ["sholat"] as const,
  byKoordinat: (lat: number, lng: number, date: string) => [...sholatKeys.all, "koordinat", lat, lng, date] as const,
};

interface UseJadwalParams {
  lat: Ref<number | undefined> | ComputedRef<number | undefined>;
  lng: Ref<number | undefined> | ComputedRef<number | undefined>;
  date: Ref<string> | ComputedRef<string>;
}

export function useJadwalSholat({ lat, lng, date }: UseJadwalParams) {
  return useQuery({
    queryKey: computed(() => sholatKeys.byKoordinat(lat.value ?? 0, lng.value ?? 0, date.value)),
    queryFn: () =>
      sholatService.getJadwalByKoordinat({
        lat: lat.value!,
        lng: lng.value!,
        date: date.value,
      }),
    enabled: computed(() => !!lat.value && !!lng.value && !!date.value),
    staleTime: 1000 * 60 * 60,

    // select: return PrayerTime[] yang sudah di-type
    select: (timings): PrayerTime[] =>
      [
        { name: "Subuh", time: timings.Fajr, key: "Fajr" },
        { name: "Dzuhur", time: timings.Dhuhr, key: "Dhuhr" },
        { name: "Ashar", time: timings.Asr, key: "Asr" },
        { name: "Maghrib", time: timings.Maghrib, key: "Maghrib" },
        { name: "Isya'", time: timings.Isha, key: "Isha" },
      ].map((p) => ({
        ...p,
        time: p.time.split(" ")[0] ?? p.time,
      })) as PrayerTime[],
  });
}
