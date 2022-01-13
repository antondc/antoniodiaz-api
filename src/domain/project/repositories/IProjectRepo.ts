import { IProjectCoreGetOneRequest } from './interfaces/IProjectCoreGetOneRequest';
import { IProjectCoreGetOneResponse } from './interfaces/IProjectCoreGetOneResponse';
import { IProjectCreateOneRequest } from './interfaces/IProjectCreateOneRequest';
import { IProjectCreateOneResponse } from './interfaces/IProjectCreateOneResponse';
import { IProjectDeleteOneRequest } from './interfaces/IProjectDeleteOneRequest';
import { IProjectDeleteOneResponse } from './interfaces/IProjectDeleteOneResponse';
import { IProjectGetAllRequest } from './interfaces/IProjectGetAllRequest';
import { IProjectGetAllResponse } from './interfaces/IProjectGetAllResponse';
import { IProjectGetOneRequest } from './interfaces/IProjectGetOneRequest';
import { IProjectGetOneResponse } from './interfaces/IProjectGetOneResponse';
import { IProjectSortOneRequest } from './interfaces/IProjectSortOneRequest';
import { IProjectSortOneResponse } from './interfaces/IProjectSortOneResponse';
import { IProjectUpdateOneRequest } from './interfaces/IProjectUpdateOneRequest';
import { IProjectUpdateOneResponse } from './interfaces/IProjectUpdateOneResponse';

export interface IProjectRepo {
  projectGetOne: (projectGetOneRequest: IProjectGetOneRequest) => Promise<IProjectGetOneResponse>;
  projectCoreGetOne: (projectCoreGetOneRequest: IProjectCoreGetOneRequest) => Promise<IProjectCoreGetOneResponse>;
  projectGetAll: (projectGetAllRequest: IProjectGetAllRequest) => Promise<IProjectGetAllResponse>;
  projectCreateOne: (projectCreateOneRequest: IProjectCreateOneRequest) => Promise<IProjectCreateOneResponse>;
  projectUpdateOne: (projectUpdateOneRequest: IProjectUpdateOneRequest) => Promise<IProjectUpdateOneResponse>;
  projectDeleteOne: (projectDeleteOneRequest: IProjectDeleteOneRequest) => Promise<IProjectDeleteOneResponse>;
  projectSortOne: (projectSortOneRequest: IProjectSortOneRequest) => Promise<IProjectSortOneResponse>;
}
