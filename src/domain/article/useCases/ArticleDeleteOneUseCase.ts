import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { RequestError } from '@shared/errors/RequestError';
import { IArticleDeleteOneRequest } from './interfaces/IArticleDeleteOneRequest';
import { IArticleDeleteOneResponse } from './interfaces/IArticleDeleteOneResponse';

export interface IArticleDeleteOneUseCase {
  execute: (articleDeleteOneRequest: IArticleDeleteOneRequest) => Promise<IArticleDeleteOneResponse>;
}

export class ArticleDeleteOneUseCase implements IArticleDeleteOneUseCase {
  private articleRepo: IArticleRepo;

  constructor(articleRepo: IArticleRepo) {
    this.articleRepo = articleRepo;
  }

  public async execute(articleDeleteOneRequest: IArticleDeleteOneRequest): Promise<IArticleDeleteOneResponse> {
    const { session, articleId, language } = articleDeleteOneRequest;

    const articleData = await this.articleRepo.articleGetOne({ sessionId: session?.id, articleId, language });
    if (!articleData) throw new RequestError('Article does not exist', 404);

    const { articleId: deletedArticleId } = await this.articleRepo.articleDeleteOne({ sessionId: session?.id, articleId, language });

    return {
      articleId: deletedArticleId,
    };
  }
}
