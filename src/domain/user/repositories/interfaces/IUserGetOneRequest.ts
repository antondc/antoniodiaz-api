type IUserGetOneRequestBasic = {
  sessionId?: string;
};

interface byUserId extends IUserGetOneRequestBasic {
  userId: string;
}

interface byEmailAndName extends IUserGetOneRequestBasic {
  email: string;
  name: string;
}

export type IUserGetOneRequest = byUserId | byEmailAndName;
