document.addEventListener("DOMContentLoaded", () => {
	callerFun();
  });
  
  async function callerFun(){
  await promiseInit();
	const setAccountingSalesbill = new AccountingSalesbillSet();
	setAccountingSalesbill.getSalesbillList();
  }

