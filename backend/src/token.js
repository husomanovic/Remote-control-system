import jwt from 'jsonwebtoken';
import 'dotenv/config';

const secretKey = process.env.JWT_SECRET_KEY;

const sendCookie = (res, user) => {
    const token = jwt.sign(user, secretKey, { expiresIn: '72h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 259200000, // 3 dana
        path: '/',
    });
}

const verifyToken = (req, res, next) => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.token = decoded;
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();

}

const verifyAdmin = (req, res, next) => {
    if (req.token.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
}

const verifyUser = (req, res, next) => {
    if (req.token.role !== 'user' && req.token.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    next();
}

const createSessionToken = (session) => {
    return jwt.sign(session, secretKey, { expiresIn: '5m' });
}
const verifySessionToken = (token) => {
    return jwt.verify(token, secretKey);
}


export { sendCookie, verifyToken, verifyAdmin, verifyUser, createSessionToken, verifySessionToken };