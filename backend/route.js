import express from "express";
import { YooCheckout } from '@a2seven/yoo-checkout';
import dotenv from 'dotenv';

import checkAdmin from './utils/checkAdmin.js';
import checkIp from './utils/checkIp.js';
import checkApp from "./utils/checkApp.js";

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

router.get("/", (req, res) => {
    res.send("Hello World!!!")
})

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

router.post('/auth/register', checkApp, UserController.register);
router.patch('/rsvp-date', checkApp, UserController.updateRsvpDate);
router.patch('/rsvp-status', checkApp, UserController.updateRsvpStatus);
router.post('/auth', UserController.getMe);
router.delete('/auth/:id', checkApp, UserController.remove);

router.post('/answer', checkApp, AnsweredController.create);
router.post('/up-answer/:id', checkApp, AnsweredController.update);
router.get('/answer/:id', checkApp, AnsweredController.getAnwered);
router.get('/answereds/:id', checkApp, AnsweredController.getAnwereds);
router.delete('/answer/:id', checkApp, AnsweredController.remove);

router.post('/message', checkApp, MessageController.create);
router.get('/messages/:id', checkApp, MessageController.getMessages);
router.delete('/message/:id', checkApp, MessageController.remove);

router.post('/questions', checkApp, QuestionController.getQuestions);
router.get('/all-quest', checkApp, QuestionController.getAll);

router.post('/new-game', checkApp, GameController.create);
router.post('/games', checkApp, GameController.getGames);
router.post('/begin-game/:id', checkApp, GameController.begin);
router.post('/up-game/:id', checkApp, GameController.update);
router.get('/game/:id', checkApp, GameController.getGame);
router.get('/join/:id', checkApp, GameController.acceptGame);
router.delete('/game/:id', checkApp, GameController.removeGame);

router.post('/get-rating', checkApp, RaitingController.getRating);
router.post('/up-rating/:id', checkApp, RaitingController.update);
router.get('/all-rates', checkApp, RaitingController.getAll);

router.patch('/payment', checkApp, PaymentController.create);
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