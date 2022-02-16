import fs from 'fs';
import path from 'path';

import { IRssGetOneRequest } from '@domain/rss/repositories/interfaces/IRssGetOneRequest';
import { IRssGetOneResponse } from '@domain/rss/repositories/interfaces/IRssGetOneResponse';
import { IRssRepo } from '@domain/rss/repositories/IRssRepo';

export class RssRepo implements IRssRepo {
  public rssGetOne(rswGetOneRequest: IRssGetOneRequest): IRssGetOneResponse {
    console.log(rswGetOneRequest);
    const rssFile = fs.readFileSync(path.resolve(process.cwd(), 'src/infrastructure/persistence/fileSystem/data/rssAll.xml'), { encoding: 'utf8' });

    return rssFile;
  }
}
