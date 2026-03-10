<template>
  <div class="min-h-screen bg-cream font-body flex flex-col">
    <Navbar />

    <main class="flex-1">
      <RouterView v-slot="{ Component, route }">
        <!--
          Transisi HANYA aktif untuk route yang BUKAN bagian dari quran.
          QuranLayout punya RouterView sendiri, jadi tidak perlu transisi di sini.
          Kalau QuranLayout ikut transition mode="out-in", dia akan unmount
          dulu sebelum mount lagi → sidebar hilang sebentar (blank putih).
        -->
        <Transition :name="route.path.startsWith('/quran') ? '' : 'page'" mode="out-in">
          <component :is="Component" :key="route.path.startsWith('/quran') ? 'quran-layout' : route.path" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import Navbar from "./Navbar.vue";
import AppFooter from "./Footer.vue";
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
