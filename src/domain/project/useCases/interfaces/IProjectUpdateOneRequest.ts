import { User } from '@domain/user/entities/User';
import { RichContentJson } from '@shared/services/RichContent';

export interface IProjectUpdateOneRequest {
  session: User;
  projectId: number;
  language: string;
  title: string;
  contentJson: RichContentJson;
  published: boolean;
}
