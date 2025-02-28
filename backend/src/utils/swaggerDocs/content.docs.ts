/**
 * @swagger
 * /content/posts:
 *   post:
 *     summary: Create new content
 *     description: Allows an authenticated user to create new content.
 *     tags:
 *       - Content
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the content
 *                 example: "Understanding JavaScript Closures"
 *               body:
 *                 type: string
 *                 description: Main content body
 *                 example: "Closures are a fundamental concept in JavaScript..."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the content
 *                 example: ["JavaScript", "Programming", "Web Development"]
 *     responses:
 *       201:
 *         description: Content successfully created
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
 *                   example: "Content created successfully"
 *                 contentId:
 *                   type: string
 *                   description: The ID of the created content
 *                   example: "65f3a1b2c9e4d67890abcd12"
 *       400:
 *         description: Bad request, invalid input data
 *       401:
 *         description: Unauthorized, user authentication required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /content/posts/{id}:
 *   get:
 *     summary: Get content by ID
 *     description: Retrieves content details by its ID. Only accessible by authenticated users and admins.
 *     tags:
 *       - Content
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the content
 *                 title:
 *                   type: string
 *                   description: The title of the content
 *                 body:
 *                   type: string
 *                   description: The main content body
 *                 author:
 *                   type: string
 *                   description: The ID of the content author
 *                 userName:
 *                   type: string
 *                   description: The name of the content author
 *                 date:
 *                   type: string
 *                   description: The date the content was created
 *       400:
 *         description: Bad request, invalid content ID
 *       401:
 *         description: Unauthorized, authentication required
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /content/posts:
 *   get:
 *     summary: Get all content
 *     description: Retrieves all content associated with the authenticated user. Only accessible by authenticated users and admins.
 *     tags:
 *       - Content
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all content
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the content
 *                   title:
 *                     type: string
 *                     description: The title of the content
 *                   body:
 *                     type: string
 *                     description: The main content body
 *                   author:
 *                     type: string
 *                     description: The ID of the content author
 *                   userName:
 *                     type: string
 *                     description: The name of the content author
 *                   date:
 *                     type: string
 *                     description: The date the content was created
 *       401:
 *         description: Unauthorized, authentication required
 *       500:
 *         description: Internal server error
 */
