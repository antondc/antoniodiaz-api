import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { projectImageFormat } from '@domain/project/entities/Project';
import { IProjectRepo } from '@domain/project/repositories/IProjectRepo';
import { IProjectCreateOneRequest } from '@domain/project/useCases/interfaces/IProjectCreateOneRequest';
import { IProjectCreateOneResponse } from '@domain/project/useCases/interfaces/IProjectCreateOneResponse';
import { RequestError } from '@shared/errors/RequestError';
import { CarouselField } from '@shared/services/CarouselField';
import { RichContent } from '@shared/services/RichContent';
import { IProjectGetOneUseCase } from './ProjectGetOneUseCase';

export interface IProjectCreateOneUseCase {
  execute: (projectCreateOneRequest: IProjectCreateOneRequest) => Promise<IProjectCreateOneResponse>;
}

export class ProjectCreateOneUseCase implements IProjectCreateOneUseCase {
  private projectRepo: IProjectRepo;
  private fileRepo: IFileRepo;
  private projectGetOneUseCase: IProjectGetOneUseCase;

  constructor(projectRepo: IProjectRepo, fileRepo: IFileRepo, projectGetOneUseCase: IProjectGetOneUseCase) {
    this.projectRepo = projectRepo;
    this.fileRepo = fileRepo;
    this.projectGetOneUseCase = projectGetOneUseCase;
  }

  public async execute(projectCreateOneRequest: IProjectCreateOneRequest): Promise<IProjectCreateOneResponse> {
    const { session, language, title, carousel, contentJson } = projectCreateOneRequest;
    if (!title) throw new RequestError('Unprocessable Entity', 422);

    const formatOptions = {
      ...projectImageFormat,
      destinationFolder: `${session?.id}/projects`,
    };
    const richContent = new RichContent({ fileRepo: this.fileRepo, formatOptions });
    const { richContentJson, richContentHtml } = await richContent.processRichContent(contentJson);
    const carouselField = new CarouselField(this.fileRepo, formatOptions);
    const carouselUploaded = await carouselField.processImages(carousel);
    const projectCreated = await this.projectRepo.projectCreateOne({ sessionId: session?.id });
    if (!projectCreated?.projectId) throw new RequestError('Project creation failed', 409);

    const projectTranslationIdCreated = await this.projectRepo.projectUpdateOne({
      projectId: projectCreated?.projectId,
      language,
      title,
      carousel: {
        slides: carouselUploaded,
      },
      contentHtml: richContentHtml,
      contentJson: richContentJson,
      files: [],
      published: false,
    });
    if (!projectTranslationIdCreated) throw new RequestError('Project creation failed', 409);

    const project = await this.projectGetOneUseCase.execute({ session, projectId: projectCreated?.projectId, language });

    return project;
  }
}
