import { User } from '@domain/user/entities/User';

export type IFileDeleteOneRequest = {
  session: User;
  path: string;
};
