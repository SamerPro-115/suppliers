(accessToken && loginType) || (window.location.href = "/pages/login.html");
let pic = document.getElementById("certificate-image"),
  inputFile = document.getElementById("input-file");
(inputFile.onchange = function () {
  pic.src = URL.createObjectURL(inputFile.files[0]);
}),
  window.addEventListener("DOMContentLoaded", function () {
    specialLoader(),
      $.ajax({
        url: `${serverAddress}/settings/user`,
        type: "GET",
        headers: { Authorization: accessToken },
        success(e) {
          let t = e;
          console.log(t),
            t &&
              (t.supplier.website_link &&
                $("#contact-url").val(t.supplier.website_link),
              t.supplier.whatsapp_number &&
                $("#whatsapp").val(t.supplier.whatsapp_number),
              t.supplier.name && $("#name").val(t.name),
              t.certificate &&
                (t.certificate.name &&
                  $("#certificate-name").val(t.certificate.name),
                t.certificate.picture &&
                  ($("#certificate-image").attr(
                    "src",
                    `/api/uploads/certificates/${t.certificate.picture}`
                  ),
                  $("#certificate-image").attr(
                    "data-image-id",
                    t.certificate.id
                  ))),
              $("#username").val(t.username),
              $("#supplier-name").val(t.supplier.name)),
            removeLoader();
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
  $(document).on("submit", "#supplier-profile", function (e) {
    e.preventDefault(), normalLoader();
    let t = $("#name").val(),
      a = $("#supplier-name").val(),
      i = $("#certificate-name").val(),
      n = $("#username").val(),
      r = $("#whatsapp").val(),
      s = $("#contact-url").val(),
      p = $("#certificate-image").attr("src");
    if (0 !== inputFile.files.length || p.includes("certificates")) {
      let c = new FormData();
      c.append("name", t),
        c.append("supplier_name", a),
        c.append("username", n),
        c.append("whatsapp_number", r),
        c.append("website_link", s),
        $.ajax({
          url: `${serverAddress}/settings/user`,
          type: "POST",
          data: c,
          processData: !1,
          contentType: !1,
          headers: { Authorization: accessToken },
          success(e) {
            if (inputFile.files.length > 0) {
              let t = new FormData();
              t.append("certificate", inputFile.files[0]),
                t.append("name", i),
                $.ajax({
                  url: `${serverAddress}/settings/certificate/`,
                  type: "POST",
                  data: t,
                  processData: !1,
                  contentType: !1,
                  headers: { Authorization: accessToken },
                  success(e) {},
                  error(e) {
                    removeLoader(),
                      errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
                  },
                });
            } else if (i.length > 0) {
              let a = $("#certificate-image").data("image-id");
              $.ajax({
                url: `${serverAddress}/settings/certificate/${a}`,
                type: "PATCH",
                data: JSON.stringify({ name: i }),
                headers: {
                  Authorization: accessToken,
                  "Content-Type": "application/json",
                },
                success(e) {},
                error(e) {
                  removeLoader(), errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
                },
              });
            }
            successMsg("تم تعديل المعلومات بنجاح");
          },
          error(e) {
            removeLoader(),
              400 === e.status
                ? errorMsg("الرجاء اختيار اسم مستخدم اخر")
                : errorMsg("حدث خطأ ما الرجاء المحاولة لاحقاً");
          },
        });
    } else throw (removeLoader(), Error(warningMsg("الرجاء اضافة صورة شهادة الترخيص")));
  });
