import { createArticle } from "@/Article/Infrastructure/useCase/PostArticle";
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

export function useCreateArticle() {
  const loading = ref(false);

  async function refetch(createdArticle: Article, selectedFile: File | null) {
    try {
      loading.value = true;
      const formData = new FormData();
      formData.append('title', createdArticle.title);
      formData.append('body', createdArticle.body);

      if (selectedFile) {
        formData.append('files', selectedFile);
      }
      return await createArticle(formData);
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
