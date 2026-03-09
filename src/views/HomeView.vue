<template>
  <div class="font-body bg-background min-h-screen">
    <!-- HERO -->
    <section class="relative overflow-hidden border-b-4 border-accent">
      <div class="absolute inset-0 opacity-[0.06]" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 44px 44px" />
      <div class="relative max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <!-- Left -->
        <div>
          <Badge variant="default" class="mb-6 gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            Ruang Muslim · Versi 2
          </Badge>

          <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
            Temukan kedamaian di<br />
            <span class="text-primary">Ruang muslim</span><br />
          </h1>

          <p class="text-lg leading-relaxed mb-8 max-w-md">Platform spiritual modern untuk membimbing langkah ibadah harian Anda dengan lebih bermakna.</p>

          <div class="flex flex-wrap gap-3">
            <Button as="router-link" :to="{ name: 'quran' }" variant="reverse" size="lg">Buka Al-Quran </Button>
            <Button as="router-link" :to="{ name: 'jadwal-sholat' }" variant="neutral" size="lg" class="border-main-foreground/40 hover:bg-main-foreground/10">Jadwal Sholat </Button>
          </div>

          <!-- Stats -->
          <div class="flex gap-8 mt-10 pt-8 border-t border-main-foreground/10">
            <div v-for="s in stats" :key="s.label">
              <p class="font-display text-3xl font-black text-accent">{{ s.value }}</p>
              <p class="text-xs /50 mt-0.5">{{ s.label }}</p>
            </div>
          </div>
        </div>

        <!-- Right: Ayat card -->
        <div class="relative">
          <Card class="bg-primary/20 border-2 border-main-foreground/20 p-8">
            <Badge variant="default" class="absolute -top-3 left-6">AYAT HARI INI</Badge>
            <p class="font-arabic text-4xl text-right leading-loose mb-5" dir="rtl">فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا</p>
            <div class="h-px bg-main-foreground/10 mb-4" />
            <p class="text-sm leading-relaxed italic mb-3">"Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan."</p>
            <p class="text-accent text-xs font-black tracking-wide">— QS. Al-Insyirah: 5–6</p>
          </Card>
          <div class="absolute -bottom-3 -right-3 w-full h-full border-2 border-accent/30 -z-10" />
        </div>
      </div>
    </section>

    <!-- ═══ PRAYER TIMES BAR ══════════════════════════════════════ -->
    <section class="bg-main border-b-4 border-border">
      <div class="max-w-6xl mx-auto px-4 py-5">
        <div class="flex items-center gap-3 mb-3">
          <span class="text-xs font-black tracking-widest uppercase">Waktu Sholat Hari Ini</span>
          <div class="flex-1 h-px bg-main-foreground/10" />
          <span class="/40 text-xs">{{ todayDate }}</span>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="prayer in prayerTimes"
            :key="prayer.name"
            :class="['border-2 px-3 py-3 text-center transition-all', prayer.isNext ? 'bg-primary/25 text-foreground border-border shadow-shadow' : 'bg-main/40  border-main-foreground/20']"
          >
            <p class="text-[10px] font-black tracking-widest uppercase opacity-70 mb-1">{{ prayer.name }}</p>
            <p class="font-display text-xl font-black">{{ prayer.time }}</p>
            <Badge v-if="prayer.isNext" variant="default" class="mt-1 text-[9px]">BERIKUTNYA</Badge>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES ══════════════════════════════════════════════ -->
    <section class="py-20 px-4 max-w-6xl mx-auto">
      <div class="flex items-end justify-between mb-12">
        <div>
          <p class="text-xs font-black tracking-widest text-mainuppercase mb-2">Fitur Lengkap</p>
          <h2 class="font-display text-4xl md:text-5xl font-black text-foreground">Semua yang Kamu<br />Butuhkan</h2>
        </div>
        <div class="hidden md:block w-24 h-1.5 bg-accent border border-border mb-3" />
      </div>

      <div class="grid md:grid-cols-3 gap-5">
        <RouterLink
          v-for="f in features"
          :key="f.route"
          :to="{ name: f.route }"
          :class="['group block border-4 border-border p-7 bg-primary/25 shadow-shadow-md hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all relative overflow-hidden', f.bg]"
        >
          <div :class="['w-14 h-14 border-4 border-border flex items-center justify-center text-2xl mb-5 shadow-shadow group-hover:shadow-none transition-all', f.iconBg]">
            {{ f.icon }}
          </div>
          <h3 :class="['font-display text-2xl font-black mb-2', f.text]">{{ f.name }}</h3>
          <p :class="['text-sm leading-relaxed opacity-70', f.text]">{{ f.desc }}</p>
          <div :class="['mt-6 flex items-center gap-1 font-black text-sm', f.text]">Buka <span class="group-hover:translate-x-2 transition-transform inline-block">→</span></div>
        </RouterLink>
      </div>
    </section>

    <!-- ═══ HADITH BANNER ══════════════════════════════════════════ -->
    <Card class="mx-4 mb-20 max-w-6xl md:mx-auto border-4 bg-primary/25 p-10 shadow-shadow-accent">
      <div class="text-center max-w-2xl mx-auto">
        <p class="font-arabic text-5xl text-accent mb-5" dir="rtl">طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ</p>
        <p class="/70 italic mb-2">"Menuntut ilmu adalah kewajiban bagi setiap muslim."</p>
        <p class="text-accent text-xs font-black tracking-wider">— HR. Ibnu Majah</p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from "@/components/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";

const stats = [
  { value: "114", label: "Surah Al-Quran" },
  { value: "6.236", label: "Ayat Lengkap" },
  { value: "1.000+", label: "Kumpulan Do'a" },
];
const prayerTimes = [
  { name: "Subuh", time: "04:32", isNext: false },
  { name: "Dzuhur", time: "12:01", isNext: false },
  { name: "Ashar", time: "15:18", isNext: true },
  { name: "Maghrib", time: "18:06", isNext: false },
  { name: "Isya'", time: "19:18", isNext: false },
];
const features = [
  {
    route: "quran",
    name: "Al-Quran",
    icon: "📖",
    desc: "114 surah lengkap dengan teks Arab, transliterasi Latin, terjemahan Indonesia, dan audio murottal.",
    bg: "bg-main",
    iconBg: "bg-accent",
    text: "",
  },
  {
    route: "jadwal-sholat",
    name: "Jadwal Sholat",
    icon: "🕌",
    desc: "Jadwal sholat akurat berbasis GPS dengan notifikasi adzan dan countdown waktu berikutnya.",
    bg: "bg-accent",
    iconBg: "bg-background",
    text: "text-foreground",
  },
  {
    route: "doa",
    name: "Kumpulan Do'a",
    icon: "🤲",
    desc: "Do'a harian, dzikir pagi-petang, dan do'a pilihan dari Al-Quran dan Hadits shahih.",
    bg: "bg-background",
    iconBg: "bg-main",
    text: "text-foreground",
  },
];
const todayDate = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
</script>
