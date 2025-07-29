<template>
  <div class="container mx-auto px-4">
    <div class="flex items-center space-x-4">
      <button class="border border-blue-300 bg-blue-300 rounded-md py-2 px-5 text-xl text-blue-700" @click="selectCategory('fish')">我要買魚</button>
      <button class="border border-lime-600 bg-lime-600 rounded-md py-2 px-5 text-xl text-lime-200" @click="selectCategory('vegetable')">我要買菜</button>
    </div>

    <div class="mt-4">
      <FishComponent v-if="selectType === 'fish'" :fisheryProducts="fisheryProducts" />
      <VegetableComponent v-if="selectType === 'vegetable'" :agriProducts="agriProducts" />
    </div>  
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import FishComponent from '@/components/FishComponent.vue';
import VegetableComponent from '@/components/VegetableComponent.vue';
import { getFisheryProducts, getAgriProducts } from '@/api/url';

const props = defineProps({
  startLoading: {
    type: Function,
    required: true
  },
  stopLoading: {
    type: Function,
    required: true
  }
});

const selectType = ref('');
const fisheryProducts = ref([]);
const agriProducts = ref([]);

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

const fetchFisheryProducts = async () => {
  const params = paramsFormatted('fish');
  props.startLoading();
  try {
    const res = await getFisheryProducts(params);
    if (res && res.data && res.data?.Data.length) {
      fisheryProducts.value = res.data?.Data || [];
      return fisheryProducts.value;
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error('Error fetching fishery products:', error);
    return null;
  } finally {
    props.stopLoading();
  }
};

const fetchAgriProducts = async () => {
  const params = paramsFormatted('vegetable');  
  props.startLoading();
  try {
    const res = await getAgriProducts(params);
    if (res && res.data && res.data?.Data.length) {
      agriProducts.value = res.data?.Data;
      return agriProducts.value;
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error('Error fetching agricultural products:', error);
    return null;
  } finally {
    props.stopLoading();
  }
};

const selectCategory = (category) => {
  selectType.value = category; // 先切換顯示的元件
  if (category === 'fish') {
    fetchFisheryProducts();
  } else if (category === 'vegetable') {
    fetchAgriProducts();
  }
};
</script>
