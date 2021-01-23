const { configlisten } = require('./config');
var Twit = require('twit');
let T_listen = new Twit(configlisten);




function tweetEvent(tweet) {

    // Who sent the tweet?
    var name = tweet.user.screen_name;
    console.log(name);
    // What is the text?
    var txt = tweet.text;
    console.log(txt)
    // the status update or tweet ID in which we will reply
    var nameID = tweet.id_str;

    var reply = "Working on it! @" + name + ' ' + '. Give me a minute. Thanks';
    console.log(reply);
};

exports.greet = async () => {
    return new Promise((resolve, reject) => {
        resolve({ say: 'helloworld' });
    })
}

exports.answer = async (msg) => {
    var secs = msg.content.toString().split('.').length - 1;
    console.log(secs)

    console.log(" [x] Received %s", msg.content.toString());
    setTimeout(function () {
        console.log(" [x] Done");
    }, secs * 1000);
}

exports.listen = async (msg) => {
    var stream = T_listen.stream('statuses/filter', { track: [`#${msg.content.toString()}`] });
    console.log('starting Listening', msg.content.toString())
    stream.on('tweet', tweetEvent);
}
