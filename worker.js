#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
let logic = require('./logic')
let db = require('./db')


amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'influence_task';

        // This makes sure the queue is declared before attempting to consume from it
        channel.assertQueue(queue, {
            durable: true
        });

        channel.consume(queue, (msg) => {
            logic.listen(msg, channel)
        }, {
            noAck: false
        });
    });
});