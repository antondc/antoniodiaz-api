import { IRssRepo } from '@domain/rss/repositories/IRssRepo';
import { IRssUpdateAllRequest } from '@domain/rss/useCases/interfaces/IRssUpdateAllRequest';
import { IRssUpdateAllResponse } from '@domain/rss/useCases/interfaces/IRssUpdateAllResponse';

export interface IRssUpdateAllUseCase {
  execute: (getRsssRequest: IRssUpdateAllRequest) => Promise<IRssUpdateAllResponse>;
}

export class RssUpdateAllUseCase implements IRssUpdateAllUseCase {
  private rssRepo: IRssRepo;

  constructor(rssRepo: IRssRepo) {
    this.rssRepo = rssRepo;
  }

  public async execute(getRssRequest: IRssUpdateAllRequest): Promise<IRssUpdateAllResponse> {
    const { feed, language } = getRssRequest;

    const posts = [
      {
        title: 'Post One',
        date: '1/1/2020',
        slug: 'post-one',
        content: 'This is some content for post one.',
      },
      {
        title: 'Post Two',
        date: '1/2/2020',
        slug: 'post-two',
        content: 'This is some content for post two.',
      },
      {
        title: 'Post Three',
        date: '1/3/2020',
        slug: 'post-three',
        content: 'This is some content for post three.',
      },
      {
        title: 'Post Four',
        date: '1/4/2020',
        slug: 'post-four',
        content: 'This is some content for post four.',
      },
    ];
    const response = await this.rssRepo.rssUpdateAll({ feed, language, items: posts });

    return response;
  }
}
