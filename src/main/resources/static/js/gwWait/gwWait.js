document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
await promiseInit();
  const setGwWait = new GwWaitSet();
  locationBlock = false;
  history.pushState(null, null, null);
  setGwWait.drawList();
}

