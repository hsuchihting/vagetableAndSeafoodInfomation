<template>
  <div>
    <p v-if="fishClosed">今日休市</p>
  </div>
</template>

<script setup>
import { toRefs, computed } from 'vue';
const props = defineProps({
  fisheryProducts: {
    type: Array,
    default: () => []
  }
});
const { fisheryProducts } = toRefs(props);

const fishClosed = computed(()=> {
  return fisheryProducts.value?.find(item => item.SeafoodProdName === '休市');
});

console.log(fishClosed.value);
</script>

<style>

</style>