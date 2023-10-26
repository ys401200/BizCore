document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	let soppSet = new SoppSet();
	soppSet.list();
}