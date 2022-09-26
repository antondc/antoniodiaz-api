import fs from 'fs';
import path from 'path';

import { MySQL } from '@infrastructure/persistence/mySQL/services/MySQL';
import { NetWorkError } from '@root/src/shared/errors/NetworkError';
import { RESTORE_DATA, RESTORE_MODELS, RESTORE_PROCEDURES } from '@shared/constants/env';

export class StateRepo {
  // Operation tables
  private dropAllTables: string;
  private debugMessages: string;

  // Models
  private language: string;
  private glossary: string;
  private tag: string;
  private article: string;
  private articleTranslation: string;
  private articleTag: string;
  private project: string;
  private projectTranslation: string;
  private user: string;
  private userLogins: string;

  // Procedures
  private debuggerProcedure: string;
  private languageGetOneProcedure: string;
  private languageGetAllProcedure: string;
  private languageUpdateOneProcedure: string;
  private userGetAllProcedure: string;
  private userGetByIdsProcedure: string;
  private userGetCredentialsProcedure: string;
  private userGetOneProcedure: string;
  private userCreateOneProcedure: string;
  private userCreateOneUndoProcedure: string;
  private userCreateConfirmationProcedure: string;
  private userForgotPasswordProcedure: string;
  private userUpdateOneProcedure: string;
  private userDeleteOneProcedure: string;
  private userLoginProcedure: string;
  private userLogSessionProcedure: string;
  private userResetPasswordProcedure: string;
  private articleCoreGetOneProcedure: string;
  private articleGetOneProcedure: string;
  private articleGetAllProcedure: string;
  private articleCreateOneProcedure: string;
  private articleUpdateOneProcedure: string;
  private articleDeleteOneProcedure: string;
  private articleSortOneProcedure: string;
  private projectCoreGetOneProcedure: string;
  private projectGetOneProcedure: string;
  private projectGetAllProcedure: string;
  private projectCreateOneProcedure: string;
  private projectUpdateOneProcedure: string;
  private projectDeleteOneProcedure: string;
  private projectSortOneProcedure: string;

  // Data
  private languageData: string;
  private glossaryData: string;
  private userData: string;
  private userLoginData: string;
  private tagData: string;

  constructor() {
    // Operational tables
    this.dropAllTables = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/dropAllTables.sql')).toString();
    this.debugMessages = fs.readFileSync(path.resolve(__dirname, '../sql/models/debugMessages.sql')).toString();

    // Models
    this.language = fs.readFileSync(path.resolve(__dirname, '../sql/models/language.sql')).toString();
    this.glossary = fs.readFileSync(path.resolve(__dirname, '../sql/models/glossary.sql')).toString();
    this.user = fs.readFileSync(path.resolve(__dirname, '../sql/models/user.sql')).toString();
    this.userLogins = fs.readFileSync(path.resolve(__dirname, '../sql/models/userLog.sql')).toString();
    this.tag = fs.readFileSync(path.resolve(__dirname, '../sql/models/tag.sql')).toString();
    this.article = fs.readFileSync(path.resolve(__dirname, '../sql/models/article.sql')).toString();
    this.articleTranslation = fs.readFileSync(path.resolve(__dirname, '../sql/models/article_translation.sql')).toString();
    this.articleTag = fs.readFileSync(path.resolve(__dirname, '../sql/models/article_tag.sql')).toString();
    this.project = fs.readFileSync(path.resolve(__dirname, '../sql/models/project.sql')).toString();
    this.projectTranslation = fs.readFileSync(path.resolve(__dirname, '../sql/models/project_translation.sql')).toString();

    // Stored procedures
    this.debuggerProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/debugger.sql')).toString();
    this.languageGetOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/languageGetOne.sql')).toString();
    this.languageGetAllProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/languageGetAll.sql')).toString();
    this.languageUpdateOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/languageGlossaryUpdateOne.sql')).toString();
    this.userGetAllProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userGetAll.sql')).toString();
    this.userGetByIdsProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userGetByIds.sql')).toString();
    this.userGetCredentialsProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userGetCredentials.sql')).toString();
    this.userGetOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userGetOne.sql')).toString();
    this.userCreateOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userCreateOne.sql')).toString();
    this.userCreateOneUndoProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userCreateOneUndo.sql')).toString();
    this.userCreateConfirmationProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userCreateConfirmation.sql')).toString();
    this.userForgotPasswordProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userForgotPassword.sql')).toString();
    this.userUpdateOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userUpdateOne.sql')).toString();
    this.userDeleteOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userDeleteOne.sql')).toString();
    this.userLoginProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userLogin.sql')).toString();
    this.userLogSessionProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userLogSession.sql')).toString();
    this.userResetPasswordProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/userResetPassword.sql')).toString();
    this.articleCoreGetOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/articleCoreGetOne.sql')).toString();
    this.articleGetOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/articleGetOne.sql')).toString();
    this.articleGetAllProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/articleGetAll.sql')).toString();
    this.articleCreateOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/articleCreateOne.sql')).toString();
    this.articleUpdateOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/articleUpdateOne.sql')).toString();
    this.articleDeleteOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/articleDeleteOne.sql')).toString();
    this.articleSortOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/articleSortOne.sql')).toString();
    this.projectCoreGetOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/projectCoreGetOne.sql')).toString();
    this.projectGetOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/projectGetOne.sql')).toString();
    this.projectGetAllProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/projectGetAll.sql')).toString();
    this.projectCreateOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/projectCreateOne.sql')).toString();
    this.projectUpdateOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/projectUpdateOne.sql')).toString();
    this.projectDeleteOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/projectDeleteOne.sql')).toString();
    this.projectSortOneProcedure = fs.readFileSync(path.resolve(__dirname, '../sql/storedProcedures/projectSortOne.sql')).toString();

    //  Data
    this.languageData = fs.readFileSync(path.resolve(__dirname, '../sql/data/language.sql')).toString();
    this.glossaryData = fs.readFileSync(path.resolve(__dirname, '../sql/data/glossary.sql')).toString();
    this.userData = fs.readFileSync(path.resolve(__dirname, '../sql/data/user.sql')).toString();
    this.userLoginData = fs.readFileSync(path.resolve(__dirname, '../sql/data/userLog.sql')).toString();
    this.tagData = fs.readFileSync(path.resolve(__dirname, '../sql/data/tag.sql')).toString();
  }

