
let bnkXls = {};

bnkXls.code = { "002": "KDB산업은행", "003": "IBK기업은행", "004": "KB국민은행", "007": "수협은행", "011": "NH농협은행", "012": "농협중앙회(단위농축협)", "020": "우리은행", "023": "SC제일은행", "027": "한국씨티은행", "031": "대구은행", "032": "부산은행", "034": "광주은행", "035": "제주은행", "037": "전북은행", "039": "경남은행", "045": "새마을금고중앙회", "048": "신협중앙회", "050": "저축은행중앙회", "064": "산림조합중앙회", "071": "우체국", "081": "하나은행", "088": "신한은행", "089": "케이뱅크", "090": "카카오뱅크", "092": "토스뱅크", "218": "KB증권", "238": "미래에셋대우", "240": "삼성증권", "243": "한국투자증권", "247": "NH투자증권", "261": "교보증권", "262": "하이투자증권", "263": "현대차증권", "264": "키움증권", "265": "이베스트투자증권", "266": "SK증권", "267": "대신증권", "269": "한화투자증권", "271": "토스증권", "278": "신한금융투자", "279": "DB금융투자", "280": "유진투자증권", "287": "메리츠증권" };

bnkXls.rxp = [
	["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{4})+[-]+(\\d{3})$", ["004"]],
	["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{5})+[-]+(\\d{1})$", ["002", "007", "081"]],
	["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{6})$", ["023", "088"]],
	["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{6})+[-]+(\\d{1})$", ["003", "032"]],
	["^(\\d{3})+[-]+(\\d{3})+[-]+(\\d{6})$", ["088", "089"]],
	["^(\\d{3})+[-]+(\\d{4})+[-]+(\\d{4})+[-]+(\\d{2})$", ["011", "032"]],
	["^(\\d{3})+[-]+(\\d{6})+[-]+(\\d{2})+[-]+(\\d{3})$", ["003"]],
	["^(\\d{3})+[-]+(\\d{6})+[-]+(\\d{3})$", ["027", "081"]],
	["^(\\d{3})+[-]+(\\d{6})+[-]+(\\d{5})$", ["081"]],
	["^(\\d{3})+[-]+(\\d{7})+[-]+(\\d{1})+[-]+(\\d{3})$", ["002"]],
	["^(\\d{3})+[-]+(\\d{8})+[-]+(\\d{1})$", ["007"]],
	["^(\\d{3})+[-]+(\\d{8})+[-]+(\\d{3})$", ["002"]],
	["^(\\d{4})+[-]+(\\d{2})+[-]+(\\d{7})$", ["090"]],
	["^(\\d{4})+[-]+(\\d{2})+[-]+(\\d{7})+[-]+(\\d{1})$", ["004"]],
	["^(\\d{4})+[-]+(\\d{3})+[-]+(\\d{6})$", ["020"]],
	["^(\\d{6})+[-]+(\\d{2})+[-]+(\\d{6})$", ["004"]]
]

bnkXls.readXlsFile = function (file) {
	let reader, evfn;
	reader = new FileReader();
	console.log("STEP 2 : Read xls file second stage");
	evfn = function () {
		let data, wrkBook;
		data = this.result;
		wrkBook = XLSX.read(data, { "type": "binary" });
		bnkXls.parseXlsFile(wrkBook);
	} // End of Anonymous Function in readExcel()

	reader.readAsBinaryString(file);
	// 읽기 동작이 성공적으로 완료되었을 때 발생 
	reader.onload = evfn;
} // End of bnkXls.readXlsFile()

