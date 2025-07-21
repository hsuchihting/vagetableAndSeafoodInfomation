<template>
  <div>
    <p v-if="vegetableClosed">今日休市</p>
  </div>
</template>

<script setup>
import { toRefs, computed } from 'vue';
const props = defineProps({
  agriProducts: {
    type: Array,
    default: () => []
  }
});
const { agriProducts } = toRefs(props);

const vegetableClosed = computed(()=> {
  return agriProducts.value.find(item => item.CropName === '休市');
});
</script>