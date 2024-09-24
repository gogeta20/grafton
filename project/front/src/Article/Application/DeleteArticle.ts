import { deleteArticle } from "@/Article/Infrastructure/useCase/DeleteArticle";
import { ref } from "vue";

export function useDeleteArticle() {
  const loading = ref(false);

  async function refetch(articleId: string) {
    try {
      loading.value = true;
      return await deleteArticle(articleId);
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
