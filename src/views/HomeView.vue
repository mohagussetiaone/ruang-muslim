<template>
  <div class="font-body bg-background min-h-screen">
    <!-- HERO -->
    <section class="relative overflow-hidden border-b-4 border-accent bg-linear-to-b from-primary/5 via-primary/10 to-primary/20">
      <div class="absolute inset-0 opacity-[0.06]" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 44px 44px" />
      <div class="relative max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <!-- Left -->
        <div>
          <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6">
            Temukan kedamaian di<br />
            <span class="text-primary">Ruang muslim</span><br />
          </h1>

          <p class="text-lg leading-relaxed mb-8 max-w-md">Platform spiritual modern untuk membimbing langkah ibadah harian Anda dengan lebih bermakna.</p>

          <div class="flex flex-wrap gap-3">
            <Button as-child variant="reverse" size="lg">
              <RouterLink :to="{ name: 'quran' }">Buka Al-Quran</RouterLink>
            </Button>
            <Button as-child variant="neutral" size="lg" class="border-main-foreground/40 hover:bg-main-foreground/10">
              <RouterLink :to="{ name: 'jadwal-sholat' }">Jadwal Sholat</RouterLink>
            </Button>
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
            <Badge variant="default" class="absolute -top-3 left-6 uppercase">Jadwal solat</Badge>

            <!-- Baris lokasi dan tanggal -->
            <div class="w-full flex justify-between">
              <div>
                <h1>Lokasi anda</h1>
                <div class="flex gap-2 items-center">
                  <MapPinIcon class="w-6 h-6 text-accent" />
                  <p class="font-bold">{{ locationName || "Memuat lokasi..." }}</p>
                  <Button v-if="!appStore.hasLocation" size="sm" variant="neutral" @click="requestLocation" :loading="gettingLocation"> Perbarui </Button>
                </div>
              </div>
              <div>
                <div class="text-right text-xs text-muted-foreground px-4" v-if="todayDate">
                  {{ todayDate }}
                </div>
                <h3>{{ hijriDate }}</h3>
              </div>
            </div>

            <!-- Card jadwal sholat -->
            <Card class="bg-secondary-background text-foreground border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none mt-4">
              <!-- Bagian atas: sholat berikutnya -->
              <div class="flex flex-col gap-3 justify-center items-center p-6">
                <!-- Tampilkan skeleton saat loading -->
                <template v-if="isLoading">
                  <Skeleton class="h-8 w-32" />
                  <Skeleton class="h-8 w-24" />
                </template>

                <!-- Saat sedang dalam masa 3 menit setelah adzan -->
                <template v-else-if="activePrayer">
                  <p class="text-lg">Saatnya adzan</p>
                  <h1 class="text-3xl sm:text-4xl md:text-5xl font-display font-black">
                    {{ activePrayer.name }}
                  </h1>
                  <p class="text-3xl sm:text-4xl md:text-5xl font-display font-black">
                    {{ activePrayer.time }}
                  </p>
                </template>

                <!-- Kondisi normal: tampilkan countdown menuju sholat berikutnya -->
                <template v-else-if="nextPrayer">
                  <p v-if="countdown">{{ countdown }} menuju</p>
                  <h1 class="text-3xl sm:text-4xl md:text-5xl font-display font-black">
                    {{ nextPrayer.name }}
                  </h1>
                  <p class="text-3xl sm:text-4xl md:text-5xl font-display font-black">
                    {{ nextPrayer.time }}
                  </p>
                </template>

                <!-- Jika tidak ada jadwal (misal setelah Isya') -->
                <template v-else>
                  <p class="text-muted-foreground">Tidak ada jadwal</p>
                </template>
              </div>

              <!-- Grid 5 tombol untuk semua waktu sholat -->
              <div class="grid grid-cols-5 gap-4 m-4">
                <template v-if="isLoading">
                  <Skeleton v-for="n in 5" :key="n" class="h-16 w-full" />
                </template>
                <template v-else-if="jadwal">
                  <Button v-for="prayer in jadwal" :key="prayer.key" :class="['flex h-auto flex-col justify-center items-center', prayer.key === nextPrayer?.key ? '' : 'bg-primary/85']" variant="neutral">
                    <h1 class="text-sm font-black tracking-widest">{{ prayer.name }}</h1>
                    <p class="font-display text-base font-black">{{ prayer.time }}</p>
                  </Button>
                </template>
              </div>
            </Card>
          </Card>
          <div class="absolute -bottom-3 -right-3 w-full h-full border-2 border-accent/30 -z-10" />
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { Card } from "@/components/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { MapPinIcon } from "lucide-vue-next";

import { useAppStore } from "@/stores/useAppStore";
import { useJadwalSholat } from "@/composables/queries/useSholatQueries";
import { toHijri } from "hijri-converter";
import { Skeleton } from "@/components/skeleton";

const appStore = useAppStore();
const gettingLocation = ref(false);
const locationName = ref<string | null>(null);

// Tanggal hari ini
const selectedDate = ref(new Date());
const dateParam = computed(() => {
  const d = selectedDate.value;
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
});

const lat = computed(() => appStore.koordinat?.lat ?? -6.2);
const lng = computed(() => appStore.koordinat?.lng ?? 106.816666);

// Ambil jadwal menggunakan composable yang sama
const { data: jadwal, isLoading } = useJadwalSholat({
  lat,
  lng,
  date: dateParam,
});

const hijriMonths = ["Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"];

const hijriDate = computed(() => {
  const d = selectedDate.value;
  const hijri = toHijri(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${hijri.hd} ${hijriMonths[hijri.hm - 1]} ${hijri.hy} H`;
});

const todayDate = computed(() => {
  return selectedDate.value.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

// ─── Waktu real-time (diupdate tiap detik) ───────────────────────
const currentTime = ref(new Date());
// eslint-disable-next-line
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

// ─── Computed: sholat berikutnya ─────────────────────────────────
const nextPrayer = computed(() => {
  if (!jadwal.value) return null;
  const now = currentTime.value;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const p of jadwal.value) {
    const [h, m] = p.time.split(":").map(Number);
    const prayerMinutes = (h ?? 0) * 60 + (m ?? 0);
    if (prayerMinutes > currentMinutes) {
      return p;
    }
  }
  return null;
});

// ─── Computed: sholat yang sedang aktif (3 menit setelah adzan) ──
const activePrayer = computed(() => {
  if (!jadwal.value) return null;
  const now = currentTime.value;

  for (const p of jadwal.value) {
    const [h, m] = p.time.split(":").map(Number);
    const prayerTime = new Date(now);
    prayerTime.setHours(h!, m!, 0, 0);
    const endTime = new Date(prayerTime.getTime() + 3 * 60 * 1000);

    if (now >= prayerTime && now <= endTime) {
      return p;
    }
  }
  return null;
});

// ─── Computed: countdown (read-only, JANGAN di-assign manual) ────
const countdown = computed(() => {
  if (!nextPrayer.value) return "";
  const now = currentTime.value;
  const [h, m] = nextPrayer.value.time.split(":").map(Number);
  const prayerTime = new Date(now);
  prayerTime.setHours(h!, m!, 0, 0);
  const diffMs = prayerTime.getTime() - now.getTime();

  if (diffMs <= 0) return "";

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
});

// ─── Lokasi ──────────────────────────────────────────────────────
async function resolveLocationName(lat: number, lng: number) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    const a = data.address;
    locationName.value = `${a.suburb || a.city_district || a.town || a.village || ""}, ${a.city || a.county || a.state || ""}`.replace(/^, /, "").replace(/, $/, "");
  } catch (error) {
    console.error("Reverse geocoding failed", error);
    locationName.value = null;
  }
}

async function requestLocation() {
  gettingLocation.value = true;
  await appStore.requestGeolocation();
  if (appStore.koordinat) {
    await resolveLocationName(appStore.koordinat.lat, appStore.koordinat.lng);
  }
  gettingLocation.value = false;
}

onMounted(() => {
  if (appStore.koordinat) {
    resolveLocationName(appStore.koordinat.lat, appStore.koordinat.lng);
  } else {
    locationName.value = "Jakarta, Indonesia";
  }
});

watch(
  () => appStore.koordinat,
  (newCoord) => {
    if (newCoord) {
      resolveLocationName(newCoord.lat, newCoord.lng);
    }
  },
);

// ─── Data statis ─────────────────────────────────────────────────
const stats = [
  { value: "114", label: "Surah Al-Quran" },
  { value: "6.236", label: "Ayat Lengkap" },
  { value: "1.000+", label: "Kumpulan Do'a" },
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
</script>
