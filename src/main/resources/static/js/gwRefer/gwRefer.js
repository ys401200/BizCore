document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
  await promiseInit();
    const setGwRefer = new GwReferSet();
    locationBlock = false;
    history.pushState(null, null, null);
    setGwRefer.drawList();
}