import jwt from 'jsonwebtoken';

export default function requireAuth(req, res, next) {
  var token = req.cookies && req.cookies.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
}
