$(document).ready(init)

// Initializing Page
function init(){
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	cipher.rsa.getKey();
	msg.cnt = document.getElementsByClassName("msg_cnt")[0];
} // End of init()