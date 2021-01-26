#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
let db = require('./db')
let InfluenceModel = require("./models/Influence");
const CONN_URL = process.env.CONN_URL || 'amqp://localhost'


amqp.connect(CONN_URL, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(async function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'test_influence_task';
        channel.assertQueue(queue, {
            durable: true
        });

        // create new Influence
        InfluenceModel.create({
            goal: 40,
            cost: 10000,
            keyword: "Service Chiefs",
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

    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 2000);
});