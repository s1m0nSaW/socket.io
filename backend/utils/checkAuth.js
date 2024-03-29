import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const secret = process.env.SKEY

export default (req, res, next) => {
  const token = (req.body.token || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, secret);
      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: 'Нет доступа',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа',
    });
  }
};