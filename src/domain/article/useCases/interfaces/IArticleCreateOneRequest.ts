import { User } from '@domain/user/entities/User';
import { TextEditorContent } from '@tools/types/TextEditor';

export interface IArticleCreateOneRequest {
  session: User;
  language: string;
  title: string;
  contentJson: TextEditorContent;
  contentHtml: string;
}
