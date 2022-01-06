import { User } from '@domain/user/entities/User';
import { TextEditorContent } from '@tools/types/TextEditor';

export interface IArticleUpdateOneRequest {
  session: User;
  articleId: number;
  language: string;
  title: string;
  contentJson: TextEditorContent;
  contentHtml: string;
  published: boolean;
}
