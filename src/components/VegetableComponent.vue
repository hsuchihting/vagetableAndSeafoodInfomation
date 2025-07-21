<template>
  <div>
    <p v-if="vegetableClosed">今日休市</p>
    <div v-else>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <div class="grid gap-4 md:gap-6 col-span-3" v-for="item in filterMarketName" :key="item.CropCode">
          <h2 class="text-xl font-semibold">{{ item.CropName }}</h2>
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
  agriProducts: {
    type: Array,
    default: () => []
  }
});
const { agriProducts } = toRefs(props);

const vegetableClosed = computed(()=> {
  return agriProducts.value.find(item => item.CropName === '休市');
});

const filterMarketName = computed(() => {
  return agriProducts.value?.filter(item => item.marketName !== '桃園');
});

const dateFormat = (dateStr) => {
  //dateStr 會是 yyy.mm.dd 格式
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('.');
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
</script>