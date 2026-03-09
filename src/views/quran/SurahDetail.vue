<template>
  <div class="min-h-screen bg-background font-body">
    <!-- STICKY TOP BAR -->
    <div class="bg-foreground text-main-foreground border-b-4 border-accent sticky top-16 z-30">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Button as-child variant="ghost" size="sm" class="text-main-foreground/70 border-main-foreground/20 shrink-0">
          <RouterLink :to="{ name: 'quran' }" class="flex items-center gap-2">
            <BookOpen class="w-4 h-4" />
            Daftar Surah
          </RouterLink>
        </Button>

        <div v-if="surah" class="text-center min-w-0">
          <p class="font-display font-black text-sm truncate">{{ surah.nama_latin }}</p>
          <p class="text-[10px] text-main-foreground/50">{{ surah.jumlah_ayat }} Ayat · {{ surah.tempat_turun }}</p>
        </div>

        <!-- Font size buttons -->
        <div class="flex gap-1 shrink-0">
          <Button v-for="s in fontSizes" :key="s.value" :variant="fontSize === s.value ? 'reverse' : 'ghost'" size="icon" class="w-7 h-7 text-xs border-main-foreground/30 text-main-foreground" @click="fontSize = s.value">
            {{ s.label }}
          </Button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- SKELETON -->
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <!-- SURAH HEADER -->
        <div class="border-4 rounded-xl p-8 bg-muted/40">
          <div class="flex flex-col items-center gap-4">
            <div class="h-6 w-24 bg-muted rounded"></div>
            <div class="h-10 w-48 bg-muted rounded"></div>
            <div class="h-5 w-64 bg-muted rounded"></div>

            <div class="mt-6 pt-6 w-full border-t border-muted">
              <div class="h-8 w-72 mx-auto bg-muted rounded"></div>
              <div class="h-3 w-56 mx-auto mt-2 bg-muted rounded"></div>
            </div>
          </div>
        </div>

        <!-- SETTINGS -->
        <div class="flex items-center gap-3">
          <div class="h-8 w-20 bg-muted rounded"></div>
          <div class="h-8 w-24 bg-muted rounded"></div>
          <div class="h-8 w-28 bg-muted rounded"></div>
          <div class="h-6 w-16 bg-muted rounded ml-auto"></div>
        </div>

        <!-- AYAT LIST -->
        <div class="space-y-4">
          <div v-for="n in 6" :key="n" class="border rounded-xl p-5 space-y-4 bg-muted/30">
            <!-- header -->
            <div class="flex justify-between items-center">
              <div class="h-6 w-10 bg-muted rounded"></div>
              <div class="flex gap-2">
                <div class="h-8 w-8 bg-muted rounded"></div>
                <div class="h-8 w-8 bg-muted rounded"></div>
              </div>
            </div>

            <!-- arabic -->
            <div class="space-y-2">
              <div class="h-6 w-full bg-muted rounded"></div>
              <div class="h-6 w-5/6 bg-muted rounded"></div>
            </div>

            <!-- latin -->
            <div class="h-4 w-4/5 bg-muted rounded"></div>

            <!-- translation -->
            <div class="h-4 w-full bg-muted rounded"></div>
            <div class="h-4 w-3/4 bg-muted rounded"></div>
          </div>
        </div>
      </div>

      <!-- ERROR -->
      <Alert v-else-if="isError" variant="destructive" :title="error?.message" class="mb-6">
        <Button variant="neutral" size="sm" class="mt-3 border-error text-error" @click="() => refetch()"> Coba Lagi </Button>
      </Alert>

      <template v-else-if="surah">
        <!-- SURAH HEADER -->
        <Card class="border-4 bg-main text-main-foreground p-8 text-center mb-6 shadow-shadow-lg relative overflow-hidden">
          <div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px" />
          <div class="relative">
            <Badge variant="default" class="mb-4">Surah ke-{{ surah.nomor }}</Badge>
            <p class="font-arabic text-6xl text-main-foreground mb-3 leading-relaxed" dir="rtl">{{ surah.nama }}</p>
            <h1 class="font-display text-3xl font-black">{{ surah.nama_latin }}</h1>
            <p class="text-main-foreground/60 text-sm mt-1">{{ surah.arti }} · {{ surah.jumlah_ayat }} Ayat · {{ surah.tempat_turun }}</p>
            <div v-if="surah.nomor !== 9" class="mt-6 pt-6 border-t border-main-foreground/10">
              <p class="font-arabic text-3xl text-main-foreground/80 leading-relaxed" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p class="text-main-foreground/40 text-xs mt-1">Dengan nama Allah Yang Maha Pengasih, Maha Penyayang</p>
            </div>
          </div>
        </Card>

        <!-- DISPLAY SETTINGS -->
        <div class="flex items-center gap-2 mb-5 flex-wrap">
          <span class="text-xs font-black text-muted-foreground tracking-wider uppercase">Tampilkan:</span>
          <Button :variant="showLatin ? 'default' : 'neutral'" size="sm" @click="showLatin = !showLatin">Latin</Button>
          <Button :variant="showTranslation ? 'default' : 'neutral'" size="sm" @click="showTranslation = !showTranslation">Terjemahan</Button>
          <Badge variant="neutral" class="ml-auto">{{ surah.jumlah_ayat }} ayat</Badge>
        </div>

        <!-- AYAT LIST -->
        <div class="space-y-3">
          <Card v-for="ayat in surah.ayat" :key="ayat.nomor" class="p-5 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-150">
            <!-- Ayat header -->
            <div class="flex items-center justify-between mb-4">
              <Badge variant="neutral">{{ ayat.nomor }}</Badge>
              <div class="flex gap-1.5">
                <Button variant="ghost" size="icon" class="w-8 h-8 text-sm" title="Putar Audio">▶</Button>
                <Button variant="ghost" size="icon" class="w-8 h-8 text-sm" title="Salin" @click="copy(ayat)">📋</Button>
              </div>
            </div>

            <!-- Arabic -->
            <p :class="['font-arabic text-right text-foreground leading-loose mb-4', arabicClass]" dir="rtl">
              {{ ayat.ar }}
            </p>

            <!-- Latin -->
            <Transition name="fade">
              <p v-if="showLatin" :class="['italic text-muted-foreground mb-2 leading-relaxed', bodyClass]" v-html="ayat.tr" />
            </Transition>

            <!-- Translation -->
            <Transition name="fade">
              <p v-if="showTranslation" :class="['text-foreground/80 leading-relaxed border-l-4 border-accent pl-3', bodyClass]">
                {{ ayat.idn }}
              </p>
            </Transition>
          </Card>
        </div>

        <!-- PREV / NEXT -->
        <div class="grid grid-cols-2 gap-4 mt-8">
          <Card v-if="surah.surat_sebelumnya" hoverable class="p-4 cursor-pointer" @click="router.push({ name: 'surah-detail', params: { surahId: surah.surat_sebelumnya.nomor } })">
            <p class="text-xs font-black text-muted-foreground mb-1">← SEBELUMNYA</p>
            <p class="font-display font-black text-foreground">{{ surah.surat_sebelumnya.nama_latin }}</p>
          </Card>
          <div v-else />

          <Card v-if="surah.surat_selanjutnya" hoverable class="p-4 text-right cursor-pointer" @click="router.push({ name: 'surah-detail', params: { surahId: surah.surat_selanjutnya.nomor } })">
            <p class="text-xs font-black text-muted-foreground mb-1">BERIKUTNYA →</p>
            <p class="font-display font-black text-foreground">{{ surah.surat_selanjutnya.nama_latin }}</p>
          </Card>
          <div v-else />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSurahDetail } from "@/composables/queries/useQuranQueries";
import type { Ayat } from "@/types";

import { Card } from "@/components/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Alert } from "@/components/alert";
import { BookOpen } from "lucide-vue-next";

type FontSize = "sm" | "md" | "lg" | "xl";

const route = useRoute();
const router = useRouter();

const surahId = computed(() => route.params["surahId"] as string);
const { data: surah, isLoading, isError, error, refetch } = useSurahDetail(surahId);

const showLatin = ref(true);
const showTranslation = ref(true);
const fontSize = ref<FontSize>("md");

const fontSizes: { value: FontSize; label: string }[] = [
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
  { value: "xl", label: "XL" },
];

const arabicClass = computed(() => ({ sm: "text-2xl", md: "text-3xl", lg: "text-4xl", xl: "text-5xl" })[fontSize.value]);
const bodyClass = computed(() => ({ sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl" })[fontSize.value]);

function copy(ayat: Ayat): void {
  const text = `${ayat.ar}\n${ayat.tr}\n${ayat.idn}`;
  void navigator.clipboard.writeText(text);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
