import { FileImage } from '@domain/file/entities/FileImage';
import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';

export type CarouselImage = {
  id: number;
  order: number;
  title: string;
  image: {
    original: string;
    [key: string]: string;
  };
};

export class CarouselField {
  private fileRepo: IFileRepo;
  private formatOptions: IFileImageFormatOptions;
  private fileImage: FileImage;

  constructor(fileRepo: IFileRepo, formatOptions: IFileImageFormatOptions) {
    this.fileRepo = fileRepo;
    this.formatOptions = formatOptions;
    this.fileImage = new FileImage({ fileRepo: this.fileRepo });
  }

  async processImages(carouselImages: Array<CarouselImage>): Promise<Array<CarouselImage>> {
    if (!carouselImages) return [];

    const carouselImagesUploaded = await this.saveImagesToFileSystem(carouselImages);
    const richContentWithImageSizes = this.formatImageUrls(carouselImagesUploaded);

    return richContentWithImageSizes;
  }

  private async saveImagesToFileSystem(carouselImages: Array<CarouselImage>): Promise<Array<CarouselImage>> {
    const carouselImagesUploadPromises = carouselImages.map(async (item) => {
      const savedImage = await this.fileImage.fileImageSaveOne({
        fileUrl: item.image.original,
        formatOptions: this.formatOptions,
      });

      const resultImage: CarouselImage = {
        ...item,
        image: {
          original: savedImage?.path,
        },
      };

      return resultImage;
    });

    const carouselImagesUploaded = await Promise.all(carouselImagesUploadPromises || []);

    return carouselImagesUploaded;
  }

  private formatImageUrls(carouselImages: Array<CarouselImage>): Array<CarouselImage> {
    const richContentWithImageSizes = carouselImages.map((item) => {
      const imageFormatted = this.fileImage.getFormattedImageUrls({
        sizes: this.formatOptions?.sizes,
        imageUrl: item?.image.original,
      });

      return {
        ...item,
        image: imageFormatted,
      };
    });

    return richContentWithImageSizes;
  }
}
