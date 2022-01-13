import { RichContentJson } from '@shared/services/RichContent';

export type IProjectGetOneResponse = {
  id: number;
  order: number;
  title: string;
  contentJson: RichContentJson;
  contentHtml: string;
  published: string;
  userId: string;
  projectId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
};
