export class Article {
  id: number;
  order: number;
  title: string;
  content_json: string;
  content_html: string;
  published: string;
  userId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(articleData) {
    this.id = articleData?.id;
    this.order = articleData?.order;
    this.title = articleData?.title;
    this.content_json = articleData?.content_json;
    this.content_html = articleData?.content_html;
    this.published = articleData?.published;
    this.userId = articleData?.userId;
    this.language = articleData?.language;
    this.createdAt = articleData?.createdAt;
    this.updatedAt = articleData?.updatedAt;
  }
}
