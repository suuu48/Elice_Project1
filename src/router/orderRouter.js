const express = require('express');
// const {orderMiddleware} = require("../middleware");
const { orderService } = require('../service');
const { loginRequired } = require('../middleware/userMiddleware');

const orderRouter = express.Router();

// 주문 추가 api
orderRouter.post(
  '/order',
  // orderMiddleware.orderValidator ,
  loginRequired,
  async (req, res, next) => {
    try {
      const {
        orderId,
        userEmail,
        orderItems,
        orderAddr,
        deliveryState,
        deleteFlag,
      } = req.body;
      const orderInfo = {
        ...(orderId && { orderId }),
        ...(userEmail && { userEmail }),
        ...(orderItems && { orderItems }),
        ...(orderAddr && { orderAddr }),
        ...(deliveryState && { deliveryState }),
        ...(deleteFlag && { deleteFlag }),
      };
      const newOrder = await orderService.createOrder(orderInfo);
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }
);

// 주문 저장
orderRouter.post(
  '/orders/save',
  // orderMiddleware.orderSaver,
  // orderMiddleware.createOrderValidator,
  async (req, res) => {
    const { orderId, userEmail, orderItems, orderAddr } = req.body;
    try {
      const order = new orderService({
        orderId,
        orderItems,
        orderAddr,
        userEmail,
      });
      const savedOrder = await order.save();
      res.status(201).json({ savedOrder });
    } catch (err) {
      res.status(500).json({ error: commonErrors.DB_ERROR });
    }
  }
);

// 모든 주문 조회
orderRouter.get(
  '/orders/all',
  // orderMiddleware.createOrderValidator,
  async (req, res, next) => {
    const { userEmail } = req.body;
    try {
      const orders = await orderService.find({ userEmail });
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

// 주문 수정
orderRouter.put(
  '/orders/:orderId',
  // orderMiddleware.orderValidator,
  // orderMiddleware.updateOrderValidator,
  // orderMiddleware.updateDeliveryState,
  loginRequired,
  async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { orderItems, orderAddr, deliveryState } = req.body;
      let order = await orderService.getOrderById(orderId);

      if (order.deliveryState !== 0) {
        return res
          .status(400)
          .json({ error: '이미 배송된 주문은 수정할 수 없습니다.' });
      }

      //수정할 객체
      const orderInfoRequired = { orderId };

      const toUpdate = {
        ...(orderId && { orderId }),
        ...(orderAddr && { orderAddr }),
        ...(deliveryState && { deliveryState }),
        ...(orderItems && { orderItems }),
      };
      const updateOrderInfo = await orderService.setOrder(
        orderInfoRequired,
        toUpdate
      );
      res.status.json(updateOrderInfo);
    } catch (error) {
      next(error);
    }
  }
);

// 주문 삭제
orderRouter.delete(
  '/orders/:orderId',
  // orderMiddleware.deleteOrder,
  loginRequired,
  async (req, res, next) => {
    try {
      const { orderId } = req.params;
      //삭제 시도
      const deleteResult = await orderService.deleteOrder(orderId);
      res.status(200).json(deleteResult);
    } catch (error) {
      next(error);
    }
  }
);

// 주문 배송 상태 업데이트 라우터
orderRouter.put(
  '/orders/:email',
  // orderMiddleware.updateDeliveryState,
  (req, res) => {
    res.status(200).json({ updatedOrder: req.updatedOrder });
  }
);

module.exports = orderRouter;
