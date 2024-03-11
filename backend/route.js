import express from "express";
import { YooCheckout } from '@a2seven/yoo-checkout';
import dotenv from 'dotenv';

import checkAdmin from './utils/checkAdmin.js';
import checkIp from './utils/checkIp.js';
import checkAuth from "./utils/checkAuth.js";

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

router.post('/auth/register', UserController.register);
router.patch('/rsvp-date', checkAuth, UserController.updateRsvpDate);
router.patch('/rsvp-status', checkAuth, UserController.updateRsvpStatus);
router.post('/auth', UserController.getMe);
router.get('/auth', UserController.getAll);
router.delete('/auth/:id', UserController.remove);

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