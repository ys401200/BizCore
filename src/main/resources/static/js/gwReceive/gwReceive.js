document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
await promiseInit();
  const setGwReceive = new GwReceiveSet();
  locationBlock = false;
  history.pushState(null, null, null);
  setGwReceive.drawList();
}
