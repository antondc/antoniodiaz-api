import { User } from '@domain/user/entities/User';

export interface IUserDeleteOneRequest {
  session: User;
}
