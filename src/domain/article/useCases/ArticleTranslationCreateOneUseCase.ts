import { Article } from '@domain/article/entities/Article';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { IArticleTranslationCreateOneRequest } from '@domain/article/useCases/interfaces/IArticleTranslationCreateOneRequest';
import { IArticleTranslationCreateOneResponse } from '@domain/article/useCases/interfaces/IArticleTranslationCreateOneResponse';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { RequestError } from '@shared/errors/RequestError';
import { IArticleGetOneUseCase } from './ArticleGetOneUseCase';

export interface IArticleTranslationCreateOneUseCase {
  execute: (articleTranslationCreateOneRequest: IArticleTranslationCreateOneRequest) => Promise<IArticleTranslationCreateOneResponse>;
}

export class ArticleTranslationCreateOneUseCase implements IArticleTranslationCreateOneUseCase {
  private articleRepo: IArticleRepo;
  private articleGetOneUseCase: IArticleGetOneUseCase;

  constructor(articleRepo: IArticleRepo, articleGetOneUseCase: IArticleGetOneUseCase) {
    this.articleRepo = articleRepo;
    this.articleGetOneUseCase = articleGetOneUseCase;
  }

  public async execute(articleTranslationCreateOneRequest: IArticleTranslationCreateOneRequest): Promise<IArticleTranslationCreateOneResponse> {
    const { session, articleId, language, title, contentHtml, contentJson } = articleTranslationCreateOneRequest;
    if (!title || !contentHtml || !contentJson) throw new RequestError('Unprocessable Entity', 422);

    const articleCoreData = await this.articleRepo.articleCoreGetOne({ articleId });
    if (!articleCoreData) throw new RequestError('Not Found', 404);

    const notTheAuthor = session?.id !== articleCoreData?.userId;
    if (notTheAuthor) throw new AuthenticationError('Unauthorized', 401);

    const articleTranslationIdCreated = await this.articleRepo.articleTranslationCreateOne({
      articleId,
      language,
      title,
      contentHtml,
      contentJson,
    });
    if (!articleTranslationIdCreated) throw new RequestError('Article creation failed', 409);

    const articleData = await this.articleGetOneUseCase.execute({ session, articleId, language });
    const article = new Article(articleData);

    return article;
  }
}
