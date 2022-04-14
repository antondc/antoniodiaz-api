import { articleImageFormat } from '@domain/article/entities/Article';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { IArticleCreateOneRequest } from '@domain/article/useCases/interfaces/IArticleCreateOneRequest';
import { IArticleCreateOneResponse } from '@domain/article/useCases/interfaces/IArticleCreateOneResponse';
import { FileImage } from '@domain/file/entities/FileImage';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { RequestError } from '@shared/errors/RequestError';
import { RichContent } from '@shared/services/RichContent';
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
    const { session, language, title, contentJson, ogImage } = articleCreateOneRequest;
    if (!title) throw new RequestError('Unprocessable Entity', 422);

    const formatOptions = {
      ...articleImageFormat,
      destinationFolder: `${session?.id}/articles`,
    };
    const richContent = new RichContent({ fileRepo: this.fileRepo, formatOptions });
    const { richContentJson, richContentHtml } = await richContent.processRichContent(contentJson);

    const articleCreated = await this.articleRepo.articleCreateOne({ sessionId: session?.id });
    if (!articleCreated?.articleId) throw new RequestError('Article creation failed', 409);

    const userImageEntity = new FileImage({ fileRepo: this.fileRepo });
    const savedImage = await userImageEntity.fileImageSaveOne({ fileUrl: ogImage, formatOptions: articleImageFormat });

    const articleTranslationIdCreated = await this.articleRepo.articleUpdateOne({
      articleId: articleCreated?.articleId,
      language,
      title,
      contentHtml: richContentHtml,
      contentJson: richContentJson,
      published: false,
      ogImage: savedImage?.path,
    });
    if (!articleTranslationIdCreated) throw new RequestError('Article creation failed', 409);

    const article = await this.articleGetOneUseCase.execute({ session, articleId: articleCreated?.articleId, language });

    return article;
  }
}
