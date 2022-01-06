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
    original: string;
    [key: string]: string;
  };
  children: Array<unknown>;
};

export type TextEditorContent = Array<TextEditorText | TextEditorImage>;

export class TextEditor {
  fileRepo: IFileRepo;
  formatOptions: IFileImageFormatOptions;
  fileImage: FileImage;

  constructor(fileRepo: IFileRepo, formatOptions: IFileImageFormatOptions) {
    this.fileRepo = fileRepo;
    this.formatOptions = formatOptions;
    this.fileImage = new FileImage({ fileRepo: this.fileRepo });
  }

  filterOutMissingImages(textEditorContent): TextEditorContent {
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

  async saveImages(textEditorContent: TextEditorContent): Promise<TextEditorContent> {
    const editorContentMissingImagesFiltered = this.filterOutMissingImages(textEditorContent);

    const contentJsonWithImagesPromises = editorContentMissingImagesFiltered.map(async (item) => {
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
}
