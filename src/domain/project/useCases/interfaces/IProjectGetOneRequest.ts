import { User } from '@domain/user/entities/User';

export interface IProjectGetOneRequest {
  session: User;
  projectId: number;
  language: string;
}
