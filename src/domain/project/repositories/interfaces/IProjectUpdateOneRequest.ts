import { CarouselImage } from '@shared/services/CarouselField';
import { RichContentJson } from '@shared/services/RichContent';

export interface IProjectUpdateOneRequest {
  projectId: number;
  language: string;
  title: string;
  carousel: {
    slides: Array<CarouselImage>;
  };
  contentJson: RichContentJson;
  contentHtml: string;
  published: boolean;
}
