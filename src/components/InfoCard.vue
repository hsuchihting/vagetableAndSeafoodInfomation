<template>
  <div class="px-4">
    <select name="" id="" class="border border-gray-300 rounded-md p-2 w-full" v-model="selectedCategory">
        <option value="fish">我要買魚</option>
        <option value="vegetable">我要買菜</option>
    </select>

    <div class="mt-4">
      <FishComponent v-if="selectedCategory === 'fish'" :fisheryProducts="getFisheryProducts" />
      <VegetableComponent v-else-if="selectedCategory === 'vegetable'" :agriProducts="getAgriProducts" />
      <div v-else-if="fishClosed || vegetableClosed">今日休市</div>
    </div>  
  </div>
</template>

<script setup>
import { toRefs, ref, computed } from 'vue';
import FishComponent from '@/components/FishComponent.vue';
import VegetableComponent from '@/components/VegetableComponent.vue';

const props = defineProps({
  getFisheryProducts: {
    type: Array,
    default: () => []
  },
  getAgriProducts: {
    type: Array,
    default: () => []
  }
});

const { getAgriProducts, getFisheryProducts } = toRefs(props);

const selectedCategory = ref('fish');
const fishClosed = computed(()=> {
  return getFisheryProducts.value.length && getFisheryProducts.value?.some(item => item.SeafoodProdName === '休市');
});

const vegetableClosed = computed(()=> {
  return getAgriProducts.value.some(item => item.CropName === '休市');
});

console.log(fishClosed.value, vegetableClosed.value);


// 組件邏輯可以在這裡添加
</script>
