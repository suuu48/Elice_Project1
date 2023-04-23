const { User } = require('./models');
const mongoose = require('mongoose');
class userDAO {
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
    const filter = { _id: userId };
    const option = { returnOriginal: false };

    const deletedUser = await User.findOneAndDelete(filter, option);
    return deletedUser;
  }
}

module.exports = new userDAO();

/*
    // 특정 id를 _id로 갖고 있는 게시글 document를 toUpdate 객체의 내용으로 덮어 씌운다(overwrite).
    // 덮어 씌우는 것이기 때문에 잘못된 값이 의도치 않게 들어가면 문제가 발생할 수 있다.
    // 그렇기 때문에 사전에 utils.sanitizeObject로 데이터 클렌징을 한 번 해준다.
    // NOTE: 만약 toUpdate에 { title: undefined, author: undefined }라는 값이 들어오면 기존의 게시글 document는 타이틀과 게시글 작성자가 없는 글이 될 가능성이 있다!
    async updateOne(email, toUpdate) {
        const sanitizedToUpdate = utils.sanitizeObject({
            name: toUpdate.firstName,
            address: toUpdate.address,
            phone: toUpdate.phone,
        });
        // 해당 id를 갖는 게시글 document를 먼저 찾고 있으면 업데이트하는 메소드
        // "하나"의 document를 업데이트하며,
        // updateOne 메소드와의 차이점은 이 메소드는 document 객체(기본적으로 업데이트 전의 document)를 리턴하는 반면
        // updateOne 메소드는 아래와 같은 값들을 리턴한다:
        // - matchedCount
        // - modifiedCount
        // - acknowledged
        // - upsertedId
        // - upsertedCount
        // 업데이트 후 바로 document 객체가 필요하다면 findByIdAndUpdate가 사용하기 편하다.
        const plainUpdatedUser = await User.findOneAndUpdate(
            email, // document의 id이며 이는 곧 mongoDB에 저장된 _id에 저장된 값이다.
            sanitizedToUpdate, // update할 객체의 모습, 원래 update는 { $set: { title: 'some-title', author: 'someone' } } 이런식으로 $set을 명시해줘야하지만 여기서는 생략해줘도 된다
            {
                runValidators: true, // 기본적으로 findOneAnd*의 형식의 메소드들은 schema 체크를 안한다. 이 옵션을 true로 해주면 schema 체크(업데이트 될 데이터에 대한 검증)를 진행한다.
                new: true, // 기본적으로 findOneAnd*의 형식의 메소드들은 업데이트 전의 document를 리턴한다. 업데이트 후의 document를 리턴받기 위해서는 이 옵션을 true로 해주면 된다.
            }
        ).lean(); // 여기서도 lean을 사용하여 POJO를 리턴 받자.
        return plainUpdatedUser;
    },
    // 특정 id를 _id로 갖고 있는 회원 document를 삭제한다(hard delete).
    async deleteOne(email) {
        // delete를 하며, 삭제된 document 객체를 반환한다.
        const plainDeletedUser = await User.findOneAndDelete(email).lean(); // 여기서도 lean을 사용하여 POJO를 리턴 받자.
        return plainDeletedUser;
    },*/
