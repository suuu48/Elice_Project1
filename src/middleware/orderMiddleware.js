const { Order } = require('../data-access/models');

// 주문 요청 검증
const orderValidator = (req, res, next) => {
  const { orderId, userEmail, orderItems, orderAddr } = req.body;

  if (!orderId || !userEmail || !orderItems || !orderAddr) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  next();
};

//주문 정보 데이터베이스에 저장
const orderSaver = (req, res, next) => {
  const { orderId, userEmail, orderItems, orderAddr } = req.body;
  const order = new Order({
    orderId,
    userEmail,
    orderItems,
    orderAddr,
  });
  order.save((err) => {
    if (err) {
      return res.status(500).json({ error: '내부 서버 에러' });
    }
    req.order = order;
    next();
  });
};

// 주문 생성 시 유효성 검사
const createOrderValidator = (req, res, next) => {
  const { userEmail, orderItems } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res
      .status(400)
      .json({ error: '주문 상품은 최소 1개 이상이어야 합니다🙏🏻' });
  }
  if (!userEmail) {
    return res
      .status(400)
      .json({ error: '주문 사용자 정보가 유효하지 않습니다.😢' });
  }
  next();
};

// 주문 수정 시 유효성 검사
const updateOrderValidator = (req, res, next) => {
  const { _id: orderId } = req.params;
  const { orderItems, userEmail } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res
      .status(400)
      .json({ error: '주문 상품은 최소 1개 이상이어야 합니다.🙏🏻' });
  }
  if (userEmail && (!userEmail.name || !userEmail.address)) {
    return res
      .status(400)
      .json({ error: '주문 사용자 정보가 유효하지 않습니다.😢' });
  }
  if (!orderId) {
    return res.status(404).json({ error: '해당 주문을 찾을 수 없습니다.🥲' });
  }
  next();
};

//배송 상태 데이터베이스에 저장
const updateDeliveryState = (req, res, next) => {
  const { _id: orderId } = req.params;
  const { deliveryState } = req.body;

  // 0(배송전) , 1(배송중), 2(배송완료)
  if (deliveryState !== 0 && deliveryState !== 1 && deliveryState !== 2) {
    return res.status(400).json({ message: '잘못된 배송 상태입니다.😵‍💫' });
  }

  Order.findOneAndUpdate(
    { _id: orderId },
    { deliveryState },
    { new: true }, //
    (err, updatedOrder) => {
      if (err) {
        return next(err);
      }
      req.updatedOrder = updatedOrder;
      next();
    }
  );
};

// 주문 삭제
const deleteOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const { deleteFlag } = req.body;

  try {
    let deletedOrder;

    if (deleteFlag === 'soft') {
      // soft delete
      deletedOrder = await Order.findByIdAndUpdate(
        orderId,
        { deleted: true },
        { new: true }
      );
      res.json({ message: '주문을 삭제했습니다.' });
    } else if (deleteFlag === 'hard') {
      // hard delete
      deletedOrder = await Order.findByIdAndDelete(orderId);
      res.json({ message: '주문을 완전히 삭제했습니다.' });
    } else {
      // invalid delete option
      res
        .status(400)
        .json({ error: '삭제 옵션을 선택해주세요. (soft or hard)' });
      return;
    }

    if (!deletedOrder) {
      res.status(404).json({ error: '삭제할 주문이 없습니다.' });
      return;
    }
    next();
  } catch (err) {
    res.status(500).json({ error: '주문 삭제 오류😔' });
  }
};

module.exports = {
  orderValidator,
  orderSaver,
  createOrderValidator,
  updateOrderValidator,
  updateDeliveryState,
  deleteOrder,
};
