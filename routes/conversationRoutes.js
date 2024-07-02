const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.post('/start_conversation', conversationController.startConversation);
router.post('/send_message', conversationController.sendMessage);
router.get('/get_conversation/:conversationId', conversationController.getConversation);
router.get('/getAllConversationIDs', conversationController.getAllConversationIds);
router.delete('/conversation/:conversationId', conversationController.deleteConversation);

module.exports = router;