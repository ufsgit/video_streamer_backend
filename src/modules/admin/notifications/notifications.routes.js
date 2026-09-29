const express = require('express');
const router = express.Router();
const createNotificationController = require('./createNotification/createNotification.controller');
const listNotificationsController = require('./listNotifications/listNotifications.controller');
const deleteNotificationController = require('./deleteNotification/deleteNotification.controller');
const toggleNotificationController = require('./toggleNotification/toggleNotification.controller');
const { protect, adminOnly } = require('../../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/notifications/create:
 *   post:
 *     summary: Admin creates a broadcast notification for all users
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Watch your pre-op videos!"
 *               message:
 *                 type: string
 *                 example: "Please complete your pre-op videos before surgery."
 *               schedule_time:
 *                 type: string
 *                 format: time
 *                 example: "18:00:00"
 *                 description: Daily time (HH:MM:SS) to push notification. Null = immediate/always-on.
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post('/create', protect, adminOnly, createNotificationController.createNotification);

/**
 * @swagger
 * /api/admin/notifications/list:
 *   get:
 *     summary: List all broadcast notifications set by admin
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized
 */
router.get('/list', protect, adminOnly, listNotificationsController.listNotifications);

/**
 * @swagger
 * /api/admin/notifications/delete/{id}:
 *   delete:
 *     summary: Delete a broadcast notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/delete/:id', protect, adminOnly, deleteNotificationController.deleteNotification);

/**
 * @swagger
 * /api/admin/notifications/toggle/{id}:
 *   patch:
 *     summary: Enable or disable a broadcast notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               is_active:
 *                 type: integer
 *                 enum: [0, 1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: Notification toggled
 *       401:
 *         description: Unauthorized
 */
router.patch('/toggle/:id', protect, adminOnly, toggleNotificationController.toggleNotification);

module.exports = router;
