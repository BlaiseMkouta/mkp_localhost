const cookiesBaseOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export const accessCookiesOptions = {
  ...cookiesBaseOptions,
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

export const refreshCookiesOptions = {
  ...cookiesBaseOptions,
  path: "/",
  maxAge: 7 * 24 * 24 * 1000,
};
