import { ref } from 'vue';
export const useLoading = () => {
  const loading = ref(false);

  const startLoading = () => {
    loading.value = true;
  };

  const stopLoading = () => {
    loading.value = false;
  };

  return {
    loading,
    startLoading,
    stopLoading
  };
}