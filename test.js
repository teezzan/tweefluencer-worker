let { TwitterClient } = require('twitter-api-client');
const twitterClient = new TwitterClient({
    apiKey: '3YdTOEbP9ImVFdB7HQ2cqyyaO',
    apiSecret: 'SAddNlVewB4tfkEoS5qoQjodorYerXDQvCtsQlOFE4trC0Y5YZ',
    accessToken: '1322838158258720769-sDuutpmi2RMuAvQfuwZVlLN8sQ10ua',
    accessTokenSecret: 'f3qxRtupFyDnpy04Ev0MJTXlvfExBU6eF7rbmLaKyzTti',
});


let parameters = { "event": { "type": "message_create", "message_create": { "target": { "recipient_id": "831464112341266432" }, "message_data": { "text": "hello maam" } } } }
twitterClient.directMessages.eventsNew(parameters).then(x => { console.log(x) }).catch(err => { console.log(err) })
// twitterClient.accountsAndUsers.usersSearch({ q: 'twitterDev' }).then(res => { console.log(res) }).catch(err => { console.log(err) })