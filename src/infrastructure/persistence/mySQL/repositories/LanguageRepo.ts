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
}
