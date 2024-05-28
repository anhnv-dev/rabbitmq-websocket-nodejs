const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
    // cors: {
    //     origin: "http://localhost:4200",
    //     methods: ["GET", "POST"]
    // }
});

// cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    socket.on('chat message', (title, name, time) => {
        console.log(title, name, time)
        io.emit('chat message', title, name, time);
    });
});

server.listen(3002, () => {
    console.log('listening on *:3002');
});