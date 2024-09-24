export interface ResponseArticlesFavorites {
  article: Favorite
  user: any,
  createdAt: string
  id: string
}

export interface Favorite {
  id: string
  title: string,
  body: string,
  mediaUrl: string,
  author: string | null,
  email: string | null,
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
  data: ResponseArticlesFavorites[];
  status: number;
  message: string;
}
