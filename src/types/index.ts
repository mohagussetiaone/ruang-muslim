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

// ─── SHOLAT — TIMINGS ──────────────────────────────────────────────────────
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
  Firstthird: string;
  Lastthird: string;
}

// ─── SHOLAT — HIJRI DATE ───────────────────────────────────────────────────
export interface HijriWeekday {
  en: string;
  ar: string;
}

export interface HijriMonth {
  number: number;
  en: string;
  ar: string;
  days: number;
}

export interface HijriDesignation {
  abbreviated: string; // "AH"
  expanded: string; // "Anno Hegirae"
}

export interface HijriDate {
  date: string; // "21-09-1447"
  format: string; // "DD-MM-YYYY"
  day: string; // "21"
  weekday: HijriWeekday;
  month: HijriMonth;
  year: string; // "1447"
  designation: HijriDesignation;
  holidays: string[]; // ["Lailat-ul-Qadr"]
  adjustedHolidays: string[];
  method: string; // "HJCoSA"
}

// ─── SHOLAT — GREGORIAN DATE ───────────────────────────────────────────────
export interface GregorianWeekday {
  en: string; // "Tuesday"
}

export interface GregorianMonth {
  number: number;
  en: string; // "March"
}

export interface GregorianDesignation {
  abbreviated: string; // "AD"
  expanded: string; // "Anno Domini"
}

export interface GregorianDate {
  date: string; // "10-03-2026"
  format: string; // "DD-MM-YYYY"
  day: string; // "10"
  weekday: GregorianWeekday;
  month: GregorianMonth;
  year: string; // "2026"
  designation: GregorianDesignation;
  lunarSighting: boolean;
}

export interface PrayerDate {
  readable: string; // "10 Mar 2026"
  timestamp: string; // "1773100800"
  hijri: HijriDate;
  gregorian: GregorianDate;
}

// ─── SHOLAT — META / METHOD ────────────────────────────────────────────────
export interface MethodLocation {
  latitude: number;
  longitude: number;
}

export interface MethodParams {
  Fajr: number; // angle in degrees
  Isha: number; // angle in degrees
}

export interface PrayerMethod {
  id: number;
  name: string;
  params: MethodParams;
  location: MethodLocation;
}

export interface PrayerOffset {
  Imsak: number;
  Fajr: number;
  Sunrise: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Sunset: number;
  Isha: number;
  Midnight: number;
}

export interface PrayerMeta {
  latitude: number;
  longitude: number;
  timezone: string; // "Asia/Jakarta"
  method: PrayerMethod;
  latitudeAdjustmentMethod: string; // "ANGLE_BASED"
  midnightMode: string; // "STANDARD"
  school: string; // "STANDARD"
  offset: PrayerOffset;
}

// ─── SHOLAT — API RESPONSE ENVELOPE ────────────────────────────────────────
export interface PrayerApiData {
  timings: PrayerTimings;
  date: PrayerDate;
  meta: PrayerMeta;
}

export interface PrayerApiResponse {
  code: number; // 200
  status: string; // "OK"
  data: PrayerApiData;
}

// ─── SHOLAT — UI HELPERS ───────────────────────────────────────────────────
export interface PrayerTime {
  name: string;
  time: string; // "04:32"
  key: keyof PrayerTimings;
  isNext?: boolean;
}

/** Waktu tambahan (Imsak, Sunrise, Sunset, Midnight) dengan ikon */
export interface AdditionalTime {
  key: string;
  name: string;
  time: string;
  icon: string;
}

/** Info Hijriah yang sudah diproses untuk UI */
export interface HijriInfo {
  day: string;
  monthNumber: number;
  monthName: string; // dalam Bahasa Indonesia, misal "Ramadhan"
  monthNameEn: string; // dari API, misal "Ramaḍān"
  year: string;
  weekday: string;
  holidays: string[];
  designation: string; // "H"
}

/** Detail metode perhitungan untuk ditampilkan di UI */
export interface MethodDetail {
  name: string;
  fajrAngle: number;
  ishaAngle: number;
  locationRef: string; // "1.3521, 103.8198"
}

// ─── KOORDINAT ─────────────────────────────────────────────────────────────
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
