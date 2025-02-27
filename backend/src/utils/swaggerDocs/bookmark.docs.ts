/**
 * @swagger
 * /content/posts/{id}/bookmark:
 *   post:
 *     summary: Toggle a bookmark for a content item
 *     description: Adds or removes a bookmark for the given content ID. If the content is already bookmarked, it will be removed; otherwise, it will be added.
 *     tags:
 *       - Bookmarks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the content to bookmark or unbookmark
 *     responses:
 *       200:
 *         description: Successfully toggled the bookmark
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates whether the content is bookmarked (true) or unbookmarked (false)
 *       400:
 *         description: Invalid content ID
 *       401:
 *         description: Unauthorized, user not authenticated
 *       404:
 *         description: Content not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /content/posts/bookmark:
 *   get:
 *     summary: Get all bookmarks for the authenticated user
 *     description: Retrieves a list of all bookmarked content items for the authenticated user.
 *     tags:
 *       - Bookmarks
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's bookmarks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The ID of the bookmarked content
 *                   title:
 *                     type: string
 *                     description: The title of the bookmarked content
 *                   description:
 *                     type: string
 *                     description: A brief description of the bookmarked content
 *       401:
 *         description: Unauthorized, user not authenticated
 *       500:
 *         description: Internal server error
 */
