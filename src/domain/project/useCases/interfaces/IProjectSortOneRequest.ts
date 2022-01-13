import { User } from '@domain/user/entities/User';

export interface IProjectSortOneRequest {
  session: User;
  language: string;
  projectId: number;
  order: number;
}
