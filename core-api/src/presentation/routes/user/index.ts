import CreateUserRequest from "@/application/usecases/user/create-user/create-user-request";
import UpdateUserRequest from "@/application/usecases/user/update-user/update-user-request";
import express from "express";
import CreateUserController from "@/presentation/controllers/user/create-user-controller";
import GetUserController from "@/presentation/controllers/user/get-user-controller";
import UpdateUserController from "@/presentation/controllers/user/update-user-controller";
import HttpStatusCode from "@/presentation/helpers/http-status";
import onlyWithAccessAuthMiddleware from "@/presentation/http-middlewares/only-access-auth";
import { InternalError, UnauthorizedError } from "@/shared/errors";
import { container } from "tsyringe";
const userRouters = express.Router();

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User retrieved successfully
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
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image:
 *                       type: base64
 *       400:
 *         description: Bad Request - The request is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *       401:
 *         description: Unauthorized Access - Authentication is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: "Unauthorized Access"
 *       403:
 *         description: Access Forbidden - The user does not have permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 error:
 *                   type: string
 *                   example: "Access Forbidden"
 *       404:
 *         description: Not Found - The requested resource does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Internal Server Error - An unknown error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
userRouters.get(
  "/users/:id",
  onlyWithAccessAuthMiddleware,
  async (req, res) => {
    try {
      // Resolve the use case and controller from the container
      const controller = container.resolve(
        "GetUserController",
      ) as GetUserController;

      // Validate the request parameters
      if (req?.currentUser) {
        const response = await controller.handler(req?.currentUser, {
          id: Number(req.params?.id ?? 0),
        });

        return res.status(response.statusCode).send(response);
      }

      return res
        .status(HttpStatusCode.UNAUTHORIZED)
        .send(new UnauthorizedError());
    } catch (err: any) {
      console.error("Unknown Internal Error", {
        details: { method: "GET", route: "/users/:id", error: { ...err } },
      });
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(new InternalError("Unknown Internal Error"));
    }
  },
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               repeatedPassword:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image:
 *                       type: string
 *                       format: base64
 *       400:
 *         description: Bad Request - The request is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *       401:
 *         description: Unauthorized Access - Authentication is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: "Unauthorized Access"
 *       403:
 *         description: Access Forbidden - The user does not have permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 error:
 *                   type: string
 *                   example: "Access Forbidden"
 *       404:
 *         description: Not Found - The requested resource does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Internal Server Error - An unknown error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
userRouters.put(
  "/users/:id",
  onlyWithAccessAuthMiddleware,
  async (req, res) => {
    try {
      // Resolve the use case and controller from the container
      const controller = container.resolve(
        "UpdateUserController",
      ) as UpdateUserController;

      const user: UpdateUserRequest = {
        id: Number(req.params?.id),
        name: req.body.name,
        password: req.body.password,
        repeatedPassword: req.body.repeatedPassword,
        image: req.body.image ?? undefined,
      };

      if (req?.currentUser) {
        const response = await controller.handler(req?.currentUser!, user);
        // Return the response from the handler, including status code and content
        return res.status(response.statusCode).send(response);
      }
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(new InternalError("User´token not found"));
    } catch (err: any) {
      // Handle unknown errors and log them with additional context
      console.error("Unknown Internal Error", {
        details: { method: "PUT", route: "/users/", error: { ...err } },
      });

      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(new InternalError("Unknown Internal Error"));
    }
  },
);

/**
 * @openapi
 * /users/:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               repeatedPassword:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
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
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image:
 *                       type: string
 *                       format: base64
 *       400:
 *         description: Bad Request - The request is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *       401:
 *         description: Unauthorized Access - Authentication is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: "Unauthorized Access"
 *       404:
 *         description: Not Found - The requested resource does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Internal server error - An unknown error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
userRouters.post("/users", async (req, res) => {
  try {
    // Validate required fields
    const { name, email, password, repeatedPassword } = req.body;

    if (!name || !email || !password || !repeatedPassword) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        statusCode: HttpStatusCode.BAD_REQUEST,
        error:
          "Missing required fields: name, email, password, and repeatedPassword are required",
      });
    }

    const controller = container.resolve(
      "CreateUserController",
    ) as CreateUserController;

    const user: CreateUserRequest = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      repeatedPassword: req.body.repeatedPassword,
      image: req.body.image ?? "",
    };

    const response = await controller.handler(user);

    // Return the response from the handler, including status code and content
    return res.status(response.statusCode).send(response);
  } catch (err: any) {
    // Handle unknown errors and log them with additional context
    console.error("Unknown Internal Error", {
      details: { method: "POST", route: "/users", error: { ...err } },
    });

    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send(new InternalError("Unknown Internal Error"));
  }
});

export default userRouters;
