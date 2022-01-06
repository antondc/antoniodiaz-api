import { TextEditorContent } from '@tools/types/TextEditor';

export type IArticleGetOneResponse = {
  id: number;
  order: number;
  title: string;
  contentJson: TextEditorContent;
  contentHtml: string;
  published: string;
  userId: string;
  articleId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
};
