import { Project } from '@domain/project/entities/Project';

export type IProjectGetAllResponse = {
  meta: {
    totalItems: number;
    offset: number;
    size: number;
    sort: string;
  };
  projectsData: Project[];
};
