import { IArticleGetAllUseCase } from '@domain/article/useCases/ArticleGetAllUseCase';
import { ILanguageGetOneUseCase } from '@domain/language/useCases/LanguageGetOneUseCase';
import { IRssBlogGetAllRequest } from '@domain/rss/useCases/interfaces/IRssBlogGetAllRequest';
import { IRssBlogGetAllResponse } from '@domain/rss/useCases/interfaces/IRssBlogGetAllResponse';
import { ENDPOINT_CLIENT } from '@shared/constants/env';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import RssService from '@shared/services/RssService';

export interface IRssBlogGetAllUseCase {
  execute: (getRssRequest: IRssBlogGetAllRequest) => Promise<IRssBlogGetAllResponse>;
}

export class RssBlogGetAllUseCase implements IRssBlogGetAllUseCase {
  private articleGetAllUseCase: IArticleGetAllUseCase;
  private languageGetOneUseCase: ILanguageGetOneUseCase;

  constructor(articleGetAllUseCase: IArticleGetAllUseCase, languageGetOneUseCase: ILanguageGetOneUseCase) {
    this.articleGetAllUseCase = articleGetAllUseCase;
    this.languageGetOneUseCase = languageGetOneUseCase;
  }

  public async execute(getRssRequest: IRssBlogGetAllRequest): Promise<IRssBlogGetAllResponse> {
    const { session, language } = getRssRequest;
    const articles = await this.articleGetAllUseCase.execute({ session, language });

    const languageRetrieved = await this.languageGetOneUseCase.execute({ slug: language });

    const articlesForRss = articles.articles.map((item) => ({
      title: item.title,
      date: new Date(item.createdAt).toDateString(),
      slug: item.id.toString(),
      content: item.contentHtml,
      url: `${ENDPOINT_CLIENT}/${language}/when/${item.id}`,
    }));
    const feedUrl = `${URL_SERVER}${PATH_API_V1}/${languageRetrieved.slug}/rss/blog`;
    const rssService = new RssService();
    const rssFeed = rssService.createFeed({ items: articlesForRss, language: languageRetrieved, feedUrl });

    return rssFeed;
  }
}
