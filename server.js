const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const amqp = require('amqplib');

// ----- cors -----
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

// ----- RabbitMQ & Make QUEUE -----
const QUEUE_NAME = 'notifications';

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        // 1. Make queue
        await channel.assertQueue(QUEUE_NAME, {durable: false});

        // 2. Consume
        channel.consume(QUEUE_NAME, (message) => {
            io.emit('notification', "message from nodejs");
        }, {noAck: true});

        // 3. Route sent message
        app.post('/send-notification', async (req, res) => {
            try {
                channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({message: "Hi Van Anh"})));
                res.status(200).send('Notification sent successfully');
            } catch (error) {
                console.error('Error sending notification', error);
                res.status(500).send('Failed to send notification');
            }
        });

    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
    }
}

connectRabbitMQ().then(r => {});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/rabbit-mq', (req, res) => {
    res.sendFile(__dirname + '/rabbit-mq.html');
});

// socket (demo 1)
io.on('connection', (socket) => {
    socket.on('chat message', (title, name, time) => {
        io.emit('chat message', title, name, time);
    });
});

server.listen(3002, () => {
    console.log('listening on http://localhost:3002');
});