/**
 * @swagger
 * /squad:
 *   get:
 *     summary: Get squads by category
 *     description: Retrieves a list of squads filtered by the specified category for the authenticated user.
 *     tags:
 *       - Squads
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category to filter squads by
 *     responses:
 *       200:
 *         description: Successfully retrieved squads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the squad
 *                   name:
 *                     type: string
 *                     description: The name of the squad
 *                   category:
 *                     type: string
 *                     description: The category of the squad
 *       400:
 *         description: Category is required
 *       401:
 *         description: Unauthorized, user not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /squad:
 *   post:
 *     summary: Create a new squad
 *     description: Creates a new squad with the provided data and an optional logo. The squad name must be unique.
 *     tags:
 *       - Squads
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the squad
 *               category:
 *                 type: string
 *                 description: The category of the squad
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Optional logo file for the squad
 *     responses:
 *       201:
 *         description: Successfully created the squad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                     type: string
 *                     description: The ID of the created squad
 *                 name:
 *                   type: string
 *                   description: The name of the squad
 *                 category:
 *                   type: string
 *                   description: The category of the squad
 *                 logo:
 *                   type: string
 *                   description: The URL or path to the uploaded logo (if provided)
 *       400:
 *         description: Squad with this name already exists or invalid input
 *       401:
 *         description: Unauthorized, user not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /squad/detail/{handle}:
 *   get:
 *     summary: Get squad details by handle
 *     description: Retrieves detailed information about a squad identified by its handle.
 *     tags:
 *       - Squads
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: handle
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique handle of the squad
 *     responses:
 *       200:
 *         description: Successfully retrieved squad details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the squad
 *                 name:
 *                   type: string
 *                   description: The name of the squad
 *                 handle:
 *                   type: string
 *                   description: The unique handle of the squad
 *                 category:
 *                   type: string
 *                   description: The category of the squad
 *                 logo:
 *                   type: string
 *                   description: The URL or path to the squad's logo (if available)
 *       400:
 *         description: Squad handle is required
 *       401:
 *         description: Unauthorized, user not authenticated
 *       404:
 *         description: Squad not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /squad/{squadId}/join:
 *   post:
 *     summary: Join a squad
 *     description: Allows the authenticated user to join a squad identified by its ID.
 *     tags:
 *       - Squads
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: squadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the squad to join
 *     responses:
 *       200:
 *         description: Successfully joined the squad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                   example: Successfully joined squad
 *       400:
 *         description: User ID or squad ID is required
 *       401:
 *         description: Unauthorized, user not authenticated
 *       404:
 *         description: Squad not found
 *       500:
 *         description: Internal server error
 */
