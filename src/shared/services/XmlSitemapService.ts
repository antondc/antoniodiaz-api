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
        { changeFreq: item.changeFreq },
        { priority: item.priority },
      ],
    }));

    const feed = '<?xml version="1.0" encoding="UTF-8"?><urlset>' + xml(feedItems) + '</urlset>';

    return feed;
  }
}

export default XmlSitemapService;
