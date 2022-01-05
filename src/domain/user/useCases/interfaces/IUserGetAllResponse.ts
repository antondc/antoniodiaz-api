import { User } from '@domain/user/entities/User';

export type IUserGetAllResponse = {
  meta: {
    totalItems: number;
    offset: number;
    size: number;
    sort: string;
  };
  users: User[];
};
