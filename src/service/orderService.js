// OrderDAO 모듈을 불러옵니다.
const OrderDAO = require('../data-access');
const utils = require('../misc/utils');

class OrderService {
  // 주문 추가
  async createOrder(req) {
    const {
      orderId,
      userEmail,
      orderItems,
      orderAddr,
      deliveryState,
      deleteFlag,
    } = req.body;
    return await OrderDAO.create({
      orderId,
      userEmail,
      orderItems,
      orderAddr,
      deliveryState,
      deleteFlag,
    });
  }

  //전체 주문목록 조회
  async getOrders() {
    return await OrderDAO.findAll();
  }

  //특정 주문 조회
  async getOrderById(orderId) {
    const order = await OrderDAO.findByOrderId({ _id: orderId });
    if (!order) {
      throw new Error('등록된 주문이 없습니다. 다시 주문해 주세요');
    }
    return order;
  }

  //주문수정
  async updateOrder(req) {
    // 객체가 이상함
    const { orderId } = req.params;

    let order = await OrderDAO.findByOrderId({ orderId });

    if (!order) {
      throw new Error('등록된 주문이 없습니다. 다시 확인해 주세요');
    }
    return await OrderDAO.update({ orderId, update: toUpdate });
  }

  //주문정보 수정 - 배송시작 전, 주문자 정보 수정 -> ㅠㅡㅠㅡㅠ
  async updateDeliveryInfo(req) {
    const { orderId } = req.params;
    const { deliveryState } = req.body;

    return await OrderDAO.update(
      { _id: orderId },
      { deliveryState },
      { new: true }
    );
  }

  //주문 삭제
  async deleteOrder(orderId) {
    let order = await OrderDAO.findByOrderId(orderId);
    if (!order) {
      throw new Error('등록된 주문이 없습니다. 다시 확인 해주세요 ');
    }
    if (deleteCount === 0) {
      throw new Error(`${orderId} 주문 데이터 삭제에 실패했습니다.`);
    }
    return { result: '성공' };
  }
}

// 모듈에 구현한 기능을 추가합니다.
module.exports = {
  OrderService,
};
