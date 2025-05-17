const groupId = '取得したグループID';

const payload = {
  to: groupId,  // userIdの代わりにgroupIdを指定
  messages: [{
    type: 'text',
    text: 'グループに通知テストだよ！',
  }],
};

await axios.post('https://api.line.me/v2/bot/message/push', payload, {
  headers: {
    'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});
