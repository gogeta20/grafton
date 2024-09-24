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

async function Api(id: string): Promise<string> {
  const response = await api.post(`/api/content/${id}/favorite`);
  const { data } = response.data;
  return data;
}

async function setFavorite(id : string): Promise<string> {
  return UtilHelper.checkEnvironment() ? await InMemory() : await Api(id);
}

export { setFavorite };
