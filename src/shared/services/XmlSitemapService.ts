import xml from 'xml';

interface IFromObjectToRss {
  items: {
    url: string;
    date: Date;
    changeFreq: string;
    priority: number;
  }[];
}

class XmlSitemapService {
  createFeed(fromObjectToRss: IFromObjectToRss): string {
    const itemsSortedBNyDate = fromObjectToRss.items.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

    const feedItems = itemsSortedBNyDate.map((item) => ({
      url: [
        {
          loc: item.url,
        },
        { lastmod: new Date(Number(item.date) * 1000).toISOString() },
        { changefreq: item.changeFreq },
        { priority: item.priority },
      ],
    }));

    const feed =
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' +
      xml(feedItems) +
      '</urlset>';

    return feed;
  }
}

export default XmlSitemapService;
