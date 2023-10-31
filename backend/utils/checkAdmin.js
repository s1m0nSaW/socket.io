import dotenv from 'dotenv';
import ipRangeCheck from 'ip-range-check'

dotenv.config()

const password = process.env.PASSWORD
const allowedIPs = [
  '94.245.148.18',
  '46.48.249.71',
  '::1',
];

export default (req, res, next) => {
    const pass = req.body.pass;
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // получаем IP-адрес клиента
    //console.log(pass)
    const isAllowed = allowedIPs.some((ip) =>
        ipRangeCheck(clientIp, ip)
    ); // проверяем, находится ли IP-адрес в списке допустимых
    try {
      if(pass === password && isAllowed){
        next()
      } else {
        return res.status(403).json({
          message: 'Нет доступа',
        });
      }
    } catch (e) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  }