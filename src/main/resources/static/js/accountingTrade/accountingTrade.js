document.addEventListener("DOMContentLoaded", () => {
	callerFun();
  });
  
  async function callerFun(){
  await promiseInit();
	const setAccountingTrade = new AccountingTradeSet();
	locationBlock = false;
	history.pushState(null, null, null);
	setAccountingTrade.drawList();
  }