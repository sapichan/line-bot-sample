const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { events } = req.body;

    // 送信されたメッセージイベントの取得
    const event = events[0];
    if (event.type === 'message' && event.message.type === 'text') {
      const userId = event.source.userId;

      // 返すメッセージ
      const replyMessage = `あなたのUser IDは: ${userId}`;

      // LINEチャネルアクセストークン
      const LINE_CHANNEL_ACCESS_TOKEN = 'Um35rpoMZMen8/lmYD/tm3UGt+7COY5pVejMvJBJBmt4yuZg+l5Gh37pC/AA1xGqHEnj45UsKzYDhN/tu+11IkkcuRNXG0HWzIAdureusKmZp2HtshdUi5qzRiq9x8KuWGiwwcOu/p46VDpQMaCnpgdB04t89/1O/w1cDnyilFU=';

      // メッセージをLINEに送信
      const url = 'https://api.line.me/v2/bot/message/reply';
      const headers = {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      };

      const payload = {
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: replyMessage }],
      };

      try {
        await axios.post(url, payload, { headers });
        res.status(200).json({ message: 'User ID が通知されました' });
      } catch (error) {
        console.error('LINE API エラー:', error);
        res.status(500).json({ error: '通知に失敗しました' });
      }
    } else {
      res.status(400).json({ message: 'メッセージではないイベントです' });
    }
  } else {
    res.status(405).json({ message: 'メソッドは許可されていません' });
  }
};
