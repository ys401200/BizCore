document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	const setCustomer = new CustomerSet();
	setCustomer.list();
}