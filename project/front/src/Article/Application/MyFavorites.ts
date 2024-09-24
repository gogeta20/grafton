import { myFavorites } from "@/Article/Infrastructure/useCase/GetFavorites";
import { ref } from "vue";

export function useMyFavorites() {
  const loading = ref(false);

  async function refetch() {
    try {
      loading.value = true;
      return await myFavorites();
    } catch (error) {
      return -1;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    refetch,
  };
}
