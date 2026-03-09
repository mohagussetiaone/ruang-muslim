<template>
  <div class="min-h-screen bg-background font-body">
    <!-- PAGE HEADER -->
    <div class="bg-foreground text-main-foreground border-b-4 border-accent py-12 px-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.05]" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 32px 32px" />
      <div class="relative max-w-5xl mx-auto">
        <Badge variant="default" class="mb-3">🤲 Kumpulan Do'a</Badge>
        <h1 class="font-display text-5xl font-black mb-1">Do'a & Dzikir</h1>
        <p class="text-main-foreground/50 text-sm">Do'a pilihan dari Al-Quran, Hadits Shahih, dan Dzikir harian</p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- TOOLBAR -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <Input v-model="searchQuery" placeholder="Cari do'a..." prefix-icon="🔍" class="sm:max-w-xs" />
        <div class="flex gap-2 flex-wrap">
          <Button v-for="cat in categories" :key="cat.value" :variant="activeCategory === cat.value ? 'default' : 'neutral'" size="sm" @click="activeCategory = cat.value"> {{ cat.icon }} {{ cat.label }} </Button>
        </div>
      </div>

      <!-- COUNT -->
      <p class="text-xs font-black text-muted-foreground tracking-wider uppercase mb-5">{{ filteredDoa.length }} do'a ditemukan</p>

      <!-- DOA GRID -->
      <div class="grid md:grid-cols-2 gap-4">
        <Card v-for="doa in filteredDoa" :key="doa.id" class="p-6 border-2 hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-150">
          <!-- Header -->
          <div class="flex items-start justify-between mb-4 gap-3">
            <div>
              <h3 class="font-display font-black text-foreground text-lg">{{ doa.judul }}</h3>
              <Badge :variant="categoryVariant(doa.kategori ?? 'neutral')" class="mt-1 text-[9px]">
                {{ doa.kategori ?? "Tidak diketahui" }}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" class="w-8 h-8 shrink-0" :class="{ 'bg-accent/20': favorites.has(doa.id) }" @click="toggleFavorite(doa.id)">
              {{ favorites.has(doa.id) ? "❤️" : "🤍" }}
            </Button>
          </div>

          <!-- Arabic -->
          <div class="bg-muted border-2 border-border p-4 mb-3">
            <p class="font-arabic text-2xl text-main text-right leading-loose" dir="rtl">
              {{ doa.arab }}
            </p>
          </div>

          <!-- Latin -->
          <p class="text-sm italic text-muted-foreground mb-2 leading-relaxed">{{ doa.latin }}</p>

          <!-- Translation -->
          <p class="text-sm text-foreground/80 leading-relaxed border-l-4 border-accent pl-3 mb-4">
            {{ doa.arti }}
          </p>

          <!-- Source + Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-border/30">
            <p class="text-[10px] font-bold text-muted-foreground/60 tracking-wide">{{ doa.sumber }}</p>
            <Button variant="ghost" size="sm" class="text-xs" @click="copyDoa(doa)"> 📋 Salin </Button>
          </div>
        </Card>
      </div>

      <!-- EMPTY -->
      <div v-if="filteredDoa.length === 0" class="text-center py-20">
        <p class="text-5xl mb-4">🤲</p>
        <p class="font-black text-xl text-foreground">Do'a tidak ditemukan</p>
        <Button
          variant="neutral"
          size="sm"
          class="mt-4"
          @click="
            searchQuery = '';
            activeCategory = 'semua';
          "
        >
          Reset Filter
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";

// ── Types ─────────────────────────────────────────────────────────
type CategoryVal = "semua" | "harian" | "quran" | "dzikir" | "sholat";

interface Doa {
  id: number;
  judul: string;
  arab: string;
  latin: string;
  arti: string;
  sumber: string;
  kategori: string;
}

// ── State ─────────────────────────────────────────────────────────
const searchQuery = ref("");
const activeCategory = ref<CategoryVal>("semua");
const favorites = ref(new Set<number>());

const categories: { value: CategoryVal; label: string; icon: string }[] = [
  { value: "semua", label: "Semua", icon: "🌟" },
  { value: "harian", label: "Harian", icon: "☀️" },
  { value: "quran", label: "Al-Quran", icon: "📖" },
  { value: "dzikir", label: "Dzikir", icon: "📿" },
  { value: "sholat", label: "Sholat", icon: "🕌" },
];

