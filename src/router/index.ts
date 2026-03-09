import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import AppLayout from "@/components/layout/AppLayout.vue";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    requiresGuest?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { requiresGuest: true, title: "Masuk — Ruang Muslim" },
  },
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/HomeView.vue"),
        meta: { title: "Beranda — Ruang Muslim" },
      },
      {
        path: "quran",
        name: "quran",
        component: () => import("@/views/quran/QuranView.vue"),
        meta: { title: "Al-Quran Digital" },
      },
      {
        path: "quran/:surahId",
        name: "surah-detail",
        component: () => import("@/views/quran/SurahDetail.vue"),
        meta: { title: "Detail Surah" },
      },
      {
        path: "jadwal-sholat",
        name: "jadwal-sholat",
        component: () => import("@/views/jadwal/JadwalSolatView.vue"),
        meta: { title: "Jadwal Sholat" },
      },
      {
        path: "doa",
        name: "doa",
        component: () => import("@/views/doa/DoaView.vue"),
        meta: { title: "Kumpulan Do'a" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0, behavior: "smooth" };
  },
});

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
