<template>
  <div
    ref="el"
    class="p-[2px] rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-opacity-50 ring-gray-200 dark:ring-gray-800 shadow overflow-hidden z-[1] wow-card"
    :style="{
      '--x': `${elMousePosition.x}px`,
      '--y': `${elMousePosition.y}px`,
    }"
  >
    <div class="bg-white dark:bg-gray-900 w-full h-full p-4 hover:!bg-opacity-90 transition-[background] rounded-md">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { x: mouseX, y: mouseY } = useMouse();
const el = ref<HTMLDivElement | null>(null);

const elMousePosition = computed(() =>
  el.value
    ? {
        x: mouseX.value - el.value.offsetLeft,
        y: mouseY.value - el.value.offsetTop,
      }
    : {
        x: 0,
        y: 0,
      }
);
</script>

<style scoped>
.wow-card {
  position: relative;
}
.wow-card::before {
  background: radial-gradient(
    250px circle at var(--x) var(--y),
    rgb(var(--color-primary-DEFAULT)) 0,
    transparent 100%
  );
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: -1;
}
</style>
