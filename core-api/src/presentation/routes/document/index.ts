import express from "express";
import onlyWithAccessAuthMiddleware from "@/presentation/http-middlewares/only-access-auth";
import { container } from "tsyringe";
import GetDocumentController from "@/presentation/controllers/document/get-document-controller";
import HttpStatusCode from "@/presentation/helpers/http-status";
import GetAllDocumentController from "@/presentation/controllers/document/get-all-document-controller";
import CreateDocumentController from "@/presentation/controllers/document/create-document-controller";
import DeleteDocumentController from "@/presentation/controllers/document/delete-document-controller";
import UpdateDocumentController from "@/presentation/controllers/document/update-document-controller";

import { isValidPDF } from "@/shared/utils/validateFile";
import { uploadMiddleware } from "@/presentation/http-middlewares/upload-middleware";
import { BadRequestError, InternalError } from "@/shared/errors";
import CreateDocumentRequest from "@/application/interfaces/use-cases/document/create/create-document-request";
import UpdateDocumentRequest from "@/application/interfaces/use-cases/document/update/update-document-request";

// Create route
const documentRouters = express.Router();

/**
 * @openapi
 * /documents/{id}:
 *   get:
 *     summary: Retrieves details of a document by its ID
 *     tags:
 *       - Documents
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the document to retrieve
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Document retrieved successfully
 *                 document:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     title:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     description:
 *                       type: string
 *                     content:
 *                       type: string
 *                     userId:
 *                       type: number
 *       403:
 *         description: Access forbidden - The user does not have permission to access the document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access forbidden
 *       404:
 *         description: Document not found - The document does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Document not exists!
 *       500:
 *         description: Internal server error - An unknown error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
documentRouters.get(
  "/documents/:id",
  onlyWithAccessAuthMiddleware,
  async (req, res) => {
    try {
      // Resolve the use case and controller from the container
      const controller = container.resolve(
        GetDocumentController,
      ) as GetDocumentController;

      const documentId = Number(req.params?.id ?? 0);
      const response = await controller.handler(req.currentUser!, {
        id: documentId,
      });

      return res.status(response.statusCode).send(response);
    } catch (err: any) {
      console.error("Unknown Internal Error", {
        details: { method: "GET", route: "/documents/:id", error: { ...err } },
      });
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(new InternalError("Unknown Internal Error"));
    }
  },
);

/**
 * @openapi
 * /documents:
 *   get:
 *     summary: Retrieves a list of all documents
 *     tags:
 *       - Documents
 *     responses:
 *       200:
 *         description: List of documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Documents retrieved successfully"
 *                 documents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       content:
 *                         type: string
 *                       userId:
 *                         type: number
 *       403:
 *         description: Access forbidden - The user does not have permission to access the documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access forbidden"
 *       500:
 *         description: Internal server error - An unknown error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
documentRouters.get(
  "/documents/",
  onlyWithAccessAuthMiddleware,
  async (req, res) => {
    try {
      // Resolve the use case and controller from the container
      const controller = container.resolve(
        "GetAllDocumentController",
      ) as GetAllDocumentController;

      // Fires controller handler
      const response = await controller.handler(req.currentUser!);

      return res.status(response.statusCode).send(response);
    } catch (err: any) {
      console.error("Unknow Internal Error", {
        details: { method: "GET", route: "/documents/:id", error: { ...err } },
      });
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(new InternalError("Unknow Internal Error"));
    }
  },
);

/**
 * @openapi
 * /documents:
 *   post:
 *     summary: Creates a new document
 *     tags:
 *       - Documents
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *                 format: binary
 *               userId:
 *                 type: number
 *             required:
 *               - title
 *               - description
 *               - userId
 *     responses:
 *       201:
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Document created successfully
 *                 documentId:
 *                   type: number
 *                   example: 1
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
 *       403:
 *         description: Access forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
documentRouters.post(
  "/documents/",
  [onlyWithAccessAuthMiddleware, uploadMiddleware.single("content")],
  async (req: any, res: any) => {
    try {
      // Resolve the use case and controller from the container
      const controller = container.resolve(
        "CreateDocumentController",
      ) as CreateDocumentController;

      // Catch file uploaded
      const file = req.file;
      const fileName = req.file.originalname;

      if (!file) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .send(new BadRequestError("File is required."));
      }

      const isPDF = await isValidPDF(file.buffer);
      if (!isPDF) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .send(
            new BadRequestError("Invalid file type. Only PDFs are allowed."),
          );
      }

      const base64Content = file.buffer.toString("base64");

      // Build the new document object from the request body, ensuring undefined values are handled properly
      const newDocument: CreateDocumentRequest = {
        name: fileName,
        title: req.body?.title,
        description: req.body?.description,
        content: base64Content,
        type: "application/pdf",
      };

      // Execute the controller handler and pass the new document object as part of the request
      const response = await controller.handler(req.currentUser!, newDocument);
      // Return the response from the handler, including status code and content
      return res.status(response.statusCode).send(response);
    } catch (err: any) {
      // Handle unknown errors and log them with additional context
      console.error("Unknown Internal Error", {
        details: { method: "POST", route: "/documents/", error: { ...err } },
      });

      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(new InternalError("Unknown Internal Error"));
    }
  },
);

/**
 * @openapi
 * /documents/{id}:
 *   delete:
 *     summary: Deletes a document by its ID
 *     tags:
 *       - Documents
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the document to delete
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Document deleted successfully
 *                 response:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: Access forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access forbidden
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Document not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
documentRouters.delete(
  "/documents/:id",
  onlyWithAccessAuthMiddleware,
  async (req, res) => {
    try {
      console.log("DELETE /documents/:id - Params:", req.params);
      console.log("DELETE /documents/:id - Current User:", req.currentUser);
      console.log("DELETE /documents/:id - Parsed ID:", Number(req.params.id));

      // Resolve the use case and controller from the container
      const controller = container.resolve(
        "DeleteDocumentController",
      ) as DeleteDocumentController;

      // Execute the controller handler and pass the new document object as part of the request
      const response = await controller.handler(req.currentUser!, {
        id: Number(req.params.id),
      });

      // Return the response from the handler, including status code and content
      return res.status(response.statusCode).send(response);
    } catch (err: any) {
      // Handle unknown errors and log them with additional context
      console.error("Unknown Internal Error", {
        details: { method: "DELETE", route: "/documents/", error: { ...err } },
      });

      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(new InternalError("Unknown Internal Error"));
    }
  },
);

/**
 * @openapi
 * /documents/{id}:
 *   put:
 *     summary: Updates an existing document by its ID
 *     tags:
 *       - Documents
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *                 format: binary
 *               userId:
 *                 type: number
 *             required:
 *               - title
 *               - description
 *               - userId
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the document to update
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Document updated successfully
 *                 document:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     title:
 *                       type: string
 *                     isActive:
 *                       type: boolean
 *                     description:
 *                       type: string
 *                     content:
 *                       type: string
 *                     userId:
 *                       type: number
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
 *       403:
 *         description: Access forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
documentRouters.put(
  "/documents/:id",
  onlyWithAccessAuthMiddleware,
  async (req, res) => {
    try {
      // Resolve the use case and controller from the container
      const controller = container.resolve(
        "UpdateDocumentController",
      ) as UpdateDocumentController;

      // Create request to be passed to controller
      const document: UpdateDocumentRequest = {
        id: Number(req.params.id),
        title: req.body?.title,
        description: req.body?.description,
        userId: req.currentUser?.id!,
      };

      const response = await controller.handler(req.currentUser!, document);

      // Return the response from the handler, including status code and content
      return res.status(response.statusCode).send(response);
    } catch (err: any) {
      // Handle unknown errors and log them with additional context
      console.error("Unknown Internal Error", {
        details: { method: "PUT", route: "/documents/", error: { ...err } },
      });

      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send(new InternalError("Unknown Internal Error"));
    }
  },
);

export default documentRouters;
