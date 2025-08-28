"use strict";

const { IncomingMessage, ServerResponse } = require("http");
const catalyst = require("zcatalyst-sdk-node");

const {
  parseRequest,
  initializeTable,
  ResponseHandler,
} = require("@repo/utils");
const OrderService = require("./services/orderService");
const OrderController = require("./controllers/orderController");

/**
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
module.exports = async (req, res) => {
  try {
    const app = catalyst.initialize(req);
    const responseHandler = new ResponseHandler(res);
    const { url, method } = parseRequest(req);
    const table = initializeTable("orders", app);

    const orderService = new OrderService(table);
    const orderController = new OrderController(orderService, responseHandler);

    switch (method) {
      case "GET":
        await orderController.handleGet(req, url);
        break;
      case "POST":
        await orderController.handlePost(req);
        break;
      default:
        orderController.handleMethodNotAllowed();
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: "Internal Server Error" }));
  } finally {
    res.end();
  }
};
