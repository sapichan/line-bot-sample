const axios = require('axios');

module.exports = async (req, res) => {
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
    let sourceId;

    if (event.source.type === 'user') {
      sourceId = event.source.userId;
    } else if (event.source.type === 'group') {
      sourceId = event.source.groupId;
    } else if (event.source.type === 'room') {
      sourceId = event.source.roomId;
    }

    const replyToken = event.replyToken;
    const replyMessage = `あなたのIDは: ${sourceId}`;

    const url = 'https://api.line.me/v2/bot/message/reply';
    const headers = {
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      replyToken,
      messages: [{ type: 'text', text: replyMessage }],
    };

    try {
      await axios.post(url, payload, { headers });
      return res.status(200).end();
    } catch (error) {
      console.error('返信エラー:', error.response ? error.response.data : error.message);
      return res.status(500).end();
    }
  }

  return res.status(200).end();
};
