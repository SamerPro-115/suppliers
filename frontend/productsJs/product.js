const queryString = window.location.search,
  urlParams = new URLSearchParams(queryString),
  id = urlParams.get("id");
function comments() {
  $.ajax({
    url: `${serverAddress}/product/${id}/comments?page=1&size=5`,
    type: "GET",
    success(s) {
      let e = s;
      for (let c = 0; c < e.length; c++) {
        let t = e[c],
          a = `
                  <div class="col-8" >
                      <div class="comments-data">
                          <img src="/images/user.png" class="user-image" alt="صورة مستخدم">
                          <div class="comment-text">
                              <h5 class="user-name">${t.username}</h5>
                              <p class="user-comment ">${t.comment}</p>
                          </div>
                      </div>
                  </div>
                  <div class="col-4">
                      <p class="comment-date">${new Date(
                        t.created_at
                      ).toLocaleDateString("en-US")}</p>
                  </div>   
              `;
        $("#users-comments").append(a);
      }
      removeLoader();
    },
    error(s) {
      removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
    },
  });
}
window.addEventListener("DOMContentLoaded", function () {
  specialLoader(),
    $.ajax({
      url: `${serverAddress}/product/${id}`,
      type: "GET",
      success(s) {
        let e = s;
        var c = e.supplier.whatsapp_number,
          t = "https://wa.me/" + (c = c.replace(/\+/g, "").replace(/\s/g, ""));
        let a = `
            <div class="col-12 col-xl-6 col-lg-6">
            <div class="magnify">
                <div
                  class="magnifier"
                  style="
                    background-image: url('/api/uploads/products/${e.picture}');
                  "
                ></div>
                <div class="magnified">
                    <img src="/api/uploads/products/${
                      e.picture
                    }" class="product-image" id="product-image" width="100%" alt="منتج">

                </div>
              </div>
        </div>
        <div class="col-12 col-xl-6 col-lg-6">
            <div class="product-details">
                <h2 class="product-title">${e.name}</h2>
                <h5 class="product-price">سعر المنتج: <span class="price-number">${
                  e.price
                }</span> <span class="currency">رس</span></h5>
                <h6 class="product-quantity fw-bold"> الكمية: <span class="quantity-number">${
                  e.quantity ?? " غير محدده "
                }</span> <span class="quantity-word">${
            e.quantity ? "حبة/قطعة" : ""
          }</span></h6>
                <div class="description">
                    <h6 class="fw-bold mb-0">وصف المنتج:</h6>
                    <p class="description-text">${e.description}</p>
                </div>
                <div class="social-container">
                <a href="${
                  e.supplier.website_link
                }" target="_blank" class="contact-supplier-icon-btn"><svg class="contact-supplier-icon"xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg></a>

                    <a target="_blank" href="${t}" class="contact-supplier-icon-btn">
                        <svg class="contact-supplier-icon" xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                    </a>
                    <a id="share" style="cursor: pointer;" class="share-product">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"/></svg>
                    </a>
                </div>
                <div class="product-card-container container">
                    <div class="row">
                        <div class="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                            <p class="details-card"> السعر: <span>${
                              e.price
                            }</span> <span>رس</span></p>
                        </div>
                        <div class="col-12 col-xl-6 col-lg-6 col-md-6 col-sm-6" style="text-align: left;">
                            <p class="details-card"> الكمية: <span>${
                              e.quantity ?? " غير محدده "
                            }</span><span>${
            e.quantity ? " حبة/قطعة " : ""
          }</span></p>
                        </div>
                        <hr class="card-product-line">
                        <div class="col-12">
                            <a target="_blank" href="tel:${e.supplier.whatsapp_number.replace(
                              /\s/g,
                              ""
                            )}" class="contact-supplier-btn btn">التواصل مع المورّد</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            `,
          _ = `
            <div class="col-12">
            <h3 class="text-center mb-3">${e.certificate.name ?? ""}</h3>
          </div>
          <div class="col-12">
            <div class="image">
              <img src="/api/uploads/certificates/${
                e.certificate.picture
              }" class="certificate-image-product-page" alt="شهادة ترخيص">
            </div>
          </div>
            `;
        $("#product").append(a), $("#certificate").append(_), comments();
      },
      error(s) {
        removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
      },
    });
}),
  $(document)
    .on("mouseenter", ".magnified", function (s) {
      var e = $(".magnify").position(),
        c = $(".magnified").height(),
        t = $(".magnified").width();
      $(".magnifier").show(),
        $(this).mousemove(function (s) {
          var a = s.pageX - e.left,
            _ = s.pageY - e.top;
          $(".magnifier").css({
            top: _,
            left: a,
            backgroundPosition: (a / t) * 100 + "% " + (_ / c) * 100 + "%",
          });
        });
    })
    .on("mouseleave", ".magnified", function () {
      $(".magnifier").hide();
    }),
  $(document).on("submit", "#comment", function (s) {
    s.preventDefault(), normalLoader();
    let e = $("#add-comment").val();
    $.ajax({
      url: `${serverAddress}/product/${id}/comment`,
      type: "POST",
      data: JSON.stringify({ comment: e }),
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      success(s) {
        successMsg("تم اضافة التعليق بنجاح", function () {
          location.reload();
        });
      },
      error(s) {
        removeLoader(),
          401 === s.status
            ? (window.location.href = "/pages/login.html")
            : (removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً"));
      },
    });
  }),
  $(document).on("click", ".share-product", function () {
    var s,
      e = window.location.href,
      c = $("<input>");
    $("body").append(c),
      c.val(e),
      c.select(),
      document.execCommand("copy"),
      c.remove(),
      (s = `
    <div style="z-index: 99999999999999;" class="alert alert-success" dir="rtl" style="display: none;">
    <strong>تم:</strong><span>تم نسخ رابط المنتج</span>
  </div>
    `),
      $("nav").after(s),
      $(".alert-success").fadeIn(500),
      setTimeout(() => {
        $(".alert-success").fadeOut(500);
      }, 2e3);
  });
