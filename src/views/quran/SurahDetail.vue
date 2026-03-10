<template>
  <div>
    <!-- ─── STICKY TOP BAR ──────────────────────────────────────────────────── -->
    <div class="bg-foreground text-main-foreground border-b-4 border-accent sticky top-16 z-30">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <!-- Toggle sidebar/sheet -->
        <Button variant="ghost" size="sm" class="text-main-foreground/70 border-main-foreground/20 shrink-0" @click="toggleSurahList">
          <BookOpen class="w-4 h-4" />
          <span class="hidden sm:inline ml-1.5">Daftar Surah</span>
        </Button>

        <!-- Judul surah -->
        <div v-if="surah" class="text-center min-w-0">
          <p class="font-display font-black text-sm truncate">{{ surah.nama_latin }}</p>
          <p class="text-[10px] text-main-foreground/50">{{ surah.jumlah_ayat }} Ayat · {{ surah.tempat_turun }}</p>
        </div>

        <!-- Audio + Font size controls -->
        <div class="flex items-center gap-2 shrink-0">
          <Button v-if="surah?.audio" :variant="isPlaying ? 'reverse' : 'ghost'" size="icon" class="w-7 h-7 text-xs border-main-foreground/30 text-main-foreground" :title="isPlaying ? 'Jeda' : 'Putar Surah'" @click="toggleAudio">
            <Play v-if="!isPlaying" class="w-4 h-4" />
            <Pause v-else class="w-4 h-4" />
          </Button>

          <Button v-for="s in fontSizes" :key="s.value" :variant="fontSize === s.value ? 'reverse' : 'ghost'" size="icon" class="w-7 h-7 text-xs border-main-foreground/30 text-main-foreground" @click="fontSize = s.value">
            {{ s.label }}
          </Button>
        </div>
      </div>
    </div>

    <!-- ─── PAGE CONTENT ────────────────────────────────────────────────────── -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- SKELETON -->
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <!-- Header surah skeleton -->
        <div class="border-4 rounded-xl p-8 bg-muted/40">
          <div class="flex flex-col items-center gap-4">
            <div class="h-6 w-24 bg-muted rounded" />
            <div class="h-10 w-48 bg-muted rounded" />
            <div class="h-5 w-64 bg-muted rounded" />
            <div class="mt-6 pt-6 w-full border-t border-muted">
              <div class="h-8 w-72 mx-auto bg-muted rounded" />
              <div class="h-3 w-56 mx-auto mt-2 bg-muted rounded" />
            </div>
          </div>
        </div>

        <!-- Daftar ayat skeleton -->
        <div class="space-y-4">
          <div v-for="n in 6" :key="n" class="border rounded-xl p-5 space-y-4 bg-muted/30">
            <div class="flex justify-between items-center">
              <!-- Badge nomor ayat (tetap bg-muted, rounded biasa) -->
              <div class="h-6 w-10 bg-muted rounded" />

              <!-- Ikon play & copy – bulat, gunakan bg-primary/20 -->
              <div class="flex gap-2">
                <div class="h-8 w-8 bg-primary/20 rounded-full" />
                <div class="h-8 w-8 bg-primary/20 rounded-full" />
              </div>
            </div>

            <!-- Teks arab (dua baris) -->
            <div class="space-y-2">
              <div class="h-6 w-full bg-muted rounded" />
              <div class="h-6 w-5/6 bg-muted rounded" />
            </div>

            <!-- Teks latin -->
            <div class="h-4 w-4/5 bg-muted rounded" />

            <!-- Teks terjemahan -->
            <div class="h-4 w-full bg-muted rounded" />
          </div>
        </div>
      </div>

      <!-- ERROR -->
      <Alert v-else-if="isError" variant="destructive" :title="error?.message" class="mb-6">
        <Button variant="neutral" size="sm" class="mt-3 border-error text-error" @click="() => refetch()"> Coba Lagi </Button>
      </Alert>

      <!-- SURAH CONTENT -->
      <template v-else-if="surah">
        <!-- Header surah -->
        <Card class="border-4 bg-main text-main-foreground p-8 text-center mb-6 shadow-shadow-lg relative overflow-hidden">
          <div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 24px 24px" />
          <div class="relative">
            <Badge variant="neutral" class="mb-4">Surah ke-{{ surah.nomor }}</Badge>
            <p class="font-arabic text-6xl text-main-foreground mb-3 leading-relaxed" dir="rtl">
              {{ surah.nama }}
            </p>
            <h1 class="font-display text-3xl font-black">{{ surah.nama_latin }}</h1>
            <p class="text-main-foreground/60 text-sm mt-1">{{ surah.arti }} · {{ surah.jumlah_ayat }} Ayat · {{ surah.tempat_turun }}</p>
            <div v-if="surah.nomor !== 9" class="mt-6 pt-6 border-t border-main-foreground/10">
              <p class="font-arabic text-3xl text-main-foreground/80 leading-relaxed" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p class="text-main-foreground/40 text-xs mt-1">Dengan nama Allah Yang Maha Pengasih, Maha Penyayang</p>
            </div>
          </div>
        </Card>

        <!-- Display settings -->
        <div class="flex items-center gap-2 mb-5 flex-wrap">
          <span class="text-xs font-black text-muted-foreground tracking-wider uppercase"> Tampilkan: </span>
          <Button :variant="showLatin ? 'default' : 'neutral'" size="sm" @click="showLatin = !showLatin"> Latin </Button>
          <Button :variant="showTranslation ? 'default' : 'neutral'" size="sm" @click="showTranslation = !showTranslation"> Terjemahan </Button>
          <Badge variant="neutral" class="ml-auto">{{ surah.jumlah_ayat }} ayat</Badge>
        </div>

        <!-- Ayat list -->
        <div class="space-y-3">
          <Card v-for="ayat in surah.ayat" :key="ayat.nomor" class="p-5 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-150">
            <div class="flex items-center justify-between mb-4">
              <Badge variant="neutral">{{ ayat.nomor }}</Badge>
              <div class="flex gap-1.5">
                <Button variant="ghost" size="icon" class="w-8 h-8" :disabled="!surah.audio" @click="playFromStart">
                  <Play class="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" class="w-8 h-8" @click="copy(ayat)">
                  <Copy class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p :class="['font-arabic text-right text-foreground leading-loose mb-4', arabicClass]" dir="rtl">
              {{ ayat.ar }}
            </p>

            <Transition name="fade">
              <p v-if="showLatin" :class="['italic text-muted-foreground mb-2 leading-relaxed', bodyClass]" v-html="ayat.tr" />
            </Transition>

            <Transition name="fade">
              <p v-if="showTranslation" :class="['text-foreground/80 leading-relaxed border-l-4 border-accent pl-3', bodyClass]">
                {{ ayat.idn }}
              </p>
            </Transition>
          </Card>
        </div>

        <!-- Prev / Next navigation -->
        <div class="grid grid-cols-2 gap-4 mt-8">
          <Card v-if="surah.surat_sebelumnya" hoverable class="p-4 cursor-pointer" @click="router.push({ name: 'surah-detail', params: { surahId: surah.surat_sebelumnya.nomor } })">
            <p class="text-xs font-black text-muted-foreground mb-1">← SEBELUMNYA</p>
            <p class="font-display font-black text-foreground">
              {{ surah.surat_sebelumnya.nama_latin }}
            </p>
          </Card>
          <div v-else />

          <Card v-if="surah.surat_selanjutnya" hoverable class="p-4 text-right cursor-pointer" @click="router.push({ name: 'surah-detail', params: { surahId: surah.surat_selanjutnya.nomor } })">
            <p class="text-xs font-black text-muted-foreground mb-1">BERIKUTNYA →</p>
            <p class="font-display font-black text-foreground">
              {{ surah.surat_selanjutnya.nama_latin }}
            </p>
          </Card>
          <div v-else />
        </div>
      </template>
    </div>

    <!-- ─── AUDIO FOOTER ─────────────────────────────────────────────────────── -->
    <div v-if="surah?.audio && showFooter" class="fixed bottom-0 left-0 right-0 bg-foreground text-main-foreground border-t-4 border-accent z-40 shadow-up">
      <div class="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Button variant="ghost" size="icon" class="text-main-foreground border-main-foreground/20 w-8 h-8" @click="toggleAudio">
            <Play v-if="!isPlaying" class="w-4 h-4" />
            <Pause v-else class="w-4 h-4" />
          </Button>
          <div>
            <p class="font-display font-bold text-sm">Memutar: {{ surah.nama_latin }}</p>
            <p class="text-xs text-main-foreground/60">Audio surah · {{ isPlaying ? "Sedang diputar" : "Berhenti" }}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" class="text-main-foreground/60 hover:text-main-foreground w-6 h-6" @click="showFooter = false">
          <X class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSurahDetail } from "@/composables/queries/useQuranQueries";
