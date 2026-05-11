<template>
  <div class="min-h-screen bg-stone-50 text-slate-900">      
      <Header :selected-category="selectedCategory" />
      <InfoCard
        :startLoading="startLoading"
        :stopLoading="stopLoading"
        :selected-category="selectedCategory"
        @update:selected-category="selectedCategory = $event"
      />
      <Footer /> 
      <Loading v-if="loading"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import InfoCard from '@/components/InfoCard.vue';
import Footer from '@/components/Footer.vue';
import Loading from '@/components/Loading.vue';
import { useLoading } from '/src/composables/loading.js';

const selectedCategory = ref('vegetable');
const { loading, startLoading, stopLoading } = useLoading();
</script>

