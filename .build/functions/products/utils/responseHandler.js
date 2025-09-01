class ResponseHandler {
  res;

  constructor(res) {
    this.res = res;
  }

  json(data, statusCode = 200) {
    this.res.writeHead(statusCode, { "Content-Type": "application/json" });
    this.res.write(JSON.stringify(data));
  }

  send(statusCode, message) {
    this.res.writeHead(statusCode);
    this.res.write(message);
  }
}

module.exports = ResponseHandler;
