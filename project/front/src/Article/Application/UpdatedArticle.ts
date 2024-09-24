import { updateArticle } from "@/Article/Infrastructure/useCase/UpdateArticle";
import { ref } from "vue";

interface Article {
  id: string;
  title: string;
  body: string;
  mediaUrl: string;
  files: string;
  isFavorite: number;
  email: string | null;
}

export function useUpdatedArticle() {
  const loading = ref(false);

  async function refetch(updatedArticle: Article, selectedFile: File | null) {
    try {
      loading.value = true;
      const formData = new FormData();
      formData.append('id', updatedArticle.id);
      formData.append('title', updatedArticle.title);
      formData.append('body', updatedArticle.body);

      if (selectedFile) {
        formData.append('files', selectedFile);
      }
      return await updateArticle(updatedArticle.id, formData);
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
