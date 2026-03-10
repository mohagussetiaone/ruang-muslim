<script setup lang="ts">
import { RouterLink } from "vue-router";

import { Button } from "@/components/button";
import { Badge } from "@/components/badge";
import { Alert } from "@/components/alert"; // asumsi ada komponen alert

const emit = defineEmits(["select"]);

type Surah = {
  nomor: number;
  nama: string;
  nama_latin: string;
  arti: string;
  jumlah_ayat: number;
};

const props = defineProps<{
  surahList: Surah[];
  surahId?: string;
  loading?: boolean;
  error?: string | null;
}>();

console.log("props", props.loading);
</script>

<template>
  <!-- SKELETON LOADING -->
  <div v-if="loading" class="space-y-2 animate-pulse">
    <div v-for="n in 8" :key="n" class="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-muted/30">
      <!-- Badge nomor skeleton -->
      <div class="h-6 w-8 bg-muted rounded" />

      <!-- Bagian tengah (nama latin & arti) -->
      <div class="flex-1 space-y-1">
        <div class="h-4 w-24 bg-muted rounded" />
        <!-- nama latin -->
        <div class="h-3 w-32 bg-muted rounded" />
        <!-- arti -->
      </div>

      <!-- Bagian kanan (nama arab & jumlah ayat) -->
      <div class="text-right space-y-1">
        <div class="h-4 w-10 bg-muted rounded" />
        <!-- nama arab -->
        <div class="h-3 w-6 bg-muted rounded ml-auto" />
        <!-- jumlah ayat -->
      </div>
    </div>
  </div>

  <!-- ERROR STATE -->
  <Alert v-else-if="error" variant="destructive" :title="error" class="mb-4" />

  <!-- EMPTY STATE (setelah loading selesai, tidak ada data) -->
  <div v-else-if="surahList.length === 0" class="text-center py-8 text-muted-foreground">
    <p>Tidak ada surah.</p>
  </div>

  <!-- DAFTAR SURAH (DATA TERSEDIA) -->
  <RouterLink v-else v-for="s in surahList" :key="s.nomor" :to="{ name: 'surah-detail', params: { surahId: s.nomor } }" @click="emit('select')">
    <Button :variant="String(s.nomor) === surahId ? 'default' : 'neutral'" class="w-full justify-start gap-3 mb-2">
      <Badge variant="neutral" class="text-[10px]">
        {{ s.nomor }}
      </Badge>

      <div class="flex-1 text-left">
        <p class="text-xs font-bold">
          {{ s.nama_latin }}
        </p>
        <p class="text-[10px] opacity-70">
          {{ s.arti }}
        </p>
      </div>

      <div class="text-right">
        <p class="font-arabic text-sm">
          {{ s.nama }}
        </p>
        <p class="text-[9px] opacity-60">
          {{ s.jumlah_ayat }}
        </p>
      </div>
    </Button>
  </RouterLink>
</template>
