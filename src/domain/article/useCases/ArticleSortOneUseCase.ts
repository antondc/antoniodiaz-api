import { mockApiCall } from '@antoniodcorrea/utils';

import { Article } from '@domain/article/entities/Article';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { RequestError } from '@shared/errors/RequestError';
import { IArticleGetOneUseCase } from './ArticleGetOneUseCase';
import { IArticleSortOneRequest } from './interfaces/IArticleSortOneRequest';
import { IArticleSortOneResponse } from './interfaces/IArticleSortOneResponse';
mockApiCall;
export interface IArticleSortOneUseCase {
  execute: (articleSortOneRequest: IArticleSortOneRequest) => Promise<IArticleSortOneResponse>;
}

export class ArticleSortOneUseCase implements IArticleSortOneUseCase {
  private articleRepo: IArticleRepo;
  private articleGetOneUseCase: IArticleGetOneUseCase;

  constructor(articleRepo: IArticleRepo, articleGetOneUseCase: IArticleGetOneUseCase) {
    this.articleRepo = articleRepo;
    this.articleGetOneUseCase = articleGetOneUseCase;
  }

  public async execute(articleSortOneRequest: IArticleSortOneRequest): Promise<IArticleSortOneResponse> {
    const { session, articleId, order, language } = articleSortOneRequest;
    if (!articleId || (!order && order !== 0)) throw new RequestError('Unprocessable Entity', 422);

    const response = await this.articleRepo.articleSortOne({
      sessionId: session?.id,
      articleId,
      order,
    });

    if (!articleId) throw new RequestError('Not Found', 404);

    const articleData = await this.articleGetOneUseCase.execute({ session, articleId: response?.id, language });

    const article = new Article(articleData);

    return article;
  }
}
