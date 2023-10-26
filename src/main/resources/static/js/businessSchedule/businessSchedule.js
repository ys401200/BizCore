document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	let scheduleSet = new ScheduleSet();
	scheduleSet.list();
}