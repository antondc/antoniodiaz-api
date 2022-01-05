import { IUserRepo } from '@domain/user/repositories/IUserRepo';
import { MySQL } from '@infrastructure/persistence/mySQL/services/MySQL';
import { BaseError } from '@shared/errors/BaseError';
import { RequestError } from '@shared/errors/RequestError';

export class UserRepo implements IUserRepo {
  public async userGetCredentials({ userId }) {
    const mySQL = new MySQL();
    try {
      const userGetAllQuery = 'CALL user_get_credentials(?)';
      const [[userCredentials]] = await mySQL.query(userGetAllQuery, [userId]);

      return userCredentials;
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }
  public async userGetAll({ sessionId, sort, size, offset, filter }) {
    const mySQL = new MySQL();
    try {
      const userGetAllQuery = 'CALL user_get_all(?, ?, ?, ?, ?)';
      const [users] = await mySQL.query(userGetAllQuery, [sessionId, sort, size, offset, JSON.stringify(filter)]);
      const usersWithoutTotal = users.map((item) => ({ ...item, totalItems: undefined }));

      return {
        meta: {
          totalItems: users[0]?.totalItems || 0,
          size,
          offset,
          sort,
        },
        usersData: usersWithoutTotal,
      };
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userGetByIds({ sessionId, userIds, sort, size, offset }) {
    const mySQL = new MySQL();
    try {
      const userGetByIdsQuery = 'CALL user_get_by_ids(?, ?, ?, ?, ?)';
      const [usersData] = await mySQL.query(userGetByIdsQuery, [sessionId, JSON.stringify(userIds), sort, size, offset]);
      const usersWithoutTotal = usersData.map((item) => ({ ...item, totalItems: undefined }));

      return {
        meta: {
          totalItems: usersData[0]?.totalItems || 0,
          size,
          offset,
          sort,
        },
        usersData: usersWithoutTotal,
      };
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userGetOne({ sessionId = null, userId = null, email = null, name = null }) {
    const mySQL = new MySQL();
    try {
      const userGetOneQuery = 'CALL user_get_one(?, ?, ?, ?)';
      const [[results]] = await mySQL.query(userGetOneQuery, [sessionId, userId, email, name]);

      return results;
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userCreateOne({ name, email, password, image, token }) {
    const mySQL = new MySQL();
    try {
      const userCreateQuery = 'CALL user_create(?, ?, ?, ?, ?)';
      const [[results]] = await mySQL.query(userCreateQuery, [name, email, password, image, token]);

      return results;
    } catch (err) {
      throw new RequestError('User creation failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userCreateOneUndo({ userId }) {
    const mySQL = new MySQL();
    try {
      const userCreateQuery = 'CALL user_create_one_undo(?)';
      const [[results]] = await mySQL.query(userCreateQuery, [userId]);

      return results;
    } catch (err) {
      throw new RequestError('User creation undo failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userCreateConfirmation({ token }) {
    const mySQL = new MySQL();
    try {
      const userCreateQuery = 'CALL user_create_confirmation(?)';
      const [[results]] = await mySQL.query(userCreateQuery, [token]);

      return results;
    } catch (err) {
      throw new RequestError('User creation failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userUpdateOne({ userId, name, email, image, statement, location }) {
    const mySQL = new MySQL();
    try {
      const userUpdateQuery = 'CALL user_update(?, ?, ?, ?, ?, ?)';
      const [[results]] = await mySQL.query(userUpdateQuery, [userId, name, email, image, statement, location]);

      return results;
    } catch (err) {
      throw new RequestError('User update failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userDeleteOne({ userId }) {
    const mySQL = new MySQL();
    try {
      const userDeleteQuery = 'CALL user_delete_one(?)';
      const [[results]] = await mySQL.query(userDeleteQuery, [userId]);

      return results;
    } catch (err) {
      throw new RequestError('User update failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userLogin({ nameOrEmail, password, userId = null }) {
    const mySQL = new MySQL();
    try {
      const userLoginQuery = 'CALL user_login(?, ?, ?)';

      const [[user]] = await mySQL.query(userLoginQuery, [nameOrEmail, password, userId]);

      return user;
    } catch (err) {
      throw new RequestError('Something failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userLogSession({ userId, result, type }) {
    const mySQL = new MySQL();
    try {
      const logSessionQuery = 'CALL user_log_session(?, ?, ?)';

      await mySQL.query(logSessionQuery, [userId, result, type]);

      return null;
    } catch (err) {
      throw new BaseError('Error loging user session', 401, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userResetPassword({ name, token, newPassword }) {
    const mySQL = new MySQL();
    try {
      const userResetPasswordQuery = 'CALL user_reset_password(?, ?, ?)';
      const [[results]] = await mySQL.query(userResetPasswordQuery, [name, token, newPassword]);

      return results;
    } catch (err) {
      throw new RequestError('User update failed', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async userForgotPassword({ userId, token }) {
    const mySQL = new MySQL();

    try {
      const userForgotPasswordQuery = 'CALL user_forgot_password(?, ?)';

      const [[results]] = await mySQL.query(userForgotPasswordQuery, [userId, token]);

      return results;
    } catch (err) {
      throw new BaseError('Something went wrong', 500, err);
    } finally {
      await mySQL.close();
    }
  }
}
