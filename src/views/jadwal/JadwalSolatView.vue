<template>
  <div class="min-h-screen bg-background font-body">
    <!-- HEADER -->
    <div class="bg-foreground text-main-foreground border-b-4 border-accent py-12 px-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.05]" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 32px 32px" />

      <div class="relative max-w-4xl mx-auto text-center">
        <Badge variant="neutral" class="mb-3">Jadwal Sholat</Badge>

        <h1 class="font-display text-5xl font-black mb-2">Waktu Sholat</h1>
        <p v-if="hijriDate" class="text-sm font-bold text-main-foreground/80">{{ hijriDate }}</p>
        <p class="text-main-foreground/60 text-sm mt-1">{{ selectedDateDisplay }}</p>

        <!-- NEXT PRAYER INFO DI HEADER -->
        <p v-if="nextPrayer" class="text-sm mt-3 opacity-80">
          <span v-if="isTodaySelected">⏳ {{ countdownText }} menuju {{ nextPrayer.name }}</span>
          <span v-else>⏳ Sholat berikutnya: {{ nextPrayer.name }} {{ nextPrayer.time }}</span>
        </p>
        <p v-else-if="jadwal" class="text-sm mt-3 opacity-80">
          <span v-if="isTodaySelected">Semua sholat hari ini telah selesai</span>
          <span v-else>Tidak ada sholat tersisa pada tanggal ini</span>
        </p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <!-- CARD PEMILIH TANGGAL (KALENDER) -->
      <Card class="p-1 sm:p-2 md:p-5 border-2">
        <div class="flex items-center justify-between">
          <!-- Bagian kiri: teks tanggal -->
          <div @click="isCalendarOpen = true" class="cursor-pointer">
            <p class="font-black text-sm">Pilih Tanggal</p>
            <p class="text-xs text-muted-foreground">
              {{ selectedDateDisplay }}
            </p>
            <p v-if="hijriDate" class="text-xs font-bold mt-1">
              {{ hijriDate }}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button size="sm" variant="neutral" class="min-w-37.5 flex items-center gap-2">
                <span>📅</span>
                <span>{{ selectedDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) }}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-64">
              <!-- Menampilkan bulan dan tahun saat ini -->
              <DropdownMenuLabel class="text-center">
                {{ selectedDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" }) }}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <!-- Pilih Hari (dalam bentuk grid 7 kolom? Tapi karena item menu berupa list, kita buat list hari) -->
              <DropdownMenuGroup>
                <div class="grid grid-cols-7 gap-1 p-2">
                  <div v-for="day in daysInMonth" :key="day" class="text-center cursor-pointer py-1 rounded hover:bg-accent" @click="setDay(day)">
                    {{ day }}
                  </div>
                </div>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <!-- Submenu untuk memilih Bulan -->
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Ganti Bulan</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent class="max-h-60 overflow-y-auto">
                  <DropdownMenuItem v-for="(month, index) in months" :key="index" @click="setMonth(index + 1)">
                    {{ month }}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <!-- Submenu untuk memilih Tahun -->
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Ganti Tahun</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent class="max-h-60 overflow-y-auto">
                  <DropdownMenuItem v-for="year in yearRange" :key="year" @click="setYear(year)">
                    {{ year }}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <!-- LOKASI (sama seperti sebelumnya) -->
      <Card class="p-1 sm:p-2 md:p-5 border-2">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-main border-2 border-border flex items-center justify-center text-lg shadow-shadow">📍</div>

          <div>
            <p class="font-black text-sm">Lokasi Kamu</p>
            <p class="text-xs text-muted-foreground">Digunakan untuk menentukan jadwal sholat</p>
          </div>
        </div>

        <div v-if="appStore.hasLocation" class="flex justify-between items-center">
          <div>
            <Badge variant="default">✓ Terdeteksi</Badge>

            <p class="text-xs font-mono text-muted-foreground mt-1">
              {{ appStore.koordinat?.lat.toFixed(5) }},
              {{ appStore.koordinat?.lng.toFixed(5) }}
            </p>

            <!-- Indikator loading nama lokasi -->
            <p v-if="gettingLocation" class="text-xs font-bold mt-1 text-muted-foreground">⏳ Memuat lokasi...</p>
            <p v-else-if="locationName" class="text-xs font-bold mt-1">
              {{ locationName }}
            </p>
          </div>

          <Button size="sm" variant="neutral" :loading="gettingLocation" @click="requestLocation"> Perbarui </Button>
        </div>

        <div v-else>
          <Button variant="default" :loading="gettingLocation" @click="requestLocation"> 📍 Gunakan Lokasi Saya </Button>
        </div>
      </Card>

      <!-- SKELETON SAAT LOADING -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <Skeleton v-for="n in 5" :key="n" class="h-32" />
      </div>

      <!-- JADWAL SHOLAT -->
      <div v-else-if="jadwal" class="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <Card
          v-for="(prayer, i) in jadwal"
          :key="prayer.key"
          :class="[
            'p-1 sm:p-2 md:p-5 gap-2 text-center border-2 transition-all duration-300',
            isNextPrayer(prayer) && isTodaySelected ? 'bg-primary/90 text-primary-foreground border-border shadow-shadow-lg scale-[1.05]' : 'active:scale-95 bg-secondary-background text-foreground border-2 border-border shadow-shadow',
          ]"
        >
          <div class="text-3xl mb-2">
            <component v-if="prayerIconMap[prayer.name]" :is="prayerIconMap[prayer.name]" />
            <span v-else>{{ prayerIcons[i] }}</span>
          </div>

          <p class="font-black text-sm">
            {{ prayer.name }}
          </p>

          <p class="font-display text-3xl font-black my-1">
            {{ prayer.time }}
          </p>
          <div v-if="isNextPrayer(prayer) && isTodaySelected" class="mt-2 flex flex-col items-center gap-1">
            <p class="text-sm opacity-80">{{ countdownText }}</p>
            <Badge variant="neutral" class="text-[9px]">Menuju {{ prayer.name }}</Badge>
          </div>
        </Card>
      </div>

      <!-- BULANAN (nanti bisa diarahkan ke halaman kalender bulanan) -->
      <Card class="border-2 p-1 sm:p-2 md:p-5">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <Button variant="neutral" size="icon" @click="goToPrevMonth" class="h-8 w-8">
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <p class="font-black text-sm">Jadwal Bulan {{ currentMonth }}</p>
            <Button variant="neutral" size="icon" @click="goToNextMonth" class="h-8 w-8">
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
          <Badge v-if="!appStore.hasLocation" variant="neutral" class="text-[9px]"> Lokasi belum diatur </Badge>
        </div>

        <p class="text-xs text-muted-foreground mb-4">Klik tanggal untuk lihat jadwal harian</p>

        <!-- Skeleton saat loading -->
        <div v-if="monthlyLoading" class="grid grid-cols-7 gap-1">
          <Skeleton v-for="n in 35" :key="n" class="h-12 w-full" />
        </div>

        <!-- Tampilkan kalender jika data tersedia -->
        <div v-else-if="monthlyData" class="grid grid-cols-7 gap-2 text-center">
          <!-- Nama hari -->
          <div v-for="day in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']" :key="day" class="text-xs font-bold py-1">
            {{ day }}
          </div>

          <!-- Sel kosong sebelum tanggal 1 -->
          <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="h-12 text-xs text-muted-foreground flex items-center justify-center"></div>

          <!-- Tanggal aktif dengan data Hijriyah -->
          <Button
            variant="neutral"
            v-for="item in hijriDaysInMonth"
            :key="item.day"
            class="h-auto group relative border border-border rounded flex flex-col items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors p-4"
            :class="{ 'bg-primary/70 border-primary': item.day === selectedDate.getDate() }"
            @click="setDay(item.day)"
          >
            <span class="text-[9px] md:text-xs text-left absolute left-2 top-2 font-bold">{{ item.day }}</span>
            <span class="leading-tight"></span>
            <span class="hidden sm:flex md:text-xs leading-tight text-muted-foreground group-hover:text-white"> {{ item.hijriDay }} {{ item.hijriMonthName }} {{ item.hijriYear }} H </span>
          </Button>
        </div>

        <!-- Jika lokasi belum ada -->
        <div v-else class="text-center py-4 text-muted-foreground text-sm">Aktifkan lokasi untuk melihat jadwal bulanan</div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { toHijri } from "hijri-converter";

import { MoonStar, Sun, CloudSun, Sunrise, Stars, ChevronLeft, ChevronRight } from "lucide-vue-next";

import { useAppStore } from "@/stores/useAppStore";
import { useJadwalSholat } from "@/composables/queries/useSholatQueries";
import type { PrayerTime } from "@/types";

import { Card } from "@/components/card";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { useMonthlyJadwal } from "@/composables/queries/useMonthlyJadwal";

const appStore = useAppStore();

// State untuk next prayer dan countdown
const nextPrayer = ref<{ name: string; key: string; time: string; datetime: Date } | null>(null);
const countdownText = ref("");

// State lokasi
const gettingLocation = ref(false);
const locationName = ref<string | null>(null);

const isCalendarOpen = ref(false);
const selectedDate = defineModel<Date>("selectedDate", { required: true, default: () => new Date() });

// Daftar nama bulan
const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const prayerIconMap: Record<string, any> = {
  Subuh: Sunrise,
  Dzuhur: Sun,
  Ashar: CloudSun,
  Maghrib: MoonStar,
  "Isya'": Stars,
};

// Rentang tahun (5 tahun ke belakang sampai 5 tahun ke depan)
const yearRange = computed(() => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
});

