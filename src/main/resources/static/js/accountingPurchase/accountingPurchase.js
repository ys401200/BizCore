document.addEventListener("DOMContentLoaded", () => {
	callerFun();
  });
  
  async function callerFun(){
  await promiseInit();
	const setAccountingPurchase = new AccountingPurchaseSet();
	locationBlock = false;
	history.pushState(null, null, null);
	setAccountingPurchase.drawList();
  }