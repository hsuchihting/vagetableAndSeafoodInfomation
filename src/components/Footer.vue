<template>
  <footer>
    <div class="mt-10 border-t border-slate-200 bg-white py-5 text-center text-slate-500">
      <p class="text-sm md:text-base">© {{ year }} 蔬菜與海鮮資訊. Data from MOA open data.</p>
    </div>
  </footer>
</template>

<script setup>
	import { ref } from 'vue';
	const year = ref(new Date().getFullYear());
</script>

