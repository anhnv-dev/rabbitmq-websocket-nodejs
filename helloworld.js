var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
});

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }

    // Để gửi, phải khai báo một hàng đợi để chúng ta gửi tới, sau đó chúng ta có thể xuất bản một tin nhắn lên hàng đợi
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'vananh';
        var msg = 'Hello world xx';

        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(`[x] Sent ${msg}`);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0)
    }, 500);

});

