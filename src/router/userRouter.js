const express = require('express');
const { userService } = require('../service');
const { userMiddleware } = require('../middleware');

const userRouter = express.Router();
userRouter.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, address, roleType } = req.body;

    const userInfo = {
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(roleType && { roleType }),
    };
    console.log(userInfo);
    const newUser = await userService.addUser(userInfo);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

userRouter.post('/signIn', async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const userToken = await userService.getUserToken({ email, password });

    res.status(200).json(userToken);
  } catch (error) {
    next(error);
  }
});

// 사용자  정보 조회
// TODO: 본인에 대해서만 조회 가능하도록 해주면 좋을듯
userRouter.get(
  '/:userId',
  userMiddleware.loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.params.userId;

      const user = await userService.getUser(userId);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

// 사용자 정보 수정
// TODO: 본인에 대해서만 수정 가능하도록 해주면 좋을듯
userRouter.patch(
  '/:userId',
  userMiddleware.loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.params.userId;

      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const name = req.body.name;
      const password = req.body.password;
      const address = req.body.address;
      const phone = req.body.phone;

      // body data로부터, 확인용으로 사용할 현재 비밀번호를 추출함.
      /* const currentPassword = req.body.currentPassword;

      if (!currentPassword) {
        throw new Error('정보를 변경하려면, 현재의 비밀번호가 필요합니다.');
      }

      const userInfoRequired = { userId, currentPassword };
      const userInfoRequired = { userId };
      */

      // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
      // 보내주었다면, 업데이트용 객체에 삽입함.
      const toUpdate = {
        ...(name && { name }),
        ...(password && { password }),
        ...(address && { address }),
        ...(phone && { phone }),
      };

      // 사용자 정보를 업데이트함.
      const updatedUserInfo = await userService.setUser(userId, toUpdate);

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(updatedUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

// 사용자 정보 삭제
// TODO: 본인에 대해서만 삭제 가능하도록 해주면 좋을듯
userRouter.delete(
  '/:userId',
  userMiddleware.loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.params.userId;

      // 사용자 정보를 삭제함
      const deleteUserInfo = await userService.deleteUser(userId);

      // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
      res.status(200).json(deleteUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
