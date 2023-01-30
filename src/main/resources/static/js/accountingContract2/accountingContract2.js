let R = {};

$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	R.contracts = new Contracts(location.origin, document.getElementsByClassName("contract-list")[0]);
	locationBlock = false;
	history.pushState(null, null, null);
});


cntBack = () => { // 상세 내용 등에서 목록으로 돌아갈 때 실행되는 함수, history.back()를 실행해서 더미데이터를 제거하고 상태감지 boolean 값을 false로 세팅함
	console.log("clicked backward!!");
	$(".cntPageCnt").show();
    $(".crudBtns")[0].setAttribute("style", "display:none");
    $(".listRange").show();
    $(".crudBtns")[1].innerHTML = "<button type='button' class='crudAddBtn'>견적추가</button><button type='button' class='crudUpdateBtn'>견적수정</button><button type='button' class='estimatePdf'>pdf 다운로드</button><a href='#' onclick='hideDetailView(EstimateSet.drawBack);' class='detailBackBtn'>Back</a> "
    $(".contract-sche").html("");
    $(".contract-main").html("");
    $(".estimateList").html("<div class='pageContainer'></div>");
    $(".versionPreview").html("<div class='previewDefault'><div>미리보기</div></div>");
    $(".contract-container").hide();
    $(".contract-list").show();
	window.history.back();
	locationBlock = false;
}

window.onpopstate = function() { // 브라우저의 백 버튼 이벤트를 감지하는 함수, boolean 상태 값이 true인 경우, 상세->목록 함수 싱행함
	if(locationBlock){
		// 상세 페이지 등에서 리스트로 돌아갈 때 수행할 코드
		cntBack();
		console.log("In event :: go to backward!!");
	}
}

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
				R.contract.drawContractPage(document.getElementsByClassName("contract-list")[0]);

				
			

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
