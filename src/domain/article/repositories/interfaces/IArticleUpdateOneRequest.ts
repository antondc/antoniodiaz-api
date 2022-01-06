import { TextEditorContent } from '@shared/services/TextEditor';

export interface IArticleUpdateOneRequest {
  articleId: number;
  language: string;
  title: string;
  contentJson: TextEditorContent;
  contentHtml: string;
  published: boolean;
}
