import { User } from '@domain/user/entities/User';

export type IStateResetContentUseCaseRequest = {
  session: User;
};
