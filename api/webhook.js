const axios = require('axios');

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { events } = req.body;
    if (!events || events.length === 0) {
      return res.status(400).json({ message: 'イベントがありません' });
    }

    const event = events[0];
    console.log('イベント受信:', JSON.stringify(event, null, 2));

    if (event.type === 'message' && event.message.type === 'text') {
      if (event.source.type === 'group') {
        const groupId = event.source.groupId;
        console.log('グループID:', groupId);

        const replyToken = event.replyToken;
        const replyMessage = `このグループのIDは: ${groupId} です！`;

        const url = 'https://api.line.me/v2/bot/message/reply';
        const headers = {
          'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        };

        const payload = {
          replyToken,
          messages: [{ type: 'text', text: replyMessage }],
        };

        await axios.post(url, payload, { headers });
        return res.status(200).end
