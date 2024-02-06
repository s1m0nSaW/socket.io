import express from "express";
import { YooCheckout } from '@a2seven/yoo-checkout';
import dotenv from 'dotenv';
import multer from 'multer';

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
import * as RaitingController from './controllers/RatingController.js';
import * as StatController from './controllers/StatController.js';

const router = express.Router();

const checkout = new YooCheckout({
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
});

dotenv.config();

/*const checkout = new YooCheckout({
    shopId: "221233",
    secretKey: "test_mGh_5MA29l9hMycoiWrGNFKVWAgNbOclNpRy5h_HtY0"
});*/

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/app/uploads'); // убедитесь, что папка uploads существует
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

router.get("/", (req, res) => {
    res.send("Hello World!!!")
})

router.post('/upload', checkAuth, upload.single('image'), UserController.updatePic);

router.post('/user/:name', UserController.getUser);
router.post('/get-all', checkAdmin, UserController.getAll);
router.post('/admin/:id', checkAdmin, UserController.remove);
router.post('/sponsor/:id', checkAdmin, UserController.updateSponsor);
router.post('/quests', checkAdmin, QuestionController.getAll);
router.post('/theme', checkAdmin, QuestionController.getQuestions);
router.post('/question', checkAdmin, QuestionController.create);
router.post('/del-quest/:id', checkAdmin, QuestionController.remove);
router.post('/rating', checkAdmin, RaitingController.create);
router.post('/ratings', checkAdmin, RaitingController.getAll);
router.post('/del-rating/:id', checkAdmin, RaitingController.remove);
router.post('/stats', checkAdmin, StatController.getAll);

router.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);    //  registerValidator, handleValidationErrors,
router.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);     //  loginValidator, handleValidationErrors,
router.post('/check-user', UserController.checkUser);
router.patch('/patch-rsvp', checkAuth, UserController.patchRsvp);
router.patch('/auth-data', checkAuth, UserController.update);
router.patch('/rsvp-date', checkAuth, UserController.updateRsvpDate);
router.patch('/rsvp-status', checkAuth, UserController.updateRsvpStatus);
router.patch('/auth-nick', nicknameValidator, handleValidationErrors, checkAuth, UserController.updateNick);
router.patch('/auth-email', emailValidator, handleValidationErrors, checkAuth, UserController.updateEmail);
router.patch('/auth-pass', passwordValidator, handleValidationErrors, checkAuth, UserController.updatePassword);
router.get('/auth', checkAuth,  UserController.getMe);       // checkAuth,
router.get('/find-user/:name', checkAuth,  UserController.getUser);
router.get('/get-user/:id', checkAuth,  UserController.getGameUser);
router.get('/add-friend/:id', checkAuth,  UserController.addFriend);
router.get('/conf-req/:id', checkAuth,  UserController.consfirmRequest);
router.get('/reject-req/:id', checkAuth,  UserController.rejectRequest);
router.delete('/request/:id', checkAuth,  UserController.deleteRequest);
router.post('/friends', checkAuth,  UserController.getFriends);
router.delete('/friends/:id', checkAuth,  UserController.removeFriend); 
router.delete('/auth/:id', checkAuth, UserController.remove);  // checkAuth,

router.post('/answer', checkAuth, AnsweredController.create);
router.post('/up-answer/:id', checkAuth, AnsweredController.update);
router.get('/answer/:id', checkAuth, AnsweredController.getAnwered);
router.get('/answereds/:id', checkAuth, AnsweredController.getAnwereds);
router.delete('/answer/:id', checkAuth, AnsweredController.remove);

router.post('/message', checkAuth, MessageController.create);
router.get('/messages/:id', checkAuth, MessageController.getMessages);
router.delete('/message/:id', checkAuth, MessageController.remove);

router.post('/questions', checkAuth, QuestionController.getQuestions);
router.get('/all-quest', checkAuth, QuestionController.getAll);

router.post('/new-game', checkAuth, GameController.create);
router.post('/games', checkAuth, GameController.getGames);
router.post('/begin-game/:id', checkAuth, GameController.begin);
router.post('/up-game/:id', checkAuth, GameController.update);
router.get('/game/:id', checkAuth, GameController.getGame);
router.get('/join/:id', checkAuth, GameController.acceptGame);
router.delete('/game/:id', checkAuth, GameController.removeGame);

router.post('/get-rating', checkAuth, RaitingController.getRating);
router.post('/up-rating/:id', checkAuth, RaitingController.update);
router.get('/all-rates', checkAuth, RaitingController.getAll);

router.patch('/payment', checkAuth, PaymentController.create);
router.post('/payment-notification',checkIp, PaymentController.payments);   //    checkIp,
router.post('/create-payment', async (req, res) => {
    const createPayload = {
        amount: {
            value: req.body.price,
            currency: 'RUB'
        },
        capture:true,
        confirmation: {
            type: 'redirect',
            return_url: `https://ochem.ru`
        },
    };

    try {
        await checkout.createPayment(createPayload, req.body.idempotenceKey).then((data) => res.send(data));
        
    } catch (error) {
        res.send(error);
    }
});

export default router;