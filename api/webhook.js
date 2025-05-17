// api/webhook.js  (Vercel Edge Function / Node.js 18)

import getRawBody from 'raw-body';
import axios from 'axios';

export const config = {
  api: { bodyParser: false }        // ★生ボディ必須
};

// 環境変数（Vercel Dashboard で設定）
const ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
// const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET; // ←署名検証する場合に使用

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 1. 生のリクエストボディを取得
  const raw = await getRawBody(req);
  const body = JSON.parse(raw);

  // 2. 必要なら署名検証（開発中はコメントアウト可）
  // const signature = req.headers['x-line-signature'];
  // if (!checkSignature(raw, signature)) {
  //   return res.status(401).json({ message: 'Invalid signature' });
  // }

  if (!body.events || body.events.length === 0) {
    return res.status(400).json({ message: 'No events' });
  }

  const event = body.events[0];

  // 3. テキストメッセージのみ処理
  if (event.type === 'message' && event.message.type === 'text') {
    const userId = event.source.userId;
    const replyToken = event.replyToken;
    const replyMessage = `あなたのUser IDは: ${userId}`;

    try {
      await axios.post(
        'https://api.line.me/v2/bot/message/reply',
        {
          replyToken,
          messages: [{ type: 'text', text: replyMessage }],
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('👤 userId sent:', userId);
      return res.status(200).json({ message: 'User ID sent' });
    } catch (err) {
      console.error('LINE API error:', err.response?.data || err.message);
      return res.status(500).json({ message: 'LINE reply failed' });
    }
  } else {
    return res.status(400).json({ message: 'Not a text message event' });
  }
}

/* ------- 署名検証する場合の関数 ------- */
// import crypto from 'crypto';
// function checkSignature(rawBody,
