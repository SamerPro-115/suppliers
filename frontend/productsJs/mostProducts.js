let page = 1,
  total = 0,
  currentProducts = 0;
window.addEventListener("DOMContentLoaded", function () {
  specialLoader(),
    $.ajax({
      url: `${serverAddress}/top?page=1&size=6`,
      type: "GET",
      success(s) {
        let t = s;
        for (let a = 0; a < t.products.length; a++) {
          let c = t.products[a],
            r = `
                <div class="col-lg-4 col-md-6 mb-4 products">
                    <a href="/pages/product.html?id=${c.id}">
                        <div class="card">
                            <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                              data-mdb-ripple-color="light">
                              <img src="/api/uploads/products/${c.picture}"
                                class="w-100" />
                            </div>
                            <div class="card-body">
                                <h5 class="card-title mb-3">${c.name}</h5>
                               <p>الكميّة:<span class="quantity"> ${
                                 c.quantity ?? "غير محدده"
                               } </span></p>
                             <h6 class="mb-3">السعر: <span class="price"> ${
                               c.price
                             } رس</span></h6>
                            </div>
                          </div>
                    </a>
                </div>
                `;
          $("#most-products").append(r);
        }
        (currentProducts += t.products.length),
          (total = Number(t.total)),
          (page += 1),
          removeLoader();
      },
      error(s) {
        removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
      },
    });
}),
  $(document).on("click", ".show-more-products", function () {
    normalLoader();
    let s = total - currentProducts;
    s > 0
      ? $.ajax({
          url: `${serverAddress}/top?page=${page}&size=6`,
          type: "GET",
          success(s) {
            let t = s;
            for (let a = 0; a < t.products.length; a++) {
              let c = t.products[a],
                r = `
                    <div class="col-lg-4 col-md-6 mb-4 products">
                        <a href="/pages/product.html?id=${c.id}">
                            <div class="card">
                                <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                                  data-mdb-ripple-color="light">
                                  <img src="/api/uploads/products/${c.picture}"
                                    class="w-100" />
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title mb-3">${c.name}</h5>
                                   <p>الكميّة:<span class="quantity"> ${
                                     c.quantity ?? "غير محدده"
                                   } </span></p>
                                 <h6 class="mb-3">السعر: <span class="price"> ${
                                   c.price
                                 } رس</span></h6>
                                </div>
                              </div>
                        </a>
                    </div>
                    `;
              $(".products").last().after(r);
            }
            removeLoader(), (currentProducts += t.products.length), (page += 1);
          },
          error(s) {
            removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاّ");
          },
        })
      : (removeLoader(), warningMsg("عذراً انتهت جميع المنتجات"));
  });
