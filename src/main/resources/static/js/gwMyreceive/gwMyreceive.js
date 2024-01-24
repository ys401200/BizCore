document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
await promiseInit();
  const setGwMyreceive = new GwMyreceiveSet();
  locationBlock = false;
  history.pushState(null, null, null);
  setGwMyreceive.drawList();
}