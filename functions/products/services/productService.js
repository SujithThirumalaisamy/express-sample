class ProductService {
  table;

  constructor(table) {
    this.table = table;
  }

  async getProductById(productId) {
    return await this.table.getRow(productId);
  }

  async createProduct(productData) {
    const { name, description, price } = productData;
    return await this.table.insertRow({
      name,
      description,
      price,
    });
  }
}

module.exports = ProductService;
