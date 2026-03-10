<template>
  <div class="min-h-screen bg-background font-body">
    <!-- PAGE HEADER -->
    <div class="bg-foreground text-main-foreground border-b-4 border-accent py-12 px-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.05]" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 32px 32px" />
      <div class="relative max-w-6xl mx-auto">
        <Badge variant="default" class="mb-3">📖 Al-Quran Digital</Badge>
        <h1 class="font-display text-5xl font-black mb-1">114 Surah</h1>
        <p class="text-main-foreground/50 text-sm">Klik surah untuk membaca lengkap dengan terjemahan</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- TOOLBAR -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <Input v-model="searchQuery" placeholder="Cari surah atau artinya..." prefix-icon="🔍" class="sm:max-w-xs" />
        <div class="flex gap-2">
          <Button v-for="f in filters" :key="f.value" :variant="activeFilter === f.value ? 'default' : 'neutral'" size="sm" @click="activeFilter = f.value">
            {{ f.label }}
          </Button>
        </div>
        <p class="sm:ml-auto self-end text-xs font-black text-muted-foreground tracking-wider uppercase pt-1">{{ filteredSurah.length }} surah</p>
      </div>

      <!-- SKELETON -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3">
        <div v-for="n in 20" :key="n" class="border-4 border-black rounded-xl p-4 h-52 flex flex-col animate-pulse bg-primary/5">
          <!-- top badges -->
          <div class="flex justify-between">
            <div class="h-4 w-8 rounded bg-primary/20"></div>
            <div class="h-4 w-14 rounded bg-primary/20"></div>
          </div>

          <!-- arabic name -->
          <div class="h-6 w-16 ml-auto rounded bg-primary/20"></div>

          <!-- latin -->
          <div class="h-4 w-20 rounded bg-primary/20 mb-1"></div>

          <!-- arti -->
          <div class="h-3 w-24 rounded bg-primary/20 mb-auto"></div>

          <!-- ayat count -->
          <div class="h-3 w-14 rounded bg-primary/20 mt-3"></div>
        </div>
      </div>

      <!-- ERROR -->
      <Alert v-else-if="isError" variant="destructive" title="Gagal memuat surah" class="mb-6">
        {{ error?.message }}
        <Button variant="neutral" size="sm" class="mt-3 border-error text-error" @click="() => refetch()"> Coba Lagi </Button>
      </Alert>

      <!-- GRID -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3">
        <RouterLink v-for="surah in filteredSurah" :key="surah.nomor" :to="{ name: 'surah-detail', params: { surahId: surah.nomor } }" class="group block" @mouseenter="prefetch(surah.nomor)">
          <Card hoverable class="p-4 gap-1 h-full flex flex-col">
            <!-- Top row -->
            <div class="flex items-start justify-between">
              <Badge variant="neutral" class="text-[10px]">{{ surah.nomor }}</Badge>
              <Badge :variant="surah.tempat_turun === 'mekah' ? 'neutral' : 'default'">
                {{ surah.tempat_turun === "mekah" ? "Makkiyah" : "Madaniyah" }}
              </Badge>
            </div>
            <!-- Arabic name -->
            <p class="font-arabic text-4xl text-main text-right leading-relaxed" dir="rtl">
              {{ surah.nama }}
            </p>
            <h3 class="font-display text-lg font-black text-foreground leading-tight group-hover:text-main transition-colors">
              {{ surah.nama_latin }}
            </h3>
            <p class="text-muted-foreground mt-0.5">{{ surah.arti }}</p>
            <p class="text-sm text-muted-foreground/60 mt-auto pt-2 font-bold">{{ surah.jumlah_ayat }} ayat</p>
          </Card>
        </RouterLink>

        <!-- Empty -->
        <div v-if="!isLoading && filteredSurah.length === 0" class="col-span-full text-center py-20">
          <p class="text-5xl mb-4">🔍</p>
          <p class="font-black text-foreground text-xl">Surah tidak ditemukan</p>
          <Button
            variant="neutral"
            size="sm"
            class="mt-4"
            @click="
              searchQuery = '';
              activeFilter = 'semua';
            "
          >
            Reset Pencarian
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuranList, usePrefetchSurah } from "@/composables/queries/useQuranQueries";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { Alert } from "@/components/alert";

type FilterVal = "semua" | "Mekah" | "Madinah";
const filters: { value: FilterVal; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "Mekah", label: "Makkiyah" },
  { value: "Madinah", label: "Madaniyah" },
];

const searchQuery = ref("");
const activeFilter = ref<FilterVal>("semua");

const { data: surahList, isLoading, isError, error, refetch } = useQuranList();
console.log("surahList", surahList);

const { prefetch } = usePrefetchSurah();

// filter berdasarkan API snake_case
const filteredSurah = computed(() => {
  let list = surahList.value ?? [];

  if (activeFilter.value !== "semua") {
    list = list.filter((s) => (s.tempat_turun.toLowerCase() === "mekah" && activeFilter.value === "Mekah") || (s.tempat_turun.toLowerCase() === "madinah" && activeFilter.value === "Madinah"));
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((s) => s.nama_latin.toLowerCase().includes(q) || s.arti.toLowerCase().includes(q) || String(s.nomor).includes(q));
  }

  return list;
});
</script>
