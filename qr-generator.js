const basketInput =
  document.getElementById(
    "basketId"
  );


const quantityInput =
  document.getElementById(
    "quantity"
  );


const generateBtn =
  document.getElementById(
    "generateBtn"
  );


const printBtn =
  document.getElementById(
    "printBtn"
  );


const printArea =
  document.getElementById(
    "printArea"
  );


const errorBox =
  document.getElementById(
    "generatorError"
  );


basketInput.addEventListener(
  "input",
  function () {

    this.value =
      this.value
        .replace(/\D/g, "")
        .slice(0, 8);

  }
);


generateBtn.addEventListener(
  "click",
  generateQRs
);


printBtn.addEventListener(
  "click",
  function () {

    window.print();

  }
);


function generateQRs() {

  clearError();


  const startId =
    basketInput.value.trim();


  const quantity =
    Number(
      quantityInput.value
    );


  if (!/^\d{8}$/.test(
    startId
  )) {

    showError(
      "Basket ID ต้องเป็นตัวเลข 8 หลักเท่านั้น"
    );

    basketInput.focus();

    return;
  }


  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 100
  ) {

    showError(
      "จำนวนต้องอยู่ระหว่าง 1 ถึง 100"
    );

    quantityInput.focus();

    return;
  }


  const start =
    Number(startId);


  const end =
    start + quantity - 1;


  if (end > 99999999) {

    showError(
      "จำนวน QR Code เกินช่วงเลข 8 หลัก"
    );

    return;
  }


  printArea.innerHTML = "";


  for (
    let i = 0;
    i < quantity;
    i++
  ) {

    const id =
      String(
        start + i
      ).padStart(
        8,
        "0"
      );


    createLabel(id);

  }


  printBtn.style.display =
    "block";

}


function createLabel(id) {


  const label =
    document.createElement(
      "div"
    );


  label.className =
    "qr-label";


  const company =
    document.createElement(
      "div"
    );


  company.className =
    "qr-company";


  company.textContent =
    "ACK FOOD TECH CO.,LTD.";


  const qr =
    document.createElement(
      "div"
    );


  qr.className =
    "qr-code";


  const basketId =
    document.createElement(
      "div"
    );


  basketId.className =
    "qr-id";


  basketId.textContent =
    id;


  const system =
    document.createElement(
      "div"
    );


  system.className =
    "qr-system";


  system.textContent =
    "SMART BASKET TRACKER";


  const diprom =
    document.createElement(
      "div"
    );


  diprom.className =
    "qr-diprom";


  diprom.textContent =
    "By DIPROM";


  label.appendChild(
    company
  );

  label.appendChild(
    qr
  );

  label.appendChild(
    basketId
  );

  label.appendChild(
    system
  );

  label.appendChild(
    diprom
  );


  printArea.appendChild(
    label
  );


  new QRCode(
    qr,
    {
      text: id,

      width: 150,

      height: 150,

      correctLevel:
        QRCode.CorrectLevel.H
    }
  );

}


function showError(message) {

  errorBox.innerHTML =
    "⚠️ " + message;

}


function clearError() {

  errorBox.innerHTML = "";

}
