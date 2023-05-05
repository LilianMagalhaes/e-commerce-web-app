document.addEventListener("DOMContentLoaded", () => {
  let btnConnectClient = document.getElementById("btn-connect");
  btnConnectClient.addEventListener("click", (e) => {
    hideConnectionArea();
  });

  const hideConnectionArea = () => {
    $("#disconnected-area").css("display", "none");
    $("#app-nav").css("display", "flex");
  };

  let tabProducts = [];
  const readDbData = () => {
    fetch("/getProductsGallery")
      .then((response) => response.json())
      .then((data) => {
        tabProducts = data;
        //console.log(tabProducts);
        //console.log(`1-readDbData fetched: ${tabProducts}`);
        //console.log(`2-readDbData() sent to displayProductsGallery(): ${tabProducts}`);
        displayProductsGallery(tabProducts);
        loadProductCardScript();
      })
      .catch((error) => console.error(error));
  };

  readDbData();

  //Create HTML elements and display products list:
  const displayProductsGallery = (products) => {
    //console.log(`3-displayProductsGallery() received: ${products}`);
    //let sortedProductsList = sortProductsByPrice(products);
    let productListCards = createListCard(products);
    //console.log(`8-productListCards received: ${productListCards}`);
    //let productListCards = createListCard(sortedProductsList);
    let wrap = document.getElementById("display-productGallery");
    wrap.innerHTML = "";
    for (const productListCard of productListCards) {
      wrap.insertAdjacentHTML("beforeEnd", productListCard);
    }
    //console.log(`9-wrap.innerHTML === ${wrap.innerHTML}`);
  };

  const createListCard = (list) => {
    //console.log(`4-createListCard received: ${list}`);
    let productsGallery = [];
    list.forEach((product) => {
      let overviewArray = product.overview;
      //console.log(`overviewArray === ${overviewArray}`);
      let productOverview = readOverviewArray(overviewArray);
      //console.log(`productOverview === ${productOverview}`);
      let productsGalleryCard = `
      <section class="wrap">
    <article class='card-container' id='container-card_${product.code}'>
    <div class='flip_box' id='flip_box-card_${product.code}'>
        <div class='front'>
            <h1 class='f_title'>${product.name}</h1>
            
            <img class='img-main-product' src='${product.mainImage}' alt=''></img>
            
            <p class='f_headline'>Brand: ${product.brand}</p>
            <p class='f_subline'>$${product.price} CAD</p>
            <button class='f_button btn-txt'>
              <span class='btn-txt'>Add to basket</span>
              <span class='material-symbols-outlined'>shopping_basket</span>
            </button>
        </div>

        <div class='back'>
            <h2 class='b_title'>${product.name}</h2>
            <div class='scroll-box'>
            <h5><strong> About it:</strong> </h5>
            <ul>${productOverview}
            </ul>
            </div> 
            <p class='b_subline'>$${product.price} CAD</p>
            <button class='b_button btn-txt'>
              <span class='btn-txt'>Add to basket</span>
              <span class='material-symbols-outlined'>shopping_basket</span>
            </button>
        </div>
    </div>
    <div class='r_wrap'>
        <div class='b_round' id='b_round-card_${product.code}'></div>
        <div class='s_round' id='card_${product.code}'>
            <div class='s_arrow' id='s_arrow-card_${product.code}'></div>
        </div>
    </div>
</article>
</section>`;

      productsGallery.push(productsGalleryCard);
    });
    //console.log(`7-producsGallery === ${productsGallery}`);
    return productsGallery;
  };

  const readOverviewArray = (overviewArray) => {
    //console.log(`5-readOverviewArray received: ${overviewArray}`);
    let productOverview = [];
    for (let oneOverview of overviewArray) {
      let cardOverview = `<li class='b_text inside-scroll'>${oneOverview}</li>`;
      productOverview.push(cardOverview);
    }
    //console.log(`6-productOverview === ${productOverview}`);
    return productOverview;
  };
});
