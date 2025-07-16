import express from 'express';
import { verifySession, verifyDeveice } from './device/deviceFunctions.js';


const device = express();

device.post('/verifySession', verifySession);
device.post('/verifyDevice', verifyDeveice);



export default device;