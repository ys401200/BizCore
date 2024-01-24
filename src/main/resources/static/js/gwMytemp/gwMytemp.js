document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
await promiseInit();
  const setGwMytemp = new GwMytempSet();
  locationBlock = false;
  history.pushState(null, null, null);
  setGwMytemp.drawList();
}