bnkXls.parseXlsFile = function (wb) {
	let r, c, x, y, z, t, spLine, data = [], data1, data2, result;
	console.log("STEP 3 : data arrange with parsed data");
	// A1 타입 셀 이름 추출
	t = [];
	for (x in wb.Sheets[wb.SheetNames[0]]) if (x.substring(0, 1) !== "!") t.push(x);
	t.sort();

	// 2차원 배열로 변환
	for (x in t) {
		r = t[x].substring(0, 1).charCodeAt() - 65;
		c = t[x].substring(1) * 1 - 1;
		if (data[c] === undefined) data[c] = [];
		data[c][r] = wb.Sheets[wb.SheetNames[0]][t[x]].v;
	}

	// 헤더부분과 본문 부분 구분하기
	// 1차 시도 / 빈 줄 찾기
	for (x = 0; x < data.length; x++)  if (data[x] === undefined) spLine = x;

	// 1차 시도 성공여부 검증 / 실패시 2차 시도 / row 중 숫자가 없는 row 찾기
	t = undefined;
	if (spLine === undefined) {
		for (x = 0; x < data.length; x++) {
			if (data[x] !== undefined && !bnkXls.haveNumeric(data[x])) spLine = x;
		}
	}
	console.log(spLine);
	data1 = data.slice(0, spLine);
	data2 = data.slice(spLine);


	// ================ 거래내역 정리하기 ===================      
	// 헤더 정리
	r = [-1, -1, -1, -1, -1]; // 0-거래일자 1-카드번호 2-승인번호 3-가맹점명 4-승인금액(청구금액) 
	for (z in data2) {
		t = data2[z];
		break;
	}
	z = z * 1;
	console.log(t + "전체 확인");

	for (x = 0; x < t.length; x++) {
		if (t[x].includes("일자")) r[0] = x;
		else if (t[x].includes("카드번호")) r[1] = x;
		else if (t[x].includes("승인번호")) r[2] = x;
		else if (t[x].includes("가맹점명")) r[3] = x;
		else if (t[x].includes("승인금액") || t[x].includes("청구금액")) r[4] = x;
	}

	t = [];
	for (x = z + 1; x < data2.length; x++) {
		if (r[0] >= 0 && data2[x][r[0]] === undefined) break;
		if (r[1] >= 0 && data2[x][r[1]] === undefined) break;
		if (r[2] >= 0 && data2[x][r[2]] === undefined) break;
		if (r[3] >= 0 && data2[x][r[3]] === undefined) break;
		if (r[4] >= 0 && data2[x][r[4]] === undefined) break;
		y = [data2[x][r[0]].replaceAll("(", "").replaceAll(")", ""), data2[x][r[1]], data2[x][r[2]], data2[x][r[3]], data2[x][r[4]] + ""];
		t.push(y);
	}
	t.sort(function (a, b) { let x, y; x = new Date(a[0]); y = new Date(b[0]); return x.getTime() - y.getTime(); })
	result = { "detail": t };
	console.log("STEP 4 : End of data arrange");
	console.log(result);
	processAccData(result);
} // End of bnkXls.parseXlsFile()

bnkXls.haveNumeric = function (arr) {
	let x, y, z;
	if (arr === undefined) return false;
	if (typeof arr === "string") {
		for (x = 0; x < arr.length; x++) {
			z = arr.substring(x, x + 1);
			z = z.charCodeAt();
			if (z > 47 && z < 58) return true;
		}
	} else if (typeof arr === "object") {
		for (x = 0; x < arr.length; x++) {
			if (arr[x] !== undefined) for (y = 0; y < arr[x].length; y++) {
				z = arr[x].substring(y, y + 1);
				z = z.charCodeAt();
				if (z > 47 && z < 58) return true;
			}
		}
	}
	return false;
} // End of bnkXls.haveNumeric()

bnkXls.charCut = (str) => {
	let result = "", x, y = 0, z = 0;
	for (x = 0; x < str.length; x++) {
		console.log(x + " / " + str[x] + " / y : " + y)
		if (str[x].charCodeAt() === 45) {
			if (z === 0) z = 1;
			else break;
			if (y === 0) y = 1;
			result += str[x];
		} else if (str[x].charCodeAt() >= 48 && str[x].charCodeAt() <= 57) {
			if (y === 0) y = 1;
			result += str[x];
			z = 0;
		}//else if(x === 1) break;
	}
	if (result === "") return null;
	else return result;
} // End of bnkXls.charCut()




