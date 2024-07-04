const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authenticateToken = require('../middlewares/auth');

// Check authentication status
router.get('/check_authentication', authenticateToken, conversationController.checkAuthentication);

// Get the latest conversation for the authenticated user
router.get('/latest_conversation', authenticateToken, conversationController.latestConversation);

// Start a new conversation for the authenticated user
router.post('/start_conversation', authenticateToken, conversationController.startConversation);

// Send a message in a conversation for the authenticated user
router.post('/send_message', authenticateToken, conversationController.sendMessage);

// Get a specific conversation by ID for the authenticated user
router.get('/get_conversation/:conversationId', authenticateToken, conversationController.getConversation);

// Get all conversation IDs for the authenticated user
router.get('/getAllConversationIDs', authenticateToken, conversationController.getAllConversationIds);

// Delete a conversation by ID for the authenticated user
router.delete('/conversation/:conversationId', authenticateToken, conversationController.deleteConversation);

module.exports = router;