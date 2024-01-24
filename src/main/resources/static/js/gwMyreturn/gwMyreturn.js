document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
await promiseInit();
  const setGwMyreturn = new GwMyreturnSet();
  locationBlock = false;
  history.pushState(null, null, null);
  setGwMyreturn.drawList();
}