<template>
  <ProductGrid
    category="vegetable"
    :closed="vegetableClosed"
    :products="products"
    :searchTerm="searchTerm"
  />
</template>

<script setup>
import { computed } from 'vue';
import ProductGrid from '@/components/ProductGrid.vue';
import { filterMarketProducts, isMarketClosed, normalizeMarketProducts } from '@/utils/marketData';

const props = defineProps({
  agriProducts: {
    type: Array,
    default: () => []
  },
  searchTerm: {
    type: String,
    default: '',
  },
});

const normalizedProducts = computed(() => normalizeMarketProducts(props.agriProducts, 'vegetable'));
const products = computed(() => filterMarketProducts(normalizedProducts.value, props.searchTerm));
const vegetableClosed = computed(() => isMarketClosed(props.agriProducts, 'vegetable'));
</script>
