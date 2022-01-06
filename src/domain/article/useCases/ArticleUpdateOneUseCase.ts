import { Article } from '@domain/article/entities/Article';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { IArticleUpdateOneRequest } from '@domain/article/useCases/interfaces/IArticleUpdateOneRequest';
import { IArticleUpdateOneResponse } from '@domain/article/useCases/interfaces/IArticleUpdateOneResponse';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { RequestError } from '@shared/errors/RequestError';
import { IArticleGetOneUseCase } from './ArticleGetOneUseCase';

export interface IArticleUpdateOneUseCase {
  execute: (articleUpdateOneRequest: IArticleUpdateOneRequest) => Promise<IArticleUpdateOneResponse>;
}

export class ArticleUpdateOneUseCase implements IArticleUpdateOneUseCase {
  private articleRepo: IArticleRepo;
  private articleGetOneUseCase: IArticleGetOneUseCase;

  constructor(articleRepo: IArticleRepo, articleGetOneUseCase: IArticleGetOneUseCase) {
    this.articleRepo = articleRepo;
    this.articleGetOneUseCase = articleGetOneUseCase;
  }

  public async execute(articleUpdateOneRequest: IArticleUpdateOneRequest): Promise<IArticleUpdateOneResponse> {
    const { session, articleId, language, title, contentHtml, contentJson, published } = articleUpdateOneRequest;
    if (!title || !contentHtml || !contentJson) throw new RequestError('Unprocessable Entity', 422);

    const articleCoreData = await this.articleRepo.articleCoreGetOne({ articleId });
    if (!articleCoreData) throw new RequestError('Not Found', 404);

    const notTheAuthor = session?.id !== articleCoreData?.userId;
    if (notTheAuthor) throw new AuthenticationError('Unauthorized', 401);

    const articleTranslationIdCreated = await this.articleRepo.articleUpdateOne({
      articleId,
      language,
      title,
      contentHtml,
      contentJson,
      published,
    });
    if (!articleTranslationIdCreated) throw new RequestError('Article creation failed', 409);

    const articleData = await this.articleGetOneUseCase.execute({ session, articleId, language });
    const article = new Article(articleData);

    return article;
  }
}
