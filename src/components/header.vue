<template>
	<div class="w-full">
			<h1 class="text-3xl font-bold text-white tracking-wide ">當日蔬菜與海鮮資訊</h1>
			<p class=" text-white tracking-wide">更新時間： {{ today }}</p>   
	</div>
</template>

<script setup>
import { ref } from 'vue';
const today = ref(new Date().toLocaleDateString('zh-TW', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}));
</script>

<style>

</style>