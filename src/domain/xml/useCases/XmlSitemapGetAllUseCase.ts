import { IArticleGetAllUseCase } from '@domain/article/useCases/ArticleGetAllUseCase';
import { ILanguageGetAllUseCase } from '@domain/language/useCases/LanguageGetAllUseCase';
import { IXmlSitemapGetAllRequest } from '@domain/xml/useCases/interfaces/IXmlSitemapGetAllRequest';
import { IXmlSitemapGetAllResponse } from '@domain/xml/useCases/interfaces/IXmlSitemapGetAllResponse';
import { ENDPOINT_CLIENT } from '@shared/constants/env';
import XmlSitemapService from '@shared/services/XmlSitemapService';

export interface IXmlSitemapGetAllUseCase {
  execute: (getRssRequest: IXmlSitemapGetAllRequest) => Promise<IXmlSitemapGetAllResponse>;
}

export class XmlSitemapGetAllUseCase implements IXmlSitemapGetAllUseCase {
  private articleGetAllUseCase: IArticleGetAllUseCase;
  private languageGetAllUseCase: ILanguageGetAllUseCase;

  constructor(articleGetAllUseCase: IArticleGetAllUseCase, languageGetAllUseCase: ILanguageGetAllUseCase) {
    this.articleGetAllUseCase = articleGetAllUseCase;
    this.languageGetAllUseCase = languageGetAllUseCase;
  }

  public async execute(getRssRequest: IXmlSitemapGetAllRequest): Promise<IXmlSitemapGetAllResponse> {
    const { session, language } = getRssRequest;
    const articles = await this.articleGetAllUseCase.execute({ session, language });

    const languages = await this.languageGetAllUseCase.execute();
    const defaultLanguage = languages.find((item) => item.isDefault);

    const slugs = languages.map((item) => item.slug);

    const home = {
      url: `${ENDPOINT_CLIENT}`,
      date: defaultLanguage.updatedAt,
      changeFreq: 'monthly',
      priority: 1,
    };

    const homeWithLanguages = languages.map((language) => {
      return {
        url: `${ENDPOINT_CLIENT}/${language.slug}`,
        date: language.updatedAt,
        changeFreq: 'monthly',
        priority: 0.8,
      };
    });

    const about = {
      url: `${ENDPOINT_CLIENT}/about`,
      date: defaultLanguage.updatedAt,
      changeFreq: 'monthly',
      priority: 0.9,
    };

    const aboutWithLanguages = languages.map((language) => {
      return {
        url: `${ENDPOINT_CLIENT}/${language.slug}/about`,
        date: language.updatedAt,
        changeFreq: 'monthly',
        priority: 0.8,
      };
    });

    const articlesForSitemapNested = articles.articles.map((item) => {
      const articlesWithSlugs = slugs.map((slug) => {
        return {
          url: `${ENDPOINT_CLIENT}/${slug}/blog/${item.id}`,
          date: item.updatedAt,
          changeFreq: 'weekly',
          priority: 0.5,
        };
      });
      const articleWithoutSlug = {
        url: `${ENDPOINT_CLIENT}/blog/${item.id}`,
        date: item.updatedAt,
        changeFreq: 'weekly',
        priority: 0.5,
      };

      return [articleWithoutSlug, ...articlesWithSlugs];
    });

    const articlesForSitemap = [].concat(...articlesForSitemapNested);

    const rssService = new XmlSitemapService();
    const rssFeed = rssService.createFeed({
      items: [home, ...homeWithLanguages, about, ...aboutWithLanguages, ...articlesForSitemap],
    });

    return rssFeed;
  }
}
