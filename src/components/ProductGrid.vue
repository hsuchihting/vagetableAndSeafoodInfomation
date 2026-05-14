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

    <div
      v-if="!closed && products.length"
      class="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <p>
        第 {{ currentPage }} / {{ totalPages }} 頁，顯示第 {{ rangeStart }} - {{ rangeEnd }} 筆，共 {{ products.length }} 筆
      </p>
      <div v-if="totalPages > 1" class="flex flex-wrap items-center gap-2" aria-label="分頁選擇">
        <button
          class="min-h-[40px] rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          上一頁
        </button>
        <button
          v-for="page in pageNumbers"
          :key="page"
          :class="pageButtonClass(page)"
          type="button"
          :aria-current="currentPage === page ? 'page' : undefined"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="min-h-[40px] rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一頁
        </button>
      </div>
    </div>

    <div v-if="!closed && products.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="item in paginatedProducts"
        :key="item.id"
        class="flex min-h-[260px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p :class="['text-xs font-semibold tracking-wide', theme.eyebrow]">
              {{ categoryLabel }}
            </p>
            <div class="mt-1 flex flex-wrap items-center gap-2">
              <h2 class="text-2xl font-bold text-slate-900">{{ item.name }}</h2>
              <div
                v-if="item.seafoodGuide"
                class="flex flex-wrap gap-2"
                :title="`海鮮指南比對：${item.seafoodGuide.name}`"
              >
                <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 ring-1 ring-sky-100">
                  {{ item.seafoodGuide.sourceType }}
                </span>
                <span class="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 ring-1 ring-cyan-100">
                  {{ item.seafoodGuide.origin }}
                </span>
                <span :class="['rounded-full px-3 py-1 text-xs font-bold ring-1', sustainabilityClass(item.seafoodGuide.category)]">
                  永續建議：{{ item.seafoodGuide.sustainabilityLabel }}
                </span>
              </div>
            </div>
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

    <div
      v-if="!closed && products.length && totalPages > 1"
      class="mt-6 flex flex-wrap items-center justify-center gap-2"
      aria-label="底部分頁選擇"
    >
      <button
        class="min-h-[40px] rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        上一頁
      </button>
      <button
        v-for="page in pageNumbers"
        :key="`bottom-${page}`"
        :class="pageButtonClass(page)"
        type="button"
        :aria-current="currentPage === page ? 'page' : undefined"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button
        class="min-h-[40px] rounded-md border border-slate-300 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        type="button"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        下一頁
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

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
  pageSize: {
    type: Number,
    default: 50,
  },
});

const themes = {
  vegetable: {
    eyebrow: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800',
    averageBox: 'bg-emerald-700 text-white',
    paginationActive: 'bg-emerald-700',
    label: '蔬果行情',
  },
  fish: {
    eyebrow: 'text-sky-700',
    badge: 'bg-sky-100 text-sky-800',
    averageBox: 'bg-sky-700 text-white',
    paginationActive: 'bg-sky-700',
    label: '漁貨行情',
  },
};

const theme = computed(() => themes[props.category] || themes.vegetable);
const categoryLabel = computed(() => theme.value.label);
const hasSearchTerm = computed(() => props.searchTerm.trim().length > 0);
const currentPage = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(props.products.length / props.pageSize)));
const pageStartIndex = computed(() => (currentPage.value - 1) * props.pageSize);
const paginatedProducts = computed(() => {
  return props.products.slice(pageStartIndex.value, pageStartIndex.value + props.pageSize);
});
const rangeStart = computed(() => props.products.length ? pageStartIndex.value + 1 : 0);
const rangeEnd = computed(() => Math.min(pageStartIndex.value + props.pageSize, props.products.length));
const emptyTitle = computed(() => hasSearchTerm.value ? '找不到符合的品項' : '目前沒有資料');
const emptyDescription = computed(() => {
  if (hasSearchTerm.value) {
    return `沒有符合「${props.searchTerm.trim()}」的交易行情。`;
  }

  return '請稍後再試，或切換另一個品項類別。';
});

const pageNumbers = computed(() => {
  return Array.from({ length: totalPages.value }, (_, index) => index + 1);
});

const goToPage = (page) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
};

const pageButtonClass = (page) => [
  'min-h-[40px] min-w-[40px] rounded-md border px-3 text-sm font-bold transition',
  currentPage.value === page
    ? `${theme.value.paginationActive} border-transparent text-white`
    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
];

const sustainabilityClass = (category) => {
  const classMap = {
    0: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
    1: 'bg-amber-50 text-amber-800 ring-amber-100',
    2: 'bg-rose-50 text-rose-800 ring-rose-100',
  };

  return classMap[category] || 'bg-slate-50 text-slate-700 ring-slate-100';
};

watch(() => [props.products, props.searchTerm, props.category], () => {
  currentPage.value = 1;
});

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages;
  }
});
</script>
