import { Article } from '@domain/article/entities/Article';

export type IArticleGetAllResponse = {
  meta: {
    totalItems: number;
    offset: number;
    size: number;
    sort: string;
  };
  articlesData: Article[];
};
