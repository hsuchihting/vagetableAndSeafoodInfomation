
<template>
  <ProductGrid
    category="fish"
    :closed="fishClosed"
    :products="products"
    :searchTerm="searchTerm"
  />
</template>

<script setup>
import { computed } from 'vue';
import ProductGrid from '@/components/ProductGrid.vue';
import { seafoodGuideItems } from '@/data/seafoodGuide';
import { filterMarketProducts, isMarketClosed, normalizeMarketProducts } from '@/utils/marketData';

const props = defineProps({
  fisheryProducts: {
    type: Array,
    default: () => []
  },
  searchTerm: {
    type: String,
    default: '',
  },
});

const normalizedProducts = computed(() => normalizeMarketProducts(props.fisheryProducts, 'fish', seafoodGuideItems));
const products = computed(() => filterMarketProducts(normalizedProducts.value, props.searchTerm));
const fishClosed = computed(() => isMarketClosed(props.fisheryProducts, 'fish'));
</script>
