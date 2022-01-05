export type IArticleGetOneResponse = {
  id: number;
  order: number;
  title: string;
  content_json: string;
  content_html: string;
  published: string;
  userId: string;
  articleId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
};
