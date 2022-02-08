import { User } from '@domain/user/entities/User';
import { CarouselImage } from '@shared/services/CarouselField';
import { RichContentJson } from '@shared/services/RichContent';

export interface IProjectUpdateOneRequest {
  session: User;
  carousel: Array<CarouselImage>;
  projectId: number;
  language: string;
  title: string;
  contentJson: RichContentJson;
  published: boolean;
  files: {
    name: string;
    url: string;
  }[];
}
