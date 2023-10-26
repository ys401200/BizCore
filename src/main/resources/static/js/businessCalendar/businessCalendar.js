document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	const scheduleSet = new ScheduleSet();
	scheduleSet.calendarList();
}