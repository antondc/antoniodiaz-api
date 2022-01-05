export interface IArticleTranslationCreateOneRequest {
  articleId: number;
  language: string;
  title: string;
  contentJson: string;
  contentHtml: string;
}
