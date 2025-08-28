"use strict";

const { RequestHandler } = require("@repo/utils");

class OrderController {
  orderService;
  responseHandler;

  constructor(orderService, responseHandler) {
    this.orderService = orderService;
    this.responseHandler = responseHandler;
  }

  async handleGet(req, url) {
    const requestHandler = new RequestHandler(req);
    const order_id = requestHandler.getQueryParam(url, "order_id");

    try {
      if (order_id) {
        const resultOrder = await this.orderService.getOrderById(order_id);
        this.responseHandler.json(resultOrder);
      } else {
        const allOrders = await this.orderService.getAllOrders();
        this.responseHandler.json(allOrders);
      }
    } catch (error) {
      console.error("Error getting order(s):", error);
      this.responseHandler.send(500, "500 Internal Server Error");
    }
  }

  async handlePost(req) {
    try {
      const requestHandler = new RequestHandler(req);
      const parsedData = await requestHandler.parseJsonBody();

      const createdOrder = await this.orderService.createOrder(parsedData);
      this.responseHandler.json(createdOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.message === "Invalid JSON in request body") {
        this.responseHandler.send(400, "400 Bad Request, " + error.message);
      } else {
        this.responseHandler.send(500, "500 Internal Server Error");
      }
    }
  }

  handleMethodNotAllowed() {
    this.responseHandler.send(405, "405 Method Not Allowed");
  }
}

module.exports = OrderController;
