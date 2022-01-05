export interface IArticleUpdateOneRequest {
  articleId: number;
  language: string;
  title: string;
  content_json: string;
  content_html: string;
}
