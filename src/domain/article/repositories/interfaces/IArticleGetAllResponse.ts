import { ArticleTranslation } from '@domain/article/entities/ArticleTranslation';

export type IArticleGetAllResponse = {
  meta: {
    totalItems: number;
    offset: number;
    size: number;
    sort: string;
  };
  articlesData: ArticleTranslation[];
};
