import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { IArticleCreateOneRequest } from '@domain/article/useCases/interfaces/IArticleCreateOneRequest';
import { IArticleCreateOneResponse } from '@domain/article/useCases/interfaces/IArticleCreateOneResponse';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { RequestError } from '@shared/errors/RequestError';
import { Article } from '../entities/Article';
import { IArticleGetOneUseCase } from './ArticleGetOneUseCase';

export interface IArticleCreateOneUseCase {
  execute: (articleCreateOneRequest: IArticleCreateOneRequest) => Promise<IArticleCreateOneResponse>;
}

export class ArticleCreateOneUseCase implements IArticleCreateOneUseCase {
  private articleRepo: IArticleRepo;
  private articleGetOneUseCase: IArticleGetOneUseCase;

  constructor(articleRepo: IArticleRepo, articleGetOneUseCase: IArticleGetOneUseCase) {
    this.articleRepo = articleRepo;
    this.articleGetOneUseCase = articleGetOneUseCase;
  }

  public async execute(articleCreateOneRequest: IArticleCreateOneRequest): Promise<IArticleCreateOneResponse> {
    const { session, language, title, content_html, content_json } = articleCreateOneRequest;
    if (!title || !content_html || !content_json) throw new RequestError('Unprocessable Entity', 422);

    const articleCreated = await this.articleRepo.articleCreateOne({ sessionId: session?.id });
    if (!articleCreated?.articleId) throw new RequestError('Article creation failed', 409);

    const articleTranslationIdCreated = await this.articleRepo.articleTranslationCreateOne({
      articleId: articleCreated?.articleId,
      language,
      title,
      content_html,
      content_json,
    });
    if (!articleTranslationIdCreated) throw new RequestError('Article creation failed', 409);

    const article = await this.articleGetOneUseCase.execute({ session, articleId: articleCreated?.articleId, language });

    return article;
  }
}
