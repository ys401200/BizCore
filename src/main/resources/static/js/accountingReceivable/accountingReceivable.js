document.addEventListener("DOMContentLoaded", () => {
	callerFun();
  });
  
  async function callerFun(){
  await promiseInit();
	const setAccountingReceivable = new AccountingReceivableSet();
	locationBlock = false;
	history.pushState(null, null, null);
	setAccountingReceivable.drawList();
  }