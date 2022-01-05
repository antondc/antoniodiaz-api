export type IUserGetAllRequest = {
  sessionId: string;
  sort?:
    | 'order'
    | '-order'
    | 'name'
    | '-name'
    | 'createdAt'
    | '-createdAt';
  size?: number;
  offset?: number;
  filter?: {
    name?: string;
  };
};
