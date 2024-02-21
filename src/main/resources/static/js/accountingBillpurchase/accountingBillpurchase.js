document.addEventListener("DOMContentLoaded", () => {
  callerFun();
});

async function callerFun() {
  await promiseInit();
  const setAccountingBillpurchase = new AccountingBillpurchaseSet();
  setAccountingBillpurchase.getBillpurchaseList();
}
