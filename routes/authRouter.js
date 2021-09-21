import {Router} from 'express';
const authRouter =  Router();

import { login, register, verifyToken, logout } from '../controller/authController.js';
import {registerValidation} from '../middleware/requestValidator/auth.js';
import {validateToken} from '../middleware/appSecurity/tokenValidation.js';

authRouter.post('/login',login);
authRouter.post('/register',registerValidation, register);
authRouter.get('/verify-token/',validateToken, verifyToken);
authRouter.delete('/logout',validateToken, logout);

export default authRouter;