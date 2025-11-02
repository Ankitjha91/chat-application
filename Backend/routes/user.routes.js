import express from 'express';
import {register, login,} from '../controllers/user.controllers.js';
import { isAuthenticated } from '../middlewares/auth.middlewares.js';
import { getProfile } from '../controllers/user.controllers.js';
import { logout } from '../controllers/user.controllers.js';
import { getOtherUsers } from '../controllers/user.controllers.js';

const router = express.Router();

router.post ('/register', register);
router.post ('/login', login);
router.get ('/get-profile', isAuthenticated ,getProfile);
router.post ('/logout', isAuthenticated ,logout);
router.get ('/get-other-users', isAuthenticated ,getOtherUsers);

export default router;  