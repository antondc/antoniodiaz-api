import { User } from '@domain/user/entities/User';

export interface IProjectGetAllRequest {
  session: User;
  language: string;
  sort?: 'order' | '-order' | 'createdAt' | '-createdAt' | 'updatedAt' | '-updatedAt';
  size?: number;
  offset?: number;
  filter?: {
    tags?: string[];
  };
}
