"use strict";

const { RequestHandler } = require("../utils");

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

      const requiredFields = ["PRODUCTID", "QUANTITY", "ORDERPRICE", "STATUS"];
      if (!requestHandler.validateRequiredFields(parsedData, requiredFields)) {
        this.responseHandler.send(
          400,
          "400 Bad Request, Missing required fields: " +
            requiredFields.join(", "),
        );
        return;
      }

      const orderData = requestHandler.extractFields(
        parsedData,
        requiredFields,
      );
      const createdOrder = await this.orderService.createOrder(orderData);
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

  async handlePut(req, url) {
    try {
      const requestHandler = new RequestHandler(req);
      const order_id = requestHandler.getQueryParam(url, "order_id");

      if (!order_id) {
        this.responseHandler.send(
          400,
          "400 Bad Request, Missing query parameter order_id.",
        );
        return;
      }

      const parsedData = await requestHandler.parseJsonBody();
      const requiredFields = ["PRODUCTID", "QUANTITY", "ORDERPRICE", "STATUS"];

      if (!requestHandler.validateRequiredFields(parsedData, requiredFields)) {
        this.responseHandler.send(
          400,
          "400 Bad Request, Missing required fields: " +
            requiredFields.join(", "),
        );
        return;
      }

      const orderData = requestHandler.extractFields(
        parsedData,
        requiredFields,
      );
      const updatedOrder = await this.orderService.updateOrder(
        order_id,
        orderData,
      );
      this.responseHandler.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      if (error.message === "Invalid JSON in request body") {
        this.responseHandler.send(400, "400 Bad Request, " + error.message);
      } else {
        this.responseHandler.send(500, "500 Internal Server Error");
      }
    }
  }

  async handleDelete(req, url) {
    try {
      const requestHandler = new RequestHandler(req);
      const order_id = requestHandler.getQueryParam(url, "order_id");

      if (!order_id) {
        this.responseHandler.send(
          400,
          "400 Bad Request, Missing query parameter order_id.",
        );
        return;
      }

      await this.orderService.deleteOrder(order_id);
      this.responseHandler.json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      this.responseHandler.send(500, "500 Internal Server Error");
    }
  }

  handleMethodNotAllowed() {
    this.responseHandler.send(405, "405 Method Not Allowed");
  }
}

module.exports = OrderController;
