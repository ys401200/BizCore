document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun() {
  await promiseInit();
  const setAccountingUnpaid = new AccountingUnpaidSet();
  locationBlock = false;
  history.pushState(null, null, null);
  setAccountingUnpaid.list();
}
