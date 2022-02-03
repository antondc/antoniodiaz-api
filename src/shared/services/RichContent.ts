import { toHtml } from '@antoniodcorrea/components';
import { URLWrapper } from '@antoniodcorrea/utils';

import { FileImage } from '@domain/file/entities/FileImage';
import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';

type RichContentText = {
  type: 'paragraph' | 'code' | 'h1' | 'h2' | 'h3' | 'ul' | 'quote';
  children: Array<unknown>;
};

type RichContentImage = {
  type: 'image';
  image: {
    [key: string]: string;
  };
  ratio?: number;
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

type Options = {
  fileRepo: IFileRepo;
  formatOptions: IFileImageFormatOptions;
};

export class RichContent {
  private fileRepo: IFileRepo;
  private formatOptions: IFileImageFormatOptions;
  private fileImage: FileImage;

  constructor(options?: Options) {
    this.fileRepo = options?.fileRepo;
    this.formatOptions = options?.formatOptions;
    this.fileImage = new FileImage({ fileRepo: this.fileRepo });
  }

  async processRichContent(richContent: RichContentJson): Promise<{
    richContentJson: RichContentJson;
    richContentHtml?: string;
  }> {
    if (!richContent || !Array.isArray(richContent))
      return {
        richContentJson: richContentDefaultValue,
        richContentHtml: '',
      };

    if (!this.fileRepo) {
      const richContentAndHtmlContent = this.generateHtml(richContent);

      return richContentAndHtmlContent;
    }

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
        ratio: savedImage?.ratio,
        image: {
          original: savedImage?.path,
        },
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
        ratio: item.ratio,
      };
    });

    return richContentWithImageSizes;
  }

  generateHtml(richContent: RichContentJson): {
    richContentJson: RichContentJson;
    richContentHtml?: string;
  } {
    if (!richContent) return { richContentJson: richContent };

    const richContentHtml = toHtml({ children: richContent, type: '' });

    return {
      richContentJson: richContent,
      richContentHtml,
    };
  }
}
