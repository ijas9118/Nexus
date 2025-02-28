/**
 * @swagger
 * /followers/connections:
 *   get:
 *     summary: Get all connections of the authenticated user
 *     description: Fetches a list of all users that the authenticated user is connected with.
 *     tags:
 *       - Connections
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched connections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     format: ObjectId
 *                     example: "65d4f1c9d12e3b001fbc9a23"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "john.doe@example.com"
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /followers/pending:
 *   get:
 *     summary: Get pending connection requests
 *     description: Retrieves a list of all pending connection requests for the authenticated user.
 *     tags:
 *       - Connections
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     format: ObjectId
 *                     example: "65d4f1c9d12e3b001fbc9a23"
 *                   name:
 *                     type: string
 *                     example: "Jane Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "jane.doe@example.com"
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /followers/connect:
 *   post:
 *     summary: Send a connection request
 *     description: Allows an authenticated user to send a connection request to another user.
 *     tags:
 *       - Connections
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: ObjectId
 *                 example: "65d4f1c9d12e3b001fbc9a23"
 *     responses:
 *       200:
 *         description: Connection request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Failed to send connection request (e.g., already sent or invalid request)
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /followers/accept:
 *   post:
 *     summary: Accept a connection request
 *     description: Allows an authenticated user to accept a pending connection request.
 *     tags:
 *       - Connections
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requesterId
 *             properties:
 *               requesterId:
 *                 type: string
 *                 format: ObjectId
 *                 example: "65d4f1c9d12e3b001fbc9a23"
 *     responses:
 *       200:
 *         description: Connection request accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Failed to accept connection request (e.g., invalid request)
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /followers/has-requested:
 *   post:
 *     summary: Check if a connection request has been sent
 *     description: Checks whether the authenticated user has already sent a connection request to the specified recipient.
 *     tags:
 *       - Connections
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: ObjectId
 *                 example: "65d4f1c9d12e3b001fbc9a23"
 *     responses:
 *       200:
 *         description: Returns whether a connection request has been sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Recipient ID is required
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/connections/withdraw:
 *   post:
 *     summary: Withdraw a connection request
 *     description: Allows the authenticated user to withdraw a previously sent connection request.
 *     tags:
 *       - Connections
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: ObjectId
 *                 example: "65d4f1c9d12e3b001fbc9a23"
 *     responses:
 *       200:
 *         description: Connection request withdrawn successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Recipient ID is required or request withdrawal failed
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/connections/is-connected:
 *   post:
 *     summary: Check if two users are connected
 *     description: Determines whether the authenticated user and the specified user are connected.
 *     tags:
 *       - Connections
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId2
 *             properties:
 *               userId2:
 *                 type: string
 *                 format: ObjectId
 *                 example: "65d4f1c9d12e3b001fbc9a23"
 *     responses:
 *       200:
 *         description: Returns whether the users are connected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: User ID is required
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */
