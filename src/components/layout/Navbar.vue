<template>
  <header class="sticky top-0 z-50 bg-white border-b-4 border-dark">
    <nav class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 group">
        <div class="w-9 h-9 border-2 border-dark shadow-neo flex items-center justify-center text-cream text-lg font-bold transition-transform group-hover:-translate-y-0.5">☾</div>
        <span class="font-display text-xl font-bold text-dark"> Ruang<span class="text-primary">Muslim</span> </span>
      </RouterLink>

      <!-- Desktop Nav -->
      <ul class="hidden md:flex items-center gap-1">
        <li v-for="item in navItems" :key="item.path">
          <RouterLink
            :to="item.path"
            class="px-3 py-1.5 font-semibold text-sm border-2 border-transparent transition-all hover:border-dark hover:shadow-neo hover:-translate-y-0.5 hover:text-primary rounded-none"
            :class="{ 'border-dark text-primary shadow-neo': isActive(item.path) }"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>

      <!-- CTA Button -->
      <button class="hidden md:block px-4 py-2 bg-primary/15 border-2 border-dark font-bold text-dark shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm">Pengingat</button>

      <!-- Mobile Hamburger -->
      <button class="md:hidden p-2 border-2 border-dark shadow-neo" @click="mobileMenuOpen = !mobileMenuOpen">
        <span v-if="!mobileMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="mobileMenuOpen" class="md:hidden bg-cream border-t-4 border-dark">
        <ul class="flex flex-col">
          <li v-for="item in navItems" :key="item.path">
            <RouterLink
              :to="item.path"
              class="flex items-center gap-2 px-4 py-3 font-semibold border-b-2 border-dark/20 hover:bg-muted transition-colors"
              :class="{ 'bg-primary text-cream': isActive(item.path) }"
              @click="mobileMenuOpen = false"
            >
              <span>{{ item.icon }}</span>
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const mobileMenuOpen = ref(false);

const navItems = [
  { path: "/", label: "Beranda" },
  { path: "/quran", label: "Al-Quran" },
  { path: "/jadwal-sholat", label: "Sholat" },
  { path: "/doa", label: "Do'a" },
];

// Cek apakah route aktif (ekuivalen NavLink di React)
const isActive = (path) => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
