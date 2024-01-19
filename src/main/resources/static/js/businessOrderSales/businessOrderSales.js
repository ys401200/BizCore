document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	let orderSalesSet = new OrderSalesSet();
	orderSalesSet.list();
}