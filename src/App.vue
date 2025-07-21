<script setup>
import InfoCard from './components/InfoCard.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12">
    <div class="container mx-auto px-4">
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-gray-800">蔬菜與海鮮資訊網站</h1>
        <p class="text-gray-600 mt-2">使用 Vue 3 + Vite + Tailwind CSS 建立</p>
      </header>
      <InfoCard />
    </div>
  </div>
</template>

<style scoped>
/* 使用 Tailwind，所以這裡不需要額外的樣式 */
</style>
