import { TokenJWT } from '@antoniodcorrea/utils';
import { Request, Response } from 'express';

import { User } from '@domain/user/entities/User';
import { IUserGetByIdsUseCase } from '@domain/user/useCases/UserGetByIdsUseCase';
import { PATH_API_V1, SECRET, URL_SERVER } from '@shared/constants/env';
import { BaseController } from './BaseController';

type UserGetByIdsControllerQueryType = {
  userIds: string[];
  sort: 'order' | '-order' | 'createdAt' | '-createdAt' | 'updatedAt' | '-updatedAt';
  page: {
    size: string;
    offset: string;
  };
};

export class UserGetByIdsController extends BaseController {
  useCase: IUserGetByIdsUseCase;

  constructor(useCase: IUserGetByIdsUseCase) {
    super();

    this.useCase = useCase;
  }

  async executeImpl(req: Request, res: Response) {
    const { sort, userIds, page: { size, offset } = {} } = req.query as UserGetByIdsControllerQueryType;

    const tokenJWT = new TokenJWT(SECRET);
    const session = tokenJWT.decodeToken<User>(req.cookies.sessionToken);
    const castedSort = sort;
    const castedSize = Number(size) || null;
    const castedOffset = Number(offset) || null;

    const users = await this.useCase.execute({ session, userIds, sort: castedSort, size: castedSize, offset: castedOffset });

    const formattedUsers = users.map((item) => {
      return {
        type: 'user',
        id: item.id,
        session: {
          self: URL_SERVER + PATH_API_V1 + '/users/' + item.id,
        },
        attributes: {
          ...item,
        },
      };
    });

    const formattedResponse = {
      links: {
        self: URL_SERVER + PATH_API_V1 + '/users',
      },
      data: formattedUsers,
      included: [],
    };

    return res.status(200).send(formattedResponse);
  }
}
