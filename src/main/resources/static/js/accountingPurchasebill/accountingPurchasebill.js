document.addEventListener("DOMContentLoaded", () => {
	callerFun();
  });
  
  async function callerFun(){
  await promiseInit();
	const setAccountingPurchasebill = new AccountingPurchasebillSet();
	setAccountingPurchasebill.getPurchasebillList();
  }
