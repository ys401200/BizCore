document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
await promiseInit();
  const setGwDue = new GwDueSet();
  locationBlock = false;
  history.pushState(null, null, null);
  setGwDue.drawList();
}