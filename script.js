const WEBAPP_URL="YOUR_WEBAPP_URL";

document.getElementById("startBtn").addEventListener("click",startScanner);

function startScanner(){

 const qr=new Html5Qrcode("reader");

 qr.start(
  {facingMode:"environment"},
  {fps:10,qrbox:250},
  (code)=>{
    qr.stop();
    sendData(code);
  }
 );

}

async function sendData(code){

 const payload={
  basketId:code,
  status:document.getElementById("status").value,
  user:document.getElementById("user").value,
  location:document.getElementById("location").value,
  device:navigator.userAgent
 };

 const res=await fetch(WEBAPP_URL,{
  method:"POST",
  body:JSON.stringify(payload)
 });

 const result=await res.json();

 document.getElementById("result").innerHTML=result.success?"บันทึกสำเร็จ":"Error";

}
