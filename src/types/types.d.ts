import { Request } from 'express';

type TUserSession = {
  id: string;
  email: string;
  role: ENUM_USER_ROLE;
};

type TAuthRequest = Request & {
  auth?: TUserSession;
};
