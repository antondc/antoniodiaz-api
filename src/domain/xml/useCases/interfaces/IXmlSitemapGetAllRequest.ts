import { User } from '@domain/user/entities/User';

export type IXmlSitemapGetAllRequest = {
  session: User;
  language: string;
};
