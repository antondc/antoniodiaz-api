import { articleImageFormat } from '@domain/article/entities/Article';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { IArticleUpdateOneRequest } from '@domain/article/useCases/interfaces/IArticleUpdateOneRequest';
import { IArticleUpdateOneResponse } from '@domain/article/useCases/interfaces/IArticleUpdateOneResponse';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { IRssUpdateAllUseCase } from '@domain/rss/useCases/RssUpdateAllUseCase';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { RequestError } from '@shared/errors/RequestError';
import { RichContent } from '@shared/services/RichContent';
import { IArticleGetAllUseCase } from './ArticleGetAllUseCase';
import { IArticleGetOneUseCase } from './ArticleGetOneUseCase';

export interface IArticleUpdateOneUseCase {
  execute: (articleUpdateOneRequest: IArticleUpdateOneRequest) => Promise<IArticleUpdateOneResponse>;
}

export class ArticleUpdateOneUseCase implements IArticleUpdateOneUseCase {
  private articleRepo: IArticleRepo;
  private fileRepo: IFileRepo;
  private articleGetAllUseCase: IArticleGetAllUseCase;
  private articleGetOneUseCase: IArticleGetOneUseCase;
  private rssUpdateAllUseCase: IRssUpdateAllUseCase;

  constructor(
    articleRepo: IArticleRepo,
    fileRepo: IFileRepo,
    articleGetAllUseCase: IArticleGetAllUseCase,
    articleGetOneUseCase: IArticleGetOneUseCase,
    rssUpdateAllUseCase: IRssUpdateAllUseCase
  ) {
    this.articleRepo = articleRepo;
    this.fileRepo = fileRepo;
    this.articleGetOneUseCase = articleGetOneUseCase;
    this.articleGetAllUseCase = articleGetAllUseCase;
    this.rssUpdateAllUseCase = rssUpdateAllUseCase;
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
    const articles = await this.articleGetAllUseCase.execute({ session, language });
    const articlesForRss = articles.articles.map((item) => ({
      title: item.title,
      date: new Date(item.createdAt).toDateString(),
      slug: item.id.toString(),
      content: item.contentHtml,
    }));

    await this.rssUpdateAllUseCase.execute({ feed: 'blog', language, items: articlesForRss });

    return article;
  }
}
