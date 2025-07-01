const serverAddress = "/api";
$("#pass-2, #pass-1").on("keyup", function () {
  let e = $("#pass-1").val(),
    s = $("#pass-2").val(),
    n = $("#pass-2").val().length,
    a = $(".red-note");
  if (0 !== n && s !== e && !a.length > 0) {
    let t = `
        <span class="red-note">*كلمة المرور غير متطابقة</span>
        `;
    $(".pass-note").css("display", "none"), $(".pass-word").after(t);
  } else a.length > 0 && (s === e || e === s) && ($(".red-note").remove(), $(".pass-note").css("display", "block"));
}),
  $(".password").on("keyup", function () {
    let e = $(this).val(),
      s = $(this).closest("div").find("label");
    e.length > 0
      ? s.css({
          top: "-1.125rem",
          left: "0",
          color: "#95cbff",
          "font-size": " 0.75rem",
        })
      : s.removeAttr("style");
  }),
  $(document).on("submit", "#supp-signup", function (e) {
    e.preventDefault(), $(".spinner-container").css("display", "flex");
    let s = $("#name").val(),
      n = $("#username").val(),
      a = $("#supplier-name").val(),
      t = $("#pass-1").val(),
      r = $("#pass-2").val(),
      l = $("#whatsapp_number").val();
    var p = !1;
    if ((t === r && (p = !0), !0 === p)) {
      let o = {
        type: "SUPP",
        username: n,
        supplier_name: a,
        password: t,
        whatsapp_number: l,
      };
      s.length > 0 && (o.name = s),
        $.ajax({
          url: "/api/auth/signup",
          type: "POST",
          data: JSON.stringify(o),
          headers: { "Content-Type": "application/json" },
          success(e) {
            localStorage.setItem("accessToken", e.token),
              localStorage.setItem("loginType", "supplier"),
              setTimeout(() => {
                window.location.href = "/pages/supplier-profile.html";
              }, 500);
          },
          error(e) {
            var s;
            $(".spinner-container").css("display", "none"),
              (s =
                400 === e.status
                  ? `
            <div class="alert alert-danger" dir="rtl" style="display: none;">
              <strong>خطأ:</strong><span>الرجاء اختيار اسم مستخدم اخر</span>
            </div>`
                  : `
            <div class="alert alert-danger" dir="rtl" style="display: none;">
              <strong>خطأ:</strong><span>حدث خطأ ما الرجاء المحاولة لاحقاً</span>
            </div>`),
              $(".box").after(s),
              $(".alert-danger").fadeIn(300),
              setTimeout(() => {
                $(".alert-danger").fadeOut(500, function () {
                  $(".alert-danger").remove();
                });
              }, 2e3);
          },
        });
    } else {
      $(".spinner-container").css("display", "none");
      let i = `
        <span class="red-note">*كلمة المرور غير متطابقة</span>
        `;
      $(".pass-word").after(i),
        setTimeout(function () {
          $(".red-note").fadeOut(500, function () {
            $(".red-note").remove();
          });
        }, 2e3);
    }
  }),
  document
    .getElementById("whatsapp_number")
    .addEventListener("input", function (e) {
      let s = e.target.value.replace(/[^0-9+\s]/g, "");
      e.target.value = s;
    });
