import express, { NextFunction, Request, Response } from 'express';

import { StateHealthCheckUseCase } from '@domain/state/useCases/StateHealthCheckUseCase';
import { StateResetContentUseCase } from '@domain/state/useCases/StateResetContentUseCase';
import { StateHealthCheckController } from '@infrastructure/http/controllers/StateHealthCheckController';
import { StateResetContentController } from '@infrastructure/http/controllers/StateResetContentController';
import { StateRepo } from '@infrastructure/persistence/mySQL/repositories/StateRepo';

const StateRoute = express.Router({ mergeParams: true });

StateRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const stateRepo = new StateRepo();
  const stateHealthCheckUseCase = new StateHealthCheckUseCase(stateRepo);
  const stateHealthCheckController = new StateHealthCheckController(stateHealthCheckUseCase);

  const response = await stateHealthCheckController.execute(req, res, next);

  return res.status(200).send(response);
});

StateRoute.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  const stateRepo = new StateRepo();
  const stateResetContentUseCase = new StateResetContentUseCase(stateRepo);
  const stateResetContentController = new StateResetContentController(stateResetContentUseCase);

  const response = await stateResetContentController.execute(req, res, next);

  return response;
});

export { StateRoute };
