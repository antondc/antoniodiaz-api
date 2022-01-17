import { RichContentJson } from '@shared/services/RichContent';

export interface ILanguageGlossaryUpdateOneRequest {
  id: number;
  who: string;
  whoContentJson: RichContentJson;
  whoContentHtml: string;
}
