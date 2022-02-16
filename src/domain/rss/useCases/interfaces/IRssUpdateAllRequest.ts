import { Language } from '@domain/language/entities/Language';

export type IRssUpdateAllRequest = {
  feed: string;
  language: Language;
  items: {
    title: string;
    date: string;
    slug: string;
    content: string;
    url: string;
  }[];
};
