import UserModel from '../model/user.js';
import constants from '../constants/index.js';

export const getUserList = async (req, res) => {
    try {
        const pageLimit = parseInt(req.query.pageLimit) || 10;
        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const sortCondition = req.query.sortCondition || { createdAt: -1 };
        const searchString = req.query.searchString || '';

        const filterObj = {};

        if (searchString) {
            filterObj.$or = [{ name: { $regex: searchString, $options: 'i' } }, { 'contact.phone': { $regex: searchString, $options: 'i' } }]
        }

        const [users, total] = await Promise.all([
            UserModel.find(filterObj, { password: 0 }).sort(sortCondition).limit(pageLimit).skip(pageNumber * pageLimit),
            UserModel.count(filterObj)
            ])

        return res.status(200).json({ successMsg: 'Users successfully fetched!', data: {total,pageNumber,pageLimit,users} });
    } catch (error) {
        return res.status(500).json({ errorMsg: `Internal server error`, data: error });
    }

}
export const getUserById = async (req, res) => {
    try {
       
        const userId = req.params.userId;

        if (!userId && !userId.length) {
            return res.status(400).json({ errorMsg: `User Id is required!`, data: {} });
        }

        const user = await UserModel.findOne({_id:userId},{ password: 0 });

        return res.status(200).json({ successMsg: 'User successfully fetched!', data: user });
    } catch (error) {
        return res.status(500).json({ errorMsg: `Internal server error`, data: error });
    }

}
export default { getUserList, getUserById };