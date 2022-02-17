import xml from 'xml';

import { Language } from '@domain/language/entities/Language';
import { URL_SERVER } from '@shared/constants/env';

interface IFromObjectToRss {
  language: Language;
  feedUrl: string;
  items: {
    title: string;
    date: string;
    slug: string;
    content: string;
    url: string;
  }[];
}

class RssService {
  createFeed(fromObjectToRss: IFromObjectToRss): string {
    const itemsSortedBNyDate = fromObjectToRss.items.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

    const feedItems = itemsSortedBNyDate.map((item) => ({
      item: [
        { title: item.title },
        { pubDate: new Date(item.date as string).toUTCString() },
        { guid: [{ _attr: { isPermaLink: true } }, item.url] },
        { description: { _cdata: item.content } },
      ],
    }));

    const feedObject = {
      rss: [
        {
          _attr: {
            version: '2.0',
            'xmlns:atom': 'http://www.w3.org/2005/Atom',
          },
        },
        {
          channel: [
            {
              'atom:link': {
                _attr: {
                  href: fromObjectToRss.feedUrl,
                  rel: 'self',
                  type: 'application/rss+xml',
                },
              },
            },
            { title: fromObjectToRss.language.glossary.siteTitle },
            { link: URL_SERVER },
            { description: fromObjectToRss.language.glossary.siteDescription },
            { language: `${fromObjectToRss.language.slug}-${fromObjectToRss.language.slug.toUpperCase()}` },
            ...feedItems,
          ],
        },
      ],
    };

    const feed = '<?xml version="1.0" encoding="UTF-8"?>' + xml(feedObject);

    return feed;
  }
}

export default RssService;
