<template>
  <div >      
      <Header class="lg:mb-10 md:mb-6 mb-4 bg-lime-600 py-4 px-5" />
      <InfoCard :getFisheryProducts="fisheryProducts" :getAgriProducts="agriProducts" />
      <Footer class="absolute bottom-0 left-0 right-0" /> 
  </div>
</template>

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
  // 時間格式要變成 YYYMMDD
  const today = new Date();
  const year = today.getFullYear() - 1911; // 民國年
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
    const res = await getFisheryProducts(params);
    if (res && res.data && res.data.Data) {
      fisheryProducts.value = res.data.Data || [];
      console.log('fish', res);
      return res;
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error('Error fetching fishery products:', error);
    return null;
  }
};

const fetchAgriProducts = async () => {
  // 時間格式要變成 YYY.MM.DD
  const today = new Date();
  const year = today.getFullYear() - 1911; // 民國年
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const paramDate = `${year}.${month}.${day}`;
  const Start_Time = paramDate;
  const End_Time = paramDate;
  const params = {
    Start_time: Start_Time,
    End_time: End_Time
  };
  
  try {
    const res = await getAgriProducts(params);
    if (res && res.data && res.data.Data) {
      agriProducts.value = res.data.Data;
      console.log('agri', res);
      return res;
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error('Error fetching agricultural products:', error);
    return null;
  }
};
</script>

