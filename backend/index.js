import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { YooCheckout } from '@a2seven/yoo-checkout';

import checkAuth from './utils/checkAuth.js';
import checkAdmin from './utils/checkAdmin.js';
import checkIp from './utils/checkIp.js';
import { registerValidator, loginValidator, nicknameValidator, emailValidator, passwordValidator } from './utils/validator.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

import * as UserController from './controllers/UserController.js';
import * as PaymentController from './controllers/PaymentController.js';
import * as GameController from './controllers/GameController.js';
import * as QuestionController from './controllers/QuestionController.js';
import * as MessageController from './controllers/MessageController.js';
import * as AnsweredController from './controllers/AnsweredController.js';

dotenv.config()

const port = process.env.PORT || 5000

const mongooseUrl = `mongodb://0.0.0.0:27017/ochem` // localhost
const url1 = `mongodb://mongo:27017/ochem` //нужно поменять перед деплойем

mongoose.set("strictQuery", false);
mongoose
    .connect(mongooseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error ' + err));

const app = express();

const storage = multer.diskStorage({
    destination: ( _, __, cb)=>{
        cb(null, 'uploads');
    },
    filename: ( _, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), UserController.updatePic);

app.post('/user/:name', UserController.getUser);
app.post('/get-all', checkAdmin, UserController.getAll);
app.delete('/admin/:id', checkAdmin, UserController.remove);
app.post('/quests', checkAdmin, QuestionController.getAll);
app.post('/theme', checkAdmin, QuestionController.getQuestions);
app.post('/question', checkAdmin, QuestionController.create);
app.post('/del-quest/:id', checkAdmin, QuestionController.remove);

app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);    //  registerValidator, handleValidationErrors,
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);     //  loginValidator, handleValidationErrors,
app.post('/check-user', UserController.checkUser);
app.patch('/auth-data', checkAuth, UserController.update);
app.patch('/rsvp-date', checkAuth, UserController.updateRsvpDate);
app.patch('/rsvp-status', checkAuth, UserController.updateRsvpStatus);
app.patch('/auth-nick', nicknameValidator, handleValidationErrors, checkAuth, UserController.updateNick);
app.patch('/auth-email', emailValidator, handleValidationErrors, checkAuth, UserController.updateEmail);
app.patch('/auth-pass', passwordValidator, handleValidationErrors, checkAuth, UserController.updatePassword);
app.get('/auth', checkAuth,  UserController.getMe);       // checkAuth,
app.get('/find-user/:name', checkAuth,  UserController.getUser);
app.get('/add-friend/:id', checkAuth,  UserController.addFriend);
app.get('/conf-req/:id', checkAuth,  UserController.consfirmRequest);
app.get('/reject-req/:id', checkAuth,  UserController.rejectRequest);
app.delete('/request/:id', checkAuth,  UserController.deleteRequest);
app.post('/friends', checkAuth,  UserController.getFriends);
app.delete('/friends/:id', checkAuth,  UserController.removeFriend); 
app.delete('/auth/:id', checkAuth, UserController.remove);  // checkAuth,

app.patch('/payment', checkAuth, PaymentController.create);
app.post('/payment-notification', checkIp, PaymentController.payments);   //    checkIp,

app.post('/answer', checkAuth, AnsweredController.create);
app.get('/answer/:id', checkAuth, AnsweredController.getAnwereds);
app.delete('/answer/:id', checkAuth, AnsweredController.remove);

app.post('/message', checkAuth, MessageController.create);
app.get('/messages/:id', checkAuth, MessageController.getMessages);
app.delete('/message/:id', checkAuth, MessageController.remove);

app.post('/questions', checkAuth, QuestionController.getQuestions);
app.get('/all-quest', checkAuth, QuestionController.getAll);

app.post('/new-game', checkAuth, GameController.create);
app.post('/games', checkAuth, GameController.getGames);
app.post('/begin-game/:id', checkAuth, GameController.begin);
app.get('/game/:id', checkAuth, GameController.getGame);
app.get('/join/:id', checkAuth, GameController.acceptGame);
app.delete('/game/:id', checkAuth, GameController.removeGame);

const checkout = new YooCheckout({
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
});

/*const checkout = new YooCheckout({
    shopId: "221233",
    secretKey: "test_mGh_5MA29l9hMycoiWrGNFKVWAgNbOclNpRy5h_HtY0"
});*/

app.post('/create-payment', async (req, res) => {
    
    const createPayload = {
        amount: {
            value: req.body.price,
            currency: 'RUB'
        },
        payment_method_data: {
            type: 'bank_card'
        },
        capture:true,
        confirmation: {
            type: 'redirect',
            return_url: `http://localhost:3000`
        },
    };

    try {
        await checkout.createPayment(createPayload, req.body.idempotenceKey).then((data) => res.send(data));
        
    } catch (error) {
        res.send(error);
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`App listening on ${port}! `);
});