"use strict";

const { RequestHandler } = require("../utils");

class ProductController {
  productService;
  responseHandler;

  constructor(productService, responseHandler) {
    this.productService = productService;
    this.responseHandler = responseHandler;
  }

  async handleGet(req, url) {
    const requestHandler = new RequestHandler(req);
    const product_id = requestHandler.getQueryParam(url, "product_id");

    if (!product_id) {
      this.responseHandler.send(
        400,
        "400 Bad Request, Missing query parameter product_id.",
      );
      return;
    }

    try {
      const resultProduct =
        await this.productService.getProductById(product_id);
      this.responseHandler.json(resultProduct);
    } catch (error) {
      console.error("Error getting product:", error);
      this.responseHandler.send(500, "500 Internal Server Error");
    }
  }

  async handlePost(req) {
    try {
      const requestHandler = new RequestHandler(req);
      const parsedData = await requestHandler.parseJsonBody();

      const requiredFields = ["name", "description", "price"];
      if (!requestHandler.validateRequiredFields(parsedData, requiredFields)) {
        this.responseHandler.send(
          400,
          "400 Bad Request, Missing required fields: " +
            requiredFields.join(", "),
        );
        return;
      }

      const productData = requestHandler.extractFields(
        parsedData,
        requiredFields,
      );

      const createdProduct =
        await this.productService.createProduct(productData);
      this.responseHandler.json(createdProduct);
    } catch (error) {
      console.error("Error creating product:", error);
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

module.exports = ProductController;
