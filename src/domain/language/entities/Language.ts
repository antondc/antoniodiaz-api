import { RichContent, RichContentJson } from '@shared/services/RichContent';

export type Glossary = {
  who: string;
  whoContentJson: RichContentJson;
  whoContentHtml: string;
  what: string;
  whatSubtitle: string;
  when: string;
  whenSubtitle: string;
  where: string;
  post: string;
  serverError: string;
  control: string;
  notFound: string;
};

export class Language {
  id: number;
  slug: string;
  name: string;
  isDefault: boolean;
  loading?: boolean;
  glossary: Glossary;

  constructor(options) {
    this.id = options.id;
    this.slug = options.slug;
    this.name = options.name;
    this.isDefault = options.isDefault;
    this.loading = options.loading;

    const richContent = new RichContent();
    const { richContentJson, richContentHtml } = richContent.generateHtml(options.glossary?.whoContentJson);
    this.glossary = {
      whoContentJson: richContentJson,
      whoContentHtml: richContentHtml,
      ...options.glossary,
    };
  }
}
