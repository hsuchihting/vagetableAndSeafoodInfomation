<template>
  <div class="px-4">
    <select name="" id="" class="border border-gray-300 rounded-md p-2 w-full" v-model="selectedCategory">
        <option value="fish">我要買魚</option>
        <option value="vegetable">我要買菜</option>
    </select>

    <div class="mt-4">
      <FishComponent v-if="selectedCategory === 'fish'" :fisheryProducts="getFisheryProducts" />
      <VegetableComponent v-else-if="selectedCategory === 'vegetable'" :agriProducts="getAgriProducts" />
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
// 組件邏輯可以在這裡添加
</script>
