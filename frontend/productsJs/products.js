let page = 1,
  total = 0,
  currentProducts = 0;
window.addEventListener("DOMContentLoaded", function () {
  specialLoader(),
    $.ajax({
      url: `${serverAddress}/product/all?page=1&size=6`,
      type: "GET",
      success(s) {
        let a = s;
        for (let t = 0; t < a.products.length; t++) {
          let r = a.products[t],
            c = `
                    <div class="col-lg-4 col-md-6 mb-4 products" dir="rtl">
                        <a href="/pages/product.html?id=${r.id}">
                            <div class="card">
                                <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                                  data-mdb-ripple-color="light">
                                  <img src="/api/uploads/products/${r.picture}"
                                    class="w-100" />
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title mb-3">${r.name}</h5>
                                    <p>الكميّة:<span class="quantity"> ${
                                      r.quantity ?? "غير محدده"
                                    } </span></p>
                                    <h6 class="mb-3">السعر: <span class="price"> ${
                                      r.price
                                    } رس</span></h6>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
          $("#all-products").append(c);
        }
        (total = Number(a.total)),
          (page += 1),
          (currentProducts += a.products.length),
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
          url: `${serverAddress}/product/all?page=${page}&size=6`,
          type: "GET",
          success(s) {
            let a = s;
            for (let t = 0; t < a.products.length; t++) {
              let r = a.products[t],
                c = `
                        <div class="col-lg-4 col-md-6 mb-4 products">
                            <a href="/pages/product.html?id=${r.id}">
                                <div class="card">
                                    <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                                      data-mdb-ripple-color="light">
                                      <img src="/api/uploads/products/${
                                        r.picture
                                      }"
                                        class="w-100" />
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title mb-3">${
                                          r.name
                                        }</h5>
                                        <p>الكميّة:<span class="quantity"> ${
                                          r.quantity ?? "غير محدده"
                                        } </span></p>
                                        <h6 class="mb-3">السعر: <span class="price"> ${
                                          r.price
                                        } رس</span></h6>
                                    </div>
                                </div>
                            </a>
                        </div>
                    `;
              $(".products").last().after(c);
            }
            removeLoader(), (currentProducts += a.products.length), (page += 1);
          },
          error(s) {
            removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
          },
        })
      : (removeLoader(), warningMsg("عذراً انتهت جميع المنتجات"));
  });
