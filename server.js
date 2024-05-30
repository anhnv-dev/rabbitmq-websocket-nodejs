const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const amqp = require('amqplib');

// cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

// ============================= RabbitMQ & Make QUEUE =============================
const QUEUE_NAME = 'notifications';

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        // make queue
        await channel.assertQueue(QUEUE_NAME, { durable: false });

        // consume
        channel.consume(QUEUE_NAME, (message) => {
            console.log("---- Tiêu thụ: ")
            const data = JSON.parse(message.content.toString());
            io.emit('notification', data);
        }, { noAck: true });


        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
    }
}
connectRabbitMQ().then(r => {});

// ============================= routing =============================
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/rabbit-mq', (req, res) => {
    res.sendFile(__dirname + '/rabbit-mq.html');
});

app.post('/send-notification', async (req, res) => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const msg = "Hi Van Anh";

        await channel.assertQueue(QUEUE_NAME, { durable: false });

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({ message: msg })));
        console.log('Notification sent:', msg);

        res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification', error);
        res.status(500).send('Failed to send notification');
    }
});

// socket (không qua rabbit mq - demo 1)
io.on('connection', (socket) => {
    socket.on('chat message', (title, name, time) => {
        console.log(title, name, time)
        io.emit('chat message', title, name, time);
    });
});

server.listen(3002, () => {
    console.log('listening on *:3002');
});