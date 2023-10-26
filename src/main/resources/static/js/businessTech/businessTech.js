document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	const setTech = new TechSet();
	setTech.list();
}