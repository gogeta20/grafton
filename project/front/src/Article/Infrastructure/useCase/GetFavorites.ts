import Mock from "@/Article/Infrastructure/mock/AllArticles.json";
import type {
  ResponseArticlesFavorites,
  ResponseData,
  AllArticlesList
} from "@/Article/Domain/ArticlesFavorite";
import { api } from '@/core/config/network/Api';
import { UtilHelper } from "@/core/utilities/UtilHelper";

async function InMemory(): Promise<AllArticlesList[]> {
  await UtilHelper.wait(500);
  return createObject(Mock.data);
}

async function Api(): Promise<ResponseArticlesFavorites[]> {
  const response = await api.get<ResponseData>(`/api/favorites`);
  const { data } = response.data;
  return data;
}

async function myFavorites(): Promise<AllArticlesList[]> {
  const data = UtilHelper.checkEnvironment() ? await InMemory() : await Api();
  return createObject(data);
}

function createObject(items: ResponseArticlesFavorites[]): AllArticlesList[] {
  return items.map((item) => {
    return {
      id: item.article.id,
      title: item.article.title,
      body: item.article.body,
      mediaUrl: item.article.mediaUrl,
      author: item.article.author,
      email: item.article.email,
      isFavorite: true,
      files: '',
    };
  });
}

export { myFavorites };
