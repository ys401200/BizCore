document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	let workReportSet = new WorkReportSet();
	
	setTimeout(() => {
		workReportSet.getLastWorkReportDatas();
	}, 500);

	setTimeout(() => {
		workReportSet.getThisWorkReportDatas();
	}, 700);

	setTimeout(() => {
		workReportSet.getNextWorkReportDatas();
		workReportSet.drawWorkReport();
		$('.theme-loader').delay(1000).fadeOut("slow");
	}, 1500);
}