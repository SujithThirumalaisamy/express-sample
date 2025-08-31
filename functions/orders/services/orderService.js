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
    return await this.table.getAllRows();
  }

  async updateOrder(orderId, orderData) {
    const { PRODUCTID, QUANTITY, ORDERPRICE, STATUS } = orderData;
    return await this.table.updateRow({
      ROWID: orderId,
      PRODUCTID,
      QUANTITY,
      ORDERPRICE,
      STATUS,
    });
  }

  async deleteOrder(orderId) {
    return await this.table.deleteRow(orderId);
  }
}

module.exports = OrderService;
