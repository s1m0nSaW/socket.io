import dotenv from 'dotenv';
import forge from 'node-forge';

dotenv.config()

const skey = process.env.SKEY

export default (req, res, next) => {
    
    var client_secret = skey;
    var sign_param = req.body.appKey;

    const hashParams = {
        ts: req.body.ts, // Время создания подписи
        request_id: req.body.request_id, // Присваиваем значение параметра payload
        user_id: req.body.user_id, // Добавляем идентификатор пользователя
        app_id: 51864614 // Добавляем идентификатор приложения
    };

    // Сортируем список по ключам
    var hash_params = Object.keys(hash_params).sort().reduce((acc, key) => {
        acc[key] = hash_params[key];
        return acc;
        }, {});

    // Формируем строку для вычисления подписи
    var sign_params_query = Object.keys(hash_params).map(key => `${key}=${hash_params[key]}`).join('&');

    // Формируем подпись, используя защищённый ключ приложения (метод HMAC)
    var sign = forge.util.encode64(forge.md.hmacSha256.create().update(sign_params_query, 'utf8', client_secret).digest().getBytes());

    // Сравниваем полученную строку со значением из VKWebAppCreateHash
    var status = sign === sign_param;

    console.log('мой ключ:', sign);
    console.log('ключ vk:', sign);
    if(status){
        next()
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
}