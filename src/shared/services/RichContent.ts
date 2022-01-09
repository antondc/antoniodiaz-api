import { toHtml } from '@antoniodcorrea/components';

import { FileImage } from '@domain/file/entities/FileImage';
import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { URLWrapper } from './UrlWrapper';

type RichContentText = {
  type: 'paragraph' | 'code' | 'h1' | 'h2' | 'h3' | 'ul' | 'quote';
  children: Array<unknown>;
};

type RichContentImage = {
  type: 'image';
  image: {
    [key: string]: string;
  };
  children: Array<unknown>;
};

export type RichContentJson = Array<RichContentText | RichContentImage>;

export const richContentDefaultValue: RichContentJson = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'Edit me...',
      },
    ],
  },
];

export class RichContent {
  private fileRepo: IFileRepo;
  private formatOptions: IFileImageFormatOptions;
  private fileImage: FileImage;

  constructor(fileRepo: IFileRepo, formatOptions: IFileImageFormatOptions) {
    this.fileRepo = fileRepo;
    this.formatOptions = formatOptions;
    this.fileImage = new FileImage({ fileRepo: this.fileRepo });
  }

  async processRichContent(richContent: RichContentJson): Promise<{
    richContentJson: RichContentJson;
    richContentHtml: string;
  }> {
    if (!richContent)
      return {
        richContentJson: richContentDefaultValue,
        richContentHtml: '',
      };

    const editorContentMissingImagesFiltered = this.filterOutMissingImages(richContent);
    const contentJsonWithImages = await this.saveImagesToFileSystem(editorContentMissingImagesFiltered);
    const richContentWithImageSizes = this.formatImageUrls(contentJsonWithImages);
    const richContentAndHtmlContent = this.generateHtml(richContentWithImageSizes);

    return richContentAndHtmlContent;
  }

  private filterOutMissingImages(richContent: RichContentJson): RichContentJson {
    const result = richContent.filter((item) => {
      const imageComponent = item.type === 'image';
      if (!imageComponent) return true;

      try {
        const imageElement = item as RichContentImage; // Cast to RichContentImage to be able to use «image» field
        const url = new URLWrapper(imageElement.image?.original);
        const path = url.getPath();
        const imageComponentAndImageExists = this.fileRepo.fileGetOne({ path });

        return imageComponentAndImageExists;
      } catch {
        return false;
      }
    });

    return result;
  }

  private async saveImagesToFileSystem(richContent: RichContentJson): Promise<RichContentJson> {
    const contentJsonWithImagesPromises = richContent.map(async (item) => {
      if (item.type !== 'image') return item;

      const savedImage = await this.fileImage.fileImageSaveOne({
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

  private formatImageUrls(richContent: RichContentJson): RichContentJson {
    const richContentWithImageSizes = richContent.map((item) => {
      if (item.type !== 'image') return item;

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

  private generateHtml(richContent: RichContentJson): { richContentJson: RichContentJson; richContentHtml: string } {
    const richContentHtml = toHtml({ children: richContent, type: '' });

    return {
      richContentJson: richContent,
      richContentHtml,
    };
  }
}
