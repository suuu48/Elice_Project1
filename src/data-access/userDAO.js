const { User } = require("./models");
class userDAO  {

    // 특정 email로 사용자 document 객체를 찾아오는 메소드
    async findByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    }
    async findById(userId) {
        const user = await User.findOne({ _id: userId });
        return user;
    }
    async create(userInfo) {
        const createdNewUser = await User.create(userInfo);
        return createdNewUser;
    }

    async findAll() {
        const users = await User.find({});
        return users;
    }
    async update({ userId, update }) {
        const filter = { _id: userId };
        const option = { returnOriginal: false };

        const updatedUser = await User.findOneAndUpdate(filter, update, option);
        return updatedUser;
    }

    async deleteById(userId) {
        // const filter = { _id: userId };
        // const option = { returnOriginal: false };

        const deletedUser = await User.findOneAndDelete( { _id: userId });
        return deletedUser;
    }


};

module.exports =  new userDAO();
