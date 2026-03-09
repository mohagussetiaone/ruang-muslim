<template>
  <div class="min-h-screen bg-background font-body flex items-center justify-center p-4 relative overflow-hidden">
    <!-- grid texture -->
    <div class="absolute inset-0 opacity-[0.04]" style="background-image: linear-gradient(#1a1a2e 1px, transparent 1px), linear-gradient(90deg, #1a1a2e 1px, transparent 1px); background-size: 40px 40px" />

    <div class="w-full max-w-md relative z-10">
      <!-- Card -->
      <Card class="p-8 shadow-shadow-lg border-4">
        <!-- Brand -->
        <div class="text-center mb-8">
          <div class="inline-flex w-16 h-16 bg-main border-4 border-border items-center justify-center text-3xl shadow-shadow mb-4">☾</div>
          <h1 class="font-display text-3xl font-black text-foreground">Masuk</h1>
          <p class="text-muted-foreground text-sm mt-1">Bismillah, selamat datang kembali</p>
        </div>

        <!-- Form -->
        <form class="space-y-5" novalidate @submit="onSubmit">
          <!-- Email -->
          <Input id="email" v-bind="emailAttrs" label="Email" type="email" placeholder="nama@email.com" prefix-icon="✉" required :error="errors.email" />

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <label for="password" class="text-sm font-bold text-foreground"> Password <span class="text-error">*</span> </label>
            <div class="relative">
              <input
                id="password"
                v-bind="passwordAttrs"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 8 karakter"
                :class="
                  cn(
                    'w-full h-10 px-3 pr-10 bg-background text-foreground border-2 font-body text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground',
                    'focus:shadow-shadow focus:-translate-y-0.5',
                    errors.password ? 'border-error focus:shadow-[4px_4px_0px_0px_#e63946]' : 'border-border',
                  )
                "
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" @click="showPassword = !showPassword">
                {{ showPassword ? "🙈" : "👁" }}
              </button>
            </div>
            <p v-if="errors.password" class="text-xs font-bold text-error">⚠ {{ errors.password }}</p>
          </div>

          <!-- Remember me -->
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input v-bind="rememberAttrs" type="checkbox" class="w-4 h-4 border-2 border-border accent-main cursor-pointer" />
            <span class="text-sm font-medium text-foreground">Ingat saya</span>
          </label>

          <!-- API error -->
          <Alert v-if="apiError" variant="destructive" title="Login gagal">
            {{ apiError }}
          </Alert>

          <!-- Submit -->
          <Button type="submit" variant="default" size="lg" class="w-full" :loading="isSubmitting"> Masuk → </Button>

          <div class="relative flex items-center gap-3">
            <div class="flex-1 h-0.5 bg-border/30" />
            <span class="text-xs text-muted-foreground font-bold">atau</span>
            <div class="flex-1 h-0.5 bg-border/30" />
          </div>

          <p class="text-center text-sm text-foreground">
            Belum punya akun?
            <RouterLink to="/register" class="font-black text-main underline hover:text-accent transition-colors"> Daftar sekarang </RouterLink>
          </p>
        </form>
      </Card>

      <!-- Decorative offset border -->
      <div class="absolute -bottom-3 -right-3 w-full h-full border-4 border-accent -z-10 pointer-events-none" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { loginSchema } from "@/types";
import { cn } from "@/lib/utils";

import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Alert } from "@/components/alert";

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const apiError = ref<string | null>(null);

const { handleSubmit, errors, isSubmitting, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const [, emailAttrs] = defineField("email");
const [, passwordAttrs] = defineField("password");
const [, rememberAttrs] = defineField("remember");

const onSubmit = handleSubmit(async (values) => {
  apiError.value = null;
  try {
    await authStore.login({ email: values.email, password: values.password });
    await router.push({ name: "home" });
  } catch (err) {
    apiError.value = err instanceof Error ? err.message : "Login gagal";
  }
});
</script>
