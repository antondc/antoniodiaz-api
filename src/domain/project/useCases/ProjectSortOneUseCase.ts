import { mockApiCall } from '@antoniodcorrea/utils';

import { Project } from '@domain/project/entities/Project';
import { IProjectRepo } from '@domain/project/repositories/IProjectRepo';
import { RequestError } from '@shared/errors/RequestError';
import { IProjectSortOneRequest } from './interfaces/IProjectSortOneRequest';
import { IProjectSortOneResponse } from './interfaces/IProjectSortOneResponse';
import { IProjectGetOneUseCase } from './ProjectGetOneUseCase';
mockApiCall;
export interface IProjectSortOneUseCase {
  execute: (projectSortOneRequest: IProjectSortOneRequest) => Promise<IProjectSortOneResponse>;
}

export class ProjectSortOneUseCase implements IProjectSortOneUseCase {
  private projectRepo: IProjectRepo;
  private projectGetOneUseCase: IProjectGetOneUseCase;

  constructor(projectRepo: IProjectRepo, projectGetOneUseCase: IProjectGetOneUseCase) {
    this.projectRepo = projectRepo;
    this.projectGetOneUseCase = projectGetOneUseCase;
  }

  public async execute(projectSortOneRequest: IProjectSortOneRequest): Promise<IProjectSortOneResponse> {
    const { session, projectId, order, language } = projectSortOneRequest;
    if (!projectId || (!order && order !== 0)) throw new RequestError('Unprocessable Entity', 422);

    const response = await this.projectRepo.projectSortOne({
      sessionId: session?.id,
      projectId,
      order,
    });

    if (!projectId) throw new RequestError('Not Found', 404);

    const projectData = await this.projectGetOneUseCase.execute({ session, projectId: response?.id, language });

    const project = new Project(projectData);

    return project;
  }
}