// Jumlah hari dalam bulan yang sedang dipilih
const daysInMonth = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth() + 1;
  return new Date(year, month, 0).getDate();
});

// Fungsi mengubah hari
function setDay(day: number) {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(day);
  selectedDate.value = newDate;
}

// Fungsi mengubah bulan
function setMonth(month: number) {
  const newDate = new Date(selectedDate.value);
  newDate.setMonth(month - 1);
  // Koreksi jika tanggal melebihi jumlah hari di bulan baru
  const maxDay = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
  if (newDate.getDate() > maxDay) {
    newDate.setDate(maxDay);
  }
  selectedDate.value = newDate;
}

// Fungsi mengubah tahun
function setYear(year: number) {
  const newDate = new Date(selectedDate.value);
  newDate.setFullYear(year);
  // Koreksi jika tanggal tidak valid (misal 29 Feb di tahun non-kabisat)
  const maxDay = new Date(year, newDate.getMonth() + 1, 0).getDate();
  if (newDate.getDate() > maxDay) {
    newDate.setDate(maxDay);
  }
  selectedDate.value = newDate;
}

// Flag untuk cek apakah tanggal yang dipilih adalah hari ini
const isTodaySelected = computed(() => {
  const today = new Date();
  return selectedDate.value.toDateString() === today.toDateString();
});

