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
				console.log(data.data);
				list = cipher.decAes(data.data);
				console.log(list);
				list = JSON.parse(list);
				
			
			}else{
				alert("?");
			}
		}
	})
} // End of getNoticeList()