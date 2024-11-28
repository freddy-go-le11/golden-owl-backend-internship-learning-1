export const COOKIE_ACCESS_TOKEN_KEY = 'accessToken';
export const COOKIE_REFRESH_TOKEN_KEY = 'refreshToken';

export const COOKIE_DEFAULT_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export const SECOND_IN_MILL = 1000;
export const MINUTE_IN_MILL = SECOND_IN_MILL * 60;
export const HOUR_IN_MILL = MINUTE_IN_MILL * 60;
export const DAY_IN_MILL = HOUR_IN_MILL * 24;
