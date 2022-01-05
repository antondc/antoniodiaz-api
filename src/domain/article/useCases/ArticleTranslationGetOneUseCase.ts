import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { ArticleTranslation } from '../entities/ArticleTranslation';
import { IArticleGetOneRequest } from './interfaces/IArticleGetOneRequest';
import { IArticleGetOneResponse } from './interfaces/IArticleGetOneResponse';

export interface IArticleGetOneUseCase {
  execute: (articleGetOneRequest: IArticleGetOneRequest) => Promise<IArticleGetOneResponse>;
}

export class ArticleGetOneUseCase implements IArticleGetOneUseCase {
  private articleRepo: IArticleRepo;

  constructor(articleRepo: IArticleRepo) {
    this.articleRepo = articleRepo;
  }

  public async execute(articleGetOneRequest: IArticleGetOneRequest): Promise<IArticleGetOneResponse> {
    const { session, articleId, language } = articleGetOneRequest;

    const articleData = await this.articleRepo.articleGetOne({ sessionId: session?.id, articleId, language });
    const article = new ArticleTranslation(articleData);

    return article;
  }
}
