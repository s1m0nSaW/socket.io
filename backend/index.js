import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import route from './route.js'
import { addUser } from './users.js';

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { instrument } from "@socket.io/admin-ui";
import { sendMessageHandler, getMessagesHandler } from './handlers/messagesHandler.js';
import { create, getAnwered, update } from './handlers/answeredHandler.js';

dotenv.config();

const port = process.env.PORT || 5000;

const mongooseUrl = `mongodb://0.0.0.0:27017/ochem`; // localhost
const url1 = `mongodb://mongo:27017/ochem-vk`; //нужно поменять перед деплойем

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
/*vk.com: https://stage-app51864614-ea75c147ac61.pages.vk-apps.com/index.html
iOS & Android:  https://stage-app51864614-ea75c147ac61.pages.vk-apps.com/index.html
m.vk.com:       https://stage-app51864614-ea75c147ac61.pages.vk-apps.com/index.html*/

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://stage-app51864614-ea75c147ac61.pages.vk-apps.com", 'https://prod-app51864614-ea75c147ac61.pages-ac.vk-apps.com', 'https://localhost:3000'],
        credentials: true,
        methods: ["GET", "POST"]
    },
    transports: ['polling', 'xhr-polling'],
    secure: true
});

instrument(io, {
    auth: false,
    mode: "development",
});

io.engine.on("connection_error", (err) => {
    console.log(`Ошибка:`, err.message);  // the error message, for example "Session ID unknown"
});

io.on("connection", (socket) => {
    socket.on("join", ({ userId, gameId }) => {
        socket.join(gameId);
        addUser({ userId, gameId })
    })

    socket.on("joinUser", ({ userId }) => {
        socket.join(userId);
        console.log('связь с ', userId)
    })

    socket.on("sendMessage", ({ senderId, content, gameId, date }) => sendMessageHandler( io, senderId, content, gameId, date ));
    socket.on("getMessages", ({gameId}) => getMessagesHandler( io, gameId ));
    
    socket.on("newAnswered", ({ questionId, gameId, turn, user1, user2, answer1, answer2 }) => create(io, questionId, gameId, turn, user1, user2, answer1, answer2));
    socket.on("getAnswered", ({ gameId, answeredId }) => getAnwered(gameId, answeredId));
    socket.on("upAnswered", ({ id, answer2, correct, answer1, gameId }) => update(io, id, answer2, correct, answer1, gameId));
    /*
    router.post('/answer', checkAuth, AnsweredController.create);
    router.post('/up-answer/:id', checkAuth, AnsweredController.update);
    router.post('/answer/:id', checkAuth, AnsweredController.getAnwered);
    */

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

    socket.on("getUser", async ({ userId, vkid }) => {
        const user = await UserModel.findOne({ vkid: vkid });
        io.to(userId).emit("updatedUser", { data: { user } })
    })
})

server.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`App listening on ${port}! `);
});