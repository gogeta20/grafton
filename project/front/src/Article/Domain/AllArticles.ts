export interface ResponseAllArticles {
  id: string
  title: string,
  body: string,
  mediaUrl: string,
  author: string | null,
  email: string | null,
  isFavorite: number
}

export interface AllArticlesList {
  id: string
  title: string,
  body: string,
  mediaUrl: string,
  author: string | null,
  email: string | null,
  isFavorite: number,
  files: string;
}

export interface ResponseData {
  data: ResponseAllArticles[];
  status: number;
  message: string;
}
