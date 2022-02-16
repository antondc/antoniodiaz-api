export class Rss {
  articles: {
    title: string;
    content: string;
    language: string;
  }[];

  constructor(rssData) {
    this.articles = rssData?.rssData.articles;
  }
}
