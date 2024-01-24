document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun(){
  await promiseInit();
    const setGwMydraft = new GwMydraftSet();
    locationBlock = false;
    history.pushState(null, null, null);
    setGwMydraft.drawList();
}