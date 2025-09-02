"use strict";

const { IncomingMessage, ServerResponse } = require("http");
const catalyst = require("zcatalyst-sdk-node");

const { parseRequest, initializeTable, ResponseHandler } = require("./utils");
const ProductService = require("./services/productService");
const ProductController = require("./controllers/productController");

/**
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
module.exports = async (req, res) => {
  try {
    const { url, method } = parseRequest(req);

    if (url.pathname === "/health") {
      res.write("Products service is healthy!");
      res.end();
      return;
    }

    const app = catalyst.initialize(req);
    const responseHandler = new ResponseHandler(res);
    const table = initializeTable("products", app);

    const productService = new ProductService(table);
    const productController = new ProductController(
      productService,
      responseHandler,
    );

    console.info("Invoking the latest update 1");
    switch (method) {
      case "GET":
        await productController.handleGet(req, url);
        break;
      case "POST":
        await productController.handlePost(req);
        break;
      case "PUT":
        await productController.handlePut(req, url);
        break;
      case "DELETE":
        await productController.handleDelete(req, url);
        break;
      default:
        productController.handleMethodNotAllowed();
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: "Internal Server Error" }));
  } finally {
    res.end();
  }
};
