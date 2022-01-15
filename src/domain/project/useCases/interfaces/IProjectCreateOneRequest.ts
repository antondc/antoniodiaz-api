import { User } from '@domain/user/entities/User';
import { CarouselImage } from '@shared/services/CarouselField';
import { RichContentJson } from '@shared/services/RichContent';

export interface IProjectCreateOneRequest {
  session: User;
  language: string;
  title: string;
  carousel: Array<CarouselImage>;
  contentJson: RichContentJson;
}
