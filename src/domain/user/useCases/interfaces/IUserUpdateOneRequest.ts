import { User } from '@domain/user/entities/User';

export interface IUserUpdateOneRequest {
  session: User;
  name: string;
  email: string;
  statement: string;
  location: string;
  image: string;
}
