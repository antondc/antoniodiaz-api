export type RichContentText = {
  type: 'paragraph' | 'code' | 'h1' | 'h2' | 'h3' | 'ul' | 'quote';
  children: Array<unknown>;
};

export type RichContentImage = {
  type: 'image';
  image: {
    [key: string]: string;
  };
  children: Array<unknown>;
};

export type RichContentJson = Array<RichContentText | RichContentImage>;