$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	getCardListData();

});

// 등록된 카드 내역 가져오는 함수 
function getCardListData() {
	let data = null;
	$.ajax({
		url: "/api/card/list",
		type: "get",
		dataType: "json",
		cache: false,
		success: (result) => {
			if (result.result == "ok") {
				data = cipher.decAes(result.data);
				console.log(result.data);
				data = JSON.parse(data);
				storage.cardList = data;
				drawList();
			} else {
				console.log("실패");
			}
		}

	});

}


// 등록된 카드 내역 리스트 그리는 함수 
function drawList() {
	let container,
		result,
		jsonData,
		job,
		header = [],
		data = [],
		ids = [],
		str,
		fnc;

	if (
		storage.cardList === undefined ||
		storage.cardList == 0
	) {
		container = $(".cardList");

		header = [

			{
				title: "카드번호",
				align: "center",
			},
			{
				title: "구분",
				align: "center",
			},
			{
				title: "은행",
				align: "center",
			},
			{
				title: "상태",
				align: "center",
			},
			{
				title: "하이패스",
				align: "center",
			},
			{
				title: "발급일",
				align: "center",
			},
			{
				title: "비고",
				align: "left",
			}



		];
		createGrid(container, header, data, ids, job, fnc);

		container.append(
			"<div class='noListDefault'>등록된 내역이 없습니다.</div>"
		);
	} else {
		// jsonData = storage.receiveList.receive;
		let tt = [];
		let hipass;
		let bank;
		for (let i = storage.cardList.length - 1; i >= 0; i--) { tt.push(storage.cardList[i]) };
		jsonData = tt;
		result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

		pageContainer = document.getElementsByClassName("pageContainer");
		container = $(".cardList");
		header = [

			{
				title: "카드번호",
				align: "center",
			},
			{
				title: "구분",
				align: "center",
			},
			{
				title: "은행",
				align: "center",
			},
			{
				title: "상태",
				align: "center",
			},
			{
				title: "하이패스",
				align: "center",
			},
			{
				title: "발급일",
				align: "center",
			},
			{
				title: "비고",
				align: "left",
			}

		];
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			hipass = jsonData[i].hipass == "0" ? "N" : "Y";
			bank = jsonData[i].bank + "";
			if (bank.length == 2) {
				bank = "0" + bank;
			} else if (bank.length == 1) {
				bank = "00" + bank;
			}

			str = [

				{
					"setData": jsonData[i].card,
					"align": "center"
				},
				{
					"setData": jsonData[i].div,
					"align": "center"
				},
				{
					"setData": bnkXls.code[bank],
					"align": "center"
				},
				{
					"setData": jsonData[i].status,
					"align": "center",
				},
				{
					"setData": hipass,
					"align": "center"
				},
				{
					"setData": jsonData[i].issued,
					"align": "center"
				},
				{
					"setData": jsonData[i].remark,
					"align": "left"
				},

			];

			fnc = "detailView(this)";
			ids.push(jsonData[i].alias);
			data.push(str);
		}

		let pageNation = createPaging(
			pageContainer[0],
			result[3],
			"pageMove",
			"drawList",
			result[0]
		);
		pageContainer[0].innerHTML = pageNation;
		createGrid(container, header, data, ids, job, fnc);
	}
} // End of drawNoticeApproval()



function detailView(obj) {
	let alias = $(obj).attr("data-id"); // 카드 뒷번호 6자리 
	let data;
	$.ajax({
		url: "/api/card/detail/" + alias,
		type: "get",
		dataType: "json",
		success: (result) => {
			if (result.result === "ok") {
				data = result.data;
				data = cipher.decAes(data);
				if(data == null) {
					storage.selectedCard = []; 
					storage.selectedCard = alias;
				}else {
			    data = JSON.parse(data);
				storage.cardDetail = data;
				storage.selectedCard = alias;
				}
			
				drawCardDetail();
			} else {
				alert("카드 내역 상세 조회에 실패함");
			}

		}

	})
}



