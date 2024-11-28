import {
  COOKIE_DEFAULT_OPTIONS,
  DAY_IN_MILL,
  OAUTH_GOOGLE_API_URL,
} from './constants';

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

export const getUserInfoViaGoogleAccessToken = async (
  googleAccessToken: string,
) => {
  const response = await fetch(OAUTH_GOOGLE_API_URL, {
    headers: { Authorization: `Bearer ${googleAccessToken}` },
  });
  return response.json();
};
