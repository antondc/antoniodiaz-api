export interface IArticleUpdateOneRequest {
  articleId: number;
  language: string;
  title: string;
  contentJson: string;
  contentHtml: string;
  published: boolean;
}
