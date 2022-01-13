import { User } from '@domain/user/entities/User';

export interface IProjectDeleteOneRequest {
  session: User;
  language: string;
  projectId: number;
}
