<template>
  <div class="min-h-screen bg-background font-body flex">
    <aside v-if="sidebarOpen" class="hidden lg:flex fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-secondary-background text-foreground border-r-4 border-accent z-40 flex-col overflow-hidden">
      <!-- Header -->
      <div class="px-5 py-4 border-b-2 border-main-foreground/10 flex items-center justify-between shrink-0">
        <div>
          <p class="font-display font-black text-base">Al-Quran Digital</p>
          <p class="text-main-foreground/40 text-[10px] mt-0.5">114 Surah</p>
        </div>
        <button class="w-7 h-7 flex items-center justify-center rounded-md border border-main-foreground/20 text-main-foreground/50 hover:text-main-foreground hover:border-main-foreground/40 transition-colors" @click="sidebarOpen = false">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Search -->
      <div class="px-3 py-2.5 border-b-2 border-main-foreground/10 shrink-0">
        <div class="relative">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-main-foreground/40" />
          <input
            v-model="sidebarSearch"
            placeholder="Cari surah..."
            class="w-full bg-primary border border-main-foreground/15 rounded-md pl-7 pr-3 py-1.5 text-xs text-main-foreground placeholder:text-main-foreground/30 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <!-- Filter -->
      <div class="px-3 py-2 border-b-2 border-main-foreground/10 flex gap-1 shrink-0">
        <Button v-for="f in filters" :key="f.value" :variant="sidebarFilter === f.value ? 'default' : 'neutral'" class="flex-1 text-[10px] font-black py-1 px-1.5 rounded" @click="sidebarFilter = f.value">
          {{ f.label }}
        </Button>
      </div>

      <!-- List -->
      <nav class="flex-1 overflow-y-auto p-2">
        <!-- Loading skeleton -->
        <div v-if="listLoading" class="py-2">
          <div v-for="n in 10" :key="n" class="flex items-center gap-2.5 px-4 py-2.5 animate-pulse">
            <div class="w-5 h-4 rounded bg-main-foreground/10 shrink-0" />
            <div class="flex-1 space-y-1">
              <div class="h-3 w-20 rounded bg-main-foreground/10" />
              <div class="h-2 w-14 rounded bg-main-foreground/10" />
            </div>
            <div class="h-5 w-8 rounded bg-main-foreground/10 shrink-0" />
          </div>
        </div>

        <!-- Surah items — komponen ini TIDAK pernah di-unmount selama di halaman quran -->
        <SurahSidebar :surahList="filteredSurahList" :surahId="currentSurahId" :loading="isLoading" @select="closeMobileSheet" />

        <!-- Empty state -->
        <div v-if="!listLoading && filteredSurahList.length === 0" class="px-4 py-8 text-center">
          <p class="text-main-foreground/30 text-xs font-black">Tidak ditemukan</p>
          <button class="mt-2 text-[10px] text-main-foreground/30 hover:text-main-foreground/50 underline" @click="sidebarSearch = ''">Reset</button>
        </div>
      </nav>

      <div class="px-4 py-2 border-t-2 border-main-foreground/10 shrink-0">
        <p class="text-[9px] text-main-foreground/20 text-center">equran.id</p>
      </div>
    </aside>

    <!-- ─── MAIN CONTENT ───────────────────────────────────────────────────── -->
    <!-- Offset kiri saat sidebar terbuka di desktop -->
    <div :class="['flex-1 min-w-0 transition-all duration-300', sidebarOpen ? 'lg:ml-72' : '']">
      <RouterView />
    </div>

    <!-- ─── MOBILE SHEET ───────────────────────────────────────────────────── -->
    <Sheet v-model:open="sheetOpen">
      <SheetContent side="left" class="w-80 p-0 gap-0 bg-secondary-background text-foreground border-r-4 border-accent flex flex-col">
        <!-- Header -->
        <SheetHeader class="px-5 border-b-2 border-main-foreground/10 shrink-0">
          <SheetTitle class="font-display font-black text-base text-left"> Al-Quran Digital </SheetTitle>
          <SheetDescription class="text-[10px] text-left -mt-1">114 Surah</SheetDescription>
        </SheetHeader>

        <!-- Search -->
        <div class="px-3 py-2.5 border-b-2 border-main-foreground/10 shrink-0">
          <div class="relative">
            <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-main-foreground/40" />
            <input
              v-model="sidebarSearch"
              placeholder="Cari surah..."
              class="w-full bg-primary border border-main-foreground/15 rounded-md pl-7 pr-3 py-1.5 text-xs text-main-foreground placeholder:text-main-foreground/30 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <!-- Filter -->
        <div class="px-3 py-2 border-b-2 border-main-foreground/10 flex gap-1 shrink-0">
          <Button v-for="f in filters" :key="f.value" :variant="sidebarFilter === f.value ? 'default' : 'neutral'" class="flex-1 text-[10px] font-black py-1 px-1.5 rounded" @click="sidebarFilter = f.value">
            {{ f.label }}
          </Button>
        </div>

        <!-- List -->
        <nav class="flex-1 overflow-y-auto p-2">
          <div v-if="listLoading" class="py-2">
            <div v-for="n in 10" :key="n" class="flex items-center gap-2.5 px-4 py-2.5 animate-pulse">
              <div class="w-5 h-4 rounded bg-main-foreground/10 shrink-0" />
              <div class="flex-1 space-y-1">
                <div class="h-3 w-20 rounded bg-main-foreground/10" />
                <div class="h-2 w-14 rounded bg-main-foreground/10" />
              </div>
              <div class="h-5 w-8 rounded bg-main-foreground/10 shrink-0" />
            </div>
          </div>

          <SurahSidebar :surahList="filteredSurahList" :surahId="currentSurahId" :loading="isLoading" @select="closeMobileSheet" />

          <div v-if="!listLoading && filteredSurahList.length === 0" class="px-4 py-8 text-center">
            <p class="text-main-foreground/30 text-xs font-black">Tidak ditemukan</p>
            <button class="mt-2 text-[10px] text-main-foreground/30 hover:text-main-foreground/50 underline" @click="sidebarSearch = ''">Reset</button>
          </div>
        </nav>

        <div class="px-4 py-2 border-t-2 border-main-foreground/10 shrink-0">
          <p class="text-[9px] text-main-foreground/20 text-center">equran.id</p>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { RouterView } from "vue-router";
import { X, Search } from "lucide-vue-next";

import { Button } from "@/components/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/sheet";
import SurahSidebar from "@/views/quran/SurahSidebar.vue";
import { useQuranSidebar } from "@/composables/useQuranSidebar";

const route = useRoute();

const { sidebarOpen, sheetOpen, sidebarSearch, sidebarFilter, filters, listLoading, filteredSurahList, initSidebar, closeMobileSheet, isLoading } = useQuranSidebar();

// Ambil surahId aktif dari route params untuk highlight sidebar
const currentSurahId = computed(() => route.params["surahId"] as string | undefined);

onMounted(() => {
  initSidebar();
});
</script>

<style scoped></style>
