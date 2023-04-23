const { Order } = require('../data-access/models');

class OrderDAO {
  // 주문 추가
  async create(orderData) {
    const order = new OrderModel(orderData);
    await order.save();
    return order;
  }

  // 전체 주문목록 조회
  async findAll() {
    return await Order.find();
  }

  // 특정 주문 조회
  async findByOrderId(orderId) {
    return await Order.findOne({ _id: orderId });
  }

  // 주문 수정
  async update(orderId, toUpdate) {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      toUpdate,
      { new: true }
    );
    if (!updatedOrder) {
      throw new Error(`주문 ${orderId}를 찾을 수 없습니다.`);
    }
    return updatedOrder;
  }

  // 주문 삭제
  async delete(orderId) {
    const deleteCount = await Order.deleteOne({ _id: orderId }).deletedCount;
    if (deleteCount === 0) {
      throw new Error(`주문 ${orderId}를 삭제하는 데 실패했습니다.`);
    }
    return { result: '성공' };
  }
}

module.exports = OrderDAO;
