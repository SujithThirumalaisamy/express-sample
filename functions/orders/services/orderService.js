class OrderService {
  table;

  constructor(table) {
    this.table = table;
  }

  async getOrderById(orderId) {
    return await this.table.getRow(orderId);
  }

  async createOrder(orderData) {
    return await this.table.insertRow(orderData);
  }

  async getAllOrders() {
    return await this.table.getRows();
  }
}

module.exports = OrderService;
