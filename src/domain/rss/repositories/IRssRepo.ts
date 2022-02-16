import { IRssGetOneRequest } from './interfaces/IRssGetOneRequest';
import { IRssGetOneResponse } from './interfaces/IRssGetOneResponse';

export interface IRssRepo {
  rssGetOne: (rssGetOneRequest: IRssGetOneRequest) => IRssGetOneResponse;
}
