<template>
  <!-- AppLayout adalah ekuivalen <Layout> di React -->
  <!-- RouterView = <Outlet /> dari React Router -->
  <div class="min-h-screen bg-cream font-body flex flex-col">
    <Navbar />

    <!-- MAIN CONTENT -->
    <main class="flex-1">
      <!-- RouterView = Outlet di React -->
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
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
/* Page transition (seperti framer-motion di React) */
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
