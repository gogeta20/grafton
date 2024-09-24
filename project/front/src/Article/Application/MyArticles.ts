import { myArticles } from "@/Article/Infrastructure/useCase/GetArticles";
import { ref } from "vue";

export function useMyArticles() {
  const loading = ref(false);

  async function refetch() {
    try {
      loading.value = true;
      return await myArticles();
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
