import ItemModel from "../models/Item.js";
import ComplimentModel from "../models/Compliment.js";
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
        .on("end", async () => {
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
                        responseData = await handleGetItem(requestParams);
                        // Отправляем ответ
                        response.status(200).json(responseData);
                        break;
                    case "get_item_test":
                        responseData = await handleGetItem(requestParams);
                        // Отправляем ответ
                        response.status(200).json(responseData);
                        break;
                    case "get_subscription":
                        responseData = await handleGetSubscription(requestParams);
                        // Отправляем ответ
                        response.status(200).json(responseData);
                        break;
                    case "get_subscription_test":
                        responseData = await handleGetSubscription(requestParams);
                        // Отправляем ответ
                        response.status(200).json(responseData);
                        break;
                    case "order_status_change":
                        responseData = await handleOrderStatusChange(requestParams);
                        s = JSON.stringify(responseData);
                        response.end(s);
                        break;
                    case "order_status_change_test":
                        responseData = await handleOrderStatusChange(requestParams);
                        s = JSON.stringify(responseData);
                        response.end(s);
                        break;
                    case "subscription_status_change":
                        responseData = await handleSubscriptionStatusChange(requestParams);
                        s = JSON.stringify(responseData);
                        response.end(s);
                        break;
                    case "subscription_status_change_test":
                        responseData = await handleSubscriptionStatusChange(requestParams);
                        s = JSON.stringify(responseData);
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
    const items = ["sale_item_3", "sale_item_1", "sale_item_2", "sale_item_subscription_1", "sale_item_subscription_2"]
    let responseData;

    const found = items.includes(params.item)
    if(found){
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
                    photo_url: item.photo_url,
                },
            };
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
    } else {
        const item = await ComplimentModel.findOne({ _id: params.item });
        if (item) {
            responseData = {
                response: {
                    title: item.title,
                    price: item.price,
                    item_id: item._id,
                    expiration: 3600,
                },
            };
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
    
}

const handleGetSubscription = async (params) => {
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
                period: item.period,
                photo_url: item.photo_url,
              },
        };
        console.log("Айди товара найден", responseData)
        return responseData;
        
    } else {
        console.log("Ошибка обновления информации на сервере. Попробуйте ещё раз позже.")
        responseData = {
            error: {
                error_code: 1,
                error_msg: "Ошибка обновления информации на сервере. Попробуйте ещё раз позже.",
                critical: true,
            },
        };
        return responseData;
    }
}

// Обработчик уведомления order_status_change
const handleOrderStatusChange = async (params) => {
    let responseData;
    const items = ["sale_item_3", "sale_item_1", "sale_item_2", "sale_item_subscription_1", "sale_item_subscription_2"]
    
    switch (params.status) {
        case "chargeable":
            const found = items.includes(params.item)
            if(found){
                // Предоставляем товар в приложении
                const item = await ItemModel.findOne({ item: params.item });
                const user = await UserModel.findOne({ vkid: params.user_id });
                if(item?.type === 'rsvp'){
                    if(user){
                        user.rsvp += item.count;
                        await user.save();
                    }
                }

                // Формируем ответ
                let appOrder = params.date; // Идентификатор заказа в приложении
                
                // Сохраняем информацию о заказе в приложении
                const doc = new OrderModel({
                    type: 'order',
                    item: params.item,
                    item_id: params.item_id,
                    order_id: params.order_id,
                    user_id: params.user_id,
                    receiver_id: params.receiver_id,
                    app_order_id: appOrder,
                });
        
                await doc.save();

                responseData = {
                    response: {
                        order_id: params.order_id,
                        app_order_id: appOrder,
                    },
                };

                break;
            } else {
                const item = await ComplimentModel.findOne({ _id: params.item });
                item.active = true;
                await item.save();

                // Формируем ответ
                let appOrder = params.date; // Идентификатор заказа в приложении
                
                // Сохраняем информацию о заказе в приложении
                const doc = new OrderModel({
                    type: 'order',
                    item: params.item,
                    item_id: params.item_id,
                    order_id: params.order_id,
                    user_id: params.user_id,
                    receiver_id: params.receiver_id,
                    app_order_id: appOrder,
                });
        
                await doc.save();

                responseData = {
                    response: {
                        order_id: params.order_id,
                        app_order_id: appOrder,
                    },
                };

                break;
            }
            

        case "refund":
            // Обрабатываем возврат
            const _found = items.includes(params.item)
            if(_found){
                const _item = await ItemModel.findOne({ item: params.item });
                const _user = await UserModel.findOne({ vkid: params.receiver_id });
                if(_item?.type === 'rsvp'){
                    _user.rsvp -= _item.count;
                    await _user.save();
                }
                responseData = {
                    response: {
                        order_id: params.order_id,
                        app_order_id: params.date,
                    },
                };
                break;
            } else {
                const compliment = await ComplimentModel.findOne({ _id: params.item });
                compliment.active = false;
                await compliment.save();
                responseData = {
                    response: {
                        order_id: params.order_id,
                        app_order_id: params.date,
                    },
                };
                break;
            }
            
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

const handleSubscriptionStatusChange = async (params) => {
    let responseData;
    const subscriptionOrder = await OrderModel.findOne({ order_id: params.subscription_id });
    let user = await UserModel.findOne({ vkid: params.user_id });
    let appOrder = +new Date(); // Идентификатор заказа в приложении
    
    switch (params.status) {
        case "chargeable":
            // Предоставляем товар в приложени
            if(user) {
                try {
                    user.status = "sponsor";
                    user.dailyRsvp = 10;
                    user.statusDate = params.next_bill_time;
                    await user.save();
                } catch (error) {
                    console.log('Ошибка premium')
                }
            } else {
                console.log('Пользователь не найден');
            }
            // Формируем ответ

            if(subscriptionOrder) {
                responseData = {
                    response: {
                        subscription_id: params.subscription_id,
                        app_order_id: subscriptionOrder.app_order_id,
                    },
                };
            } else {
                // Сохраняем информацию о заказе в приложении
                const doc = new OrderModel({
                    type: 'subscription',
                    item_id: params.item_id,
                    user_id: params.user_id,
                    app_order_id: appOrder,
                    order_id: params.subscription_id,
                    cancel_reason: params.cancel_reason, // only subscription
                });
        
                await doc.save();

                responseData = {
                    response: {
                        subscription_id: params.subscription_id,
                        app_order_id: appOrder,
                    },
                };
            }

            break;

        case "active":
            if(subscriptionOrder){
                responseData = {
                    response: {
                        subscription_id: params.subscription_id,
                        app_order_id: subscriptionOrder.app_order_id,
                    },
                };
            } else {
                responseData = {
                    response: {
                        subscription_id: params.subscription_id,
                        app_order_id: appOrder,
                    },
                };
            }
            break;
        case "cancelled":
            // Обрабатываем возврат
            user.status = 'none';
            user.dailyRsvp = 1;
            user.statusDate = 0;
            await user.save();
            
            if(subscriptionOrder){
                responseData = {
                    response: {
                        subscription_id: params.subscription_id,
                        app_order_id: subscriptionOrder.app_order_id,
                    },
                };
            } else {
                responseData = {
                    response: {
                        subscription_id: params.subscription_id,
                        app_order_id: appOrder,
                    },
                };
            }
            console.log("Обработан возврат")
            break;
        default:
            console.log("При обработке произошла ошибка на сервере. Попробуйте ещё раз позже.")
            responseData = {
                error: {
                    error_code: 1,
                    error_msg: "При обработке произошла ошибка на сервере. Попробуйте ещё раз позже.",
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
