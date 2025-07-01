const navbar = document.querySelector("nav"),
  scrollHeightThreshold = 90,
  serverAddress = "/api";
$(document).on("click", "button", function (e) {
  e.preventDefault();
}),
  (window.onscroll = function () {
    let e = window.pageYOffset;
    e > 90
      ? navbar.classList.add("fixed-top")
      : navbar.classList.remove("fixed-top");
  }),
  $("#search").on("keyup", function () {
    var e = $(this).val();
    0 === e.length
      ? ($(".bi-search").css("display", "block"),
        $(".search-results .container").remove(),
        $(".search-results").css("display", "none"))
      : ($(".bi-search").css("display", "none"),
        $(".search-bar").css("border-radius", "0px"),
        $(".search-results").css("display", "block"),
        $.ajax({
          url: `${serverAddress}/product/search?q=${e}`,
          type: "GET",
          success(e) {
            let a = e;
            if (($(".search-results .container").remove(), a.length > 0)) {
              $(".search-results p").remove();
              for (let s = 0; s < a.length; s++) {
                let n = a[s],
                  r = `
                          <div class="container" dir="rtl">
                            <div class="row">
                              <div class="col-6 col-xl-4 col-lg-6 col-md-3 ">
                                <a href="/pages/product.html?id=${n.id}">
                                  <img src="/api/uploads/products/${n.picture}" class="search-image" height="100%" width="100%" alt="">
                                </a>
                              </div>
                              <div class="col-6 col-xl-8 col-lg-6 col-md-9" style="padding-right: 0px;">
                                <a href="/pages/product.html?id=${n.id}">
                                  <div class="search-product text-dark">
                                    <p class="mb-0 mt-2">${n.name}</p>
                                    <p class="mt-2"><span class="price">${n.price}</span> <span class="price">رس</span></p>
                                  </div>
                                </a>
                              </div>
                            </div>
                            <hr class="search-line">            
                          </div>
                          
                        `;
                $(".search-results").append(r);
              }
            } else {
              let l = `
                    <div class="container">
    <div class="row">
      <div class="col-12">
        <p id="none" class="text-center"> لايوجد ما يطابق بحثك </p>
      </div>
    </div>
  </div>
                    `;
              $(".search-results").append(l);
            }
          },
          error(e) {
            var a;
            $(".spinner-container").css("display", "none"),
              (a = `
                 <div class="alert alert-danger" dir="rtl" style="display: none;">
                   <strong>خطأ:</strong><span>حدث خطأ ما الرجاء المحاولة لاحقاً</span>
                 </div>`),
              $(".box").after(a),
              $(".alert-danger").fadeIn(300),
              setTimeout(() => {
                $(".alert-danger").fadeOut(500);
              }, 3e3);
          },
        }));
  });
const accessToken = localStorage.getItem("accessToken"),
  loginType = localStorage.getItem("loginType");