import type { Ayat } from "@/types";

import { Card } from "@/components/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Alert } from "@/components/alert";
import { BookOpen, Play, Pause, Copy, X } from "lucide-vue-next";
import { useQuranSidebar } from "@/composables/useQuranSidebar";

type FontSize = "sm" | "md" | "lg" | "xl";

const route = useRoute();
const router = useRouter();

// Ambil toggle dari composable yang sama — state-nya shared
const { toggleSurahList } = useQuranSidebar();

const surahId = computed(() => route.params["surahId"] as string);
const { data: surah, isLoading, isError, error, refetch } = useSurahDetail(surahId);

// ─── Audio ────────────────────────────────────────────────────────────────────
const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const showFooter = ref(true);

watch(
  () => surah.value?.audio,
  (newAudioUrl) => {
    // Bersihkan audio lama saat ganti surah
    if (audioRef.value) {
      audioRef.value.pause();
      audioRef.value = null;
      isPlaying.value = false;
    }
    if (newAudioUrl) {
      audioRef.value = new Audio(newAudioUrl);
      audioRef.value.onended = () => {
        isPlaying.value = false;
      };
    }
    showFooter.value = true;
  },
  { immediate: true },
);

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause();
    audioRef.value = null;
  }
});

const toggleAudio = () => {
  if (!audioRef.value) return;
  isPlaying.value ? audioRef.value.pause() : void audioRef.value.play();
  isPlaying.value = !isPlaying.value;
};

const playFromStart = () => {
  if (!audioRef.value) return;
  audioRef.value.currentTime = 0;
  void audioRef.value.play();
  isPlaying.value = true;
  showFooter.value = true;
};

// ─── Display settings ─────────────────────────────────────────────────────────
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
