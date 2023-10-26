document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();

	setTimeout(() => {
		const setSales = new SalesSet();
		setSales.list();
	}, 800);
}