  public async resetContent() {
    const mySQL = new MySQL({ multipleStatements: true });

    try {
      return {
        // Drop all tables
        ...(!!RESTORE_MODELS && (await mySQL.query(this.dropAllTables))),
        ...(!!RESTORE_MODELS && (await mySQL.query(`CALL drop_all_tables()`))),

        // Create tables
        ...(!!RESTORE_MODELS && (await mySQL.query(this.debugMessages))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.language))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.glossary))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.user))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.userLogins))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.tag))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.article))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.articleTranslation))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.articleTag))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.project))),
        ...(!!RESTORE_MODELS && (await mySQL.query(this.projectTranslation))),

        // Create procedures
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.debuggerProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.languageGetOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.languageGetAllProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.languageUpdateOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userGetAllProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userGetByIdsProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userGetCredentialsProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userGetOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userCreateOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userCreateOneUndoProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userCreateConfirmationProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userForgotPasswordProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userUpdateOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userDeleteOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userLoginProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userLogSessionProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.userResetPasswordProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.articleCoreGetOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.articleGetOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.articleGetAllProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.articleCreateOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.articleUpdateOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.articleDeleteOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.articleSortOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.projectCoreGetOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.projectGetOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.projectGetAllProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.projectCreateOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.projectUpdateOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.projectDeleteOneProcedure))),
        ...(!!RESTORE_PROCEDURES && (await mySQL.query(this.projectSortOneProcedure))),

        // Insert data
        ...(!!RESTORE_DATA && (await mySQL.query(this.languageData))), // As languages are isolated we can modify them without affecting the rest of the DB
        ...(!!RESTORE_DATA && (await mySQL.query(this.glossaryData))), // As languages are isolated we can modify them without affecting the rest of the DB
        ...(!!RESTORE_DATA && (await mySQL.query(this.userData))),
        ...(!!RESTORE_DATA && (await mySQL.query(this.userLoginData))),
        ...(!!RESTORE_DATA && (await mySQL.query(this.tagData))),
      };
    } catch (err) {
      mySQL.rollback();
      throw new NetWorkError('There was a problem resetting the DB', 500, err);
    } finally {
      await mySQL.close();
    }
  }

  public async healthCheck() {
    const mySQL = new MySQL();

    const response = await mySQL.query('SELECT version() AS version, @@sql_mode AS SQLMode');
    await mySQL.close();

    return response;
  }
}
