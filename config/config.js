require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  togetherAIKey: process.env.TOGETHER_AI_API_KEY,
  togetherAIUrl: 'http://localhost:3000/api/send_message',
  databaseUrl: process.env.DATABASE_URL,
};