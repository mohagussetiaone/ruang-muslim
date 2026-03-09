<script setup lang="ts">
import { computed } from "vue";

export interface SidebarMenuButtonProps {
  as?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const props = withDefaults(defineProps<SidebarMenuButtonProps>(), {
  as: "button",
  variant: "default",
  size: "default",
});

const classes = computed(() => {
  const base = "flex items-center gap-2 rounded-md border border-black px-3 py-2 text-sm font-medium transition";

  const variant = {
    default: "bg-white hover:bg-gray-100",
    outline: "bg-transparent hover:bg-gray-100",
    ghost: "border-none hover:bg-gray-100",
  }[props.variant];

  const size = {
    default: "h-9",
    sm: "h-8 text-xs",
    lg: "h-10 text-base",
  }[props.size];

  return `${base} ${variant} ${size}`;
});
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
