import { Article } from '@domain/article/entities/Article';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { RequestError } from '@shared/errors/RequestError';
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
    if (!articleId || !language) throw new RequestError('Unprocessable Entity', 422);

    const articleData = await this.articleRepo.articleGetOne({ sessionId: session?.id, articleId, language });
    if (!articleData) throw new RequestError('Not Found', 404);

    const article = new Article(articleData);

    return article;
  }
}
