/**
 * @swagger
 * /admin/category:
 *   post:
 *     summary: Create a new category
 *     description: Adds a new category to the system. Only accessible by admins.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *                 example: "Technology"
 *     responses:
 *       201:
 *         description: Category successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created category
 *                 name:
 *                   type: string
 *                   description: The name of the created category
 *       400:
 *         description: Category name is required
 *       401:
 *         description: Unauthorized, admin access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/category/update:
 *   post:
 *     summary: Update a category
 *     description: Updates the name of an existing category. Only accessible by admins.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The ID of the category to update
 *                 example: "65f3a1b2c9e4d67890abcd12"
 *               newName:
 *                 type: string
 *                 description: The new name for the category
 *                 example: "Science & Technology"
 *     responses:
 *       200:
 *         description: Category successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the updated category
 *                 name:
 *                   type: string
 *                   description: The new name of the category
 *       400:
 *         description: Category ID and new name are required
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized, admin access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/category/{id}/toggle:
 *   post:
 *     summary: Toggle a category's status
 *     description: Enables or disables a category by its ID. Only accessible by admins.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to toggle
 *     responses:
 *       200:
 *         description: Category status successfully toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the category
 *                 name:
 *                   type: string
 *                   description: The name of the category
 *                 isActive:
 *                   type: boolean
 *                   description: Indicates whether the category is active or inactive
 *       400:
 *         description: Category ID is required
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized, admin access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admin/category:
 *   get:
 *     summary: Get all categories
 *     description: Retrieves a list of all available categories.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the category
 *                   name:
 *                     type: string
 *                     description: The name of the category
 *                   isActive:
 *                     type: boolean
 *                     description: Indicates whether the category is active or inactive
 *       404:
 *         description: No categories found
 *       500:
 *         description: Internal server error
 */
