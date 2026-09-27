const WEBAPP_URL =
  "ใส่ URL Google Apps Script /exec ตรงนี้";


let scanner = null;


const startBtn =
  document.getElementById("startBtn");


startBtn.addEventListener(
  "click",
  startScanner
);


function getFormData() {

  const user =
    document.getElementById("user")
      .value.trim();

  const location =
    document.getElementById("location")
      .value.trim();

  const action =
    document.getElementById("action")
      .value;

  const weight =
    document.getElementById("weight")
      .value.trim();


  if (!user) {

    showError(
      "กรุณากรอกชื่อผู้ใช้งาน"
    );

    return null;
  }


  if (!location) {

    showError(
      "กรุณากรอก Location"
    );

    return null;
  }


  if (!action) {

    showError(
      "กรุณาเลือก Action"
    );

    return null;
  }


  if (!weight) {

    showError(
      "กรุณากรอกน้ำหนัก"
    );

    return null;
  }


  if (Number(weight) < 0) {

    showError(
      "น้ำหนักต้องไม่ติดลบ"
    );

    return null;
  }


  return {
    user,
    location,
    action,
    weight
  };

}


async function startScanner() {

  clearError();


  const form =
    getFormData();


  if (!form) {
    return;
  }


  document
    .getElementById("scannerCard")
    .classList
    .remove("hidden");


  scanner =
    new Html5Qrcode("reader");


  try {

    await scanner.start(

      {
        facingMode: {
          exact: "environment"
        }
      },

      {
        fps: 10,

        qrbox: {
          width: 250,
          height: 250
        }
      },

      async (decodedText) => {

        await scanner.stop();

        await processQR(
          decodedText,
          form
        );

      }

    );

  } catch (error) {

    showError(
      "ไม่สามารถเปิดกล้องได้: "
      + error
    );

  }

}


async function processQR(
  basketId,
  form
) {

  // QR ต้องเป็นเลข 8 หลัก
  if (!/^\d{8}$/.test(basketId)) {

    showError(
      "QR Code ไม่ถูกต้อง: Basket ID ต้องเป็นตัวเลข 8 หลัก"
    );

    return;
  }


  const payload = {

    basketId: basketId,

    action: form.action,

    user: form.user,

    location: form.location,

    weight: form.weight,

    device: navigator.userAgent

  };


  try {

    showResult(
      "กำลังบันทึกข้อมูล..."
    );


    const response =
      await fetch(
        WEBAPP_URL,
        {
          method: "POST",

          body:
            JSON.stringify(payload)
        }
      );


    const result =
      await response.json();


    if (!result.success) {

      showError(
        result.message ||
        "ไม่สามารถบันทึกข้อมูลได้"
      );

      return;
    }


    showSuccess(

      "บันทึกสำเร็จ<br>" +

      "Basket ID: " +
      basketId +
      "<br>" +

      "น้ำหนัก: " +
      form.weight +
      " kg"

    );


    document
      .getElementById("scannerCard")
      .classList
      .add("hidden");


  } catch (error) {

    showError(
      "เกิดข้อผิดพลาดในการเชื่อมต่อ"
    );

  }

}


function showError(message) {

  const error =
    document.getElementById("error");

  error.innerHTML =
    "⚠️ " + message;

}


function clearError() {

  document
    .getElementById("error")
    .innerHTML = "";

}


function showResult(message) {

  const result =
    document.getElementById("result");

  result.innerHTML =
    message;

  result.classList
    .remove("hidden");

}


function showSuccess(message) {

  const result =
    document.getElementById("result");

  result.innerHTML =
    "✅ " + message;

  result.classList
    .remove("hidden");

}
