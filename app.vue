<template>
  <div class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
    <NuxtLayout />
    <NuxtPage />
  </div>
</template>

<script setup>

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>