const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');
const { productsJoiSchema } = require('../data-access/joiSchemas');

// 상품 검증
function validateProduct(req, res, next) {
  const { error } = productsJoiSchema.validate(req.body);
  if (error) {
    return next(
      new AppError(
        commonErrors.requestValidationError,
        400,
        '유효하지 않은 상품입니다. 상품 입력값을 확인해주세요.'
      )
    );
  }
  next();
  return;
}

module.exports = { validateProduct };
