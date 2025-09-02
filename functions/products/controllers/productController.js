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

    try {
      if (product_id) {
        const resultProduct =
          await this.productService.getProductById(product_id);
        this.responseHandler.json(resultProduct);
      } else {
        const allProducts = await this.productService.getAllProducts();
        this.responseHandler.json(allProducts);
      }
    } catch (error) {
      console.error("Error getting product(s):", error);
      this.responseHandler.send(500, "500 Internal Server Error");
    }
  }

  async handlePost(req) {
    try {
      const requestHandler = new RequestHandler(req);
      const parsedData = await requestHandler.parseJsonBody();
      const createdProduct =
        await this.productService.createProduct(parsedData);
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

  async handlePut(req, url) {
    try {
      const requestHandler = new RequestHandler(req);
      const product_id = requestHandler.getQueryParam(url, "product_id");

      if (!product_id) {
        this.responseHandler.send(
          400,
          "400 Bad Request, Missing query parameter product_id.",
        );
        return;
      }

      const parsedData = await requestHandler.parseJsonBody();
      const updatedProduct = await this.productService.updateProduct(
        product_id,
        parsedData,
      );
      this.responseHandler.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
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
      const product_id = requestHandler.getQueryParam(url, "product_id");

      if (!product_id) {
        this.responseHandler.send(
          400,
          "400 Bad Request, Missing query parameter product_id.",
        );
        return;
      }

      await this.productService.deleteProduct(product_id);
      this.responseHandler.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      this.responseHandler.send(500, "500 Internal Server Error");
    }
  }

  handleMethodNotAllowed() {
    this.responseHandler.send(405, "405 Method Not Allowed");
  }
}

module.exports = ProductController;
