(accessToken && loginType) || (window.location.href = "/pages/login.html"),
  window.addEventListener("DOMContentLoaded", function () {
    specialLoader(),
      $.ajax({
        url: `${serverAddress}/settings/user`,
        type: "GET",
        headers: { Authorization: accessToken },
        success(e) {
          removeLoader();
          let t = e;
          $("#username").val(t.username), $("#name").val(t.name);
        },
        error(e) {
          removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
        },
      });
  }),
  $(document).on("keyup", "input", function () {
    let e = $(".save-changes");
    e.attr("disabled", !1);
  }),
  $(document).on("submit", "#user-profile", function (e) {
    e.preventDefault(), normalLoader();
    let t = $("#name").val(),
      a = $("#username").val();
    $.ajax({
      url: `${serverAddress}/settings/user`,
      type: "POST",
      data: JSON.stringify({ name: t, username: a }),
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      success(e) {
        successMsg("تم تعديل المعلومات بنجاح");
      },
      error(e) {
        removeLoader(),
          400 === e.status
            ? errorMsg("الرجاء اختيار اسم مستخدم اخر")
            : errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
      },
    });
  });
