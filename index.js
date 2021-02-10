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

        var queue = 'influence_task_queue';
        var listenUnderTweetQUeue = 'undertweet_task_queue';
        var dm_queue = 'dm_task';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.assertQueue(listenUnderTweetQUeue, {
            durable: true
        });

        channel.assertQueue(dm_queue, {
            durable: true
        });



        channel.consume(queue, (msg) => {
            try { logic.listen(msg, channel) }
            catch { channel.nack(msg) }
        }, {
            noAck: false
        });

        channel.consume(listenUnderTweetQUeue, (msg) => {
            try { logic.listenUnderTweet(msg, channel) }
            catch { channel.nack(msg) }
        }, {
            noAck: false
        });


        channel.consume(dm_queue, (msg) => {
            try { logic.dm(msg, channel) }
            catch { channel.nack(msg) }

        }, {
            noAck: true
        });
    });
});