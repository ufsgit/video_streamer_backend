const express = require('express');
const router = express.Router();
const createUserController = require('./createUser.controller');
const { protect, adminOnly } = require('../../../../middlewares/auth.middleware');
const { uploadSinglePhoto } = require('../../../../middlewares/upload.middleware');

/**
 * @swagger
 * /api/admin/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               sex:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               email:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or missing fields
 *       401:
 *         description: Unauthorized
 */
// POST /api/admin/users/create
router.post('/', protect, adminOnly, uploadSinglePhoto, createUserController.createUser);

module.exports = router;