// Format tanggal untuk parameter API
const dateParam = computed(() => {
  const d = selectedDate.value;
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
});

// Hitung tanggal Hijriah
const hijriMonths = ["Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"];

// Hitung tanggal Hijriah
const hijriDate = computed(() => {
  const d = selectedDate.value;
  const hijri = toHijri(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${hijri.hd} ${hijriMonths[hijri.hm - 1]} ${hijri.hy} H`;
});

// Tampilan tanggal Masehi yang lebih rapi
const selectedDateDisplay = computed(() => {
  return selectedDate.value.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

// Ambil jadwal berdasarkan lokasi dan tanggal terpilih
const lat = computed(() => appStore.koordinat?.lat);
const lng = computed(() => appStore.koordinat?.lng);
const { data: jadwal, isLoading } = useJadwalSholat({
  lat,
  lng,
  date: dateParam,
});

// Ambil nama lokasi dari koordinat
async function resolveLocationName(lat: number, lng: number) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
  const data = await res.json();
  const a = data.address;
  locationName.value = `${a.suburb || a.city_district || ""}, ${a.city || a.county || ""}`;
}

// Minta lokasi pengguna
async function requestLocation() {
  gettingLocation.value = true;
  await appStore.requestGeolocation();
  if (appStore.koordinat) {
    await resolveLocationName(appStore.koordinat.lat, appStore.koordinat.lng);
  }
  gettingLocation.value = false;
}

// Cek apakah suatu sholat adalah sholat berikutnya (hanya relevan jika hari ini)

function isNextPrayer(prayer: PrayerTime) {
  if (!isTodaySelected.value || !nextPrayer.value) return false;
  return prayer.key === nextPrayer.value.key;
}

// Fungsi memperbarui next prayer dan countdown
function updateNextPrayer() {
  if (!jadwal.value) {
    nextPrayer.value = null;
    countdownText.value = "";
    return;
  }

  const now = new Date();
  const selected = selectedDate.value;
  let found: { name: string; key: string; time: string; datetime: Date } | null = null;

  for (const p of jadwal.value) {
    const [h, m] = p.time.split(":").map(Number);
    const prayerDateTime = new Date(selected);
    prayerDateTime.setHours(h ?? 0, m ?? 0, 0, 0);

    if (prayerDateTime > now) {
      found = {
        name: p.name,
        key: p.key,
        time: p.time,
        datetime: prayerDateTime,
      };
      break;
    }
  }

  nextPrayer.value = found;

  // Hitung countdown hanya untuk hari ini
  if (found && isTodaySelected.value) {
    const diffMs = found.datetime.getTime() - now.getTime();
    if (diffMs > 0) {
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n: number) => n.toString().padStart(2, "0");
      countdownText.value = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    } else {
      countdownText.value = "";
    }
  } else {
    countdownText.value = "";
  }
}

// Timer untuk update countdown tiap detik
let timer: ReturnType<typeof setInterval>;

onMounted(() => {
  timer = setInterval(() => {
    updateNextPrayer();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

watch(
  [jadwal, selectedDate],
  () => {
    updateNextPrayer();
  },
  { immediate: true },
);

onUnmounted(() => {
  clearInterval(timer);
});

// Ikon dan data tambahan
const prayerIcons = ["🌙", "☀️", "🌤️", "🌅", "🌃"];
const currentMonth = computed(() => {
  return selectedDate.value.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
});

const currentMonthIndex = computed(() => selectedDate.value.getMonth() + 1);
const currentYear = computed(() => selectedDate.value.getFullYear());

const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyJadwal(lat.value ?? 0, lng.value ?? 0, currentMonthIndex.value, currentYear.value);

// Hari pertama dalam bulan (0 = Minggu, 1 = Senin, ...)
const firstDayOfMonth = computed(() => {
  const d = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), 1);
  return d.getDay(); // 0 = Minggu
});

const hijriDaysInMonth = computed(() => {
  const year = selectedDate.value.getFullYear();
  const month = selectedDate.value.getMonth() + 1;
  const days = daysInMonth.value;
  const hijriDays = [];
  for (let d = 1; d <= days; d++) {
    const hijri = toHijri(year, month, d);
    hijriDays.push({
      day: d,
      hijriDay: hijri.hd,
      hijriMonth: hijri.hm,
      hijriYear: hijri.hy,
      hijriMonthName: hijriMonths[hijri.hm - 1],
    });
  }
  return hijriDays;
});

function goToPrevMonth() {
  const newDate = new Date(selectedDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  selectedDate.value = newDate;
}

function goToNextMonth() {
  const newDate = new Date(selectedDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  selectedDate.value = newDate;
}
</script>
