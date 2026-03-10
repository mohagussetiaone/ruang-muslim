<template>
  <section class="bg-dark text-cream border-t-4 border-accent mt-auto">
    <div class="max-w-6xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2 mb-3"><img :src="LogoMain" alt="Ruang Muslim logo" /><span class="font-display text-lg font-bold">RuangMuslim</span></div>
          <p class="text-sm text-cream/70 leading-relaxed">Teman digital perjalanan spiritualmu. Al-Quran, jadwal sholat, dan doa dalam genggaman.</p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="font-bold mb-3 text-accent font-display">Fitur</h4>
          <ul class="space-y-2 text-sm">
            <li v-for="item in footerLinks" :key="item.path">
              <RouterLink :to="item.path" class="text-cream/70 hover:text-accent transition-colors hover:underline">
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-4 border-t border-cream/20 text-center text-xs text-cream/40">© {{ new Date().getFullYear() }} RuangMuslim | All rights reserved</div>
    </div>
  </section>
</template>

<script setup>
import LogoMain from "@/assets/logo/main-logo.png";

const footerLinks = [
  { path: "/quran", label: "Al-Quran Digital" },
  { path: "/jadwal-sholat", label: "Jadwal Sholat" },
  { path: "/doa", label: "Kumpulan Do'a" },
];
</script>
