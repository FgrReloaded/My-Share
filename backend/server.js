const express = require('express');
const app = express();
const server = require("http").createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

const port = process.env.PORT || 2000;

io.on("connection", (socket) => {
    

    // Join a conversation
    const { roomId } = socket.handshake.query;
    // On Scan get the scanned user connected.
    socket.join(roomId);
    socket.on("join_room", (data) => {
        io.in(data).emit("request", data);
    })
    // Listen for new messages
    socket.on("newChatMessage", (data) => {
        io.in(roomId).emit("newChatMessage", data);
    });

    socket.on("show-loader", (data) => {
        io.in(roomId).emit("show-loader", data)
    })

    socket.on("file-send", function (data) {
        let { url } = data
        if (url.includes("image") || url.includes("video")) {
            let sub = url.substring(50, 61);
            url = url.replace(sub, "fl_attachment");
        }
        data = { ...data, url };
        io.in(roomId).emit("file-receive", data);
    })
    socket.on("fs-start", function (data) {
        socket.in(roomId).emit("fs-share", {});
    })
    socket.on("file-raw", function (data) {
        socket.in(roomId).emit("fs-share", data.buffer);
    })
    // Leave the room if the user closes the socket
    socket.on("disconnect", () => {
        
        socket.leave(roomId);
    });
});

server.listen(port, () => {
    
});

