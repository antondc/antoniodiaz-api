import { User } from '@domain/user/entities/User';

export type IUserLogoutResponse = {
  session: User;
};
