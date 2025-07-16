import express from 'express';
import { mySession, createSession, deleteSession, terminateSession } from './session/sessionFunctions.js';


const session = express();

session.get('/mySession', mySession);

session.post('/createSession', createSession);

session.delete('/deleteSession/:sessionId', deleteSession);

session.put('/terminateSession/:sessionId', terminateSession);


export default session;