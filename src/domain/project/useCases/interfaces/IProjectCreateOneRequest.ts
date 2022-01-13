import { User } from '@domain/user/entities/User';
import { RichContentJson } from '@shared/services/RichContent';

export interface IProjectCreateOneRequest {
  session: User;
  language: string;
  title: string;
  contentJson: RichContentJson;
}
