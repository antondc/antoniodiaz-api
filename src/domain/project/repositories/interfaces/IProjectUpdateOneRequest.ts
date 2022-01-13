import { RichContentJson } from '@shared/services/RichContent';

export interface IProjectUpdateOneRequest {
  projectId: number;
  language: string;
  title: string;
  contentJson: RichContentJson;
  contentHtml: string;
  published: boolean;
}
