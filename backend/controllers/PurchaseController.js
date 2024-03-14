import ItemModel from "../models/Item.js";
import UserModel from "../models/User.js";
import OrderModel from "../models/Order.js";
import md5 from "md5";
import dotenv from 'dotenv';

dotenv.config();

const SIG = process.env.SIG;

export const purchase = async (request, response) => {
    var requestData = "";
    var requestParams = {};
    let responseData;

    // Получение данных
    request
        .on("data", (chunk) => {
            requestData += chunk;
        })
        .on("end", () => {
            // Формируем список параметров
            let s = String(requestData).split("&");
            s.map((item) => {
                let [k, v] = item.split("=");
                // Декодируем строки.
                // Код функции PHPUrlDecode() приведён ниже.
                requestParams[k] = PHPUrlDecode(v);
            });

            // Проверка подписи
            // Код функции calcSignature() приведён ниже.
            if (calcSignature(requestParams) == requestParams.sig) {
                // Обрабатываем запрос
                switch (requestParams.notification_type) {
                    case "get_item":
                        responseData = handleGetItem(requestParams);
                        // Отправляем ответ
                        console.log('Отправили ответ в вк: ', responseData);
                        response.status(200).json(responseData);
                        break;
                    case "get_item_test":
                        responseData = handleGetItem(requestParams);
                        // Отправляем ответ
                        console.log('Отправили ответ в вк: ', responseData);
                        response.status(200).json(responseData);
                        break;
                    case "order_status_change":
                        responseData = handleOrderStatusChange(requestParams);
                        s = JSON.stringify(responseData);
                        console.log('Отправили ответ в вк: ', s);
                        response.end(s);
                        break;
                    case "order_status_change_test":
                        responseData = handleOrderStatusChange(requestParams);
                        s = JSON.stringify(responseData);
                        console.log('Отправили ответ в вк: ', s);
                        response.end(s);
                        break;
                }
            } else {
                console.log("Несовпадение переданной и вычисленной подписи")
                responseData = {
                    // Ошибка подписи
                    error: {
                        error_code: 20,
                        error_msg:
                            "Несовпадение переданной и вычисленной подписи",
                        critical: true,
                    },
                };
                // Отправляем ответ
                s = JSON.stringify(responseData);
                console.log('Отправили ответ в вк: ', s);
                response.end(s);
            }
        });
};

// Вычисление подписи
function calcSignature(params) {
    const ACCESS_KEY = SIG; // Ключ доступа приложения

    // Сортируем параметры
    let keys = Object.keys(params);
    keys.sort();

    // Формируем строку из пар 'параметр=значение'
    let str = "";
    keys.map((item) => {
        if (item != "sig") {
            str += item + "=" + params[item];
        }
    });
    str = str + ACCESS_KEY; // Добавляем ключ доступа

    // Вычисляем подпись
    let calculatedSignature = md5(str);

    return calculatedSignature;
}

// Обработчик уведомления get_item
const handleGetItem = async (params) => {
    let responseData;
    // Получаем информацию о товаре
    const item = await ItemModel.findOne({ item: params.item });

    // Возвращаем ответ
    if (item) {
        responseData = {
            response: {
                title: item.title,
                price: item.price,
                item_id: item.item,
                expiration: 3600,
              },
        };
        console.log("Айди товара найден", responseData)
        return responseData;
        
    } else {
        console.log("Товара не существует")
        responseData = {
            error: {
                error_code: 20,
                error_msg: "Товара не существует",
                critical: true,
            },
        };
        return responseData;
    }
}

// Обработчик уведомления order_status_change
const handleOrderStatusChange = async (params) => {
    let responseData;
    const item = await ItemModel.findOne({ item_id: params.item });
    const user = await UserModel.findOne({ vkid: params.receiver_id });
    switch (params.status) {
        case "chargeable":
            // Предоставляем товар в приложении
            if(item.type = 'rsvp'){
                user.rsvp += item.count;
                console.log('Пользователю rsvp успешно начислены')
                await user.save();
            }

            // Формируем ответ
            let appOrder = params.date; // Идентификатор заказа в приложении
            
            // Сохраняем информацию о заказе в приложении
            const doc = new OrderModel({
                item: params.item,
                item_id: params.item_id,
                order_id: params.order_id,
                user_id: params.user_id,
                receiver_id: params.receiver_id,
                app_order_id: appOrder,
            });
    
            const saved_doc = await doc.save();
            if(saved_doc){
                console.log('Сохранили информацию о заказе в приложении')
            } else {
                console.log('Не смогли сохранить информацию о заказе в приложении')
            }

            responseData = {
                response: {
                    order_id: params.order_id,
                    app_order_id: appOrder,
                },
            };

            break;

        case "refund":
            // Обрабатываем возврат
            if(item.type = 'rsvp'){
                user.rsvp -= item.count;
                await user.save();
            }
            responseData = {
                response: {
                    order_id: params.order_id,
                    app_order_id: params.date,
                },
            };
            console.log("Обработан возврат")
            break;
        default:
            console.log("Ошибка в структуре данных")
            responseData = {
                error: {
                    error_code: 11,
                    error_msg: "Ошибка в структуре данных",
                    critical: true,
                },
            };
    }

    return responseData;
}

// Служебная функция для декодирования строк
// из формата PHP URL-encoded
function PHPUrlDecode(str) {
    return decodeURIComponent(
        str
            .replace(/%21/g, "!")
            .replace(/%27/g, "'")
            .replace(/%28/g, "(")
            .replace(/%29/g, ")")
            .replace(/%2A/g, "*")
            .replace(/%7E/g, "~")
            .replace(/\+/g, "%20")
    );
}
