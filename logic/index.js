const { configlisten } = require('./config');
var Twit = require('twit');
let T_listen = new Twit(configlisten);
let InfluenceModel = require("../models/Influence");



// let tweetEvent = async (tweet) => {

//     // Who sent the tweet?
//     var name = tweet.user.screen_name;
//     // console.log(name);
//     // What is the text?
//     var txt = tweet.text;
//     console.log(txt)
//     console.log(payload.tag)
//     console.log(payload.id)
//     // the status update or tweet ID in which we will reply
//     // var nameID = tweet.id_str;

//     // var reply = "Working on it! @" + name + ' ' + '. Give me a minute. Thanks';
//     // console.log(reply);
// };



exports.listen = async (msg, channel) => {
    let tweetEvent = async (tweet) => {

        var name = tweet.user.screen_name;
        var txt = tweet.text;
        // console.log(txt)


        let resp = await InfluenceModel.update({
            "_id": payload.id,
            "influencers.username": tweet.user.screen_name
        }, {
            $push: {
                "influencers.$.tweets": tweet.id_str
            },
            $inc: { "influencers.$.total": 1 }

        }, { multi: true });
        console.log("resp = ", resp);


        if (resp.nModified == 0) {
            let influencers = {
                username: tweet.user.screen_name,
                tweets: [tweet.id_str],
                total: 1
            }
            InfluenceModel.findByIdAndUpdate(payload.id, { $push: { influencers } }, { new: true }, (err, influence) => {

            })
        }



        InfluenceModel.findByIdAndUpdate(payload.id, { $inc: { current_status: 1 } }, { new: true }, (err, influence) => {
            if (err) return err
            console.log("current = ", influence.current_status)

            if (influence.current_status >= influence.goal) {
                console.log("DOne and Dusted ", influence);
                stream.stop()
                channel.ack(msg)
            }
        });


    };

    let payload = JSON.parse(msg.content.toString())
    var stream = T_listen.stream('statuses/filter', { track: `${payload.keyword}` });
    console.log('starting Listening to', payload.keyword)
    stream.on('tweet', tweetEvent);
}
