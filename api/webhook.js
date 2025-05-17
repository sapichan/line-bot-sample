const axios = require('axios');

// この部分でLINEのアクセストークンを設定
const LINE_CHANNEL_ACCESS_TOKEN = 'あなたのLINEチャンネルアクセストークン';

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { events } = req.body;  // LINE Webhookからのイベントデータ

    // 最初のイベントデータを取得
    const event = events[0];
    
    // メッセージのイベントかどうかを確認
    if (event.type === 'message' && event.message.type === 'text') {
      // ユーザーIDを取得
      const userId = event.source.userId;

      // User ID をメッセージとして返信
      const replyMessage = `あなたのUser IDは: ${userId}`;

      // リプライトークンが含まれていることを確認
      const replyToken = event.replyToken;
      
      // LINEにリプライを送るためのURL
      const url = 'https://api.line.me/v2/bot/message/reply';
      const headers = {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      };

      // 送信するデータ
      const payload = {
        replyToken: replyToken,
        messages: [{
          type: 'text',
          text: replyMessage,
        }],
      };

      try {
        // リプライメッセージをLINEに送信
        await axios.post(url, payload, { headers });
        res.status(200).json({ message: 'User ID が通知されました' });
      } catch (error) {
        console.error('LINE API エラー:', error);
        res.status(500).json({ message: '通知の送信に失敗しました' });
      }
    } else {
      res.status(400).json({ message: 'メッセージイベントではありません' });
    }
  } else {
    res.status(405).json({ message: 'メソッドが許可されていません' });
  }
};
