<template>
  <div>
    <p v-if="vegetableClosed">今日休市</p>
    <div v-else class="container mx-auto">
      <div class="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">

        <div
        v-for="item in agriProducts"
        :key="item.CropCode"
        class="bg-gray-50 rounded-lg border border-gray-200 shadow-md p-6 flex flex-col justify-between h-full"
        >
            <!-- 產品名稱 -->
            <h2 class="text-2xl font-bold mb-2 text-lime-600">{{ item.CropName }}</h2>
            <!-- 下排：產品編號、交易日期、與市場名稱 -->
            <div class="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-x-4 gap-y-1">
              <span>產品編號：{{ item.CropCode }}</span>
              <span>交易日期：{{ dateFormat(item.TransDate) }}</span>
              <span>市場名稱：{{ item.MarketName }}</span>
            </div>
            <!-- 其他資訊 grid -->
            <div class="grid md:grid-cols-3 gap-4 items-center flex-1">
              <div class="text-gray-600">
                <p>高價格：</p>
                <span>{{ item.Upper_Price }}</span>
              </div>
              <div class="text-gray-600">
                <p>中價格：</p>
                <span>{{ item.Middle_Price }}</span>
              </div>
              <div class="text-gray-600">
                <p>低價格：</p>
                <span class="text-gray-900">{{ item.Lower_Price }}</span>
              </div>
              <!-- 平均價格強調顯示，置於最右側 -->
            </div>
            <div class="flex justify-end mt-2">
              <span class="text-2xl font-bold text-lime-600">平均價格：{{ item.Avg_Price }}</span>
            </div>
        
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

// 待確認休市判斷
const vegetableClosed = computed(()=> {
  return agriProducts.value.find(item => item.CropName === '休市');
});
//todo: 農產品代碼要過濾掉花卉

const dateFormat = (dateStr) => {
  //dateStr 會是 yyy.mm.dd 格式
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('.');
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
</script>