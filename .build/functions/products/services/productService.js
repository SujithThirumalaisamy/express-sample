class ProductService {
  table;

  constructor(table) {
    this.table = table;
  }

  async getProductById(productId) {
    return await this.table.getRow(productId);
  }

  async getAllProducts() {
    return await this.table.getAllRows();
  }

  async createProduct(productData) {
    const { NAME, DISCRIPTION, PRICE, AVAILABLITY } = productData;
    return await this.table.insertRow({
      NAME,
      DISCRIPTION,
      PRICE,
      AVAILABLITY,
    });
  }

  async updateProduct(productId, productData) {
    const { NAME, DISCRIPTION, PRICE, AVAILABLITY } = productData;
    const response = await this.table.updateRow({
      ROWID: productId,
      NAME,
      DISCRIPTION,
      PRICE,
      AVAILABLITY,
    });

    return response;
  }

  async deleteProduct(productId) {
    return await this.table.deleteRow(productId);
  }
}

module.exports = ProductService;
