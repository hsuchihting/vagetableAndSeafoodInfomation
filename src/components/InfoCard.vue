<template>
  <main class="container mx-auto px-4 pb-12 pt-6">
    <section class="mb-6 border-b border-slate-200 pb-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div class="grid gap-2 rounded-lg bg-white p-1 shadow-sm ring-1 ring-slate-200 sm:grid-cols-2">
          <button
            v-for="category in categories"
            :key="category.value"
            :aria-pressed="selectType === category.value"
            :class="categoryButtonClass(category)"
            type="button"
            @click="selectCategory(category.value)"
          >
            <span class="flex items-center gap-2 text-sm font-bold">
              <span
                v-if="selectType === category.value"
                class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/95"
                aria-hidden="true"
              >
                <svg
                  v-if="category.value === 'vegetable'"
                  class="h-5 w-5 text-emerald-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.4 8.6 4.7 19.2c-.3.7.4 1.4 1.1 1.1l10.6-4.7c1.9-.8 2.4-3.2 1-4.7l-3-3c-1.5-1.5-4.1-1.1-5 1Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M8.7 12.8 11.2 15.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M7.2 16.1 8.8 17.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M14.6 8.1c.2-2 1-3.5 2.7-4.6.2 2-.3 3.7-1.8 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M15.8 9.3c1-1.8 2.4-2.7 4.4-2.8-.6 1.9-1.8 3.2-3.8 3.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5 text-sky-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3.5 12c2.3-3.5 5.2-5.2 8.7-5.2 3.4 0 6.2 1.7 8.3 5.2-2.1 3.5-4.9 5.2-8.3 5.2-3.5 0-6.4-1.7-8.7-5.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M20.5 12 23 9.5v5L20.5 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M8.2 11.7h.1" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
                  <path d="M13.5 7.1c.3-1.2 1-2.1 2.2-2.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </span>
              {{ category.label }}
            </span>
            <span :class="['text-xs', selectType === category.value ? 'pl-9' : '']">{{ category.description }}</span>
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span :class="['rounded-full px-3 py-1 font-bold', activeCategory.chipClass]">
            {{ activeCategory.label }}
          </span>
          <span>{{ activeDateText }}</span>
          <span>顯示 {{ activeCount }} / {{ activeTotalCount }} 筆</span>
        </div>
      </div>

      <div class="mt-5 max-w-4xl">
        <label for="market-search" class="text-sm font-semibold text-slate-700">搜尋行情</label>
        <div class="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="market-search"
            v-model="searchTerm"
            :class="['min-h-[48px] flex-1 rounded-md border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4', activeCategory.inputClass]"
            type="search"
            placeholder="輸入品名、代碼、市場、日期或價格"
          />
          <button
            v-if="searchTerm"
            class="min-h-[48px] rounded-md border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            type="button"
            @click="clearSearch"
          >
            清除
          </button>
        </div>
        <p class="mt-2 text-sm text-slate-500">
          {{ searchHint }}
        </p>
      </div>
    </section>

    <div v-if="errorMessage" class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {{ errorMessage }}
    </div>

    <section>
      <FishComponent
        v-if="selectType === 'fish'"
        :fisheryProducts="fisheryProducts"
        :searchTerm="searchTerm"
      />
      <VegetableComponent
        v-if="selectType === 'vegetable'"
        :agriProducts="agriProducts"
        :searchTerm="searchTerm"
      />
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import FishComponent from '@/components/FishComponent.vue';
import VegetableComponent from '@/components/VegetableComponent.vue';
import { getFisheryProducts, getAgriProducts } from '@/api/url';
import { filterMarketProducts, formatMarketDate, normalizeMarketProducts } from '@/utils/marketData';

const props = defineProps({
  startLoading: {
    type: Function,
    required: true
  },
  stopLoading: {
    type: Function,
    required: true
  },
  selectedCategory: {
    type: String,
    default: 'vegetable',
  }
});

const emit = defineEmits(['update:selectedCategory']);

const categories = [
  {
    value: 'vegetable',
    label: '我要買菜',
    description: '蔬果批發行情',
    activeClass: 'bg-emerald-700 text-white shadow-sm',
    inactiveClass: 'bg-transparent text-slate-600 hover:bg-white hover:text-emerald-800',
    chipClass: 'bg-emerald-100 text-emerald-800',
    inputClass: 'focus:border-emerald-600 focus:ring-emerald-100',
  },
  {
    value: 'fish',
    label: '我要買魚',
    description: '漁貨批發行情',
    activeClass: 'bg-sky-700 text-white shadow-sm',
    inactiveClass: 'bg-transparent text-slate-600 hover:bg-white hover:text-sky-800',
    chipClass: 'bg-sky-100 text-sky-800',
    inputClass: 'focus:border-sky-600 focus:ring-sky-100',
  },
];

