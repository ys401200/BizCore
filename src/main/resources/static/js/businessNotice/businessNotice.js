document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	const setNotice = new NoticeSet();
	setNotice.list();
}