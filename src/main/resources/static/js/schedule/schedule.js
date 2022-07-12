$(document).ready(init)

// Initializing Page
function init(){
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	getNoticeList();
} // End of init()

