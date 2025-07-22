<template>
  <div>      
      <Header class="lg:mb-10 md:mb-6 mb-4 bg-lime-600 py-4 px-5" />
      <InfoCard :loading="loading" />
      <Footer /> 
      <Loading v-if="loading"/>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import InfoCard from '@/components/InfoCard.vue';
import Footer from '@/components/Footer.vue';
import Loading from '@/components/Loading.vue';
import { useLoading } from '/src/composables/loading.js';
const { loading } = useLoading();
</script>

