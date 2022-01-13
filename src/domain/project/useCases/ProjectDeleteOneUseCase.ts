import { IProjectRepo } from '@domain/project/repositories/IProjectRepo';
import { RequestError } from '@shared/errors/RequestError';
import { IProjectDeleteOneRequest } from './interfaces/IProjectDeleteOneRequest';
import { IProjectDeleteOneResponse } from './interfaces/IProjectDeleteOneResponse';

export interface IProjectDeleteOneUseCase {
  execute: (projectDeleteOneRequest: IProjectDeleteOneRequest) => Promise<IProjectDeleteOneResponse>;
}

export class ProjectDeleteOneUseCase implements IProjectDeleteOneUseCase {
  private projectRepo: IProjectRepo;

  constructor(projectRepo: IProjectRepo) {
    this.projectRepo = projectRepo;
  }

  public async execute(projectDeleteOneRequest: IProjectDeleteOneRequest): Promise<IProjectDeleteOneResponse> {
    const { session, projectId, language } = projectDeleteOneRequest;

    const projectData = await this.projectRepo.projectGetOne({ sessionId: session?.id, projectId, language });
    if (!projectData) throw new RequestError('Project does not exist', 404);

    const { projectId: deletedprojectId } = await this.projectRepo.projectDeleteOne({ sessionId: session?.id, projectId, language });

    return {
      projectId: deletedprojectId,
    };
  }
}
