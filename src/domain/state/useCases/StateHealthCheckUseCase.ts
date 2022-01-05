import { IStateRepo } from '@domain/state/repositories/IStateRepo';

export interface IStateHealthCheckUseCase {
  execute: () => unknown;
}

export class StateHealthCheckUseCase {
  private stateRepo: IStateRepo;

  constructor(stateRepo: IStateRepo) {
    this.stateRepo = stateRepo;
  }

  public async execute() {
    const MySQL = await this.stateRepo.healthCheck();
    const Node = process.version;
    const OS = process.platform;

    return { MySQL, Node, OS };
  }
}
