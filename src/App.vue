<script setup>
import Header from '@/components/Header.vue';
import InfoCard from '@/components/InfoCard.vue'
import Footer from '@/components/Footer.vue';
import { onMounted, ref } from 'vue';

import { getFisheryProducts, getAgriProducts } from '@/api/url';

const fisheryProducts = ref([]);
const agriProducts = ref([]);

onMounted(() => {
  fetchFisheryProducts();
  fetchAgriProducts();
});

const fetchFisheryProducts = async () => {
  // 時間格式要變成 YYYYMMDD
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const paramDate = `${year}${month}${day}`;
  const Start_Time  = paramDate;
  const End_Time = paramDate;

  const params = {
    Start_time: Start_Time,
    End_time: End_Time
  };
  try {
    const response = await getFisheryProducts(params);
    fisheryProducts.value = response.data || [];
  } catch (error) {
    console.error('Error fetching fishery products:', error);
  }
};

const fetchAgriProducts = async () => {
  try {
    const response = await getAgriProducts();
    agriProducts.value = response.data || [];
  } catch (error) {
    console.error('Error fetching agricultural products:', error);
  }
};
</script>

<template>
  <div class="bg-gradient-to-b from-gray-50 to-gray-200">      
      <Header class="mb-10 text-left md:flex md:items-end md:justify-between bg-lime-600 p-4" />
      <InfoCard :getFisheryProducts="fisheryProducts" :getAgriProducts="agriProducts" />
      <Footer class="absolute bottom-0 left-0 right-0" /> 
  </div>
</template>