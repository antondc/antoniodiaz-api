export type IFileImageFormatOptions = {
  extension: 'png' | 'jpg';
  sizes: {
    height: number;
    width: number;
  }[];
  crop: 'crop' | 'center';
  destinationFolder: string;
};
