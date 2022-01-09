import { Article } from '@domain/article/entities/Article';
import { IArticleRepo } from '@domain/article/repositories/IArticleRepo';
import { IArticleSortOneRequest } from '@domain/article/repositories/interfaces/IArticleSortOneRequest';
import { MySQL } from '@infrastructure/persistence/mySQL/services/MySQL';
import { RequestError } from '@shared/errors/RequestError';

export class ArticleRepo implements IArticleRepo {
  public async articleGetAll({ sessionId, language, sort, size, offset, filter }) {
    const mySQL = new MySQL();
    try {
      const articleGetAllQuery = 'CALL article_get_all(?, ?, ?, ?, ?, ?)';
      const [articles] = await mySQL.query(articleGetAllQuery, [sessionId, language, sort, size, offset, JSON.stringify(filter)]);
      const articlesWithoutTotal = articles.map((item) => ({ ...item, totalItems: undefined }));

      return {
        meta: {
          totalItems: articles[0]?.totalItems || 0,
          size,
          offset,
          sort,
        },
        articlesData: articlesWithoutTotal,
      };
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async articleGetOne({ sessionId = null, articleId = null, language }) {
    const mySQL = new MySQL();
    try {
      const articleGetOneQuery = 'CALL article_get_one(?, ?, ?)';
      const [[results]] = await mySQL.query(articleGetOneQuery, [sessionId, articleId, language]);

      return results;
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async articleCoreGetOne({ articleId = null }) {
    const mySQL = new MySQL();
    try {
      const articleGetOneQuery = 'CALL article_core_get_one(?)';
      const [[results]] = await mySQL.query(articleGetOneQuery, [articleId]);

      return results;
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async articleCreateOne({ sessionId }) {
    const mySQL = new MySQL();
    try {
      const articleCreateQuery = 'CALL article_create_one(?)';
      const [[results]] = await mySQL.query(articleCreateQuery, [sessionId]);

      return results;
    } catch (err) {
      throw new RequestError('Article creation failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async articleUpdateOne({ language, articleId = null, title, contentJson, contentHtml, published = null }) {
    const mySQL = new MySQL();
    try {
      const articleCreateQuery = 'CALL article_update_one(?, ?, ?, ?, ?, ?)';
      const [[results]] = await mySQL.query(articleCreateQuery, [language, articleId, title, JSON.stringify(contentJson), contentHtml, published]);

      return results;
    } catch (err) {
      throw new RequestError('Article translation creation failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async articleDeleteOne({ sessionId, articleId, language }) {
    const mySQL = new MySQL();
    try {
      const articleDeleteQuery = 'CALL article_delete_one(?, ?, ?)';
      const [[results]] = await mySQL.query(articleDeleteQuery, [sessionId, articleId, language]);

      return results;
    } catch (err) {
      throw new RequestError('Article update failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async articleSortOne({ sessionId, articleId, order }) {
    const mySQL = new MySQL();
    try {
      const articleDeleteQuery = 'CALL article_sort_one(?, ?, ?)';
      const [[results]] = await mySQL.query(articleDeleteQuery, [sessionId, articleId, order]);

      return results;
    } catch (err) {
      throw new RequestError('Article update failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }
}
