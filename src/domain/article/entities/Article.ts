import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';
import { RichContentJson } from '@shared/services/RichContent';

export const articleImageFormat: IFileImageFormatOptions = {
  extension: 'jpg',
  sizes: [
    {
      height: 200,
      width: 200,
    },
    {
      height: 600,
      width: 600,
    },
    {
      height: 1200,
      width: 1200,
    },
  ],
  crop: 'center',
  destinationFolder: '',
};

export class Article {
  id: number;
  order: number;
  title: string;
  ogImage: string;
  contentJson: RichContentJson;
  contentHtml: string;
  published: string;
  userId: string;
  language: string;
  tags: Array<{
    id: number;
    text: string;
  }>;
  createdAt: Date;
  updatedAt: Date;

  constructor(articleData) {
    this.id = articleData?.id;
    this.order = articleData?.order;
    this.title = articleData?.title;
    this.ogImage = articleData?.ogImage;
    this.contentJson = articleData?.contentJson;
    this.contentHtml = articleData?.contentHtml;
    this.published = articleData?.published;
    this.userId = articleData?.userId;
    this.language = articleData?.language;
    this.tags = articleData?.tags;
    this.createdAt = articleData?.createdAt;
    this.updatedAt = articleData?.updatedAt;
  }
}
