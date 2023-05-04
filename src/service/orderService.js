// OrderDAO 모듈을 불러옵니다.
const { orderDAO } = require('../data-access');

class orderService {
  // 주문 추가
  async createOrder(orderInfo) {
    const { userId, orderItems, orderAddr, deliveryState, deleteFlag } =
      orderInfo;

    const newOrderInfo = {
      userId,
      orderItems,
      orderAddr,
      deliveryState,
      deleteFlag,
    };
    return await orderDAO.create(newOrderInfo);
  }

  //전체 주문목록 조회(관리자용)
  async getOrders() {
    return await orderDAO.findAll();
  }

  //특정 사용자의 주문조회
  async getOrdersByUser(userId) {
    try {
      const orders = await orderDAO.findByUserId(userId);
      return orders;
    } catch (error) {
      console.log(error);
      throw new AppError(commonErrors.BUSINESS_LOGIC_ERROR, '주문을 가져오는 도중 문제가 발생하였습니다', 500)
    }
  }

  //주문수정
  async updateOrder(userId, toUpdate) {
    let order = await orderDAO.findByUserId(userId);
    const orderId = await orderDAO.findOrderId(userId);

    if (!order) {
      throw new Error('등록된 주문이 없습니다. 다시 확인해 주세요');
    }

    order = await orderDAO.update({
      orderId,
      update: toUpdate,
    });

    return order;
  }

  //주문 전체 삭제
  async deleteOrderAll(orderId) {
    return await orderDAO.delete(orderId);
  }
  //주문 한개 삭제
  async deleteOrderOne(orderId) {
    return await orderDAO.deleteOrder(orderId);
  }
}

module.exports = new orderService();
