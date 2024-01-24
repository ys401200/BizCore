document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
await promiseInit();
  const setGwMyapp = new GwMyappSet();
  locationBlock = false;
  history.pushState(null, null, null);
  setGwMyapp.drawList();
}