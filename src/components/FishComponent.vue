<template>
  <div>
    <p v-if="fishClosed">今日休市</p>
    <div v-else>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <div class="grid gap-4 md:gap-6 col-span-3" v-for="item in filterMarketName" :key="item.SeafoodProdCode">
          <h2 class="text-xl font-semibold">{{ item.SeafoodProdName }}</h2>
          <p>交易日期： {{ dateFormat(item.TransDate) }} </p>
          <p>市場名稱: {{ item.marketName }}</p>
          <p>高價格: {{ item.Upper_price  }}</p>
          <p>中價格: {{ item.Middle_Price }}</p>
          <p>低價格: {{ item.Lower_price }}</p>
          <p>平均價格: {{ item.Avg_price }}</p>
          <p>價格: {{ item.Price }} 元</p>
          <p>供應量: {{ item.SupplyQty }} 公斤</p>
        </div>  
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRefs, computed } from 'vue';
const props = defineProps({
  fisheryProducts: {
    type: Array,
    default: () => []
  }
});
const { fisheryProducts } = toRefs(props);

const dateFormat = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const fishClosed = computed(()=> {
  return fisheryProducts.value?.find(item => item.SeafoodProdName === '休市');
});

const filterMarketName = computed(() => {
  return fisheryProducts.value?.filter(item => item.marketName !== '桃園');
});
</script>