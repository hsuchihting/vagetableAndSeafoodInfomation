<template>
  <section>
    <div
      v-if="closed"
      class="rounded-lg border border-amber-200 bg-amber-50 px-6 py-12 text-center text-amber-800 shadow-sm"
    >
      <p class="text-2xl font-bold">今日休市</p>
      <p class="mt-2 text-sm">目前沒有交易行情資料。</p>
    </div>

    <div
      v-else-if="!products.length"
      class="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-sm"
    >
      <p class="text-lg font-semibold text-slate-700">{{ emptyTitle }}</p>
      <p class="mt-2 text-sm">{{ emptyDescription }}</p>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="item in products"
        :key="item.id"
        class="flex min-h-[260px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p :class="['text-xs font-semibold tracking-wide', theme.eyebrow]">
              {{ categoryLabel }}
            </p>
            <h2 class="mt-1 text-2xl font-bold text-slate-900">{{ item.name }}</h2>
          </div>
          <span :class="['shrink-0 rounded-full px-3 py-1 text-xs font-semibold', theme.badge]">
            {{ item.code }}
          </span>
        </div>

        <dl class="mt-4 grid gap-2 text-sm text-slate-600">
          <div class="flex justify-between gap-3">
            <dt>市場</dt>
            <dd class="text-right font-medium text-slate-800">{{ item.market }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt>交易日期</dt>
            <dd class="font-medium text-slate-800">{{ item.date }}</dd>
          </div>
          <div v-if="item.quantity !== ''" class="flex justify-between gap-3">
            <dt>交易量</dt>
            <dd class="font-medium text-slate-800">{{ item.quantity }}</dd>
          </div>
        </dl>

        <div class="mt-5 grid grid-cols-3 gap-2 text-center">
          <div class="rounded-md bg-slate-50 px-2 py-3">
            <p class="text-xs text-slate-500">高價</p>
            <p class="mt-1 font-bold text-slate-800">{{ item.upperPrice }}</p>
          </div>
          <div class="rounded-md bg-slate-50 px-2 py-3">
            <p class="text-xs text-slate-500">中價</p>
            <p class="mt-1 font-bold text-slate-800">{{ item.middlePrice }}</p>
          </div>
          <div class="rounded-md bg-slate-50 px-2 py-3">
            <p class="text-xs text-slate-500">低價</p>
            <p class="mt-1 font-bold text-slate-800">{{ item.lowerPrice }}</p>
          </div>
        </div>

        <div :class="['mt-2 rounded-lg px-4 py-3 text-right', theme.averageBox]">
          <p class="text-xs font-semibold">平均價格</p>
          <p class="text-3xl font-black">{{ item.avgPrice }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  closed: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    required: true,
  },
  searchTerm: {
    type: String,
    default: '',
  },
});

const themes = {
  vegetable: {
    eyebrow: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800',
    averageBox: 'bg-emerald-700 text-white',
    label: '蔬果行情',
  },
  fish: {
    eyebrow: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-800',
    averageBox: 'bg-sky-700 text-white',
    label: '漁貨行情',
  },
};

const theme = computed(() => themes[props.category] || themes.vegetable);
const categoryLabel = computed(() => theme.value.label);
const hasSearchTerm = computed(() => props.searchTerm.trim().length > 0);
const emptyTitle = computed(() => hasSearchTerm.value ? '找不到符合的品項' : '目前沒有資料');
const emptyDescription = computed(() => {
  if (hasSearchTerm.value) {
    return `沒有符合「${props.searchTerm.trim()}」的交易行情。`;
  }

  return '請稍後再試，或切換另一個品項類別。';
});
</script>
