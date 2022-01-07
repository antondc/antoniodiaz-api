import { FileImage } from '@domain/file/entities/FileImage';
import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { URLWrapper } from '@shared/services/UrlWrapper';
import { RichContentImage, RichContentJson } from './interfaces/RichContentJson';
import { richContentDefaultValue } from './richContentDefaultValue';

export class RichContent {
  private fileRepo: IFileRepo;
  private formatOptions: IFileImageFormatOptions;

  constructor(fileRepo: IFileRepo) {
    this.fileRepo = fileRepo;
  }

  async processRichContentJson(richContentJson: RichContentJson, formatOptions: IFileImageFormatOptions): Promise<RichContentJson> {
    this.formatOptions = formatOptions;

    if (!richContentJson) return richContentDefaultValue;

    const editorContentMissingImagesFiltered = this.filterOutMissingImages(richContentJson);
    const contentJsonWithImages = await this.saveImagesToFileSystem(editorContentMissingImagesFiltered);
    const richContentJsonWithImageSizes = this.formatImageUrls(contentJsonWithImages);

    return richContentJsonWithImageSizes;
  }

  private filterOutMissingImages(richContentJson: RichContentJson): RichContentJson {
    const result = richContentJson.filter((item) => {
      const imageComponent = item.type === 'image';
      if (!imageComponent) return true;

      try {
        const imageElement = item as RichContentImage; // Cast to RichContentImage to be able to use «image» field
        const url = new URLWrapper(imageElement.image?.original);
        const path = url.getPath();

        const fileImage = new FileImage(this.fileRepo);
        const imageComponentAndImageExists = fileImage.fileGetOne({ path });

        return imageComponentAndImageExists;
      } catch {
        return false;
      }
    });

    return result;
  }

  private async saveImagesToFileSystem(richContentJson: RichContentJson): Promise<RichContentJson> {
    const contentJsonWithImagesPromises = richContentJson.map(async (item) => {
      if (item.type !== 'image') return item;

      const fileImage = new FileImage(this.fileRepo);
      const savedImage = await fileImage.fileImageSaveOne({
        fileUrl: item.image.original,
        formatOptions: this.formatOptions,
      });

      return {
        ...item,
        image: { original: savedImage?.path },
      };
    });

    const contentJsonWithImages = await Promise.all(contentJsonWithImagesPromises || []);

    return contentJsonWithImages;
  }

  private formatImageUrls(richContentJson: RichContentJson): RichContentJson {
    const richContentJsonWithImageSizes = richContentJson.map((item) => {
      if (item.type !== 'image') return item;

      const imageFormatted = FileImage.getFormattedImageUrls({
        sizes: this.formatOptions?.sizes,
        imageUrl: item?.image.original,
      });

      return {
        ...item,
        image: imageFormatted,
      };
    });

    return richContentJsonWithImageSizes;
  }
}
