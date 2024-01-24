document.addEventListener("DOMContentLoaded", () => {
	callerFun();
  });
  
  async function callerFun(){
  await promiseInit();
	const setAccountingSales = new AccountingSalesSet();
	locationBlock = false;
	history.pushState(null, null, null);
	setAccountingSales.drawList();
  }