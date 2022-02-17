import { User } from '@domain/user/entities/User';

export type IRssBlogGetAllRequest = {
  session: User;
  language: string;
};
