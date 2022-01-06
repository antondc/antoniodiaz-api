import { articleImageFormat } from '@domain/article/entities/Article';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { IArticleCreateOneRequest } from '@domain/article/useCases/interfaces/IArticleCreateOneRequest';
import { IArticleCreateOneResponse } from '@domain/article/useCases/interfaces/IArticleCreateOneResponse';
import { FileImage } from '@domain/file/entities/FileImage';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { RequestError } from '@shared/errors/RequestError';
import { IArticleGetOneUseCase } from './ArticleGetOneUseCase';

export interface IArticleCreateOneUseCase {
  execute: (articleCreateOneRequest: IArticleCreateOneRequest) => Promise<IArticleCreateOneResponse>;
}

export class ArticleCreateOneUseCase implements IArticleCreateOneUseCase {
  private articleRepo: IArticleRepo;
  private fileRepo: IFileRepo;
  private articleGetOneUseCase: IArticleGetOneUseCase;

  constructor(articleRepo: IArticleRepo, fileRepo: IFileRepo, articleGetOneUseCase: IArticleGetOneUseCase) {
    this.articleRepo = articleRepo;
    this.fileRepo = fileRepo;
    this.articleGetOneUseCase = articleGetOneUseCase;
  }

  public async execute(articleCreateOneRequest: IArticleCreateOneRequest): Promise<IArticleCreateOneResponse> {
    const { session, language, title, contentHtml, contentJson } = articleCreateOneRequest;
    if (!title || !contentHtml || !contentJson) throw new RequestError('Unprocessable Entity', 422);

    const fileImage = new FileImage({ fileRepo: this.fileRepo });
    const contentJsonWithImagesPromises = contentJson.map(async (item) => {
      if (item.type === 'image') {
        const savedImage = await fileImage.fileImageSaveOne({ fileUrl: item.image.original, formatOptions: articleImageFormat });

        return {
          ...item,
          image: {
            original: savedImage?.path,
          },
        };
      }

      return item;
    });

    const contentJsonWithImages = await Promise.all(contentJsonWithImagesPromises);

    const articleCreated = await this.articleRepo.articleCreateOne({ sessionId: session?.id });
    if (!articleCreated?.articleId) throw new RequestError('Article creation failed', 409);

    const articleTranslationIdCreated = await this.articleRepo.articleUpdateOne({
      articleId: articleCreated?.articleId,
      language,
      title,
      contentHtml,
      contentJson: contentJsonWithImages,
      published: false,
    });
    if (!articleTranslationIdCreated) throw new RequestError('Article creation failed', 409);

    const article = await this.articleGetOneUseCase.execute({ session, articleId: articleCreated?.articleId, language });

    return article;
  }
}
