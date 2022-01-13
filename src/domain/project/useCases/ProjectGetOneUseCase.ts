import { Project } from '@domain/project/entities/Project';
import { IProjectRepo } from '@domain/project/repositories/IProjectRepo';
import { RequestError } from '@shared/errors/RequestError';
import { IProjectGetOneRequest } from './interfaces/IProjectGetOneRequest';
import { IProjectGetOneResponse } from './interfaces/IProjectGetOneResponse';

export interface IProjectGetOneUseCase {
  execute: (projectGetOneRequest: IProjectGetOneRequest) => Promise<IProjectGetOneResponse>;
}

export class ProjectGetOneUseCase implements IProjectGetOneUseCase {
  private projectRepo: IProjectRepo;

  constructor(projectRepo: IProjectRepo) {
    this.projectRepo = projectRepo;
  }

  public async execute(projectGetOneRequest: IProjectGetOneRequest): Promise<IProjectGetOneResponse> {
    const { session, projectId, language } = projectGetOneRequest;
    if (!projectId || !language) throw new RequestError('Unprocessable Entity', 422);

    const projectData = await this.projectRepo.projectGetOne({ sessionId: session?.id, projectId, language });
    if (!projectData) throw new RequestError('Not Found', 404);

    const project = new Project(projectData);

    return project;
  }
}
