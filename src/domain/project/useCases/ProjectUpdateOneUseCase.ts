import { File } from '@domain/file/entities/File';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { projectFileFormat, projectImageFormat } from '@domain/project/entities/Project';
import { IProjectRepo } from '@domain/project/repositories/IProjectRepo';
import { IProjectUpdateOneRequest } from '@domain/project/useCases/interfaces/IProjectUpdateOneRequest';
import { IProjectUpdateOneResponse } from '@domain/project/useCases/interfaces/IProjectUpdateOneResponse';
import { AuthenticationError } from '@shared/errors/AuthenticationError';
import { RequestError } from '@shared/errors/RequestError';
import { CarouselField } from '@shared/services/CarouselField';
import { RichContent } from '@shared/services/RichContent';
import { IProjectGetOneUseCase } from './ProjectGetOneUseCase';

export interface IProjectUpdateOneUseCase {
  execute: (projectUpdateOneRequest: IProjectUpdateOneRequest) => Promise<IProjectUpdateOneResponse>;
}

export class ProjectUpdateOneUseCase implements IProjectUpdateOneUseCase {
  private projectRepo: IProjectRepo;
  private fileRepo: IFileRepo;
  private projectGetOneUseCase: IProjectGetOneUseCase;

  constructor(projectRepo: IProjectRepo, fileRepo: IFileRepo, projectGetOneUseCase: IProjectGetOneUseCase) {
    this.projectRepo = projectRepo;
    this.fileRepo = fileRepo;
    this.projectGetOneUseCase = projectGetOneUseCase;
  }

  public async execute(projectUpdateOneRequest: IProjectUpdateOneRequest): Promise<IProjectUpdateOneResponse> {
    const { session, projectId, language, title, carousel, contentJson, published, files } = projectUpdateOneRequest;
    if (!title) throw new RequestError('Unprocessable Entity', 422);

    const projectCoreData = await this.projectRepo.projectCoreGetOne({ projectId });
    if (!projectCoreData) throw new RequestError('Not Found', 404);

    const notTheAuthor = session?.id !== projectCoreData?.userId;
    if (notTheAuthor) throw new AuthenticationError('Unauthorized', 401);

    const formatOptions = {
      ...projectImageFormat,
      destinationFolder: `${session?.id}/projects`,
    };
    const richContent = new RichContent({ fileRepo: this.fileRepo, formatOptions });
    const { richContentJson, richContentHtml } = await richContent.processRichContent(contentJson);
    const carouselField = new CarouselField(this.fileRepo, formatOptions);
    const carouselUploaded = await carouselField.processImages(carousel);

    const fileFormatOptions = {
      ...projectFileFormat,
      destinationFolder: `${session?.id}/files`,
    };
    const filesSavedPromises = files.map(async (item) => {
      const file = new File({ fileRepo: this.fileRepo });
      const savedFile = await file.fileSaveOne({ fileUrl: item.url, formatOptions: fileFormatOptions });

      return {
        url: savedFile.path,
        name: item.name,
      };
    });
    const filesSaved = await Promise.all(filesSavedPromises);
    const projectTranslationIdCreated = await this.projectRepo.projectUpdateOne({
      projectId,
      language,
      title,
      carousel: {
        slides: carouselUploaded,
      },
      contentHtml: richContentHtml,
      contentJson: richContentJson,
      files: filesSaved,
      published,
    });
    if (!projectTranslationIdCreated) throw new RequestError('Project creation failed', 409);

    const project = await this.projectGetOneUseCase.execute({ session, projectId, language });

    return project;
  }
}
