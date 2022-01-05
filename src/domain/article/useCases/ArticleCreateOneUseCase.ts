import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { IArticleCreateOneRequest } from '@domain/article/useCases/interfaces/IArticleCreateOneRequest';
import { IArticleCreateOneResponse } from '@domain/article/useCases/interfaces/IArticleCreateOneResponse';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { RequestError } from '@shared/errors/RequestError';
import { ArticleCore } from '../entities/ArticleCore';
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
    const { session, articleId, language, title, content_html, content_json } = articleCreateOneRequest;
    if (!title || !content_html || !content_json) throw new RequestError('Unprocessable Entity', 422);

    const articleTranslationExists = await this.articleRepo.articleGetOne({ sessionId: session?.id, articleId, language });
    if (!!articleTranslationExists) throw new RequestError('Article already exists', 409);

    const articleCoreData = await this.articleRepo.articleCoreGetOne({ articleId });
    const articleCore = new ArticleCore(articleCoreData);

    const idProvidedButDoesntExists = articleId && !articleCoreData;
    if (idProvidedButDoesntExists) throw new RequestError('Not Found', 404);

    const notTheAuthor = !!articleCoreData && session?.id !== articleCore?.userId;

    if (notTheAuthor) throw new AuthenticationError('Unauthorized', 401);

    let newArticleId = articleId;

    if (!articleCoreData) {
      const response = await this.articleRepo.articleCreateOne({ sessionId: session?.id });
      if (!response?.articleId) throw new RequestError('Article creation failed', 409);
      newArticleId = response?.articleId;
    }

    const articleTranslationIdCreated = await this.articleRepo.articleTranslationCreateOne({
      articleId: newArticleId,
      language,
      title,
      content_html,
      content_json,
    });
    if (!articleTranslationIdCreated) throw new RequestError('Article creation failed', 409);

    const article = await this.articleGetOneUseCase.execute({ session, articleId: newArticleId, language });

    return article;
  }
}
