import { IStateHealthCheckUseCase } from '@domain/state/useCases/StateHealthCheckUseCase';
import { BaseController } from './BaseController';

export class StateHealthCheckController extends BaseController {
  useCase: IStateHealthCheckUseCase;

  constructor(useCase: IStateHealthCheckUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl() {
    const response = await this.useCase.execute();

    return response;
  }
}
