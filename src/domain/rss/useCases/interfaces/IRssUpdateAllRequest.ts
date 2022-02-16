export type IRssUpdateAllRequest = {
  feed: string;
  language: string;
  items: {
    title: string;
    date: string;
    slug: string;
    content: string;
  }[];
};
