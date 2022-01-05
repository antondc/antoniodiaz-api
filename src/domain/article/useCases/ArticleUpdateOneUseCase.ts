import { ArticleTranslation } from '@domain/article/entities/ArticleTranslation';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { RequestError } from '@shared/errors/RequestError';
import { IArticleUpdateOneRequest } from './interfaces/IArticleUpdateOneRequest';
import { IArticleUpdateOneResponse } from './interfaces/IArticleUpdateOneResponse';

export interface IArticleUpdateOneUseCase {
  execute: (articleUpdateRequest: IArticleUpdateOneRequest) => Promise<IArticleUpdateOneResponse>;
}

export class ArticleUpdateOneUseCase implements IArticleUpdateOneUseCase {
  private articleRepo: IArticleRepo;

  constructor(articleRepo: IArticleRepo) {
    this.articleRepo = articleRepo;
  }

  public async execute(articleUpdateRequest: IArticleUpdateOneRequest): Promise<IArticleUpdateOneResponse> {
    const { session, language, articleId, title, content_json, content_html } = articleUpdateRequest;

    const articleExists = await this.articleRepo.articleGetOne({ sessionId: session?.id, articleId, language });
    if (!articleExists) throw new RequestError('Article does not exist', 404);
    if (articleExists?.userId !== session?.id) throw new RequestError('Article update failed', 500);

    await this.articleRepo.articleUpdateOne({ articleId, language, title, content_json, content_html });

    const articleData = await this.articleRepo.articleGetOne({ sessionId: session?.id, articleId, language });
    const article = new ArticleTranslation(articleData);

    return article;
  }
}
