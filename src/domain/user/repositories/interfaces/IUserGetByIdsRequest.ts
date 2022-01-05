export type IUserGetByIdsRequest = {
  sessionId: string;
  userIds: string[];
  sort?:
    | 'order'
    | '-order'
    | 'createdAt'
    | '-createdAt'
    | 'updatedAt'
    | '-updatedAt';
  size?: number;
  offset?: number;
};
