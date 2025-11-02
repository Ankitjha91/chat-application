import express from "express";
import { isAuthenticated } from '../middlewares/auth.middlewares.js';
import { sendMessage } from '../controllers/message.controllers.js';
import { getMessage } from '../controllers/message.controllers.js';

const router = express.Router();

router.post ('/send/:receiverId', isAuthenticated, sendMessage);
router.get('/get-message/:participantId', isAuthenticated, getMessage);



export default router;  