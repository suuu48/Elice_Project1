// OrderDAO 모듈을 불러옵니다.
const { orderDAO, userDAO}  = require('../data-access');
const { OrderItems } = require("../data-access/models");
const ObjectId = require('mongoose').Types.ObjectId;

class orderService  {
  // 주문 추가
  async createOrder(orderInfo) {
      const { userId, orderItems, orderAddr, deliveryState, deleteFlag } = orderInfo;

      const newOrderInfo = {
          userId,
          orderItems,
          orderAddr,
          deliveryState,
          deleteFlag
      };
      return await orderDAO.create(newOrderInfo);

  }

  //전체 주문목록 조회
  async getOrders() {
    return await orderDAO.findAll();
  }

  //특정 사용자의 주문조회
  async getOrdersByUser(userInfoRequired){
      const { userId } = userInfoRequired;

      const order =  await orderDAO.findByUserId(userId);
      console.log(order)
      return order;
    /*const order = await orderDAO.findByOrderId({_id: userId});
    if(!order){
      throw new Error("등록된 주문이 없습니다. 다시 주문해 주세요")
    }*/
    // return order;
  }

  //주문수정
  async updateOrder (userInfoRequired, toUpdate) {
      console.log("==========updateOrder=================")
      const { userId } = userInfoRequired;
      let order =  await orderDAO.findByUserId(userId);

      // const {orderId} = req.params;
      const orderId = await  orderDAO.findOrderId(userId);
      console.log(orderId)

      if(!order){
        throw new Error("등록된 주문이 없습니다. 다시 확인해 주세요")
      }

      // const orderId = order._id;
      order = await orderDAO.update({
          orderId,
          update: toUpdate,
      })

      return order
  }
/*
  //주문정보 수정 - 배송시작 전, 주문자 정보 수정 -> ㅠㅡㅠㅡㅠ
  async updateDeliveryInfo() {
    
      const { orderId } = req.params;
      const { deliveryState } = req.body;

      const updatedOrder = await orderDAO.update(
        { _id: orderId}, 
        {deliveryState },
        { new: true },
      );
  }*/

  //주문 삭제
  async deleteOrder(orderId) {
    let order = await orderDAO.findByOrderId(orderId);
    if(!order){
      throw new Error("등록된 주문이 없습니다. 다시 확인 해주세요 ")
    }

      return await orderDAO.delete(orderId);
    return {result: "성공"};
  
  }

};

// 모듈에 구현한 기능을 추가합니다.
module.exports = new orderService();