"use strict";
class ShoppingCart {
  constructor(shoppingCart) {
    this.code = pCode || [];
    this.name = pName || [];
    this.qty = pQty || [];
    this.price = pPrice || [];
  }

  addQty(qty) {
    this.qteArticle += qty;
  }

  getCartPrice() {
    let result = this.price * this.qty;
    return result;
  }
  getCode() {
    return this.code;
  }
  getQte() {
    return this.qty;
  }
  getPrice() {
    return this.price;
  }
}
//end of ShoppingCart Class//
