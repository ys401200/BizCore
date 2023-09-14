$(document).ready(() => {
    init();
    let workReportSet = new WorkReportSet();
	
	setTimeout(() => {
		workReportSet.getWorkReportDatas("last");
	}, 500);

	setTimeout(() => {
		workReportSet.getWorkReportDatas("this");
	}, 700);

	setTimeout(() => {
		workReportSet.getWorkReportDatas("next");
		$('.theme-loader').delay(1000).fadeOut("slow");
	}, 1500);
});