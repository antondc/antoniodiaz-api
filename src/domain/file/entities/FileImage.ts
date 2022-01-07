import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { IImageSaveOneRequest } from '@domain/file/useCases/interfaces/IFileSaveOneRequest';
import { IImageSaveOneResponse } from '@domain/file/useCases/interfaces/IFileSaveOneResponse';
import { File } from './File';

type GetFormattedImageUrlsRequest = {
  imageUrl: string;
  sizes: {
    height: number;
    width: number;
  }[];
};

type GetFormattedImageUrlsResponse = {
  [key: string]: string;
};

export class FileImage extends File {
  fileRepo?: IFileRepo;

  constructor(fileRepo?: IFileRepo) {
    super();
    this.fileRepo = fileRepo;
  }

  async fileImageSaveOne(imageSaveOneRequest: IImageSaveOneRequest): Promise<IImageSaveOneResponse> {
    const image = await this.fileRepo.fileImageSaveOne(imageSaveOneRequest);

    return image;
  }

  setImageColorProfile = (): void => {
    return null;
  };

  static getFormattedImageUrls = ({ imageUrl, sizes = [] }: GetFormattedImageUrlsRequest): GetFormattedImageUrlsResponse => {
    if (!imageUrl || !imageUrl.length) return {};

    // Default image object
    const accumulator = {
      original: imageUrl,
    };

    // Enhance default image object with urls with sizes
    const imageUrlWithSizes = sizes.reduce(
      (acc, { width, height }) => ({
        ...acc,
        [`w${width}h${height}`]: imageUrl.replace('original', `w${width}h${height}`),
      }),
      accumulator
    );

    return imageUrlWithSizes;
  };
}
