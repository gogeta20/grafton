import { setFavorite } from "@/Article/Infrastructure/useCase/PostFavorite";
import { ref } from "vue";

export function useToggleFavorite() {
  const loading = ref(false);

  async function refetch(articleId: string) {
    try {
      loading.value = true;
      return await setFavorite(articleId);
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
