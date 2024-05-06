import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import route from './route.js'
import { addUser } from './users.js';
import axios from 'axios';

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { instrument } from "@socket.io/admin-ui";
import { sendMessageHandler, getMessagesHandler, typingMessage } from './handlers/messagesHandler.js';
import { create, getAnwered, update } from './handlers/answeredHandler.js';
import { getUser, already, register, getFreeRsvp, checkPromoter, setPromoter, getCompliment, afterAds } from './handlers/userHandler.js';
import { getThemes, newGame, newUser } from './handlers/newGameHandler.js';
import { acceptGame, allGames, gamesIn, gamesOut, getGames, myGames, removeGame } from './handlers/gamesPageHandler.js';
import { createCompliment, getGame, nextStep, setTurn, theEnd, updateRating } from './handlers/gamePlayHandler.js';

dotenv.config();

const port = process.env.PORT || 5000;
const service = process.env.SERVICEKEY

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
/*vk.com: https://prod-app51864614-be68ab63c85a.pages-ac.vk-apps.com/index.html
iOS & Android:  https://stage-app51864614-91906819e9d5.pages.vk-apps.com
m.vk.com:       https://stage-app51864614-558cedecc5db.pages.vk-apps.com*/

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://stage-app51864614-d1cbb29f338d.pages.vk-apps.com", 'https://prod-app51864614-d1cbb29f338d.pages-ac.vk-apps.com', 'https://localhost:3000'],
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

    socket.on("sendMessage", ({ senderId, content, gameId, date }) => {
        sendMessageHandler( io, senderId, content, gameId, date );
    });
    socket.on("getMessages", ({ gameId }) => {
        getMessagesHandler( io, gameId );
    });
    socket.on("typing", ({ vkid, gameId, status }) => {
        typingMessage(io, vkid, gameId, status);
        io.to(vkid).emit("onlines", { data: socketUserIdMap });
    });
    
    socket.on("newAnswered", ({ questionId, gameId, turn, user1, user2, answer1, answer2 }) => create(io, questionId, gameId, turn, user1, user2, answer1, answer2));
    socket.on("getAnswered", ({ gameId, answeredId }) => getAnwered(io, gameId, answeredId));
    socket.on("upAnswered", ({ id, answer2, correct, answer1, gameId }) => update(io, id, answer2, correct, answer1, gameId));
    
    socket.on("getUser", async ({ vkid }) => getUser(io, vkid));
    socket.on("already", async ({ vkid }) => already(io, vkid));
    socket.on("register", async ({ vkid, status, firstName, avaUrl }) => register(io, vkid, status, firstName, avaUrl));
    socket.on("getFreeRsvp", async ({ vkid }) => getFreeRsvp(io, vkid));
    socket.on("checkPromoter", async ({ vkid }) => checkPromoter(io, vkid));
    socket.on("promoter", async ({ vkid }) => setPromoter(io, vkid));
    socket.on("getUserCompliment", async ({ vkid, friendId }) => getCompliment(io, vkid, friendId));
    socket.on("afterAds", async ({ vkid }) => afterAds(io, vkid));
    
    socket.on("getThemes", ({ vkid }) => {
        getThemes(io, vkid)
        io.to(vkid).emit("onlines", { data: socketUserIdMap })
    });
    socket.on("newGame", async ({ playerId1, playerId2, turn, theme }) => {
        newGame(io, playerId1, playerId2, turn, theme)

        try {
            // Отправляем первый POST-запрос для проверки разрешения на уведомления
            const response1 = await axios.post('https://api.vk.com/method/apps.isNotificationsAllowed', {
              user_id: playerId2,
              apps_id: 51864614,
              access_token: service,
              v: 5.199
            });
      
            if (response1.data.response.is_allowed) {
              // Если получено разрешение на уведомления, отправляем второй POST-запрос для отправки уведомления
              const response2 = await axios.post('https://api.vk.com/method/notifications.sendMessage', {
                user_ids: playerId2,
                message: 'С вами кто-то хочет поиграть...',
                fragment: '/games',
                access_token: service,
                v: 5.199
              });
      
              console.log(response2.data);
            }
          } catch (error) {
            console.error(error);
          }
    });
    socket.on("newPlayer", async ({ vkid, playerId, status, firstName, avaUrl }) => newUser(io, vkid, playerId, status, firstName, avaUrl));

    socket.on("getGames", async ({vkid}) => getGames(io, vkid));
    socket.on("games", async ({vkid}) => myGames(io, vkid));
    socket.on("gamesIn", async ({vkid}) => gamesIn(io, vkid));
    socket.on("gamesOut", async ({vkid}) => gamesOut(io, vkid));
    socket.on("removeGame", async ({vkid, gameId}) => removeGame(io, vkid, gameId));
    socket.on("acceptGame", async ({gameId}) => acceptGame(io, gameId));
    socket.on("getAllGames", async ({vkid}) => allGames(io, vkid));

    socket.on("setGame", async ({vkid, gameId}) => {
        getGame(io, vkid, gameId);
        io.to(vkid).emit("onlines", { data: socketUserIdMap });
    });
    socket.on("setTurn", async ({userId, gameId}) => {
        setTurn(io, userId, gameId);
    });
    socket.on("nextStep", async ({userId, gameId}) => {
        nextStep(io, userId, gameId);
    });
    socket.on("theEnd", async ({gameId, theme}) => theEnd(io, gameId, theme));
    socket.on("updateRating", async ({ratingId, rate, gameId}) => updateRating(io, ratingId, rate, gameId));
    socket.on("makeCompliment", async ({from, to, price, image, name}) => createCompliment(io, from, to, price, image, name));

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