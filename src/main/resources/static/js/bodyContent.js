$(document).ready(init)

// Initializing Page
function init(){
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	getNoticeList();
} // End of init()


function getNoticeList(){
	let url;

	url = apiServer + "/api/notice";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType":"json",
		"cache": false,
		success:(data) => {
			let list;
			if(data.result === "ok"){
				list = cipher.decAes(data.data);
				list = JSON.parse(list);
				console.log(list);
			
			}else{
				alert("?");
			}
		}
	})
} // End of getNoticeList()