document.addEventListener("DOMContentLoaded", () => {
	callerFun();
	// getSoppList();
});

async function callerFun(){
	await promiseInit();
	let contSet = new ContSet();
	contSet.list();
}