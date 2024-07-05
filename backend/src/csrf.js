import { doubleCsrf } from "csrf-csrf";

const isProd = process.env.NODE_ENV === "production";
export const {
  invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
  generateToken, // Use this in your routes to provide a CSRF hash cookie and token.
  validateRequest, // Also a convenience if you plan on making your own middleware.
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf({
  getSecret: (req) => {
    console.log('Session ID:', req.session.id); // 日誌輸出session ID
    return req.session.id;
  }, // A function that optionally takes the request and returns a secret
  // The name of the cookie to be used, recommend using __Host- prefix.
  cookieName: `${isProd ? "__Host-" : ""}csrf`,
  cookieOptions: {
    httpOnly: true,
    sameSite: "none", // Recommend you make this strict if posible
    path: "/",
    secure: isProd,
  },
  size: 64, // The size of the generated tokens in bits
  ignoredMethods: ["GET", "HEAD", "OPTIONS"], // A list of request methods that will not be protected.
  getTokenFromRequest: (req) => {
    console.log('CSRF Token from request:', req.headers["x-csrf-token"]); // 日誌輸出CSRF token
    return req.headers["x-csrf-token"];
  }, // A function that returns the token from the request
});

export function csrfErrorHandler(error, req, res, next) {
  if (error == invalidCsrfTokenError) {
    res.status(403).json({
      error: "invalid csrf token",
    });
  } else {
    next();
  }
}
