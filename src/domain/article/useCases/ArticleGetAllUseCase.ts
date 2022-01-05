import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { ArticleTranslation } from '../entities/ArticleTranslation';
import { IArticleGetAllRequest } from './interfaces/IArticleGetAllRequest';
import { IArticleGetAllResponse } from './interfaces/IArticleGetAllResponse';

export interface IArticleGetAllUseCase {
  execute: (articleGetAllRequest: IArticleGetAllRequest) => Promise<IArticleGetAllResponse>;
}

export class ArticleGetAllUseCase implements IArticleGetAllUseCase {
  private articleRepo: IArticleRepo;

  constructor(articleRepo: IArticleRepo) {
    this.articleRepo = articleRepo;
  }

  public async execute(articleGetAllRequest: IArticleGetAllRequest): Promise<IArticleGetAllResponse> {
    const { session, sort, size, offset, filter, language } = articleGetAllRequest;

    const { articlesData, meta } = await this.articleRepo.articleGetAll({ sessionId: session?.id, sort, size, offset, filter, language });

    const articles = articlesData.map((articleData) => new ArticleTranslation(articleData));

    return {
      articles,
      meta,
    };
  }
}
