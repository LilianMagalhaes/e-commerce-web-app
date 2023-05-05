module.exports = class ClientCart {
  constructor() {
    this.clientCart = [];
  }

  addProductToCart(code, qty, price, name) {
    let index = this.getProduct(code);
    if (index == -1) {
      this.clientCart.push(new clientCart(code, qty, price, name));
    } else {
      this.clientCart[index].addQty(qty);
    }
  }

  getCartTotalPrice() {
    let total = 0;
    for (const element of this.clientCart) total += element.getCartPrice();
    return total;
  }

  getProduct(code) {
    for (let i = 0; i < this.clientCart.length; i++) {
      if (code === this.clientCart[i]) {
        return i;
      }
    }
    return -1;
  }

  deleteProductFromCart(code) {
    let index = this.getProduct(code);
    if (index > -1) this.clientCart.splice(index, 1);
  }

  goToCheckOut() {
    return;
  } //:void
};
