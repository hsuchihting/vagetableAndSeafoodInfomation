<template>
  <div>
      <p v-if="fishClosed">今日休市</p>
      <div v-else>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="grid gap-4 md:gap-6 col-span-3" v-for="item in fisheryProducts" :key="item.SeafoodProdCode">
            <h2 class="text-xl font-semibold">{{ item.SeafoodProdName }}</h2>
            <p>交易日期： {{ dateFormat(item.TransDate) }} </p>
            <p>市場名稱: {{ item.marketName }}</p>
            <p>高價格: {{ item.Upper_price  }}</p>
            <p>中價格: {{ item.Middle_Price }}</p>
            <p>低價格: {{ item.Lower_price }}</p>
            <p>平均價格: {{ item.Avg_price }}</p> 
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
  },
});
const { fisheryProducts } = toRefs(props);



const fishClosed = computed(()=> {
  return fisheryProducts.value?.some(item => item.SeafoodProdName === '休市');
});

console.log('fishClosed', fishClosed.value);

console.log('fisheryProducts', fisheryProducts.value);


const dateFormat = (dateStr) => {
  //dateStr 會是 yyymmdd 格式, 要轉乘成 yyy-mm-dd 格式
  if (!dateStr) return '';
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
</script>