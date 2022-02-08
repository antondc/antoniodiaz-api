import { IFileFormatOptions } from '@domain/file/entities/interfaces/IFileFormatOptions';
import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';
import { RichContentJson } from '@shared/services/RichContent';

export const projectImageFormat: IFileImageFormatOptions = {
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

export const projectFileFormat: IFileFormatOptions = {
  extension: '.pdf',
  destinationFolder: '',
};

export class Project {
  id: number;
  order: number;
  title: string;
  carousel: Record<string, unknown>;
  contentJson: RichContentJson;
  contentHtml: string;
  files: {
    url: string;
    name: string;
  };
  published: string;
  userId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(projectData) {
    this.id = projectData?.id;
    this.order = projectData?.order;
    this.title = projectData?.title;
    this.carousel = projectData?.carousel?.slides;
    this.contentJson = projectData?.contentJson;
    this.contentHtml = projectData?.contentHtml;
    this.files = projectData?.files;
    this.published = projectData?.published;
    this.userId = projectData?.userId;
    this.language = projectData?.language;
    this.createdAt = projectData?.createdAt;
    this.updatedAt = projectData?.updatedAt;
  }
}
