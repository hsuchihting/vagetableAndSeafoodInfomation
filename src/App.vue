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
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-3 opacity-0"
      >
        <button
          v-if="showScrollTop"
          class="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-lg shadow-sky-200/70 transition hover:-translate-y-0.5 hover:from-emerald-600 hover:to-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-200"
          type="button"
          aria-label="回到頂部"
          @click="scrollToTop"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            <path d="M5 12 12 5l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </Transition>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Header from '@/components/Header.vue';
import InfoCard from '@/components/InfoCard.vue';
import Footer from '@/components/Footer.vue';
import Loading from '@/components/Loading.vue';
import { useLoading } from '/src/composables/loading.js';

const selectedCategory = ref('vegetable');
const showScrollTop = ref(false);
const { loading, startLoading, stopLoading } = useLoading();

const updateScrollTopVisibility = () => {
  showScrollTop.value = window.scrollY > 500;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  updateScrollTopVisibility();
  window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollTopVisibility);
});
</script>
