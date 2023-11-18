import dotenv from 'dotenv';
import ipRangeCheck from 'ip-range-check'

dotenv.config()

const password1 = process.env.PASSWORD1
const password2 = process.env.PASSWORD2
const password3 = process.env.PASSWORD3
const allowedIPs = [
  '94.245.148.18',
  '46.48.249.71',
  '46.48.236.79',
  '::1',
];

export default (req, res, next) => {
    const pass1 = req.body.pass1;
    const pass2 = req.body.pass2;
    const pass3 = req.body.pass3;
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // получаем IP-адрес клиента
    //console.log(pass)
    const isAllowed = allowedIPs.some((ip) =>
        ipRangeCheck(clientIp, ip)
    ); // проверяем, находится ли IP-адрес в списке допустимых
    try {
      if(pass1 === password1 && pass2 === password2 && pass3 === password3){
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