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
import * as GameController from './controllers/GameController';
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

app.post('/upload', upload.single('image'), (req,res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/get-all', checkAdmin, UserController.getAll);
app.post('/user/:name', UserController.getUser);
app.delete('/admin/:id', checkAdmin, UserController.remove);

app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);    //  registerValidator, handleValidationErrors,
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);     //  loginValidator, handleValidationErrors,
app.post('/check-user', UserController.checkUser);
app.patch('/auth-data', checkAuth, UserController.update);
app.patch('/auth-nick', nicknameValidator, handleValidationErrors, checkAuth, UserController.updateNick);
app.patch('/auth-email', emailValidator, handleValidationErrors, checkAuth, UserController.updateEmail);
app.patch('/auth-pass', passwordValidator, handleValidationErrors, checkAuth, UserController.updatePassword);
app.get('/auth', checkAuth,  UserController.getMe);       // checkAuth,
app.delete('/auth/:id', checkAuth, UserController.remove);  // checkAuth,

app.patch('/payment', checkAuth, PaymentController.create);
app.post('/payment-notification', checkIp, PaymentController.payments);   //    checkIp,

app.post('/answer', checkAuth, AnsweredController.create);
app.get('/answer/:id', checkAuth, AnsweredController.getAnwereds);
app.delete('/answer/:id', checkAuth, AnsweredController.remove);

app.post('/message', checkAuth, MessageController.create);
app.get('/message/:id', checkAuth, MessageController.getMessages);
app.delete('/message/:id', checkAuth, MessageController.remove);

app.post('/question', checkAuth, QuestionController.create);
app.post('/questions', checkAuth, QuestionController.getQuestions);
app.delete('/question/:id', checkAuth, QuestionController.remove);

app.post('/new-game', checkAuth, GameController.create);
app.get('/my-games', checkAuth, GameController.getMyGames);
app.get('/app-games', checkAuth, GameController.getAppGames);
app.get('/game/:id', checkAuth, GameController.getGame);
app.post('/join-game', checkAuth, GameController.acceptGame);
app.delete('/game/:id', checkAuth, GameController.remove);

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