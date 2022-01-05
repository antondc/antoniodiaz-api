import { User } from '@domain/user/entities/User';

export type IUserGetByIdsRequest = {
  session: User;
  userIds: string[];
  sort?:
    | 'order'
    | '-order'
    | 'createdAt'
    | '-createdAt'
    | 'updatedAt'
    | '-updatedAt';
  size?: number;
  offset?: number;
};