function drawCardDetail() {

	let target = $(".cardList");
	target.html("<div class='cardDetailDiv'><div class='cardTable'></div><div class='detailTable'></div></div>");
	let cardList = $(".cardTable");

	// 카드 목록 테이블 간단하게 그림 
	let cardHtml = "<div class='gridCardHeader'><span>카드번호<span></div>";

	for (let i = 0; i < storage.cardList.length; i++) {

		cardHtml += "<div class='gridCardContent' onclick='showCardDetail(this)' data-detail='" + storage.cardList[i].alias + "'><span class='textNumberFormat' >" + storage.cardList[i].card + "</span></div>";
	}

	$(cardList).html(cardHtml);

	for (let i = 0; i < $(".gridCardContent").length; i++) {
		if ($(".gridCardContent")[i].dataset.detail == storage.selectedCard) {
			$($(".gridCardContent")[i]).css("background-color", "#EDEDF4");
			showCardDetail($(".gridCardContent")[i]);
			break;
		}
	}

	
}

function showCardDetail(obj) {
	let alias = $(obj).attr("data-detail");
	$(obj).css("background-color", "#EDEDF4");
	for (let i = 0; i < $(".gridCardContent").length; i++) {
		if ($(".gridCardContent")[i].dataset.detail != alias) {
			$($(".gridCardContent")[i]).css("background-color", "white");
		}
	}
	$.ajax({
		url: "/api/card/detail/" + alias,
		type: "get",
		dataType: "json",
		success: (result) => {
			data = result.data;
			console.log(data);
			if (data == null) {
				storage.cardDetail = [];
			} else {
				data = cipher.decAes(data);
				data = JSON.parse(data);
				storage.cardDetail = data;
			}

			drawSelectedDetail();
		}
	});

}

function drawSelectedDetail() {


 
let container,
		result,
		jsonData,
		job,
		header = [],
		data = [],
		ids = [],
		str,
		fnc;

	jsonData = storage.cardDetail;
if(jsonData.length == 0) {



	container = $(".detailTable");

	header = [

		{
			title: "카드번호",
			align: "center",
		},
		{
			title: "승인일자",
			align: "center",
		},

		{
			title: "승인번호",
			align: "center",
		},
		{
			title: "가맹점명",
			align: "left",
		},
		{
			title: "승인금액",
			align: "center",
		}



	];
	createGrid(container, header, data, ids, job, fnc);

	container.append(
		"<div class='gridContent'><div class='gridContentItem grid_default_text_align_center' style='grid-column: span 5; text-align: center;'>등록된 내역이 없습니다.</div></div>"
	);
	$(".gridHeader").css("grid-template-columns", "20% 20% 20% 20% 20%");
	$(".gridContent").css("grid-template-columns", "20% 20% 20% 20% 20%");

} else {
	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".detailTable");

	header = [
		{
			title: "카드번호",
			align: "center",
		},
		{
			title: "승인일자",
			align: "center",
		},

		{
			title: "승인번호",
			align: "center",
		},
		{
			title: "가맹점명",
			align: "left",
		},
		{
			title: "승인금액",
			align: "center",
		}

	];
	for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {

		str = [
			{
				"setData": jsonData[i].cardNo,
				"align": "center"
			},
			{
				"setData": getYmdSlash(jsonData[i].transactionDate),
				"align": "center"
			},

			{
				"setData": jsonData[i].permitNo,
				"align": "center"
			},
			{
				"setData": jsonData[i].storeTitle,
				"align": "left",
			},
			{
				"setData": jsonData[i].permitAmount.toLocaleString() + "원",
				"align": "center"
			},

		];

		fnc = "";
		ids.push(i);
		data.push(str);
	}

	let pageNation = createPaging(
		pageContainer[0],
		result[3],
		"pageMove",
		"drawSelectedDetail",
		result[0]
	);
	pageContainer[0].innerHTML = pageNation;
	createGrid(container, header, data, ids, job, fnc);
	$(".gridHeader").css("grid-template-columns", "20% 20% 20% 20% 20%");
	$(".gridContent").css("grid-template-columns", "20% 20% 20% 20% 20%");
}
	

	
}



