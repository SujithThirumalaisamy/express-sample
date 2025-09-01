class RequestHandler {
  req;

  constructor(req) {
    this.req = req;
  }

  async parseJsonBody() {
    try {
      const data = await this.req.read();
      const parsedData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      console.error("Error parsing request body:", error);
      throw new Error("Invalid JSON in request body");
    }
  }

  getQueryParam(url, paramName) {
    return url.searchParams.get(paramName);
  }

  validateRequiredFields(data, requiredFields) {
    return requiredFields.every((field) => field in data);
  }

  extractFields(data, fields) {
    const result = {};
    for (const field of fields) {
      if (field in data) {
        result[field] = data[field];
      }
    }
    return result;
  }
}

module.exports = RequestHandler;
