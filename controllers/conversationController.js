const { sendMessage, startConversation, getConversation, deleteConversationById } = require('../services/conversationService');
const prisma = require('../models/prismaClient'); // Assuming prismaClient is correctly configured

// Handler for starting a new conversation
exports.startConversation = async (req, res, next) => {
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    const conversation = await startConversation(userId); // Call service function to start conversation
    res.json({ conversationId: conversation.id }); // Send conversation ID in response
  } catch (error) {
    console.error('Error starting conversation:', error);
    next(error); // Pass error to Express error handler middleware
  }
};

exports.sendMessage = async (req, res, next) => {
  const { conversationId, message, sender } = req.body;
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    if (!conversationId || !message || !sender) {
      return res.status(400).json({ error: 'Missing conversationId, message, or sender' });
    }

    // Ensure the conversation belongs to the authenticated user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId, userId }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Process message with AI service (example)
    const botResponse = await sendMessage(conversationId, message, sender);

    // Return the bot response to the client
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error sending message:', error);
    next(error); // Pass error to Express error handler middleware
  }
};

// Handler for fetching all messages in a conversation
exports.getConversation = async (req, res, next) => {
  const { conversationId } = req.params;
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    // Ensure the conversation belongs to the authenticated user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId, userId },
      include: { messages: true },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Error getting conversation:', error);
    next(error); // Pass error to Express error handler
  }
};

// Handler for deleting the whole conversation
exports.deleteConversation = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    // Ensure the conversation belongs to the authenticated user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    await deleteConversationById(conversationId);
    return res.status(200).json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Handler for fetching all conversation IDs for the authenticated user
exports.getAllConversationIds = async (req, res, next) => {
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    const conversationIds = await prisma.conversation.findMany({
      where: { userId },
      select: { id: true },
    });
    res.json(conversationIds);
  } catch (error) {
    console.error('Error fetching conversation IDs:', error);
    next(error); // Pass error to Express error handler
  } finally {
    await prisma.$disconnect();
  }
};

exports.latestConversation = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    const latestConversation = await prisma.conversation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (latestConversation) {
      res.json({ conversationId: latestConversation.id });
    } else {
      res.status(404).json({ error: 'No conversations found' });
    }
  } catch (error) {
    console.error('Error fetching latest conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Handler for checking authentication
exports.checkAuthentication = (req, res) => {
  res.json({ authenticated: true, user: req.user });
};
