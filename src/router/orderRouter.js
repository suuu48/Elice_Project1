const express = require("express");
const { orderService, userService} = require('../service');
const {userMiddleware} = require('../middleware')

const orderRouter = express.Router();

// 주문 추가 api
orderRouter.post("/:userId",
// orderMiddleware.orderValidator ,
userMiddleware.loginRequired, 
async (req,res,next)=>{
  try{
    const userId = req.params.userId;
    const  { orderAddr,deliveryState,deleteFlag} = req.body;

    const orderItems = req.body.orderItems; // orderItems를 배열로 변경하지 않음
    const orderInfo = {
      ...(userId && {userId}),
      ...(orderItems && {orderItems}),
      ...(orderAddr && {orderAddr}),
      ...(deliveryState !== undefined && {deliveryState}), // undefined 체크
      ...(deleteFlag !== undefined && {deleteFlag}), // undefined 체크
    };

    const newOrder = await orderService.createOrder(orderInfo);
    res.status(201).json(newOrder);
  }catch(error){
    next(error);
  }
});

/*
// 주문 저장
orderRouter.post("/orders/save", 
  // orderMiddleware.orderSaver,
  // orderMiddleware.createOrderValidator, 
  async (req,res)=>{
    const {orderId, orderItems, orderAddr} = req.body;
    try{
      const order = new orderService({
        orderId,orderItems,orderAddr
      });
      const savedOrder = await order.save();
      res.status(201).json({savedOrder});
    }catch(err){
      res.status(500).json({error: commonErrors.DB_ERROR});
    }
})
*/

// 특정 유저의 주문 조회
orderRouter.get("/:userId",
    userMiddleware.loginRequired,
  async (req,res,next)=>{
    try{
        const userId = req.params.userId;
        const userInfoRequired = { userId };

      const orders = await orderService.getOrdersByUser(userInfoRequired);

      res.json(orders);
    }catch(error){
      next(error);
    }
});

// 주문 수정 
orderRouter.put("/:userId",
  userMiddleware.loginRequired,
  async(req,res,next)=>{
    try{
      const userId = req.params.userId;
      const orderItems = req.body.orderItems;
      const { orderAddr,deliveryState } =req.body;

      const userInfoRequired = { userId };
      console.log("=======deliveryState===========");
      console.log(deliveryState);

      if(deliveryState !== 0){
        return res.status(400).json({error: '이미 배송된 주문은 수정할 수 없습니다.'});
      }
      // 배송 시작 전일 경우
      const toUpdate ={
        ...(orderItems && { orderItems }),
        ...(orderAddr && { orderAddr }),
        ...(deliveryState !== undefined && {deliveryState}),
      };

      console.log("=======toUpdate===========");
      console.log(toUpdate);

      const updateOrderInfo = await orderService.updateOrder(
          userInfoRequired,
          toUpdate,
      );

      res.status.json(updateOrderInfo);
    }catch(error){
      next(error);
    }  
});

// 주문 삭제
orderRouter.delete("/:userId/:orderId",
userMiddleware.loginRequired,
async(req,res,next)=>{
  
  try{
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    const userInfoRequired = { userId };
    const orderInfo = { orderId };
    const orders = await orderService.getOrdersByUser(userInfoRequired);

    if(!orders) {
      return res.status(400).json({error: '주문 내역이 없습니다!'});
    }
    //삭제 시도
    const deleteResult = await orderService.deleteOrder(orderInfo);
    res.status(200).json(deleteResult);
    }catch(error){
    next(error);
  }
},);

// 주문 배송 상태 업데이트 라우터
orderRouter.put('/orders/:email',
// orderMiddleware.updateDeliveryState, 
(req, res) => {
  res.status(200).json({ updatedOrder: req.updatedOrder });
});


module.exports = orderRouter;

