document.addEventListener("DOMContentLoaded", () => {
	callerFun();
  });
  
  async function callerFun(){
  await promiseInit();
	const setAccountingSlip = new AccountingSlipSet();
	locationBlock = false;
	history.pushState(null, null, null);
	setAccountingSlip.drawList();
  }