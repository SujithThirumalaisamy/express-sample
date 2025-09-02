const http = require("http");

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

class RequestHandler {
  /**
   * @type {http.IncomingMessage}
   */
  req;

  constructor(req) {
    this.req = req;
  }

  async parseJsonBody() {
    try {
      const body = await getRequestBody(this.req);
      console.info("Parsed body:", body);
      return body;
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
