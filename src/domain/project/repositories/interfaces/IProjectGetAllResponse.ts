import { Project } from '@domain/Project/entities/Project';

export type IProjectGetAllResponse = {
  meta: {
    totalItems: number;
    offset: number;
    size: number;
    sort: string;
  };
  projectsData: Project[];
};
