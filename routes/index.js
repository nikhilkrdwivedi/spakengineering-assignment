import {Router} from 'express';
const mainRouter =  Router();

import authRouter from './authRouter.js';
import userRouter from './userRouter.js';

mainRouter.use('/auth',authRouter);
mainRouter.use('/user',userRouter);

export default mainRouter;