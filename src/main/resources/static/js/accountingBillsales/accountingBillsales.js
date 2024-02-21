document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun() {
  await promiseInit();
  const setAccountingBillsales = new AccountingBillsalesSet();
  setAccountingBillsales.getBillsalesList();
}
