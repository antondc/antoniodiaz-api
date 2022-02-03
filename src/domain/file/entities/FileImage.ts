import Jimp from 'jimp';

import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { IImageSaveOneRequest } from '@domain/file/useCases/interfaces/IFileSaveOneRequest';
import { IImageSaveOneResponse } from '@domain/file/useCases/interfaces/IFileSaveOneResponse';
import { File, FileConstructorProps } from './File';
import { FileDTO } from './FileDTO';

type ImageUrlSplitBySizes = {
  imageUrl: string;
  sizes: {
    height: number;
    width: number;
  }[];
};

type ImageUrlSplitBySizesReturn = {
  [key: string]: string;
};

export class FileImage extends File {
  fileRepo?: IFileRepo;
  file?: FileDTO;

  constructor(constructorProps?: FileConstructorProps) {
    super(constructorProps);
    this.file = constructorProps?.file;
    this.fileRepo = constructorProps?.fileRepo;
  }

  async fileImageSaveOne(imageSaveOneRequest: IImageSaveOneRequest): Promise<IImageSaveOneResponse> {
    const ratio = await this.getImageProportions(imageSaveOneRequest.fileUrl);
    const image = await this.fileRepo.fileImageSaveOne(imageSaveOneRequest);

    return {
      path: image.path,
      ratio,
    };
  }

  setImageColorProfile = (): void => {
    return null;
  };

  getImageProportions = async (path: string): Promise<number> => {
    const image = await Jimp.read(path);
    const height = image.bitmap.height;
    const width = image.bitmap.width;
    const ratio = height / width;
    const roundedRatio = +ratio.toFixed(2); // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary

    return roundedRatio;
  };

  getFormattedImageUrls = ({ imageUrl, sizes = [] }: ImageUrlSplitBySizes): ImageUrlSplitBySizesReturn => {
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
