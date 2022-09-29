import { User } from '@domain/user/entities/User';

export type IXmlRssGetAllRequest = {
  session: User;
  language: string;
};
