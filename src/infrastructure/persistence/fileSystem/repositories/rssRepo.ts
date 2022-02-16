import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import xml from 'xml';

import { IRssGetOneRequest } from '@domain/rss/repositories/interfaces/IRssGetOneRequest';
import { IRssGetOneResponse } from '@domain/rss/repositories/interfaces/IRssGetOneResponse';
import { IRssUpdateAllRequest } from '@domain/rss/repositories/interfaces/IRssUpdateAllRequest';
import { IRssUpdateAllResponse } from '@domain/rss/repositories/interfaces/IRssUpdateAllResponse';
import { IRssRepo } from '@domain/rss/repositories/IRssRepo';
import { PATH_API_V1, URL_SERVER } from '@shared/constants/env';

export class RssRepo implements IRssRepo {
  public async rssGetOne(rssGetOneRequest: IRssGetOneRequest): Promise<IRssGetOneResponse> {
    console.log(rssGetOneRequest);
    const filePath = path.resolve(process.cwd(), `dist/rss/${rssGetOneRequest.feed}/${rssGetOneRequest.language}`);
    const filePathWithFile = path.join(filePath, '/feed.rss');

    const rssFile = fs.readFileSync(filePathWithFile, { encoding: 'utf8' });

    return rssFile;
  }

  public async rssUpdateAll(rssUpdateAll: IRssUpdateAllRequest): Promise<IRssUpdateAllResponse> {
    const itemsSortedBNyDate = rssUpdateAll.items.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
    const feedItems = itemsSortedBNyDate.map((item) => ({
      item: [
        { title: item.title },
        { pubDate: new Date(item.date as string).toUTCString() },
        { guid: [{ _attr: { isPermaLink: true } }, item.url] },
        { description: { _cdata: item.content } },
      ],
    }));

    const feedObject = {
      rss: [
        {
          _attr: {
            version: '2.0',
            'xmlns:atom': 'http://www.w3.org/2005/Atom',
          },
        },
        {
          channel: [
            {
              'atom:link': {
                _attr: {
                  href: `${URL_SERVER}${PATH_API_V1}/${rssUpdateAll.language.slug}/rss/${rssUpdateAll.feed}`,
                  rel: 'self',
                  type: 'application/rss+xml',
                },
              },
            },
            { title: rssUpdateAll.language.glossary.siteTitle },
            { link: URL_SERVER },
            { description: rssUpdateAll.language.glossary.siteDescription },
            { language: `${rssUpdateAll.language.slug}-${rssUpdateAll.language.slug.toUpperCase()}` },
            ...feedItems,
          ],
        },
      ],
    };

    const feed = '<?xml version="1.0" encoding="UTF-8"?>' + xml(feedObject);

    const filePath = path.resolve(process.cwd(), `dist/rss/${rssUpdateAll.feed}/${rssUpdateAll.language.slug}`);

    const filePathExists = fs.existsSync(filePath);
    if (!filePathExists) mkdirp.sync(filePath);

    const filePathWithFile = path.join(filePath, '/feed.rss');
    await fs.writeFile(filePathWithFile, feed, 'utf8');
    const rssFile = fs.readFileSync(filePathWithFile, { encoding: 'utf8' });

    return rssFile;
  }
}
