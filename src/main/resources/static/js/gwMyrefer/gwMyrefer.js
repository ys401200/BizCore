document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
await promiseInit();
  const setGwMyRefer = new GwMyReferSet();
  locationBlock = false;
  history.pushState(null, null, null);
  setGwMyRefer.drawList();
}