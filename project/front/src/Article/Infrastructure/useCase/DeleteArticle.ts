import Mock from "@/Article/Infrastructure/mock/AllArticles.json";
import type {
  ResponseArticlesFavorites,
  ResponseData,
  AllArticlesList
} from "@/Article/Domain/DeleteArticles";
import { api } from '@/core/config/network/Api';
import { UtilHelper } from "@/core/utilities/UtilHelper";

async function InMemory(): Promise<string> {
  await UtilHelper.wait(500);
  return Mock.data;
}

async function Api(articleId: string): Promise<string> {
  const response = await api.delete(`/api/content/${articleId}`);
  const { data } = response.data;
  return data;
}

async function deleteArticle(articleId: string): Promise<string> {
  return UtilHelper.checkEnvironment() ? await InMemory() : await Api(articleId);
}

export { deleteArticle };
