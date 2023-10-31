// middleware для проверки IP адресов
import ipRangeCheck from 'ip-range-check'

const allowedIPs = [
    '185.71.76.0/27',
    '185.71.77.0/27',
    '77.75.153.0/25',
    '77.75.156.11',
    '77.75.156.35',
    '77.75.154.128/25',
    '2a02:5180::/32',
];

export default (req, res, next) => {
    
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // получаем IP-адрес клиента
    const isAllowed = allowedIPs.some((ip) =>
        ipRangeCheck(clientIp, ip)
    ); // проверяем, находится ли IP-адрес в списке допустимых

    if (isAllowed) {
        next(); // если IP-адрес допустимый, продолжаем выполнение запроса
    } else {
        res.status(403).send('Access denied. Your IP address is not allowed.'); // если IP-адрес недопустимый, отправляем ответ с ошибкой 403
    }
}