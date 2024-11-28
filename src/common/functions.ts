import { COOKIE_DEFAULT_OPTIONS, DAY_IN_MILL } from './constants';

import { CookieOptions } from 'express';

export const getCookieOptions = (
  props: Omit<CookieOptions, 'expires'> & { expiresInDays: number },
) => {
  const { expiresInDays, ...rest } = props;
  const options = Object.assign(COOKIE_DEFAULT_OPTIONS, rest);
  return {
    ...options,
    expires: new Date(Date.now() + DAY_IN_MILL * expiresInDays),
  };
};
