export class ArticleTranslation {
  id: number;
  title: string;
  content_json: string;
  content_html: string;
  published: string;
  userId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(articleTranslationData) {
    this.id = articleTranslationData?.id;
    this.title = articleTranslationData?.title;
    this.content_json = articleTranslationData?.content_json;
    this.content_html = articleTranslationData?.content_html;
    this.published = articleTranslationData?.published;
    this.userId = articleTranslationData?.userId;
    this.language = articleTranslationData?.language;
    this.createdAt = articleTranslationData?.createdAt;
    this.updatedAt = articleTranslationData?.updatedAt;
  }
}
