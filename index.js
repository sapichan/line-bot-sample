const express = require('express');
const line = require('@line/bot-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// LINEの設定（.envから読み込み）
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// LINEのWebhookハンドラー
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Webhook error:', err);
      res.status(500).end();
    });
});

// イベント処理関数（ここで返信の内容を定義）
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // テキスト以外は無視
    return Promise.resolve(null);
  }

  // 送られてきたメッセージをそのまま返す（エコーボット）
  const client = new line.Client(config);
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `🗣️あなたのメッセージ：${event.message.text}`
  });
}

// サーバー起動
app.listen(port, () => {
  console.log(`🚀 LINE bot server running on port ${port}`);
});
