import Mock from "@/Article/Infrastructure/mock/AllArticles.json";
import type {
  ResponseArticlesFavorites,
  ResponseData,
  AllArticlesList
} from "@/Article/Domain/ArticlesFavorite";
import { api } from '@/core/config/network/Api';
import { UtilHelper } from "@/core/utilities/UtilHelper";

async function InMemory(): Promise<string> {
  await UtilHelper.wait(500);
  return Mock.data;
}

async function Api(formData: FormData): Promise<string> {
  const response = await api.post(`/api/content`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  const { data } = response.data;
  return data;
}

async function createArticle(formData : FormData): Promise<string> {
  return UtilHelper.checkEnvironment() ? await InMemory() : await Api(formData);
}

export { createArticle };