const selectType = ref(props.selectedCategory);
const fisheryProducts = ref([]);
const agriProducts = ref([]);
const errorMessage = ref('');
const searchTerm = ref('');
const fishLatestDate = ref('');

const todayLabel = computed(() => new Date().toLocaleDateString('zh-TW', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}));

const activeCategory = computed(() => {
  return categories.find((category) => category.value === selectType.value) || categories[0];
});

const activeDateText = computed(() => {
  if (selectType.value === 'fish' && fishLatestDate.value) {
    return `最新交易日 ${formatMarketDate(fishLatestDate.value)}`;
  }

  return `更新日期 ${todayLabel.value}`;
});

const activeCount = computed(() => {
  if (selectType.value === 'fish') {
    return filterMarketProducts(normalizeMarketProducts(fisheryProducts.value, 'fish'), searchTerm.value).length;
  }

  return filterMarketProducts(normalizeMarketProducts(agriProducts.value, 'vegetable'), searchTerm.value).length;
});

const activeTotalCount = computed(() => {
  if (selectType.value === 'fish') {
    return normalizeMarketProducts(fisheryProducts.value, 'fish').length;
  }

  return normalizeMarketProducts(agriProducts.value, 'vegetable').length;
});

const searchHint = computed(() => {
  if (!searchTerm.value.trim()) {
    return `目前顯示 ${activeTotalCount.value} 筆${activeCategory.value.description}。`;
  }

  return `搜尋「${searchTerm.value.trim()}」：找到 ${activeCount.value} / ${activeTotalCount.value} 筆。`;
});

const categoryButtonClass = (category) => [
  'flex min-w-[150px] flex-col rounded-md px-5 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-slate-200',
  selectType.value === category.value ? category.activeClass : category.inactiveClass,
];

const paramsFormatted = (category) =>{
  const today = new Date();
  const year = today.getFullYear() - 1911;
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const paramDate = category === 'fish' ? `${year}${month}${day}` : `${year}.${month}.${day}`;
  const Start_Time  = paramDate;
  const End_Time = paramDate;
  const params = {
    Start_time: Start_Time,
    End_time: End_Time
  };
  return params;
}

const getLatestTransDate = (items = []) => {
  return items.reduce((latestDate, item) => {
    const transDate = String(item?.['交易日期'] || item?.TransDate || item?.transDate || '').trim();
    if (!transDate) return latestDate;
    return !latestDate || transDate > latestDate ? transDate : latestDate;
  }, '');
};

const fetchFisheryProducts = async () => {
  props.startLoading();
  errorMessage.value = '';
  try {
    const res = await getFisheryProducts();
    if (res && Array.isArray(res.data) && res.data.length) {
      fishLatestDate.value = getLatestTransDate(res.data);
      fisheryProducts.value = res.data.filter((item) => String(item['交易日期']) === fishLatestDate.value);
      return fisheryProducts.value;
    } else {
      fishLatestDate.value = '';
      fisheryProducts.value = [];
      throw new Error('目前查無漁貨交易資料');
    }
  } catch (error) {
    console.error('Error fetching fishery products:', error);
    errorMessage.value = error.message || '漁貨資料讀取失敗，請稍後再試';
    return null;
  } finally {
    props.stopLoading();
  }
};

const fetchAgriProducts = async () => {
  const params = paramsFormatted('vegetable');
  props.startLoading();
  errorMessage.value = '';
  try {
    const res = await getAgriProducts();
    if (res && Array.isArray(res.data) && res.data.length) {
      agriProducts.value = res.data.filter((item) => item['交易日期'] === params.Start_time);
      return agriProducts.value;
    } else {
      agriProducts.value = [];
      throw new Error('目前查無蔬果交易資料');
    }
  } catch (error) {
    console.error('Error fetching agricultural products:', error);
    errorMessage.value = error.message || '蔬果資料讀取失敗，請稍後再試';
    return null;
  } finally {
    props.stopLoading();
  }
};

const selectCategory = (category) => {
  if (selectType.value === category) return;
  selectType.value = category;
  emit('update:selectedCategory', category);
  if (category === 'fish') {
    fetchFisheryProducts();
  } else if (category === 'vegetable') {
    fetchAgriProducts();
  }
};

const clearSearch = () => {
  searchTerm.value = '';
};

watch(() => props.selectedCategory, (category) => {
  if (category && category !== selectType.value) {
    selectCategory(category);
  }
});

onMounted(() => {
  emit('update:selectedCategory', selectType.value);
  fetchAgriProducts();
});
</script>