// ── Static doa data (ganti dengan API jika ada) ────────────────────
const doaList: Doa[] = [
  {
    id: 1,
    judul: "Do'a Sebelum Tidur",
    kategori: "harian",
    arab: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    latin: "Bismika Allahumma amuutu wa ahyaa",
    arti: "Dengan nama-Mu ya Allah, aku mati (tidur) dan aku hidup (bangun)",
    sumber: "HR. Bukhari no. 6312",
  },
  {
    id: 2,
    judul: "Do'a Bangun Tidur",
    kategori: "harian",
    arab: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahilladzi ahyaanaa ba'da maa amaatanaa wa ilaihinnusyuur",
    arti: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan kepada-Nya tempat kembali",
    sumber: "HR. Bukhari no. 6314",
  },
  {
    id: 3,
    judul: "Ayat Kursi",
    kategori: "quran",
    arab: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    latin: "Allahu laa ilaaha illaa huwal hayyul qayyuum",
    arti: "Allah, tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus menerus mengurus (makhluk-Nya)",
    sumber: "QS. Al-Baqarah: 255",
  },
  {
    id: 4,
    judul: "Do'a Masuk Masjid",
    kategori: "sholat",
    arab: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    latin: "Allahumma iftah lii abwaaba rahmatik",
    arti: "Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu",
    sumber: "HR. Muslim no. 713",
  },
  {
    id: 5,
    judul: "Dzikir Pagi — Subhanallah",
    kategori: "dzikir",
    arab: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    latin: "Subhanallahi wa bihamdih",
    arti: "Maha Suci Allah dan segala puji bagi-Nya",
    sumber: "HR. Bukhari no. 6405 (dibaca 100x)",
  },
  {
    id: 6,
    judul: "Do'a Keluar Rumah",
    kategori: "harian",
    arab: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    latin: "Bismillahi tawakkaltu alallahi wa laa hawla wa laa quwwata illaa billah",
    arti: "Dengan nama Allah, aku bertawakal kepada Allah, dan tidak ada daya serta kekuatan kecuali dengan pertolongan Allah",
    sumber: "HR. Abu Dawud no. 5095",
  },
  {
    id: 7,
    judul: "Do'a Sebelum Makan",
    kategori: "harian",
    arab: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    latin: "Allahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaabannaar",
    arti: "Ya Allah, berkahilah kami dalam rezeki yang telah Engkau anugerahkan kepada kami, dan jagalah kami dari azab neraka",
    sumber: "HR. Ibnu Sunni",
  },
  {
    id: 8,
    judul: "Istighfar",
    kategori: "dzikir",
    arab: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    latin: "Astaghfirullaahal 'azhiim alladzii laa ilaaha illaa huwal hayyul qayyuumu wa atuubu ilaih",
    arti: "Aku memohon ampun kepada Allah Yang Maha Agung, yang tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus menerus mengurus makhluk-Nya, dan aku bertobat kepada-Nya",
    sumber: "HR. Abu Dawud & Tirmidzi",
  },
];

// ── Computed ────────────────────────────────────────────────────────
const filteredDoa = computed(() => {
  let list = doaList;
  if (activeCategory.value !== "semua") list = list.filter((d) => d.kategori === activeCategory.value);
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((d) => d.judul.toLowerCase().includes(q) || d.arti.toLowerCase().includes(q));
  }
  return list;
});

// ── Actions ─────────────────────────────────────────────────────────
function toggleFavorite(id: number): void {
  if (favorites.value.has(id)) favorites.value.delete(id);
  else favorites.value.add(id);
}

function copyDoa(doa: Doa): void {
  const text = `${doa.judul}\n\n${doa.arab}\n\n${doa.latin}\n\n${doa.arti}\n\nSumber: ${doa.sumber}`;
  void navigator.clipboard.writeText(text);
}

// ── Function safe ─────────────────────────────────────────────
function categoryVariant(kategori?: string | null): "default" | "accent" | "neutral" | "success" {
  const map: Record<string, "default" | "accent" | "neutral" | "success"> = {
    harian: "accent",
    quran: "default",
    dzikir: "success",
    sholat: "neutral",
  };
  if (!kategori) return "neutral"; // null / undefined / empty string
  return map[kategori] ?? "neutral";
}
</script>