let idx = 0;

//카드 내역을 insert하는 함수 


function createCheckGrid(gridContainer, headerDataArray, dataArray, ids, job, fnc, idName) {
	let gridHtml = "", gridContents, idStr;
	ids = (ids === undefined) ? 0 : ids;
	fnc = (fnc === undefined) ? "" : fnc;
	job = (job === undefined) ? "" : job;

	if (idName === undefined) {
		idStr = "gridContent";
	} else {
		idStr = idName;
	}

	gridHtml = "<div class='gridHeader grid_default_header_item'>";

	for (let i = 0; i < headerDataArray.length; i++) {
		if (headerDataArray[i].align === "center") {
			gridHtml += "<div class='gridHeaderItem grid_default_text_align_center'>" + headerDataArray[i].title + "</div>";
		} else if (headerDataArray[i].align === "left") {
			gridHtml += "<div class='gridHeaderItem grid_default_text_align_left'>" + headerDataArray[i].title + "</div>";
		} else {
			gridHtml += "<div class='gridHeaderItem grid_default_text_align_right'>" + headerDataArray[i].title + "</div>";
		}
	}

	gridHtml += "</div>";

	console.log(dataArray);

	for (let i = 0; i < dataArray.length; i++) {
		gridHtml += "<div id='" + idStr + "_grid_" + i + "' class='gridContent grid_default_body_item' data-drag=\"true\" data-id='" + ids[i] + "' data-job='" + job[i] + "' >";
		for (let t = 0; t <= dataArray[i].length; t++) {
			if (dataArray[i][t] !== undefined) {
				if (dataArray[i][t].setData === undefined) {
					gridHtml += "<div class='gridContentItem' onclick='" + fnc + "' style=\"grid-column: span " + dataArray[i][t].col + "; text-align: center;\">데이터가 없습니다.</div>";
				} else if (dataArray[i][t].setData.includes("checkbox")) {
					gridHtml += "<div class='gridContentItem'><span class=\"textNumberFormat\">" + dataArray[i][t].setData + "</span></div>";
				} else {
					gridHtml += "<div class='gridContentItem' onclick='" + fnc + "'><span class=\"textNumberFormat\">" + dataArray[i][t].setData + "</span></div>";
				}
			}
		}
		gridHtml += "</div>";
	}

	gridContainer.html(gridHtml);

	if (idName === undefined) {
		gridContents = $(".gridContent");
	} else {
		gridContents = $("#" + idName + " .gridContent");
	}

	let tempArray = [];

	for (let i = 0; i < dataArray.length; i++) {
		for (let key in dataArray[i]) {
			tempArray.push(dataArray[i][key]);
		}
	}

	for (let i = 0; i < tempArray.length; i++) {
		for (let t = 0; t < gridContents.length; t++) {
			if (tempArray[i].align === "center") {
				$(gridContents[t]).find(".gridContentItem").eq(i).attr("class", "gridContentItem grid_default_text_align_center");
			} else if (tempArray[i].align === "left") {
				$(gridContents[t]).find(".gridContentItem").eq(i).attr("class", "gridContentItem grid_default_text_align_left");
			} else {
				$(gridContents[t]).find(".gridContentItem").eq(i).attr("class", "gridContentItem grid_default_text_align_right");
			}
		}
	}

}


// 날짜 관련 함수 
function getYmdSlash(date) {
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

