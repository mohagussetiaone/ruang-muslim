// src/composables/useQuranSidebar.ts
import { ref, computed } from "vue";
import { useQuranList } from "@/composables/queries/useQuranQueries";

type FilterVal = "semua" | "Mekah" | "Madinah";

// ─── Module-level state (shared across all components) ───────────────────────
// State ini hidup di module scope, bukan di dalam fungsi,
// sehingga semua komponen yang import composable ini share state yang sama.
const sidebarOpen = ref(false);
const sheetOpen = ref(false);
const sidebarSearch = ref("");
const sidebarFilter = ref<FilterVal>("semua");

export function useQuranSidebar() {
  const { data: surahList, isLoading: listLoading, isError, error } = useQuranList();

  const filters: { value: FilterVal; label: string }[] = [
    { value: "semua", label: "Semua" },
    { value: "Mekah", label: "Makkiyah" },
    { value: "Madinah", label: "Madaniyah" },
  ];

  const filteredSurahList = computed(() => {
    let list = surahList.value ?? [];

    if (sidebarFilter.value !== "semua") {
      list = list.filter((s) => {
        const tempat = s.tempat_turun.toLowerCase();
        if (sidebarFilter.value === "Mekah") {
          return tempat.includes("mekah") || tempat.includes("mekkah");
        } else {
          return tempat.includes("madinah");
        }
      });
    }

    if (sidebarSearch.value.trim()) {
      const q = sidebarSearch.value.toLowerCase();
      list = list.filter((s) => s.nama_latin.toLowerCase().includes(q) || s.arti.toLowerCase().includes(q) || String(s.nomor).includes(q));
    }

    return list;
  });

  // Toggle: desktop = sidebar, mobile = sheet
  const toggleSurahList = () => {
    if (window.innerWidth >= 1024) {
      sidebarOpen.value = !sidebarOpen.value;
    } else {
      sheetOpen.value = true;
    }
  };

  const initSidebar = () => {
    // Buka sidebar otomatis di desktop saat pertama kali masuk
    if (window.innerWidth >= 1024) {
      sidebarOpen.value = true;
    }
  };

  const closeMobileSheet = () => {
    sheetOpen.value = false;
  };

  return {
    // State
    sidebarOpen,
    sheetOpen,
    sidebarSearch,
    sidebarFilter,
    filters,

    // Data
    surahList,
    listLoading,
    filteredSurahList,

    // Actions
    toggleSurahList,
    initSidebar,
    closeMobileSheet,

    //loading
    isLoading: computed(() => listLoading.value),
    isError: computed(() => isError.value),
    error: computed(() => error.value),
  };
}
