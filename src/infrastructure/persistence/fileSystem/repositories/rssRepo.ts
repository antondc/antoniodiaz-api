import fs from 'fs-extra';
import path from 'path';
import xml from 'xml';

import { IRssGetOneRequest } from '@domain/rss/repositories/interfaces/IRssGetOneRequest';
import { IRssGetOneResponse } from '@domain/rss/repositories/interfaces/IRssGetOneResponse';
import { IRssUpdateAllRequest } from '@domain/rss/repositories/interfaces/IRssUpdateAllRequest';
import { IRssUpdateAllResponse } from '@domain/rss/repositories/interfaces/IRssUpdateAllResponse';
import { IRssRepo } from '@domain/rss/repositories/IRssRepo';

export class RssRepo implements IRssRepo {
  public async rssGetOne(rssGetOneRequest: IRssGetOneRequest): Promise<IRssGetOneResponse> {
    console.log(rssGetOneRequest);
    const filePath = path.resolve(process.cwd(), 'src/infrastructure/persistence/fileSystem/data/rss/blog/all.rss');

    const rssFile = fs.readFileSync(filePath, { encoding: 'utf8' });

    return rssFile;
  }

  public async rssUpdateAll(rssUpdateAll: IRssUpdateAllRequest): Promise<IRssUpdateAllResponse> {
    const itemsSortedBNyDate = rssUpdateAll.items.sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
    const feedItems = itemsSortedBNyDate.map((item) => {
      return {
        item: [
          { title: item.title },
          {
            pubDate: new Date(item.date as string).toUTCString(),
          },
          {
            guid: [{ _attr: { isPermaLink: true } }, `YOUR-WEBSITE/${item.slug}/`],
          },
          {
            description: {
              _cdata: item.content,
            },
          },
        ],
      };
    });

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
                  href: 'YOUR-WEBSITE/feed.rss',
                  rel: 'self',
                  type: 'application/rss+xml',
                },
              },
            },
            {
              title: 'YOUR-WEBSITE-TITLE',
            },
            {
              link: 'YOUR-WEBSITE/',
            },
            { description: 'YOUR-WEBSITE-DESCRIPTION' },
            { language: 'en-US' },
            ...feedItems,
          ],
        },
      ],
    };

    const feed = '<?xml version="1.0" encoding="UTF-8"?>' + xml(feedObject);

    const filePath = path.resolve(process.cwd(), 'src/infrastructure/persistence/fileSystem/data/rss/blog/all.rss');
    await fs.writeFile(filePath, feed, 'utf8');
    const rssFile = fs.readFileSync(filePath, { encoding: 'utf8' });

    return rssFile;
  }
}
