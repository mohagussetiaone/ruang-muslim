import { computed } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import type { Ref, ComputedRef } from "vue";
import { quranService } from "@/services/quranService";

// ─── QUERY KEYS ────────────────────────────────────────────────────────────
// Typed query key factory
export const quranKeys = {
  all: ["quran"] as const,
  surahList: () => [...quranKeys.all, "surah-list"] as const,
  surahDetail: (id: number | string) => [...quranKeys.all, "surah", id] as const,
  tafsir: (id: number | string) => [...quranKeys.all, "tafsir", id] as const,
};

// ─── useQuranList ───────────────────────────────────────────────────────────
export function useQuranList() {
  return useQuery({
    queryKey: quranKeys.surahList(),
    queryFn: quranService.getSurahList,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

// ─── useSurahDetail ─────────────────────────────────────────────────────────
// Menerima Ref<number> atau ComputedRef<number> — reaktif
export function useSurahDetail(id: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery({
    queryKey: computed(() => quranKeys.surahDetail(id.value)),
    queryFn: () => quranService.getSurahDetail(id.value),
    enabled: computed(() => !!id.value),
  });
}

// ─── useTafsir ──────────────────────────────────────────────────────────────
export function useTafsir(id: Ref<number | string> | ComputedRef<number | string>) {
  return useQuery({
    queryKey: computed(() => quranKeys.tafsir(id.value)),
    queryFn: () => quranService.getTafsir(id.value),
    enabled: computed(() => !!id.value),
  });
}

// ─── usePrefetchSurah ───────────────────────────────────────────────────────
export function usePrefetchSurah() {
  const queryClient = useQueryClient();

  const prefetch = (id: number): void => {
    void queryClient.prefetchQuery({
      queryKey: quranKeys.surahDetail(id),
      queryFn: () => quranService.getSurahDetail(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  return { prefetch };
}
