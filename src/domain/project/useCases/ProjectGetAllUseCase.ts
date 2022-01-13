import { Project } from '@domain/project/entities/Project';
import { IProjectRepo } from '@domain/project/repositories/IProjectRepo';
import { IProjectGetAllRequest } from './interfaces/IProjectGetAllRequest';
import { IProjectGetAllResponse } from './interfaces/IProjectGetAllResponse';

export interface IProjectGetAllUseCase {
  execute: (projectGetAllRequest: IProjectGetAllRequest) => Promise<IProjectGetAllResponse>;
}

export class ProjectGetAllUseCase implements IProjectGetAllUseCase {
  private projectRepo: IProjectRepo;

  constructor(projectRepo: IProjectRepo) {
    this.projectRepo = projectRepo;
  }

  public async execute(projectGetAllRequest: IProjectGetAllRequest): Promise<IProjectGetAllResponse> {
    const { session, sort, size, offset, filter, language } = projectGetAllRequest;

    const { projectsData, meta } = await this.projectRepo.projectGetAll({ sessionId: session?.id, sort, size, offset, filter, language });

    const projects = projectsData.map((projectData) => new Project(projectData));

    return {
      projects,
      meta,
    };
  }
}
