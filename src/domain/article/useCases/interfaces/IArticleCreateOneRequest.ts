import { User } from '@domain/user/entities/User';
import { TextEditorContent } from '@shared/services/TextEditor';

export interface IArticleCreateOneRequest {
  session: User;
  language: string;
  title: string;
  contentJson: TextEditorContent;
  contentHtml: string;
}
