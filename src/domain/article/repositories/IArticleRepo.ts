import { IArticleCoreGetOneRequest } from './interfaces/IArticleCoreGetOneRequest';
import { IArticleCoreGetOneResponse } from './interfaces/IArticleCoreGetOneResponse';
import { IArticleCreateOneRequest } from './interfaces/IArticleCreateOneRequest';
import { IArticleCreateOneResponse } from './interfaces/IArticleCreateOneResponse';
import { IArticleDeleteOneRequest } from './interfaces/IArticleDeleteOneRequest';
import { IArticleDeleteOneResponse } from './interfaces/IArticleDeleteOneResponse';
import { IArticleGetAllRequest } from './interfaces/IArticleGetAllRequest';
import { IArticleGetAllResponse } from './interfaces/IArticleGetAllResponse';
import { IArticleGetOneRequest } from './interfaces/IArticleGetOneRequest';
import { IArticleGetOneResponse } from './interfaces/IArticleGetOneResponse';
import { IArticleUpdateOneRequest } from './interfaces/IArticleUpdateOneRequest';
import { IArticleUpdateOneResponse } from './interfaces/IArticleUpdateOneResponse';

export interface IArticleRepo {
  articleGetOne: (articleGetOneRequest: IArticleGetOneRequest) => Promise<IArticleGetOneResponse>;
  articleCoreGetOne: (articleCoreGetOneRequest: IArticleCoreGetOneRequest) => Promise<IArticleCoreGetOneResponse>;
  articleGetAll: (articleGetAllRequest: IArticleGetAllRequest) => Promise<IArticleGetAllResponse>;
  articleCreateOne: (articleCreateOneRequest: IArticleCreateOneRequest) => Promise<IArticleCreateOneResponse>;
  articleUpdateOne: (articleUpdateOneRequest: IArticleUpdateOneRequest) => Promise<IArticleUpdateOneResponse>;
  articleDeleteOne: (articleDeleteOneRequest: IArticleDeleteOneRequest) => Promise<IArticleDeleteOneResponse>;
}
