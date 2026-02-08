/**
 * @swagger
 * /chat/create-new-chat:
 *   post:
 *     summary: Create a new chat
 *     description: Creates a new chat between the authenticated user and the specified member.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - member
 *             properties:
 *               member:
 *                 type: string
 *                 description: ID of the user to chat with.
 *     responses:
 *       201:
 *         description: Chat created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Chat ID.
 *                 members:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of user IDs in the chat.
 *       400:
 *         description: Member ID is required.
 *       500:
 *         description: Failed to create chat.
 */

/**
 * @swagger
 * /chat/get-all-chats:
 *   get:
 *     summary: Get all chats
 *     description: Fetches all chats for the authenticated user.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of chats fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Chat ID.
 *                   members:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of user IDs in the chat.
 *       500:
 *         description: Failed to fetch chats.
 */
/**
 * @swagger
 * /message/new-message:
 *   post:
 *     summary: Send a new message
 *     description: Sends a new message in an existing chat.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - sender
 *               - text
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat.
 *               sender:
 *                 type: string
 *                 description: ID of the sender.
 *               text:
 *                 type: string
 *                 description: Message content.
 *     responses:
 *       201:
 *         description: Message created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 data:
 *                   type: object
 *                   description: The created message object.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Failed to create message.
 */

/**
 * @swagger
 * /message/get-all-messages/{chatId}:
 *   get:
 *     summary: Get all messages in a chat
 *     description: Fetches all messages for a specific chat.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat to fetch messages from.
 *     responses:
 *       200:
 *         description: Messages fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Message ID.
 *                       chatId:
 *                         type: string
 *                         description: Chat ID.
 *                       sender:
 *                         type: string
 *                         description: Sender ID.
 *                       text:
 *                         type: string
 *                         description: Message content.
 *       400:
 *         description: Chat ID is required.
 *       500:
 *         description: Failed to fetch messages.
 */
