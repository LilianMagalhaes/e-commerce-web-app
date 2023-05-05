$(document).ready(function () {
  let tabClientProducts = [];
  const readDbClientCartData = (chargeClientCart) => {
    fetch("/getClientCart")
      .then((response) => response.json())
      .then((data) => {
        tabClientProducts = data;
        console.log(tabClientProducts);
        console.log(`1-readDbClientCart fetched: ${tabClientProducts}`);
        console.log(
          `2-readDbClientCart() sent to displayClientCart(): ${tabProducts}`
        );
        displayClientCart(tabClientProducts);
      })
      .catch((error) => console.error(error));
  };
});
