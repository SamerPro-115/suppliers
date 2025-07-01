let pic = document.getElementById("product-image-add"),
  inputFile = document.getElementById("input-file-add"),
  page = 1,
  total = 0,
  currentProducts = 0;
(accessToken && loginType) || (window.location.href = "/pages/login.html"),
  (inputFile.onchange = function () {
    pic.src = URL.createObjectURL(inputFile.files[0]);
  }),
  window.addEventListener("DOMContentLoaded", function () {
    specialLoader(),
      $.ajax({
        url: `${serverAddress}/settings/products?page=1&size=2`,
        type: "GET",
        headers: { Authorization: accessToken },
        success(t) {
          let e = t;
          if (e.products.length > 0) {
            for (let l = 0; l < e.products.length; l++) {
              let a = e.products[l],
                o = `

            <form id="edit-product" class="product" data-product-id="${a.id}">
            <div class="row"> 
            <div class="col-12 col-xl-3 col-lg-4">
            <div class="text-center">
              <img src="/api/uploads/products/${
                a.picture
              }" class="product-image-manage-products" id="image${
                  a.id
                }"  alt="صورة المنتج">
              <h6 class="mt-2">صورة المنتج</h6>
              <label for="input-file${
                a.id
              }" class="input-file">اضافة صورة</label>
              <input type="file" id="input-file${
                a.id
              }" class="input-file image" accept="image/jpeg, image/png, image/jpg">
            </div>
          </div>
    
          <div class="col-12 col-xl-9 col-lg-8 mt-3 product">
            <h3>معلومات المنتج</h3>
            
              <div class="form-group">
                <label class="col-lg-3 control-label mb-2">اسم المنتج</label>
                <div class="col-lg-8">
                  <input class="form-control" type="text" id="product-name" autocomplete="off" required value="${
                    a.name
                  }" placeholder="اسم المنتج">
                </div>
              </div>
              <div class="form-group mt-3">
                <label class="col-lg-3 control-label mb-2">الكميّة</label>
                <div class="col-lg-8">
                  <input class="form-control" type="text" id="product-quantity" autocomplete="off" value="${
                    a.quantity ?? ""
                  }" placeholder="${a.quantity ?? "غير محدده"}">
                </div>
              </div>
              <div class="form-group mt-3">
                <label class="col-lg-3 control-label mb-2">السعر</label>
                <div class="col-lg-8">
                  <input class="form-control" type="text" id="product-price" autocomplete="off" value="${
                    a.price
                  }" required placeholder="سعر المنتج">
                </div>
              </div>
              <div class="form-group mt-3">
                <label class="col-lg-3 control-label mb-2">وصف المنتج</label>
                <div class="col-lg-8">
                  <textarea class="form-control" id="product-description" autocomplete="off" required placeholder="وصف المنتج" type="text" rows="2" cols="10" >${
                    a.description
                  }</textarea>
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label"></label>
                <div class="col-md-8">
                  <input type="submit" value="حفظ التعديلات" disabled class="btn mb-5 mt-2  save-changes"/>
                  <input type="button" value="حذف المنتج" class="btn mb-5 mt-2  delete-product"/>
                  <span></span>
                </div>
              </div>
          </div>
          </div>
            </form>
            
         
            `;
              $(document).on("change", `#input-file${a.id}`, function () {
                $(`#image${a.id}`).attr(
                  "src",
                  URL.createObjectURL(this.files[0])
                );
              }),
                $("#create-product").after(o);
            }
            (total = Number(e.total)),
              (page += 1),
              (currentProducts += e.products.length);
            let c = `
        <button class="btn show-more-products mt-5" id="show-more-supplier-products"><strong>عرض المزيد</strong></button>
        `,
              i = `
        <h1 class="text-center mb-5 mt-5 my-products-word" id="my-products-word">منتجاتي</h1>
        <hr class="mb-5" style="margin-top: 5rem;">
        `;
            $("#last-element").after(c), $("#create-product").after(i);
          } else {
            let r = `
            <h1 class="text-center mb-5 mt-5 no-products" id="no-products">لاتوجد لديك منتجات اخرى</h1>
    
            `;
            $("#create-product").after(r);
          }
          removeLoader();
        },
        error(t) {
          removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
        },
      });
  }),
  $(document).on("click", "#show-more-supplier-products", function () {
    normalLoader();
    let t = total - currentProducts;
    t > 0
      ? $.ajax({
          url: `${serverAddress}/settings/products?page=${page}&size=2`,
          type: "GET",
          headers: { Authorization: accessToken },
          success(t) {
            let e = t;
            for (let l = 0; l < e.products.length; l++) {
              let a = e.products[l],
                o = `
              <div class="col-md-3">
                <div class="text-center">
                  <img src="/api/uploads/products/${
                    a.picture
                  }" class="product-image-manage-products"  alt="صورة المنتج">
                  <h6 class="mt-2">صورة المنتج</h6>
                  <label for="input-file${l}" class="input-file">اضافة صورة</label>
                  <input type="file" id="input-file${l}" class="input-file" accept="image/jpeg, image/png, image/jpg">
                </div>
              </div>
        
              <div class="col-md-9 mt-3 product">
                <h3>معلومات المنتج</h3>
                
                <form class="form-horizontal" data-product-id="${a.id}" id="${
                  a.id
                }" role="form">
                  <div class="form-group">
                    <label class="col-lg-3 control-label mb-2">اسم المنتج</label>
                    <div class="col-lg-8">
                      <input class="form-control" type="text" required value="${
                        a.name
                      }" placeholder="اسم المنتج">
                    </div>
                  </div>
                  <div class="form-group mt-3">
                    <label class="col-lg-3 control-label mb-2">الكميّة</label>
                    <div class="col-lg-8">
                      <input class="form-control" type="text" value="${
                        a.quantity ?? "غير محدده"
                      }" placeholder="الكميّة">
                    </div>
                  </div>
                  <div class="form-group mt-3">
                    <label class="col-lg-3 control-label mb-2">السعر</label>
                    <div class="col-lg-8">
                      <input class="form-control" type="text" value="${
                        a.price
                      }" required placeholder="سعر المنتج">
                    </div>
                  </div>
                  <div class="form-group mt-3">
                    <label class="col-lg-3 control-label mb-2">وصف المنتج</label>
                    <div class="col-lg-8">
                      <textarea class="form-control" required placeholder="وصف المنتج" type="text" rows="2" cols="10" >${
                        a.description
                      }</textarea>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-3 control-label"></label>
                    <div class="col-md-8">
                      <button type="submit" class="btn mb-5 mt-2 save-changes">حفظ التعديلات</button>
                      <button type="button" class="btn mb-5 mt-2 delete-product">حذف المنتج</button>
                      <span></span>
                    </div>
                  </div>
                </form>
              </div>
                `;
              $(document).on("change", `#input-file${l}`, function () {
                $(this)
                  .siblings("img")
                  .attr("src", URL.createObjectURL(this.files[0]));
              }),
                $(".product").last().after(o);
            }
            removeLoader(), (currentProducts += e.products.length), (page += 1);
          },
          error(t) {
            removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
          },
        })
      : (removeLoader(), warningMsg("عذراً انتهت جميع المنتجات"));
  }),
  $(document).on("submit", "#create-product", function (t) {
    if ((t.preventDefault(), normalLoader(), 0 === inputFile.files.length))
      throw (removeLoader(), Error(warningMsg("الرجاء اضافة صورة للمنتج")));
    $.ajax({
      url: `${serverAddress}/settings/user`,
      type: "GET",
      headers: { Authorization: accessToken },
      success: (t) => {
        if (t.certificate.picture) {
          let e = $(this).find("#product-name").val(),
            l = $(this).find("#product-quantity").val(),
            a = $(this).find("#product-price").val(),
            o = $(this).find("#product-description").val(),
            c = new FormData();
          c.append("picture", inputFile.files[0]),
            c.append("name", e),
            c.append("quantity", l),
            c.append("price", a),
            c.append("description", o),
            $.ajax({
              url: `${serverAddress}/product`,
              type: "POST",
              data: c,
              processData: !1,
              contentType: !1,
              headers: { Authorization: accessToken },
              success(t) {
                successMsg("تم انشاء المنتج بنجاح", function () {
                  location.reload();
                });
              },
              error(t) {
                removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
              },
            });
        } else
          removeLoader(),
            warningMsg("المورّد لايمتلك شهادة ترخيص", function () {
              window.location.href = "/pages/supplier-profile.html";
            });
      },
      error(t) {
        removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
      },
    });
  }),
  $(document).on("keypress", "#product-price, #product-quantity", function (t) {
    if (String.fromCharCode(t.which ? t.which : event.keyCode).match(/[^0-9]/g))
      return !1;
  }),
  $(document).on("submit", "#edit-product", function (t) {
    t.preventDefault(), normalLoader();
    let e = $(this).data("product-id"),
      l = $(`#input-file${e}`)[0],
      a = new FormData(),
      o = $(this).find("#product-name").val(),
      c = $(this).find("#product-quantity").val(),
      i = $(this).find("#product-price").val(),
      r = $(this).find("#product-description").val();
    l.files.length > 0 && a.append("picture", l.files[0]),
      a.append("name", o),
      a.append("quantity", c),
      a.append("price", i),
      a.append("description", r),
      $.ajax({
        url: `${serverAddress}/product/${e}`,
        type: "PATCH",
        data: a,
        processData: !1,
        contentType: !1,
        headers: { Authorization: accessToken },
        success(t) {
          successMsg("تم تعديل المنتج بنجاح", function () {
            location.reload();
          });
        },
        error(t) {
          removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
        },
      });
  }),
  $(document).on("click", ".delete-product", function () {
    let t = $(this).parents("form").data("product-id");
    normalLoader(),
      $.ajax({
        url: `${serverAddress}/product/${t}`,
        type: "DELETE",
        headers: { Authorization: accessToken },
        success(t) {
          successMsg("تم حذف المنتج بنجاح", function () {
            location.reload();
          });
        },
        error(t) {
          removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
        },
      });
  }),
  $(document).on("keyup", "input,textarea", function () {
    let t = $(this).parents("form").find(".save-changes");
    t.attr("disabled", !1);
  });
