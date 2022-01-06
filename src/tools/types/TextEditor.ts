export type TextEditorText = {
  type: 'paragraph' | 'code' | 'h1' | 'h2' | 'h3' | 'ul' | 'quote';
  children: Array<unknown>;
};

export type TextEditorImage = {
  type: 'image';
  image: {
    original: string;
    [key: string]: string;
  };
  children: Array<unknown>;
};

export type TextEditorContent = Array<TextEditorText | TextEditorImage>;
