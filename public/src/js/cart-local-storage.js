function showCartTable() {
  let cartRowHTML = "";
  let itemCount = 0;
  let grandTotal = 0;

  let price = 0;
  let quantity = 0;
  let subTotal = 0;

  if (localStorage.getItem("shopping-cart")) {
    let shoppingCart = JSON.parse(localStorage.getItem("shopping-cart"));
    itemCount = shoppingCart.length;

    //Iterate javascript shopping cart array
    shoppingCart.forEach(function (item) {
      let cartItem = JSON.parse(item);
      price = parseFloat(cartItem.price);
      quantity = parseInt(cartItem.quantity);
      subTotal = price * quantity;

      cartRowHTML += `<tr>
        <td>${cartItem.productName}</td>" +
        <td class='text-right'>$
        ${price.toFixed(2)}
        </td>
        <td class='text-right'>${quantity}</td>
        <td class='text-right'>$${subTotal.toFixed(2)}</td>
        </tr>`;

      grandTotal += subTotal;
    });
  }

  $("#cartTableBody").html(cartRowHTML);
  $("#itemCount").text(itemCount);
  $("#totalAmount").text("$" + grandTotal.toFixed(2));
}

function doShowAll() {
  if (CheckBrowser()) {
    var key = "";
    var list = "<tr><th>Item</th><th>Value</th></tr>\n";
    var i = 0;
    //For a more advanced feature, you can set a cap on max items in the cart.
    for (i = 0; i <= localStorage.length - 1; i++) {
      key = localStorage.key(i);
      list +=
        "<tr><td>" +
        key +
        "</td>\n<td>" +
        localStorage.getItem(key) +
        "</td></tr>\n";
    }
    //If no item exists in the cart.
    if (list == "<tr><th>Item</th><th>Value</th></tr>\n") {
      list += "<tr><td><i>empty</i></td>\n<td><i>empty</i></td></tr>\n";
    }
    //Bind the data to HTML table.
    //You can use jQuery, too.
    document.getElementById("list").innerHTML = list;
  } else {
    alert("Cannot save shopping list as your browser does not support HTML 5");
  }
}

//Change an existing key-value in HTML5 storage.
function ModifyItem() {
  var name1 = document.forms.ShoppingList.name.value;
  var data1 = document.forms.ShoppingList.data.value;
  //check if name1 is already exists

  //Check if key exists.
  if (localStorage.getItem(name1) != null) {
    //update
    localStorage.setItem(name1, data1);
    document.forms.ShoppingList.data.value = localStorage.getItem(name1);
  }

  doShowAll();
}

function ModifyItem() {
  var name1 = $("#name").val();
  var data1 = $("#data").val();
  //Check if name already exists.
  //Check if key exists.
  if (localStorage.getItem(name1) != null) {
    //update
    localStorage.setItem(name1, data1);
    var new_info = localStorage.getItem(name1);
    $("#data").val(new_info);
  }

  doShowAll();
}

function RemoveItem() {
  var name = document.forms.ShoppingList.name.value;
  document.forms.ShoppingList.data.value = localStorage.removeItem(name);
  doShowAll();
}

function ClearAll() {
  localStorage.clear();
  doShowAll();
}
