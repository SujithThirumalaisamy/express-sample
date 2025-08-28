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
}

module.exports = RequestHandler;
