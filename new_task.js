#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
let db = require('./db')
let InfluenceModel = require("./models/Influence");


amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(async function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'task_queue';
        channel.assertQueue(queue, {
            durable: true
        });

        // create new Influence
        InfluenceModel.create({
            goal: 3,
            cost: 10000,
            keyword: "#uiop",
        }, (err, newFluence) => {
            if (err) {
                console.log(err)
                return err
            }

            console.log(newFluence)

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