const { sendMessage, startConversation, getConversation,  deleteConversationById, getAllConversationIds} = require('../services/conversationService');
const prisma = require('../models/prismaClient'); // Assuming prismaClient is correctly configured

// Handler for starting a new conversation
exports.startConversation = async (req, res, next) => {
  try {
    const conversation = await startConversation(); // Assuming startConversation returns a conversation object
    res.json({ conversationId: conversation.id });
  } catch (error) {
    console.error('Error starting conversation:', error);
    next(error); // Pass error to Express error handler
  }
};

exports.sendMessage = async (req, res, next) => {
  const { conversationId, message, sender } = req.body;
  try {
    if (!conversationId || !message || !sender) {
      return res.status(400).json({ error: 'Missing conversationId, message, or sender' });
    }

    console.log('Received message:', { conversationId, message, sender });

    // Save user message to the database
    // const userMessage = await prisma.message.create({
    //   data: {
    //     conversationId,
    //     sender,
    //     content: message
    //   }
    // });


    // Process message with AI service (example)
    const botResponse = await sendMessage(conversationId, message, sender);

    console.log('Bot response:', botResponse);

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

  try {
    const conversation = await getConversation(conversationId); // Assuming getConversation returns messages
    res.json({ conversation });
  } catch (error) {
    console.error('Error getting conversation:', error);
    next(error); // Pass error to Express error handler
  }
};

// for deleting the whole conversation
exports.deleteConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const result = await deleteConversationById(conversationId);
    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllConversationIds = async(req, res, next) => {
  try {
    const conversationIds = await prisma.conversation.findMany({
      select: {
        id: true,
      },
    });
    res.json(conversationIds);
  } catch (error) {
    console.error('Error fetching conversation IDs:', error);
    next(error); // Pass error to Express error handler
  } finally {
    await prisma.$disconnect();
  }
}