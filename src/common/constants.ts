export const COOKIE_ACCESS_TOKEN_KEY = 'accessToken';
export const COOKIE_REFRESH_TOKEN_KEY = 'refreshToken';

export const COOKIE_DEFAULT_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};
