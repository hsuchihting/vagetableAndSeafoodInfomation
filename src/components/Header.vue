<template>
	<header
		:style="headerStyle"
		class="relative min-h-[320px] overflow-hidden bg-cover bg-center text-slate-950 transition-all duration-500 md:min-h-[380px]"
	>
		<div :class="['absolute inset-0', theme.overlay]"></div>
		<div class="container relative z-10 mx-auto flex min-h-[320px] flex-col justify-center px-5 py-12 md:min-h-[380px]">
			<p :class="['text-sm font-black tracking-wide', theme.eyebrow]">{{ theme.eyebrowText }}</p>
			<h1 class="mt-2 max-w-2xl text-4xl font-black leading-tight md:text-6xl">蔬菜與海鮮行情</h1>
			<p class="mt-4 max-w-xl text-base font-medium text-slate-700 md:text-lg">
				用今日交易資料，挑選最適合下鍋的一餐。
			</p>
			<p class="mt-8 text-sm font-semibold text-slate-600">更新時間：{{ today }}</p>
		</div>
	</header>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  selectedCategory: {
    type: String,
    default: 'vegetable',
  },
});

const themes = {
  vegetable: {
    image: '/images/header-vegetables.png',
    eyebrow: 'text-emerald-800',
    eyebrowText: '蔬果批發行情',
    overlay: 'bg-gradient-to-r from-white/90 via-white/70 to-white/10',
  },
  fish: {
    image: '/images/header-fish.png',
    eyebrow: 'text-sky-800',
    eyebrowText: '漁貨批發行情',
    overlay: 'bg-gradient-to-r from-white/90 via-sky-50/70 to-sky-200/10',
  },
};

const today = ref(new Date().toLocaleDateString('zh-TW', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}));

const theme = computed(() => themes[props.selectedCategory] || themes.vegetable);
const headerStyle = computed(() => ({
  backgroundImage: `url(${theme.value.image})`,
}));
</script>
