import { User } from '@domain/user/entities/User';

export type IUserGetOneRequest = {
  session?: User;
  userId?: string;
  email?: string;
  name?: string;
};
