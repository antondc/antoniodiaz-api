import { IArticleGetAllUseCase } from '@domain/article/useCases/ArticleGetAllUseCase';
import { ILanguageGetOneUseCase } from '@domain/language/useCases/LanguageGetOneUseCase';
import { IXmlRssGetAllRequest } from '@domain/xml/useCases/interfaces/IXmlRssGetAllRequest';
import { IXmlRssGetAllResponse } from '@domain/xml/useCases/interfaces/IXmlRssGetAllResponse';
import { ENDPOINT_CLIENT } from '@shared/constants/env';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';
import XmlRssService from '@shared/services/XmlRssService';

export interface IXmlRssGetAllUseCase {
  execute: (getRssRequest: IXmlRssGetAllRequest) => Promise<IXmlRssGetAllResponse>;
}

export class XmlRssGetAllUseCase implements IXmlRssGetAllUseCase {
  private articleGetAllUseCase: IArticleGetAllUseCase;
  private languageGetOneUseCase: ILanguageGetOneUseCase;

  constructor(articleGetAllUseCase: IArticleGetAllUseCase, languageGetOneUseCase: ILanguageGetOneUseCase) {
    this.articleGetAllUseCase = articleGetAllUseCase;
    this.languageGetOneUseCase = languageGetOneUseCase;
  }

  public async execute(getRssRequest: IXmlRssGetAllRequest): Promise<IXmlRssGetAllResponse> {
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
    const feedUrl = `${URL_SERVER}${PATH_API_V1}/${languageRetrieved.slug}/xml/rss`;
    const rssService = new XmlRssService();
    const rssFeed = rssService.createFeed({ items: articlesForRss, language: languageRetrieved, feedUrl });

    return rssFeed;
  }
}
