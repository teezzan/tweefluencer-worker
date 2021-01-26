#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
let logic = require('./logic')
let db = require('./db')
const CONN_URL = process.env.CONN_URL || 'amqp://localhost'

amqp.connect(CONN_URL, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'test_influence_task';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.consume(queue, (msg) => {
            logic.listen(msg, channel)
        }, {
            noAck: false
        });
        var dm_queue = 'dm_task';


        channel.assertQueue(dm_queue, {
            durable: true
        });

        channel.consume(dm_queue, (msg) => {
            logic.dm(msg, channel)
        }, {
            noAck: true
        });
    });
});