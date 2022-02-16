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
    const { feed, language, items } = getRssRequest;

    const response = await this.rssRepo.rssUpdateAll({ feed, language, items });

    return response;
  }
}
