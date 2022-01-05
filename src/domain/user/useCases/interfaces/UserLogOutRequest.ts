import { User } from '@domain/user/entities/User';

export interface IUserLogoutRequest {
  session: User;
}
