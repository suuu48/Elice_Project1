const { Order } = require('./models');

// TODO: 각 메소드 별로 try-catch문이 있으면 좋을듯
class OrderDAO {
  // 주문 추가
  async create(orderInfo) {
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder.toObject(); // TODO: toObject  Plain Old JavaScript Object
  }

  // 전체 주문목록 조회
  async findAll() {
    return await Order.find().lean();
  }

  // 유저 아이디로 주문 아이디 찾기
  async findOrderIdByUserId(userId) {
    try {
      const findOrderId = await Order.findOne({ userId: userId }, '_id').lean();
      const orderId = findOrderId._id;
      return; // TODO: return 값이 없음
    } catch (error) {
      throw new AppError(commonErrors.DB_ERROR, 'DB 작업 도중 문제가 발생하였습니다', 500);
    }
  }

  async findByUserId(userId) {
    return await Order.find({ userId: userId }).lean();
  }
  async find(orderId) {
    return await Order.findOne({ _id: orderId }).lean();
  }
  // 주문 수정
  async update({ orderId, update }) { // TODO: 매개변수 방식을 다른 메소드들과 균일하게 해주면 좋을듯. e.g. async update(orderId, toUpdate) + 하나만 업데이트하기 때문에 이름을 updateOne으로 하면 어떨지?
    const option = { new: true }; // new: true >> 적용된 문서를 반환

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      update,
      option
    ).lean();
    if (!updatedOrder) {
      throw new Error(`주문 ${orderId}를 찾을 수 없습니다.`); // TODO: AppError를 사용하기
    }
    return updatedOrder;
  }

  // 주문 삭제
  async delete(userId) { // TODO: deleteByUserId로 이름을 지어주는 것이 어떨지
    const deleteCount = await Order.deleteMany({ userId: userId }); // TODO: delete한 친구들의 ID를 반환해주면 프론트에서 사용하기 좋을 것 같다
    return { result: '성공' };
  }
  async deleteOrder(orderId) { // TODO: deleteOne으로 이름을 지어주는 것이 어떨지
    const deletedOrder = await Order.findOneAndDelete({ _id: orderId }).lean();
    return deletedOrder;
  }
}

module.exports = new orderDAO();
