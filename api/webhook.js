const axios = require('axios');

// LINE Channel Access Token
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { events } = req.body;

    if (!events || events.length === 0) {
      return res.status(400).json({ message: 'イベントがありません' });
    }

    // 最初のイベントデータを取得
    const event = events[0];

    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId;
      const replyToken = event.replyToken;
      const replyMessage = `あなたのUser IDは: ${userId}`;

      // LINE APIにリプライする
      const url = 'https://api.line.me/v2/bot/message/reply';
      const headers = {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      };

      const payload = {
        replyToken: replyToken,
        messages: [{
          type: 'text',
          text: replyMessage,
        }],
      };

      try {
        // LINE APIにPOSTリクエスト
        await axios.post(url, payload, { headers });
        return res.status(200).json({ message: 'User ID が通知されました' });
      } catch (error) {
        console.error('LINE API エラー:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: '通知の送信に失敗しました', error: error.response ? error.response.data : error.message });
      }
    } else {
      return res.status(400).json({ message: 'メッセージイベントではありません' });
    }
  } else {
    return res.status(405).json({ message: 'メソッドが許可されていません' });
  }
};
