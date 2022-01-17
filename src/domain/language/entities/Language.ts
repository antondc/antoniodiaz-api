import { RichContentJson } from '@shared/services/RichContent';

export class Language {
  id: number;
  slug: string;
  name: string;
  isDefault: boolean;
  loading?: boolean;
  glossary: {
    who: string;
    whoContentJson: RichContentJson;
    whoContentHtml: string;
    what: string;
    whatSubtitle: string;
    when: string;
    where: string;
    post: string;
    serverError: string;
    control: string;
    notFound: string;
  };

  constructor(options) {
    this.id = options.id;
    this.slug = options.slug;
    this.name = options.name;
    this.isDefault = options.isDefault;
    this.loading = options.loading;
    this.glossary = options.glossary;
  }
}
