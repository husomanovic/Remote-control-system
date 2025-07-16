import express from 'express';
import { verifyUser } from './token.js';
import { userData, updatePhoto, changeName, myDevices, verifySession } from './user/userData.js';


const user = express();

user.use(verifyUser);

user.get('/verify', (req, res) => res.status(200).json({ message: "Success" }));

user.get('/data', userData);

user.get('/myDevices', myDevices);

user.get('/verifySession/:session', verifySession);

user.post('/updatePhoto', updatePhoto);

user.post('/changeName', changeName);




export default user;