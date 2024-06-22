const { User } = require('./models');

// TODO: 각 메소드 별로 try-catch문이 있으면 좋을듯
class userDAO {
  // 특정 email로 사용자 document 객체를 찾아오는 메소드
  async findByEmail(email) {
    const user = await User.findOne({ email }).lean();
    return user;
  }
  async findById(userId) {
    const user = await User.findOne({ _id: userId }).lean();
    return user;
  }
  async create(userInfo) {
    const createdNewUser = await User.create(userInfo);
    return createdNewUser; // TODO: toObject를 사용하여 POJO를 반환해주자
  }

  async updateById({ userId, update }) { // TODO: 매개변수 방식을 다른 메소드들과 균일하게 해주면 좋을듯. e.g. async update(orderId, toUpdate) + 하나만 업데이트하기 때문에 이름을 updateOne으로 하면 
    const filter = { _id: userId };
    const option = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      update,
      option
    ).lean();
    return updatedUser;
  }

  async deleteById(userId) { // TODO: deleteOne으로 이름을 지어주는 것이 어떨지
    const deletedUser = await User.findOneAndDelete({ _id: userId }).lean();

    return deletedUser;
  }
}

module.exports = new userDAO();
