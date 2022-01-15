import { IProjectRepo } from '@domain/project/repositories/IProjectRepo';
import { MySQL } from '@infrastructure/persistence/mySQL/services/MySQL';
import { RequestError } from '@shared/errors/RequestError';

export class ProjectRepo implements IProjectRepo {
  public async projectGetAll({ sessionId, language, sort, size, offset, filter }) {
    const mySQL = new MySQL();
    try {
      const projectGetAllQuery = 'CALL project_get_all(?, ?, ?, ?, ?, ?)';
      const [projects] = await mySQL.query(projectGetAllQuery, [sessionId, language, sort, size, offset, JSON.stringify(filter)]);
      const projectsWithoutTotal = projects.map((item) => ({ ...item, totalItems: undefined }));

      return {
        meta: {
          totalItems: projects[0]?.totalItems || 0,
          size,
          offset,
          sort,
        },
        projectsData: projectsWithoutTotal,
      };
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async projectGetOne({ sessionId = null, projectId = null, language }) {
    const mySQL = new MySQL();
    try {
      const projectGetOneQuery = 'CALL project_get_one(?, ?, ?)';
      const [[results]] = await mySQL.query(projectGetOneQuery, [sessionId, projectId, language]);

      return results;
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async projectCoreGetOne({ projectId = null }) {
    const mySQL = new MySQL();
    try {
      const projectGetOneQuery = 'CALL project_core_get_one(?)';
      const [[results]] = await mySQL.query(projectGetOneQuery, [projectId]);

      return results;
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async projectCreateOne({ sessionId }) {
    const mySQL = new MySQL();
    try {
      const projectCreateQuery = 'CALL project_create_one(?)';
      const [[results]] = await mySQL.query(projectCreateQuery, [sessionId]);

      return results;
    } catch (err) {
      throw new RequestError('Project creation failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async projectUpdateOne({ language, projectId = null, title, carousel, contentJson, contentHtml, published = null }) {
    const mySQL = new MySQL();
    try {
      const projectCreateQuery = 'CALL project_update_one(?, ?, ?, ?, ?, ?, ?)';
      const [[results]] = await mySQL.query(projectCreateQuery, [
        language,
        projectId,
        title,
        JSON.stringify(carousel),
        JSON.stringify(contentJson),
        contentHtml,
        published,
      ]);

      return results;
    } catch (err) {
      throw new RequestError('Project translation creation failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async projectDeleteOne({ sessionId, projectId, language }) {
    const mySQL = new MySQL();
    try {
      const projectDeleteQuery = 'CALL project_delete_one(?, ?, ?)';
      const [[results]] = await mySQL.query(projectDeleteQuery, [sessionId, projectId, language]);

      return results;
    } catch (err) {
      throw new RequestError('Project update failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async projectSortOne({ sessionId, projectId, order }) {
    const mySQL = new MySQL();
    try {
      const projectDeleteQuery = 'CALL project_sort_one(?, ?, ?)';
      const [[results]] = await mySQL.query(projectDeleteQuery, [sessionId, projectId, order]);

      return results;
    } catch (err) {
      throw new RequestError('Project update failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }
}
