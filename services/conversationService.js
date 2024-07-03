const prisma = require('../models/prismaClient');
const { getTogetherAIResponse } = require('../utils/togetherAI');

exports.getAllConversationIds = async() => {
  try {
    const conversationIds = await prisma.conversationIdOnly.findMany();
    return conversationIds.map((conversation) => conversation.id);
  } catch (error) {
    console.error('Error fetching conversation IDs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}


exports.startConversation = async () => {
  return prisma.conversation.create({
    data: {},
  });
};

exports.sendMessage = async (conversationId, message, sender) => {



  if (!conversationId || !message || !sender) {
    throw new Error('Missing conversationId, message, or sender');
  }
  


  const botResponse = await getTogetherAIResponse(message);

  await prisma.message.create({
    data: {
      conversationId,
      sender,
      content: message,
    },
  });

  await prisma.message.create({
    data: {
      conversationId,
      sender: 'bot',
      content: botResponse,
    },
  });
  return botResponse;
};

exports.getConversation = async (conversationId) => {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });
};

exports.deleteConversationById = async (conversationId) => {
  try {
    // Delete all messages associated with the conversation
    await prisma.message.deleteMany({
      where: { conversationId },
    });

    // Delete the conversation
    const result = await prisma.conversation.delete({
      where: { id: conversationId },
    });

    return { success: true, message: 'Conversation deleted successfully' };
  } catch (error) {
    console.error('Error in deleteConversationById:', error); // Log the error
    return { success: false, message: error.message };
  }
};