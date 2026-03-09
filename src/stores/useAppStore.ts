import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FontSize, Koordinat } from "@/types";

export const useAppStore = defineStore("app", () => {
  // ─── STATE ─────────────────────────────────────────────────────
  const selectedKota = ref<string>(localStorage.getItem("rm_kota") ?? "Jakarta");
  const koordinat = ref<Koordinat | null>(JSON.parse(localStorage.getItem("rm_koordinat") ?? "null") as Koordinat | null);
  const showTransliterasi = ref<boolean>(true);
  const showTerjemahan = ref<boolean>(true);
  const fontSize = ref<FontSize>("md");
  const isSidebarOpen = ref<boolean>(false);

  // ─── GETTERS ───────────────────────────────────────────────────
  const hasLocation = computed<boolean>(() => !!koordinat.value);

  const fontSizeClass = computed<string>(() => {
    const map: Record<FontSize, string> = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    };
    return map[fontSize.value];
  });

  const arabicFontSizeClass = computed<string>(() => {
    const map: Record<FontSize, string> = {
      sm: "text-2xl",
      md: "text-3xl",
      lg: "text-4xl",
      xl: "text-5xl",
    };
    return map[fontSize.value];
  });

  // ─── ACTIONS ───────────────────────────────────────────────────
  function setKota(kota: string): void {
    selectedKota.value = kota;
    localStorage.setItem("rm_kota", kota);
  }

  function setKoordinat(coords: Koordinat): void {
    koordinat.value = coords;
    localStorage.setItem("rm_koordinat", JSON.stringify(coords));
  }

  async function requestGeolocation(): Promise<Koordinat> {
    return new Promise<Koordinat>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Browser tidak support geolocation"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: Koordinat = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setKoordinat(coords);
          resolve(coords);
        },
        () => reject(new Error("Akses lokasi ditolak")),
      );
    });
  }

  return {
    selectedKota,
    koordinat,
    showTransliterasi,
    showTerjemahan,
    fontSize,
    isSidebarOpen,
    hasLocation,
    fontSizeClass,
    arabicFontSizeClass,
    setKota,
    setKoordinat,
    requestGeolocation,
  };
});
