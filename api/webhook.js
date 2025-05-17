module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { events } = req.body;

  if (!events || events.length === 0) {
    return res.status(400).json({ message: 'イベントがありません' });
  }

  const event = events[0];
  console.log('イベント受信:', JSON.stringify(event, null, 2));  // ここでイベント内容をログに出す

  if (event.type === 'message' && event.message.type === 'text') {
    // 返信処理はここから
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

    // LINEに返信するためのリクエスト準備
    // axios.post(...) で返信処理を実行
  }

  return res.status(200).end();
};
