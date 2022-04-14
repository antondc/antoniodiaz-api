import Jimp from 'jimp';

import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { IImageSaveOneRequest } from '@domain/file/useCases/interfaces/IFileSaveOneRequest';
import { IImageSaveOneResponse } from '@domain/file/useCases/interfaces/IFileSaveOneResponse';
import { File, FileConstructorProps } from './File';
import { FileBlobDTO } from './FileBlobDTO';

type ImageUrlSplitBySizes = {
  imageUrl: string;
  sizes: {
    height: number;
    width: number;
  }[];
};

type ImageUrlSplitBySizesReturn = {
  original: string;
  [key: string]: string;
};

export class FileImage extends File {
  fileRepo?: IFileRepo;
  fileBlob?: FileBlobDTO;

  constructor(constructorProps?: FileConstructorProps) {
    super(constructorProps);
    this.fileBlob = constructorProps?.fileBlob;
    this.fileRepo = constructorProps?.fileRepo;
  }

  async fileImageSaveOne(imageSaveOneRequest: IImageSaveOneRequest): Promise<IImageSaveOneResponse> {
    try {
      const ratio = await this.getImageProportions(imageSaveOneRequest.fileUrl);
      const image = await this.fileRepo.fileImageSaveOne(imageSaveOneRequest);

      return {
        path: image.path,
        ratio,
      };
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  setImageColorProfile = (): void => {
    return null;
  };

  getImageProportions = async (path: string): Promise<number> => {
    try {
      const image = await Jimp.read(path);
      const height = image.bitmap.height;
      const width = image.bitmap.width;
      const ratio = height / width;
      const roundedRatio = +ratio.toFixed(2); // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary

      return roundedRatio;
    } catch (error) {
      console.log(error);

      return null;
    }
  };

  getFormattedImageUrls = ({ imageUrl, sizes = [] }: ImageUrlSplitBySizes): ImageUrlSplitBySizesReturn => {
    if (!imageUrl || !imageUrl.length)
      return {
        original: null,
      };

    // Default image object
    const accumulator = {
      original: imageUrl,
    };

    // Enhance default image object with urls with sizes
    const imageUrlWithSizes = sizes.reduce(
      (acc, { width }) => ({
        ...acc,
        [`${width}w`]: imageUrl.replace('original', `${width}w`),
      }),
      accumulator
    );

    return imageUrlWithSizes;
  };
}
