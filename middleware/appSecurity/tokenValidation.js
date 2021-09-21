import jwt from 'jsonwebtoken';
import constant from '../../constants/index.js';
import UserTokensModel from '../../model/userTokens.js';
const extractTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } 
    return undefined;
  };
  
export const validateToken = async (req, res, next) => {

    let token = await extractTokenFromHeader(req);
    if(!token){
      return res
      .status(401)
      .json({ errorMsg: 'Access is denied, Please login again!' });
    }
    token = token.replace(/\"/g, "")
    const user = jwt.verify(token, constant.jwtSecret);
    if (!user) {
      return res
        .status(401)
        .json({ errorMsg: 'Access is denied, Please login again!' });
    }
    const tokenCheck = await UserTokensModel.findOne({userId:user.userId,tokens: token});
    if (!tokenCheck) {
        return res
          .status(401)
          .json({ errorMsg: 'Access is denied, Please login again!' });
      }
    req.userId = user.userId
    next();
  };

export default {
    validateToken,
};

