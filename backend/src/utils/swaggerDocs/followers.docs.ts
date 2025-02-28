/**
 * @swagger
 * /followers/follow:
 *   post:
 *     summary: Follow a user
 *     description: Allows an authenticated user to follow another user.
 *     tags:
 *       - Followers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followedId:
 *                 type: string
 *                 example: "65f123abc456def789012345"
 *             required:
 *               - followedId
 *     responses:
 *       201:
 *         description: Successfully followed the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Followed successfully"
 *       400:
 *         description: Bad request (e.g., already following or missing user ID).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Already following this user"
 *       401:
 *         description: Unauthorized (User not authenticated).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is not authenticated"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

/**
 * @swagger
 * /followers/unfollow:
 *   post:
 *     summary: Unfollow a user
 *     description: Allows an authenticated user to unfollow another user.
 *     tags:
 *       - Followers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followedId:
 *                 type: string
 *                 example: "65f123abc456def789012345"
 *             required:
 *               - followedId
 *     responses:
 *       200:
 *         description: Successfully unfollowed the user.
 *       400:
 *         description: Not following the user or missing user ID.
 *       401:
 *         description: User is not authenticated.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /followers/{userId}/followers:
 *   get:
 *     summary: Get followers of a user
 *     description: Fetches the list of followers for a given user.
 *     tags:
 *       - Followers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose followers are being retrieved.
 *     responses:
 *       200:
 *         description: Successfully fetched the list of followers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Followers fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "65f123abc456def789012345"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *       400:
 *         description: Missing or invalid user ID.
 *       401:
 *         description: User is not authenticated.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /followers/{userId}/following:
 *   get:
 *     summary: Get the list of users a user is following
 *     description: Retrieves a list of users that the specified user is following.
 *     tags:
 *       - Followers
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: The ID of the user whose following list is being retrieved.
 *     responses:
 *       200:
 *         description: Successfully fetched following list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Following list fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: ObjectId
 *                         example: "65d4f1c9d12e3b001fbc9a23"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /followers/is-following:
 *   post:
 *     summary: Check if a user is following another user
 *     description: Determines whether a specific user is following another user.
 *     tags:
 *       - Followers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followerId:
 *                 type: string
 *                 format: ObjectId
 *                 example: "65d4f1c9d12e3b001fbc9a23"
 *               followedId:
 *                 type: string
 *                 format: ObjectId
 *                 example: "65d4f1c9d12e3b001fbc9a24"
 *     responses:
 *       200:
 *         description: Successfully checked following status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFollowing:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing required query parameters
 *       401:
 *         description: Unauthorized, user must be authenticated
 *       500:
 *         description: Internal server error
 */
