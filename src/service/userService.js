const { userDAO } = require('../data-access');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class userService {
  async addUser(userInfo) {
    // 객체 destructuring
    const { email, name, password, phone, address, roleType } = userInfo;

    // 이메일 중복 확인
    const user = await userDAO.findByEmail(email);
    if (user) {
      throw new Error(
        '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.'
      );
    }

    // 우선 비밀번호 해쉬화(암호화)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserInfo = {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      roleType,
    };

    // db에 저장
    return await userDAO.create(newUserInfo);
  }

  // 로그인
  async getUserToken(loginInfo) {
    const { email, password } = loginInfo;

    // 우선 해당 이메일의 사용자 정보가  db에 존재하는지 확인
    const user = await userDAO.findByEmail(email);

    if (!user) {
      throw new Error(
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.'
      );
    }

    // 이제 이메일은 문제 없는 경우이므로, 비밀번호를 확인함

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password; // db에 저장되어 있는 암호화된 비밀번호
    const userId = user._id;

    // 매개변수의 순서 중요 (1번째는 프론트가 보내온 비밀번호, 2번쨰는 db에 있떤 암호화된 비밀번호)
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'secret-key';

    const token = jwt.sign({ userId: user._id }, secretKey);
    return { token, userId };
  }

  // 사용자 정보 조회
  async getUser(userId) {
    console.log(userId);
    const user = await userDAO.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    return user;
  }

  // 유저정보 수정, 현재 비밀번호가 있어야 수정 가능함.
  async setUser(userId, toUpdate) { // TODO: set보다는 update가 조금 더 직관적인 이름일 것 같습니다.
    let user = await userDAO.findById(userId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    // 정보 수정을 위해 사용자가 입력한 비밀번호가 올바른 값인지 확인해야 함

    // TODO: 아래 과정은 꼭 필요할 것 같아요
    /*// 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      throw new Error(
        '현재 비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.'
      );
    }*/
    // 업데이트 시작

    // 비밀번호도 변경하는 경우에는, 회원가입 때처럼 해쉬화 해주어야 함.
    const { password } = toUpdate;

    // ""

    if (password) {
      const newPasswordHash = await bcrypt.hash(password, 10);
      toUpdate.password = newPasswordHash;
    }

    // 업데이트 진행
    user = await userDAO.updateById({
      userId,
      update: toUpdate,
    });

    return user;
  }

  // 유저정보 삭제, 현재 비밀번호가 있어야 수정 가능함.
  async deleteUser(userId) {
    const user = await userDAO.findById(userId);

    if (!user) {
      throw new Error('가입 내역이 없습니다. 다시 한 번 확인해 주세요.');
    }

    const deleteUser = await userDAO.deleteById(userId);

    return deleteUser;
  }
}

module.exports = new userService();