function normalLoader() {
  $(".spinner-container").css("display", "flex"),
    $("html").css("overflow", "hidden");
}
function specialLoader() {
  $(".spinner-container").css("display", "flex"),
    $(".spinner-container").css("background-color", "#e4e4e4"),
    $("html").css("overflow", "hidden");
}
function removeLoader() {
  $(".spinner-container").css("display", "none"),
    $(".spinner-container").css("background-color", "rgba(0, 0, 0, 0.5)"),
    $("html").css("overflow", "visible");
}
function errorMsg(e) {
  var a = `
    <div class="alert alert-danger" dir="rtl" style="display: none;">
      <strong>خطأ:</strong><span>${e}</span>
    </div>`;
  $("nav").after(a),
    $(".alert-danger").fadeIn(300),
    setTimeout(() => {
      $(".alert-danger").fadeOut(500, function () {
        $(".alert-danger").remove();
      });
    }, 2e3);
}
function successMsg(e) {
  var a;
  (a = `
    <div style="z-index: 99999999999999;" class="alert alert-success" dir="rtl" style="display: none;">
    <strong>تم:</strong><span>${e}</span>
  </div>
    `),
    $("nav").after(a),
    $(".alert").fadeIn(500),
    setTimeout(() => {
      $(".alert-success").fadeOut(500), location.reload();
    }, 2e3);
}
function warningMsg(e) {
  var a;
  (a = `
    <div style="z-index: 99999999999999;" class="alert alert-warning" dir="rtl" style="display: none;">
    <strong>تم:</strong><span>${e}</span>
  </div>
    `),
    $("nav").after(a),
    $(".alert").fadeIn(500),
    setTimeout(() => {
      $(".alert-warning").fadeOut(500, function () {
        $(".alert-warning").remove();
      });
    }, 2e3);
}
window.addEventListener("DOMContentLoaded", function () {
  if (accessToken) {
    if ("user" === loginType) {
      let e = `
            <a class="d-xl-block d-lg-block d-md-none d-none user-login-btns profile settings" aria-current="page" style="margin-right: auto;
            margin-left: auto;"
            href="/pages/user-profile.html">ادارة الحساب</a>
            <a class="logout d-xl-block d-lg-block d-md-none d-none user-login-btns" id="logout" aria-current="page" style="margin-left: auto;"
            href="#">تسجيل الخروج</a>
            `;
      $(".login").replaceWith(e);
      let a = `
        <li class="nav-item">
             <a class="nav-link nav-btn-mobile profile"  aria-current="page"
                 href="/pages/user-profile.html">ادارة الحساب</a>
         </li>
    <li class="nav-item">
         <a class="nav-link nav-btn-mobile logout" id="logout" aria-current="page"
             href="#"> تسجيل الخروج </a>
     </li>
             `;
      $(".mobile-login").replaceWith(a);
    } else if ("supplier" === loginType) {
      let s = `
            <a class="d-xl-block d-lg-block d-md-none d-none user-login-btns settings profile" aria-current="page" style="margin-right: auto; font-size: 0.9rem;"
            href="/pages/supplier-profile.html">ادارة الحساب</a>
            <a class="d-xl-block d-lg-block settings d-md-none d-none user-login-btns manage-products" aria-current="page" style="font-size: 0.9rem;
            margin-left: auto; margin-right: auto;"
            href="/pages/manage-products.html">ادارة المنتجات</a>
            <a class="logout d-xl-block d-lg-block d-md-none d-none user-login-btns" id="logout" aria-current="page" style="margin-left: auto; font-size: 0.9rem;"
            href="#">تسجيل الخروج</a>
            `;
      $(".login").replaceWith(s);
      let n = `
        <li class="nav-item">
             <a class="nav-link nav-btn-mobile profile"  aria-current="page"
                 href="/pages/supplier-profile.html">ادارة الحساب</a>
         </li>
         <li class="nav-item">
         <a class="nav-link nav-btn-mobile manage-products"  aria-current="page"
             href="/pages/manage-products.html">ادارة المنتجات</a>
     </li>
    <li class="nav-item">
         <a class="nav-link nav-btn-mobile logout" id="logout" aria-current="page"
             href="#"> تسجيل الخروج </a>
     </li>
             `;
      $(".mobile-login").replaceWith(n);
    } else localStorage.clear();
  }
  let r = window.location.pathname;
  if ("/pages/products.html" === r) {
    let l = $(".nav-products");
    l.addClass("navbar-brand");
  }
  if (r.includes("new-products")) {
    let t = $(".nav-new-products");
    t.addClass("navbar-brand");
  }
  if (r.includes("most-products")) {
    let i = $(".nav-most-products");
    i.addClass("navbar-brand");
  }
  if (r.includes("index")) {
    let o = $(".nav-home-page");
    o.addClass("navbar-brand");
  }
  if ("/pages/manage-products.html" === r) {
    let c = $(".manage-products");
    c.addClass("navbar-brand");
  }
  if ("/pages/profile.html" === r) {
    let d = $(".profile");
    d.addClass("navbar-brand");
  }
}),
  $(document).on("click", ".logout", function () {
    localStorage.clear(), window.location.reload();
  }),
  $(document).on("submit", "#signin", function (e) {
    e.preventDefault(), $(".spinner-container").css("display", "flex");
    let a = $("#username").val(),
      s = $("#password").val();
    $.ajax({
      url: `${serverAddress}/auth/signin`,
      type: "POST",
      data: JSON.stringify({ username: a, password: s }),
      headers: { "Content-Type": "application/json" },
      success(e) {
        localStorage.setItem("accessToken", e.token),
          "SUPP" === e.type
            ? (localStorage.setItem("loginType", "supplier"),
              setTimeout(() => {
                window.location.href = "/pages/supplier-profile.html";
              }, 500))
            : (localStorage.setItem("loginType", "user"),
              setTimeout(() => {
                window.location.href = "/index.html";
              }, 500));
      },
      error(e) {
        var a;
        $(".spinner-container").css("display", "none"),
          (a =
            404 === e.status
              ? `
            <div class="alert alert-danger" dir="rtl" style="display: none;">
              <strong>خطأ:</strong><span>اسم المستخدم أو كلمة المرور خاطئة</span>
            </div>`
              : `
            <div class="alert alert-danger" dir="rtl" style="display: none;">
              <strong>خطأ:</strong><span>حدث خطأ ما الرجاء المحاولة لاحقاً</span>
            </div>`),
          $(".box").after(a),
          $(".alert-danger").fadeIn(300),
          setTimeout(() => {
            $(".alert-danger").fadeOut(500, function () {
              $(".alert-danger").remove();
            });
          }, 2e3);
      },
    });
  });
