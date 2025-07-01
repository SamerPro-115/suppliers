window.addEventListener("DOMContentLoaded", function () {
  specialLoader(),
    $.ajax({
      url: `${serverAddress}/product?page=1&size=3`,
      type: "GET",
      success(s) {
        let a = s;
        for (let c = 0; c < a.products.length; c++) {
          let e = a.products[c],
            p = `
                <div class="col-lg-4 col-md-6 mb-4 products">
                    <a href="/pages/product.html?id=${e.id}">
                        <div class="card">
                            <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                              data-mdb-ripple-color="light">
                              <img src="/api/uploads/products/${e.picture}"
                                class="w-100" />
                            </div>
                            <div class="card-body">
                                <h5 class="card-title mb-3">${e.name}</h5>
                               <p>الكميّة:<span class="quantity"> ${
                                 e.quantity ?? "غير محدده"
                               } </span></p>
                             <h6 class="mb-3">السعر: <span class="price"> ${
                               e.price
                             } رس</span></h6>
                            </div>
                          </div>
                    </a>
                </div>
                `;
          $("#new-products").append(p);
        }
        $.ajax({
          url: `${serverAddress}/top?page=1&size=3`,
          type: "GET",
          success(s) {
            let a = s;
            for (let c = 0; c < a.products.length; c++) {
              let e = a.products[c],
                p = `
                    <div class="col-lg-4 col-md-6 mb-4 products">
                        <a href="/pages/product.html?id=${e.id}">
                            <div class="card">
                                <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                                  data-mdb-ripple-color="light">
                                  <img src="/api/uploads/products/${e.picture}"
                                    class="w-100" />
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title mb-3">${e.name}</h5>
                                   <p>الكميّة:<span class="quantity"> ${
                                     e.quantity ?? "غير محدده"
                                   } </span></p>
                                 <h6 class="mb-3">السعر: <span class="price"> ${
                                   e.price
                                 } رس</span></h6>
                                </div>
                              </div>
                        </a>
                    </div>
                    `;
              $("#most-products").append(p);
            }
            $.ajax({
              url: `${serverAddress}/product?page=1&size=3`,
              type: "GET",
              success(s) {
                let a = s;
                for (let c = 0; c < a.products.length; c++) {
                  let e = a.products[c],
                    p = `
                    <div class="col-lg-4 col-md-6 mb-4 products">
                        <a href="/pages/product.html?id=${e.id}">
                            <div class="card">
                                <div class="bg-image hover-zoom ripple ripple-surface ripple-surface-light"
                                  data-mdb-ripple-color="light">
                                  <img src="/api/uploads/products/${e.picture}"
                                    class="w-100" />
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title mb-3">${e.name}</h5>
                                   <p>الكميّة:<span class="quantity">  ${
                                     e.quantity ?? "غير محدده"
                                   }</span></p>
                                 <h6 class="mb-3">السعر: <span class="price"> ${
                                   e.price
                                 } رس</span></h6>
                                </div>
                              </div>
                        </a>
                    </div>
                    `;
                  $("#all-products").append(p);
                }
                $.ajax({
                  url: `${serverAddress}/reviews`,
                  type: "GET",
                  success(s) {
                    let a = s;
                    for (let c = 0; c < a.length; c++) {
                      let e = a[c],
                        p = `
                    <div class="col-md-4" dir="rtl">
                    <div class="card p-3 text-center px-4">
                        <div class="user-image">
                           <img src="images/user.png" class="rounded-circle" width="80">
                        </div>
                        <div class="user-content">  
                            <h5 class="mb-0">${e.username}</h5>
                            <span>المنتج: <span class="product-name">${e.product_name}</span></span>
                            <p>${e.comment}</p>
                        </div>
                    </div>
                </div>
                
                    `;
                      $("#reviews").append(p);
                    }
                    removeLoader();
                  },
                  error(s) {
                    removeLoader(),
                      errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
                  },
                });
              },
              error(s) {
                removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
              },
            });
          },
          error(s) {
            removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
          },
        });
      },
      error(s) {
        removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
      },
    });
});
