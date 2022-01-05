export class Article {
  id: number;
  order: number;
  title: string;
  contentJson: string;
  contentHtml: string;
  published: string;
  userId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(articleData) {
    this.id = articleData?.id;
    this.order = articleData?.order;
    this.title = articleData?.title;
    this.contentJson = articleData?.contentJson;
    this.contentHtml = articleData?.contentHtml;
    this.published = articleData?.published;
    this.userId = articleData?.userId;
    this.language = articleData?.language;
    this.createdAt = articleData?.createdAt;
    this.updatedAt = articleData?.updatedAt;
  }
}
