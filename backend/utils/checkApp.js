import dotenv from 'dotenv';
import crypto from 'crypto'

dotenv.config()

const skey = process.env.SKEY

export default (req, res, next) => {
    
    const clientSecret = skey;
    const signParam = req.body.appKey;

    const hashParams = {
    app_id: 51864614, // Добавляем идентификатор приложения
    request_id: req.body.request_id, // Присваиваем значение параметра payload
    ts: req.body.ts, // Время создания подписи
    user_id: req.body.user_id, // Добавляем идентификатор пользователя
    };

    // Формируем строку для вычисления подписи
    let signParamsQuery = Object.keys(hashParams).map(key => `${key}=${hashParams[key]}`).join('&');

    // Формируем подпись, используя защищённый ключ приложения (метод HMAC)
    const sign = crypto.createHmac('sha256', clientSecret).update(signParamsQuery).digest('base64');

    // Сравниваем полученную строку со значением из VKWebAppCreateHash
    const status = sign === signParam;

    console.log((status ? 'ok' : 'fail'));
    console.log('my key:', sign);
    console.log('my key:', signParam);
    if(status){
        next()
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
}