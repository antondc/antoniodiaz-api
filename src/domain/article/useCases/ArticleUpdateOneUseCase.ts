import { Article, articleImageFormat } from '@domain/article/entities/Article';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { IArticleUpdateOneRequest } from '@domain/article/useCases/interfaces/IArticleUpdateOneRequest';
import { IArticleUpdateOneResponse } from '@domain/article/useCases/interfaces/IArticleUpdateOneResponse';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { RequestError } from '@shared/errors/RequestError';
import { RichContent } from '@shared/services/RichContent';
import { IArticleGetOneUseCase } from './ArticleGetOneUseCase';

export interface IArticleUpdateOneUseCase {
  execute: (articleUpdateOneRequest: IArticleUpdateOneRequest) => Promise<IArticleUpdateOneResponse>;
}

export class ArticleUpdateOneUseCase implements IArticleUpdateOneUseCase {
  private articleRepo: IArticleRepo;
  private fileRepo: IFileRepo;
  private articleGetOneUseCase: IArticleGetOneUseCase;

  constructor(articleRepo: IArticleRepo, fileRepo: IFileRepo, articleGetOneUseCase: IArticleGetOneUseCase) {
    this.articleRepo = articleRepo;
    this.fileRepo = fileRepo;
    this.articleGetOneUseCase = articleGetOneUseCase;
  }

  public async execute(articleUpdateOneRequest: IArticleUpdateOneRequest): Promise<IArticleUpdateOneResponse> {
    const { session, articleId, language, title, contentJson, published } = articleUpdateOneRequest;
    if (!title) throw new RequestError('Unprocessable Entity', 422);

    const articleCoreData = await this.articleRepo.articleCoreGetOne({ articleId });
    if (!articleCoreData) throw new RequestError('Not Found', 404);

    const notTheAuthor = session?.id !== articleCoreData?.userId;
    if (notTheAuthor) throw new AuthenticationError('Unauthorized', 401);

    const formatOptions = {
      ...articleImageFormat,
      destinationFolder: `${session?.id}/articles`,
    };
    const richContent = new RichContent({ fileRepo: this.fileRepo, formatOptions });
    const { richContentJson, richContentHtml } = await richContent.processRichContent(contentJson);

    const articleTranslationIdCreated = await this.articleRepo.articleUpdateOne({
      articleId,
      language,
      title,
      contentHtml: richContentHtml,
      contentJson: richContentJson,
      published,
    });
    if (!articleTranslationIdCreated) throw new RequestError('Article creation failed', 409);

    const article = await this.articleGetOneUseCase.execute({ session, articleId, language });

    return article;
  }
}
