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
import * as RequestController from './controllers/RequestController.js';
import * as PostController from './controllers/PostController.js';
import * as PartnerController from './controllers/PartnerController.js';

dotenv.config()

const port = process.env.PORT || 5000

const mongooseUrl = `mongodb://0.0.0.0:27017/folls` // localhost
const url1 = `mongodb://mongo:27017/folls` //нужно поменять перед деплойем

mongoose.set("strictQuery", false);
mongoose
    .connect(url1, { useNewUrlParser: true, useUnifiedTopology: true })
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

app.post('/get-all',checkAdmin, UserController.getAll);
app.post('/user/:name', UserController.getUser);
app.patch('/update/:id',checkAdmin, UserController.upgrade);
app.delete('/admin/:id', checkAdmin, UserController.remove);
app.post('/admi/requests', checkAdmin, RequestController.getAllRequests);
app.patch('/admi/requests', checkAdmin, RequestController.updateStatus);
app.delete('/admi/request/:id', checkAdmin, RequestController.remove);
app.post('/admi/posts', checkAdmin, PostController.getPosts);
app.post('/admi/post', checkAdmin, PostController.create);
app.patch('/admi/post', checkAdmin, PostController.update);
app.post('/admi/delete-post/:id', checkAdmin, PostController.remove);
app.post('/admi/partners', checkAdmin, PartnerController.getParnters);
app.post('/admi/delete-partner/:id', checkAdmin, PartnerController.remove);

app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register);    //  registerValidator, handleValidationErrors,
app.post('/auth/login', loginValidator, handleValidationErrors, UserController.login);     //  loginValidator, handleValidationErrors,
app.post('/check-user', UserController.checkUser);
app.patch('/auth-nick', nicknameValidator, handleValidationErrors, checkAuth, UserController.updateNick);
app.patch('/auth-email', emailValidator, handleValidationErrors, checkAuth, UserController.updateEmail);
app.patch('/auth-pass', passwordValidator, handleValidationErrors, checkAuth, UserController.updatePassword);
app.patch('/requisites', checkAuth, UserController.requisites);
app.patch('/payment', checkAuth, UserController.updatePayment);
app.get('/auth', checkAuth,  UserController.getMe);       // checkAuth,
app.delete('/auth/:id', checkAuth, UserController.remove);  // checkAuth,
app.get('/auth/partner', checkAuth,   UserController.isPartner);

app.get('/posts', checkAuth,   PostController.getPosts);
app.post('/reaction/:id', checkAuth,   PostController.like);

app.post('/partner', checkAuth, PartnerController.create);

app.post('/new-request', checkAuth, RequestController.create);
app.get('/requests', checkAuth, RequestController.getRequests);

app.post('/payment-notification', UserController.payments);   //    checkIp, 

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
            return_url: `https://communicationcompass.ru`
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

//    const date = +new Date + 864000000
    console.log(`App listening on ${port}! `);
});