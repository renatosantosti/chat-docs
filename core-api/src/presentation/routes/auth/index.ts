import IPasswordHashAdapter from "@/application/interfaces/adapters/password-hashing";
import { authConfig, serverConfig } from "@/config";
import AuthUserDto from "@/domain/dtos/auth/user";
import AuthController from "@/presentation/controllers/auth";
import { unauthorizedHttpError } from "@/presentation/helpers/http-helper";
import HttpStatusCode from "@/presentation/helpers/http-status";
import { InternalError, UnauthorizedError } from "@/shared/errors";
import express from "express";
import { container } from "tsyringe";

const authRouter = express.Router();

/**
 * @openapi
 * /auth/token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate a user and retrieve a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 */
authRouter.post("/auth/token", async (req, res) => {
  try {
    const controller = container.resolve(AuthController);
    const response = await controller.handler(req.body);

    if (response.statusCode !== HttpStatusCode.OK) {
      return res.status(response.statusCode).send(response);
    }

    return res.send(response);
  } catch (err: any) {
    console.error("Unknow Internal Error", {
      details: { route: "/auth/token", error: { ...err } },
    });
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send(new InternalError("Unknow Internal Error"));
  }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate a user and retrieve a token as an HttpOnly cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, token set as HttpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user's ID.
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       description: The user's full name.
 *                       example: "John Doe"
 *       400:
 *         description: Bad request, validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid input data
 *       401:
 *         description: Unauthorized, invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unknown Internal Error
 */
authRouter.post("/auth/login", async (req, res) => {
  try {
    const controller = container.resolve(AuthController);
    const response = await controller.handler(req.body);

    if (response.statusCode !== HttpStatusCode.OK) {
      return res.status(response.statusCode).send(response);
    }

    /**
     * TODO: Renato Santos - 30-04-2024 - Add token expiration time from .env file
     * Currently, the token expiration is hardcoded. Update this to fetch the value from the environment variable TOKEN_EXPIRES_IN.
     */
    const { token, userId, userFullName } = (response as any)?.data;
    if (token && userId && userFullName) {
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: serverConfig.cookieSecurity,
          sameSite: serverConfig.cookieSameSite,
          maxAge: 2 * 60 * 60 * 1000, // 2 hours
          path: "/", // Ensure cookie is available for all paths
        })
        .json({ user: { id: userId, name: userFullName } });
    }

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send(new InternalError("Unknow during login"));
  } catch (err: any) {
    console.error("Unknow Internal Error", {
      details: { route: "/auth/login", error: { ...err } },
    });
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send(new InternalError("Unknow Internal Error"));
  }
});

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logs out the user by clearing the authentication token cookie
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unknown Internal Error
 */
authRouter.post("/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: serverConfig.cookieSecurity,
    sameSite: serverConfig.cookieSameSite,
  });

  return res.status(200).json({ message: "Logged out successfully." });
});

/**
 * @openapi
 * /auth/check:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Checks if the user is authenticated and refreshes the token
 *     responses:
 *       200:
 *         description: User is authenticated, token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The user's ID.
 *                       example: "12345"
 *                     name:
 *                       type: string
 *                       description: The user's full name.
 *                       example: "John Doe"
 *       401:
 *         description: Not authenticated or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authenticated
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unknown Internal Error
 */
authRouter.get("/auth/check", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const passwordHashAdapter: IPasswordHashAdapter = container.resolve(
      "IPasswordHashAdapter",
    );
    // Verify the token
    const validToekn = passwordHashAdapter.validateToken(
      token,
      authConfig.secret,
    );

    /**
     * TODO: Renato Santos - 30-04-2024 - Add a usecase to deal with token refresh
     * Currently, the token is not renewed, only hardcoded to renew validation of httpOnly cookie.
     * We should get that valid token and renew it by new token starting from now
     */
    if (!validToekn) {
      const response = unauthorizedHttpError(new UnauthorizedError());
      return res.status(response.statusCode).send(response);
    }

    const user = await passwordHashAdapter.decodeToken<AuthUserDto>(token);
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: serverConfig.cookieSecurity,
        sameSite: serverConfig.cookieSameSite,
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
        path: "/", // Ensure cookie is available for all paths
      })
      .json({ user: { id: user?.id, name: user?.name } });
  } catch (err) {
    const response = unauthorizedHttpError(new UnauthorizedError());
    return res.status(response.statusCode).send(response);
  }
});

export default authRouter;
