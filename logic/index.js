const { configlisten } = require('./config');
var Twit = require('twit');
let fs = require('fs')
let T_listen = new Twit(configlisten);
let InfluenceModel = require("../models/Influence");


exports.listen = async (msg, channel) => {
    let tweetEvent = async (tweet) => {
        // fs.writeFileSync('tweet.json', JSON.stringify(tweet))
        var name = tweet.user.screen_name;
        var txt = tweet.text;

        let resp = await InfluenceModel.update({
            "_id": payload.id,
            "influencers.username": tweet.user.screen_name
        }, {
            $push: {
                "influencers.$.tweets": tweet.id_str
            },
            $inc: { "influencers.$.total": 1 },
            $set: {
                "influencers.$.updatedAt": new Date()
            }

        }, { multi: true });

        if (resp.nModified == 0) {
            let influencers = {
                username: tweet.user.screen_name,
                tweets: [tweet.id_str],
                total: 1,
                updatedAt: new Date()
            }
            InfluenceModel.findByIdAndUpdate(payload.id, { $push: { influencers } }, { new: true }, (err, influence) => {

            })
        }



        InfluenceModel.findByIdAndUpdate(payload.id, { $inc: { current_status: 1 } }, { new: true }, (err, influence) => {
            if (err) return err
            console.log("current count for " + payload.keyword + " = ", influence.current_status)

            if (influence.current_status >= influence.goal) {
                stream.stop()
                this.complete(msg, channel);
                channel.ack(msg)
            }
        });


    };

    let payload = JSON.parse(msg.content.toString())
    var stream = T_listen.stream('statuses/filter', { track: `${payload.keyword}` });
    console.log('starting Listening to', payload.keyword)
    stream.on('tweet', tweetEvent);
}

exports.listenUnderTweet = async (msg, channel) => {

    let tweetEvent = async (tweet) => {

        // fs.writeFileSync('tweet.json', JSON.stringify(tweet))
        var name = tweet.user.screen_name;
        var txt = tweet.text;
        let id_str = tweet.in_reply_to_status_id_str;

        console.log("INside")


        if (id_str !== payload.tweet_id) {
            console.log("NAh")
            return
        }

        let resp = await InfluenceModel.update({
            "_id": payload.id,
            "influencers.username": tweet.user.screen_name
        }, {
            $push: {
                "influencers.$.tweets": tweet.id_str
            },
            $inc: { "influencers.$.total": 1 },
            $set: {
                "influencers.$.updatedAt": new Date()
            }

        }, { multi: true });

        if (resp.nModified == 0) {
            let influencers = {
                username: tweet.user.screen_name,
                tweets: [tweet.id_str],
                total: 1,
                updatedAt: new Date()
            }
            InfluenceModel.findByIdAndUpdate(payload.id, { $push: { influencers } }, { new: true }, (err, influence) => {

            })
        }



        InfluenceModel.findByIdAndUpdate(payload.id, { $inc: { current_status: 1 } }, { new: true }, (err, influence) => {
            if (err) return err
            console.log("current count for " + payload.keyword + " = ", influence.current_status)

            if (influence.current_status >= influence.goal) {
                stream.stop()
                this.complete(msg, channel);
                channel.ack(msg)
            }
        });


    };

    let payload = JSON.parse(msg.content.toString())
    var stream = T_listen.stream('statuses/filter', { track: `${payload.keyword}` });
    console.log('starting Listening to Undertweet', payload.keyword)
    stream.on('tweet', tweetEvent);
}


exports.complete = async (msg, channel) => {
    let payload = JSON.parse(msg.content.toString());
    InfluenceModel.findById(payload.id, (err, influence) => {
        if (err) return err
        influence.influencers.sort((a, b) => b.total - a.total);
        InfluenceModel.findByIdAndUpdate(payload.id, { $set: { winners: influence.influencers.splice(0, influence.winners_num) } }, { new: true }, (err, fin_influence) => {
            if (err) return err
            console.log("Done. Winners are")
            console.table(fin_influence.winners);
            let out = "The top tweets for " + `"${payload.keyword}"` + " came from ";
            for (i in fin_influence.winners) {
                out += ` @${fin_influence.winners[i].username} with ${fin_influence.winners[i].total} ${fin_influence.winners[i].total > 1 ? "tweets" : "tweet"}${fin_influence.winners.length - 1 == i ? "." : ","}`
            }
            console.log(out);
        })
    })
}

exports.dm = async (msg, channel) => {
    // var stream = T_listen.stream('user')

    // stream.on('direct_message', function (directMsg) {
    //     console.log(directMsg)
    // })
    return
}
