import { ILanguageRepo } from '@domain/language/repositories/ILanguageRepo';
import { MySQL } from '@infrastructure/persistence/mySQL/services/MySQL';
import { BaseError } from '@shared/errors/BaseError';

export class LanguageRepo implements ILanguageRepo {
  public async languageGetOne({ slug }) {
    const mySQL = new MySQL();

    try {
      const getLanguageQuery = 'CALL language_get_one(?)';

      const [[language]] = await mySQL.query(getLanguageQuery, [slug]);

      return language;
    } catch (err) {
      throw new BaseError('Something went wrong', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async languageGetAll() {
    const mySQL = new MySQL();

    try {
      const [languages] = await mySQL.query('CALL language_get_all()');

      return languages;
    } catch (err) {
      throw new BaseError('Something went wrong', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async languageGlossaryUpdateOne({
    id,
    glossary = {
      siteTitle: null,
      siteDescription: null,
      author: null,
      who: null,
      whoContentJson: null,
      whoContentHtml: null,
      what: null,
      whatSubtitle: null,
      when: null,
      whenSubtitle: null,
      where: null,
      code: null,
      email: null,
      post: null,
      serverError: null,
      control: null,
      notFound: null,
    },
  }) {
    debugger;
    const mySQL = new MySQL();

    try {
      const {
        siteTitle,
        siteDescription,
        author,
        who,
        whoContentJson,
        whoContentHtml,
        what,
        whatSubtitle,
        when,
        whenSubtitle,
        where,
        code,
        email,
        post,
        serverError,
        control,
        notFound,
      } = glossary;
      const articleCreateQuery = 'CALL language_glossary_update_one(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [[language]] = await mySQL.query(articleCreateQuery, [
        id,
        siteTitle,
        siteDescription,
        author,
        who,
        JSON.stringify(whoContentJson),
        whoContentHtml,
        what,
        whatSubtitle,
        when,
        whenSubtitle,
        where,
        code,
        email,
        post,
        serverError,
        control,
        notFound,
      ]);

      return language;
    } catch (err) {
      throw new BaseError('Something went wrong', 500, err);
    } finally {
      await mySQL.close();
    }
  }
}
