#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
let db = require('./db')
let InfluenceModel = require("./models/Influence");
const CONN_URL = process.env.CONN_URL || 'amqp://localhost' || 'amqps://crkrqcfr:RTABAL4W2uOHVDNLSfsMhysjk9UbnhWo@orangutan.rmq.cloudamqp.com/crkrqcfr'


amqp.connect(CONN_URL, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(async function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'influence_task_queue';
        channel.assertQueue(queue, {
            durable: true
        });

        // create new Influence
        InfluenceModel.create({
            goal: 1,
            // tweet_id: "1354892065830797319",
            cost: 10000,
            keyword: "#uiop",
            winners_num: 5
        }, (err, newFluence) => {
            if (err) {
                console.log(err)
                return err
            }

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(newFluence)), {
                persistent: true
            });
            console.log(" [x] Sent '%s'", newFluence);
        });

    });

});