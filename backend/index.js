import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import route from './route.js'
import { addUser } from './users.js';
import crypto from 'crypto'

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { instrument } from "@socket.io/admin-ui";
import { sendMessageHandler, getMessagesHandler, typingMessage } from './handlers/messagesHandler.js';
import { create, getAnwered, update } from './handlers/answeredHandler.js';
import { getUser, already, register, getFreeRsvp, checkPromoter, setPromoter, getCompliment, afterAds } from './handlers/userHandler.js';
import { getThemes, newGame, newUser, userCoins } from './handlers/newGameHandler.js';
import { acceptGame, allGames, gamesIn, gamesOut, getGames, myGames, removeGame } from './handlers/gamesPageHandler.js';
import { createCompliment, getGame, nextStep, setTurn, theEnd, updateRating } from './handlers/gamePlayHandler.js';
import requestManager from './utils/requestManager.js';

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
/*vk.com: https://prod-app51864614-f45ea84364fe.pages-ac.vk-apps.com
iOS & Android:  https://stage-app51864614-91906819e9d5.pages.vk-apps.com
m.vk.com:       https://stage-app51864614-f45ea84364fe.pages.vk-apps.com*/

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://stage-app51864614-0696f8730d6a.pages.vk-apps.com", "https://prod-app51864614-0696f8730d6a.pages-ac.vk-apps.com", "https://localhost:3000"],
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

const socketUserIdMap = {};
function generateRequestId() {
    return crypto.randomBytes(16).toString('hex');
}

