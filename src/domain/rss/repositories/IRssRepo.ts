import { IRssGetOneRequest } from './interfaces/IRssGetOneRequest';
import { IRssGetOneResponse } from './interfaces/IRssGetOneResponse';
import { IRssUpdateAllRequest } from './interfaces/IRssUpdateAllRequest';
import { IRssUpdateAllResponse } from './interfaces/IRssUpdateAllResponse';

export interface IRssRepo {
  rssGetOne: (rssGetOneRequest: IRssGetOneRequest) => Promise<IRssGetOneResponse>;
  rssUpdateAll: (rssUpdateAllRequest: IRssUpdateAllRequest) => Promise<IRssUpdateAllResponse>;
}
