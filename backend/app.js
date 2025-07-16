import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { setupSocket } from './src/socet.js'
import { deactivateALLDevice } from './src/device/deviceFunctions.js';


import { login, register, logout } from './src/login.js';
import { verifyToken } from './src/token.js';
import admin from './src/admin.js';
import user from './src/user.js';
import session from './src/session.js';
import device from './src/device.js';


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "http://192.168.16.225"],
        credentials: true
    }
});

app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://192.168.16.225"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.post('/logout', logout);
app.post('/login', login);
app.post('/register', register);

app.use('/device', device);

app.use(verifyToken);

app.use('/admin', admin);
app.use('/user', user);
app.use('/session', session);

setupSocket(io);

server.listen(5000, "0.0.0.0", () => {
    console.log("Server is running on port 5000");
    deactivateALLDevice();
})


process.on('SIGINT', async () => {
    await deactivateALLDevice();
});

process.on('SIGTERM', async () => {
    await deactivateALLDevice();
});

process.on('uncaughtException', async (err) => {
    await deactivateALLDevice();
});

process.on('unhandledRejection', async (reason) => {
    await deactivateALLDevice();
});