io.on("connection", (socket) => {
    socket.on("join", ({ userId, gameId }) => {
        socket.join(gameId);
        addUser({ userId, gameId })
    })

    socket.on("joinUser", ({ userId }) => {
        socket.join(userId);
        socketUserIdMap[socket.id] = userId; // сохраняем mapping
        console.log('связь с ', userId)
    })

    socket.on("sendMessage", async ({ vkid, senderId, content, gameId, date }) => {
        const requestId = generateRequestId();
        const userId = socketUserIdMap[socket.id]; // Получаем userId из мапы
        if (requestManager.has(userId)) {
            console.log(`User ${userId} is already in flight`);
            return;
        }
        requestManager.set(userId, requestId);
        try {
            if (userId === vkid) { // Проверяем соответствие userId и vkid
                await sendMessageHandler( io, userId, senderId, content, gameId, date );
            } else return;
        } finally {
            requestManager.delete(userId);
        }
    });

    socket.on("getMessages", ({ gameId }) => getMessagesHandler( io, gameId ));
    socket.on("typing", ({ vkid, gameId, status }) => {
        typingMessage(io, vkid, gameId, status);
        io.to(vkid).emit("onlines", { data: socketUserIdMap });
    });
    
    socket.on("newAnswered", ({ questionId, gameId, turn, user1, user2, answer1, answer2 }) => {
        create(io, questionId, gameId, turn, user1, user2, answer1, answer2)
    });
    socket.on("getAnswered", ({ gameId, answeredId }) => getAnwered(io, gameId, answeredId));
    socket.on("upAnswered", ({ id, answer2, correct, answer1, gameId }) => update(io, id, answer2, correct, answer1, gameId));
    
    socket.on("getUser", async ({ vkid }) => getUser(io, vkid));
    socket.on("already", async ({ vkid }) => already(io, vkid));
    socket.on("register", async ({ vkid, status, firstName, avaUrl }) => {
        const userId = socketUserIdMap[socket.id];
        if(userId === vkid){
            register(io, vkid, status, firstName, avaUrl)
        }
    });

    socket.on("getFreeRsvp", async ({ vkid }) => getFreeRsvp(io, vkid));
    socket.on("checkPromoter", async ({ vkid }) => checkPromoter(io, vkid));
    socket.on("promoter", async ({ vkid }) => setPromoter(io, vkid));
    socket.on("getUserCompliment", async ({ vkid, friendId }) => getCompliment(io, vkid, friendId));
    socket.on("afterAds", async ({ vkid }) => afterAds(io, vkid));
    
    socket.on("getThemes", ({ vkid }) => {
        getThemes(io, vkid,)
        io.to(vkid).emit("onlines", { data: socketUserIdMap })
    });
    socket.on("newGame", async ({ playerId1, playerId2, theme }) => {
        const requestId = generateRequestId();
        const userId = socketUserIdMap[socket.id]; // Получаем userId из мапы
        if (requestManager.has(userId)) {
            console.log(`User ${userId} is already in flight`);
            return;
        }
        if (!userCoins(playerId1) || userCoins(playerId1) < 1) {
            console.log(`User ${userId} does not have enough coins`);
            return;
        }
        requestManager.set(userId, requestId);
        try {
            if(userId === playerId1){
                await newGame(io, playerId1, playerId2, theme, socketUserIdMap)
            } else return;
        } finally {
            requestManager.delete(userId);
        }
    });
    socket.on("newPlayer", async ({ vkid, playerId, status, firstName, avaUrl }) => newUser(io, vkid, playerId, status, firstName, avaUrl));

    socket.on("getGames", async ({vkid}) => getGames(io, vkid));
    socket.on("games", async ({vkid}) => {
        myGames(io, vkid, socketUserIdMap)
    });
    socket.on("gamesIn", async ({vkid}) => gamesIn(io, vkid));
    socket.on("gamesOut", async ({vkid}) => gamesOut(io, vkid));
    socket.on("removeGame", async ({vkid, gameId}) => {
        const userId = socketUserIdMap[socket.id]; // Получаем userId из мапы
        if(userId === vkid){
            await removeGame(io, vkid, gameId);
        }
    });
    socket.on("acceptGame", async ({gameId}) => acceptGame(io, gameId));
    socket.on("getAllGames", async ({vkid}) => allGames(io, vkid));

    socket.on("setGame", async ({vkid, gameId }) => {
        getGame(io, vkid, gameId, socketUserIdMap);
    });
    socket.on("setTurn", async ({userId, gameId}) => {
        setTurn(io, userId, gameId);
    });
    socket.on("nextStep", async ({userId, gameId}) => {
        nextStep(io, userId, gameId, socketUserIdMap);
    });
    socket.on("theEnd", async ({gameId, theme}) => theEnd(io, gameId, theme, socketUserIdMap));
    socket.on("updateRating", async ({ratingId, rate, gameId}) => {
        const userId = socketUserIdMap[socket.id]; // Получаем userId из мапы
        const requestId = generateRequestId();
        if (requestManager.has(userId)) {
            console.log(`User ${userId} is already in flight`);
            return;
        }
        requestManager.set(userId, requestId);
        try {
            await updateRating(io, ratingId, rate, gameId)
        } finally {
            requestManager.delete(userId);
        }
    });
    socket.on("makeCompliment", async ({vkid, from, to, key, title, price, image, name}) => {
        const userId = socketUserIdMap[socket.id]; // Получаем userId из мапы
        const requestId = generateRequestId();
        if (requestManager.has(userId)) {
            console.log(`User ${userId} is already in flight`);
            return;
        }
        requestManager.set(userId, requestId);
        try {
            if(userId === vkid){
                await createCompliment(io, userId, from, to, key, title, price, image, name)
            } else return;
        } finally {
            requestManager.delete(userId);
        }
    });

    socket.on("socketNotification", ({ userId, message, severity }) => {
        io.to(userId).emit("notification", { data: { message, severity } })
    })

    socket.on("disconnect", () => {
        const userId = socketUserIdMap[socket.id];
        delete socketUserIdMap[socket.id]; // удаляем mapping
        console.log(`User ${userId} disconnected`);
    });

})

server.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`App listening on ${port}! `);
});