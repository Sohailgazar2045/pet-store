/** HttpOnly cookie name for the JWT refresh token. */
export const REFRESH_COOKIE_NAME = "pasturepro_refresh_token"

/** HttpOnly cookie for access JWT (same value as JSON `accessToken`; enables middleware). */
export const ACCESS_COOKIE_NAME = "pasturepro_access_token"

export const REFRESH_COOKIE_MAX_AGE_SEC = 7 * 24 * 60 * 60

/** Access token cookie TTL (must align with JWT_ACCESS_EXPIRES_IN, default 15m). */
export const ACCESS_COOKIE_MAX_AGE_SEC = 15 * 60
