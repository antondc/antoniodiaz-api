import { IRssRepo } from '@domain/rss/repositories/IRssRepo';
import { IRssGetOneRequest } from '@domain/rss/useCases/interfaces/IRssGetOneRequest';
import { IRssGetOneResponse } from '@domain/rss/useCases/interfaces/IRssGetOneResponse';

export interface IRssGetOneUseCase {
  execute: (getRsssRequest: IRssGetOneRequest) => Promise<IRssGetOneResponse>;
}

export class RssGetOneUseCase implements IRssGetOneUseCase {
  private rssRepo: IRssRepo;

  constructor(rssRepo: IRssRepo) {
    this.rssRepo = rssRepo;
  }

  public async execute(getRsssRequest: IRssGetOneRequest): Promise<IRssGetOneResponse> {
    const { language } = getRsssRequest;
    const response = await this.rssRepo.rssGetOne({ language });

    return response;
  }
}
