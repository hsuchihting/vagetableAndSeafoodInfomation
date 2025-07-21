<template>
  <footer>
    <div class="bg-lime-800 text-white text-center py-4 mt-10">
      <p>© {{ year }} 蔬菜與海鮮資訊. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
	import { ref } from 'vue';
	const year = ref(new Date().getFullYear());
</script>

<style>

</style>