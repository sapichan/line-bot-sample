if (event.type === 'message' && event.message.type === 'text') {
  let sourceId;

  if (event.source.type === 'user') {
    sourceId = event.source.userId;
  } else if (event.source.type === 'group') {
    sourceId = event.source.groupId;  // グループIDを取得
  } else if (event.source.type === 'room') {
    sourceId = event.source.roomId;    // マルチチャットの場合
  }

  const replyToken = event.replyToken;
  const replyMessage = `あなたのIDは: ${sourceId}`;

  // ここでreplyMessageを返す処理を行う
}
