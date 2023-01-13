let R = {};

$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	R.contracts = new Contracts(location.origin, document.getElementsByClassName("contract-list")[0]);

});



function drawContractList() {
	$(".contract-list").html("");
	R.contracts.draw();
}

function drawDetail(obj) {
	let no = obj.parentElement.dataset.no;
	fetch(location.origin + "/api/contract/" + no)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let data;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				R.contract = new Contract(data);
				R.contract.getReportDetail(obj);

			} else {
				console.log(response.msg);
			}
		});

}


// 날짜 관련 함수 
function getYmdSlashShort(date) {
	let d = new Date(date);
	return (
		(d.getFullYear() % 100) +
		"/" +
		(d.getMonth() + 1 > 9
			? (d.getMonth() + 1).toString()
			: "0" + (d.getMonth() + 1)) +
		"/" +
		(d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
	);
}


function getYmdHypen(date) {
	let d = new Date(date);
	return (
		(d.getFullYear()) +
		"-" +
		(d.getMonth() + 1 > 9
			? (d.getMonth() + 1).toString()
			: "0" + (d.getMonth() + 1)) +
		"-" +
		(d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
	);
}


function drawList() {
	R.contracts.draw();
}
