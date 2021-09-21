import {Router} from 'express';
const userRouter =  Router();

import { getUserList, getUserById } from '../controller/userController.js';
import {validateToken} from '../middleware/appSecurity/tokenValidation.js';

userRouter.get('/',validateToken, getUserList);
userRouter.get('/:userId',validateToken, getUserById);

export default userRouter;