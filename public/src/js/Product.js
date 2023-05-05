module.exports = class Product {
  constructor(product) {
    this.code = product.code;
    this.name = product.name;
    this.stockQty = product.stockQty;
    this.price = product.price;
    this.overview = product.overview || [];
    this.brand = product.brand;
    this.ageCategory = product.ageCategory;
    this.category = product.category;
    this.mainImage = product.mainImage;
  }
};
