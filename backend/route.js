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
import * as PurchaseController from './controllers/PurchaseController.js';
import * as ItemController from './controllers/ItemController.js';
import * as ComplimentController from './controllers/ComplimentController.js'

const router = express.Router();

const checkout = new YooCheckout({
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
});

dotenv.config();

router.get("/", (req, res) => {
    res.send("Hello World!!!")
})

router.post('/purchase', PurchaseController.purchase)
router.post('/admin/:id', checkAdmin, UserController.remove);
router.post('/sponsor/:id', checkAdmin, UserController.updateSponsor);
router.post('/remove-all-users', checkAdmin, UserController.removeAll);
router.post('/quests', checkAdmin, QuestionController.getAll);
router.post('/theme', checkAdmin, QuestionController.getQuestions);
router.post('/question', checkAdmin, QuestionController.create);
router.post('/add-questions', checkAdmin, QuestionController.createMany);
router.post('/del-quest/:id', checkAdmin, QuestionController.remove);
router.post('/del-questions', checkAdmin, QuestionController.removeMany);
router.post('/rating', checkAdmin, RaitingController.create);
router.post('/ratings', checkAdmin, RaitingController.getAll);
router.post('/add-ratings', checkAdmin, RaitingController.createMany);
router.post('/del-rating/:id', checkAdmin, RaitingController.remove);
router.post('/stats', checkAdmin, StatController.getAll);
router.post('/add-item', checkAdmin, ItemController.create);
router.post('/items', checkAdmin, ItemController.getItems);
router.post('/del-item/:id', checkAdmin, ItemController.remove);
router.post('/orders', checkAdmin, ItemController.getOrders);
router.post('/del-order/:id', checkAdmin, ItemController.removeOrder);
router.post('/get-all-games', checkAdmin, GameController.getAllGames);
router.post('/delete-games', checkAdmin, GameController.removeAllGames);
router.post('/delete-answereds', checkAdmin, GameController.removeAllAnswereds);
router.post('/delete-messages', checkAdmin, GameController.removeAllMessages);
router.post('/get-all-answereds', checkAdmin, AnsweredController.getAnwereds);
router.post('/remove-all-comps', checkAdmin, ComplimentController.removeAll);
router.post('/del-compliment/:id', checkAdmin, ComplimentController.remove);
router.post('/get-all-comps', checkAdmin, ComplimentController.getAll);

router.post('/auth/register', UserController.register);
router.patch('/after-ads', checkAuth, UserController.afterAds);
router.patch('/rsvp-date', checkAuth, UserController.updateRsvpDate);
router.patch('/rsvp-status', checkAuth, UserController.updateRsvpStatus);
router.post('/auth', UserController.getMe);
router.post('/get-user', UserController.getUser);
router.get('/auth', UserController.getAll);
router.post('/get-token', UserController.getToken);
router.post('/promoter', checkAuth, UserController.updatePromoter);

router.post('/answer', checkAuth, AnsweredController.create);
router.post('/up-answer/:id', checkAuth, AnsweredController.update);
router.post('/answer/:id', checkAuth, AnsweredController.getAnwered);
router.post('/answereds/:id', checkAuth, AnsweredController.getAnwereds);
router.post('/del-answer/:id', checkAuth, AnsweredController.remove);

router.post('/message', checkAuth, MessageController.create);
router.post('/messages/:id', checkAuth, MessageController.getMessages);
router.post('/del-message/:id', checkAuth, MessageController.remove);

router.post('/compliment', checkAuth, ComplimentController.create);
router.post('/compliments', checkAuth, ComplimentController.getMy);

router.post('/questions', checkAuth, QuestionController.getQuestions);
router.post('/all-quest', checkAuth, QuestionController.getAll);

router.post('/new-game', checkAuth, GameController.create);
router.post('/games', checkAuth, GameController.getGames);
router.post('/begin-game/:id', checkAuth, GameController.begin);
router.post('/up-game/:id', checkAuth, GameController.update);
router.post('/game/:id', checkAuth, GameController.getGame);
router.post('/join/:id', checkAuth, GameController.acceptGame);
router.post('/del-game', checkAuth, GameController.removeGame);

router.post('/get-rating', checkAuth, RaitingController.getRating);
router.post('/up-rating/:id', checkAuth, RaitingController.update);
router.post('/all-rates', checkAuth, RaitingController.getAll);

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