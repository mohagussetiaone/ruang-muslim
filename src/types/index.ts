// src/types/index.ts
// Semua tipe terpusat di sini — ekuivalen types/ folder di React

// ─── AUTH ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  nama: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── QURAN ─────────────────────────────────────────────────────────────────
export interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: "mekah" | "madinah";
  arti: string;
  deskripsi: string;
  audio: string;
}

// Surah list item dengan field tambahan dari TanStack select()
export interface SurahListItem extends Surah {
  label: string; // "1. Al-Fatihah"
}

export interface Ayat {
  id: number;
  surah: number;
  nomor: number;
  ar: string;
  tr: string;
  idn: string;
}

// ─── QURAN ─────────────────────────────────────────────────────────────────
export interface SurahNavigation {
  id: number;
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

export interface SurahDetail extends Surah {
  status: boolean;
  deskripsi: string;
  audio: string;
  ayat: Ayat[];

  surat_sebelumnya: SurahNavigation | null;
  surat_selanjutnya: SurahNavigation | null;
}
export interface Tafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tafsir: Array<{
    ayat: number;
    teks: string;
  }>;
}

// ─── QURAN API RESPONSE ENVELOPE ───────────────────────────────────────────
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ─── SHOLAT ────────────────────────────────────────────────────────────────
export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface PrayerTime {
  name: string;
  time: string; // "04:32"
  key: keyof PrayerTimings;
  isNext?: boolean;
}

export interface Koordinat {
  lat: number;
  lng: number;
}

// ─── UI / APP ───────────────────────────────────────────────────────────────
export type FontSize = "sm" | "md" | "lg" | "xl";

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string({ required_error: "Email wajib diisi" }).email("Format email tidak valid"),
  password: z.string({ required_error: "Password wajib diisi" }).min(8, "Password minimal 8 karakter"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    nama: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
