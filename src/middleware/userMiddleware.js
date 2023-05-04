const jwt = require('jsonwebtoken');
const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');
const { UserJoiSchema } = require('../data-access/joiSchemas');

function loginRequired(req, res, next) {
  const userToken = req.headers['authorization']?.split(' ')[1];

  if (!userToken || userToken === 'null') {
    console.log('서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음');
    return next(
      new AppError(
        commonErrors.requestValidationError,
        403,
        'forbidden-approach, 로그인한 유저만 사용할 수 있는 서비스입니다.'
      )
    );
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY ?? 'secret-key'; // TODO: JWT_SECRET_KEY가 없으면 에러를 던지는 것이 보안 관점에서 좋다. 현재 코드는 없어도 'secret-key'로 대체가 되기 때문에 개발자가 제대로된 시크릿 키를 환경 변수로 넣지 않았다는 것을 인지 못할 가능성이 있다.
    const jwtDecoded = jwt.verify(userToken, secretKey);

    const userId = jwtDecoded.userId;

    req.currentUserId = userId; // TODO: 간혹 다른 서드파티 미들웨어들이 사용하는 key값이랑 겹치는 경우가 있어서 res.locals로 추천

    next();
  } catch (error) {
    return next(
      new AppError(
        commonErrors.requestValidationError,
        403,
        'forbidden-approach, 정상적인 토큰이 아닙니다.'
      )
    );
  }
}

module.exports = { loginRequired };
