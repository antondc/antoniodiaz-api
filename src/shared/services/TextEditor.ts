import { FileImage } from '@domain/file/entities/FileImage';
import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';
import { IFileRepo } from '@domain/file/repositories/IFileRepo';
import { URLWrapper } from './UrlWrapper';

type TextEditorText = {
  type: 'paragraph' | 'code' | 'h1' | 'h2' | 'h3' | 'ul' | 'quote';
  children: Array<unknown>;
};

type TextEditorImage = {
  type: 'image';
  image: {
    [key: string]: string;
  };
  children: Array<unknown>;
};

export type TextEditorContent = Array<TextEditorText | TextEditorImage>;

export const textEditorDefaultValue: TextEditorContent = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'Edit me...',
      },
    ],
  },
];

export class TextEditor {
  private fileRepo: IFileRepo;
  private formatOptions: IFileImageFormatOptions;
  private fileImage: FileImage;

  constructor(fileRepo: IFileRepo, formatOptions: IFileImageFormatOptions) {
    this.fileRepo = fileRepo;
    this.formatOptions = formatOptions;
    this.fileImage = new FileImage({ fileRepo: this.fileRepo });
  }

  async processTextEditorContent(textEditorContent: TextEditorContent): Promise<TextEditorContent> {
    if (!textEditorContent) return textEditorDefaultValue;

    const editorContentMissingImagesFiltered = this.filterOutMissingImages(textEditorContent);
    const contentJsonWithImages = await this.saveImagesToFileSystem(editorContentMissingImagesFiltered);
    const textEditorContentWithImageSizes = this.formatImageUrls(contentJsonWithImages);

    return textEditorContentWithImageSizes;
  }

  private filterOutMissingImages(textEditorContent: TextEditorContent): TextEditorContent {
    const result = textEditorContent.filter((item) => {
      const imageComponent = item.type === 'image';
      if (!imageComponent) return true;

      try {
        const imageElement = item as TextEditorImage; // Cast to TextEditorImage to be able to use «image» field
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

  private async saveImagesToFileSystem(textEditorContent: TextEditorContent): Promise<TextEditorContent> {
    const contentJsonWithImagesPromises = textEditorContent.map(async (item) => {
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

  private formatImageUrls(textEditorContent: TextEditorContent): TextEditorContent {
    const textEditorContentWithImageSizes = textEditorContent.map((item) => {
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

    return textEditorContentWithImageSizes;
  }
}
