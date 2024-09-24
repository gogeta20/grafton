import Mock from "@/Article/Infrastructure/mock/AllArticles.json";
import type {
  ResponseAllArticles,
  ResponseData,
  AllArticlesList
} from "@/Article/Domain/AllArticles";
import { api } from '@/core/config/network/Api';
import { UtilHelper } from "@/core/utilities/UtilHelper";

async function InMemory(): Promise<AllArticlesList[]> {
  await UtilHelper.wait(500);
  return createObject(Mock.data);
}

async function Api(): Promise<ResponseAllArticles[]> {
  const response = await api.get<ResponseData>(`/api/content`);
  const { data } = response.data;
  return data;
}

async function myArticles(): Promise<AllArticlesList[]> {
  const data = UtilHelper.checkEnvironment() ? await InMemory() : await Api();
  return createObject(data);
}

function createObject(items: ResponseAllArticles[]): AllArticlesList[] {
  return items.map((item) => {
    return {
      id: item.id,
      title: item.title,
      body: item.body,
      mediaUrl: item.mediaUrl,
      author: item.author,
      email: item.email,
      isFavorite: item.isFavorite,
      files: '',
    };
  });
}

export { myArticles };
