import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import route from './route.js'
import { addUser } from './users.js';

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { instrument } from "@socket.io/admin-ui";

dotenv.config();

const port = process.env.PORT || 5000;

const mongooseUrl = `mongodb://0.0.0.0:27017/ochem`; // localhost
const url1 = `mongodb://mongo:27017/ochem`; //нужно поменять перед деплойем

mongoose.set("strictQuery", false);
mongoose
    .connect(url1, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error ' + err));
  
const app = express();

app.use(express.json());
app.use(cors());
app.use(route);
app.use('/uploads', express.static('uploads'));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://ochem.ru",
        credentials: true
    }
});

instrument(io, {
    auth: false,
    mode: "development",
});

io.on("connection", (socket) => {
    socket.on("join", ({ userId, gameId }) => {
        socket.join(gameId);
        addUser({ userId, gameId })
    })

    socket.on("joinUser", ({ userId }) => {
        socket.join(userId);
    })

    socket.on("sendMessage", ({ senderId, content, gameId }) => {
        io.to(gameId).emit("message", { data: { 
            senderId: senderId,
            content: content,
            gameId: gameId, } })
        
    })

    socket.on("socketNotification", ({ userId, message, severity }) => {
        io.to(userId).emit("notification", { data: { message, severity } })
    })

    socket.on("upGames", ({ userId }) => {
        io.to(userId).emit("updateGames", { data: { userId } })
    })

    socket.on("updateGame", ({ gameId }) => {
        io.to(gameId).emit("update", { data: { gameId } })
    })

    socket.on("removeGame", ({ gameId }) => {
        io.to(gameId).emit("deleteGame", { data: { gameId } })
    })

    socket.on("upAnswered", ({ gameId, answeredId }) => {
        io.to(gameId).emit("answered", { data: { aswId: answeredId } })
    })

    socket.on("connect_error", (err) => {
        // the reason of the error, for example "xhr poll error"
        console.log(err.message);
      
        // some additional description, for example the status code of the initial HTTP response
        console.log(err.description);
      
        // some additional context, for example the XMLHttpRequest object
        console.log(err.context);
    });
})

server.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`App listening on ${port}! `);
});