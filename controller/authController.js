import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import UserModel from '../model/user.js';
import UserTokensModel from '../model/userTokens.js';
import constants from '../constants/index.js';
export const login = async (req, res) => {
    try {
        const loginUser = req.body;

        //get user data
        const user = await UserModel.findOne({ 'contact.phone': loginUser.contact.phone, 'contact.countryCode': loginUser.contact.countryCode });
        if (!user) {
            return res.status(400).json({ errorMsg: `Hey, are you sure you have register before. Please register!`, data: {} });
        }
        // compare passwords
        const match = bcrypt.compareSync(loginUser.password, user.password);
        if (!match) {
            return res.status(400).json({ errorMsg: 'Please send correct credentials!' });
        }
        // token issue with validation
        const token = jwt.sign({ userId: user._id }, constants.jwtSecret, {
            expiresIn: constants.expiresIn,
        });
        user.password = undefined;
        await UserTokensModel.findOneAndUpdate({userId:user._id},{ $addToSet: { tokens : token }} ,{upsert:true, new :true});
        return res.status(200).json({ successMsg: 'User successfully login!', data: { user, token } });

    } catch (error) {
        return res.status(500).json({ errorMsg: `Internal server error`, data: error });

    }
}

export const register = async (req, res) => {
    try {
        const registerUser = req.body;
        //password check
        if (!constants.passwordRegex.test(registerUser.password)) {
            return res.status(400).json({ errorMsg: 'Please send a valid password, must contains one uppercase, one lowercase, one number, one special character and length will be between 8-30 characters!' });
        }
        //user existence check
        const checkUser = await UserModel.findOne({ 'contact.phone': registerUser.contact.phone, 'contact.countryCode': registerUser.contact.countryCode });
        if (checkUser) {
            return res.status(400).json({ errorMsg: `Hey, are you sure you have not used this number before. Please login!`, data: {} });
        }

        // user creation test
        const password = bcrypt.hashSync(registerUser.password, constants.saltRounds);
        registerUser.password = password;
        const user = await UserModel.create(registerUser);

        // token issue with validation
        const token = jwt.sign({ userId: user._id }, constants.jwtSecret, {
            expiresIn: constants.expiresIn,
        });
        user.password = undefined;

        //add token to user token mapping
        await UserTokensModel.findOneAndUpdate({userId:user._id},{ $addToSet: { tokens : token }} ,{upsert:true, new :true});

        return res.status(200).json({ successMsg: 'User successfully created!', data: { user, token } });

    } catch (error) {
        console.log('error ', error)
        return res.status(500).json({ errorMsg: `Internal server error`, data: error });

    }
}
export const logout = async (req, res) => {
    try {

        let token = await extractTokenFromHeader(req);

        if (!token) {
            return res
                .status(401)
                .json({ errorMsg: 'Logout denied, please send auth token!' });
        }

        token = token.replace(/\"/g, "");

        const user = jwt.verify(token, constants.jwtSecret);
        if (!user) {
            return res
                .status(401)
                .json({ errorMsg: 'Access is denied, please login again!' });
        }
        await UserTokensModel.findOneAndUpdate({userId:user.userId},{ $pull: { tokens: token } },{new :true});
        return res.status(200).json({ successMsg: 'Logout successfully!', data: {} });

    } catch (error) {
        return res.status(500).json({ errorMsg: `Internal server error`, data: error });
    }
}
const extractTokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return undefined;
};
export const verifyToken = async (req, res) => {
    try {

        let token = await extractTokenFromHeader(req);

        if (!token) {
            return res
                .status(401)
                .json({ errorMsg: 'Access is denied, please login again!' });
        }

        token = token.replace(/\"/g, "");

        const check = jwt.verify(token, constants.jwtSecret);

        if (!check) {
            return res
                .status(401)
                .json({ errorMsg: 'Access is denied, please login again!' });
        }

        return res.status(200).json({ successMsg: 'Token is valid!', data: check });

    } catch (error) {
        return res.status(500).json({ errorMsg: `Internal server error`, data: error });
    }
}
export default { login, register, verifyToken, logout }