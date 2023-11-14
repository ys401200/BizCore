document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	const setCategory = new CategorySet();
	setCategory.list();
}