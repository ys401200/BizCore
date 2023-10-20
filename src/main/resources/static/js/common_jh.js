//공지사항 시작
//공지사항 셋팅 클래스
class NoticeSet {
	constructor() {
		CommonDatas.Temps.noticeSet = this;
	}
	//공지사항 리스트 저장 함수
	list() {
		axios.get("/api/notice").then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.noticeList = result;

				if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined) {
					window.setTimeout(this.drawNoticeList, 600);
					window.setTimeout(CommonDatas.searchListSet("noticeList"), 600);
					$('.theme-loader').delay(1000).fadeOut("slow");
				} else {
					window.setTimeout(this.drawNoticeList, 200);
					window.setTimeout(CommonDatas.searchListSet("noticeList"), 200);
					$('.theme-loader').delay(1000).fadeOut("slow");
				}
			}
		}).catch((error) => {
			msg.set("공지사항 메인 리스트 에러입니다.\n" + error);
			console.log(error);
		})
	}

	//공지사항 리스트 출력 함수
	drawNoticeList() {
		let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [], pageContainer, hideArr, showArr;

		if (storage.noticeList === undefined) {
			msg.set("등록된 공지사항이 없습니다");
		}
		else {
			if (storage.searchDatas === undefined) {
				jsonData = storage.noticeList;
			} else {
				jsonData = storage.searchDatas;
			}
		}

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		pageContainer = document.getElementsByClassName("pageContainer")[0];
		container = document.getElementsByClassName("gridNoticeList")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn", "contractReqBtn"];
		showArr = [
			{ element: "gridList", display: "grid" },
			{ element: "pageContainer", display: "flex" },
			{ element: "searchContainer", display: "block" },
			{ element: "listRange", display: "flex" },
			{ element: "listSearchInput", display: "flex" },
			{ element: "crudBtns", display: "flex" },
			{ element: "crudAddBtn", display: "flex" },
		];

		header = [
			{
				"title": "등록일",
				"align": "center",
			},
			{
				"title": "제목",
				"align": "center",
			},
			{
				"title": "작성자",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 4,
				},
			];

			data.push(str);
		} else {
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				disDate = CommonDatas.dateDis(new Date(jsonData[i].regDate).getTime(), new Date(jsonData[i].modDate).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": jsonData[i].noticeTitle,
						"align": "left",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(storage.user[jsonData[i].userNo].userName)) ? "" : storage.user[jsonData[i].userNo].userName,
						"align": "center",
					},
				];

				fnc.push("CommonDatas.Temps.noticeSet.noticeDetailView(this)");
				ids.push(jsonData[i].noticeNo);
				data.push(str);
			}

			let pageNation = CommonDatas.createPaging(pageContainer, result[3], "CommonDatas.pageMove", "CommonDatas.Temps.noticeSet.drawNoticeList", result[0]);
			pageContainer.innerHTML = pageNation;
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		CommonDatas.setViewContents(hideArr, showArr);
		document.getElementById("multiSearchBtn").setAttribute("onclick", "CommonDatas.Temps.noticeSet.searchSubmit();");

		let path = location.pathname.split("/");

		if (path[3] !== undefined && jsonData !== null) {
			let content = document.querySelector(".gridContent[data-id=\"" + path[3] + "\"]");
			CommonDatas.Temps.noticeSet.noticeDetailView(content);
		}
	}

	//메인 화면에서 클릭한 공지사항 가져오는 함수
	noticeDetailView(e) {
		let thisEle = e;
		storage.gridContent = e;

		axios.get("/api/notice/" + thisEle.dataset.id).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				let notice = new Notice(result);
				notice.detail();
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//공지사항 등록 폼
	noticeInsertForm() {
		let html, dataArray, datas;

		dataArray = [
			{
				"title": "담당자",
				"elementId": "userNo",
				"col": 4,
			},
			{
				"title": "제목(*)",
				"elementId": "noticeTitle",
				"disabled": false,
				"col": 4,
			},
			{
				"title": "내용(*)",
				"elementId": "noticeContents",
				"type": "textarea",
				"disabled": false,
				"col": 4,
			},
		];

		datas = ["userNo"];
		html = CommonDatas.detailViewForm(dataArray, "modal");
		modal.show();
		modal.content.style.minWidth = "70%";
		modal.content.style.maxWidth = "70%";
		modal.headTitle.innerText = "공지사항등록";
		modal.body.innerHTML = "<div class='defaultFormContainer'>" + html + "</div>";
		modal.confirm.innerText = "등록";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "let notice = new Notice(); notice.insert();");
		modal.close.setAttribute("onclick", "modal.hide();");

		storage.formList = {
			"userNo": storage.my,
			"noticeTitle": "",
			"noticeContents": "",
		};

		setTimeout(() => {
			let my = storage.my;
			CommonDatas.detailTrueDatas(datas);
			document.getElementById("userNo").value = storage.user[my].userName;
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);

		setTimeout(() => {
			document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
		}, 300);
	}

	//공지사항 검색 버튼 클릭 함수
	searchSubmit() {
		let dataArray = [], resultArray, eachIndex = 0, user, title, searchUser, searchTitle, searchCreatedFrom, keyIndex = 0;
		searchTitle = document.getElementById("searchTitle");
		searchUser = document.getElementById("searchUser");
		searchCreatedFrom = (document.getElementById("searchCreatedFrom").value === "") ? "" : document.getElementById("searchCreatedFrom").value.replaceAll("-", "") + "#regDate" + document.getElementById("searchCreatedTo").value.replaceAll("-", "");
		
		for(let key in storage.noticeList[0]){
			if(key === searchTitle.dataset.key) title = "#" + keyIndex + "/" + searchTitle.value;
			else if(key === searchUser.dataset.key) user = "#" + keyIndex + "/" + searchUser.value;
			keyIndex++;
		}

		let searchValues = [title, user, searchCreatedFrom];

		for (let i = 0; i < searchValues.length; i++) {
			if(searchValues[i] !== ""){
				let tempArray = CommonDatas.searchDataFilter(storage.noticeList, searchValues[i], "multi", ["#regDate"]);
	
				for (let t = 0; t < tempArray.length; t++) {
					dataArray.push(tempArray[t]);
				}
	
				eachIndex++;
			}
		}
		
		resultArray = CommonDatas.searchMultiFilter(eachIndex, dataArray, storage.noticeList);

		storage.searchDatas = resultArray;

		if (storage.searchDatas.length == 0) {
			msg.set("찾는 데이터가 없습니다.");
			storage.searchDatas = storage.noticeList;
		}

		this.drawNoticeList();
	}

	//공지사항 단일 검색 keyup 이벤트
	searchInputKeyup() {
		let searchAllInput, tempArray;
		searchAllInput = document.getElementById("searchAllInput").value;
		tempArray = CommonDatas.searchDataFilter(storage.noticeList, searchAllInput, "input");

		if (tempArray.length > 0) {
			storage.searchDatas = tempArray;
		} else {
			storage.searchDatas = "";
		}

		this.drawNoticeList();
	}
}

//공지사항 crud
//공지사항 기능 클래스
class Notice {
	constructor(getData) {
		CommonDatas.Temps.notice = this;

		if (getData !== undefined) {
			this.getData = getData;
			this.noticeTitle = getData.noticeTitle;
			this.noticeContents = getData.noticeContents;
			this.userNo = getData.userNo;
			this.regDate = getData.regDate;
			this.modDate = getData.modDate;
		} else {
			this.noticeTitle = "";
			this.noticeContents = "";
			this.userNo = storage.my;
		}
	}

	//공지사항 상세보기
	detail() {
		let html = "";
		let btnHtml = "";
		let setDate, datas, dataArray, createDiv, notIdArray;

		CommonDatas.detailSetFormList(this.getData);

		setDate = CommonDatas.dateDis(new Date(this.regDate).getTime(), new Date(this.modified).getTime());
		setDate = CommonDatas.dateFnc(setDate);
		datas = ["userNo"];
		dataArray = [
			{
				"title": "제목(*)",
				"elementId": "noticeTitle",
				"value": this.noticeTitle,
				"col": 4,
			},
			{
				"title": "내용(*)",
				"elementId": "noticeContents",
				"value": this.noticeContents,
				"type": "textarea",
				"col": 4,
			},
		];

		html += CommonDatas.detailViewForm(dataArray, "board");
		CommonDatas.detailBoardContainerHide();
		createDiv = document.createElement("div");
		createDiv.innerHTML = html;
		storage.gridContent.after(createDiv);
		notIdArray = ["userNo", "regData"];
		CommonDatas.detailTrueDatas(datas);

		if (storage.my == storage.formList.userNo) {
			btnHtml += "<button type=\"button\" class=\"updateBtn\" onclick=\"CommonDatas.enableDisabled(this, 'CommonDatas.Temps.notice.update();', '" + notIdArray + "', 'detailBoard');\">수정</button>";
			btnHtml += "<button type=\"button\" onclick=\"CommonDatas.Temps.notice.delete();\">삭제</button>";
		}

		btnHtml += "<button type='button' onclick='CommonDatas.detailBoardContainerHide();'><i class=\"fa-solid fa-xmark\"></i></button>";
		document.getElementsByClassName("detailBtns")[0].innerHTML = btnHtml;

		setTimeout(() => {
			ckeditor.config.readOnly = true;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//공지사항 등록
	insert() {
		if (document.getElementById("noticeTitle").value === "") {
			msg.set("제목을 입력해주세요.");
			document.getElementById("noticeTitle").focus();
			return false;
		} else {
			CommonDatas.formDataSet();
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.post("/api/notice", data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("등록되었습니다.");
				} else {
					msg.set("등록 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//공지사항 수정
	update() {
		if (document.getElementById("noticeTitle").value === "") {
			msg.set("제목을 입력해주세요.");
			document.getElementById("noticeTitle").focus();
			return false;
		} else {
			CommonDatas.formDataSet();
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.put("/api/notice/" + storage.formList.noticeNo, data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("수정되었습니다.");
				} else {
					msg.set("수정 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("수정 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//공지사항 삭제
	delete() {
		if (confirm("정말로 삭제하시겠습니까??")) {
			axios.delete("/api/notice/" + storage.formList.noticeNo, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("삭제되었습니다.");
				} else {
					msg.set("삭제 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("삭제 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		} else {
			return false;
		}
	}
}

//영업활동관리 시작
//영업활동관리 셋팅 함수
class SalesSet{
	constructor() {
		CommonDatas.Temps.salesSet = this;
	}

	//영업활동 리스트 저장 함수
	list() {
		axios.get("/api/sales/").then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.salesList = result;

				if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.sopp === undefined) {
					window.setTimeout(this.drawSalesList, 1000);
					window.setTimeout(CommonDatas.searchListSet("salesList"), 1000);
				} else {
					window.setTimeout(this.drawSalesList, 200);
					window.setTimeout(CommonDatas.searchListSet("salesList"), 200);
				}

				$('.theme-loader').delay(1000).fadeOut("slow");
			}
		}).catch((error) => {
			msg.set("영업활동관리 리스트 에러입니다.\n" + error);
			console.log(error);
		})
	}

	//영업활동 리스트 출력 함수
	drawSalesList() {
		let container, result, jsonData, containerTitle, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [], pageContainer, hideArr, showArr, schedFrom, schedTo;

		if (storage.salesList === undefined) {
			msg.set("등록된 영업활동이 없습니다");
		}
		else {
			if (storage.searchDatas === undefined) {
				jsonData = storage.salesList;
			} else {
				jsonData = storage.searchDatas;
			}
		}

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		containerTitle = document.getElementById("containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer")[0];
		container = document.getElementsByClassName("gridList")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn", "contractReqBtn"];
		showArr = [
			{ element: "gridList", display: "block" },
			{ element: "pageContainer", display: "flex" },
			{ element: "searchContainer", display: "block" },
			{ element: "listRange", display: "flex" },
			{ element: "listSearchInput", display: "flex" },
			{ element: "crudBtns", display: "flex" },
			{ element: "crudAddBtn", display: "flex" },
		];

		header = [
			{
				"title": "등록일",
				"align": "center",
			},
			{
				"title": "영업활동명",
				"align": "center",
			},
			{
				"title": "영업활동(시작)",
				"align": "center",
			},
			{
				"title": "영업활동(끝)",
				"align": "center",
			},
			{
				"title": "영업기회명",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
			{
				"title": "매출처",
				"align": "center",
			},
			{
				"title": "엔드유저",
				"align": "center",
			},
			{
				"title": "설명",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 9,
				},
			];

			data.push(str);
		} else {
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				disDate = CommonDatas.dateDis(new Date(jsonData[i].regDatetime).getTime(), new Date(jsonData[i].modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				disDate = CommonDatas.dateDis(new Date(jsonData[i].schedFrom).getTime());
				schedFrom = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				disDate = CommonDatas.dateDis(new Date(jsonData[i].schedTo).getTime());
				schedTo = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": schedFrom,
						"align": "center",
					},
					{
						"setData": schedTo,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].soppNo)) ? "" : CommonDatas.getSoppFind(jsonData[i].soppNo, "name"),
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].userNo)) ? "" : storage.user[jsonData[i].userNo].userName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].custNo)) ? "" : storage.customer[jsonData[i].custNo].custName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].ptncNo)) ? "" : storage.customer[jsonData[i].ptncNo].custName,
						"align": "center",
					},
					{
						"setData": jsonData[i].desc,
						"align": "left",
					},
				];

				fnc.push("CommonDatas.Temps.salesSet.salesDetailView(this)");
				ids.push(jsonData[i].salesNo);
				data.push(str);
			}

			let pageNation = CommonDatas.createPaging(pageContainer, result[3], "CommonDatas.pageMove", "CommonDatas.Temps.salesSet.drawSalesList", result[0]);
			pageContainer.innerHTML = pageNation;
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		CommonDatas.setViewContents(hideArr, showArr);
		document.getElementById("multiSearchBtn").setAttribute("onclick", "CommonDatas.Temps.salesSet.searchSubmit();");
		containerTitle.innerText = "영업활동조회";

		let path = location.pathname.split("/");

		if (path[3] !== undefined && jsonData !== null) {
			let content = document.querySelector(".gridContent[data-id=\"" + path[3] + "\"]");
			CommonDatas.Temps.salesSet.salesDetailView(content);
		}
	}

	//메인 화면에서 클릭한 영업활동 가져오는 함수
	salesDetailView(e) {
		let thisEle = e;

		axios.get("/api/sales/" + thisEle.dataset.id).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				let sales = new Sales(result);
				sales.detail();

				localStorage.setItem("loadSetPage", window.location.pathname);
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//영업활동 등록 폼
	salesInsertForm(){
		let html, dataArray;
	
		dataArray = [
			{
				"title": "활동시작일(*)",
				"elementId": "schedFrom",
				"type": "datetime",
				"disabled": false,
			},
			{
				"title": "활동종료일(*)",
				"elementId": "schedTo",
				"type": "datetime",
				"disabled": false,
			},
			{
				"title": "장소",
				"elementId": "salesPlace",
				"disabled": false,
			},
			{
				"title": "활동형태(*)",
				"selectValue": [
					{
						"key": "10170",
						"value": "회사방문",
					},
					{
						"key": "10171",
						"value": "기술지원",
					},
					{
						"key": "10221",
						"value": "제품설명",
					},
					{
						"key": "10222",
						"value": "시스템데모",
					},
					{
						"key": "10223",
						"value": "제품견적",
					},
					{
						"key": "10224",
						"value": "계약건 의사결정지원",
					},
					{
						"key": "10225",
						"value": "계약",
					},
					{
						"key": "10226",
						"value": "사후처리",
					},
					{
						"key": "10227",
						"value": "기타",
					},
					{
						"key": "10228",
						"value": "협력사요청",
					},
					{
						"key": "10229",
						"value": "협력사문의",
					},
					{
						"key": "10230",
						"value": "교육",
					},
					{
						"key": "10231",
						"value": "전화상담",
					},
					{
						"key": "10232",
						"value": "제조사업무협의",
					},
					{
						"key": "10233",
						"value": "외부출장",
					},
					{
						"key": "10234",
						"value": "제안설명회",
					}
				],
				"type": "select",
				"elementId": "type",
				"disabled": false,
			},
			{
				"title": "담당자(*)",
				"elementId": "userNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
			},
			{
				"title": "영업기회",
				"elementId": "soppNo",
				"complete": "sopp",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "매출처",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "엔드유저",
				"elementId": "ptncNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"col": 4,
				"disabled": false,
			},
			{
				"title": "내용",
				"elementId": "desc",
				"type": "textarea",
				"col": 4,
				"disabled": false,
			}
		];
	
		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70vw";
		modal.content.style.maxWidth = "70vw";
		modal.headTitle.innerText = "영업활동등록";
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.innerText = "등록";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "const sales = new Sales(); CommonDatas.Temps.sales.insert();");
		modal.close.setAttribute("onclick", "modal.hide();");

		storage.formList = {
			"soppNo": 0,
			"userNo": storage.my,
			"compNo": 0,
			"custNo": 0,
			"schedFrom": "",
			"schedTo": "",
			"salesPlace": "",
			"type": "",
			"desc": "",
			"salesCheck": 0,
			"title": "",
			"ptncNo": 0,
			"schedType": "",
			"regDatetime": "",
			"modDatetime": ""
		};
		
		setTimeout(() => {
			let my = storage.my, nowDate;
			nowDate = new Date();
			nowDate = nowDate.toISOString().substring(0, 10);
			document.getElementById("userNo").value = storage.user[my].userName;
			document.getElementById("userNo").setAttribute("data-change", true);
			document.getElementById("schedFrom").value = nowDate + "T09:00:00";
			document.getElementById("schedTo").value = nowDate + "T18:00:00";
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//영업활동 검색 버튼 클릭 함수
	searchSubmit() {
		let dataArray = [], resultArray, eachIndex = 0, user, sopp, cust, type, searchUser, searchSopp, searchCust, searchType, searchDateFrom, keyIndex = 0;
		searchUser = document.getElementById("searchUser");
		searchSopp = document.getElementById("searchSopp");
		searchCust = document.getElementById("searchCust");
		searchType = document.getElementById("searchType");
		searchDateFrom = (document.getElementById("searchDateFrom").value === "") ? "" : document.getElementById("searchDateFrom").value.replaceAll("-", "") + "#regDatetime" + document.getElementById("searchDateTo").value.replaceAll("-", "");
		
		for(let key in storage.salesList[0]){
			if(key === searchUser.dataset.key) user = "#" + keyIndex + "/" + searchUser.value;
			else if(key === searchSopp.dataset.key) sopp = "#" + keyIndex + "/" + searchSopp.value;
			else if(key === searchCust.dataset.key) cust = "#" + keyIndex + "/" + searchCust.value;
			else if(key === searchType.dataset.key) type = "#" + keyIndex + "/" + searchType.value;
			keyIndex++;
		}

		let searchValues = [user, sopp, cust, type, searchDateFrom];

		for (let i = 0; i < searchValues.length; i++) {
			if(searchValues[i] !== ""){
				let tempArray = CommonDatas.searchDataFilter(storage.salesList, searchValues[i], "multi", ["#regDatetime"]);
	
				for (let t = 0; t < tempArray.length; t++) {
					dataArray.push(tempArray[t]);
				}
	
				eachIndex++;
			}
		}
		
		resultArray = CommonDatas.searchMultiFilter(eachIndex, dataArray, storage.salesList);

		storage.searchDatas = resultArray;

		if (storage.searchDatas.length == 0) {
			msg.set("찾는 데이터가 없습니다.");
			storage.searchDatas = storage.salesList;
		}

		this.drawSalesList();
	}

	//공지사항 단일 검색 keyup 이벤트
	searchInputKeyup() {
		let searchAllInput, tempArray;
		searchAllInput = document.getElementById("searchAllInput").value;
		tempArray = CommonDatas.searchDataFilter(storage.salesList, searchAllInput, "input");

		if (tempArray.length > 0) {
			storage.searchDatas = tempArray;
		} else {
			storage.searchDatas = "";
		}

		this.drawSalesList();
	}
}


//영업활동관리 crud
class Sales{
	constructor(getData){
		CommonDatas.Temps.sales = this;
	
		if (getData !== undefined) {
			this.getData = getData;
			this.salesNo = getData.salesNo;
			this.soppNo = getData.soppNo;
			this.userNo = getData.userNo;
			this.compNo = getData.compNo;
			this.custNo = getData.custNo;
			this.schedFrom = getData.schedFrom;
			this.schedTo = getData.schedTo;
			this.salesPlace = getData.salesPlace;
			this.type = getData.type;
			this.desc = getData.desc;
			this.salesCheck = getData.salesCheck;
			this.title = getData.title;
			this.ptncNo = getData.ptncNo;
			this.schedType = getData.schedType;
			this.regDatetime = getData.regDatetime;
			this.modDatetime = getData.modDatetime;
		} else {
			this.salesNo = 0;
			this.soppNo = 0;
			this.userNo = storage.my;
			this.compNo = 0;
			this.custNo = 0;
			this.schedFrom = "";
			this.schedTo = "";
			this.salesPlace = "";
			this.type = "";
			this.desc = "";
			this.salesCheck = 0;
			this.title = "";
			this.ptncNo = 0;
			this.schedType = 0;
			this.regDatetime = "";
			this.modDatetime = "";
		}
	}

	//영업활동관리 상세보기
	detail() {
		let html = "";
		let setDate, datas, dataArray, notIdArray;

		CommonDatas.detailSetFormList(this.getData);

		let gridList = document.getElementsByClassName("gridList")[0];
		let containerTitle = document.getElementById("containerTitle");
		let detailBackBtn = document.getElementsByClassName("detailBackBtn")[0];
		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let crudDeleteBtn = document.getElementsByClassName("crudDeleteBtn")[0];

		setDate = CommonDatas.dateDis(new Date(this.regDatetime).getTime(), new Date(this.modDatetime).getTime());
		setDate = CommonDatas.dateFnc(setDate);

		notIdArray = ["userNo"];
		datas = ["soppNo", "userNo", "custNo", "ptncNo"];
		dataArray = [
			{
				"title": "활동시작일(*)",
				"elementId": "schedFrom",
				"type": "datetime",
				"value": this.schedFrom,
			},
			{
				"title": "활동종료일(*)",
				"elementId": "schedTo",
				"type": "datetime",
				"value": this.schedTo,
			},
			{
				"title": "장소",
				"elementId": "salesPlace",
				"value": this.salesPlace,
			},
			{
				"title": "활동형태(*)",
				"selectValue": [
					{
						"key": "10170",
						"value": "회사방문",
					},
					{
						"key": "10171",
						"value": "기술지원",
					},
					{
						"key": "10221",
						"value": "제품설명",
					},
					{
						"key": "10222",
						"value": "시스템데모",
					},
					{
						"key": "10223",
						"value": "제품견적",
					},
					{
						"key": "10224",
						"value": "계약건 의사결정지원",
					},
					{
						"key": "10225",
						"value": "계약",
					},
					{
						"key": "10226",
						"value": "사후처리",
					},
					{
						"key": "10227",
						"value": "기타",
					},
					{
						"key": "10228",
						"value": "협력사요청",
					},
					{
						"key": "10229",
						"value": "협력사문의",
					},
					{
						"key": "10230",
						"value": "교육",
					},
					{
						"key": "10231",
						"value": "전화상담",
					},
					{
						"key": "10232",
						"value": "제조사업무협의",
					},
					{
						"key": "10233",
						"value": "외부출장",
					},
					{
						"key": "10234",
						"value": "제안설명회",
					}
				],
				"type": "select",
				"elementId": "type"
			},
			{
				"title": "담당자(*)",
				"elementId": "userNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.userNo)) ? "" : storage.user[this.userNo].userName,
			},
			{
				"title": "영업기회",
				"elementId": "soppNo",
				"complete": "sopp",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.soppNo)) ? "" : CommonDatas.getSoppFind(this.soppNo, "name"),
			},
			{
				"title": "매출처",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.custNo)) ? "" : storage.customer[this.custNo].custName,
			},
			{
				"title": "엔드유저",
				"elementId": "ptncNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.ptncNo)) ? "" : storage.customer[this.ptncNo].custName,
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"value": this.title,
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "desc",
				"type": "textarea",
				"value": this.desc,
				"col": 4,
			}
		];

		html = CommonDatas.detailViewForm(dataArray);
		let createGrid = document.createElement("div");
		createGrid.className = "defaultFormContainer";
		createGrid.innerHTML = html;
		gridList.after(createGrid);
		containerTitle.innerText = this.title;
		let hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
		let showArr = ["defaultFormContainer"];
		CommonDatas.setViewContents(hideArr, showArr);
	
		if(storage.my == this.getData.userNo){
			crudUpdateBtn.setAttribute("onclick", "CommonDatas.enableDisabled(this, \"CommonDatas.Temps.sales.update();\", \"" + notIdArray + "\");")
			crudDeleteBtn.setAttribute("onclick", "CommonDatas.Temps.sales.delete();");
			crudUpdateBtn.style.display = "flex";
			crudDeleteBtn.style.display = "flex";
		}else{
			crudUpdateBtn.style.display = "none";
			crudDeleteBtn.style.display = "none";
		}
	
		detailBackBtn.style.display = "flex";
		CommonDatas.detailTrueDatas(datas);
	
		setTimeout(() => {
			document.getElementById("type").value = this.type;
			ckeditor.config.readOnly = true;
			window.setTimeout(setEditor, 100);
		}, 200);
	}

	insert(){
		if(document.getElementById("schedFrom").value === ""){
			msg.set("활동 시작일을 선택해주세요.");
			document.getElementById("schedFrom").focus();
			return false;
		} else if(document.getElementById("schedTo").value === ""){
			msg.set("활동 종료일을 선택해주세요.");
			document.getElementById("schedTo").focus();
			return false;
		} else if(document.getElementById("title").value === ""){
			msg.set("제목을 입력해주세요.");
			document.getElementById("title").focus();
			return false;
		} else{
			CommonDatas.formDataSet();
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.post("/api/sales", data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("등록되었습니다.");
				} else {
					msg.set("등록 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//영업활동 수정
	update() {
		if(document.getElementById("schedFrom").value === ""){
			msg.set("활동 시작일을 선택해주세요.");
			document.getElementById("schedFrom").focus();
			return false;
		} else if(document.getElementById("schedTo").value === ""){
			msg.set("활동 종료일을 선택해주세요.");
			document.getElementById("schedTo").focus();
			return false;
		} else if(document.getElementById("title").value === ""){
			msg.set("제목을 입력해주세요.");
			document.getElementById("title").focus();
			return false;
		} else {
			CommonDatas.formDataSet();
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.put("/api/sales/" + data.salesNo, data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("수정되었습니다.");
				} else {
					msg.set("수정 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("수정 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//영업활동 삭제
	delete() {
		if (confirm("정말로 삭제하시겠습니까??")) {
			axios.delete("/api/sales/" + storage.formList.salesNo, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("삭제되었습니다.");
				} else {
					msg.set("삭제 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("삭제 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		} else {
			return false;
		}
	}
}

//영업기회 시작
class SoppSet{
	constructor() {
		CommonDatas.Temps.soppSet = this;
	}

	//영업기회 리스트 저장 함수
	list() {
		axios.get("/api/sopp").then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);

				for(let i = 0; i < result.length; i++){
					let item = result[i];

					for(let key in item){
						if(key === "soppStatus"){
							item[key] = Number(item[key])
						}
					}
				}

				storage.soppList = result;
				CommonDatas.setCategories(result);

				if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.sopp === undefined) {
					window.setTimeout(this.drawSoppList, 1000);
					window.setTimeout(CommonDatas.searchListSet("soppList"), 1000);
				} else {
					window.setTimeout(this.drawSoppList, 200);
					window.setTimeout(CommonDatas.searchListSet("soppList"), 200);
				}

				$('.theme-loader').delay(1000).fadeOut("slow");
			}
		}).catch((error) => {
			msg.set("영업기회 리스트 에러입니다.\n" + error);
			console.log(error);
		})
	}

	//영업기회 리스트 출력 함수
	drawSoppList() {
		let container, result, jsonData, containerTitle, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [], pageContainer, hideArr, showArr, soppTargetDate;

		if (storage.soppList === undefined) {
			msg.set("등록된 영업기회가 없습니다");
		}
		else {
			if (storage.searchDatas === undefined) {
				jsonData = storage.soppList;
			} else {
				jsonData = storage.searchDatas;
			}
		}

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		containerTitle = document.getElementById("containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer")[0];
		container = document.getElementsByClassName("gridList")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn", "contractReqBtn"];
		showArr = [
			{ element: "gridList", display: "block" },
			{ element: "pageContainer", display: "flex" },
			{ element: "searchContainer", display: "block" },
			{ element: "listRange", display: "flex" },
			{ element: "listSearchInput", display: "flex" },
			{ element: "crudBtns", display: "flex" },
			{ element: "crudAddBtn", display: "flex" },
		];

		header = [
			{
				"title": "등록일",
				"align": "center",
			},
			{
				"title": "판매방식",
				"align": "center",
			},
			{
				"title": "계약구분",
				"align": "center",
			},
			{
				"title": "영업기회명",
				"align": "center",
			},
			{
				"title": "매출처",
				"align": "center",
			},
			{
				"title": "엔드유저",
				"align": "center",
			},
			{
				"title": "카테고리(제품회사명)",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
			{
				"title": "예상매출액",
				"align": "center",
			},
			{
				"title": "진행단계",
				"align": "center",
			},
			{
				"title": "매출예정일",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 11,
				},
			];

			data.push(str);
		} else {
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				disDate = CommonDatas.dateDis(new Date(jsonData[i].regDatetime).getTime(), new Date(jsonData[i].modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				disDate = CommonDatas.dateDis(new Date(jsonData[i].soppTargetDate).getTime());
				soppTargetDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].soppType)) ? "" : storage.code.etc[jsonData[i].soppType],
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].cntrctMth)) ? "" : storage.code.etc[jsonData[i].cntrctMth],
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].soppTitle)) ? "" : jsonData[i].soppTitle + " <a href=\"#\" class=\"rightDetailShowBtn\" data-id=\"" + jsonData[i].soppNo + "\" onclick=\"CommonDatas.Temps.soppSet.rightDetailShow(this);\" style=\"color: blue;\">열기</a>",
						"align": "left",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].custNo)) ? "" : storage.customer[jsonData[i].custNo].custName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].buyrNo)) ? "" : storage.customer[jsonData[i].buyrNo].custName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].categories)) ? "" : jsonData[i].categories,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].userNo)) ? "" : storage.user[jsonData[i].userNo].userName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].soppTargetAmt)) ? 0 : jsonData[i].soppTargetAmt.toLocaleString("en-US"),
						"align": "right",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].soppStatus)) ? "" : storage.code.etc[jsonData[i].soppStatus],
						"align": "center",
					},
					{
						"setData": soppTargetDate,
						"align": "center",
					},
				];

				fnc.push("CommonDatas.Temps.soppSet.soppDetailView(this, \"page\")");
				ids.push(jsonData[i].soppNo);
				data.push(str);
			}

			let pageNation = CommonDatas.createPaging(pageContainer, result[3], "CommonDatas.pageMove", "CommonDatas.Temps.soppSet.drawSoppList", result[0]);
			pageContainer.innerHTML = pageNation;
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		CommonDatas.setViewContents(hideArr, showArr);
		document.getElementById("multiSearchBtn").setAttribute("onclick", "CommonDatas.Temps.soppSet.searchSubmit();");
		containerTitle.innerText = "영업기회조회";
		CommonDatas.multiEventStopSet("rightDetailShowBtn");

		let path = location.pathname.split("/");

		if (path[3] !== undefined && jsonData !== null) {
			let content = document.querySelector(".gridContent[data-id=\"" + path[3] + "\"]");
			CommonDatas.Temps.salesSet.salesDetailView(content);
		}
	}

	//영업기회 매입매출내역 데이터 세팅 함수
	soppDetailInoutSet(id){
		let dataObjects = {};

		axios.get("/api/sopp/soppInout/" + id).then((response) => {
			if (response.data.result === "ok") {
				storage.inoutInSoppList = [];
				storage.inoutOutSoppList = [];
				storage.inoutContList = [];
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.soppInoutAllList = result;

				for(let i = 0; i < result.length; i++){
					if(result[i].contNo == 100){
						if(result[i].dataType === "1101"){
							storage.inoutInSoppList.push(result[i]);
						}else{
							storage.inoutOutSoppList.push(result[i]);
						}
					}else{
						if(dataObjects[result[i].contNo] === undefined){
							dataObjects[result[i].contNo] = {};
							dataObjects[result[i].contNo][Object.keys(dataObjects[result[i].contNo]).length] = result[i];
						}else{
							dataObjects[result[i].contNo][Object.keys(dataObjects[result[i].contNo]).length] = result[i];
						}
					}
				}
				storage.inoutContList.push(dataObjects);

				storage.inoutInSoppList = storage.inoutInSoppList.sort(function(a, b){
					if(a.vatDate !== undefined && a.vatDate != null && a.vatDate != ""){
						if(a.endvataDate !== undefined && a.endvataDate != null && a.endvataDate != ""){
							return new Date(a.endvataDate).getTime() - new Date(b.endvataDate).getTime();
						}else{
							return new Date(a.vatDate).getTime() - new Date(b.vatDate).getTime();
						}
					}else{
						return new Date(a.regDatetime).getTime() - new Date(b.regDatetime).getTime();
					}
				});

				storage.inoutOutSoppList = storage.inoutOutSoppList.sort(function(a, b){
					if(a.vatDate !== undefined && a.vatDate != null && a.vatDate != ""){
						if(a.endvataDate !== undefined && a.endvataDate != null && a.endvataDate != ""){
							return new Date(a.endvataDate).getTime() - new Date(b.endvataDate).getTime();
						}else{
							return new Date(a.vatDate).getTime() - new Date(b.vatDate).getTime();
						}
					}else{
						return new Date(a.regDatetime).getTime() - new Date(b.regDatetime).getTime();
					}
				});

				storage.inoutContList = storage.inoutContList.sort(function(a, b){
					if(a.vatDate !== undefined && a.vatDate != null && a.vatDate != ""){
						if(a.endvataDate !== undefined && a.endvataDate != null && a.endvataDate != ""){
							return new Date(a.endvataDate).getTime() - new Date(b.endvataDate).getTime();
						}else{
							return new Date(a.vatDate).getTime() - new Date(b.vatDate).getTime();
						}
					}else{
						return new Date(a.regDatetime).getTime() - new Date(b.regDatetime).getTime();
					}
				});
			}
		}).catch((error) => {
			msg.set("매입매출내역 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//영업기회 파일 내역 데이터 세팅 함수
	soppDetailFileListSet(id){
		axios.get("/api/sopp/soppFile/" + id).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.soppFileList = result;
			}
		}).catch((error) => {
			msg.set("첨부파일내역 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//영업기회 상세보기
	soppDetailView(e, type) {
		let thisEle = e;

		CommonDatas.Temps.soppSet.soppDetailInoutSet(thisEle.dataset.id);
		CommonDatas.Temps.soppSet.soppDetailFileListSet(thisEle.dataset.id);

		axios.get("/api/sopp/soppTech/" + thisEle.dataset.id).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.soppTechList = result;
			}
		}).catch((error) => {
			msg.set("기술지원내역 에러 입니다.\n" + error);
			console.log(error);
		});

		axios.get("/api/sopp/soppSales/" + thisEle.dataset.id).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.soppSalesList = result;
			}
		}).catch((error) => {
			msg.set("영업활동내역 에러 입니다.\n" + error);
			console.log(error);
		});

		axios.get("/api/sopp/" + thisEle.dataset.id).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);

				if(type === "page"){
					let sopp = new Sopp(result);
					sopp.detail();
	
					localStorage.setItem("loadSetPage", window.location.pathname);
				}else{
					CommonDatas.detailSetFormList(result);
				}
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});

	}

	//영업기회 등록 폼
	soppInsertForm(){
		let html, dataArray;
	
		dataArray = [
			{
				"title": "담당자(*)",
				"elementId": "userNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
			},
			{
				"title": "(부)담당자(*)",
				"elementId": "secondUserNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "매출처(*)",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "매출처 담당자",
				"complete": "cip",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "custMemberNo",
				"disabled": false,
			},
			{
				"title": "엔드유저(*)",
				"elementId": "buyrNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "진행단계(*)",
				"selectValue": [
					{
						"key": "10178",
						"value": "영업정보파악",
					},
					{
						"key": "10179",
						"value": "초기접촉",
					},
					{
						"key": "10180",
						"value": "제안서제출 및 PT",
					},
					{
						"key": "10181",
						"value": "견적서 제출",
					},
				],
				"type": "select",
				"elementId": "soppStatus",
				"disabled": false,
			},
			{
				"title": "가능성",
				"elementId": "soppSrate",
				"disabled": false,
			},
			{
				"title": "계약구분(*)",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
					{
						"key": "10247",
						"value": "판매계약",
					},
					{
						"key": "10248",
						"value": "유지보수",
					},
					{
						"key": "10254",
						"value": "임대계약",
					},
				],
				"type": "select",
				"elementId": "cntrctMth",
				"onChange": "CommonDatas.Temps.soppSet.cntrctMthChange(this);",
				"disabled": false,
			},
			{
				"title": "매출예정일",
				"elementId": "soppTargetDate",
				"type": "date",
				"disabled": false,
			},
			{
				"title": "판매방식(*)",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
					{
						"key": "10173",
						"value": "조달직판",
					},
					{
						"key": "10174",
						"value": "조달간판",
					},
					{
						"key": "10175",
						"value": "조달대행",
					},
					{
						"key": "10176",
						"value": "직접판매",
					},
					{
						"key": "10218",
						"value": "간접판매",
					},
					{
						"key": "10255",
						"value": "기타",
					},
				],
				"type": "select",
				"elementId": "soppType",
				"disabled": false,
			},
			{
				"title": "예상매출액",
				"elementId": "soppTargetAmt",
				"keyup": "CommonDatas.inputNumberFormat(this);",
				"col": 2,
				"disabled": false,
			},
			{
				"title": "카테고리<br />(제품회사명)",
				"complete": "productCust",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "카테고리 선택 시<br />자동 입력(*)",
				"elementId": "categories",
				"col": 2,
				"disabled": true,
			},
			{
				"title": "카테고리 삭제<br />선택 시 삭제",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
				],
				"type": "select",
				"disabled": false,
			},
			{
				"title": "유지보수대상(*)",
				"selectValue": [
					{
						"key": "N",
						"value": "No",
					},
					{
						"key": "Y",
						"value": "Yes",
					},
				],
				"type": "select",
				"elementId": "maintenanceTarget",
				"col": 2,
				"disabled": false,
			},
			{
				"title": "유지보수 시작일<br />유지보수 계약 시(*)",
				"elementId": "maintenance_S",
				"type": "date",
			},
			{
				"title": "유지보수 종료일<br />유지보수 계약 시(*)",
				"elementId": "maintenance_E",
				"type": "date",
			},
			{
				"title": "영업기회명(*)",
				"elementId": "soppTitle",
				"col": 4,
				"disabled": false,
			},
			{
				"title": "내용",
				"elementId": "soppDesc",
				"type": "textarea",
				"col": 4,
				"disabled": false,
			}
		];
	
		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70vw";
		modal.content.style.maxWidth = "70vw";
		modal.headTitle.innerText = "영업기회등록";
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.innerText = "등록";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "const sopp = new Sopp(); CommonDatas.Temps.sopp.insert();");
		modal.close.setAttribute("onclick", "modal.hide();");

		storage.formList = {
			"soppNo": 0,
			"compNo": 0,
			"userNo": storage.my,
			"custNo": 0,
			"contNo": 0,
			"custMemberNo": 0,
			"ptncNo": 0,
			"ptncMemberNo": 0,
			"buyrNo": 0,
			"buyrMemberNo": 0,
			"cntrctMth": 0,
			"soppTitle": "",
			"soppDesc": "",
			"soppTargetAmt": 0,
			"soppTargetDate": "",
			"maintenance_S": "",
			"maintenance_E": "",
			"soppType": 0,
			"soppStatus": "",
			"soppSrate": "",
			"soppSource": 0,
			"sopp2Desc": "",
			"sopp2regDatetime": "",
			"businessType": "",
			"op_priority": "",
			"regDatetime": "",
			"modDatetime": "",
			"attrib": "",
			"productNo": 0,
			"maintenanceTarget": "",
			"secondUserNo": 0,
			"categories": "",
		};
		
		setTimeout(() => {
			document.getElementById("userNo").value = storage.user[storage.my].userName;
			document.getElementById("userNo").setAttribute("data-change", true);
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//영업기회 파일 등록 폼
	soppFileInsertForm(){
		let html, dataArray;
	
		dataArray = [
			{
				"title": "파일 선택(*)",
				"elementId": "soppFileUpload",
				"type": "file",
				"col": 4,
				"disabled": false,
			},
			{
				"title": "내용",
				"elementId": "soppFileUploadDesc",
				"type": "textarea",
				"col": 4,
				"disabled": false,
			}
		];
	
		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70vw";
		modal.content.style.maxWidth = "70vw";
		modal.headTitle.innerText = "파일 등록";
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.innerText = "등록";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "let sopp = new Sopp(); sopp.soppFileInsert();");
		modal.close.setAttribute("onclick", "modal.hide();");
		
		setTimeout(() => {
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//영업기회 형식이 유지보수일 때 유지보수 일자 변경 함수
	cntrctMthChange(thisEle, getDatas){
		let maintenance_S = document.getElementById("maintenance_S");
		let maintenance_E = document.getElementById("maintenance_E");

		if(getDatas === undefined){
			if(thisEle.value === "10248"){
				let nowDate = new Date();
	
				maintenance_S.value = nowDate.toISOString().substring(0, 10);
				maintenance_S.disabled = false;
	
				nowDate.setFullYear(nowDate.getFullYear() + 1);
				maintenance_E.value = nowDate.toISOString().substring(0, 10);
				maintenance_E.disabled = false;
			} else{
				maintenance_S.value = "";
				maintenance_S.disabled = true;
				maintenance_E.value = "";
				maintenance_E.disabled = true;
			}
		}else{
			if(thisEle.value === "10248"){
				maintenance_S.value = getDatas.maintenance_S;
				maintenance_S.disabled = false;
	
				maintenance_E.value = getDatas.maintenance_E;
				maintenance_E.disabled = false;
			} else{
				maintenance_S.value = "";
				maintenance_S.disabled = true;
				maintenance_E.value = "";
				maintenance_E.disabled = true;
			}
		}
	}

	//영업기회 검색 버튼 클릭 함수
	searchSubmit() {
		let dataArray = [], resultArray, eachIndex = 0, user, title, cust, categories, soppType, cntrctMth, soppStatus, searchUser, searchTitle, searchCust, searchCategories, searchSoppType, searchCntrctMth, searchSoppStatus, searchDateFrom, keyIndex = 0;
		searchUser = document.getElementById("searchUser");
		searchTitle = document.getElementById("searchTitle");
		searchCust = document.getElementById("searchCust");
		searchCategories = document.getElementById("searchCategories");
		searchSoppType = document.getElementById("searchSoppType");
		searchCntrctMth = document.getElementById("searchCntrctMth");
		searchSoppStatus = document.getElementById("searchSoppStatus");
		searchDateFrom = (document.getElementById("searchDateFrom").value === "") ? "" : document.getElementById("searchDateFrom").value.replaceAll("-", "") + "#regDatetime" + document.getElementById("searchDateTo").value.replaceAll("-", "");
		
		for(let key in storage.soppList[0]){
			if(key === searchUser.dataset.key) user = "#" + keyIndex + "/" + searchUser.value;
			else if(key === searchTitle.dataset.key) title = "#" + keyIndex + "/" + searchTitle.value;
			else if(key === searchCust.dataset.key) cust = "#" + keyIndex + "/" + searchCust.value;
			else if(key === searchCategories.dataset.key) categories = "#" + keyIndex + "/" + searchCategories.value;
			else if(key === searchSoppType.dataset.key) soppType = "#" + keyIndex + "/" + searchSoppType.value;
			else if(key === searchCntrctMth.dataset.key) cntrctMth = "#" + keyIndex + "/" + searchCntrctMth.value;
			else if(key === searchSoppStatus.dataset.key) soppStatus = "#" + keyIndex + "/" + searchSoppStatus.value;
			keyIndex++;
		}

		let searchValues = [user, title, cust, categories, soppType, cntrctMth, soppStatus, searchDateFrom];

		for (let i = 0; i < searchValues.length; i++) {
			if(searchValues[i] !== ""){
				let tempArray = CommonDatas.searchDataFilter(storage.soppList, searchValues[i], "multi", ["#regDatetime"]);
	
				for (let t = 0; t < tempArray.length; t++) {
					dataArray.push(tempArray[t]);
				}
	
				eachIndex++;
			}
		}
		
		resultArray = CommonDatas.searchMultiFilter(eachIndex, dataArray, storage.soppList);

		storage.searchDatas = resultArray;

		if (storage.searchDatas.length == 0) {
			msg.set("찾는 데이터가 없습니다.");
			storage.searchDatas = storage.soppList;
		}

		this.drawSoppList();
	}

	//영업기회 단일 검색 keyup 이벤트
	searchInputKeyup() {
		let searchAllInput, tempArray;
		searchAllInput = document.getElementById("searchAllInput").value;
		tempArray = CommonDatas.searchDataFilter(storage.soppList, searchAllInput, "input");

		if (tempArray.length > 0) {
			storage.searchDatas = tempArray;
		} else {
			storage.searchDatas = "";
		}

		this.drawSoppList();
	}

	//영업기회 매입매출내역 등록 폼 세팅 함수
	drawInoutForm(){
		let soppContainer = document.getElementsByClassName("soppContainer")[0];

		if(document.getElementsByClassName("inoutSoppForm").length > 0){
			let inoutSoppForm = document.getElementsByClassName("inoutSoppForm");

			for(let i = 0; i < inoutSoppForm.length; i++){
				let item = inoutSoppForm[i];
				item.remove();
			}
		}

		let createDiv = document.createElement("div");
		let nowDate = new Date();
		createDiv.className = "inoutSoppForm tabPage";
		let html = "";

		html += "<div>";
		html += "<button type=\"button\" onclick=\"let sopp = new Sopp(); sopp.soppInoutDivisionInsert();\"/>분할추가</button>";
		html += "<button type=\"button\" onclick=\"let sopp = new Sopp(); sopp.soppInoutSingleInsert();\"/>매입매출추가</button>";
		html += "<button type=\"button\" onclick=\"let sopp = new Sopp(); sopp.soppInoutUpdate(this);\"/>매입매출수정</button>";
		html += "<button type=\"button\" onclick=\"let sopp = new Sopp(); sopp.soppInoutCheckDelete();\"/>선택삭제</button>";
		html += "</div>";

		html += "<div>";
		html += "<div>구분</div>";
		html += "<div>거래일자</div>";
		html += "<div>분할횟수</div>";
		html += "<div>단위(개월)</div>";
		html += "<div>계약금액</div>";
		html += "<div>상품</div>";
		html += "<div>거래처(매입/매출처)</div>";
		html += "</div>";

		html += "<div>";
		html += "<div><select id=\"inoutSoppDataType\"><option value=\"1101\" selected>매입</option><option value=\"1102\">매출</option></select></div>";
		html += "<div><input type=\"date\" id=\"inoutSoppVatDate\" value=\"" + nowDate.toISOString().substring(0, 10) + "\" /></div>";
		html += "<div><input type=\"text\" id=\"inoutSoppDivisionNum\" value=\"1\"/></div>";
		html += "<div><input type=\"text\" id=\"inoutSoppDivisionMonth\" value=\"1\"/></div>";
		html += "<div><input type=\"text\" id=\"inoutSoppDivisionContAmt\" onkeyup=\"CommonDatas.inputNumberFormat(this);\" style=\"text-align: right;\" value=\"0\"/></div>";
		html += "<div><input type=\"text\" data-complete=\"product\" data-key=\"productNo\" autocomplete=\"off\" id=\"inoutSoppProductNo\" onclick=\"CommonDatas.addAutoComplete(this);\" onkeyup=\"CommonDatas.addAutoComplete(this);\" style=\"text-align: center;\"></div>";
		html += "<div><input type=\"text\" data-complete=\"customer\" data-key=\"productNo\" autocomplete=\"off\" id=\"inoutSoppCustNo\" onclick=\"CommonDatas.addAutoComplete(this);\" onkeyup=\"CommonDatas.addAutoComplete(this);\" style=\"text-align: center;\"></div>";
		html += "</div>";

		html += "<div>";
		html += "<div>단가</div>";
		html += "<div>수량</div>";
		html += "<div>공급가</div>";
		html += "<div>부가세</div>";
		html += "<div>합계금액</div>";
		html += "<div style=\"grid-column: span 2;\">비고</div>";
		html += "</div>";

		html += "<div>";
		html += "<div><input type=\"text\" style=\"text-align: right;\" id=\"inoutSoppNetprice\" onkeyup=\"CommonDatas.Temps.soppSet.inoutSoppCalNetprice(this);\" value=\"0\" /></div>";
		html += "<div><input type=\"text\" style=\"text-align: right;\" id=\"inoutSoppQuanty\" onkeyup=\"CommonDatas.Temps.soppSet.inoutSoppCalQuanty(this);\" value=\"1\" /></div>";
		html += "<div><input type=\"text\" style=\"text-align: right;\" id=\"inoutSoppAmt\" placeholder=\"자동으로 계산 됩니다.\" value=\"0\" disabled/></div>";
		html += "<div><input type=\"text\" style=\"text-align: right;\" id=\"inoutSoppVat\" onkeyup=\"CommonDatas.Temps.soppSet.inoutSoppCalVat(this);\" value=\"0\" /></div>";
		html += "<div><input type=\"text\" style=\"text-align: right;\" id=\"inoutSoppTotal\" onkeyup=\"CommonDatas.Temps.soppSet.inoutSoppCalTotal(this);\" value=\"0\" /></div>";
		html += "<div style=\"grid-column: span 2;\"><input type=\"text\" id=\"inoutSoppRemark\"></div>";
		html += "</div>";

		createDiv.innerHTML = html;
		soppContainer.append(createDiv);
	}

	//영업기회 탭 매입매출내역 영업기회 출력 함수
	drawInoutSoppList() {
		let soppContainer, createDiv, divHtml = "", calInTotal = 0, calOutTotal = 0;

		if(document.getElementById("tabInoutSopp") !== null){
			document.getElementById("tabInoutSopp").remove();
		}

		divHtml += "<div class=\"inoutSoppListHeader\">";
		divHtml += "<div>선택</div>";
		divHtml += "<div>구분(등록/수정일)</div>";
		divHtml += "<div>거래처(매입/매출처)</div>";
		divHtml += "<div>상품</div>";
		divHtml += "<div>단가</div>";
		divHtml += "<div>수량</div>";
		divHtml += "<div>부가세액</div>";
		divHtml += "<div>공급가액</div>";
		divHtml += "<div>금액</div>";
		divHtml += "<div>비고</div>";
		divHtml += "<div>계약선택</div>";
		divHtml += "<div>할당</div>";
		divHtml += "<div>수정</div>";
		divHtml += "</div>";
			
		if(storage.inoutInSoppList.length > 0){
			for(let i = 0; i < storage.inoutInSoppList.length; i++){
				let item = storage.inoutInSoppList[i];
				let custName = (CommonDatas.emptyValuesCheck(item.salesCustNo)) ? "" : storage.customer[item.salesCustNo].custName;
				let productName = (CommonDatas.emptyValuesCheck(item.productNo)) ? "" : CommonDatas.getProductFind(item.productNo, "name");
				calInTotal += item.dataTotal;
	
				divHtml += "<div class=\"inoutSoppListItem\">";
				divHtml += "<div style=\"text-align: center;\"><input type=\"checkbox\" data-id=\"" + item.soppdataNo + "\" /></div>";
				
				if(item.vatDate !== undefined){
					divHtml += "<div style=\"text-align: center;\">매입(" + item.vatDate.substring(0, 10) + ")</div>";
				}else{
					divHtml += "<div style=\"text-align: center;\">매입(" + item.regDatetime.substring(0, 10) + ")</div>";
				}

				divHtml += "<div style=\"text-align: center;\">" + custName + "</div>";
				divHtml += "<div style=\"text-align: center;\">" + productName + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataNetprice.toLocaleString("en-US") + "</div>";
				divHtml += "<div style=\"text-align: center;\">" + item.dataQuanty + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataVat.toLocaleString("en-US") + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataAmt.toLocaleString("en-US") + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataTotal.toLocaleString("en-US") + "</div>";
				divHtml += "<div>" + item.dataRemark + "</div>";
				divHtml += "<div style=\"text-align: center;\">";
				divHtml += "<select>";
				
				if(Object.keys(storage.inoutContList[0]).length > 0){
					divHtml += "<option value=\"\">계약선택</option>";

					for(let key in storage.inoutContList[0]){
						let contTitle = (CommonDatas.emptyValuesCheck(key)) ? "" : CommonDatas.getContFind(key, "name");
						divHtml += "<option value=\"" + key + "\">" + contTitle + "</option>";
					}
				}else{
					divHtml += "<option>계약없음</option>";
				}

				divHtml += "</select>";
				divHtml += "</div>";
				divHtml += "<div style=\"text-align: center;\"><button type=\"button\" class=\"assignButton\" data-id=\"" + item.soppdataNo + "\" onclick=\"let sopp = new Sopp(); sopp.assignUpdate(this);\">할당</button></div>";
				divHtml += "<div style=\"text-align: center;\"><button type=\"button\" class=\"updateButton\" data-id=\"" + item.soppdataNo + "\" data-status=\"false\" onclick=\"CommonDatas.Temps.soppSet.soppInoutUpdateButtonSet(this);\">수정</button></div>";
				divHtml += "</div>";
			}
		}else{
			divHtml += "<div class=\"emptyInData\">데이터가 없습니다.</div>";
		}

		divHtml += "<div class=\"inSoppListTotal\">";
		divHtml += "<div>매입합계</div>";
		divHtml += "<div>" + calInTotal.toLocaleString("en-US") + "</div>";
		divHtml += "</div>";

		if(storage.inoutOutSoppList.length > 0){
			for(let i = 0; i < storage.inoutOutSoppList.length; i++){
				let item = storage.inoutOutSoppList[i];
				let custName = (CommonDatas.emptyValuesCheck(item.salesCustNo)) ? "" : storage.customer[item.salesCustNo].custName;
				let productName = (CommonDatas.emptyValuesCheck(item.productNo)) ? "" : CommonDatas.getProductFind(item.productNo, "name");
				calOutTotal += item.dataTotal;
	
				divHtml += "<div class=\"inoutSoppListItem\">";
				divHtml += "<div style=\"text-align: center;\"><input type=\"checkbox\" data-id=\"" + item.soppdataNo + "\" /></div>";
				
				if(item.vatDate !== undefined){
					if(item.endvataDate !== undefined){
						divHtml += "<div style=\"text-align: center;\">유지보수(" + item.vatDate.substring(0, 10) + " ~ " + item.endvataDate.substring(0, 10) + ")</div>";
					}else{
						divHtml += "<div style=\"text-align: center;\">매출(" + item.vatDate.substring(0, 10) + ")</div>";
					}
				}else{
					divHtml += "<div style=\"text-align: center;\">매출(" + item.regDatetime.substring(0, 10) + ")</div>";
				}

				divHtml += "<div style=\"text-align: center;\">" + custName + "</div>";
				divHtml += "<div style=\"text-align: center;\">" + productName + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataNetprice.toLocaleString("en-US") + "</div>";
				divHtml += "<div style=\"text-align: center;\">" + item.dataQuanty + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataVat.toLocaleString("en-US") + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataAmt.toLocaleString("en-US") + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataTotal.toLocaleString("en-US") + "</div>";
				divHtml += "<div>" + item.dataRemark + "</div>";
				divHtml += "<div style=\"text-align: center;\">";
				divHtml += "<select>";
				
				if(Object.keys(storage.inoutContList[0]).length > 0){
					divHtml += "<option value=\"\">계약선택</option>";

					for(let key in storage.inoutContList[0]){
						let contTitle = (CommonDatas.emptyValuesCheck(key)) ? "" : CommonDatas.getContFind(key, "name");
						divHtml += "<option value=\"" + key + "\">" + contTitle + "</option>";
					}
				}else{
					divHtml += "<option>계약없음</option>";
				}

				divHtml += "</select>";
				divHtml += "</div>";
				divHtml += "<div style=\"text-align: center;\"><button type=\"button\" class=\"assignButton\" data-id=\"" + item.soppdataNo + "\" onclick=\"let sopp = new Sopp(); sopp.assignUpdate(this);\">할당</button></div>";
				divHtml += "<div style=\"text-align: center;\"><button type=\"button\" class=\"updateButton\" data-id=\"" + item.soppdataNo + "\" data-status=\"false\" onclick=\"CommonDatas.Temps.soppSet.soppInoutUpdateButtonSet(this);\">수정</button></div>";
				divHtml += "</div>";
			}
		}else{
			divHtml += "<div class=\"emptyInData\">데이터가 없습니다.</div>";
		}

		divHtml += "<div class=\"outSoppListTotal\">";
		divHtml += "<div>매출합계</div>";
		divHtml += "<div>" + calOutTotal.toLocaleString("en-US") + "</div>";
		divHtml += "</div>";
		
		soppContainer = document.getElementsByClassName("soppContainer")[0];
		createDiv = document.createElement("div");
		createDiv.innerHTML = "<div class=\"tabInoutSoppTitle\"><div>영업기회명</div><div onclick=\"CommonDatas.Temps.soppSet.inoutTitleClick(this);\">" + storage.formList.soppTitle + " (※ 클릭하여 상세보기)" + "</div></div><div class=\"tabInoutTableList\" id=\"tabInoutSoppList\">" + divHtml + "</div>";
		createDiv.id = "tabInoutSopp";
		createDiv.className = "tabPage";
		soppContainer.append(createDiv);
	}

	//영업기회 탭 매입매출내역 계약 출력 함수
	drawInoutContList() {
		let soppContainer, createDiv, divHtml = "", inDatas = {}, outDatas = {};

		if(document.getElementsByClassName("tabInoutCont").length > 0){
			let tabInoutCont = document.getElementsByClassName("tabInoutCont");

			for(let i = 0; i < tabInoutCont.length; i++){
				let item = tabInoutCont[i];
				item.remove();
			}
		}

		if(storage.inoutContList !== undefined && Object.keys(storage.inoutContList[0]).length > 0){
			for(let key in storage.inoutContList[0]){
				let item = storage.inoutContList[0][key];
				
				if(inDatas[key] === undefined) inDatas[key] = {};
				if(outDatas[key] === undefined) outDatas[key] = {};

				for(let i = 0; i < Object.keys(item).length; i++){
					let secondItem = item[i];

					if(secondItem.dataType === "1101"){
						if(Object.keys(inDatas[key]).length == 0){
							inDatas[key][0] = secondItem;
						}else{
							inDatas[key][Object.keys(inDatas[key]).length] = secondItem;
						}
					}else{
						if(Object.keys(outDatas[key]).length == 0){
							outDatas[key][0] = secondItem;
						}else{
							outDatas[key][Object.keys(outDatas[key]).length] = secondItem;
						}
					}
				}
			}

			for(let key in inDatas){
				for(let outKey in outDatas){
					let outItem = outDatas[outKey];
					if(key == outKey){
						for(let i = 0; i < Object.keys(outItem).length; i++){
							inDatas[key][Object.keys(inDatas[key]).length] = outItem[i];
						}
					}
				}
			}

			for(let key in inDatas){
				let calInTotal = 0, calOutTotal = 0;
				let item = inDatas[key];
				let contTitle = (CommonDatas.emptyValuesCheck(item[0].contNo)) ? "" : CommonDatas.getContFind(item[0].contNo, "name");

				divHtml += "<div class=\"tabInoutContTitle\"><div>계약명</div><div onclick=\"CommonDatas.Temps.soppSet.inoutTitleClick(this);\">" + contTitle + " (※ 클릭하여 상세보기, 수정 또는 삭제는 계약페이지에서 진행해주십시오.)" + "</div></div>";
				divHtml += "<div class=\"tabInoutTableList\" id=\"tabInoutContList\">";
				divHtml += "<div class=\"inoutContListHeader\">";
				divHtml += "<div>선택</div>";
				divHtml += "<div>구분(등록/수정일)</div>";
				divHtml += "<div>거래처(매입/매출처)</div>";
				divHtml += "<div>상품</div>";
				divHtml += "<div>단가</div>";
				divHtml += "<div>수량</div>";
				divHtml += "<div>부가세액</div>";
				divHtml += "<div>공급가액</div>";
				divHtml += "<div>금액</div>";
				divHtml += "<div>비고</div>";
				divHtml += "</div>";

				for(let i = 0; i < Object.keys(item).length; i++){
					let secondItem = item[i];
					let custName = (CommonDatas.emptyValuesCheck(secondItem.custNo)) ? "" : storage.customer[secondItem.custNo].custName;
					let productName = (CommonDatas.emptyValuesCheck(secondItem.productNo)) ? "" : CommonDatas.getProductFind(secondItem.productNo, "name");
					
					divHtml += "<div class=\"inoutContListItem\">";
					divHtml += "<div style=\"text-align: center;\"><input type=\"checkbox\" data-id=\"" + secondItem.soppdataNo + "\" disabled/></div>";
					
					if(secondItem.dataType === "1101"){
						calInTotal += secondItem.dataTotal;

						if(secondItem.vatDate !== undefined){
							divHtml += "<div style=\"text-align: center;\">매입(" + secondItem.vatDate.substring(0, 10) + ")</div>";
						}else{
							divHtml += "<div style=\"text-align: center;\">매입(" + secondItem.regDatetime.substring(0, 10) + ")</div>";
						}
					}else{
						calOutTotal += secondItem.dataTotal;

						if(secondItem.vatDate !== undefined){
							if(secondItem.endvataDate !== undefined){
								divHtml += "<div style=\"text-align: center;\">유지보수(" + secondItem.vatDate.substring(0, 10) + " ~ " + secondItem.endvataDate.substring(0, 10) + ")</div>";
							}else{
								divHtml += "<div style=\"text-align: center;\">매출(" + secondItem.regDatetime.substring(0, 10) + ")</div>";
							}
						}else{
							divHtml += "<div style=\"text-align: center;\">매출(" + secondItem.regDatetime.substring(0, 10) + ")</div>";
						}
					}

					divHtml += "<div style=\"text-align: center;\">" + custName + "</div>";
					divHtml += "<div style=\"text-align: center;\">" + productName + "</div>";
					divHtml += "<div style=\"text-align: right;\">" + secondItem.dataNetprice.toLocaleString("en-US") + "</div>";
					divHtml += "<div style=\"text-align: center;\">" + secondItem.dataQuanty + "</div>";
					divHtml += "<div style=\"text-align: right;\">" + secondItem.dataVat.toLocaleString("en-US") + "</div>";
					divHtml += "<div style=\"text-align: right;\">" + secondItem.dataAmt.toLocaleString("en-US") + "</div>";
					divHtml += "<div style=\"text-align: right;\">" + secondItem.dataTotal.toLocaleString("en-US") + "</div>";
					divHtml += "<div>" + secondItem.dataRemark + "</div>";
					divHtml += "</div>";

					if((secondItem.dataType === "1101" && item[i + 1] === undefined) || (secondItem.dataType === "1101" && item[i + 1].dataType === "1102")){
						divHtml += "<div class=\"inContListTotal\">";
						divHtml += "<div>매입합계</div>";
						divHtml += "<div>" + calInTotal.toLocaleString("en-US") + "</div>";
						divHtml += "</div>";
					}

					if(secondItem.dataType === "1102" && item[i + 1] === undefined){
						divHtml += "<div class=\"outContListTotal\">";
						divHtml += "<div>매출합계</div>";
						divHtml += "<div>" + calOutTotal.toLocaleString("en-US") + "</div>";
						divHtml += "</div>";
					}
				}

				divHtml += "</div>";
			}
		}
		
		soppContainer = document.getElementsByClassName("soppContainer")[0];
		createDiv = document.createElement("div");
		createDiv.innerHTML = divHtml;
		createDiv.className = "tabInoutCont tabPage";
		soppContainer.append(createDiv);
	}

	//영업기회 탭 파일첨부 페이지 출력 함수
	drawSoppFileUpload() {
		let container, soppContainer, jsonData, createDiv, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [], createInputDiv, inputHtml = "", fileName;
		jsonData = storage.soppFileList;

		if(document.getElementById("tabFileUpload") !== null){
			document.getElementById("tabFileUpload").remove();
		}
		
		soppContainer = document.getElementsByClassName("soppContainer")[0];
		createDiv = document.createElement("div");
		createDiv.id = "tabFileUpload";
		createDiv.className = "tabPage";
		soppContainer.append(createDiv);
		container = document.getElementById("tabFileUpload");

		createInputDiv = document.createElement("div");
		createInputDiv.className = "fileUploadButtons";
		inputHtml += "<button type=\"button\" onclick=\"CommonDatas.Temps.soppSet.soppFileInsertForm();\">파일등록</button>";
		inputHtml += "<button type=\"button\" onclick=\"let sopp = new Sopp('" + jsonData + "'); sopp.soppFileDelete();\">선택삭제</button>";
		createInputDiv.innerHTML = inputHtml;

		header = [
			{
				"title": "선택",
				"align": "center",
			},
			{
				"title": "일자",
				"align": "center",
			},
			{
				"title": "파일명",
				"align": "center",
			},
			{
				"title": "파일설명",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 5,
				},
			];

			data.push(str);
		} else {
			for (let i = 0; i < jsonData.length; i++) {
				let item = jsonData[i];

				disDate = CommonDatas.dateDis(new Date(item.regDatetime).getTime(), new Date(item.modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				fileName = (CommonDatas.emptyValuesCheck(item.fileName)) ? "" : item.fileName;

				str = [
					{
						"setData": "<input type=\"checkbox\" class=\"soppFileCheck\" data-id=\"" + item.fileId + "\">",
						"align": "center",
					},
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": "<a href=\"#\" data-id=\"" + item.fileId + "\" onclick=\"let sopp = new Sopp(); sopp.soppDownloadFile(this);\">" + fileName + "</a>",
						"align": "left",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.fileDesc)) ? "" : item.fileDesc,
						"align": "left",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.userNo)) ? "" : storage.user[item.userNo].userName,
						"align": "center",
					},
				];

				fnc.push("");
				ids.push(jsonData[i].fileId);
				data.push(str);
			}
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc, "tabFileUpload");
		container.prepend(createInputDiv);
	}

	//영업기회 탭 기술지원리스트 출력 함수
	drawSoppTechList() {
		let container, soppContainer, jsonData, createDiv, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [];

		jsonData = storage.soppTechList;

		soppContainer = document.getElementsByClassName("soppContainer")[0];
		createDiv = document.createElement("div");
		createDiv.id = "tabTech";
		createDiv.className = "tabPage";
		soppContainer.append(createDiv);

		container = document.getElementById("tabTech");

		header = [
			{
				"title": "일자",
				"align": "center",
			},
			{
				"title": "지원형태",
				"align": "center",
			},
			{
				"title": "장소",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
			{
				"title": "비고",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 5,
				},
			];

			data.push(str);
		} else {
			for (let i = 0; i < jsonData.length; i++) {
				let item = jsonData[i];

				disDate = CommonDatas.dateDis(new Date(item.regDatetime).getTime(), new Date(item.modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.type)) ? "" : storage.code.etc[item.type],
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.techdPlace)) ? "" : item.techdPlace,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.userNo)) ? "" : storage.user[item.userNo].userName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.desc)) ? "" : item.desc,
						"align": "left",
					},
				];

				fnc.push("");
				ids.push("");
				data.push(str);
			}
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc, "tabTech");
	}

	//영업기회 탭 영업활동내역 출력 함수
	drawSoppSalesList() {
		let container, soppContainer, jsonData, createDiv, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [];

		jsonData = storage.soppSalesList;

		soppContainer = document.getElementsByClassName("soppContainer")[0];
		createDiv = document.createElement("div");
		createDiv.id = "tabSales";
		createDiv.className = "tabPage";
		soppContainer.append(createDiv);

		container = document.getElementById("tabSales");

		header = [
			{
				"title": "일자",
				"align": "center",
			},
			{
				"title": "활동종류",
				"align": "center",
			},
			{
				"title": "장소",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
			{
				"title": "비고",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 6,
				},
			];

			data.push(str);
		} else {
			for (let i = 0; i < jsonData.length; i++) {
				let item = jsonData[i];

				disDate = CommonDatas.dateDis(new Date(item.regDatetime).getTime(), new Date(item.modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.type)) ? "" : storage.code.etc[item.type],
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.salesPlace)) ? "" : item.salesPlace,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.userNo)) ? "" : storage.user[item.userNo].userName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.desc)) ? "" : item.desc,
						"align": "left",
					},
				];

				fnc.push("");
				ids.push("");
				data.push(str);
			}
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc, "tabSales");
	}

	//탭 radio 버튼 클릭 함수
	detailRadioChange(thisEle){
		let tabPage = document.getElementsByClassName("tabPage");
		let defaultFormContainer = document.getElementsByClassName("defaultFormContainer")[0];
		let dataKey;

		if(thisEle === undefined){
			dataKey = document.querySelector(".tabRadio:checked").dataset.key;
		}else{
			dataKey = thisEle.dataset.key;
		}
		
		for(let i = 0; i < tabPage.length; i++){
			defaultFormContainer.style.display = "none";
			tabPage[i].style.display = "none";
		}

		if(dataKey === "tabDefault") defaultFormContainer.style.display = "grid";
		else {
			if(dataKey === "tabInoutSopp"){
				let inoutSoppForm = document.getElementsByClassName("inoutSoppForm")[0];
				let tabInoutCont = document.getElementsByClassName("tabInoutCont");
				let inoutTotalContents = document.getElementsByClassName("inoutTotalContents")[0];

				inoutSoppForm.style.display = "block";

				for(let i = 0; i < tabInoutCont.length; i++){
					tabInoutCont[i].style.display = "block";
				}

				inoutTotalContents.style.display = "block";
			}

			document.getElementById(dataKey).style.display = "block";
		}
	}

	//매입매출내역 제목 부분 클릭 시 실행 함수
	inoutTitleClick(thisEle){
		let tabInoutTableList = document.getElementsByClassName("tabInoutTableList");
		let rightDetailInoutTableList = document.getElementsByClassName("rightDetailInoutTableList");

		if(tabInoutTableList !== undefined){
			for(let i = 0; i < tabInoutTableList.length; i++){
				tabInoutTableList[i].style.display = "none";
			}
		}

		if(rightDetailInoutTableList !== undefined){
			for(let i = 0; i < rightDetailInoutTableList.length; i++){
				rightDetailInoutTableList[i].style.display = "none";
			}
		}

		thisEle.parentElement.nextElementSibling.style.display = "block";
	}

	//매입매출내역 총 계 계산 후 세팅 함수
	inoutTotalSet(){
		let soppContainer = document.getElementsByClassName("soppContainer")[0];

		if(document.getElementsByClassName("inoutTotalContents").length > 0){
			let inoutTotalContents = document.getElementsByClassName("inoutTotalContents");

			for(let i = 0; i < inoutTotalContents.length; i++){
				let item = inoutTotalContents[i];
				item.remove();
			}
		}

		let inSoppListTotal = document.getElementById("tabInoutSopp").children[1].querySelector(".inSoppListTotal");
		let outSoppListTotal = document.getElementById("tabInoutSopp").children[1].querySelector(".outSoppListTotal");
		let inSoppTotal = (inSoppListTotal === undefined || inSoppListTotal === null) ? 0 : parseInt(inSoppListTotal.children[1].innerText.replace(/,/g, ""));
		let outSoppTotal = (outSoppListTotal === undefined|| outSoppListTotal === null) ? 0 : parseInt(outSoppListTotal.children[1].innerText.replace(/,/g, ""));
		let calInSoppTotal = parseInt(inSoppTotal - (inSoppTotal/11));
		let calOutSoppTotal = parseInt(outSoppTotal - (outSoppTotal/11));
		let calInoutProfitSoppTotal = parseInt(outSoppTotal - inSoppTotal - ((outSoppTotal - inSoppTotal)/11));
		let calInoutprofitSoppPersent = (calInoutProfitSoppTotal / calOutSoppTotal * 100).toFixed(2);
		let inContTotal = 0;
		let outContTotal = 0;
		let createDiv = document.createElement("div");
		let html = "", contTableList, inContListTotal, outContListTotal, calInContTotal = 0, calOutContTotal = 0, calInoutProfitContTotal = 0, calInoutprofitContPersent = 0;
		
		if(document.getElementsByClassName("tabInoutCont")[0] !== undefined){
			contTableList = document.getElementsByClassName("tabInoutCont")[0].querySelectorAll(".tabInoutTableList");
			
			for(let i = 0; i < contTableList.length; i++){
				let item = contTableList[i];
				inContListTotal = item.querySelectorAll(".inContListTotal");
				outContListTotal = item.querySelectorAll(".outContListTotal");

				for(let i = 0; i < inContListTotal.length; i++){
					let item = inContListTotal[i];
					inContTotal += (inContListTotal === undefined || inContListTotal === null) ? 0 : parseInt(item.children[1].innerText.replace(/,/g, ""));
				}
		
				for(let i = 0; i < outContListTotal.length; i++){
					let item = outContListTotal[i];
					outContTotal += (outContListTotal === undefined || outContListTotal === null) ? 0 : parseInt(item.children[1].innerText.replace(/,/g, ""));
				}
			}
		}

		if(calInoutProfitSoppTotal >= 0) calInoutProfitSoppTotal = "+" + calInoutProfitSoppTotal.toLocaleString("en-Us");
		else calInoutProfitSoppTotal = calInoutProfitSoppTotal.toLocaleString("en-US");

		if(calInoutprofitSoppPersent >= 0) calInoutprofitSoppPersent = "+" + calInoutprofitSoppPersent + "%";
		else calInoutprofitSoppPersent = (isNaN(calInoutprofitSoppPersent)) ? "0%" : calInoutprofitSoppPersent + "%";

		calInContTotal = parseInt(inContTotal - (inContTotal/11));
		calOutContTotal = parseInt(outContTotal - (outContTotal/11));
		calInoutProfitContTotal = parseInt(outContTotal - inContTotal - ((outContTotal - inContTotal)/11));
		calInoutprofitContPersent = (calInoutProfitContTotal / calOutContTotal * 100).toFixed(2);

		if(calInoutProfitContTotal >= 0) calInoutProfitContTotal = "+" + calInoutProfitContTotal.toLocaleString("en-Us");
		else calInoutProfitContTotal = calInoutProfitContTotal.toLocaleString("en-US");

		if(calInoutprofitContPersent >= 0) calInoutprofitContPersent = "+" + calInoutprofitContPersent + "%";
		else calInoutprofitContPersent = (isNaN(calInoutprofitContPersent)) ? "0%" : calInoutprofitContPersent + "%";

		html += "<div>영업기회 총 계</div>";
		html += "<div class=\"inoutSoppTotal\">";
		html += "<div style=\"text-align: center;\">매입 합계</div>";
		html += "<div style=\"text-align: right;\">" + calInSoppTotal.toLocaleString("en-US") + "</div>";
		html += "<div style=\"text-align: center;\">매출 합계</div>";
		html += "<div style=\"text-align: right;\">" + calOutSoppTotal.toLocaleString("en-US") + "</div>";
		html += "<div style=\"text-align: center;\">이익 합계</div>";
		html += "<div style=\"text-align: right;\">" + calInoutProfitSoppTotal + "</div>";
		html += "<div style=\"text-align: center;\">이익률</div>";
		html += "<div style=\"text-align: right;\">" + calInoutprofitSoppPersent + "</div>";
		html += "</div>";

		html += "<div>계약 총 계</div>";
		html += "<div class=\"inoutContTotal\">";
		html += "<div style=\"text-align: center;\">매입 합계</div>";
		html += "<div style=\"text-align: right;\">" + calInContTotal.toLocaleString("en-US") + "</div>";
		html += "<div style=\"text-align: center;\">매출 합계</div>";
		html += "<div style=\"text-align: right;\">" + calOutContTotal.toLocaleString("en-US") + "</div>";
		html += "<div style=\"text-align: center;\">이익 합계</div>";
		html += "<div style=\"text-align: right;\">" + calInoutProfitContTotal + "</div>";
		html += "<div style=\"text-align: center;\">이익률</div>";
		html += "<div style=\"text-align: right;\">" + calInoutprofitContPersent + "</div>";
		html += "</div>";

		createDiv.innerHTML = html;
		createDiv.className = "inoutTotalContents tabPage";
		soppContainer.append(createDiv);
	}

	//영업기회 우측 상세보기 실행 함수
	rightDetailShow(thisEle){
		CommonDatas.Temps.soppSet.soppDetailView(thisEle, "right");
		
		setTimeout(() => {
			let header = document.getElementsByClassName("header")[0];
			let bodyContent = document.getElementById("bodyContent");
			let createDiv = document.createElement("div");
			let calHeight = (document.body.clientHeight - header.offsetHeight) - 10;
			let calBodyHeight = calHeight - 70;
			let divHtml = "";
			let bodyHtml = "";
			
			if(document.getElementById("rightDetailParent") !== null){
				document.getElementById("rightDetailParent").remove();
			}
			
			bodyHtml = CommonDatas.Temps.soppSet.soppRightDetailHtmlSet();

			createDiv.style.display = "none";
			createDiv.id = "rightDetailParent";
			divHtml = "<div id=\"rightDetail\" style=\"top: " + bodyContent.offsetTop + "px; height: " + calHeight + "px;" + "\">";
			divHtml += "<div class=\"rightDetailTop\">";
			divHtml += "<div class=\"rightDetailTopTitle\">" + storage.formList.soppTitle + "</div>";
			divHtml += "<div class=\"rightDetailTopClose\" onclick=\"CommonDatas.Temps.soppSet.rightDetailClose();\">X</div>";
			divHtml += "</div>";
			divHtml += "<div class=\"rightDetailBody\" style=\"height: " + calBodyHeight + "px;" + "\">";
			divHtml += "<div class=\"rightDetailBodyTitle\">기본정보</div>";
			divHtml += "<div class=\"rightDetailBodyDefaultInfo\">" + bodyHtml + "</div>";
			divHtml += "<div class=\"rightDetailBodyTitle\">매입매출내역</div>";
			divHtml += "<div class=\"rightDetailBodyInoutContents\"></div>";
			divHtml += "<div class=\"rightDetailBodyTitle\">파일첨부</div>";
			divHtml += "<div class=\"rightDetailBodyFileContents\"></div>";
			divHtml += "<div class=\"rightDetailBodyTitle\">기술지원내역</div>";
			divHtml += "<div class=\"rightDetailBodyTechContents\"></div>";
			divHtml += "<div class=\"rightDetailBodyTitle\">영업활동내역</div>";
			divHtml += "<div class=\"rightDetailBodySalesContents\"></div>";
			divHtml += "</div>";
			divHtml += "</div>";
			createDiv.innerHTML = divHtml;
	
			bodyContent.append(createDiv);
		}, 600);

		setTimeout(() => {
			document.getElementById("soppStatus").value = storage.formList.soppStatus;
			document.getElementById("cntrctMth").value = storage.formList.cntrctMth;
			document.getElementById("soppType").value = storage.formList.soppType;
			ckeditor.config.readOnly = true;
			window.setTimeout(setEditor, 100);
		}, 800);

		setTimeout(() => {
			CommonDatas.Temps.soppSet.rightDetailInoutSoppList();
			CommonDatas.Temps.soppSet.rightDetailInoutContList();
			CommonDatas.Temps.soppSet.rightDetailFileList();
			CommonDatas.Temps.soppSet.rightDetailTechList();
			CommonDatas.Temps.soppSet.rightDetailSalesList();
			CommonDatas.Temps.soppSet.rightDetailInoutTotalSet();
			document.getElementById("rightDetailParent").style.display = "flex";
		}, 1000);

		// setTimeout(() => {
		// 	let soppSet = new SoppSet();
		// 	soppSet.drawSoppFileUpload();
		// 	soppSet.drawSoppTechList();
		// 	soppSet.drawSoppSalesList();
		// }, 700);
	}

	//영업기회 우측 상세 닫기 함수
	rightDetailClose(){
		if(document.getElementById("rightDetailParent").style.display !== "none"){
			document.getElementById("rightDetailParent").remove();
		}
	}

	//영업기회 우측 상세 html 세팅 함수
	soppRightDetailHtmlSet(){
		let html = "", dataArray, setDate, soppTargetDate, maintenance_S, maintenance_E;

		setDate = CommonDatas.dateDis(new Date(storage.formList.soppTargetDate).getTime());
		soppTargetDate = CommonDatas.dateFnc(setDate);

		setDate = CommonDatas.dateDis(new Date(storage.formList.maintenance_S).getTime());
		maintenance_S = CommonDatas.dateFnc(setDate);

		setDate = CommonDatas.dateDis(new Date(storage.formList.maintenance_E).getTime());
		maintenance_E = CommonDatas.dateFnc(setDate);

		dataArray = [
			{
				"title": "담당자(*)",
				"elementId": "userNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.userNo)) ? "" : storage.user[storage.formList.userNo].userName,
			},
			{
				"title": "(부)담당자",
				"elementId": "secondUserNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.secondUserNo)) ? "" : storage.user[storage.formList.secondUserNo].userName,
			},
			{
				"title": "매출처",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.custNo)) ? "" : storage.customer[storage.formList.custNo].custName,
			},
			{
				"title": "매출처 담당자",
				"complete": "cip",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "custMemberNo",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.custMemberNo)) ? "" : storage.cip[storage.formList.custMemberNo].name,
			},
			{
				"title": "엔드유저",
				"elementId": "buyrNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.buyrNo)) ? "" : storage.customer[storage.formList.buyrNo].custName,
			},
			{
				"title": "진행단계(*)",
				"selectValue": [
					{
						"key": "10178",
						"value": "영업정보파악",
					},
					{
						"key": "10179",
						"value": "초기접촉",
					},
					{
						"key": "10180",
						"value": "제안서제출 및 PT",
					},
					{
						"key": "10181",
						"value": "견적서 제출",
					},
				],
				"type": "select",
				"elementId": "soppStatus",
			},
			{
				"title": "가능성",
				"elementId": "soppSrate",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.soppSrate)) ? "" : storage.formList.soppSrate,
			},
			{
				"title": "계약구분",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
					{
						"key": "10247",
						"value": "판매계약",
					},
					{
						"key": "10248",
						"value": "유지보수",
					},
					{
						"key": "10254",
						"value": "임대계약",
					},
				],
				"type": "select",
				"elementId": "cntrctMth",
				"onChange": "CommonDatas.Temps.soppSet.cntrctMthChange(this);",
			},
			{
				"title": "매출예정일",
				"elementId": "soppTargetDate",
				"type": "date",
				"value": soppTargetDate,
			},
			{
				"title": "판매방식",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
					{
						"key": "10173",
						"value": "조달직판",
					},
					{
						"key": "10174",
						"value": "조달간판",
					},
					{
						"key": "10175",
						"value": "조달대행",
					},
					{
						"key": "10176",
						"value": "직접판매",
					},
					{
						"key": "10218",
						"value": "간접판매",
					},
					{
						"key": "10255",
						"value": "기타",
					},
				],
				"type": "select",
				"elementId": "soppType",
			},
			{
				"title": "예상매출액",
				"elementId": "soppTargetAmt",
				"keyup": "CommonDatas.inputNumberFormat(this);",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.soppTargetAmt)) ? "" : storage.formList.soppTargetAmt.toLocaleString("en-US"),
			},
			{
				"title": "카테고리<br />(제품회사명)",
				"complete": "productCust",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.categories)) ? "" : storage.formList.categories,
			},
			{
				"title": "유지보수대상",
				"selectValue": [
					{
						"key": "N",
						"value": "No",
					},
					{
						"key": "Y",
						"value": "Yes",
					},
				],
				"type": "select",
				"elementId": "maintenanceTarget",
			},
			{
				"title": "유지보수 시작일",
				"elementId": "maintenance_S",
				"type": "date",
				"value": maintenance_S,
			},
			{
				"title": "유지보수 종료일",
				"elementId": "maintenance_E",
				"type": "date",
				"value": maintenance_E,
			},
			{
				"title": "영업기회명",
				"elementId": "soppTitle",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.soppTitle)) ? "" : storage.formList.soppTitle,
			},
			{
				"title": "내용",
				"elementId": "soppDesc",
				"type": "textarea",
				"value": (CommonDatas.emptyValuesCheck(storage.formList.soppDesc)) ? "" : storage.formList.soppTitle,
			}
		];

		html = CommonDatas.detailViewForm(dataArray, "right");

		return html;
	}

	//영업기회 우측 상세 매입매출내역 영업기회 출력 함수
	rightDetailInoutSoppList() {
		let rightDetailBodyInoutContents, createDiv, divHtml = "", calInTotal = 0, calOutTotal = 0;
		rightDetailBodyInoutContents = document.getElementsByClassName("rightDetailBodyInoutContents")[0];

		if(document.getElementById("rightDetailInoutSopp") !== null){
			document.getElementById("rightDetailInoutSopp").remove();
		}

		divHtml += "<div class=\"inoutSoppListHeader\">";
		divHtml += "<div>구분(등록/수정일)</div>";
		divHtml += "<div>거래처(매입/매출처)</div>";
		divHtml += "<div>상품</div>";
		divHtml += "<div>금액</div>";
		divHtml += "<div>비고</div>";
		divHtml += "</div>";
			
		if(storage.inoutInSoppList.length > 0){
			for(let i = 0; i < storage.inoutInSoppList.length; i++){
				let item = storage.inoutInSoppList[i];
				let custName = (CommonDatas.emptyValuesCheck(item.salesCustNo)) ? "" : storage.customer[item.salesCustNo].custName;
				let productName = (CommonDatas.emptyValuesCheck(item.productNo)) ? "" : CommonDatas.getProductFind(item.productNo, "name");
				calInTotal += item.dataTotal;
	
				divHtml += "<div class=\"inoutSoppListItem\">";
				
				if(item.vatDate !== undefined){
					divHtml += "<div style=\"text-align: center;\">매입(" + item.vatDate.substring(0, 10) + ")</div>";
				}else{
					divHtml += "<div style=\"text-align: center;\">매입(" + item.regDatetime.substring(0, 10) + ")</div>";
				}

				divHtml += "<div style=\"text-align: center;\">" + custName + "</div>";
				divHtml += "<div style=\"text-align: center;\">" + productName + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataTotal.toLocaleString("en-US") + "</div>";
				divHtml += "<div>" + item.dataRemark + "</div>";
				divHtml += "</div>";
			}
		}else{
			divHtml += "<div class=\"emptyInData\">데이터가 없습니다.</div>";
		}

		divHtml += "<div class=\"inSoppListTotal\">";
		divHtml += "<div>매입합계</div>";
		divHtml += "<div>" + calInTotal.toLocaleString("en-US") + "</div>";
		divHtml += "</div>";

		if(storage.inoutOutSoppList.length > 0){
			for(let i = 0; i < storage.inoutOutSoppList.length; i++){
				let item = storage.inoutOutSoppList[i];
				let custName = (CommonDatas.emptyValuesCheck(item.salesCustNo)) ? "" : storage.customer[item.salesCustNo].custName;
				let productName = (CommonDatas.emptyValuesCheck(item.productNo)) ? "" : CommonDatas.getProductFind(item.productNo, "name");
				calOutTotal += item.dataTotal;
	
				divHtml += "<div class=\"inoutSoppListItem\">";
				
				if(item.vatDate !== undefined){
					if(item.endvataDate !== undefined){
						divHtml += "<div style=\"text-align: center;\">유지보수(" + item.vatDate.substring(0, 10) + " ~ " + item.endvataDate.substring(0, 10) + ")</div>";
					}else{
						divHtml += "<div style=\"text-align: center;\">매출(" + item.vatDate.substring(0, 10) + ")</div>";
					}
				}else{
					divHtml += "<div style=\"text-align: center;\">매출(" + item.regDatetime.substring(0, 10) + ")</div>";
				}

				divHtml += "<div style=\"text-align: center;\">" + custName + "</div>";
				divHtml += "<div style=\"text-align: center;\">" + productName + "</div>";
				divHtml += "<div style=\"text-align: right;\">" + item.dataTotal.toLocaleString("en-US") + "</div>";
				divHtml += "<div>" + item.dataRemark + "</div>";
				divHtml += "</div>";
			}
		}else{
			divHtml += "<div class=\"emptyInData\">데이터가 없습니다.</div>";
		}

		divHtml += "<div class=\"outSoppListTotal\">";
		divHtml += "<div>매출합계</div>";
		divHtml += "<div>" + calOutTotal.toLocaleString("en-US") + "</div>";
		divHtml += "</div>";
		createDiv = document.createElement("div");
		createDiv.innerHTML = "<div class=\"rightDetailInoutSoppTitle\"><div>영업기회명</div><div onclick=\"CommonDatas.Temps.soppSet.inoutTitleClick(this);\">" + storage.formList.soppTitle + " (※ 클릭하여 상세보기)" + "</div></div><div class=\"rightDetailInoutTableList\">" + divHtml + "</div>";
		createDiv.id = "rightDetailInoutSopp";
		rightDetailBodyInoutContents.append(createDiv);
	}


	//영업기회 우측 상세 매입매출내역 계약 출력 함수
	rightDetailInoutContList(){
		let rightDetailBodyInoutContents, createDiv, divHtml = "", inDatas = {}, outDatas = {};
		rightDetailBodyInoutContents = document.getElementsByClassName("rightDetailBodyInoutContents")[0];

		if(document.getElementsByClassName("rightDetailInoutCont").length > 0){
			let rightDetailInoutCont = document.getElementsByClassName("rightDetailInoutCont");

			for(let i = 0; i < rightDetailInoutCont.length; i++){
				let item = rightDetailInoutCont[i];
				item.remove();
			}
		}

		if(storage.inoutContList !== undefined && Object.keys(storage.inoutContList[0]).length > 0){
			for(let key in storage.inoutContList[0]){
				let item = storage.inoutContList[0][key];
				
				if(inDatas[key] === undefined) inDatas[key] = {};
				if(outDatas[key] === undefined) outDatas[key] = {};

				for(let i = 0; i < Object.keys(item).length; i++){
					let secondItem = item[i];

					if(secondItem.dataType === "1101"){
						if(Object.keys(inDatas[key]).length == 0){
							inDatas[key][0] = secondItem;
						}else{
							inDatas[key][Object.keys(inDatas[key]).length] = secondItem;
						}
					}else{
						if(Object.keys(outDatas[key]).length == 0){
							outDatas[key][0] = secondItem;
						}else{
							outDatas[key][Object.keys(outDatas[key]).length] = secondItem;
						}
					}
				}
			}

			for(let key in inDatas){
				for(let outKey in outDatas){
					let outItem = outDatas[outKey];
					if(key == outKey){
						for(let i = 0; i < Object.keys(outItem).length; i++){
							inDatas[key][Object.keys(inDatas[key]).length] = outItem[i];
						}
					}
				}
			}

			for(let key in inDatas){
				let calInTotal = 0, calOutTotal = 0;
				let item = inDatas[key];
				let contTitle = (CommonDatas.emptyValuesCheck(item[0].contNo)) ? "" : CommonDatas.getContFind(item[0].contNo, "name");

				divHtml += "<div class=\"rightDetailInoutContTitle\"><div>계약명</div><div onclick=\"CommonDatas.Temps.soppSet.inoutTitleClick(this);\">" + contTitle + " (※ 클릭하여 상세보기, 수정 또는 삭제는 계약페이지에서 진행해주십시오.)" + "</div></div>";
				divHtml += "<div class=\"rightDetailInoutTableList\">";
				divHtml += "<div class=\"inoutContListHeader\">";
				divHtml += "<div>구분(등록/수정일)</div>";
				divHtml += "<div>거래처(매입/매출처)</div>";
				divHtml += "<div>상품</div>";
				divHtml += "<div>금액</div>";
				divHtml += "<div>비고</div>";
				divHtml += "</div>";

				for(let i = 0; i < Object.keys(item).length; i++){
					let secondItem = item[i];
					let custName = (CommonDatas.emptyValuesCheck(secondItem.custNo)) ? "" : storage.customer[secondItem.custNo].custName;
					let productName = (CommonDatas.emptyValuesCheck(secondItem.productNo)) ? "" : CommonDatas.getProductFind(secondItem.productNo, "name");
					
					divHtml += "<div class=\"inoutContListItem\">";
					
					if(secondItem.dataType === "1101"){
						calInTotal += secondItem.dataTotal;

						if(secondItem.vatDate !== undefined){
							divHtml += "<div style=\"text-align: center;\">매입(" + secondItem.vatDate.substring(0, 10) + ")</div>";
						}else{
							divHtml += "<div style=\"text-align: center;\">매입(" + secondItem.regDatetime.substring(0, 10) + ")</div>";
						}
					}else{
						calOutTotal += secondItem.dataTotal;

						if(secondItem.vatDate !== undefined){
							if(secondItem.endvataDate !== undefined){
								divHtml += "<div style=\"text-align: center;\">유지보수(" + secondItem.vatDate.substring(0, 10) + " ~ " + secondItem.endvataDate.substring(0, 10) + ")</div>";
							}else{
								divHtml += "<div style=\"text-align: center;\">매출(" + secondItem.regDatetime.substring(0, 10) + ")</div>";
							}
						}else{
							divHtml += "<div style=\"text-align: center;\">매출(" + secondItem.regDatetime.substring(0, 10) + ")</div>";
						}
					}

					divHtml += "<div style=\"text-align: center;\">" + custName + "</div>";
					divHtml += "<div style=\"text-align: center;\">" + productName + "</div>";
					divHtml += "<div style=\"text-align: right;\">" + secondItem.dataTotal.toLocaleString("en-US") + "</div>";
					divHtml += "<div>" + secondItem.dataRemark + "</div>";
					divHtml += "</div>";

					if((secondItem.dataType === "1101" && item[i + 1] === undefined) || (secondItem.dataType === "1101" && item[i + 1].dataType === "1102")){
						divHtml += "<div class=\"inContListTotal\">";
						divHtml += "<div>매입합계</div>";
						divHtml += "<div>" + calInTotal.toLocaleString("en-US") + "</div>";
						divHtml += "</div>";
					}

					if(secondItem.dataType === "1102" && item[i + 1] === undefined){
						divHtml += "<div class=\"outContListTotal\">";
						divHtml += "<div>매출합계</div>";
						divHtml += "<div>" + calOutTotal.toLocaleString("en-US") + "</div>";
						divHtml += "</div>";
					}
				}

				divHtml += "</div>";
			}
		}
		
		createDiv = document.createElement("div");
		createDiv.innerHTML = divHtml;
		createDiv.className = "rightDetailInoutCont";
		rightDetailBodyInoutContents.append(createDiv);
	}

	rightDetailInoutTotalSet(){
		let rightDetailBodyInoutContents = document.getElementsByClassName("rightDetailBodyInoutContents")[0];

		if(document.getElementsByClassName("rightDetailInoutTotalContents").length > 0){
			let rightDetailInoutTotalContents = document.getElementsByClassName("rightDetailInoutTotalContents");

			for(let i = 0; i < rightDetailInoutTotalContents.length; i++){
				let item = rightDetailInoutTotalContents[i];
				item.remove();
			}
		}

		let inSoppListTotal = document.getElementById("rightDetailInoutSopp").children[1].querySelector(".inSoppListTotal");
		let outSoppListTotal = document.getElementById("rightDetailInoutSopp").children[1].querySelector(".outSoppListTotal");
		let inSoppTotal = (inSoppListTotal === undefined || inSoppListTotal === null) ? 0 : parseInt(inSoppListTotal.children[1].innerText.replace(/,/g, ""));
		let outSoppTotal = (outSoppListTotal === undefined|| outSoppListTotal === null) ? 0 : parseInt(outSoppListTotal.children[1].innerText.replace(/,/g, ""));
		let calInSoppTotal = parseInt(inSoppTotal - (inSoppTotal/11));
		let calOutSoppTotal = parseInt(outSoppTotal - (outSoppTotal/11));
		let calInoutProfitSoppTotal = parseInt(outSoppTotal - inSoppTotal - ((outSoppTotal - inSoppTotal)/11));
		let calInoutprofitSoppPersent = (calInoutProfitSoppTotal / calOutSoppTotal * 100).toFixed(2);
		let inContTotal = 0;
		let outContTotal = 0;
		let createDiv = document.createElement("div");
		let html = "", contTableList, inContListTotal, outContListTotal, calInContTotal = 0, calOutContTotal = 0, calInoutProfitContTotal = 0, calInoutprofitContPersent = 0;
		
		if(document.getElementsByClassName("rightDetailInoutCont")[0] !== undefined){
			contTableList = document.getElementsByClassName("rightDetailInoutCont")[0].querySelectorAll(".rightDetailInoutTableList");
			
			for(let i = 0; i < contTableList.length; i++){
				let item = contTableList[i];
				inContListTotal = item.querySelectorAll(".inContListTotal");
				outContListTotal = item.querySelectorAll(".outContListTotal");

				for(let i = 0; i < inContListTotal.length; i++){
					let item = inContListTotal[i];
					inContTotal += (inContListTotal === undefined || inContListTotal === null) ? 0 : parseInt(item.children[1].innerText.replace(/,/g, ""));
				}
		
				for(let i = 0; i < outContListTotal.length; i++){
					let item = outContListTotal[i];
					outContTotal += (outContListTotal === undefined || outContListTotal === null) ? 0 : parseInt(item.children[1].innerText.replace(/,/g, ""));
				}
			}
		}

		if(calInoutProfitSoppTotal >= 0) calInoutProfitSoppTotal = "+" + calInoutProfitSoppTotal.toLocaleString("en-Us");
		else calInoutProfitSoppTotal = calInoutProfitSoppTotal.toLocaleString("en-US");

		if(calInoutprofitSoppPersent >= 0) calInoutprofitSoppPersent = "+" + calInoutprofitSoppPersent + "%";
		else calInoutprofitSoppPersent = (isNaN(calInoutprofitSoppPersent)) ? "0%" : calInoutprofitSoppPersent + "%";

		calInContTotal = parseInt(inContTotal - (inContTotal/11));
		calOutContTotal = parseInt(outContTotal - (outContTotal/11));
		calInoutProfitContTotal = parseInt(outContTotal - inContTotal - ((outContTotal - inContTotal)/11));
		calInoutprofitContPersent = (calInoutProfitContTotal / calOutContTotal * 100).toFixed(2);

		if(calInoutProfitContTotal >= 0) calInoutProfitContTotal = "+" + calInoutProfitContTotal.toLocaleString("en-Us");
		else calInoutProfitContTotal = calInoutProfitContTotal.toLocaleString("en-US");

		if(calInoutprofitContPersent >= 0) calInoutprofitContPersent = "+" + calInoutprofitContPersent + "%";
		else calInoutprofitContPersent = (isNaN(calInoutprofitContPersent)) ? "0%" : calInoutprofitContPersent + "%";

		html += "<div>영업기회 총 계</div>";
		html += "<div class=\"inoutSoppTotal\">";
		html += "<div style=\"text-align: center;\">매입 합계</div>";
		html += "<div style=\"text-align: right;\">" + calInSoppTotal.toLocaleString("en-US") + "</div>";
		html += "<div style=\"text-align: center;\">매출 합계</div>";
		html += "<div style=\"text-align: right;\">" + calOutSoppTotal.toLocaleString("en-US") + "</div>";
		html += "<div style=\"text-align: center;\">이익 합계</div>";
		html += "<div style=\"text-align: right;\">" + calInoutProfitSoppTotal + "</div>";
		html += "<div style=\"text-align: center;\">이익률</div>";
		html += "<div style=\"text-align: right;\">" + calInoutprofitSoppPersent + "</div>";
		html += "</div>";

		html += "<div>계약 총 계</div>";
		html += "<div class=\"inoutContTotal\">";
		html += "<div style=\"text-align: center;\">매입 합계</div>";
		html += "<div style=\"text-align: right;\">" + calInContTotal.toLocaleString("en-US") + "</div>";
		html += "<div style=\"text-align: center;\">매출 합계</div>";
		html += "<div style=\"text-align: right;\">" + calOutContTotal.toLocaleString("en-US") + "</div>";
		html += "<div style=\"text-align: center;\">이익 합계</div>";
		html += "<div style=\"text-align: right;\">" + calInoutProfitContTotal + "</div>";
		html += "<div style=\"text-align: center;\">이익률</div>";
		html += "<div style=\"text-align: right;\">" + calInoutprofitContPersent + "</div>";
		html += "</div>";

		createDiv.innerHTML = html;
		createDiv.className = "rightDetailInoutTotalContents";
		rightDetailBodyInoutContents.append(createDiv);
	}

	//영업기회 우측 상세 파일 리스트 출력 함수
	rightDetailFileList(){
		let container, rightDetailBodyFileContents, jsonData, createDiv, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [], fileName;
		jsonData = storage.soppFileList;
		
		rightDetailBodyFileContents = document.getElementsByClassName("rightDetailBodyFileContents")[0];
		createDiv = document.createElement("div");
		createDiv.id = "rightDetailFileList";
		rightDetailBodyFileContents.append(createDiv);
		container = document.getElementById("rightDetailFileList");

		header = [
			{
				"title": "일자",
				"align": "center",
			},
			{
				"title": "파일명",
				"align": "center",
			},
			{
				"title": "파일설명",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 5,
				},
			];

			data.push(str);
		} else {
			for (let i = 0; i < jsonData.length; i++) {
				let item = jsonData[i];

				disDate = CommonDatas.dateDis(new Date(item.regDatetime).getTime(), new Date(item.modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				fileName = (CommonDatas.emptyValuesCheck(item.fileName)) ? "" : item.fileName;

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": "<a href=\"#\" data-id=\"" + item.fileId + "\" onclick=\"let sopp = new Sopp(); sopp.soppDownloadFile(this);\">" + fileName + "</a>",
						"align": "left",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.fileDesc)) ? "" : item.fileDesc,
						"align": "left",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.userNo)) ? "" : storage.user[item.userNo].userName,
						"align": "center",
					},
				];

				fnc.push("");
				ids.push(jsonData[i].fileId);
				data.push(str);
			}
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc, "rightDetailFileList");
	}

	//영업기회 우측 상세 기술지원 리스트 출력 함수
	rightDetailTechList(){
		let container, rightDetailBodyTechContents, jsonData, createDiv, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [];

		jsonData = storage.soppTechList;

		rightDetailBodyTechContents = document.getElementsByClassName("rightDetailBodyTechContents")[0];
		createDiv = document.createElement("div");
		createDiv.id = "rightDetailBodyTechList";
		rightDetailBodyTechContents.append(createDiv);
		container = document.getElementById("rightDetailBodyTechList");

		header = [
			{
				"title": "일자",
				"align": "center",
			},
			{
				"title": "지원형태",
				"align": "center",
			},
			{
				"title": "장소",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
			{
				"title": "비고",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 5,
				},
			];

			data.push(str);
		} else {
			for (let i = 0; i < jsonData.length; i++) {
				let item = jsonData[i];

				disDate = CommonDatas.dateDis(new Date(item.regDatetime).getTime(), new Date(item.modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.type)) ? "" : storage.code.etc[item.type],
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.techdPlace)) ? "" : item.techdPlace,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.userNo)) ? "" : storage.user[item.userNo].userName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.desc)) ? "" : item.desc,
						"align": "left",
					},
				];

				fnc.push("");
				ids.push("");
				data.push(str);
			}
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc, "rightDetailBodyTechList");
	}

	//영업기회 우측 상세 영업활동 리스트 출력 함수
	rightDetailSalesList(){
		let container, rightDetailBodySalesContents, jsonData, createDiv, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [];

		jsonData = storage.soppSalesList;

		rightDetailBodySalesContents = document.getElementsByClassName("rightDetailBodySalesContents")[0];
		createDiv = document.createElement("div");
		createDiv.id = "rightDetailBodySalesList";
		rightDetailBodySalesContents.append(createDiv);
		container = document.getElementById("rightDetailBodySalesList");

		header = [
			{
				"title": "일자",
				"align": "center",
			},
			{
				"title": "활동종류",
				"align": "center",
			},
			{
				"title": "장소",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
			{
				"title": "비고",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 6,
				},
			];

			data.push(str);
		} else {
			for (let i = 0; i < jsonData.length; i++) {
				let item = jsonData[i];

				disDate = CommonDatas.dateDis(new Date(item.regDatetime).getTime(), new Date(item.modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.type)) ? "" : storage.code.etc[item.type],
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.salesPlace)) ? "" : item.salesPlace,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.userNo)) ? "" : storage.user[item.userNo].userName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(item.desc)) ? "" : item.desc,
						"align": "left",
					},
				];

				fnc.push("");
				ids.push("");
				data.push(str);
			}
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc, "rightDetailBodySalesList");
	}

	//영업기회 매입매출내역 단가 keyup 이벤트
	inoutSoppCalNetprice(thisEle){
		let netPrice = parseInt(thisEle.value.replace(/,/g, ""));
		let inoutSoppQuanty = document.getElementById("inoutSoppQuanty");
		let inoutSoppAmt = document.getElementById("inoutSoppAmt");
		let inoutSoppVat = document.getElementById("inoutSoppVat");
		let inoutSoppTotal = document.getElementById("inoutSoppTotal");
		
		if(thisEle.value !== ""){
			let calAmount = netPrice * parseInt(inoutSoppQuanty.value);
			let calVat = calAmount * 0.1;
			let calTotal = calAmount + calVat;
	
			inoutSoppAmt.value = CommonDatas.numberFormat(calAmount);
			inoutSoppVat.value = CommonDatas.numberFormat(calVat);
			inoutSoppTotal.value = CommonDatas.numberFormat(calTotal);
	
			CommonDatas.inputNumberFormat(thisEle);
		}else{
			thisEle.value = 0;
			inoutSoppAmt.value = 0;
			inoutSoppVat.value = 0;
			inoutSoppTotal.value = 0;
		}
	}

	//영업기회 매입매출내역 수량 keyup 이벤트
	inoutSoppCalQuanty(thisEle){
		let quanty = parseInt(thisEle.value);
		let inoutSoppNetprice = document.getElementById("inoutSoppNetprice");
		let inoutSoppAmt = document.getElementById("inoutSoppAmt");
		let inoutSoppVat = document.getElementById("inoutSoppVat");
		let inoutSoppTotal = document.getElementById("inoutSoppTotal");
		
		if(thisEle.value !== ""){
			let calAmount = parseInt(inoutSoppNetprice.value.replace(/,/g, "")) * quanty;
			let calVat = calAmount * 0.1;
			let calTotal = calAmount + calVat;
	
			inoutSoppAmt.value = CommonDatas.numberFormat(calAmount);
			inoutSoppVat.value = CommonDatas.numberFormat(calVat);
			inoutSoppTotal.value = CommonDatas.numberFormat(calTotal);
		}else{
			thisEle.value = 0;
			inoutSoppAmt.value = 0;
			inoutSoppVat.value = 0;
			inoutSoppTotal.value = 0;
		}
	}

	//영업기회 매입매출내역 부가세 keyup 이벤트
	inoutSoppCalVat(thisEle){
		let vat = parseInt(thisEle.value.replace(/,/g, ""));
		let inoutSoppAmt = document.getElementById("inoutSoppAmt");
		let inoutSoppTotal = document.getElementById("inoutSoppTotal");
		
		if(thisEle.value !== ""){
			let calTotal = vat + parseInt(inoutSoppAmt.value.replace(/,/g, ""));
			inoutSoppTotal.value = CommonDatas.numberFormat(calTotal);
	
			CommonDatas.inputNumberFormat(thisEle);
		}else{
			thisEle.value = 0;
		}
	}

	//영업기회 매입매출내역 단가 keyup 이벤트
	inoutSoppCalTotal(thisEle){
		let total = parseInt(thisEle.value.replace(/,/g, ""));
		let inoutSoppQuanty = document.getElementById("inoutSoppQuanty");
		let inoutSoppAmt = document.getElementById("inoutSoppAmt");
		let inoutSoppVat = document.getElementById("inoutSoppVat");
		let inoutSoppNetprice = document.getElementById("inoutSoppNetprice");
		
		if(thisEle.value !== ""){
			let calNetprice = Math.round(total / 11 * 10 / parseInt(inoutSoppQuanty.value));
			let calAmount = Math.round(total / 11 * 10);
			let calVat = Math.round(total / 11);
			
			inoutSoppNetprice.value = CommonDatas.numberFormat(calNetprice)
			inoutSoppAmt.value = CommonDatas.numberFormat(calAmount);
			inoutSoppVat.value = CommonDatas.numberFormat(calVat);
	
			CommonDatas.inputNumberFormat(thisEle);
		}else{
			thisEle.value = 0;
			inoutSoppNetprice.value = 0;
			inoutSoppAmt.value = 0;
			inoutSoppVat.value = 0;
		}
	}

	soppInoutUpdateButtonSet(thisEle){
		let soppdataNo = thisEle.dataset.id;
		let inoutSoppListItem = document.getElementById("tabInoutSopp").querySelector(".tabInoutTableList").querySelectorAll(".inoutSoppListItem");
		let updateButton = document.getElementsByClassName("inoutSoppForm")[0].children[0].children[2];
		let nowDate = new Date();
		let thisStatus = thisEle.dataset.status;
		let setDatas;
		
		for(let i = 0; i < inoutSoppListItem.length; i++){
			let div = inoutSoppListItem[i].querySelectorAll("div");
			for(let t = 0; t < div.length; t++){
				let button = div[t].children[0];

				if(button !== undefined && button.className === "updateButton"){
					updateButton.style.display = "none";
					updateButton.removeAttribute("data-id");
					button.setAttribute("data-status", false);
					button.innerText = "수정";
					button.style.backgroundColor = "#6B66FF";
				}
			}
		}

		document.getElementById("inoutSoppDataType").value = "1101";
		document.getElementById("inoutSoppVatDate").value = nowDate.toISOString().substring(0, 10);
		document.getElementById("inoutSoppProductNo").removeAttribute("data-value");
		document.getElementById("inoutSoppProductNo").value = "";
		document.getElementById("inoutSoppCustNo").removeAttribute("data-value");
		document.getElementById("inoutSoppCustNo").value = "";
		document.getElementById("inoutSoppNetprice").value = 0;
		document.getElementById("inoutSoppQuanty").value = 1;
		document.getElementById("inoutSoppAmt").value = 0;
		document.getElementById("inoutSoppVat").value = 0;
		document.getElementById("inoutSoppTotal").value = 0;
		document.getElementById("inoutSoppRemark").value = "";
		thisEle.setAttribute("data-status", thisStatus);

		if(JSON.parse(thisEle.dataset.status)){
			updateButton.style.display = "none";
			updateButton.removeAttribute("data-id");
			thisEle.setAttribute("data-status", false);
			thisEle.innerText = "수정";
			thisEle.style.backgroundColor = "#6B66FF";
		}else{
			let productName, custName;
			updateButton.style.display = "block";
			updateButton.setAttribute("data-id", thisEle.dataset.id);
			thisEle.setAttribute("data-status", true);
			thisEle.innerText = "취소";
			thisEle.style.backgroundColor = "#353535";

			for(let i = 0; i < storage.soppInoutAllList.length; i++){
				let item = storage.soppInoutAllList[i];
				
				if(item.soppdataNo == soppdataNo){
					setDatas = item;
				}
			}

			document.getElementById("inoutSoppDataType").value = setDatas.dataType;
			document.getElementById("inoutSoppVatDate").value = setDatas.vatDate;
			
			if(!CommonDatas.emptyValuesCheck(setDatas.productNo)){
				document.getElementById("inoutSoppProductNo").dataset.value = setDatas.productNo;
				document.getElementById("inoutSoppProductNo").value = CommonDatas.getProductFind(setDatas.productNo, "name");
			}else{
				document.getElementById("inoutSoppProductNo").removeAttribute("data-value");
				document.getElementById("inoutSoppProductNo").value = "";
			}

			if(!CommonDatas.emptyValuesCheck(setDatas.salesCustNo)){
				document.getElementById("inoutSoppCustNo").dataset.value = setDatas.salesCustNo;
				document.getElementById("inoutSoppCustNo").value = storage.customer[setDatas.salesCustNo].custName;
			}else{
				document.getElementById("inoutSoppCustNo").removeAttribute("data-value");
				document.getElementById("inoutSoppCustNo").value = "";
			}

			document.getElementById("inoutSoppNetprice").value = setDatas.dataNetprice.toLocaleString("en-US");
			document.getElementById("inoutSoppQuanty").value = setDatas.dataQuanty;
			document.getElementById("inoutSoppAmt").value = setDatas.dataAmt.toLocaleString("en-US");
			document.getElementById("inoutSoppVat").value = setDatas.dataVat.toLocaleString("en-US");
			document.getElementById("inoutSoppTotal").value = setDatas.dataTotal.toLocaleString("en-US");
			document.getElementById("inoutSoppRemark").value = setDatas.dataRemark;
		}
	}
}

//영업기회 crud
class Sopp{
	constructor(getData){
		CommonDatas.Temps.sopp = this;

		if (getData !== undefined) {
			this.getData = getData;
			this.soppNo = getData.soppNo;
			this.compNo = getData.compNo;
			this.userNo = getData.userNo;
			this.custNo = getData.custNo;
			this.contNo = getData.contNo;
			this.custMemberNo = getData.custMemberNo;
			this.ptncNo = getData.ptncNo;
			this.ptncMemberNo = getData.ptncMemberNo;
			this.buyrNo = getData.buyrNo;
			this.buyrMemberNo = getData.buyrMemberNo;
			this.cntrctMth = getData.cntrctMth;
			this.soppTitle = getData.soppTitle;
			this.soppDesc = getData.soppDesc;
			this.soppTargetAmt = getData.soppTargetAmt;
			this.soppTargetDate = getData.soppTargetDate;
			this.maintenance_S = getData.maintenance_S;
			this.maintenance_E = getData.maintenance_E;
			this.soppType = getData.soppType;
			this.soppStatus = getData.soppStatus;
			this.soppSrate = getData.soppSrate;
			this.soppSource = getData.soppSource;
			this.sopp2Desc = getData.sopp2Desc;
			this.sopp2regDatetime = getData.sopp2regDatetime;
			this.businessType = getData.businessType;
			this.op_priority = getData.op_priority;
			this.regDatetime = getData.regDatetime;
			this.modDatetime = getData.modDatetime;
			this.attrib = getData.attrib;
			this.productNo = getData.productNo;
			this.maintenanceTarget = getData.maintenanceTarget;
			this.secondUserNo = getData.secondUserNo;
			this.categories = getData.categories;
		} else {
			this.soppNo = 0;
			this.compNo = 0;
			this.userNo = 0;
			this.custNo = 0;
			this.contNo = 0;
			this.custMemberNo = 0;
			this.ptncNo = 0;
			this.ptncMemberNo = 0;
			this.buyrNo = 0;
			this.buyrMemberNo = 0;
			this.cntrctMth = 0;
			this.soppTitle = "";
			this.soppDesc = "";
			this.soppTargetAmt = 0;
			this.soppTargetDate = "";
			this.maintenance_S = "";
			this.maintenance_E = "";
			this.soppType = 0;
			this.soppStatus = "";
			this.soppSrate = "";
			this.soppSource = 0;
			this.sopp2Desc = "";
			this.sopp2regDatetime = "";
			this.businessType = "";
			this.op_priority = "";
			this.regDatetime = "";
			this.modDatetime = "";
			this.attrib = "";
			this.productNo = 0;
			this.maintenanceTarget = "";
			this.secondUserNo = 0;
			this.categories = "";
		}
	}

	//영업기회 상세보기
	detail() {
		let html = "";
		let setDate, soppTargetDate, maintenance_S, maintenance_E, datas, dataArray, notIdArray, splitCategories;
		
		if(document.getElementById("rightDetailParent") !== null){
			document.getElementById("rightDetailParent").remove();
		}
		
		if(this.categories !== undefined){
			splitCategories = this.categories.split(",");

			for(let i = 0; i < splitCategories.length; i++){
				CommonDatas.makeCategories(splitCategories[i]);
			}
		}

		CommonDatas.detailSetFormList(this.getData);

		let gridList = document.getElementsByClassName("gridList")[0];
		let containerTitle = document.getElementById("containerTitle");
		let detailBackBtn = document.getElementsByClassName("detailBackBtn")[0];
		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let crudDeleteBtn = document.getElementsByClassName("crudDeleteBtn")[0];

		setDate = CommonDatas.dateDis(new Date(this.soppTargetDate).getTime());
		soppTargetDate = CommonDatas.dateFnc(setDate);

		setDate = CommonDatas.dateDis(new Date(this.maintenance_S).getTime());
		maintenance_S = CommonDatas.dateFnc(setDate);

		setDate = CommonDatas.dateDis(new Date(this.maintenance_E).getTime());
		maintenance_E = CommonDatas.dateFnc(setDate);

		notIdArray = ["userNo"];
		datas = ["userNo", "secondUserNo", "custNo", "cip", "buyrNo"];

		dataArray = [
			{
				"title": "담당자(*)",
				"elementId": "userNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.userNo)) ? "" : storage.user[this.userNo].userName,
			},
			{
				"title": "(부)담당자(*)",
				"elementId": "secondUserNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.secondUserNo)) ? "" : storage.user[this.secondUserNo].userName,
			},
			{
				"title": "매출처(*)",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.custNo)) ? "" : storage.customer[this.custNo].custName,
			},
			{
				"title": "매출처 담당자",
				"complete": "cip",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "custMemberNo",
				"value": (CommonDatas.emptyValuesCheck(this.custMemberNo)) ? "" : storage.cip[this.custMemberNo].name,
			},
			{
				"title": "엔드유저(*)",
				"elementId": "buyrNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.buyrNo)) ? "" : storage.customer[this.buyrNo].custName,
			},
			{
				"title": "진행단계(*)",
				"selectValue": [
					{
						"key": "10178",
						"value": "영업정보파악",
					},
					{
						"key": "10179",
						"value": "초기접촉",
					},
					{
						"key": "10180",
						"value": "제안서제출 및 PT",
					},
					{
						"key": "10181",
						"value": "견적서 제출",
					},
				],
				"type": "select",
				"elementId": "soppStatus",
			},
			{
				"title": "가능성",
				"elementId": "soppSrate",
				"value": (CommonDatas.emptyValuesCheck(this.soppSrate)) ? "" : this.soppSrate,
			},
			{
				"title": "계약구분(*)",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
					{
						"key": "10247",
						"value": "판매계약",
					},
					{
						"key": "10248",
						"value": "유지보수",
					},
					{
						"key": "10254",
						"value": "임대계약",
					},
				],
				"type": "select",
				"elementId": "cntrctMth",
				"onChange": "CommonDatas.Temps.soppSet.cntrctMthChange(this);",
			},
			{
				"title": "매출예정일",
				"elementId": "soppTargetDate",
				"type": "date",
				"value": soppTargetDate,
			},
			{
				"title": "판매방식(*)",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
					{
						"key": "10173",
						"value": "조달직판",
					},
					{
						"key": "10174",
						"value": "조달간판",
					},
					{
						"key": "10175",
						"value": "조달대행",
					},
					{
						"key": "10176",
						"value": "직접판매",
					},
					{
						"key": "10218",
						"value": "간접판매",
					},
					{
						"key": "10255",
						"value": "기타",
					},
				],
				"type": "select",
				"elementId": "soppType",
			},
			{
				"title": "예상매출액",
				"elementId": "soppTargetAmt",
				"keyup": "CommonDatas.inputNumberFormat(this);",
				"col": 2,
				"value": (CommonDatas.emptyValuesCheck(this.soppTargetAmt)) ? "" : this.soppTargetAmt.toLocaleString("en-US"),
			},
			{
				"title": "카테고리<br />(제품회사명)",
				"complete": "productCust",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
			},
			{
				"title": "카테고리 선택 시<br />자동 입력(*)",
				"elementId": "categories",
				"col": 2,
				"value": (CommonDatas.emptyValuesCheck(this.categories)) ? "" : this.categories,
			},
			{
				"title": "카테고리 삭제<br />선택 시 삭제",
				"selectValue": [
					{
						"key": "",
						"value": "선택",
					},
				],
				"type": "select",
			},
			{
				"title": "유지보수대상(*)",
				"selectValue": [
					{
						"key": "N",
						"value": "No",
					},
					{
						"key": "Y",
						"value": "Yes",
					},
				],
				"type": "select",
				"elementId": "maintenanceTarget",
				"col": 2,
			},
			{
				"title": "유지보수 시작일<br />유지보수 계약 시(*)",
				"elementId": "maintenance_S",
				"type": "date",
				"value": maintenance_S,
			},
			{
				"title": "유지보수 종료일<br />유지보수 계약 시(*)",
				"elementId": "maintenance_E",
				"type": "date",
				"value": maintenance_E,
			},
			{
				"title": "영업기회명(*)",
				"elementId": "soppTitle",
				"col": 4,
				"value": (CommonDatas.emptyValuesCheck(this.soppTitle)) ? "" : this.soppTitle,
			},
			{
				"title": "내용",
				"elementId": "soppDesc",
				"type": "textarea",
				"col": 4,
				"value": (CommonDatas.emptyValuesCheck(this.soppDesc)) ? "" : this.soppTitle,
			}
		];

		html = CommonDatas.detailViewForm(dataArray);
		let createGrid = document.createElement("div");
		createGrid.className = "defaultFormContainer";
		createGrid.innerHTML = html;
		gridList.after(createGrid);
		containerTitle.innerText = this.soppTitle;
		let hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
		let showArr = ["defaultFormContainer"];
		CommonDatas.setViewContents(hideArr, showArr);
	
		if(storage.my == this.getData.userNo){
			crudUpdateBtn.setAttribute("onclick", "CommonDatas.enableDisabled(this, \"CommonDatas.Temps.sopp.update();\", \"" + notIdArray + "\");");
			crudDeleteBtn.setAttribute("onclick", "CommonDatas.Temps.sopp.delete();");
			crudUpdateBtn.style.display = "flex";
			crudDeleteBtn.style.display = "flex";
		}else{
			crudUpdateBtn.style.display = "none";
			crudDeleteBtn.style.display = "none";
		}
	
		detailBackBtn.style.display = "flex";
		CommonDatas.detailTrueDatas(datas);

		let tabArrays = [
			{
				"text": "기본정보",
				"id": "tabDefaultPage",
				"key": "tabDefault",
				"class": "tabRadio",
				"onChange": "let soppSet = new SoppSet(); soppSet.detailRadioChange(this);",
			},
			{
				"text": "매입매출내역",
				"id": "tabInoutSoppPage",
				"key": "tabInoutSopp",
				"class": "tabRadio",
				"onChange": "let soppSet = new SoppSet(); soppSet.detailRadioChange(this);",
			},
			{
				"text": "견적내역",
				"id": "tabEstimatePage",
				"key": "tabEstimate",
				"class": "tabRadio",
				"onChange": "let soppSet = new SoppSet(); soppSet.detailRadioChange(this);",
			},
			{
				"text": "파일첨부",
				"id": "tabFileUploadPage",
				"key": "tabFileUpload",
				"class": "tabRadio",
				"onChange": "let soppSet = new SoppSet(); soppSet.detailRadioChange(this);",
			},
			{
				"text": "기술지원내역",
				"id": "tabTechPage",
				"key": "tabTech",
				"class": "tabRadio",
				"onChange": "let soppSet = new SoppSet(); soppSet.detailRadioChange(this);",
			},
			{
				"text": "영업활동내역",
				"id": "tabSalesPage",
				"key": "tabSales",
				"class": "tabRadio",
				"onChange": "let soppSet = new SoppSet(); soppSet.detailRadioChange(this);",
			}
		];

		CommonDatas.setDetailTabs(tabArrays);
	
		setTimeout(() => {
			let categories = document.getElementById("categories");
			let categorySelect = categories.parentElement.parentElement.nextElementSibling.children[1].children[0];

			if(this.categories !== undefined){
				CommonDatas.makeCategoryOptions(categorySelect, "categories");
			}
			
			document.getElementById("soppStatus").value = this.soppStatus;
			document.getElementById("cntrctMth").value = this.cntrctMth;
			document.getElementById("soppType").value = this.soppType;
			ckeditor.config.readOnly = true;
			window.setTimeout(setEditor, 100);
		}, 200);

		setTimeout(() => {
			let soppSet = new SoppSet();
			soppSet.drawInoutForm();
			soppSet.drawInoutSoppList();
			soppSet.drawInoutContList();
			soppSet.drawSoppFileUpload();
			soppSet.drawSoppTechList();
			soppSet.drawSoppSalesList();
			soppSet.inoutTotalSet();
		}, 700);
	}

	//영업기회 등록
	insert(){
		let cntrctMth = document.getElementById("cntrctMth");

		if(document.getElementById("secondUserNo").value === ""){
			msg.set("부담당자를 선택해주세요.");
			document.getElementById("secondUserNo").focus();
			return false;
		} else if(document.getElementById("secondUserNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("secondUserNo").value, "user")){
			msg.set("조회된 부담당자가 없습니다.\n다시 확인해주세요.");
			document.getElementById("secondUserNo").focus();
			return false;
		} else if(document.getElementById("custNo").value === ""){
			msg.set("매출처를 선택해주세요.");
			document.getElementById("custNo").focus();
			return false;
		} else if(document.getElementById("custNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("custNo").value, "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			document.getElementById("custNo").focus();
			return false;
		} else if(document.getElementById("buyrNo").value === ""){
			msg.set("엔드유저를 입력해주세요.");
			document.getElementById("buyrNo").focus();
			return false;
		} else if(document.getElementById("buyrNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("buyrNo").value, "customer")){
			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
			document.getElementById("buyrNo").focus();
			return false;
		} else if(cntrctMth.value === ""){
			msg.set("계약구분을 선택해주세요.");
			return false;
		} else if(document.getElementById("soppType").value === ""){
			msg.set("판매방식을 선택해주세요.");
			return false;
		} else if(document.getElementById("categories").value === ""){
			msg.set("카테고리(제품회사명)를 선택해주세요.");
			return false;
		} else if(cntrctMth.value === "10248" && (document.getElementById("maintenance_S").value === "" || document.getElementById("maintenance_E").value === "")){
			msg.set("계약구분이 유지보수일 경우 유지보수 시작일과 유지보수 종료일을 선택하여야 합니다.\n유지보수 시작일과 종료일을 선택해주세요.");
			return false;
		} else if(document.getElementById("soppTitle").value === ""){
			msg.set("영업기회명을 입력해주세요.");
			document.getElementById("soppTitle").focus();
			return false;
		} else{
			CommonDatas.formDataSet();
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.post("/api/sopp", data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("등록되었습니다.");
				} else {
					msg.set("등록 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//영업기회 파일 등록
	soppFileInsert(){
		let formData = new FormData();
		let soppFileUpload = document.getElementById("soppFileUpload");
		let soppFileUploadDesc = CKEDITOR.instances["soppFileUploadDesc"].getData().replaceAll("\n", "");
		let files = soppFileUpload.files;
		let fileArrays = Array.prototype.slice.call(files);

		if(fileArrays.length < 1){
			msg.set("파일을 선택해주세요.");
			return false;
		}else{
			formData.append("file", fileArrays[0]);
			formData.append("fileDesc", soppFileUploadDesc);
			formData.append("fileExtention", fileArrays[0].type);
			formData.append("soppNo", storage.formList.soppNo);
			formData.append("userNo", storage.my);
	
			axios.post("/api/sopp/soppFileInsert", formData).then((response) => {
				if (response.data.result === "ok") {
					msg.set("등록되었습니다.");
					let soppSet = new SoppSet();
					modal.hide();
					soppSet.soppDetailFileListSet(storage.formList.soppNo);
	
					setTimeout(() => {
						soppSet.drawSoppFileUpload();
						soppSet.detailRadioChange();
					}, 1200);
				} else {
					msg.set("등록 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}


		// if(document.getElementById("soppFileUpload").value === ""){
		// 	msg.set("부담당자를 선택해주세요.");
		// 	document.getElementById("soppFileUpload").focus();
		// 	return false;
		// } else if(document.getElementById("secondUserNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("secondUserNo").value, "user")){
		// 	msg.set("조회된 부담당자가 없습니다.\n다시 확인해주세요.");
		// 	document.getElementById("secondUserNo").focus();
		// 	return false;
		// } else{
		// 	CommonDatas.formDataSet();
		// 	let data = storage.formList;
		// 	data = JSON.stringify(data);
		// 	data = cipher.encAes(data);

		// 	axios.post("/api/sopp", data, {
		// 		headers: { "Content-Type": "text/plain" }
		// 	}).then((response) => {
		// 		if (response.data.result === "ok") {
		// 			location.reload();
		// 			msg.set("등록되었습니다.");
		// 		} else {
		// 			msg.set("등록 중 에러가 발생하였습니다.");
		// 			return false;
		// 		}
		// 	}).catch((error) => {
		// 		msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
		// 		console.log(error);
		// 		return false;
		// 	});
		// }
	}

	//영업기회 수정
	update() {
		if(document.getElementById("secondUserNo").value === ""){
			msg.set("부담당자를 선택해주세요.");
			document.getElementById("secondUserNo").focus();
			return false;
		} else if(document.getElementById("secondUserNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("secondUserNo").value, "user")){
			msg.set("조회된 부담당자가 없습니다.\n다시 확인해주세요.");
			document.getElementById("secondUserNo").focus();
			return false;
		} else if(document.getElementById("custNo").value === ""){
			msg.set("매출처를 선택해주세요.");
			document.getElementById("custNo").focus();
			return false;
		} else if(document.getElementById("custNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("custNo").value, "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			document.getElementById("custNo").focus();
			return false;
		} else if(document.getElementById("buyrNo").value === ""){
			msg.set("엔드유저를 입력해주세요.");
			document.getElementById("buyrNo").focus();
			return false;
		} else if(document.getElementById("buyrNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("buyrNo").value, "customer")){
			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
			document.getElementById("buyrNo").focus();
			return false;
		} else if(cntrctMth.value === ""){
			msg.set("계약구분을 선택해주세요.");
			return false;
		} else if(document.getElementById("soppType").value === ""){
			msg.set("판매방식을 선택해주세요.");
			return false;
		} else if(document.getElementById("categories").value === ""){
			msg.set("카테고리(제품회사명)를 선택해주세요.");
			return false;
		} else if(cntrctMth.value === "10248" && (document.getElementById("maintenance_S").value === "" || document.getElementById("maintenance_E").value === "")){
			msg.set("계약구분이 유지보수일 경우 유지보수 시작일과 유지보수 종료일을 선택하여야 합니다.\n유지보수 시작일과 종료일을 선택해주세요.");
			return false;
		} else if(document.getElementById("soppTitle").value === ""){
			msg.set("영업기회명을 입력해주세요.");
			document.getElementById("soppTitle").focus();
			return false;
		} else {
			CommonDatas.formDataSet();
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.put("/api/sopp/" + data.soppNo, data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("수정되었습니다.");
				} else {
					msg.set("수정 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("수정 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//영업기회 삭제
	delete() {
		if (confirm("정말로 삭제하시겠습니까??")) {
			axios.delete("/api/sopp/" + storage.formList.soppNo, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("삭제되었습니다.");
				} else {
					msg.set("삭제 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("삭제 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		} else {
			return false;
		}
	}

	//영업기회 파일 삭제 함수
	soppFileDelete(){
		if(confirm("선택한 파일들을 삭제하시겠습니까??")){
			let soppFileCheck = document.getElementsByClassName("soppFileCheck");
	
			for(let i = 0; i < soppFileCheck.length; i++){
				let item = soppFileCheck[i];

				if(item.checked){
					axios.delete("/api/sopp/soppFileDelete/" + item.dataset.id, {
						headers: { "Content-Type": "text/plain" }
					}).then((response) => {
						if (response.data.result !== "ok") {
							msg.set("삭제 중 에러가 발생하였습니다.");
							return false;
						}
					}).catch((error) => {
						msg.set("삭제 도중 에러가 발생하였습니다.\n" + error);
						console.log(error);
						return false;
					});
				}

				if(i == (soppFileCheck.length - 1)){
					let soppSet = new SoppSet();

					setTimeout(() => {
						soppSet.soppDetailFileListSet(storage.formList.soppNo);
					}, 500);
			
					setTimeout(() => {
						soppSet.drawSoppFileUpload();
						soppSet.detailRadioChange();
						msg.set("삭제 되었습니다.");
					}, 1200);
				}
			}

		}else{
			return false;
		}
	}

	//영업기회 파일 다운로드 함수
	soppDownloadFile(thisEle) {
		let soppNo = storage.formList.soppNo;
		let fileId = thisEle.dataset.id;

		axios({
			method: "POST",
			url: "/api/sopp/downloadFile",
			params: {
				"soppNo": soppNo,
				"fileId": fileId,
			},
			responseType: "blob",
		}).then((response) => {
			let link = document.createElement('a');
			link.href = window.URL.createObjectURL(response.data);
			link.download = thisEle.innerText;
			link.click();
		}).catch((error) => {
			msg.set("다운로드 도중 에러가 발생하였습니다.\n" + error);
			console.log(error);
			return false;
		});
	}

	//영업기회 매입매출 단일 추가 함수
	soppInoutSingleInsert(){
		if(document.getElementById("inoutSoppVatDate").value === ""){
			msg.set("거래일자를 선택해주세요.");
			return false;
		} else if(document.getElementById("inoutSoppProductNo").value === ""){
			msg.set("상품을 선택해주세요.");
			document.getElementById("inoutSoppProductNo").focus();
			return false;
		} else if(document.getElementById("inoutSoppProductNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("inoutSoppProductNo").value, "product")){
			msg.set("조회된 상품이 없습니다.\n다시 확인해주세요.");
			document.getElementById("inoutSoppProductNo").focus();
			return false;
		} else{
			let datas = {};
			datas.soppNo = storage.formList.soppNo;
			datas.userNo = storage.my;
			datas.catNo = 100001;
			datas.productNo = document.getElementById("inoutSoppProductNo").dataset.value;
			datas.salesCustNo = document.getElementById("inoutSoppCustNo").dataset.value;
			datas.dataTitle = document.getElementById("inoutSoppProductNo").value;
			datas.dataType = document.getElementById("inoutSoppDataType").value;
			datas.dataQuanty = document.getElementById("inoutSoppQuanty").value;
			datas.dataAmt = parseInt(document.getElementById("inoutSoppAmt").value.replace(/,/g, ""));
			datas.dataDiscount = 0;
			datas.dataNetprice = parseInt(document.getElementById("inoutSoppNetprice").value.replace(/,/g, ""));
			datas.dataVat = parseInt(document.getElementById("inoutSoppVat").value.replace(/,/g, ""));
			datas.dataTotal = parseInt(document.getElementById("inoutSoppTotal").value.replace(/,/g, ""));
			datas.vatDate = document.getElementById("inoutSoppVatDate").value;
			datas.dataRemark = document.getElementById("inoutSoppRemark").value;
			datas.contNo = 100;
			datas = JSON.stringify(datas);
			datas = cipher.encAes(datas);

			axios.post("/api/sopp/soppInoutSingleInsert", datas, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					let soppSet = new SoppSet();
					soppSet.soppDetailInoutSet(storage.formList.soppNo);
					
					setTimeout(() => {
						soppSet.drawInoutForm();
						soppSet.drawInoutSoppList();
						soppSet.drawInoutContList();
						soppSet.inoutTotalSet();
						soppSet.detailRadioChange();
						msg.set("등록되었습니다.");
					}, 300);
				} else {
					msg.set("등록 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//영업기회 매입매출 선택삭제 함수
	soppInoutCheckDelete(){
		if(confirm("선택하신 내역들을 삭제하시겠습니까??")){
			let inoutSoppListItem = document.getElementById("tabInoutSopp").children[1].querySelectorAll(".inoutSoppListItem");
	
			for(let i = 0; i < inoutSoppListItem.length; i++){
				let item = inoutSoppListItem[i];
				let checkbox = item.children[0].children[0];
	
				if(checkbox.checked){
					axios.delete("/api/sopp/soppInoutCheckDelete/" + checkbox.dataset.id, {
						headers: { "Content-Type": "text/plain" }
					}).then((response) => {
						if (response.data.result !== "ok") {
							msg.set("삭제 중 에러가 발생하였습니다.");
							return false;
						}
					}).catch((error) => {
						msg.set("삭제 도중 에러가 발생하였습니다.\n" + error);
						console.log(error);
						return false;
					});
				}

				if(i == (inoutSoppListItem.length - 1)){
					let soppSet = new SoppSet();

					setTimeout(() => {
						soppSet.soppDetailInoutSet(storage.formList.soppNo);
					}, 500);
			
					setTimeout(() => {
						soppSet.drawInoutForm();
						soppSet.drawInoutSoppList();
						soppSet.drawInoutContList();
						soppSet.inoutTotalSet();
						soppSet.detailRadioChange();
						msg.set("삭제되었습니다.");
					}, 1200);
				}
			}
		}else{
			return false;
		}
	}

	//영업기회 매입매출 분할추가 함수
	soppInoutDivisionInsert(){
		if(confirm("분할추가를 진행하시겠습니까??")){
			if(document.getElementById("inoutSoppVatDate").value === ""){
				msg.set("거래일자를 선택해주세요.");
				return false;
			} else if(document.getElementById("inoutSoppProductNo").value === ""){
				msg.set("상품을 선택해주세요.");
				document.getElementById("inoutSoppProductNo").focus();
				return false;
			} else if(document.getElementById("inoutSoppProductNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("inoutSoppProductNo").value, "product")){
				msg.set("조회된 상품이 없습니다.\n다시 확인해주세요.");
				document.getElementById("inoutSoppProductNo").focus();
				return false;
			} else{
				let inoutSoppDivisionNum = document.getElementById("inoutSoppDivisionNum");
				let inoutSoppDivisionMonth = document.getElementById("inoutSoppDivisionMonth");
				let inoutSoppDivisionContAmt = document.getElementById("inoutSoppDivisionContAmt");
				let divisionTotal = Math.round(inoutSoppDivisionContAmt.value.replace(/,/g, "") / inoutSoppDivisionNum.value);
				let divisionAmt = Math.round(divisionTotal / 11 * 10);
				let divisionVat = Math.round(divisionTotal / 11);
				let divisionNet = Math.round(divisionTotal / 11 * 10 / 1);
	
				for(let i = 0; i < inoutSoppDivisionNum.value; i++){
					let datas = {};
		
					datas.soppNo = storage.formList.soppNo;
					datas.catNo = 100001;
					datas.salesCustNo = document.getElementById("inoutSoppCustNo").dataset.value;
					datas.productNo = document.getElementById("inoutSoppProductNo").dataset.value;
					datas.dataTitle = document.getElementById("inoutSoppProductNo").value;
					datas.dataType = document.getElementById("inoutSoppDataType").value;
					datas.dataQuanty = document.getElementById("inoutSoppQuanty").value;
					datas.dataAmt = divisionAmt;
					datas.dataVat = divisionVat;
					datas.dataTotal = divisionTotal;
					datas.dataNetprice = divisionNet;
					datas.dataRemark = document.getElementById("inoutSoppRemark").value;
					datas.divisionMonth = inoutSoppDivisionMonth.value;
					datas.userNo = storage.my;
	
					if(i == 0){
						datas.vatDate = document.getElementById("inoutSoppVatDate").value
					}else{
						let dateSet = new Date(document.getElementById("inoutSoppVatDate").value);
						dateSet.setMonth(dateSet.getMonth() + parseInt(parseInt(i) * parseInt(inoutSoppDivisionMonth.value)));
						let getDate = dateSet.toISOString();
						datas.vatDate = getDate.substring(0, 10);
					}
	
					datas.contNo = 100;
					datas = JSON.stringify(datas);
					datas = cipher.encAes(datas);
	
					axios.post("/api/sopp/soppInoutDivisionInsert", datas, {
						headers: { "Content-Type": "text/plain" }
					}).then((response) => {
						if (response.data.result !== "ok") {
							msg.set("등록 중 에러가 발생하였습니다.");
							return false;
						}
					}).catch((error) => {
						msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
						console.log(error);
						return false;
					});

					if(i == (inoutSoppDivisionNum.value - 1)){
						let soppSet = new SoppSet();

						setTimeout(() => {
							soppSet.soppDetailInoutSet(storage.formList.soppNo);
						}, 500);
				
						setTimeout(() => {
							soppSet.drawInoutForm();
							soppSet.drawInoutSoppList();
							soppSet.drawInoutContList();
							soppSet.inoutTotalSet();
							soppSet.detailRadioChange();
							msg.set("등록되었습니다.");
						}, 1200);
					}
				}
			}
		}
	}

	assignUpdate(thisEle){
		let contSelect = thisEle.parentElement.previousElementSibling.children[0];

		if(contSelect.value === ""){
			msg.set("할당 계약을 선택해주세요.");
			return false;
		}else{
			if(confirm("선택하신 계약[" + contSelect.options[contSelect.options.selectedIndex].innerText + "]에 할당하시겠습니까??")){
				let datas = {};
				datas.contNo = contSelect.value;
				datas.soppdataNo = thisEle.dataset.id;
				datas = JSON.stringify(datas);
				datas = cipher.encAes(datas);
	
				axios.put("/api/sopp/assignUpdate", datas, {
					headers: { "Content-Type": "text/plain" }
				}).then((response) => {
					if (response.data.result === "ok") {
						let soppSet = new SoppSet();
						soppSet.soppDetailInoutSet(storage.formList.soppNo);
		
						setTimeout(() => {
							soppSet.drawInoutForm();
							soppSet.drawInoutSoppList();
							soppSet.drawInoutContList();
							soppSet.inoutTotalSet();
							soppSet.detailRadioChange();
							msg.set("할당되었습니다.");
						}, 500);
					}
				}).catch((error) => {
					msg.set("할당 도중 에러가 발생하였습니다.\n" + error);
					console.log(error);
					return false;
				})
			}
		}
	}

	soppInoutUpdate(thisEle){
		if(document.getElementById("inoutSoppVatDate").value === ""){
			msg.set("거래일자를 선택해주세요.");
			return false;
		} else if(document.getElementById("inoutSoppProductNo").value === ""){
			msg.set("상품을 선택해주세요.");
			document.getElementById("inoutSoppProductNo").focus();
			return false;
		} else if(document.getElementById("inoutSoppProductNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("inoutSoppProductNo").value, "product")){
			msg.set("조회된 상품이 없습니다.\n다시 확인해주세요.");
			document.getElementById("inoutSoppProductNo").focus();
			return false;
		} else{
			let datas = {};
			datas.soppdataNo = thisEle.dataset.id;
			datas.userNo = storage.my;
			datas.productNo = document.getElementById("inoutSoppProductNo").dataset.value;
			datas.salesCustNo = document.getElementById("inoutSoppCustNo").dataset.value;
			datas.dataTitle = document.getElementById("inoutSoppProductNo").value;
			datas.dataType = document.getElementById("inoutSoppDataType").value;
			datas.dataQuanty = document.getElementById("inoutSoppQuanty").value;
			datas.dataAmt = parseInt(document.getElementById("inoutSoppAmt").value.replace(/,/g, ""));
			datas.dataNetprice = parseInt(document.getElementById("inoutSoppNetprice").value.replace(/,/g, ""));
			datas.dataVat = parseInt(document.getElementById("inoutSoppVat").value.replace(/,/g, ""));
			datas.dataTotal = parseInt(document.getElementById("inoutSoppTotal").value.replace(/,/g, ""));
			datas.vatDate = document.getElementById("inoutSoppVatDate").value;
			datas.dataRemark = document.getElementById("inoutSoppRemark").value;
			datas = JSON.stringify(datas);
			datas = cipher.encAes(datas);

			axios.put("/api/sopp/soppInoutUpdate", datas, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					let soppSet = new SoppSet();
					soppSet.soppDetailInoutSet(storage.formList.soppNo);
					
					setTimeout(() => {
						soppSet.drawInoutForm();
						soppSet.drawInoutSoppList();
						soppSet.drawInoutContList();
						soppSet.inoutTotalSet();
						soppSet.detailRadioChange();
						msg.set("수정 되었습니다.");
					}, 300);
				} else {
					msg.set("수정 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("수정 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}
}


//일정관리 시작
//일정관리 셋팅 함수
class ScheduleSet{
	constructor(){
		CommonDatas.Temps.scheduleSet = this;
	}

	//달력 리스트
	calendarList(searchDatas) {
		let dataResult = {};

		if(!CommonDatas.emptyValuesCheck(searchDatas)){
			searchDatas = JSON.parse(searchDatas);
			
			for(let key in searchDatas[0]){
				dataResult[key] = searchDatas[0][key];
			}
		}

		axios({
			method: "get",
			url: "/api/schedule/calendar",
			params: dataResult,
		}).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.calendarList = [];
				storage.calendarUser = storage.my;

				for(let i = 0; i < result.length; i++){
					let item = result[i];
					if(storage.calendarUser == item.userNo){
						let setDatas = {
							"no": item.no,
							"title": item.title,
							"start": item.schedFrom,
							"end": item.schedTo,
							"schedType": item.schedType
						}
	
						storage.calendarList.push(setDatas);
					}else{
						if(!CommonDatas.emptyValuesCheck(searchDatas)){
							let setDatas = {
								"no": item.no,
								"title": item.title,
								"start": item.schedFrom,
								"end": item.schedTo,
								"schedType": item.schedType
							}
		
							storage.calendarList.push(setDatas);
						}
					}
				}

				if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.sopp === undefined) {
					window.setTimeout(this.drawCalendarList, 1000);
					window.setTimeout(CommonDatas.searchListSet("calendarList"), 1000);
				} else {
					window.setTimeout(this.drawCalendarList, 200);
					window.setTimeout(CommonDatas.searchListSet("calendarList"), 200);
				}

				$('.theme-loader').delay(1000).fadeOut("slow");
			}
		}).catch((error) => {
			msg.set("달력 리스트 에러입니다.\n" + error);
			console.log(error);
		})
	}
	
	//달력 리스트 출력 함수
	drawCalendarList() {
		let calendarEl = document.getElementById('calendar');
		let calendar = new FullCalendar.Calendar(calendarEl, {
			headerToolbar: {
				// left: 'dayGridMonth,timeGridWeek',
				left: '',
				center: 'title',
				right: 'today prev,next',
			},
			locale: "ko",
			navLinks: true,
			selectable: true,
			selectMirror: true,
			displayEventTime: false,
			select: function(arg) {
				let endDate = new Date(arg.endStr + "T18:00:00.000Z");
				arg.end = new Date(endDate.setDate(endDate.getDate() - 1));
				arg.endStr = arg.end.toISOString().substring(0, 10);
				storage.calendarSelectArg = arg;
				
				let salesSet = new SalesSet();
				salesSet.salesInsertForm();
				CommonDatas.Temps.scheduleSet.addModalFirstRadio();
				// let title = prompt('Event Title:');
				// if (title) {
				// 	calendar.addEvent({
				// 		title: title,
				// 		start: arg.start,
				// 		end: arg.end,
				// 		allDay: arg.allDay
				// 	})
				// }
				// calendar.unselect()
			},
			eventClick: function(arg) {
				if(arg.event._def.extendedProps.schedType == 10165){
					CommonDatas.Temps.scheduleSet.calendarSalesDetailView(arg.event._def.extendedProps.no);
				}else if(arg.event._def.extendedProps.schedType == 10168 || arg.event._def.extendedProps.schedType == 10262){
					CommonDatas.Temps.scheduleSet.calendarSchedDetailView(arg.event._def.extendedProps.no);
				}else{
					CommonDatas.Temps.scheduleSet.calendarTechDetailView(arg.event._def.extendedProps.no);
				}
			},
			editable: true,
			dayMaxEvents: true,
			events: storage.calendarList,
		});

		calendar.render();
		document.getElementById("multiSearchBtn").setAttribute("onclick", "CommonDatas.Temps.scheduleSet.searchSetItem(\"calendar\");");
	}

	//일정조회 리스트 저장 함수
	list(searchDatas) {
		let dataResult = {};

		if(!CommonDatas.emptyValuesCheck(searchDatas)){
			searchDatas = JSON.parse(searchDatas);
			
			for(let key in searchDatas[0]){
				dataResult[key] = searchDatas[0][key];
			}
		}

		axios({
			method: "get",
			url: "/api/schedule/calendar",
			params: dataResult,
		}).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.scheduleList = result;

				if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.sopp === undefined) {
					window.setTimeout(this.drawScheduleList, 1000);
					window.setTimeout(CommonDatas.searchListSet("scheduleList"), 1000);
				} else {
					window.setTimeout(this.drawScheduleList, 200);
					window.setTimeout(CommonDatas.searchListSet("scheduleList"), 200);
				}

				$('.theme-loader').delay(1000).fadeOut("slow");
			}
		}).catch((error) => {
			msg.set("일정조회 리스트 에러입니다.\n" + error);
			console.log(error);
		})
	}

	//일정조회 리스트 출력 함수
	drawScheduleList() {
		let container, result, jsonData, containerTitle, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [], pageContainer, hideArr, showArr, schedFrom, schedTo;

		if (storage.scheduleList === undefined) {
			msg.set("등록된 일정조회가 없습니다");
		}
		else {
			if (storage.searchDatas === undefined) {
				jsonData = storage.scheduleList.sort(function(a, b){return new Date(b.regDatetime).getTime() - new Date(a.regDatetime).getTime();});
			} else {
				jsonData = storage.searchDatas.sort(function(a, b){return new Date(b.regDatetime).getTime() - new Date(a.regDatetime).getTime();});
			}
		}

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		containerTitle = document.getElementById("containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer")[0];
		container = document.getElementsByClassName("gridList")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn", "contractReqBtn"];
		showArr = [
			{ element: "gridList", display: "block" },
			{ element: "pageContainer", display: "flex" },
			{ element: "searchContainer", display: "block" },
			{ element: "listRange", display: "flex" },
			{ element: "listSearchInput", display: "flex" },
			{ element: "crudBtns", display: "flex" },
			{ element: "crudAddBtn", display: "flex" },
		];

		header = [
			{
				"title": "등록일",
				"align": "center",
			},
			{
				"title": "일정구분",
				"align": "center",
			},
			{
				"title": "일정제목",
				"align": "center",
			},
			{
				"title": "일정시작일",
				"align": "center",
			},
			{
				"title": "일정종료일",
				"align": "center",
			},
			{
				"title": "고객사",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
			{
				"title": "장소",
				"align": "center",
			},
			{
				"title": "활동형태",
				"align": "center",
			},
			{
				"title": "일정설명",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 10,
				},
			];

			data.push(str);
		} else {
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				let schedType = ""; 
				
				if(jsonData[i].schedType == 10165) {
					schedType = "영업활동";
					fnc.push("let salesSet = new SalesSet(); salesSet.salesDetailView(this)");
				} else if(jsonData[i].schedType == 10168 || jsonData[i].schedType == 10262) {
					schedType = "기타일정";
					fnc.push("let scheduleSet = new ScheduleSet(); scheduleSet.schedDetailView(this)");
				} else {
					schedType = "기술일정";
					fnc.push("let techSet = new TechSet(); techSet.techDetailView(this)");
				}
				
				disDate = CommonDatas.dateDis(new Date(jsonData[i].regDatetime).getTime(), new Date(jsonData[i].modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				disDate = CommonDatas.dateDis(new Date(jsonData[i].schedFrom).getTime());
				schedFrom = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				disDate = CommonDatas.dateDis(new Date(jsonData[i].schedTo).getTime());
				schedTo = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": schedType,
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": schedFrom,
						"align": "center",
					},
					{
						"setData": schedTo,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].custNo)) ? "" : storage.customer[jsonData[i].custNo].custName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].userNo)) ? "" : storage.user[jsonData[i].userNo].userName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].place)) ? "" : jsonData[i].place,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].type)) ? "" : storage.code.etc[jsonData[i].type],
						"align": "center",
					},
					{
						"setData": jsonData[i].desc,
						"align": "left",
					},
				];

				ids.push(jsonData[i].no);
				data.push(str);
			}

			let pageNation = CommonDatas.createPaging(pageContainer, result[3], "CommonDatas.pageMove", "CommonDatas.Temps.scheduleSet.drawScheduleList", result[0]);
			pageContainer.innerHTML = pageNation;
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		CommonDatas.setViewContents(hideArr, showArr);
		document.getElementById("multiSearchBtn").setAttribute("onclick", "CommonDatas.Temps.scheduleSet.searchSetItem(\"list\");");
		containerTitle.innerText = "일정조회";

		let path = location.pathname.split("/");

		if (path[3] !== undefined && jsonData !== null) {
			let content = document.querySelector(".gridContent[data-id=\"" + path[3] + "\"]");
			CommonDatas.Temps.salesSet.salesDetailView(content);
		}
	}

	//기타일정 등록 폼
	scheduleInsertForm(){
		let html, dataArray;

		dataArray = [
			{
				"title": "활동시작일(*)",
				"elementId": "schedFrom",
				"type": "datetime",
				"disabled": false,
				"col": 2,
			},
			{
				"title": "활동종료일(*)",
				"elementId": "schedTo",
				"type": "datetime",
				"disabled": false,
				"col": 2,
			},
			{
				"title": "담당자(*)",
				"elementId": "userNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.userNo)) ? "" : storage.user[this.userNo].userName,
			},
			{
				"title": "활동형태(*)",
				"selectValue": [
					{
						"key": "10170",
						"value": "회사방문",
					},
					{
						"key": "10171",
						"value": "기술지원",
					},
					{
						"key": "10221",
						"value": "제품설명",
					},
					{
						"key": "10222",
						"value": "시스템데모",
					},
					{
						"key": "10223",
						"value": "제품견적",
					},
					{
						"key": "10224",
						"value": "계약건 의사결정지원",
					},
					{
						"key": "10225",
						"value": "계약",
					},
					{
						"key": "10226",
						"value": "사후처리",
					},
					{
						"key": "10227",
						"value": "기타",
					},
					{
						"key": "10228",
						"value": "협력사요청",
					},
					{
						"key": "10229",
						"value": "협력사문의",
					},
					{
						"key": "10230",
						"value": "교육",
					},
					{
						"key": "10231",
						"value": "전화상담",
					},
					{
						"key": "10232",
						"value": "제조사업무협의",
					},
					{
						"key": "10233",
						"value": "외부출장",
					},
					{
						"key": "10234",
						"value": "제안설명회",
					}
				],
				"type": "select",
				"elementId": "type",
				"disabled": false,
			},
			{
				"title": "장소",
				"elementId": "schedPlace",
				"disabled": false,
				"col": 2,
			},
			{
				"title": "영업기회",
				"elementId": "soppNo",
				"complete": "sopp",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
				"col": 2,
			},
			{
				"title": "매출처",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
				"col": 2,
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"col": 4,
				"disabled": false,
			},
			{
				"title": "내용",
				"elementId": "desc",
				"type": "textarea",
				"col": 4,
				"disabled": false,
			}
		];
	
		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70vw";
		modal.content.style.maxWidth = "70vw";
		modal.headTitle.innerText = "기타일정등록";
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.innerText = "등록";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "const schedule = new Schedule(); schedule.insert();");
		modal.close.setAttribute("onclick", "modal.hide();");

		storage.formList = {
			"userNo": storage.my,
			"compNo": 0,
			"soppNo": 0,
			"custNo": 0,
			"schedFrom": "",
			"schedTo": "",
			"title": "",
			"desc": "",
			"schedType": 0,
			"schedPlace": "",
			"type": 0,
			"regDatetime": "",
			"modDatetime": "",
		};
		
		setTimeout(() => {
			if(storage.calendarSelectArg === undefined){
				let nowDate = new Date();
				document.getElementById("schedFrom").value = nowDate.toISOString().substring(0, 10) + "T09:00:00";
				document.getElementById("schedTo").value = nowDate.toISOString().substring(0, 10) + "T18:00:00";
			}
			document.getElementById("userNo").value = storage.user[storage.my].userName;
			document.getElementById("userNo").setAttribute("data-change", true);
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//영업활동 상세 호출 함수
	calendarSalesDetailView(no) {
		axios.get("/api/sales/" + no).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				let schedule = new Schedule(result);
				schedule.calendarSalesDetail();
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//기타일정 상세 호출 함수
	schedDetailView(e) {
		let thisEle = e;
		
		axios.get("/api/schedule/" + thisEle.dataset.id).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				let schedule = new Schedule(result);
				schedule.scheduleDetail();

				localStorage.setItem("loadSetPage", window.location.pathname);
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//기타일정 상세(모달) 호출 함수
	calendarSchedDetailView(no) {
		axios.get("/api/schedule/" + no).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				let schedule = new Schedule(result);
				schedule.calendarScheduleDetail();
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//기술지원 상세 호출 함수
	calendarTechDetailView(no) {
		axios.get("/api/tech/" + no).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				let schedule = new Schedule(result);
				schedule.calendarTechDetail();
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	addModalFirstRadio(){
		let modalBody = document.getElementsByClassName("modalBody")[0];
		let createDiv = document.createElement("div");
		createDiv.className = "modalSelectRadio";
		createDiv.innerHTML = "<label><input type=\"radio\" name=\"modalSelectRadio\" value=\"sales\" onChange=\"CommonDatas.Temps.scheduleSet.modalChangeRadio(this);\" />영업활동</label>"
		+ "<label><input type=\"radio\" name=\"modalSelectRadio\"  value=\"tech\" onChange=\"CommonDatas.Temps.scheduleSet.modalChangeRadio(this);\" />기술지원</label>"
		+ "<label><input type=\"radio\" name=\"modalSelectRadio\"  value=\"schedule\" onChange=\"CommonDatas.Temps.scheduleSet.modalChangeRadio(this);\" />기타일정</label>"
		modalBody.prepend(createDiv);

		if(localStorage.getItem("selectValue") === "sales" || localStorage.getItem("selectValue") === null){
			document.querySelector("[name=\"modalSelectRadio\"][value=\"sales\"]").setAttribute("checked", true);
		}else if(localStorage.getItem("selectValue") === "tech"){
			document.querySelector("[name=\"modalSelectRadio\"][value=\"tech\"]").setAttribute("checked", true);
		}else{
			document.querySelector("[name=\"modalSelectRadio\"][value=\"schedule\"]").setAttribute("checked", true);
		}

		localStorage.removeItem("selectValue");

		setTimeout(() => {
			document.getElementById("schedFrom").value = storage.calendarSelectArg.startStr + "T09:00:00";
			document.getElementById("schedTo").value = storage.calendarSelectArg.endStr + "T18:00:00";
		}, 300);
	}

	modalChangeRadio(thisEle){
		if(thisEle.value === "sales"){
			let salesSet = new SalesSet();
			salesSet.salesInsertForm();
			localStorage.setItem("selectValue", "sales");
		}else if(thisEle.value === "tech"){
			let techSet = new TechSet();
			techSet.techInsertForm();
			localStorage.setItem("selectValue", "tech");
		}else{
			CommonDatas.Temps.scheduleSet.scheduleInsertForm();
			localStorage.setItem("selectValue", "schedule");
		}

		CommonDatas.Temps.scheduleSet.addModalFirstRadio();
		document.getElementById("schedFrom").value = storage.calendarSelectArg.startStr + "T09:00:00";
		document.getElementById("schedTo").value = storage.calendarSelectArg.endStr + "T18:00:00";
	}

	searchSetItem(viewType){
		let datas = [];
		let searchDatas = {};
		searchDatas.userNo = (CommonDatas.emptyValuesCheck(document.getElementById("searchUser")) || CommonDatas.emptyValuesCheck(document.getElementById("searchUser").dataset.value)) ? "" : document.getElementById("searchUser").dataset.value;
		searchDatas.soppNo = (CommonDatas.emptyValuesCheck(document.getElementById("searchSopp")) || CommonDatas.emptyValuesCheck(document.getElementById("searchSopp").dataset.value)) ? "" : document.getElementById("searchSopp").dataset.value;
		searchDatas.custNo = (CommonDatas.emptyValuesCheck(document.getElementById("searchCust")) || CommonDatas.emptyValuesCheck(document.getElementById("searchCust").dataset.value)) ? "" : document.getElementById("searchCust").dataset.value;
		searchDatas.type = (CommonDatas.emptyValuesCheck(document.getElementById("searchType")) || CommonDatas.emptyValuesCheck(document.getElementById("searchType").options[document.getElementById("searchType").selectedIndex].dataset.value)) ? "" : document.getElementById("searchType").options[document.getElementById("searchType").selectedIndex].dataset.value;
		searchDatas.regDatetimeFrom = (CommonDatas.emptyValuesCheck(document.getElementById("searchDateFrom")) || CommonDatas.emptyValuesCheck(document.getElementById("searchDateFrom").value)) ? "" : document.getElementById("searchDateFrom").value;
		searchDatas.regDatetimeTo = (CommonDatas.emptyValuesCheck(document.getElementById("searchDateTo")) || CommonDatas.emptyValuesCheck(document.getElementById("searchDateTo").value)) ? "" : document.getElementById("searchDateTo").value;
		datas.push(searchDatas);

		if(viewType === "calendar") CommonDatas.Temps.scheduleSet.calendarList(JSON.stringify(datas));
		else CommonDatas.Temps.scheduleSet.list(JSON.stringify(datas));
	}
}

//일정관리 crud
class Schedule{
	constructor(getData){
		CommonDatas.Temps.schedule = this;
		
		if (getData !== undefined) {
			this.getData = getData;

			if(getData.schedType == 10165){
				this.salesNo = getData.salesNo;
				this.soppNo = getData.soppNo;
				this.userNo = getData.userNo;
				this.compNo = getData.compNo;
				this.custNo = getData.custNo;
				this.schedFrom = getData.schedFrom;
				this.schedTo = getData.schedTo;
				this.salesPlace = getData.salesPlace;
				this.type = getData.type;
				this.desc = getData.desc;
				this.salesCheck = getData.salesCheck;
				this.title = getData.title;
				this.ptncNo = getData.ptncNo;
				this.schedType = getData.schedType;
				this.regDatetime = getData.regDatetime;
				this.modDatetime = getData.modDatetime; 
			}else if(getData.schedType == 10168 || getData.schedType == 10262){
				this.no = getData.no;
				this.schedNo = getData.schedNo;
				this.userNo = getData.userNo;
				this.compNo = getData.compNo;
				this.soppNo = getData.soppNo;
				this.custNo = getData.custNo;
				this.schedName = getData.schedName;
				this.schedFrom = getData.schedFrom;
				this.schedTo = getData.schedTo;
				this.title = getData.title;
				this.desc = getData.desc;
				this.schedChech = getData.schedCheck;
				this.subschedNo = getData.subschedNo;
				this.schedActive = getData.schedActive;
				this.schedAllday = getData.schedAllday;
				this.remindFlag = getData.remindFlag;
				this.schedType = getData.schedType;
				this.schedPlace = getData.schedPlace;
				this.schedColor = getData.schedColor;
				this.type = getData.type;
				this.contNo = getData.contNo;
				this.regDatetime = getData.regDatetime;
				this.modDatetime = getData.modDatetime;
			}else{
				this.techdNo = getData.techdNo;
				this.userNo = getData.userNo;
				this.compNo = getData.compNo;
				this.soppNo = getData.soppNo;
				this.custNo = getData.custNo;
				this.contNo = getData.contNo;
				this.cntrctMth = getData.cntrctMth;
				this.endCustNo = getData.endCustNo;
				this.custmemberNo = getData.custmemberNo
				this.title = getData.title;
				this.desc = getData.desc;
				this.techdCheck = getData.techdCheck;
				this.techdItemmodel = getData.techdItemmodel;
				this.techdItemversion = getData.techdItemversion;
				this.techdPlace = getData.techdPlace;
				this.schedFrom = getData.schedFrom;
				this.schedTo = getData.schedTo;
				this.type = getData.type;
				this.techdSteps = getData.techdSteps;
				this.schedType = getData.schedType;
				this.regDatetime = getData.regDatetime;
				this.modDatetime = getData.modDatetime;
			}
		} 
	}

	//기타일정 상세보기
	scheduleDetail() {
		let html = "";
		let setDate, datas, dataArray, notIdArray;

		CommonDatas.detailSetFormList(this.getData);

		let gridList = document.getElementsByClassName("gridList")[0];
		let containerTitle = document.getElementById("containerTitle");
		let detailBackBtn = document.getElementsByClassName("detailBackBtn")[0];
		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let crudDeleteBtn = document.getElementsByClassName("crudDeleteBtn")[0];

		setDate = CommonDatas.dateDis(new Date(this.regDatetime).getTime(), new Date(this.modDatetime).getTime());
		setDate = CommonDatas.dateFnc(setDate);

		notIdArray = ["userNo"];
		datas = ["soppNo", "userNo", "custNo", "ptncNo"];
		
		dataArray = [
			{
				"title": "활동시작일(*)",
				"elementId": "schedFrom",
				"type": "datetime",
				"value": this.schedFrom,
				"col": 2,
			},
			{
				"title": "활동종료일(*)",
				"elementId": "schedTo",
				"type": "datetime",
				"value": this.schedTo,
				"col": 2,
			},
			{
				"title": "담당자(*)",
				"elementId": "userNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.userNo)) ? "" : storage.user[this.userNo].userName,
			},
			{
				"title": "활동형태(*)",
				"selectValue": [
					{
						"key": "10170",
						"value": "회사방문",
					},
					{
						"key": "10171",
						"value": "기술지원",
					},
					{
						"key": "10221",
						"value": "제품설명",
					},
					{
						"key": "10222",
						"value": "시스템데모",
					},
					{
						"key": "10223",
						"value": "제품견적",
					},
					{
						"key": "10224",
						"value": "계약건 의사결정지원",
					},
					{
						"key": "10225",
						"value": "계약",
					},
					{
						"key": "10226",
						"value": "사후처리",
					},
					{
						"key": "10227",
						"value": "기타",
					},
					{
						"key": "10228",
						"value": "협력사요청",
					},
					{
						"key": "10229",
						"value": "협력사문의",
					},
					{
						"key": "10230",
						"value": "교육",
					},
					{
						"key": "10231",
						"value": "전화상담",
					},
					{
						"key": "10232",
						"value": "제조사업무협의",
					},
					{
						"key": "10233",
						"value": "외부출장",
					},
					{
						"key": "10234",
						"value": "제안설명회",
					}
				],
				"type": "select",
				"elementId": "type",
			},
			{
				"title": "장소",
				"elementId": "schedPlace",
				"value": this.schedPlace,
				"col": 2,
			},
			{
				"title": "영업기회",
				"elementId": "soppNo",
				"complete": "sopp",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.soppNo)) ? "" : CommonDatas.getSoppFind(this.soppNo, "name"),
				"col": 2,
			},
			{
				"title": "매출처",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.custNo)) ? "" : storage.customer[this.custNo].custName,
				"col": 2,
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"col": 4,
				"value": this.title
			},
			{
				"title": "내용",
				"elementId": "desc",
				"type": "textarea",
				"col": 4,
				"value": this.desc.replaceAll("\n", "<br />")
			}
		];

		html = CommonDatas.detailViewForm(dataArray);
		let createGrid = document.createElement("div");
		createGrid.className = "defaultFormContainer";
		createGrid.innerHTML = html;
		gridList.after(createGrid);
		containerTitle.innerText = this.title;
		let hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
		let showArr = ["defaultFormContainer"];
		CommonDatas.setViewContents(hideArr, showArr);
	
		if(storage.my == this.getData.userNo){
			crudUpdateBtn.setAttribute("onclick", "CommonDatas.enableDisabled(this, \"CommonDatas.Temps.schedule.update();\", \"" + notIdArray + "\");")
			crudDeleteBtn.setAttribute("onclick", "CommonDatas.Temps.schedule.delete();");
			crudUpdateBtn.style.display = "flex";
			crudDeleteBtn.style.display = "flex";
		}else{
			crudUpdateBtn.style.display = "none";
			crudDeleteBtn.style.display = "none";
		}
	
		detailBackBtn.style.display = "flex";
		CommonDatas.detailTrueDatas(datas);
	
		setTimeout(() => {
			ckeditor.config.readOnly = true;
			window.setTimeout(setEditor, 100);
		}, 200);
	}

	//달력 영업활동 상세보기
	calendarSalesDetail() {
		let html, dataArray;
		let notIdArray = ["userNo"];
		let datas = ["soppNo", "userNo", "custNo", "ptncNo"];
		CommonDatas.detailSetFormList(this.getData);

		dataArray = [
			{
				"title": "활동시작일(*)",
				"elementId": "schedFrom",
				"type": "datetime",
				"value": this.schedFrom,
			},
			{
				"title": "활동종료일(*)",
				"elementId": "schedTo",
				"type": "datetime",
				"value": this.schedTo,
			},
			{
				"title": "장소",
				"elementId": "salesPlace",
				"value": this.salesPlace,
			},
			{
				"title": "활동형태(*)",
				"selectValue": [
					{
						"key": "10170",
						"value": "회사방문",
					},
					{
						"key": "10171",
						"value": "기술지원",
					},
					{
						"key": "10221",
						"value": "제품설명",
					},
					{
						"key": "10222",
						"value": "시스템데모",
					},
					{
						"key": "10223",
						"value": "제품견적",
					},
					{
						"key": "10224",
						"value": "계약건 의사결정지원",
					},
					{
						"key": "10225",
						"value": "계약",
					},
					{
						"key": "10226",
						"value": "사후처리",
					},
					{
						"key": "10227",
						"value": "기타",
					},
					{
						"key": "10228",
						"value": "협력사요청",
					},
					{
						"key": "10229",
						"value": "협력사문의",
					},
					{
						"key": "10230",
						"value": "교육",
					},
					{
						"key": "10231",
						"value": "전화상담",
					},
					{
						"key": "10232",
						"value": "제조사업무협의",
					},
					{
						"key": "10233",
						"value": "외부출장",
					},
					{
						"key": "10234",
						"value": "제안설명회",
					}
				],
				"type": "select",
				"elementId": "type",
			},
			{
				"title": "담당자(*)",
				"elementId": "userNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.userNo)) ? "" : storage.user[this.userNo].userName,
			},
			{
				"title": "영업기회",
				"elementId": "soppNo",
				"complete": "sopp",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.soppNo)) ? "" : CommonDatas.getSoppFind(this.soppNo, "name"),
			},
			{
				"title": "매출처",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.custNo)) ? "" : storage.customer[this.custNo].custName,
			},
			{
				"title": "엔드유저",
				"elementId": "ptncNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.ptncNo)) ? "" : storage.customer[this.ptncNo].custName,
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"col": 4,
				"value": this.title
			},
			{
				"title": "내용",
				"elementId": "desc",
				"type": "textarea",
				"col": 4,
				"value": this.desc
			}
		];
	
		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70vw";
		modal.content.style.maxWidth = "70vw";
		modal.headTitle.innerText = this.title;
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.style.display = "none";
		modal.close.style.display = "none";
		modal.confirm.innerText = "수정";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "CommonDatas.enableDisabled(this, \"let sales = new Sales('" + this.getData + "'); sales.update();\", \"" + notIdArray + "\");");
		modal.close.setAttribute("onclick", "modal.hide();");
		CommonDatas.detailTrueDatas(datas);
		
		setTimeout(() => {
			document.getElementById("type").value = this.type;
			let modalFootSpan = document.querySelectorAll(".modalFoot span");

			if(this.userNo == storage.my){
				if(modalFootSpan[1].id === "delete"){
					modalFootSpan[1].remove();
				}
				
				let createSpan = document.createElement("span");
				createSpan.innerText = "삭제";
				createSpan.className = "modalBtns";
				createSpan.id = "delete";
				createSpan.style.border = "1px solid #CC3D3D";
				createSpan.style.backgroundColor = "#CC3D3D";
				createSpan.style.color = "#fff";
				createSpan.setAttribute("onclick", "let sales = new Sales('" + this.getData + "'); sales.delete();");
				modalFootSpan[0].after(createSpan);
				modal.confirm.style.display = "flex";
				modal.close.style.display = "flex";
			}
			
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//달력 기술지원 상세보기
	calendarTechDetail() {
		let html, dataArray;
		let notIdArray = ["userNo"];
		let datas = ["soppNo", "userNo", "custNo", "endCustNo", "custmemberNo", "contNo"];
		CommonDatas.detailSetFormList(this.getData);
	
		dataArray = [
			{
				"title": "등록구분(*)",
				"radioValue": [
					{
						"key": "10247",
						"value": "신규영업지원",
					},
					{
						"key": "10248",
						"value": "유지보수",
					},
				],
				"type": "radio",
				"elementId": ["cntrctMthNew", "cntrctMthOld"],
				"onChange": "CommonDatas.Temps.techSet.techRadioChange();",
				"col": 4,
				"elementName": "cntrctMth",
			},
			{
				"title": "영업기회(*)",
				"elementId": "soppNo",
				"complete": "sopp",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.soppNo)) ? "" : CommonDatas.getSoppFind(this.soppNo, "name"),
			},
			{
				"title": "계약(*)",
				"elementId": "contNo",
				"complete": "contract",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.contNo)) ? "" : CommonDatas.getContFind(this.contNo, "name"),
			},
			{
				"title": "엔드유저(*)",
				"elementId": "endCustNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.endCustNo)) ? "" : storage.customer[this.endCustNo].custName,
			},
			{
				"title": "엔드유저 담당자",
				"complete": "cip",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "custmemberNo",
				"value": (CommonDatas.emptyValuesCheck(this.custmemberNo)) ? "" : storage.cip[this.custmemberNo].name,
			},
			{
				"title": "담당자(*)",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "userNo",
				"value": (CommonDatas.emptyValuesCheck(this.userNo)) ? "" : storage.user[this.userNo].userName,
			},
			{
				"title": "모델",
				"elementId": "techdItemmodel",
				"value": (CommonDatas.emptyValuesCheck(this.techdItemmodel)) ? "" : this.techdItemmodel,
				"col": 4,
			},
			{
				"title": "버전",
				"elementId": "techdItemversion",
				"value": (CommonDatas.emptyValuesCheck(this.techdItemversion)) ? "" : this.techdItemversion,
				"col": 4,
			},
			{
				"title": "단계",
				"selectValue": [
					{
						"key": "10213",
						"value": "접수단계",
					},
					{
						"key": "10214",
						"value": "출동단계",
					},
					{
						"key": "10215",
						"value": "미계약에 따른 보류",
					},
					{
						"key": "10253",
						"value": "처리완료",
					}
				],
				"type": "select",
				"elementId": "techdSteps",
			},
			{
				"title": "지원형태",
				"selectValue": [
					{
						"key": "10187",
						"value": "전화상담",
					},
					{
						"key": "10208",
						"value": "현장방문",
					},
					{
						"key": "10209",
						"value": "원격지원",
					}
				],
				"type": "select",
				"elementId": "type",
			},
			{
				"title": "지원일자 시작일(*)",
				"elementId": "schedFrom",
				"type": "datetime",
				"value": this.schedFrom,
			},
			{
				"title": "지원일자 종료일(*)",
				"elementId": "schedTo",
				"type": "datetime",
				"value": this.schedTo,
			},
			{
				"title": "장소",
				"elementId": "techdPlace",
				"value": (CommonDatas.emptyValuesCheck(this.techdPlace)) ? "" : this.techdPlace,
				"col": 1,
			},
			{
				"title": "기술지원명(*)",
				"elementId": "title",
				"value": (CommonDatas.emptyValuesCheck(this.title)) ? "" : this.title,
				"col": 3,
			},
			{
				"title": "내용",
				"type": "textarea",
				"elementId": "desc",
				"value": (CommonDatas.emptyValuesCheck(this.desc)) ? "" : this.desc,
				"col": 4,
			},
		];
	
		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70vw";
		modal.content.style.maxWidth = "70vw";
		modal.headTitle.innerText = this.title;
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.style.display = "none";
		modal.close.style.display = "none";
		modal.confirm.innerText = "수정";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "CommonDatas.enableDisabled(this, \"let tech = new Tech(); tech.update();\", \"" + notIdArray + "\");");
		modal.close.setAttribute("onclick", "modal.hide();");

		setTimeout(() => {
			let modalFootSpan = document.querySelectorAll(".modalFoot span");

			if(this.userNo == storage.my){
				if(modalFootSpan[1].id === "delete"){
					modalFootSpan[1].remove();
				}
				
				let createSpan = document.createElement("span");
				createSpan.innerText = "삭제";
				createSpan.className = "modalBtns";
				createSpan.id = "delete";
				createSpan.style.border = "1px solid #CC3D3D";
				createSpan.style.backgroundColor = "#CC3D3D";
				createSpan.style.color = "#fff";
				createSpan.setAttribute("onclick", "let tech = new Tech('" + this.getData + "'); tech.delete();");
				modalFootSpan[0].after(createSpan);
				modal.confirm.style.display = "flex";
				modal.close.style.display = "flex";
			}

			CommonDatas.detailTrueDatas(datas);
			document.querySelector("[name=\"cntrctMth\"][value=\"" + this.cntrctMth + "\"]").setAttribute("checked", true);
			let techSet = new TechSet();
			techSet.techRadioChange();
			document.getElementById("techdSteps").value = this.techdSteps;
			document.getElementById("type").value = this.type;
			document.getElementById("userNo").setAttribute("data-change", true);
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//달력 기타일정 상세보기
	calendarScheduleDetail() {
		let html, dataArray;
		let notIdArray = ["userNo"];
		let datas = ["soppNo", "custNo", "userNo"];
		CommonDatas.detailSetFormList(this.getData);
	
		dataArray = [
			{
				"title": "활동시작일(*)",
				"elementId": "schedFrom",
				"type": "datetime",
				"value": this.schedFrom,
				"col": 2,
			},
			{
				"title": "활동종료일(*)",
				"elementId": "schedTo",
				"type": "datetime",
				"value": this.schedTo,
				"col": 2,
			},
			{
				"title": "담당자(*)",
				"elementId": "userNo",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.userNo)) ? "" : storage.user[this.userNo].userName,
			},
			{
				"title": "활동형태(*)",
				"selectValue": [
					{
						"key": "10170",
						"value": "회사방문",
					},
					{
						"key": "10171",
						"value": "기술지원",
					},
					{
						"key": "10221",
						"value": "제품설명",
					},
					{
						"key": "10222",
						"value": "시스템데모",
					},
					{
						"key": "10223",
						"value": "제품견적",
					},
					{
						"key": "10224",
						"value": "계약건 의사결정지원",
					},
					{
						"key": "10225",
						"value": "계약",
					},
					{
						"key": "10226",
						"value": "사후처리",
					},
					{
						"key": "10227",
						"value": "기타",
					},
					{
						"key": "10228",
						"value": "협력사요청",
					},
					{
						"key": "10229",
						"value": "협력사문의",
					},
					{
						"key": "10230",
						"value": "교육",
					},
					{
						"key": "10231",
						"value": "전화상담",
					},
					{
						"key": "10232",
						"value": "제조사업무협의",
					},
					{
						"key": "10233",
						"value": "외부출장",
					},
					{
						"key": "10234",
						"value": "제안설명회",
					}
				],
				"type": "select",
				"elementId": "type",
			},
			{
				"title": "장소",
				"elementId": "schedPlace",
				"value": this.schedPlace,
				"col": 2,
			},
			{
				"title": "영업기회",
				"elementId": "soppNo",
				"complete": "sopp",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.soppNo)) ? "" : CommonDatas.getSoppFind(this.soppNo, "name"),
				"col": 2,
			},
			{
				"title": "매출처",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.custNo)) ? "" : storage.customer[this.custNo].custName,
				"col": 2,
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"col": 4,
				"value": this.title
			},
			{
				"title": "내용",
				"elementId": "desc",
				"type": "textarea",
				"col": 4,
				"value": this.desc.replaceAll("\n", "<br />")
			}
		];

		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70vw";
		modal.content.style.maxWidth = "70vw";
		modal.headTitle.innerText = this.title;
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.style.display = "none";
		modal.close.style.display = "none";
		modal.confirm.innerText = "수정";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "CommonDatas.enableDisabled(this, \"let schedule = new Schedule('" + this.getData + "'); schedule.update();\", \"" + notIdArray + "\");");
		modal.close.setAttribute("onclick", "modal.hide();");
		
		setTimeout(() => {
			let modalFootSpan = document.querySelectorAll(".modalFoot span");

			if(this.userNo == storage.my){
				if(modalFootSpan[1].id === "delete"){
					modalFootSpan[1].remove();
				}
				
				let createSpan = document.createElement("span");
				createSpan.innerText = "삭제";
				createSpan.className = "modalBtns";
				createSpan.id = "delete";
				createSpan.style.border = "1px solid #CC3D3D";
				createSpan.style.backgroundColor = "#CC3D3D";
				createSpan.style.color = "#fff";
				createSpan.setAttribute("onclick", "let schedule = new Schedule('" + this.getData + "'); schedule.delete();");
				modalFootSpan[0].after(createSpan);
				modal.confirm.style.display = "flex";
				modal.close.style.display = "flex";
			}

			CommonDatas.detailTrueDatas(datas);
			document.getElementById("type").value = this.type;
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//기타일정 등록
	insert(){
		if(document.getElementById("schedFrom").value === ""){
			msg.set("활동 시작일을 선택해주세요.");
			document.getElementById("schedFrom").focus();
			return false;
		} else if(document.getElementById("schedTo").value === ""){
			msg.set("활동 종료일을 선택해주세요.");
			document.getElementById("schedTo").focus();
			return false;
		} else if(document.getElementById("title").value === ""){
			msg.set("제목을 입력해주세요.");
			document.getElementById("title").focus();
			return false;
		} else{
			CommonDatas.formDataSet();
			storage.formList.schedType = 10168;
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.post("/api/schedule", data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("등록되었습니다.");
				} else {
					msg.set("등록 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//기타일정 수정
	update() {
		if(document.getElementById("schedFrom").value === ""){
			msg.set("활동 시작일을 선택해주세요.");
			document.getElementById("schedFrom").focus();
			return false;
		} else if(document.getElementById("schedTo").value === ""){
			msg.set("활동 종료일을 선택해주세요.");
			document.getElementById("schedTo").focus();
			return false;
		} else if(document.getElementById("title").value === ""){
			msg.set("제목을 입력해주세요.");
			document.getElementById("title").focus();
			return false;
		} else {
			CommonDatas.formDataSet();
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.put("/api/schedule/" + data.schedNo, data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("수정되었습니다.");
				} else {
					msg.set("수정 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("수정 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//기타일정 삭제
	delete() {
		if (confirm("정말로 삭제하시겠습니까??")) {
			axios.delete("/api/schedule/" + storage.formList.schedNo, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("삭제되었습니다.");
				} else {
					msg.set("삭제 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("삭제 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		} else {
			return false;
		}
	}
}

// 개인업무일지 시작
class WorkReportSet{
	constructor(){
		CommonDatas.Temps.workReportSet = this;
		this.getSreportDatas("this");
		this.getSreportDatas("next");
	}

	//개인업무일지 들고오는 함수
	getWorkReportDatas(setType) {
		return new Promise((resolve, reject) => {
			if(setType === "last") resolve("last");
			else if(setType === "this") resolve("this");
			else resolve("next");

			let setDate;
			let calDay = 0;
			let nowDate = new Date();
	
			if(nowDate.getDay() > 0 && nowDate.getDay() < 7){
				calDay = 6 - nowDate.getDay();
			}
	
			if(setType === "last"){
				nowDate.setDate((nowDate.getDate() + calDay) - 7);
			}else if(setType === "this" || setType === undefined){
				nowDate.setDate(nowDate.getDate() + calDay);
			}else{
				nowDate.setDate((nowDate.getDate() + calDay) + 7);
			}
	
			setDate = nowDate.toISOString().substring(0, 10);

			axios({
				method: "get",
				url: "/api/schedule/workReport",
				params: {
					"setDate": setDate,
					"userNo": storage.my,
				},
			}).then((response) => {
				if (response.data.result === "ok") {
					let result;
					result = cipher.decAes(response.data.data);
					result = JSON.parse(result);
					result = this.setWorkLongDate(result);
	
					if(setType === "last"){
						storage.lastWorkReport = result;
					}else if(setType === "this" || setType === undefined){
						storage.thisWorkReport = result;
					}else{
						storage.nextWorkReport = result;
					}
					
					if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.sopp === undefined) {
						window.setTimeout(this.drawWorkReport(setType), 1000);
					} else {
						window.setTimeout(this.drawWorkReport(setType), 200);
					}
				}
			}).catch((error) => {
				msg.set("개인업무일지 에러입니다.\n" + error);
				console.log(error);
			});
		})
	}

	//주간별 긴 일정 json 포맷 함수
	setWorkLongDate(datas) {
		let result = [];
		
		for(let i = 0; i < datas.length; i++){
			let item = datas[i];
			let setFromDate = new Date(item.schedFrom);
			let setToDate = new Date(item.schedTo);
			let calTime = setToDate.getTime() - setFromDate.getTime();
			let calDay = Math.floor(calTime / (1000 * 60 * 60 * 24) + 1);

			if(calDay > 1){
				for(let t = 0; t < calDay; t++){
					let formatResult = {};
					let year, month, day, hours, minutes, seconds;
					let calFromDate = new Date(item.schedFrom);
					calFromDate.setDate(calFromDate.getDate() + t);
					year = calFromDate.getFullYear();
					month = CommonDatas.Temps.workReportSet.dateFirstZeroCheck(calFromDate.getMonth() + 1);
					day = CommonDatas.Temps.workReportSet.dateFirstZeroCheck(calFromDate.getDate());
					hours = CommonDatas.Temps.workReportSet.dateFirstZeroCheck(calFromDate.getHours());
					minutes = CommonDatas.Temps.workReportSet.dateFirstZeroCheck(calFromDate.getMinutes());
					seconds = CommonDatas.Temps.workReportSet.dateFirstZeroCheck(calFromDate.getSeconds());

					for(let key in datas[i]){
						if(key === "schedFrom" || key === "schedTo"){
							formatResult[key] = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;	
						}else{
							formatResult[key] = datas[i][key];
						}
					}

					result.push(formatResult);
				}
			}else{
				result.push(item);
			}
		}

		return result;
	}

	//숫자 형식 10보다 작을 시 앞에 0 붙여주는 함수
	dateFirstZeroCheck(value){
		let result = "";

		if(value < 10){
			result = "0" + value;
		}else{
			result = value;
		}

		return result;
	}

	//개인업무일지 추가기재 들고오는 함수
	getSreportDatas(setType) {
		let weekNum;
		let nowDate = new Date();
		let getYear = nowDate.getFullYear();

		if(setType === "this" || setType === undefined || setType === ""){
			weekNum = getYear.toString() + CommonDatas.Temps.workReportSet.getWeekOfYear(nowDate);
		}else{
			nowDate.setDate(nowDate.getDate() + 7);
			weekNum = getYear.toString() + CommonDatas.Temps.workReportSet.getWeekOfYear(nowDate);
		}

		axios({
			method: "get",
			url: "/api/schedule/sreport",
			params: {
				"weekNum": weekNum,
			},
		}).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);

				if(setType === "this" || setType === undefined || setType === ""){
					storage.thisSreport = result;
				}else{
					storage.nextSreport = result;
				}
			}
		}).catch((error) => {
			msg.set("개인업무일지 추가기재 에러입니다.\n" + error);
			console.log(error);
		});
	}

	//개인업무일지 레이아웃 셋팅 함수
	drawWorkReport(setType){
		let workReportContent = document.getElementsByClassName("workReportContent")[0];
		let gridHtml;
		
		if(setType === "last"){
			let othersHtml = "<div class=\"othersContents\">";
			othersHtml += "<div class=\"othersTitle\">추가기재</div>";

			if(storage.thisSreport === undefined){
				othersHtml += "<div class=\"othersContent\"><textarea id=\"lastOthers\"></textarea></div>";
				othersHtml += "<div><input type=\"checkbox\" /></div>";
			}else{
				othersHtml += "<div class=\"othersContent\"><textarea id=\"lastOthers\">" + storage.thisSreport.prComment + "</textarea></div>";

				if(storage.thisSreport.prCheck > 0){
					othersHtml += "<div><input type=\"checkbox\" checked/></div>";
				}else{
					othersHtml += "<div><input type=\"checkbox\" /></div>";
				}
			}

			othersHtml += "</div>";

			gridHtml = CommonDatas.Temps.workReportSet.setWorkReportGrid(storage.lastWorkReport);

			let lastCreateDiv = document.createElement("div");
			lastCreateDiv.className = "lastWorkReport";
			lastCreateDiv.innerHTML = "<span>지난주 업무일지</span>" + gridHtml + othersHtml;
			workReportContent.append(lastCreateDiv);

			let lastWorkReport = document.getElementsByClassName("lastWorkReport")[0];
			CommonDatas.Temps.workReportSet.gridRowSort(lastWorkReport);
		}else if(setType === "this"){
			let othersHtml = "<div class=\"othersContents\">";
			othersHtml += "<div class=\"othersTitle\">추가기재</div>";

			if(storage.thisSreport === undefined){
				othersHtml += "<div class=\"othersContent\"><textarea id=\"thisOthers\"></textarea></div>";
				othersHtml += "<div><input type=\"checkbox\" /></div>";
			}else{
				othersHtml += "<div class=\"othersContent\"><textarea id=\"thisOthers\">" + storage.thisSreport.thComment + "</textarea></div>";

				if(storage.thisSreport.thCheck > 0){
					othersHtml += "<div><input type=\"checkbox\" checked/></div>";
				}else{
					othersHtml += "<div><input type=\"checkbox\" /></div>";
				}
			}

			othersHtml += "</div>";

			gridHtml = CommonDatas.Temps.workReportSet.setWorkReportGrid(storage.thisWorkReport);

			let thisCreateDiv = document.createElement("div");
			thisCreateDiv.className = "thisWorkReport";
			thisCreateDiv.innerHTML = "<span>이번주 업무일지</span>" + gridHtml + othersHtml;
			workReportContent.append(thisCreateDiv);

			let thisWorkReport = document.getElementsByClassName("thisWorkReport")[0];
			CommonDatas.Temps.workReportSet.gridRowSort(thisWorkReport);
		}else{
			let othersHtml = "<div class=\"othersContents\">";
			othersHtml += "<div class=\"othersTitle\">추가기재</div>";

			if(storage.nextSreport === undefined){
				othersHtml += "<div class=\"othersContent\"><textarea id=\"nextOthers\"></textarea></div>";
				othersHtml += "<div><input type=\"checkbox\" /></div>";
			}else{
				othersHtml += "<div class=\"othersContent\"><textarea id=\"nextOthers\">" + storage.nextSreport.thComment + "</textarea></div>";

				if(storage.nextSreport.thCheck > 0){
					othersHtml += "<div><input type=\"checkbox\" checked/></div>";
				}else{
					othersHtml += "<div><input type=\"checkbox\" /></div>";
				}
			}

			othersHtml += "</div>";

			gridHtml = CommonDatas.Temps.workReportSet.setWorkReportGrid(storage.nextWorkReport);

			let nextCreateDiv = document.createElement("div");
			nextCreateDiv.className = "nextWorkReport";
			nextCreateDiv.innerHTML = "<span>다음주 업무일지</span>" + gridHtml + othersHtml;
			workReportContent.append(nextCreateDiv);

			let nextWorkReport = document.getElementsByClassName("nextWorkReport")[0];
			CommonDatas.Temps.workReportSet.gridRowSort(nextWorkReport);
		}

		document.getElementsByClassName("crudBtns")[0].children[0].setAttribute("onclick", "let workReport = new WorkReport(); workReport.update(\"this\")");
		document.getElementsByClassName("crudBtns")[0].children[1].setAttribute("onclick", "let workReport = new WorkReport(); workReport.update(\"next\")");
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor, 100);
	}

	gridRowSort(gridContainer){
		let week = gridContainer.getElementsByClassName("workReportBody")[0].querySelectorAll(".gridWeek");
		let month = gridContainer.getElementsByClassName("workReportBody")[0].querySelectorAll(".gridMonth");
		
		for(let i = 0; i < week.length; i++){
			let weekItem = gridContainer.getElementsByClassName("workReportBody")[0].querySelectorAll(".gridWeek[data-value*=\"" + week[i].dataset.value + "\"]");
			
			if(weekItem.length > 1){
				weekItem[0].style.gridRow = "span " + weekItem.length;
			}

			for(let j = 0; j < weekItem.length; j++){
				if(j > 0){
					weekItem[j].remove();
				}
			}
		}

		for(let i = 0; i < month.length; i++){
			let monthItem = gridContainer.getElementsByClassName("workReportBody")[0].querySelectorAll(".gridMonth[data-value*=\"" + month[i].dataset.value + "\"]");
			
			if(monthItem.length > 1){
				monthItem[0].style.gridRow = "span " + monthItem.length;
			}

			for(let j = 0; j < monthItem.length; j++){
				if(j > 0){
					monthItem[j].remove();
				}
			}
		}
	}

	getWeekOfYear(date){
		let oneJan = new Date(date.getFullYear(), 0, 0);
		let numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
		return Math.ceil(numberOfDays / 7);
	};

	setWorkReportGrid(datas){
		let nowDate = new Date();
		let nowYear = nowDate.getFullYear();
		let allHtml = "";
		let headerHtml = "";
		let bodyHtml = "";

		headerHtml = "<div class=\"workReportHeader\"><div>주차</div><div>요일</div><div>일정제목</div><div>일정내용</div><div>일정시작</div><div>일정종료</div><div>업무일지반영</div></div>";
		bodyHtml += "<div class=\"workReportBody\">";

		if(datas.length > 0){
			for(let i = 0; i < datas.length; i++){
				let item = datas[i];
				let getDay = new Date(item.schedFrom).getDay();
				let month, type;
	
				if(getDay == 0) month = "일";
				else if(getDay == 1) month = "월";
				else if(getDay == 2) month = "화";
				else if(getDay == 3) month = "수";
				else if(getDay == 4) month = "목";
				else if(getDay == 5) month = "금";
				else if(getDay == 6) month = "토";
	
				bodyHtml += "<div class=\"gridWeek\" data-value=\"" + nowYear + CommonDatas.Temps.workReportSet.getWeekOfYear(new Date(item.schedFrom)) + "\" style=\"justify-content: center;\">" + nowYear + CommonDatas.Temps.workReportSet.getWeekOfYear(new Date(item.schedFrom)) + "</div>";
				bodyHtml += "<div class=\"gridMonth\" data-value=\"" + month + "\" style=\"justify-content: center;\">" + month + "</div>";
	
				if(item.schedType === 10165){
					bodyHtml += "<div>" + "$ " + item.title + "</div>";
					type = "sales";
				}else if(item.schedType === 10168 || item.schedType === 10262){
					bodyHtml += "<div>" + "# " + item.title + "</div>";
					type = "schedule";
				}else{
					bodyHtml += "<div>" + "@ " + item.title + "</div>";
					type = "tech";
				}
	
				bodyHtml += "<div>" + item.desc + "</div>";
				bodyHtml += "<div style=\"justify-content: center;\">" + item.schedFrom + "</div>";
				bodyHtml += "<div style=\"justify-content: center;\">" + item.schedTo + "</div>";
				
				if(item.check > 0){
					bodyHtml += "<div class=\"reportCheck\" style=\"justify-content: center;\"><input type=\"checkbox\" data-no=\"" + item.no + "\" data-type=\"" + type + "\" checked/></div>";
				}else{
					bodyHtml += "<div class=\"reportCheck\" style=\"justify-content: center;\"><input type=\"checkbox\" data-no=\"" + item.no + "\" data-type=\"" + type + "\" /></div>";
				}
			}
		}else{
			bodyHtml += "<div style=\"grid-column: span 7; justify-content: center;\"><div>데이터가 없습니다.</div></div>";
		}

		bodyHtml += "</div>";
		allHtml = headerHtml + bodyHtml;

		return allHtml;
	}
}

//개인업무일지 crud
class WorkReport{
	update(buttonType) {
		let indexCheck = false;
		let nowDate = new Date();
		let nowYear = nowDate.getFullYear();

		if(buttonType === "this"){
			let otherDatas = {};
			let weekNum = nowYear.toString() + CommonDatas.Temps.workReportSet.getWeekOfYear(nowDate);
			let lastWorkReport = document.getElementsByClassName("lastWorkReport")[0];
			let thisWorkReport = document.getElementsByClassName("thisWorkReport")[0];
			let lastCheckboxDiv = lastWorkReport.getElementsByClassName("workReportBody")[0].querySelectorAll(".reportCheck");
			let thisCheckboxDiv = thisWorkReport.getElementsByClassName("workReportBody")[0].querySelectorAll(".reportCheck");
			let lastOtherComment = CKEDITOR.instances["lastOthers"].getData().replaceAll("\n", "");
			let thisOtherComment = CKEDITOR.instances["thisOthers"].getData().replaceAll("\n", "");
			let lastCheckbox = lastWorkReport.getElementsByClassName("othersContents")[0].children[2].children[0];
			let thisCheckbox = thisWorkReport.getElementsByClassName("othersContents")[0].children[2].children[0];

			otherDatas.userNo = storage.my;
			otherDatas.weekNum = weekNum;
			otherDatas.prComment = lastOtherComment;
			otherDatas.prCheck = (lastCheckbox.checked) ? 1 : 0;
			otherDatas.thComment = thisOtherComment;
			otherDatas.thCheck = (thisCheckbox.checked) ? 1 : 0;
			otherDatas = JSON.stringify(otherDatas);
			otherDatas = cipher.encAes(otherDatas);

			axios.post("/api/schedule/reportOtherInsert", otherDatas, {
				headers: { "Content-Type": "text/plain" }
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});

			for(let i = 0; i < lastCheckboxDiv.length; i++){
				let datas = {};
				let item = lastCheckboxDiv[i];
				let checkbox = item.children[0];
				let no = checkbox.dataset.no;
				let type = checkbox.dataset.type;
				let checkFlag = 1;

				if(checkbox.checked){
					checkFlag = 1;
				}else{
					checkFlag = 0;
				}

				datas.no = no;
				datas.type = type;
				datas.check = checkFlag;
				datas = JSON.stringify(datas);
				datas = cipher.encAes(datas);

				axios.put("/api/schedule/reportUpdate/" + no + "/" + type, datas, {
					headers: { "Content-Type": "text/plain" }
				}).catch((error) => {
					msg.set(no + " " + type + " 수정 도중 에러가 발생하였습니다.\n" + error);
					console.log(error);
					return false;
				});
			}

			for(let i = 0; i < thisCheckboxDiv.length; i++){
				let datas = {};
				let item = thisCheckboxDiv[i];
				let checkbox = item.children[0];
				let no = checkbox.dataset.no;
				let type = checkbox.dataset.type;
				let checkFlag = 1;

				if(checkbox.checked){
					checkFlag = 1;
				}else{
					checkFlag = 0;
				}

				datas.no = no;
				datas.type = type;
				datas.check = checkFlag;
				datas = JSON.stringify(datas);
				datas = cipher.encAes(datas);

				axios.put("/api/schedule/reportUpdate/" + no + "/" + type, datas, {
					headers: { "Content-Type": "text/plain" }
				}).catch((error) => {
					msg.set(no + " " + type + " 수정 도중 에러가 발생하였습니다.\n" + error);
					console.log(error);
					return false;
				});

				if(i == (thisCheckboxDiv.length - 1)){
					indexCheck = true;
				}
			}
		}else{
			nowDate.setDate(nowDate.getDate() + 7);
			let otherDatas = {};
			let weekNum = nowYear.toString() + CommonDatas.Temps.workReportSet.getWeekOfYear(nowDate);
			let thisWorkReport = document.getElementsByClassName("thisWorkReport")[0];
			let nextWorkReport = document.getElementsByClassName("nextWorkReport")[0];
			let thisCheckboxDiv = thisWorkReport.getElementsByClassName("workReportBody")[0].querySelectorAll(".reportCheck");
			let nextCheckboxDiv = nextWorkReport.getElementsByClassName("workReportBody")[0].querySelectorAll(".reportCheck");
			let thisOtherComment = CKEDITOR.instances["thisOthers"].getData().replaceAll("\n", "");
			let nextOtherComment = CKEDITOR.instances["nextOthers"].getData().replaceAll("\n", "");
			let thisCheckbox = thisWorkReport.getElementsByClassName("othersContents")[0].children[2].children[0];
			let nextCheckbox = nextWorkReport.getElementsByClassName("othersContents")[0].children[2].children[0];

			otherDatas.userNo = storage.my;
			otherDatas.weekNum = weekNum;
			otherDatas.prComment = thisOtherComment;
			otherDatas.prCheck = (thisCheckbox.checked) ? 1 : 0;
			otherDatas.thComment = nextOtherComment;
			otherDatas.thCheck = (nextCheckbox.checked) ? 1 : 0;
			otherDatas = JSON.stringify(otherDatas);
			otherDatas = cipher.encAes(otherDatas);

			axios.post("/api/schedule/reportOtherInsert", otherDatas, {
				headers: { "Content-Type": "text/plain" }
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});

			for(let i = 0; i < thisCheckboxDiv.length; i++){
				let datas = {};
				let item = thisCheckboxDiv[i];
				let checkbox = item.children[0];
				let no = checkbox.dataset.no;
				let type = checkbox.dataset.type;
				let checkFlag = 1;

				if(checkbox.checked){
					checkFlag = 1;
				}else{
					checkFlag = 0;
				}

				datas.no = no;
				datas.type = type;
				datas.check = checkFlag;
				datas = JSON.stringify(datas);
				datas = cipher.encAes(datas);

				axios.put("/api/schedule/reportUpdate/" + no + "/" + type, datas, {
					headers: { "Content-Type": "text/plain" }
				}).catch((error) => {
					msg.set(no + " " + type + " 수정 도중 에러가 발생하였습니다.\n" + error);
					console.log(error);
					return false;
				});
			}

			for(let i = 0; i < nextCheckboxDiv.length; i++){
				let datas = {};
				let item = nextCheckboxDiv[i];
				let checkbox = item.children[0];
				let no = checkbox.dataset.no;
				let type = checkbox.dataset.type;
				let checkFlag = 1;

				if(checkbox.checked){
					checkFlag = 1;
				}else{
					checkFlag = 0;
				}

				datas.no = no;
				datas.type = type;
				datas.check = checkFlag;
				datas = JSON.stringify(datas);
				datas = cipher.encAes(datas);

				axios.put("/api/schedule/reportUpdate/" + no + "/" + type, datas, {
					headers: { "Content-Type": "text/plain" }
				}).catch((error) => {
					msg.set(no + " " + type + " 수정 도중 에러가 발생하였습니다.\n" + error);
					console.log(error);
					return false;
				});

				if(i == (nextCheckboxDiv.length - 1)){
					indexCheck = true;
				}
			}
		}

		if(indexCheck){
			alert("수정이 완료되었습니다.");
			location.reload();
		}
	}
}

//업무일지검토 시작
class WorkJournalSet{
	constructor(){
		CommonDatas.Temps.workJournalSet = this;
	}

	//업무일지검토 유저목록 데이터 불러오는 함수
	getWorkJournalUsers(type){
		axios({
			method: "get",
			url: "/api/schedule/getWorkJournalUser",
			params: {
				"type": type,
			},
		}).then((res) => {
			if(res.data.result === "ok"){
				let result = cipher.decAes(res.data.data);
				result = JSON.parse(result);
				storage.workJournalUsers = result;

				if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.sopp === undefined) {
					window.setTimeout(this.drawWorkJournalUsers(), 1000);
				} else {
					window.setTimeout(this.drawWorkJournalUsers(), 200);
				}
			}
		});
	}

	//업무일지검토 지난주/이번주/다음주 데이터 불러와 셋팅 함수
	getWorkJournalDatas(type){
		let setDate;
		let calDay = 0;
		let nowDate = new Date();

		if(nowDate.getDay() > 0 && nowDate.getDay() < 7){
			calDay = 6 - nowDate.getDay()
		}

		if(type === "last"){
			storage.lastWorkJournalDatas = {};
			nowDate.setDate((nowDate.getDate() + calDay) - 7);
		}else if(type === "this" || type === undefined){
			storage.thisWorkJournalDatas = {};
			nowDate.setDate(nowDate.getDate() + calDay);
		}else{
			storage.nextWorkJournalDatas = {};
			nowDate.setDate((nowDate.getDate() + calDay) + 7);
		}

		setDate = nowDate.toISOString().substring(0, 10);

		setTimeout(() => {
			const workReportSet = new WorkReportSet();

			for(let i = 0; i < storage.workJournalUsers.length; i++){
				let item = storage.workJournalUsers[i];

				if(item.sreportNo > 0){
					axios({
						method: "get",
						url: "/api/schedule/workReport",
						params: {
							"setDate": setDate,
							"userNo": item.userNo,
						},
					}).then((res) => {
						if(res.data.result === "ok"){
							let result = cipher.decAes(res.data.data);
							result = JSON.parse(result);
							result = workReportSet.setWorkLongDate(result);
							console.log();

							if(result[0] !== undefined){
								if(type === "last"){
									storage.lastWorkJournalDatas[result[0].userNo] = result;
								}else if(type === "this" || type === undefined){
									storage.thisWorkJournalDatas[result[0].userNo] = result;
								}else{
									storage.nextWorkJournalDatas[result[0].userNo] = result;
								}
							}
						}
					})
				}
			}
		}, 1000);
	}

	//업무일지검토 유저목록 레이아웃 그려주는 함수
	drawWorkJournalUsers(){
		let createDiv = document.createElement("div");
		let contentsDiv = document.createElement("div");
		let workJournalContent = document.getElementsByClassName("workJournalContent")[0];
		let html = "";
		let datasHtml = "";
		let forIndex = 0;

		html = "<div>";
		html += "<div>성명</div>";
		html += "<div>선택</div>";
		html += "</div>";
		html += "<div>";

		for(let i = 0; i < storage.workJournalUsers.length; i++){
			let item = storage.workJournalUsers[i];

			if(item.sreportNo > 0){
				forIndex++;
			}
		}

		if(forIndex > 0){
			for(let i = 0; i < storage.workJournalUsers.length; i++){
				let item = storage.workJournalUsers[i];
	
				if(item.sreportNo > 0){
					datasHtml += "<div class=\"workJournalUserContent\" data-no=\"" + item.userNo + "\"></div>";
					html += "<div><a href=\"#\" data-no=\"" + item.userNo + "\" onclick=\"CommonDatas.Temps.workJournalSet.getUserHtml(this);\">" + item.userName + "</a></div>";
					html += "<div><input type=\"checkbox\" class=\"journalUserCheck\" data-no=\"" + item.userNo + "\" checked/></div>";
				}
			}
		}else{
			datasHtml += "<div class=\"workJournalUserContent\"></div>";
		}
		
		html += "</div>";

		createDiv.innerHTML = html;
		contentsDiv.innerHTML = datasHtml;
		contentsDiv.className = "workJournalHtmlContent";
		workJournalContent.append(createDiv);
		workJournalContent.append(contentsDiv);
	}

	//업무일지검토 표 그리는 함수
	drawWorkJournalContent(type){
		let workJournalUserContent = document.getElementsByClassName("workJournalUserContent");

		for(let i = 0; i < workJournalUserContent.length; i++){
			let item = workJournalUserContent[i];
			let createDiv = document.createElement("div");

			if(type === "last" || type === "this" || type === undefined || type === ""){
				createDiv.innerHTML = CommonDatas.Temps.workJournalSet.setWorkJournalGrid(storage.lastWorkJournalDatas[item.dataset.no], storage.thisWorkJournalDatas[item.dataset.no], item.dataset.no, type);
			}else{
				createDiv.innerHTML = CommonDatas.Temps.workJournalSet.setWorkJournalGrid(storage.thisWorkJournalDatas[item.dataset.no], storage.nextWorkJournalDatas[item.dataset.no], item.dataset.no, type);
			}

			item.append(createDiv);
			CommonDatas.Temps.workJournalSet.gridRowSort(item);
		}

		workJournalUserContent[0].style.display = "block";
	}

	//업무일지검토 표 html 셋팅 함수
	setWorkJournalGrid(lastDatas, thisDatas, userNo, type){
		let html = "";
		let nowDate = new Date();
		let calcDate = new Date(nowDate.setDate(nowDate.getDate() + 1 - nowDate.getDay()));
		nowDate.setMonth(nowDate.getMonth() + 1);

		html = "<div class=\"gridFirstHeader\">";
		html += "<div><span>일자 : " +  nowDate.getMonth() + "/" + calcDate.getDate() + " ~ ";

		calcDate.setDate(calcDate.getDate() + 4);

		html += nowDate.getMonth() + "/" + calcDate.getDate() + "</span></div>";
		
		if(userNo === undefined) html += "<div><span>담당 : </span></div>";
		else html += "<div><span>담당 : " + storage.user[userNo].userName + "</span></div>";

		html += "</div>";
		html += "<div class=\"gridLastHeader\">";

		if(type === "last" || type === "this" || type === undefined || type === ""){
			html += "<div><span>지난주 진행사항</span></div>";
			html += "<div><span>이번주 진행사항</span></div>";
		}else{
			html += "<div><span>이번주 진행사항</span></div>";
			html += "<div><span>다음주 진행사항</span></div>";
		}

		html += "</div>";
		html += "<div><div class=\"gridFirstBody\">";

		if(lastDatas === undefined){
			html += "<div class=\"emptyDataContent\">데이터가 없습니다.</div>";
		}else{
			for(let i = 0; i < lastDatas.length; i++){
				let item = lastDatas[i];
				let date;
				let getDay = new Date(item.schedFrom).getDay();
	
				if(getDay == 0) date = "일";
				else if(getDay == 1) date = "월";
				else if(getDay == 2) date = "화";
				else if(getDay == 3) date = "수";
				else if(getDay == 4) date = "목";
				else if(getDay == 5) date = "금";
				else if(getDay == 6) date = "토";
	
				html += "<div class=\"gridWeek\" data-value=\"" + date + "\">" + date + "</div>";
				html += "<div class=\"gridDescContent\">";
	
				if(item.schedType === 10165) html += "<div>" + "$ " + item.title + "</div>";
				else if(item.schedType === 10168 || item.schedType === 10262) html += "<div>" + "# " + item.title + "</div>";
				else html += "<div>" + "@ " + item.title + "</div>";
	
				html += "<div>" + item.desc + "</div>";
				html += "</div>";
			}
		}

		html += "</div>";
		html += "<div class=\"gridLastBody\">";

		if(thisDatas === undefined){
			html += "<div class=\"emptyDataContent\">데이터가 없습니다.</div>";
		}else{
			for(let i = 0; i < thisDatas.length; i++){
				let item = thisDatas[i];
				let date;
				let getDay = new Date(item.schedFrom).getDay();
	
				if(getDay == 0) date = "일";
				else if(getDay == 1) date = "월";
				else if(getDay == 2) date = "화";
				else if(getDay == 3) date = "수";
				else if(getDay == 4) date = "목";
				else if(getDay == 5) date = "금";
				else if(getDay == 6) date = "토";
	
				html += "<div class=\"gridWeek\" data-value=\"" + date + "\">" + date + "</div>";
				html += "<div class=\"gridDescContent\">";
	
				if(item.schedType === 10165) html += "<div>" + "$ " + item.title + "</div>";
				else if(item.schedType === 10168 || item.schedType === 10262) html += "<div>" + "# " + item.title + "</div>";
				else html += "<div>" + "@ " + item.title + "</div>";
	
				html += "<div>" + item.desc + "</div>";
				html += "</div>";
			}
		}

		html += "</div></div>";

		return html;
	}

	//그리드 같은 글자 row span 적용 함수
	gridRowSort(gridContainer){
		let firstWeek = gridContainer.getElementsByClassName("gridFirstBody")[0].querySelectorAll(".gridWeek");
		let lastWeek = gridContainer.getElementsByClassName("gridLastBody")[0].querySelectorAll(".gridWeek");
		
		for(let i = 0; i < firstWeek.length; i++){
			let weekItem = gridContainer.getElementsByClassName("gridFirstBody")[0].querySelectorAll(".gridWeek[data-value*=\"" + firstWeek[i].dataset.value + "\"]");
			
			if(weekItem.length > 1){
				weekItem[0].style.gridRow = "span " + weekItem.length;

				for(let j = 0; j < weekItem.length; j++){
					if(j != weekItem.length - 1){
						console.log(weekItem[j].nextSibling);
						weekItem[j].nextSibling.style.borderBottom = 0;
					}
				}
			}

			for(let j = 0; j < weekItem.length; j++){
				if(j > 0){
					weekItem[j].remove();
				}
			}
		}

		for(let i = 0; i < lastWeek.length; i++){
			let weekItem = gridContainer.getElementsByClassName("gridLastBody")[0].querySelectorAll(".gridWeek[data-value*=\"" + lastWeek[i].dataset.value + "\"]");
			
			if(weekItem.length > 1){
				weekItem[0].style.gridRow = "span " + weekItem.length;

				for(let j = 0; j < weekItem.length; j++){
					if(j != weekItem.length - 1){
						console.log(weekItem[j].nextSibling);
						weekItem[j].nextSibling.style.borderBottom = 0;
					}
				}
			}

			for(let j = 0; j < weekItem.length; j++){
				if(j > 0){
					weekItem[j].remove();
				}
			}
		}
	}

	//업무일지검토 일괄다운로드 pdf 실행 함수
	print_pdf(){
		let journalUserCheck = document.getElementsByClassName("journalUserCheck");
		let element = document.getElementsByClassName("workJournalContent")[0].getElementsByClassName("workJournalHtmlContent")[0];

		for(let i = 0; i < journalUserCheck.length; i++){
			let item = journalUserCheck[i];
			let workJournalUserContent = document.querySelector(".workJournalUserContent[data-no=\"" + item.dataset.no + "\"]");
			
			if(item.checked){
				workJournalUserContent.style.display = "block";
			}else{
				workJournalUserContent.style.display = "none";
			}
		}
		
		html2pdf().from(element).set({
		  margin: 10,
		  filename: '주간업무일지.pdf',
		  html2canvas: { scale: 3 },
		  jsPDF: {orientation: 'landscape', unit: 'mm', format: 'a4', compressPDF: true}
		}).save();
		
		setTimeout(() => {
			if(localStorage.getItem("selectUser") !== null){
				let selectUser = localStorage.getItem("selectUser");
				let workJournalUserContent = document.getElementsByClassName("workJournalUserContent");
	
				for(let i = 0; i < workJournalUserContent.length; i++){
					let item = workJournalUserContent[i];
	
					if(item.dataset.no === selectUser){
						item.style.display = "block";
					}else{
						item.style.display = "none";
					}
				}
	
				localStorage.removeItem("selectUser");
			}else{
				let workJournalUserContent = document.getElementsByClassName("workJournalUserContent");
	
				for(let i = 0; i < workJournalUserContent.length; i++){
					let item = workJournalUserContent[i];
	
					if(i == 0){
						item.style.display = "block";
					}else{
						item.style.display = "none";
					}
				}
			}
		}, 500);
	}

	//업무일지검토 개별다운로드 pdf 실행 함수
	onePdf(){
		let element;

		if(localStorage.getItem("selectUser") == null){
			element = document.getElementsByClassName("workJournalUserContent")[0];
		}else{
			element = document.querySelector(".workJournalUserContent[data-no=\"" + localStorage.getItem("selectUser") + "\"]");
		}

		let now = new Date();
		
		html2pdf().from(element).set({
		  margin: 10,
		  filename: localStorage.getItem("selectUserName") + '(' + now.toISOString().substring(0, 10) + ')' + '.pdf',
		  html2canvas: { scale: 10 },
		  jsPDF: {orientation: 'landscape', unit: 'mm', format: 'a4', compressPDF: true}
		}).save();
	}

	solPrint(){
		window.onbeforeprint = function(){
			document.body.innerHTML = document.querySelector(".workJournalUserContent[data-no=\"" + localStorage.getItem("selectUser") + "\"]").innerHTML;
		}
		
		window.onafterprint = function(){
			location.href="/business/workjournal";
		}
		
		window.print();
	}

	//업무일지검토 유저 목록에서 유저 이름 클릭 시 실행 함수
	getUserHtml(thisEle){
		if(localStorage.getItem("selectUser") !== null){
			localStorage.removeItem("selectUser");
		}

		if(localStorage.getItem("selectUserName") !== null){
			localStorage.removeItem("selectUserName");
		}

		let workJournalUserContent = document.getElementsByClassName("workJournalUserContent");
	
		for(let i = 0; i < workJournalUserContent.length; i++){
			let item = workJournalUserContent[i];

			if(item.dataset.no === thisEle.dataset.no){
				item.style.display = "block";
			}else{
				item.style.display = "none";
			}
		}

		localStorage.setItem("selectUser", thisEle.dataset.no);
		localStorage.setItem("selectUserName", thisEle.innerText);
	}

	//업무일지검토 금주/차주 조건에 따른 셋팅 함수
	journalChange(thisEle){
		$('.theme-loader').show();

		let journalChangeBtn = document.getElementsByClassName("journalChangeBtn")[0];
		let workJournalContent = document.getElementsByClassName("workJournalContent")[0];
		workJournalContent.innerHTML = "";

		if(thisEle === undefined || thisEle.dataset.type === "last" || thisEle.dataset.type === "this"){
			CommonDatas.Temps.workJournalSet.getWorkJournalUsers("this");
			CommonDatas.Temps.workJournalSet.getWorkJournalDatas("last");
			CommonDatas.Temps.workJournalSet.getWorkJournalDatas("this");
			CommonDatas.Temps.workJournalSet.getWorkJournalDatas("next");
			
			setTimeout(() => {
				CommonDatas.Temps.workJournalSet.drawWorkJournalContent("this");
			}, 1900);

			journalChangeBtn.dataset.type = "next";
			journalChangeBtn.innerText = "업무일지(차주)";			
		}else{
			CommonDatas.Temps.workJournalSet.getWorkJournalUsers("next");
			CommonDatas.Temps.workJournalSet.getWorkJournalDatas("last");
			CommonDatas.Temps.workJournalSet.getWorkJournalDatas("this");
			CommonDatas.Temps.workJournalSet.getWorkJournalDatas("next");
			
			setTimeout(() => {
				CommonDatas.Temps.workJournalSet.drawWorkJournalContent("next");
			}, 1900);

			journalChangeBtn.dataset.type = "this";
			journalChangeBtn.innerText = "업무일지(금주)";
		}

		$('.theme-loader').delay(2000).fadeOut("slow");
	}
}

// 견적관리 시작
// 견적 초기 세팅해주는 클래스
class EstimateSet {
	constructor() {
		this.getEstimateBasic();
		this.getEstimateItem();
		CommonDatas.Temps.estimateSet = this;
	}

	//베이직 견적 storage 저장 함수
	getEstimateBasic() {
		let url;
		url = apiServer + "/api/estimate/basic";
		axios.get(url).then((response) => {
			if (response.data.result === "ok") {
				let form, info, x;
				x = cipher.decAes(response.data.data);
				x = JSON.parse(x);
				form = x.form;
				info = x.info;
				for (x = 0; x < form.length; x++)	form[x].form = cipher.decAes(form[x].form);
				storage.estimateForm = form;
				storage.estimateBasic = info;
			} else {
				msg.set("[getEstimateBasic] Fail to get estimate form(s).");
			}
		}).catch((error) => {
			msg.set("getEstimateBasic 통신 에러입니다.\n" + error);
		});
	}

	//견적 아이템 저장 함수
	getEstimateItem() {
		let url;
		url = apiServer + "/api/estimate/item/";
		axios.get(url).then((response) => {
			if (response.data.result === "ok") {
				let list;
				list = cipher.decAes(response.data.data);
				list = JSON.parse(list);
				storage.item = list;
			} else {
				msg.set("[getEstimateItem] Fail to get item information.");
			}
		}).catch((error) => {
			msg.set("getEstimateItem 통신 에러입니다.\n" + error);
		});
	}

	//영업기회 견적번호 및 현재 영업기회 번호 저장 함수
	soppEstimateNo(soppNo) {
		axios.get("/api/estimate/sopp/" + soppNo).then((response) => {
			if (response.data.result === "ok") {
				let getList = response.data.data;
				getList = cipher.decAes(getList);
				getList = JSON.parse(getList);

				if (getList.length < 1) {
					storage.estimateList = "";
					this.drawEstmVerList();
				} else {

					this.soppEstimateList(getList[0].no);
				}

				storage.estimateVerSoppNo = soppNo;
			}
		});
	}

	//영업기회 견적리스트를 가져오는 함수
	soppEstimateList(estimateNo) {
		axios.get("/api/estimate/" + estimateNo).then((response) => {
			let cnt, x;
			if (response.data.result === "ok") {
				let getList = response.data.data;
				getList = cipher.decAes(getList);
				getList = JSON.parse(getList);

				for (let i = 0; i < getList.length; i++) {
					getList[i].doc = cipher.decAes(getList[i].doc);
				}

				storage.estimateList = getList;

				// SOPP 내 탭에 견적의 수량을 표시
				x = 0;
				if (document.getElementsByClassName("sopp-tab-cnt")[0] != undefined) {
					cnt = document.getElementsByClassName("sopp-tab-cnt")[0].children[2].children[2];
					if (storage.estimateList !== undefined && storage.estimateList.constructor.name === "Array") x = storage.estimateList.length;
					cnt.innerHTML = "<span> " + x + " </span>";
				}


				// 견적 그리기
				this.drawEstmVerList();
			}
		});
	}

	//메인 리스트 데이터 가져오는 함수
	list() {
		axios.get("/api/estimate").then((response) => {
			if (response.data.result === "ok") {
				let getList = response.data.data;
				getList = cipher.decAes(getList);
				getList = JSON.parse(getList);

				if (getList.length > 0) {
					storage.estimateList = getList;
				} else {
					storage.estimateList = "";
				}
				this.drawEstmList();
				this.addSearchList();
			}
		}).catch((error) => {
			msg.set("메인 리스트 에러입니다.\n" + error);
			console.log(error);
			return false;
		});
	}

	//견적 추가에 대한 폼
	addForm() {
		this.clickedAdd();
	}

	//메인 리스트 출력 함수
	drawEstmList() {
		let container, result, job, jsonData, header = [], data = [], ids = [], disDate, str, fnc = [], pageContainer, containerTitle, crudAddBtn, crudUpdateBtn, hideArr, showArr;

		if (storage.estimateList === undefined) {
			msg.set("등록된 견적이 없습니다");
		}
		else {
			if (storage.searchDatas === undefined) {
				jsonData = storage.estimateList;
			} else {
				jsonData = storage.searchDatas;
			}
		}

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);

		crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "estimatePdf", "addPdfForm"];
		showArr = [
			{ element: "estimateList", display: "grid" },
			{ element: "pageContainer", display: "flex" },
			{ element: "searchContainer", display: "block" },
			{ element: "listRange", display: "flex" },
			{ element: "listSearchInput", display: "flex" },
			{ element: "crudAddBtn", display: "flex" },
			{ element: "versionPreview", display: "block" },
			{ element: "previewDefault", display: "block" },
		];
		containerTitle = document.getElementById("containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer");
		container = document.getElementsByClassName("estimateList")[0];

		header = [
			{
				"title": "버전",
				"align": "center",
			},
			{
				"title": "견적명",
				"align": "center",
			},
			{
				"title": "견적일자",
				"align": "center",
			},
			{
				"title": "금액",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"col": 4,
					"align": "center",
				},
			];

			data.push(str);
		} else {
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				disDate = CommonDatas.dateDis(jsonData[i].date);
				disDate = CommonDatas.dateFnc(disDate, "yyyy.mm.dd");

				str = [
					{
						"setData": jsonData[i].version,
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": disDate,
						"align": "center",
					},
					{
						"setData": numberFormat(jsonData[i].total),
						"align": "right",
					},
				];

				fnc.push("CommonDatas.Temps.estimateSet.clickedEstimate(this);");
				ids.push(jsonData[i].no);
				data.push(str);
			}

			let pageNation = CommonDatas.createPaging(pageContainer[0], result[3], "pageMove", "CommonDatas.Temps.estimateSet.drawEstmList", result[0]);
			pageContainer[0].innerHTML = pageNation;
		}

		if (containerTitle !== null) {
			containerTitle.innerText = "견적";
		}
		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		document.getElementById("multiSearchBtn").setAttribute("onclick", "CommonDatas.Temps.estimateSet.searchSubmit();");
		crudAddBtn.innerText = "견적추가";
		crudAddBtn.setAttribute("onclick", "CommonDatas.Temps.estimateSet.clickedAdd();");
		crudUpdateBtn.innerText = "견적수정";
		crudUpdateBtn.setAttribute("onclick", "CommonDatas.Temps.estimateSet.clickedUpdate();");
		CommonDatas.setViewContents(hideArr, showArr);
	}

	//영업기회 버전리스트만 출력하기 위한 리스트 함수
	drawEstmVerList() {
		let container, result, job, jsonData, header = [], data = [], ids = [], disDate, str, fnc = [], pageContainer, containerTitle, crudAddBtn, crudUpdateBtn, hideArr, showArr;

		if (storage.estimateList === undefined) {
			msg.set("등록된 견적이 없습니다");
		}
		else {
			if (storage.searchDatas === undefined) {
				jsonData = storage.estimateList;
			} else {
				jsonData = storage.searchDatas;
			}
		}

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);

		crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "estimatePdf", "addPdfForm"];
		showArr = [
			{ element: "estimateList", display: "grid" },
			{ element: "pageContainer", display: "flex" },
			{ element: "searchContainer", display: "block" },
			{ element: "listRange", display: "flex" },
			{ element: "listSearchInput", display: "flex" },
			{ element: "versionPreview", display: "block" },
			{ element: "previewDefault", display: "block" },
		];
		containerTitle = document.getElementById("containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer");
		container = document.getElementsByClassName("estimateList")[0];

		header = [
			{
				"title": "버전",
				"align": "center",
			},
			{
				"title": "견적명",
				"align": "center",
			},
			{
				"title": "견적일자",
				"align": "center",
			},
			{
				"title": "금액",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"col": 4,
					"align": "center",
				},
			];

			data.push(str);
			crudAddBtn.style.display = "flex";
			crudAddBtn.setAttribute("onclick", "CommonDatas.Temps.estimateSet.clickedAdd();");
		} else {
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				let total = 0;
				disDate = CommonDatas.dateDis(jsonData[i].date);
				disDate = CommonDatas.dateFnc(disDate, "yyyy.mm.dd");

				for (let t = 0; t < jsonData[i].related.estimate.items.length; t++) {
					let item = jsonData[i].related.estimate.items[t];
					total += (item.price * item.quantity) + (item.price * item.quantity * 0.1);
				}

				str = [
					{
						"setData": jsonData[i].version,
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": disDate,
						"align": "center",
					},
					{
						"setData": numberFormat(total),
						"align": "right",
					},
				];

				fnc.push("CommonDatas.Temps.estimateSet.clickedEstmVer(this);");
				ids.push(i);
				data.push(str);
			}

			let pageNation = CommonDatas.createPaging(pageContainer[0], result[3], "pageMove", "CommonDatas.Temps.estimateSet.drawEstmVerList", result[0]);
			pageContainer[0].innerHTML = pageNation;
			crudAddBtn.remove();
		}

		if (containerTitle !== null) {
			containerTitle.innerText = "견적";
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		crudUpdateBtn.innerText = "견적수정";
		crudUpdateBtn.setAttribute("onclick", "CommonDatas.Temps.estimateSet.clickedUpdate();");
		CommonDatas.setViewContents(hideArr, showArr);
	}

	//상세보기에서 Back 실행 함수
	drawBack() {
		let crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let estimatePdf = document.getElementsByClassName("estimatePdf")[0];
		let containerTitle = document.getElementById("containerTitle");
		let hideArr = ["detailBackBtn", "addPdfForm", "mainPdf"];
		let showArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "crudAddBtn", "versionPreview"];
		showArr = [
			{ element: "estimateList", display: "grid" },
			{ element: "pageContainer", display: "flex" },
			{ element: "searchContainer", display: "block" },
			{ element: "listRange", display: "flex" },
			{ element: "listSearchInput", display: "flex" },
			{ element: "crudAddBtn", display: "flex" },
			{ element: "versionPreview", display: "block" },
		];
		let versionList = document.getElementsByClassName("versionList");

		if (containerTitle !== null) {
			containerTitle.innerHTML = "견적";
		}

		if (crudAddBtn !== undefined) {
			crudAddBtn.innerText = "견적추가";
			crudAddBtn.setAttribute("onclick", "CommonDatas.Temps.estimateSet.clickedAdd();");
		}

		crudUpdateBtn.innerText = "견적수정";
		crudUpdateBtn.setAttribute("onclick", "CommonDatas.Temps.estimateSet.clickedUpdate();");

		for (let i = 0; i < versionList.length; i++) {
			let item = versionList[i];
			if (item.style.display !== "none") {
				item.querySelector(".versionListBody[data-click-check=\"true\"]").click();
			}
		}

		if (crudUpdateBtn.style.display !== "none") {
			estimatePdf.style.display = "flex";
		}

		CommonDatas.setViewContents(hideArr, showArr);
		document.getElementsByClassName("copyMainPdf")[0].remove();
	}

	//메인 리스트 클릭 함수
	clickedEstimate(el) {
		let x, cnt, els, color = "#2147b1", estmNo, versionList, thisEle;

		versionList = document.getElementsByClassName("versionList");

		if (versionList.length > 0) {
			for (let i = 0; i < versionList.length; i++) {
				versionList[i].remove();
			}
		}

		thisEle = el;
		versionList = document.createElement("div");
		versionList.className = "versionList";
		thisEle.after(versionList);
		cnt = thisEle.parentElement;
		els = cnt.children;

		for (x = 1; x < els.length; x++) {
			els[x].style.backgroundColor = "";
			els[x].style.color = "";
		}

		thisEle.style.backgroundColor = color;
		thisEle.style.color = "#ffffff";
		estmNo = thisEle.dataset.id;
		this.getEstmVerList(estmNo);
		setTimeout(() => {
			storage.thisEle = thisEle.nextSibling.getElementsByClassName("versionListBody")[0];
			thisEle.nextSibling.getElementsByClassName("versionListBody")[0].click();
		}, 300);
	}

	//메인 버전 리스트 클릭 함수
	clickedEstmVer(el) {
		let x, cnt, els, color = "#e1e9ff", versionList, title, userName;
		els = el.parentElement.children;
		for (x = 1; x < els.length; x++)	els[x].style.backgroundColor = "";
		el.style.backgroundColor = color;
		x = el.dataset.id * 1;
		el.dataset.clickCheck = true;
		storage.detailIdx = x;

		if (document.getElementsByClassName("versionList")[0] !== undefined) {
			versionList = document.getElementsByClassName("versionList")[0];
			title = versionList.getElementsByClassName("versionListBody")[0].children[1].innerHTML;
			userName = versionList.getElementsByClassName("versionListBody")[0].children[2].innerHTML;
		} else {
			title = el.children[1].children[0].innerText;
			userName = storage.user[R.sopp.owner].userName;
		}

		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let estimatePdf = document.getElementsByClassName("estimatePdf")[0];
		estimatePdf.setAttribute("onclick", "CommonDatas.Temps.estimateSet.estimatePdf(\"" + title + "\", \"" + userName + "\");");
		crudUpdateBtn.style.display = "flex";
		estimatePdf.style.display = "flex";

		if (storage.estimateVerList === undefined) {
			document.getElementsByClassName("versionPreview")[0].innerHTML = storage.estimateList[x].doc;
		} else {
			document.getElementsByClassName("versionPreview")[0].innerHTML = storage.estimateVerList[x].doc;
		}

		let versionPreview = document.getElementsByClassName("versionPreview")[0];
		let indexMain = versionPreview.children;

		for (let i = 0; i < indexMain.length; i++) {
			if (indexMain[i].className === "mainPdf") {
				indexMain[i].remove();
			}
		}

		indexMain[indexMain.length - 1].setAttribute("class", "mainPreviewPdf");
		indexMain[indexMain.length - 1].setAttribute("id", "estPrintPdf");
	}

	//메인 버전리스트 저장 함수
	getEstmVerList(estmNo) {
		axios.get("/api/estimate/" + estmNo).then((response) => {
			if (response.data.result === "ok") {
				let getList = response.data.data;
				getList = cipher.decAes(getList);
				getList = JSON.parse(getList);

				for (let i = 0; i < getList.length; i++) {
					getList[i].doc = cipher.decAes(getList[i].doc);
				}

				storage.estimateVerList = getList;
				this.drawPanelVerList();
			}

		}).catch((error) => {
			alert("버전 리스트 에러입니다.\n" + error);
		});
	}

	//메인 버전리스트 셋팅 함수
	drawPanelVerList() {
		let versionList, html = "", x;
		versionList = document.getElementsByClassName("versionList")[0];
		html = "<div class=\"versionListHeader\">";
		html += "<div>버전</div>";
		html += "<div>견적명</div>";
		html += "<div>담당자</div>";
		html += "<div>견적일자</div>";
		html += "<div>금액</div>";
		html += "</div>";

		for (x = storage.estimateVerList.length - 1; x >= 0; x--) {
			let total = 0, dateSet;

			for (let i = 0; i < storage.estimateVerList[x].related.estimate.items.length; i++) {
				let item = storage.estimateVerList[x].related.estimate.items[i];
				total += (item.price * item.quantity) + (item.price * item.quantity * 0.1);
			}

			dateSet = CommonDatas.dateDis(storage.estimateVerList[x].date);
			dateSet = CommonDatas.dateFnc(dateSet);

			html += "<div class=\"versionListBody\" onclick=\"CommonDatas.Temps.estimateSet.clickedEstmVer(this)\" data-id=\"" + x + "\">";
			html += "<div style=\"justify-content: center;\">" + storage.estimateVerList[x].version + "</div>";
			html += "<div style=\"justify-content: left;\">" + storage.estimateVerList[x].title + "</div>";
			html += "<div style=\"justify-content: center;\">" + storage.user[storage.estimateVerList[x].writer].userName + "</div>";
			html += "<div style=\"justify-content: center;\">" + dateSet + "</div>";
			html += "<div style=\"justify-content: right;\">" + numberFormat(total) + "</div>";
			html += "</div>";
		}

		versionList.innerHTML = html;
	}

	//견적 상세보기 셋팅 함수
	clickedUpdate() {
		let containerTitle, crudUpdateBtn, hideArr, showArr, mainPdf, copyMainPdf;
		containerTitle = document.getElementById("containerTitle");
		mainPdf = document.getElementsByClassName("addPdfForm")[0].getElementsByClassName("mainPdf")[0];
		copyMainPdf = document.createElement("div");
		copyMainPdf.className = "copyMainPdf";
		copyMainPdf.innerHTML = mainPdf.innerHTML;
		mainPdf.after(copyMainPdf);
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		hideArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "versionPreview", "estimatePdf", "mainPdf"];
		showArr = [
			{
				element: "detailBackBtn",
				display: "flex",
			},
			{
				element: "crudAddBtn",
				display: "flex",
			},
			{
				element: "crudUpdateBtn",
				display: "flex",
			},
			{
				element: "addPdfForm",
				display: "block",
			},
		];

		this.copyContainer = document.getElementsByClassName("copyMainPdf")[0];

		if (storage.estimateVerList !== undefined) {
			storage.estmDetail = storage.estimateVerList[storage.detailIdx];
			let crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
			crudAddBtn.innerText = "새견적추가";
			crudAddBtn.setAttribute("onclick", "let estimate = new Estimate(); estimate.insert();");
		} else {
			storage.estmDetail = storage.estimateList[storage.detailIdx];
		}

		crudUpdateBtn.setAttribute("onclick", "let estimate = new Estimate(storage.estmDetail.related.estimate); estimate.update();");
		CommonDatas.setViewContents(hideArr, showArr);
		this.estimateFormInit();
	}

	//견적 추가 셋팅 함수
	clickedAdd() {
		let containerTitle, crudAddBtn, hideArr, showArr, mainPdf, copyMainPdf;
		containerTitle = document.getElementById("containerTitle");
		mainPdf = document.getElementsByClassName("mainPdf");

		if (mainPdf.length > 1) {
			mainPdf = document.getElementsByClassName("mainPdf")[1];
		} else {
			mainPdf = document.getElementsByClassName("mainPdf")[0];
		}

		copyMainPdf = document.createElement("div");
		copyMainPdf.className = "copyMainPdf";
		copyMainPdf.innerHTML = mainPdf.innerHTML;
		crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		mainPdf.after(copyMainPdf);
		hideArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "versionPreview", "crudUpdateBtn", "estimatePdf", "mainPdf"];
		showArr = [
			{
				element: "detailBackBtn",
				display: "flex",
			},
			{
				element: "crudAddBtn",
				display: "flex",
			},
			{
				element: "copyMainPdf",
				display: "block",
			},
			{
				element: "addPdfForm",
				display: "block",
			},
		];

		this.copyContainer = document.getElementsByClassName("copyMainPdf")[0];
		crudAddBtn.innerText = "새견적추가";
		crudAddBtn.setAttribute("onclick", "let estimate = new Estimate(); estimate.insert();");
		CommonDatas.setViewContents(hideArr, showArr);
		storage.estmDetail = undefined;
		this.estimateFormInit();
	}

	//견적 추가 및 상세보기 시 폼안에 value 값들을 설정해주는 함수
	estimateFormInit() {
		let selectAddress, writer, date, pdfMainContentAddBtns;
		selectAddress = this.copyContainer.getElementsByClassName("selectAddress")[0].querySelector("select");
		writer = this.copyContainer.querySelector("#writer");
		date = this.copyContainer.querySelector("#date");
		pdfMainContentAddBtns = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0];

		let html = "";
		for (let index in storage.estimateBasic) {
			html += "<option value=\"" + index + "\">" + storage.estimateBasic[index].name + "</option>";
		}

		selectAddress.innerHTML = html;
		writer.value = storage.user[storage.my].userName;
		date.value = new Date().toISOString().substring(0, 10);

		if (storage.estmDetail !== undefined) {
			writer.value = storage.user[storage.estmDetail.writer].userName;
			for (let key in storage.estmDetail.related.estimate) {
				let keyId = this.copyContainer.querySelector("#" + key);

				if (keyId !== undefined && keyId !== null) {
					let value = storage.estmDetail.related.estimate[key];
					if (key === "date") {
						if (storage.estmDetail.related.estimate[key] !== null) {
							value = new Date(storage.estmDetail.related.estimate[key]);
							value = CommonDatas.dateDis(value);
							value = CommonDatas.dateFnc(value);
						} else {
							value = new Date().toISOString().substring(0, 10);
						}
					} else if (key === "customer") {
						keyId.dataset.value = value;
						value = storage.customer[value].custName;
					}
					keyId.value = value;
				}
			}

			if (storage.estmDetail.related.estimate.items.length > 0) {
				let estimate = new Estimate(storage.estmDetail.related.estimate);
				estimate.detail();
			}
		}

		let detailChild = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].children;
		for (let i = 0; i < detailChild.length; i++) {
			let item = detailChild[i];
			if (item.getAttribute("class") !== "pdfMainContentAddBtns") {
				item.style.gridTemplateColumns = "10% 10% 20% 10% 10% 10% 10% 10% 10%";
			}
		}

		this.selectAddressInit();
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor(this.copyContainer), 100);
	}

	//견적 아이템 항목에 대한 textarea id 값 부여 함수
	productNameSet() {
		let pdfMainContentItem, itemProductName;
		pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContentItem");
		itemProductName = this.copyContainer.getElementsByClassName("itemSpec");

		for (let i = 1; i <= pdfMainContentItem.length; i++) {
			itemProductName[i - 1].querySelector("textarea").setAttribute("id", "itemProductName_" + i);
		}
	}

	//아이템의 순서를 셋팅해주는 함수
	addItemIndex() {
		let mainDiv;
		let index = 0;
		mainDiv = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll("div");

		for (let i = 0; i < mainDiv.length; i++) {
			if (mainDiv[i].getAttribute("class") === "pdfMainContentItem") {
				index++;
				mainDiv[i].getElementsByClassName("itemIndex")[0].innerHTML = index;
			} else if (mainDiv[i].getAttribute("class") === "pdfMainContentTitle") {
				index = 0;
			}
		}
	}

	//회사 주소들을 셋팅해주는 함수
	selectAddressInit(index) {
		let firmName, representative, address, phone, fax;
		firmName = this.copyContainer.querySelector("#firmName");
		representative = this.copyContainer.querySelector("#representative");
		address = this.copyContainer.getElementsByClassName("address")[1];
		phone = this.copyContainer.querySelector("#phone");
		fax = this.copyContainer.querySelector("#fax");

		if (index === undefined) {
			firmName.value = storage.estimateBasic[1].firmName;
			representative.value = storage.estimateBasic[1].representative;
			address.value = storage.estimateBasic[1].address;
			phone.value = storage.estimateBasic[1].phone;
			fax.value = storage.estimateBasic[1].fax;
		} else {
			firmName.value = storage.estimateBasic[index].firmName;
			representative.value = storage.estimateBasic[index].representative;
			address.value = storage.estimateBasic[index].address;
			phone.value = storage.estimateBasic[index].phone;
			fax.value = storage.estimateBasic[index].fax;
		}
	}

	//견적 메인 검색 리스트 저장 함수
	addSearchList() {
		storage.searchList = [];

		for (let i = 0; i < storage.estimateList.length; i++) {
			let total, title, version, disDate, setDate;
			disDate = CommonDatas.dateDis(storage.estimateList[i].date);
			setDate = parseInt(CommonDatas.dateFnc(disDate).replaceAll("-", ""));
			title = storage.estimateList[i].title;
			version = storage.estimateList[i].version;
			total = storage.estimateList[i].total;
			storage.searchList.push("#" + title + "#" + version + "#date" + setDate + "#price" + total);
		}
	}

	//견적 메인 검색 버튼 실행 함수
	searchSubmit() {
		let dataArray = [], resultArray, eachIndex = 0, searchTitle, searchVersion, searchPriceFrom, searchDateFrom;

		searchTitle = "#1/" + document.getElementById("searchTitle").value;
		searchVersion = "#2/" + document.getElementById("searchVersion").value;
		searchPriceFrom = (document.getElementById("searchPriceFrom").value === "") ? "" : document.getElementById("searchPriceFrom").value.replaceAll(",", "") + "#price" + document.getElementById("searchPriceTo").value.replaceAll(",", "");
		searchDateFrom = (document.getElementById("searchDateFrom").value === "") ? "" : document.getElementById("searchDateFrom").value.replaceAll("-", "") + "#date" + document.getElementById("searchDateTo").value.replaceAll("-", "");

		let searchValues = [searchTitle, searchVersion, searchPriceFrom, searchDateFrom];

		for (let i = 0; i < searchValues.length; i++) {
			if (searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null) {
				let tempArray = CommonDatas.searchDataFilter(storage.estimateList, searchValues[i], "multi");

				for (let t = 0; t < tempArray.length; t++) {
					dataArray.push(tempArray[t]);
				}

				eachIndex++;
			}
		}

		resultArray = CommonDatas.searchMultiFilter(eachIndex, dataArray, storage.estimateList);

		storage.searchDatas = resultArray;

		if (storage.searchDatas.length == 0) {
			msg.set("찾는 데이터가 없습니다.");
			storage.searchDatas = storage.estimateList;
		}

		this.drawEstmList();
	}

	//견적 메인 input 검색 keyup 함수
	searchInputKeyup() {
		let searchAllInput, tempArray;
		searchAllInput = document.getElementById("searchAllInput").value;
		tempArray = CommonDatas.searchDataFilter(storage.estimateList, searchAllInput, "input");

		if (tempArray.length > 0) {
			storage.searchDatas = tempArray;
		} else {
			storage.searchDatas = "";
		}

		this.drawEstmList();
	}

	//견적 타이틀 추가 함수
	addEstTitle(e) {
		let thisEle, subTitleIndex, createDiv;
		createDiv = document.createElement("div");
		createDiv.className = "pdfMainContentTitle";
		createDiv.style.gridTemplateColumns = "10% 10% 20% 10% 10% 10% 10% 10% 10%";
		createDiv.innerHTML = "<div class=\"subTitleIndex\"></div><div class=\"subTitle\"><input type=\"text\" placeholder=\"타이틀입력\"></div><div></div><div></div><div></div><div class=\"subTitleTotal\"></div><div></div><div></div>";
		thisEle = e;
		thisEle.parentElement.before(createDiv);
		subTitleIndex = this.copyContainer.getElementsByClassName("subTitleIndex");
		subTitleIndex[subTitleIndex.length - 1].innerHTML = this.romanize(subTitleIndex.length);
		storage.subItemLength = 0;
	}

	//견적 아이템 추가 함수
	addEstItem(e) {
		let thisEle, createDiv;
		createDiv = document.createElement("div");
		createDiv.className = "pdfMainContentItem";
		createDiv.style.gridTemplateColumns = "10% 10% 20% 10% 10% 10% 10% 10% 10%";
		createDiv.innerHTML = "<div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><input type=\"text\" data-complete=\"product\" data-value=\"0\" onclick=\"CommonDatas.addAutoComplete(this);\" onkeyup=\"CommonDatas.addAutoComplete(this);\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"CommonDatas.Temps.estimateSet.itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"CommonDatas.Temps.estimateSet.itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"CommonDatas.Temps.estimateSet.oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"CommonDatas.Temps.estimateSet.oneEstItemRemove(this);\">-</button></div>";
		thisEle = e;
		thisEle.parentElement.before(createDiv);
		this.productNameSet();
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor(this.copyContainer), 100);
		this.addItemIndex();
	}

	//견적 아이템 + 버튼 함수
	oneEstItemAdd(e) {
		let thisEle, parent, createDiv;
		createDiv = document.createElement("div");
		createDiv.className = "pdfMainContentItem";
		createDiv.style.gridTemplateColumns = "10% 10% 20% 10% 10% 10% 10% 10% 10%";
		createDiv.innerHTML = "<div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><input type=\"text\" data-complete=\"product\" data-value=\"0\" onclick=\"CommonDatas.addAutoComplete(this);\" onkeyup=\"CommonDatas.addAutoComplete(this);\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"CommonDatas.Temps.estimateSet.itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"CommonDatas.Temps.estimateSet.itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"CommonDatas.Temps.estimateSet.oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"CommonDatas.Temps.estimateSet.oneEstItemRemove(this);\">-</button></div>";
		thisEle = e;
		parent = thisEle.parentElement.parentElement;
		parent.after(createDiv);
		this.productNameSet();
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor(this.copyContainer), 100);
		this.addItemIndex();
	}

	//견적 아이템 제거 함수
	removeEstItem(e) {
		let thisEle;
		thisEle = e;

		if (thisEle.parentElement.previousSibling.getAttribute("class") !== "pdfMainContentHeader") {
			thisEle.parentElement.previousSibling.remove();
		}

		this.addItemIndex();
		this.setTotalHtml();
		this.setTitleTotal();
	}

	//견적 아이템 - 버튼 함수
	oneEstItemRemove(e) {
		let thisEle, parent;
		thisEle = e;
		parent = thisEle.parentElement.parentElement;
		parent.remove();
		this.addItemIndex();
		this.setTotalHtml();
		this.setTitleTotal();
	}

	//견적 타이틀 번호 로마 숫자로 변환할때 쓰는 함수
	romanize(num) {
		let digits, key, roman, i;
		if (isNaN(num)) return NaN;
		digits = String(+num).split("");
		key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM", "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
		roman = "";
		i = 3;
		while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
		return Array(+digits.join("") + 1).join("M") + roman;
	}

	//견적 현재 아이템 총합 계산 함수
	itemCalKeyup(e) {
		let thisEle, itemQuantity, itemAmount, itemTotal, cal;
		thisEle = e;
		itemQuantity = thisEle.parentElement.parentElement.getElementsByClassName("itemQuantity")[0].children[0];
		itemAmount = thisEle.parentElement.parentElement.getElementsByClassName("itemAmount")[0].children[0];
		itemTotal = thisEle.parentElement.parentElement.getElementsByClassName("itemTotal")[0];

		if (itemQuantity.value === "") {
			itemQuantity.value = 1;
		}

		thisEle.value = thisEle.value.replace(/[^0-9]/g, "");
		cal = parseInt(itemAmount.value.replaceAll(",", "")) * parseInt(itemQuantity.value);
		itemTotal.innerHTML = cal.toLocaleString("en-US");
		inputNumberFormat($(e));
		this.setTotalHtml();
		this.setTitleTotal();
	}

	//주소 변경 함수
	selectAddressChange(e) {
		let thisEle, thisEleIndex;
		thisEle = e;
		thisEleIndex = thisEle.value;
		this.selectAddressInit(thisEleIndex);
	}

	//견적 아이템 공급가액, 부가세액, 총합을 계산하는 함수
	setTotalHtml() {
		let pdfMainContentAmount, pdfMainContentTotal, pdfHeadInfoPrice, pdfMainContentItem, pdfMainContentTax, calAmount = 0;
		pdfMainContentAmount = this.copyContainer.getElementsByClassName("pdfMainContentAmount")[0].querySelectorAll("div")[1];
		pdfMainContentTotal = this.copyContainer.getElementsByClassName("pdfMainContentTotal")[0].querySelectorAll("div")[1];
		pdfHeadInfoPrice = this.copyContainer.getElementsByClassName("pdfHeadInfoPrice")[0].querySelectorAll("div")[0].children[2];
		pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContentItem");
		pdfMainContentTax = this.copyContainer.getElementsByClassName("pdfMainContentTax")[0].querySelectorAll("div")[1];

		for (let i = 0; i < pdfMainContentItem.length; i++) {
			let item = parseInt(pdfMainContentItem[i].getElementsByClassName("itemTotal")[0].innerHTML.replace(/,/g, ""));

			if (isNaN(item)) {
				item = 0;
			}

			calAmount += item;
		}

		pdfMainContentAmount.innerHTML = calAmount.toLocaleString("en-US");

		if (this.copyContainer.querySelector("#vatTrue").checked) {
			pdfMainContentTax.innerHTML = parseInt(pdfMainContentAmount.innerHTML.replace(/,/g, "") / 10).toLocaleString("en-US");
		} else {
			pdfMainContentTax.innerHTML = 0;
		}

		pdfMainContentTotal.innerHTML = (calAmount + parseInt(pdfMainContentTax.innerHTML.replace(/,/g, ""))).toLocaleString("en-US");
		pdfHeadInfoPrice.value = pdfMainContentTotal.innerHTML;
	}

	//견적 타이틀 총합 계산 출력해주는 함수
	setTitleTotal() {
		let mainDiv;
		let calTotal = 0;
		mainDiv = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll("div");

		for (let i = mainDiv.length - 1; i >= 0; i--) {
			if (mainDiv[i].getAttribute("class") === "pdfMainContentItem") {
				if (mainDiv[i].getElementsByClassName("itemTotal")[0].innerHTML !== "") {
					calTotal += parseInt(mainDiv[i].getElementsByClassName("itemTotal")[0].innerHTML.replace(/,/g, ""));
				}
			} else if (mainDiv[i].getAttribute("class") === "pdfMainContentTitle") {
				mainDiv[i].getElementsByClassName("subTitleTotal")[0].innerHTML = calTotal.toLocaleString("en-Us");
				calTotal = 0;
			}
		}
	}

	//견적 추가/수정 시 모든 input 및 textarea 등을 제거하고 텍스트만 그대로 div로 이동시키는 함수
	insertCopyPdf() {
		let mainPdf, pdfMainContentAddBtns;
		pdfMainContentAddBtns = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0];
		this.copyContainer.getElementsByClassName("selectAddress")[0].remove();
		pdfMainContentAddBtns.remove();

		if (typeof CKEDITOR !== undefined) {
			if ($(CKEDITOR.instances).length) {
				for (var key in CKEDITOR.instances) {
					CKEDITOR.instances[key].destroy();
				}
			}
		}

		let mainInput = this.copyContainer.querySelectorAll("input");
		for (let i = 0; i < mainInput.length; i++) {
			let item = mainInput[i];
			let parent = item.parentElement;

			if (item.getAttribute("type") === "radio") {
				if (item.getAttribute("name") === "vat") {
					let createDiv = document.createElement("div");
					createDiv.className = "afterDiv";

					if (this.copyContainer.querySelector("[name=\"vat\"]").checked && this.copyContainer.querySelector("[name=\"vat\"]").dataset.value) {
						createDiv.innerText = " (VAT 포함)";
						item.after(createDiv);
					} else if (this.copyContainer.querySelector("[name=\"vat\"]").checked && !this.copyContainer.querySelector("[name=\"vat\"]").dataset.value) {
						createDiv.innerText = " (VAT 비포함)";
						item.after(createDiv);
					}

					for (let i = 0; i < parent.querySelectorAll("input[type=\"radio\"]").length; i++) {
						parent.querySelectorAll("input[type=\"radio\"]")[i].remove();
					}

					for (let i = 0; i < parent.querySelectorAll("label").length; i++) {
						parent.querySelectorAll("label")[i].remove();
					}
				}
			} else {
				let createDiv = document.createElement("div");
				createDiv.className = "afterDiv";

				if (parent.getAttribute("class") === "vatInfo") {
					createDiv.innerText = item.value;
					parent.children[1].after(createDiv);
					item.remove();
				} else {
					createDiv.innerText = item.value;
					parent.append(createDiv);
					item.remove();
				}
			}
		}

		let createSpan = document.createElement("span");
		createSpan.style.fontSize = "11px";
		createSpan.style.display = "flex";
		createSpan.style.alignItems = "center";
		createSpan.style.paddingLeft = "3px";
		createSpan.style.paddingRight = "3px";
		createSpan.innerText = "/";
		this.copyContainer.getElementsByClassName("headInfoCustomer")[0].querySelectorAll(".afterDiv")[0].after(createSpan);

		createSpan = document.createElement("span");
		createSpan.style.fontSize = "11px";
		createSpan.style.display = "flex";
		createSpan.style.alignItems = "center";
		createSpan.style.paddingLeft = "3px";
		createSpan.style.paddingRight = "3px";
		createSpan.innerText = "/";
		this.copyContainer.getElementsByClassName("headInfoPhone")[0].querySelectorAll(".afterDiv")[0].after(createSpan);

		let pdfMainContainer = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll("div");
		for (let i = 0; i < pdfMainContainer.length; i++) {
			let item = pdfMainContainer[i];
			if (item.getAttribute("class") === "pdfMainContentHeader" || item.getAttribute("class") === "pdfMainContentTitle" || item.getAttribute("class") === "pdfMainContentItem") {
				item.querySelectorAll("div")[item.querySelectorAll("div").length - 1].remove();
				item.style.gridTemplateColumns = "10% 10% 30% 10% 10% 10% 10% 10%";
			}
		}

		let textarea = this.copyContainer.querySelectorAll("textarea");
		for (let i = 0; i < textarea.length; i++) {
			let item = textarea[i];
			let parent = item.parentElement;
			let createDiv = document.createElement("div");
			createDiv.className = "afterDiv";
			createDiv.innerText = item.value.replace(/<p>/g, "").replace(/<\/p>/g, "").replace(/\/r/g, "").replace(/\/n/g, "").replace(/<br \/>/g, "");
			parent.appendChild(createDiv);
			item.remove();
		}
	}

	//견적 pdf 다운로드 클릭 시 실행되는 함수
	estimatePdf(title, userName) {
		let element = document.getElementById("estPrintPdf");

		html2pdf().from(element).set({
			margin: 0,
			filename: title + "_" + userName + ".pdf",
			html2canvas: { width: 835, height: 1000, scale: 10 },
			jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: true }
		}).save();
	}
}

// 견적관리 crud
// 견적 등록/상세/수정 기능에 관한 클래스(this 처리에 대한 부분 아직 미적용 추후 수정할 예정(insert와 update도 합칠 예정))
class Estimate {
	constructor(getData) {
		if (getData !== undefined) {
			this.doc = getData.doc;
			this.address = getData.address;
			this.cip = getData.cip;
			this.customer = getData.customer;
			this.date = getData.date;
			this.fax = getData.fax;
			this.firmName = getData.firmName;
			this.form = getData.form;
			this.items = getData.items;
			this.phone = getData.phone;
			this.representative = getData.representative;
			this.title = getData.title;
			this.width = getData.width;
			this.height = getData.height;
			this.no = getData.no;
			this.version = getData.version;
			this.related = getData.related;
			this.remarks = getData.remarks;
		}
		this.copyContainer = document.getElementsByClassName("copyMainPdf")[0];
	}

	//견적 상세보기 아이템 셋팅 함수
	detail() {
		let thisBtn;
		let items = this.items;

		for (let i = 0; i < items.length; i++) {
			let createDiv = document.createElement("div");
			createDiv.className = "pdfMainContentItem";

			if (this.form === "서브타이틀") {
				let pdfMainContentTitle = this.copyContainer.getElementsByClassName("pdfMainContentTitle");

				if (pdfMainContentTitle.length == 0 || pdfMainContentTitle === undefined) {
					thisBtn = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0].querySelector("button");
					CommonDatas.Temps.estimateSet.addEstTitle(thisBtn);
					let subTitle = this.copyContainer.getElementsByClassName("subTitle");
					subTitle[i].querySelector("input").value = items[i].title;
				}
			}

			createDiv.innerHTML = "<div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><input type=\"text\" data-complete=\"product\" data-value=\"0\" onclick=\"CommonDatas.addAutoComplete(this);\" onkeyup=\"CommonDatas.addAutoComplete(this);\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"CommonDatas.Temps.estimateSet.itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"CommonDatas.Temps.estimateSet.itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"CommonDatas.Temps.estimateSet.oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"CommonDatas.Temps.estimateSet.oneEstItemRemove(this);\">-</button></div>";
			thisBtn = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0].querySelectorAll("button")[1];
			thisBtn.parentElement.before(createDiv);
			let pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContentItem")[i];
			pdfMainContentItem.getElementsByClassName("itemDivision")[0].querySelector("input").value = items[i].div;
			pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("input").value = items[i].item;
			pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("input").dataset.value = 0;

			for (let t = 0; t < storage.product.length; t++) {
				if (storage.product[t].productNo.toString() === items[i].item) {
					pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("input").value = storage.product[t].productName;
					pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("input").dataset.value = storage.product[t].productNo;
				}
			}

			pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("textarea").value = items[i].spec;
			pdfMainContentItem.getElementsByClassName("itemQuantity")[0].querySelector("input").value = items[i].quantity;
			pdfMainContentItem.getElementsByClassName("itemAmount")[0].querySelector("input").value = numberFormat(items[i].price);
			pdfMainContentItem.getElementsByClassName("itemRemarks")[0].querySelector("input").value = items[i].remark;
			CommonDatas.Temps.estimateSet.itemCalKeyup(pdfMainContentItem.getElementsByClassName("itemAmount")[0].querySelector("input"));
		}

		CommonDatas.Temps.estimateSet.productNameSet();
		CommonDatas.Temps.estimateSet.addItemIndex();
	}

	//새 견적 추가 실행 함수
	insert() {
		if (this.copyContainer.querySelector("#date").value === "") {
			msg.set("견적일자를 입력해주세요.");
			this.copyContainer.querySelector("#date").focus();
			return false;
		} else if (this.copyContainer.querySelector("#title").value === "") {
			msg.set("사업명을 입력해주세요.");
			this.copyContainer.querySelector("#title").focus();
			return false;
		} else if (this.copyContainer.querySelector("#customer").value === "") {
			msg.set("고객사를 입력해주세요.");
			this.copyContainer.querySelector("#customer").focus();
			return false;
		} else if (!validateAutoComplete($("#customer").val(), "customer")) {
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			this.copyContainer.querySelector("#customer").focus();
			return false;
		} else if (this.copyContainer.querySelector("#cip").value === "") {
			msg.set("고객사 담당자를 입력해주세요.");
			this.copyContainer.querySelector("#cip").focus();
			return false;
		} else if (!validateAutoComplete($("#cip").val(), "cip")) {
			msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
			this.copyContainer.querySelector("#cip").focus();
			return false;
		} else if (this.copyContainer.querySelector("#exp").value === "") {
			msg.set("유효기간을 입력해주세요.");
			this.copyContainer.querySelector("#exp").focus();
			return false;
		} else if (this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll(".pdfMainContentItem").length < 1) {
			msg.set("항목을 1개 이상 추가하여 입력해주세요.");
			return false;
		} else {
			let address, cip, customer, date, exp, fax, firmName, phone, representative, title, pdfMainContentTitle, pdfMainContentItem, addPdfForm, items, form, datas, remarks, soppNo;
			pdfMainContentTitle = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll(".pdfMainContentTitle");
			pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll(".pdfMainContentItem");
			remarks = CKEDITOR.instances.remarks.getData().replaceAll("\n", "");
			address = this.copyContainer.getElementsByClassName("address")[1].value;
			cip = this.copyContainer.querySelector("#cip").value;
			customer = this.copyContainer.querySelector("#customer").dataset.value.toString();
			date = new Date(this.copyContainer.querySelector("#date").value).getTime();
			exp = this.copyContainer.querySelector("#exp").value;
			fax = this.copyContainer.querySelector("#fax").value;
			firmName = this.copyContainer.querySelector("#firmName").value;
			phone = this.copyContainer.querySelector("#phone").value;
			representative = this.copyContainer.querySelector("#representative").value;
			title = this.copyContainer.querySelector("#title").value;
			soppNo = (storage.estimateVerSoppNo === undefined) ? null : storage.estimateVerSoppNo;
			items = [];

			if (pdfMainContentTitle.length > 0) {
				form = "서브타이틀";
			} else {
				form = "기본견적서";
			}

			for (let i = 0; i < pdfMainContentItem.length; i++) {
				let item = pdfMainContentItem[i];
				let textareaId = item.getElementsByClassName("itemSpec")[0].querySelector("textarea").getAttribute("id");
				let itemTitle = $(item).prevAll(".pdfMainContentTitle").eq(0).find(".subTitle").children().val();
				let price;

				if (this.copyContainer.querySelector("[name=\"vat\"]:checked").dataset.value) {
					let tax = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "") / 10);
					price = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "")) + parseInt(tax);
				} else {
					price = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", ""));
				}

				if (itemTitle === undefined) {
					itemTitle = "";
				}

				let itemDatas = {
					"div": item.getElementsByClassName("itemDivision")[0].children[0].value,
					"price": parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "")),
					"quantity": parseInt(item.getElementsByClassName("itemQuantity")[0].children[0].value),
					"remark": item.getElementsByClassName("itemRemarks")[0].children[0].value,
					"spec": CKEDITOR.instances[textareaId].getData().replaceAll("\n", ""),
					"item": (item.getElementsByClassName("itemSpec")[0].children[0].dataset.value === undefined || item.getElementsByClassName("itemSpec")[0].children[0].dataset.value.toString() === "0") ? item.getElementsByClassName("itemSpec")[0].children[0].value.toString() : item.getElementsByClassName("itemSpec")[0].children[0].dataset.value.toString(),
					"supplier": this.copyContainer.querySelector("#customer").dataset.value.toString(),
					"title": itemTitle,
					"vat": this.copyContainer.querySelector("[name=\"vat\"]:checked").dataset.value,
				};
				items.push(itemDatas);
			}

			CommonDatas.Temps.estimateSet.insertCopyPdf();

			setTimeout(() => {
				addPdfForm = document.getElementsByClassName("addPdfForm")[0];

				datas = {
					"doc": addPdfForm.innerHTML.replaceAll("\r", "").replaceAll("\n", ""),
					"address": address,
					"cip": cip,
					"customer": customer,
					"date": date,
					"exp": exp,
					"fax": fax,
					"firmName": firmName,
					"form": form,
					"items": items,
					"phone": phone,
					"representative": representative,
					"title": title,
					"width": 210,
					"height": 297,
					"no": null,
					"version": 1,
					"related": {
						"parent": "sopp:" + soppNo + "",
						"previous": null,
						"next": [null],
						"estimate": {
							"doc": addPdfForm.innerHTML.replaceAll("\r", "").replaceAll("\n", ""),
							"address": address,
							"cip": cip,
							"customer": customer,
							"date": date,
							"exp": exp,
							"fax": fax,
							"firmName": firmName,
							"form": form,
							"items": items,
							"phone": phone,
							"representative": representative,
							"title": title,
							"width": 210,
							"height": 297,
							"no": null,
							"version": 1,
							"remarks": remarks,
						}
					},
					"remarks": remarks,
				};

				datas = JSON.stringify(datas);
				datas = cipher.encAes(datas);

				axios.post("/api/estimate", datas, {
					headers: { "Content-Type": "text/plain" }
				}).then(() => {
					location.reload();
					msg.set("등록되었습니다.");
				}).catch((error) => {
					msg.set("등록 에러입니다.\n다시 확인해주십시오.\n" + error);
				});
			}, 300)
		}
	}

	//견적 수정 실행 함수
	update() {
		if (this.copyContainer.querySelector("#date").value === "") {
			msg.set("견적일자를 입력해주세요.");
			this.copyContainer.querySelector("#date").focus();
			return false;
		} else if (this.copyContainer.querySelector("#title").value === "") {
			msg.set("사업명을 입력해주세요.");
			this.copyContainer.querySelector("#title").focus();
			return false;
		} else if (this.copyContainer.querySelector("#customer").value === "") {
			msg.set("고객사를 입력해주세요.");
			this.copyContainer.querySelector("#customer").focus();
			return false;
		} else if (!validateAutoComplete($("#customer").val(), "customer")) {
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			$("#customer").focus();
			return false;
		} else if (this.copyContainer.querySelector("#cip").value === "") {
			msg.set("고객사 담당자를 입력해주세요.");
			this.copyContainer.querySelector("#cip").focus();
			return false;
		} else if (!validateAutoComplete($("#cip").val(), "cip")) {
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			this.copyContainer.querySelector("#cip").focus();
			return false;
		} else if (this.copyContainer.querySelector("#exp").value === "") {
			msg.set("유효기간을 입력해주세요.");
			this.copyContainer.querySelector("#exp").focus();
			return false;
		} else if (this.copyContainer.getElementsByClassName("pdfMainContainer")[0].getElementsByClassName("pdfMainContentItem").length < 1) {
			msg.set("항목을 1개 이상 추가하여 입력해주세요.");
			return false;
		} else {
			let address, cip, customer, date, exp, fax, firmName, phone, representative, title, pdfMainContentTitle, pdfMainContentItem, addPdfForm, items, form, datas, remarks, soppNo;
			pdfMainContentTitle = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].getElementsByClassName("pdfMainContentTitle");
			pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].getElementsByClassName("pdfMainContentItem");
			remarks = CKEDITOR.instances.remarks.getData().replaceAll("\n", "");
			address = this.copyContainer.getElementsByClassName("address")[1].value;
			cip = this.copyContainer.querySelector("#cip").value;
			customer = this.copyContainer.querySelector("#customer").dataset.value.toString();
			date = new Date(this.copyContainer.querySelector("#date").value).getTime();
			exp = this.copyContainer.querySelector("#exp").value;
			fax = this.copyContainer.querySelector("#fax").value;
			firmName = this.copyContainer.querySelector("#firmName").value;
			phone = this.copyContainer.querySelector("#phone").value;
			representative = this.copyContainer.querySelector("#representative").value;
			title = this.copyContainer.querySelector("#title").value;
			soppNo = (storage.estimateVerSoppNo === undefined) ? null : storage.estimateVerSoppNo;
			items = [];

			if (pdfMainContentTitle.length > 0) {
				form = "서브타이틀";
			} else {
				form = "기본견적서";
			}

			for (let i = 0; i < pdfMainContentItem.length; i++) {
				let item = pdfMainContentItem[i];
				let textareaId = item.getElementsByClassName("itemSpec")[0].querySelector("textarea").getAttribute("id");
				let itemTitle = $(item).prevAll(".pdfMainContentTitle").eq(0).find(".subTitle").children().val();
				let price;

				if (this.copyContainer.querySelector("[name=\"vat\"]:checked").dataset.value) {
					let tax = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "") / 10);
					price = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "")) + parseInt(tax);
				} else {
					price = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", ""));
				}

				if (itemTitle === undefined) {
					itemTitle = "";
				}

				let itemDatas = {
					"div": item.getElementsByClassName("itemDivision")[0].children[0].value,
					"price": parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "")),
					"quantity": parseInt(item.getElementsByClassName("itemQuantity")[0].children[0].value),
					"remark": item.getElementsByClassName("itemRemarks")[0].children[0].value,
					"spec": CKEDITOR.instances[textareaId].getData().replaceAll("\n", ""),
					"item": (item.getElementsByClassName("itemSpec")[0].children[0].dataset.value === undefined || item.getElementsByClassName("itemSpec")[0].children[0].dataset.value.toString() === "0") ? item.getElementsByClassName("itemSpec")[0].children[0].value.toString() : item.getElementsByClassName("itemSpec")[0].children[0].dataset.value.toString(),
					"supplier": this.copyContainer.querySelector("#customer").dataset.value.toString(),
					"title": itemTitle,
					"vat": this.copyContainer.querySelector("[name=\"vat\"]:checked").dataset.value,
				};

				items.push(itemDatas);
			}

			CommonDatas.Temps.estimateSet.insertCopyPdf();

			setTimeout(() => {
				addPdfForm = document.getElementsByClassName("addPdfForm")[0];

				datas = {
					"doc": addPdfForm.innerHTML.replaceAll("\r", "").replaceAll("\n", ""),
					"address": address,
					"cip": cip,
					"customer": customer,
					"date": date,
					"exp": exp,
					"fax": fax,
					"firmName": firmName,
					"form": form,
					"items": items,
					"phone": phone,
					"representative": representative,
					"title": title,
					"width": 210,
					"height": 297,
					"no": storage.estmDetail.no,
					"version": 1,
					"related": {
						"parent": "sopp:" + soppNo + "",
						"previous": null,
						"next": [null],
						"estimate": {
							"doc": addPdfForm.innerHTML.replaceAll("\r", "").replaceAll("\n", ""),
							"address": address,
							"cip": cip,
							"customer": customer,
							"date": date,
							"exp": exp,
							"fax": fax,
							"firmName": firmName,
							"form": form,
							"items": items,
							"phone": phone,
							"representative": representative,
							"title": title,
							"width": 210,
							"height": 297,
							"no": storage.estmDetail.no,
							"version": 1,
							"remarks": remarks,
						}
					},
					"remarks": remarks,
				};

				datas = JSON.stringify(datas);
				datas = cipher.encAes(datas);

				axios.post("/api/estimate/" + storage.estmDetail.no, datas, {
					headers: { "Content-Type": "text/plain" }
				}).then(() => {
					location.reload();
					msg.set("수정되었습니다.");
				}).catch((error) => {
					msg.set("수정 에러입니다.\n다시 확인해주십시오.\n" + error);
				});
			}, 300)
		}
	}
}

//기술지원 시작
//기술지원 셋팅 함수
class TechSet{
	constructor() {
		CommonDatas.Temps.techSet = this;
	}

	//기술지원 리스트 저장 함수
	list() {
		axios.get("/api/tech/").then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.techList = result;

				if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.sopp === undefined) {
					window.setTimeout(this.drawTechList, 1000);
					window.setTimeout(() => {CommonDatas.searchListSet("techList");}, 1000);
				} else {
					window.setTimeout(this.drawTechList, 200);
					window.setTimeout(CommonDatas.searchListSet("techList"), 200);
				}

				$('.theme-loader').delay(1000).fadeOut("slow");
			}
		}).catch((error) => {
			msg.set("기술지원관리 리스트 에러입니다.\n" + error);
			console.log(error);
		})
	}

	//기술지원 리스트 출력 함수
	drawTechList() {
		let container, result, jsonData, containerTitle, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [], pageContainer, hideArr, showArr, schedFrom, schedTo;

		if (storage.techList === undefined) {
			msg.set("등록된 기술지원이 없습니다");
		}
		else {
			if (storage.searchDatas === undefined) {
				jsonData = storage.techList;
			} else {
				jsonData = storage.searchDatas;
			}
		}

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		containerTitle = document.getElementById("containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer")[0];
		container = document.getElementsByClassName("gridList")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn", "contractReqBtn"];
		showArr = [
			{ element: "gridList", display: "block" },
			{ element: "pageContainer", display: "flex" },
			{ element: "searchContainer", display: "block" },
			{ element: "listRange", display: "flex" },
			{ element: "listSearchInput", display: "flex" },
			{ element: "crudBtns", display: "flex" },
			{ element: "crudAddBtn", display: "flex" },
		];

		header = [
			{
				"title": "등록일",
				"align": "center",
			},
			{
				"title": "등록구분",
				"align": "center",
			},
			{
				"title": "요청명",
				"align": "center",
			},
			{
				"title": "요청내용",
				"align": "center",
			},
			{
				"title": "매출처",
				"align": "center",
			},
			{
				"title": "진행단계",
				"align": "center",
			},
			{
				"title": "담당자",
				"align": "center",
			},
			{
				"title": "시작일",
				"align": "center",
			},
			{
				"title": "종료일",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 9,
				},
			];

			data.push(str);
		} else {
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				disDate = CommonDatas.dateDis(new Date(jsonData[i].regDatetime).getTime(), new Date(jsonData[i].modDatetime).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				disDate = CommonDatas.dateDis(new Date(jsonData[i].schedFrom).getTime());
				schedFrom = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				disDate = CommonDatas.dateDis(new Date(jsonData[i].schedTo).getTime());
				schedTo = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": (jsonData[i].cntrctMth === '10248') ? "유지보수" : "신규영업지원",
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": jsonData[i].desc,
						"align": "left",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].custNo)) ? "" : storage.customer[jsonData[i].custNo].custName,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].techdSteps)) ? "" : storage.code.etc[jsonData[i].techdSteps],
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].userNo)) ? "" : storage.user[jsonData[i].userNo].userName,
						"align": "center",
					},
					{
						"setData": schedFrom,
						"align": "center",
					},
					{
						"setData": schedTo,
						"align": "left",
					},
				];

				fnc.push("CommonDatas.Temps.techSet.techDetailView(this)");
				ids.push(jsonData[i].techdNo);
				data.push(str);
			}

			let pageNation = CommonDatas.createPaging(pageContainer, result[3], "CommonDatas.pageMove", "CommonDatas.Temps.techSet.drawTechList", result[0]);
			pageContainer.innerHTML = pageNation;
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		CommonDatas.setViewContents(hideArr, showArr);
		document.getElementById("multiSearchBtn").setAttribute("onclick", "CommonDatas.Temps.techSet.searchSubmit();");
		containerTitle.innerText = "기술지원조회"

		let path = location.pathname.split("/");

		if (path[3] !== undefined && jsonData !== null) {
			let content = document.querySelector(".gridContent[data-id=\"" + path[3] + "\"]");
			CommonDatas.Temps.techSet.techDetailView(content);
		}
	}

	//기술지원 가져오는 함수
	techDetailView(e) {
		let thisEle = e;

		axios.get("/api/tech/" + thisEle.dataset.id).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				let tech = new Tech(result);
				tech.detail();

				localStorage.setItem("loadSetPage", window.location.pathname);
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//기술지원 등록 폼
	techInsertForm(){
		let html, dataArray, nowDate;
		nowDate = new Date();
		nowDate = nowDate.toISOString().substring(0, 10);

		dataArray = [
			{
				"title": "등록구분(*)",
				"radioValue": [
					{
						"key": "10247",
						"value": "신규영업지원",
					},
					{
						"key": "10248",
						"value": "유지보수",
					},
				],
				"type": "radio",
				"elementName": "cntrctMth",
				"elementId": ["cntrctMthNew", "cntrctMthOld"],
				"onChange": "CommonDatas.Temps.techSet.techRadioChange();",
				"col": 4,
				"disabled": false,
			},
			{
				"title": "영업기회(*)",
				"elementId": "soppNo",
				"complete": "sopp",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "계약(*)",
				"elementId": "contNo",
				"complete": "contract",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "엔드유저(*)",
				"elementId": "endCustNo",
				"disabled": false,
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
			},
			{
				"title": "엔드유저 담당자",
				"complete": "cip",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "custmemberNo",
				"disabled": false,
			},
			{
				"title": "담당자(*)",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "userNo",
				"value": (CommonDatas.emptyValuesCheck(storage.my)) ? "" : storage.user[storage.my].userName,
			},
			{
				"title": "모델",
				"elementId": "techdItemmodel",
				"disabled": false,
				"col": 4,
			},
			{
				"title": "버전",
				"elementId": "techdItemversion",
				"disabled": false,
				"col": 4,
			},
			{
				"title": "단계",
				"selectValue": [
					{
						"key": "10213",
						"value": "접수단계",
					},
					{
						"key": "10214",
						"value": "출동단계",
					},
					{
						"key": "10215",
						"value": "미계약에 따른 보류",
					},
					{
						"key": "10253",
						"value": "처리완료",
					}
				],
				"type": "select",
				"elementId": "techdSteps",
				"disabled": false,
			},
			{
				"title": "지원형태",
				"selectValue": [
					{
						"key": "10187",
						"value": "전화상담",
					},
					{
						"key": "10208",
						"value": "현장방문",
					},
					{
						"key": "10209",
						"value": "원격지원",
					}
				],
				"type": "select",
				"elementId": "type",
				"disabled": false,
			},
			{
				"title": "지원 시작일(*)",
				"elementId": "schedFrom",
				"value": nowDate + "T09:00:00",
				"disabled": false,
				"type": "datetime",
			},
			{
				"title": "지원 종료일(*)",
				"elementId": "schedTo",
				"value": nowDate + "T18:00:00",
				"disabled": false,
				"type": "datetime",
			},
			{
				"title": "장소",
				"elementId": "techdPlace",
				"disabled": false,
			},
			{
				"title": "기술지원명(*)",
				"elementId": "title",
				"disabled": false,
				"col": 3,
			},
			{
				"title": "내용",
				"type": "textarea",
				"elementId": "desc",
				"disabled": false,
				"col": 4,
			},
		];
	
		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70vw";
		modal.content.style.maxWidth = "70vw";
		modal.headTitle.innerText = "기술지원등록";
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.innerText = "등록";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "const tech = new Tech(); CommonDatas.Temps.tech.insert();");
		modal.close.setAttribute("onclick", "modal.hide();");

		storage.formList = {
			"compNo": 0,
			"custNo": 0,
			"soppNo": 0,
			"contNo": 0,
			"cntrctMth": "",
			"endCustNo": 0,
			"custmemberNo": 0,
			"title": "",
			"desc": "",
			"techdCheck": 0,
			"techdItemmodel": "",
			"techdItemversion": "",
			"techdPlace": "",
			"schedFrom": "",
			"schedTo": "",
			"type": "",
			"techdSteps": "",
			"userNo": storage.my,
			"schedType": 0,
			"regDatetime": "",
			"modDatetime": "",
		};
		
		setTimeout(() => {
			let my = storage.my;
			document.getElementById("userNo").value = storage.user[my].userName;
			document.getElementById("userNo").setAttribute("data-change", true);
			CommonDatas.Temps.techSet.techRadioChange();
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//기술지원 검색 버튼 클릭 함수
	searchSubmit() {
		let dataArray = [], resultArray, eachIndex = 0, title, user, cust, cnt, steps, searchSteps, searchUser, searchTitle, searchCust, searchCnt, searchDateFrom, keyIndex = 0;
		searchTitle = document.getElementById("searchTitle");
		searchUser = document.getElementById("searchUser");
		searchCust = document.getElementById("searchCust");
		searchCnt = document.getElementById("searchCnt");
		searchSteps = document.getElementById("searchSteps");
		searchDateFrom = (document.getElementById("searchDateFrom").value === "") ? "" : document.getElementById("searchDateFrom").value.replaceAll("-", "") + "#regDatetime" + document.getElementById("searchDateTo").value.replaceAll("-", "");
		
		for(let key in storage.techList[0]){
			if(key === searchTitle.dataset.key) title = "#" + keyIndex + "/" + searchTitle.value;
			else if(key === searchUser.dataset.key) user = "#" + keyIndex + "/" + searchUser.value;
			else if(key === searchCust.dataset.key) cust = "#" + keyIndex + "/" + searchCust.value;
			else if(key === searchCnt.dataset.key) cnt = "#" + keyIndex + "/" + searchCnt.value;
			else if(key === searchSteps.dataset.key) steps = "#" + keyIndex + "/" + searchSteps.value;
			keyIndex++;
		}

		let searchValues = [title, user, cust, cnt, steps, searchDateFrom];

		for (let i = 0; i < searchValues.length; i++) {
			if(searchValues[i] !== ""){
				let tempArray = CommonDatas.searchDataFilter(storage.techList, searchValues[i], "multi", ["#regDatetime"]);
	
				for (let t = 0; t < tempArray.length; t++) {
					dataArray.push(tempArray[t]);
				}
	
				eachIndex++;
			}
		}
		
		resultArray = CommonDatas.searchMultiFilter(eachIndex, dataArray, storage.techList);

		storage.searchDatas = resultArray;

		if (storage.searchDatas.length == 0) {
			msg.set("찾는 데이터가 없습니다.");
			storage.searchDatas = storage.techList;
		}

		this.drawTechList();
	}

	//기술지원 단일 검색 keyup 이벤트
	searchInputKeyup() {
		let searchAllInput, tempArray;
		searchAllInput = document.getElementById("searchAllInput").value;
		tempArray = CommonDatas.searchDataFilter(storage.techList, searchAllInput, "input");

		if (tempArray.length > 0) {
			storage.searchDatas = tempArray;
		} else {
			storage.searchDatas = "";
		}

		this.drawTechList();
	}

	techRadioChange(){
		let cntrctMth = document.querySelector('input[name="cntrctMth"]:checked');
		let soppNo = document.getElementById("soppNo");
		let contNo = document.getElementById("contNo");

		if(cntrctMth.id === "cntrctMthNew"){
			contNo.value = "";
			contNo.dataset.value = "";
			contNo.dataset.sopp = "";
			soppNo.parentElement.parentElement.style.display = "flex";
			contNo.parentElement.parentElement.style.display = "none";
		}else{
			soppNo.value = "";
			soppNo.dataset.value = "";
			soppNo.parentElement.parentElement.style.display = "none";
			contNo.parentElement.parentElement.style.display = "flex";
		}
	}
}

//기술지원 crud
class Tech{
	constructor(getData){
		CommonDatas.Temps.tech = this;
	
		if (getData !== undefined) {
			this.getData = getData;
			this.techdNo = getData.techdNo;
			this.compNo = getData.compNo;
			this.custNo = getData.custNo;
			this.soppNo = getData.soppNo;
			this.contNo = getData.contNo;
			this.cntrctMth = getData.cntrctMth;
			this.endCustNo = getData.endCustNo;
			this.custmemberNo = getData.custmemberNo;
			this.title = getData.title;
			this.desc = getData.desc;
			this.techdCheck = getData.techdCheck;
			this.techdItemmodel = getData.techdItemmodel;
			this.techdItemversion = getData.techdItemversion;
			this.techdPlace = getData.techdPlace;
			this.schedFrom = getData.schedFrom;
			this.schedTo = getData.schedTo;
			this.type = getData.type;
			this.techdSteps = getData.techdSteps;
			this.userNo = getData.userNo;
			this.schedType = getData.schedType;
			this.regDatetime = getData.regDatetime;
			this.modDatetime = getData.modDatetime;
		} else {
			this.techdNo = 0;
			this.compNo = 0;
			this.custNo = 0;
			this.soppNo = 0;
			this.contNo = 0;
			this.cntrctMth = "";
			this.endCustNo = 0;
			this.custmemberNo = 0;
			this.title = "";
			this.desc = "";
			this.techdCheck = 0;
			this.techdItemmodel = "";
			this.techdItemversion = "";
			this.techdPlace = "";
			this.schedFrom = "";
			this.schedTo = "";
			this.type = "";
			this.techdSteps = "";
			this.userNo = 0;
			this.schedType = 0;
			this.regDatetime = "";
			this.modDatetime = "";
		}
	}

	//기술지원 상세
	detail() {
		let html = "";
		let setDate, datas, dataArray, notIdArray, schedFrom, schedTo;
		CommonDatas.detailSetFormList(this.getData);

		let gridList = document.getElementsByClassName("gridList")[0];
		let containerTitle = document.getElementById("containerTitle");
		let detailBackBtn = document.getElementsByClassName("detailBackBtn")[0];
		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let crudDeleteBtn = document.getElementsByClassName("crudDeleteBtn")[0];
		notIdArray = ["userNo"];

		setDate = CommonDatas.dateDis(new Date(this.regDatetime).getTime(), new Date(this.modDatetime).getTime());
		setDate = CommonDatas.dateFnc(setDate);

		schedFrom = CommonDatas.dateDis(new Date(this.schedFrom).getTime());
		schedFrom = CommonDatas.dateFnc(schedFrom);

		schedTo = CommonDatas.dateDis(new Date(this.schedTo).getTime());
		schedTo = CommonDatas.dateFnc(schedTo);

		datas = ["soppNo", "userNo", "custNo", "endCustNo", "custmemberNo", "contNo"];
		dataArray = [
			{
				"title": "등록구분(*)",
				"radioValue": [
					{
						"key": "10247",
						"value": "신규영업지원",
					},
					{
						"key": "10248",
						"value": "유지보수",
					},
				],
				"type": "radio",
				"elementId": ["cntrctMthNew", "cntrctMthOld"],
				"onChange": "CommonDatas.Temps.techSet.techRadioChange();",
				"col": 4,
				"elementName": "cntrctMth",
			},
			{
				"title": "영업기회(*)",
				"elementId": "soppNo",
				"complete": "sopp",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.soppNo)) ? "" : CommonDatas.getSoppFind(this.soppNo, "name"),
			},
			{
				"title": "계약(*)",
				"elementId": "contNo",
				"complete": "contract",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.contNo)) ? "" : CommonDatas.getContFind(this.contNo, "name"),
			},
			{
				"title": "엔드유저(*)",
				"elementId": "endCustNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.endCustNo)) ? "" : storage.customer[this.endCustNo].custName,
			},
			{
				"title": "엔드유저 담당자",
				"complete": "cip",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "custmemberNo",
				"value": (CommonDatas.emptyValuesCheck(this.custmemberNo)) ? "" : storage.cip[this.custmemberNo].name,
			},
			{
				"title": "담당자(*)",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "userNo",
				"value": (CommonDatas.emptyValuesCheck(this.userNo)) ? "" : storage.user[this.userNo].userName,
			},
			{
				"title": "모델",
				"elementId": "techdItemmodel",
				"value": (CommonDatas.emptyValuesCheck(this.techdItemmodel)) ? "" : this.techdItemmodel,
				"col": 4,
			},
			{
				"title": "버전",
				"elementId": "techdItemversion",
				"value": (CommonDatas.emptyValuesCheck(this.techdItemversion)) ? "" : this.techdItemversion,
				"col": 4,
			},
			{
				"title": "단계",
				"selectValue": [
					{
						"key": "10213",
						"value": "접수단계",
					},
					{
						"key": "10214",
						"value": "출동단계",
					},
					{
						"key": "10215",
						"value": "미계약에 따른 보류",
					},
					{
						"key": "10253",
						"value": "처리완료",
					}
				],
				"type": "select",
				"elementId": "techdSteps",
			},
			{
				"title": "지원형태",
				"selectValue": [
					{
						"key": "10187",
						"value": "전화상담",
					},
					{
						"key": "10208",
						"value": "현장방문",
					},
					{
						"key": "10209",
						"value": "원격지원",
					}
				],
				"type": "select",
				"elementId": "type",
			},
			{
				"title": "지원일자 시작일(*)",
				"elementId": "schedFrom",
				"type": "datetime",
				"value": this.schedFrom,
			},
			{
				"title": "지원일자 종료일(*)",
				"elementId": "schedTo",
				"type": "datetime",
				"value": this.schedTo,
			},
			{
				"title": "장소",
				"elementId": "techdPlace",
				"value": (CommonDatas.emptyValuesCheck(this.techdPlace)) ? "" : this.techdPlace,
				"col": 1,
			},
			{
				"title": "기술지원명(*)",
				"elementId": "title",
				"value": (CommonDatas.emptyValuesCheck(this.title)) ? "" : this.title,
				"col": 3,
			},
			{
				"title": "내용",
				"type": "textarea",
				"elementId": "desc",
				"value": (CommonDatas.emptyValuesCheck(this.desc)) ? "" : this.desc,
				"col": 4,
			},
		];

		html = CommonDatas.detailViewForm(dataArray);
		let createGrid = document.createElement("div");
		createGrid.className = "defaultFormContainer";
		createGrid.innerHTML = html;
		gridList.after(createGrid);
		containerTitle.innerText = this.title;
		let hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
		let showArr = ["defaultFormContainer"];
		CommonDatas.setViewContents(hideArr, showArr);
	
		if(storage.my == this.getData.userNo){
			crudUpdateBtn.setAttribute("onclick", "CommonDatas.enableDisabled(this, \"CommonDatas.Temps.tech.update();\", \"" + notIdArray + "\");")
			crudDeleteBtn.setAttribute("onclick", "CommonDatas.Temps.tech.delete();");
			crudUpdateBtn.style.display = "flex";
			crudDeleteBtn.style.display = "flex";
		}else{
			crudUpdateBtn.style.display = "none";
			crudDeleteBtn.style.display = "none";
		}
	
		detailBackBtn.style.display = "flex";
		CommonDatas.detailTrueDatas(datas);
	
		setTimeout(() => {
			document.querySelector("input[name=\"cntrctMth\"][value=\"" + this.cntrctMth + "\"]").setAttribute("checked", true);
			CommonDatas.Temps.techSet.techRadioChange();
			document.getElementById("techdSteps").value = this.techdSteps;
			document.getElementById("type").value = this.type;
			ckeditor.config.readOnly = true;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//기술지원 등록
	insert(){
		let cntrctMth = document.querySelector('input[name="cntrctMth"]:checked');
		
		if(cntrctMth.id === "cntrctMthNew" && document.getElementById("soppNo").value === ""){
			msg.set("영업기회를 입력해주세요.");
			document.getElementById("soppNo").focus();
			return false;
		} else if(cntrctMth.id === "cntrctMthNew" && document.getElementById("soppNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("soppNo").value, "sopp")){
			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
			document.getElementById("soppNo").focus();
			return false;
		} else if(cntrctMth.id === "cntrctMthOld" && document.getElementById("contNo").value === ""){
			msg.set("계약을 입력해주세요.");
			document.getElementById("contNo").focus();
			return false;
		} else if(cntrctMth.id === "cntrctMthOld" && document.getElementById("contNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("contNo").value, "contract")){
			msg.set("조회된 계약이 없습니다.\n다시 확인해주세요.");
			document.getElementById("contNo").focus();
			return false;
		} else if(document.getElementById("endCustNo").value === ""){
			msg.set("엔드유저를 입력해주세요.");
			document.getElementById("endCustNo").focus();
			return false;
		} else if(document.getElementById("endCustNo").value !== "" &&!CommonDatas.validateAutoComplete(document.getElementById("endCustNo").value, "customer")){
			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
			document.getElementById("endCustNo").focus();
			return false;
		} else if(document.getElementById("schedFrom").value === ""){
			msg.set("지원시작일을 선택해주세요.");
			document.getElementById("schedFrom").focus();
			return false;
		} else if(document.getElementById("schedFrom").value === ""){
			msg.set("지원시작일을 선택해주세요.");
			document.getElementById("schedFrom").focus();
			return false;
		} else if(document.getElementById("schedTo").value === ""){
			msg.set("지원종료일을 선택해주세요.");
			document.getElementById("schedTo").focus();
			return false;
		} else if(document.getElementById("title").value === ""){
			msg.set("기술지원명을 입력해주세요.");
			document.getElementById("title").focus();
			return false;
		} else{
			CommonDatas.formDataSet();

			if(cntrctMth.id === "cntrctMthNew"){
				storage.formList.soppNo = document.getElementById("soppNo").dataset.value;
			}else{
				storage.formList.soppNo = document.getElementById("contNo").dataset.sopp;
			}

			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.post("/api/tech", data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("등록되었습니다.");
				} else {
					msg.set("등록 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//기술지원 수정
	update() {
		let cntrctMth = document.querySelector('input[name="cntrctMth"]:checked');
		
		if(cntrctMth.id === "cntrctMthNew" && document.getElementById("soppNo").value === ""){
			msg.set("영업기회를 입력해주세요.");
			document.getElementById("soppNo").focus();
			return false;
		} else if(cntrctMth.id === "cntrctMthNew" && document.getElementById("soppNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("soppNo").value, "sopp")){
			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
			document.getElementById("soppNo").focus();
			return false;
		} else if(cntrctMth.id === "cntrctMthOld" && document.getElementById("contNo").value === ""){
			msg.set("계약을 입력해주세요.");
			document.getElementById("contNo").focus();
			return false;
		} else if(cntrctMth.id === "cntrctMthOld" && document.getElementById("contNo").value !== "" && !CommonDatas.validateAutoComplete(document.getElementById("contNo").value, "contract")){
			msg.set("조회된 계약이 없습니다.\n다시 확인해주세요.");
			document.getElementById("contNo").focus();
			return false;
		} else if(document.getElementById("endCustNo").value === ""){
			msg.set("엔드유저를 입력해주세요.");
			document.getElementById("endCustNo").focus();
			return false;
		} else if(document.getElementById("endCustNo").value !== "" &&!CommonDatas.validateAutoComplete(document.getElementById("endCustNo").value, "customer")){
			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
			document.getElementById("endCustNo").focus();
			return false;
		} else if(document.getElementById("schedFrom").value === ""){
			msg.set("지원시작일을 선택해주세요.");
			document.getElementById("schedFrom").focus();
			return false;
		} else if(document.getElementById("schedFrom").value === ""){
			msg.set("지원시작일을 선택해주세요.");
			document.getElementById("schedFrom").focus();
			return false;
		} else if(document.getElementById("schedTo").value === ""){
			msg.set("지원종료일을 선택해주세요.");
			document.getElementById("schedTo").focus();
			return false;
		} else if(document.getElementById("title").value === ""){
			msg.set("기술지원명을 입력해주세요.");
			document.getElementById("title").focus();
			return false;
		} else {
			CommonDatas.formDataSet();

			if(cntrctMth.id === "cntrctMthNew"){
				storage.formList.soppNo = document.getElementById("soppNo").dataset.value;
			}else{
				storage.formList.soppNo = document.getElementById("contNo").dataset.sopp;
			}

			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);

			axios.put("/api/tech/" + this.techdNo, data, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("수정되었습니다.");
				} else {
					msg.set("수정 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("수정 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//기술지원 삭제
	delete() {
		if (confirm("정말로 삭제하시겠습니까??")) {
			axios.delete("/api/tech/" + storage.formList.techdNo, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("삭제되었습니다.");
				} else {
					msg.set("삭제 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("삭제 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		} else {
			return false;
		}
	}
}

//재고현황 시작
class StoreSet{
	constructor() {
		CommonDatas.Temps.storeSet = this;
	}

	//재고조회 리스트 저장 함수
	list() {
		axios.get("/api/store").then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.storeList = result;

				setTimeout(() => {
					this.drawStoreList();
					CommonDatas.searchListSet("storeList");
					$('.theme-loader').delay(1000).fadeOut("slow");
				}, 1000)
			}
		}).catch((error) => {
			msg.set("재고조회 리스트 에러입니다.\n" + error);
			console.log(error);
		})
	}

	//영업활동 리스트 출력 함수
	drawStoreList() {
		let container, result, jsonData, containerTitle, job, header = [], data = [], ids = [], disDate, setDate, str, fnc = [], pageContainer, hideArr, showArr, releaseDate, orderDate;

		if (storage.storeList === undefined) {
			msg.set("등록된 재고가 없습니다");
		}
		else {
			if (storage.searchDatas === undefined) {
				jsonData = storage.storeList;
			} else {
				jsonData = storage.searchDatas;
			}
		}

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		containerTitle = document.getElementById("containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer")[0];
		container = document.getElementsByClassName("gridList")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn", "contractReqBtn"];
		showArr = [
			{ element: "gridList", display: "block" },
			{ element: "pageContainer", display: "flex" },
			{ element: "searchContainer", display: "block" },
			{ element: "listRange", display: "flex" },
			{ element: "listSearchInput", display: "flex" },
			{ element: "crudBtns", display: "flex" },
			{ element: "crudAddBtn", display: "flex" },
		];

		header = [
			{
				"title": "장비명",
				"align": "center",
			},
			{
				"title": "계약명",
				"align": "center",
			},
			{
				"title": "시리얼",
				"align": "center",
			},
			{
				"title": "입고일",
				"align": "center",
			},
			{
				"title": "출고일",
				"align": "center",
			},
			{
				"title": "납품처",
				"align": "center",
			},
			{
				"title": "발주일",
				"align": "center",
			},
			{
				"title": "장비위치",
				"align": "center",
			},
			{
				"title": "옵션사항",
				"align": "center",
			},
			{
				"title": "매입단가",
				"align": "center",
			},
			{
				"title": "비고",
				"align": "center",
			},
		];

		if (jsonData === "" || jsonData.length == 0) {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 11,
				},
			];

			data.push(str);
		} else {
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				disDate = CommonDatas.dateDis(new Date(jsonData[i].storeDate).getTime());
				setDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				disDate = CommonDatas.dateDis(new Date(jsonData[i].releaseDate).getTime());
				releaseDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");
				disDate = CommonDatas.dateDis(new Date(jsonData[i].orderDate).getTime());
				orderDate = CommonDatas.dateFnc(disDate, "yy.mm.dd");

				str = [
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].productNo)) ? "" : CommonDatas.getProductFind(jsonData[i].productNo, "name"),
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].contNo)) ? "" : CommonDatas.getContFind(jsonData[i].contNo, "name"),
						"align": "center",
					},
					{
						"setData": jsonData[i].serial,
						"align": "center",
					},
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": releaseDate,
						"align": "center",
					},
					{
						"setData": (CommonDatas.emptyValuesCheck(jsonData[i].custNo)) ? "" : storage.customer[jsonData[i].custNo].custName,
						"align": "center",
					},
					{
						"setData": orderDate,
						"align": "center",
					},
					{
						"setData": jsonData[i].locationName,
						"align": "center",
					},
					{
						"setData": jsonData[i].options,
						"align": "center",
					},
					{
						"setData": jsonData[i].purchaseNet.toLocaleString("en-US"),
						"align": "right",
					},
					{
						"setData": jsonData[i].firstDetail,
						"align": "left",
					},
				];

				fnc.push("CommonDatas.Temps.storeSet.storeDetailView(this)");
				ids.push(jsonData[i].storeNo);
				data.push(str);
			}

			let pageNation = CommonDatas.createPaging(pageContainer, result[3], "CommonDatas.pageMove", "CommonDatas.Temps.storeSet.drawStoreList", result[0]);
			pageContainer.innerHTML = pageNation;
		}

		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		CommonDatas.setViewContents(hideArr, showArr);
		containerTitle.innerText = "재고조회";
		document.getElementById("multiSearchBtn").setAttribute("onclick", "CommonDatas.Temps.storeSet.searchSubmit();");
	}

	//재고현황 상세보기
	storeDetailView(e) {
		let thisEle = e;

		axios.get("/api/store/" + thisEle.dataset.id).then((response) => {
			if (response.data.result === "ok") {
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				let store = new Store(result);
				store.detail();

				localStorage.setItem("loadSetPage", window.location.pathname);
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//재고현황 등록 폼
	storeInsertForm(){
		let html, dataArray;
	
		dataArray = [
			{
				"title": "장비명",
				"elementId": "productNo",
				"complete": "product",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "계약명",
				"elementId": "contNo",
				"complete": "contract",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "매출처",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"disabled": false,
			},
			{
				"title": "위치",
				"elementId": "locationName",
				"disabled": false,
			},
			{
				"title": "입고일",
				"elementId": "storeDate",
				"type": "date",
				"disabled": false,
			},
			{
				"title": "출고일",
				"elementId": "releaseDate",
				"type": "date",
				"disabled": false,
			},
			{
				"title": "발주일",
				"elementId": "orderDate",
				"type": "date",
				"disabled": false,
			},
			{
				"title": "BKLN 시작일",
				"elementId": "bklnDate",
				"type": "date",
				"disabled": false,
			},
			{
				"title": "비고",
				"elementId": "firstDetail",
				"col": 4,
				"disabled": false,
			},
			{
				"title": "재고수량",
				"elementId": "inventoryQty",
				"disabled": false,
			},
			{
				"title": "매입단가",
				"elementId": "purchaseNet",
				"disabled": false,
			},
			{
				"title": "시리얼",
				"elementId": "serial",
				"disabled": false,
			},
			{
				"title": "Auth Code",
				"elementId": "authCode",
				"disabled": false,
			},
			{
				"title": "옵션사항",
				"elementId": "options",
				"col": 4,
				"disabled": false,
			},
			{
				"title": "비고",
				"elementId": "secondDetail",
				"col": 4,
				"disabled": false,
			},
		];
	
		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70vw";
		modal.content.style.maxWidth = "70vw";
		modal.headTitle.innerText = "재고등록";
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.innerText = "등록";
		modal.close.innerText = "취소";
		modal.confirm.setAttribute("onclick", "const store = new Store(); store.insert();");
		modal.close.setAttribute("onclick", "modal.hide();");
		CommonDatas.Temps.storeSet.addModalFirstRadio();

		storage.formList = {
			"storeType": "",
			"userNo": storage.my,
			"productNo": 0,
			"custNo": 0,
			"contNo": 0,
			"locationName": "",
			"firstDetail": "",
			"inventoryQty": "",
			"purchaseNet": 0,
			"serial": "",
			"authCode": "",
			"options": "",
			"secondDetail": "",
			"storeDate": "",
			"releaseDate": "",
			"orderDate": "",
			"bklnDate": ""
		};
	}

	//재고조회 검색 버튼 클릭 함수
	searchSubmit() {
		let dataArray = [], resultArray, eachIndex = 0, product, cont, cust, type, searchProduct, searchCont, searchCust, searchType, searchDateFrom, keyIndex = 0;
		searchProduct = document.getElementById("searchProduct");
		searchCont = document.getElementById("searchCont");
		searchCust = document.getElementById("searchCust");
		
		for(let key in storage.storeList[0]){
			if(key === searchProduct.dataset.key) product = "#" + keyIndex + "/" + searchProduct.value;
			else if(key === searchCont.dataset.key) cont = "#" + keyIndex + "/" + searchCont.value;
			else if(key === searchCust.dataset.key) cust = "#" + keyIndex + "/" + searchCust.value;
			keyIndex++;
		}

		let searchValues = [product, cont, cust];

		for (let i = 0; i < searchValues.length; i++) {
			if(searchValues[i] !== ""){
				let tempArray = CommonDatas.searchDataFilter(storage.storeList, searchValues[i], "multi", []);
	
				for (let t = 0; t < tempArray.length; t++) {
					dataArray.push(tempArray[t]);
				}
	
				eachIndex++;
			}
		}
		
		resultArray = CommonDatas.searchMultiFilter(eachIndex, dataArray, storage.storeList);

		storage.searchDatas = resultArray;

		if (storage.searchDatas.length == 0) {
			msg.set("찾는 데이터가 없습니다.");
			storage.searchDatas = storage.storeList;
		}

		this.drawStoreList();
	}

	//재고조회 단일 검색 keyup 이벤트
	searchInputKeyup() {
		let searchAllInput, tempArray;
		searchAllInput = document.getElementById("searchAllInput").value;
		tempArray = CommonDatas.searchDataFilter(storage.storeList, searchAllInput, "input");

		if (tempArray.length > 0) {
			storage.searchDatas = tempArray;
		} else {
			storage.searchDatas = "";
		}

		this.drawStoreList();
	}

	addModalFirstRadio(){
		let defaultFormContainer = document.getElementsByClassName("defaultFormContainer")[0];
		let createDiv = document.createElement("div");
		createDiv.className = "storeType";
		createDiv.innerHTML = "<label><input type=\"radio\" name=\"storeType\" value=\"IN\" checked/>입고</label>"
		+ "<label><input type=\"radio\" name=\"storeType\"  value=\"OUT\" />출고</label>";
		defaultFormContainer.before(createDiv);
	}
}

//재고현황 crud
class Store{
	constructor(getData){
		CommonDatas.Temps.store = this;
	
		if (getData !== undefined) {
			this.getData = getData;
			this.storeNo = getData.storeNo;
			this.storeType = getData.storeType;
			this.productNo = getData.productNo;
			this.compNo = getData.compNo;
			this.contNo = getData.contNo;
			this.custNo = getData.custNo;
			this.userNo = getData.userNo;
			this.locationName = getData.locationName;
			this.firstDetail = getData.firstDetail;
			this.inventoryQty = getData.inventoryQty;
			this.purchaseNet = getData.purchaseNet;
			this.serial = getData.serial;
			this.authCode = getData.authCode;
			this.options = getData.options;
			this.secondDetail = getData.secondDetail;
			this.storeDate = getData.storeDate;
			this.releaseDate = getData.releaseDate;
			this.orderDate = getData.orderDate;
			this.bklnDate = getData.bklnDate;
			this.regDate = getData.regDate;
			this.modDate = getData.modDate;
			this.attrib = getData.attrib;
		} else {
			this.storeNo = 0;
			this.storeType = "";
			this.productNo = 0;
			this.compNo = 0;
			this.contNo = 0;
			this.custNo = 0;
			this.userNo = 0;
			this.locationName = "";
			this.firstDetail = "";
			this.inventoryQty = "";
			this.purchaseNet = 0;
			this.serial = "";
			this.authCode = "";
			this.options = "";
			this.secondDetail = "";
			this.storeDate = "";
			this.releaseDate = "";
			this.orderDate = "";
			this.bklnDate = "";
			this.regDate = "";
			this.modDate = "";
			this.attrib = "";
		}
	}

	//재고현황 상세보기
	detail() {
		let html = "";
		let storeDate, releaseDate, orderDate, bklnDate, datas, dataArray, notIdArray;

		CommonDatas.detailSetFormList(this.getData);

		let gridList = document.getElementsByClassName("gridList")[0];
		let containerTitle = document.getElementById("containerTitle");
		let detailBackBtn = document.getElementsByClassName("detailBackBtn")[0];
		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let crudDeleteBtn = document.getElementsByClassName("crudDeleteBtn")[0];

		storeDate = CommonDatas.dateDis(new Date(this.storeDate).getTime());
		storeDate = CommonDatas.dateFnc(storeDate);

		releaseDate = CommonDatas.dateDis(new Date(this.releaseDate).getTime());
		releaseDate = CommonDatas.dateFnc(releaseDate);

		orderDate = CommonDatas.dateDis(new Date(this.orderDate).getTime());
		orderDate = CommonDatas.dateFnc(orderDate);

		bklnDate = CommonDatas.dateDis(new Date(this.bklnDate).getTime());
		bklnDate = CommonDatas.dateFnc(bklnDate);

		notIdArray = ["userNo"];
		datas = ["custNo", "contNo", "productNo", "userNo"];

		dataArray = [
			{
				"title": "장비명",
				"elementId": "productNo",
				"complete": "product",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.productNo)) ? "" : CommonDatas.getProductFind(this.productNo, "name"),
			},
			{
				"title": "계약명",
				"elementId": "contNo",
				"complete": "contract",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.contNo)) ? "" : CommonDatas.getContFind(this.contNo, "name"),
			},
			{
				"title": "매출처",
				"elementId": "custNo",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": (CommonDatas.emptyValuesCheck(this.custNo)) ? "" : storage.customer[this.custNo].custName,
			},
			{
				"title": "위치",
				"elementId": "locationName",
				"value": this.locationName,
			},
			{
				"title": "입고일",
				"elementId": "storeDate",
				"type": "date",
				"value": storeDate,
			},
			{
				"title": "출고일",
				"elementId": "releaseDate",
				"type": "date",
				"value": releaseDate,
			},
			{
				"title": "발주일",
				"elementId": "orderDate",
				"type": "date",
				"value": orderDate,
			},
			{
				"title": "BKLN 시작일",
				"elementId": "bklnDate",
				"type": "date",
				"value": bklnDate,
			},
			{
				"title": "비고",
				"elementId": "firstDetail",
				"col": 4,
				"value": this.firstDetail,
			},
			{
				"title": "재고수량",
				"elementId": "inventoryQty",
				"value": this.inventoryQty,
			},
			{
				"title": "매입단가",
				"elementId": "purchaseNet",
				"value": this.purchaseNet.toLocaleString("en-US"),
			},
			{
				"title": "시리얼",
				"elementId": "serial",
				"value": this.serial,
			},
			{
				"title": "Auth Code",
				"elementId": "authCode",
				"value": this.authCode,
			},
			{
				"title": "옵션사항",
				"elementId": "options",
				"col": 4,
				"value": this.options,
			},
			{
				"title": "비고",
				"elementId": "secondDetail",
				"col": 4,
				"value": this.secondDetail,
			},
		];

		html = CommonDatas.detailViewForm(dataArray);
		let createGrid = document.createElement("div");
		createGrid.className = "defaultFormContainer";
		createGrid.innerHTML = html;
		gridList.after(createGrid);
		containerTitle.innerText = (CommonDatas.emptyValuesCheck(this.productNo)) ? "" : CommonDatas.getProductFind(this.productNo, "name");
		let hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
		let showArr = ["defaultFormContainer"];
		CommonDatas.setViewContents(hideArr, showArr);
	
		if(storage.my == this.getData.userNo){
			crudUpdateBtn.setAttribute("onclick", "CommonDatas.enableDisabled(this, \"CommonDatas.Temps.store.update();\", \"" + notIdArray + "\");")
			crudDeleteBtn.setAttribute("onclick", "CommonDatas.Temps.store.delete();");
			crudUpdateBtn.style.display = "flex";
			crudDeleteBtn.style.display = "flex";
		}else{
			crudUpdateBtn.style.display = "none";
			crudDeleteBtn.style.display = "none";
		}
	
		detailBackBtn.style.display = "flex";
		CommonDatas.detailTrueDatas(datas);
		CommonDatas.Temps.storeSet.addModalFirstRadio();
		document.querySelector("[name=\"storeType\"][value=\"" + this.storeType + "\"]").checked = true;
	}

	//재고현황 등록
	insert(){
		CommonDatas.formDataSet();
		let data = storage.formList;
		data = JSON.stringify(data);
		data = cipher.encAes(data);

		axios.post("/api/store", data, {
			headers: { "Content-Type": "text/plain" }
		}).then((response) => {
			if (response.data.result === "ok") {
				location.reload();
				msg.set("등록되었습니다.");
			} else {
				msg.set("등록 중 에러가 발생하였습니다.");
				return false;
			}
		}).catch((error) => {
			msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
			console.log(error);
			return false;
		});
	}

	//재고현황 수정
	update() {
		CommonDatas.formDataSet();
		let data = storage.formList;
		data = JSON.stringify(data);
		data = cipher.encAes(data);

		axios.put("/api/store/" + data.storeNo, data, {
			headers: { "Content-Type": "text/plain" }
		}).then((response) => {
			if (response.data.result === "ok") {
				location.reload();
				msg.set("수정되었습니다.");
			} else {
				msg.set("수정 중 에러가 발생하였습니다.");
				return false;
			}
		}).catch((error) => {
			msg.set("수정 도중 에러가 발생하였습니다.\n" + error);
			console.log(error);
			return false;
		});
	}

	//재고현황 삭제
	delete() {
		if (confirm("정말로 삭제하시겠습니까??")) {
			axios.delete("/api/store/" + storage.formList.storeNo, {
				headers: { "Content-Type": "text/plain" }
			}).then((response) => {
				if (response.data.result === "ok") {
					location.reload();
					msg.set("삭제되었습니다.");
				} else {
					msg.set("삭제 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("삭제 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		} else {
			return false;
		}
	}
}

//Common 시작
class Common {
	constructor() {
		this.Temps = {};

		window.onmousedown = function leftClick(){
			let target = window.event.srcElement;

			if(target.dataset.complete === undefined || target.dataset.complete === ""){
				if(target.parentElement.className !== "autoComplete"){
					if(document.getElementsByClassName("autoComplete")[0] !== undefined){
						document.getElementsByClassName("autoComplete")[0].remove();
					}
				}
			}
		}
	}
	//페이지 로드될 때 top menu active 함수
	setTopPathActive() {
		let path = location.pathname.split("/");
		let container;

		if (path[1] === "" || path[1] === "business") {
			if (path[3] != "popup") {
				container = document.getElementsByClassName("mainTopMenu")[0].querySelector("div[data-path=\"/\"]");
			}

		} else if (path[1] === "gw") {
			container = document.getElementsByClassName("mainTopMenu")[0].querySelector("div[data-path=\"/gw/home\"]");
		} else {
			container = document.getElementsByClassName("mainTopMenu")[0].querySelector("div[data-path=\"/accounting/home\"]");
		}
		if (path[3] != "popup") {
			container.classList.add("active");
		}
	}

	//페이지 로드될 때 side menu active 함수
	setSidePathActive() {
		let path = location.pathname.split("/");
		let menuItem = document.getElementsByClassName("menuItem");
		let container

		if (path[1] === "" || path[1] === "business") {
			if (path[3] != "popup") {
				container = document.getElementsByClassName("sideMenu")[0].querySelector("div[data-path=\"/\"]");
			}
		} else if (path[1] === "gw") {
			container = document.getElementsByClassName("sideMenu")[0].querySelector("div[data-path=\"/gw/home\"]");
		} else {
			container = document.getElementsByClassName("sideMenu")[0].querySelector("div[data-path=\"/accounting/home\"]");
		}

		for (let i = 0; i < menuItem.length; i++) {
			let item = menuItem[i];

			if (path[1] !== "") {
				let label = item.querySelector("label");

				if (label === null) {
					let itemA = item.querySelector("a");

					if (itemA.getAttribute("href").indexOf("/" + path[1] + "/" + path[2]) > -1) {
						itemA.classList.add("active");
					} else {
						if (path[2] === "sopp2") {
							if (itemA.getAttribute("href") === "/" + path[1] + "/project") {
								itemA.classList.add("active");
							}
						}
					}
				} else {
					let aTarget = item.nextElementSibling.querySelectorAll("div");

					for (let t = 0; t < aTarget.length; t++) {
						let target = aTarget[t].querySelector("a");
						let targetLabel = target.parentElement.parentElement.previousElementSibling.children[1];
						let targetPlus = target.parentElement.parentElement.previousElementSibling.children[1].children[2];
						let targetPanel = target.parentElement.parentElement;

						if (target.getAttribute("href").indexOf("/" + path[1] + "/" + path[2]) > -1) {
							if (path[2] === "sopp") {
								if (target.getAttribute("href") === "/" + path[1] + "/" + path[2]) {
									target.classList.add("active");
								}
							} else if (path[2] === "workreport") {
								if (target.getAttribute("href") === "/" + path[1] + "/" + path[2]) {
									target.classList.add("active");
								}
							} else {
								target.classList.add("active");
							}

							targetLabel.classList.add("active");
							targetPlus.innerText = "-";
							targetPanel.classList.add("active");
						} else {
							if (path[2] === "sopp2") {
								if (target.getAttribute("href") === "/" + path[1] + "/project") {
									target.classList.add("active");
									targetLabel.classList.add("active");
									targetPlus.innerText = "-";
									targetPanel.classList.add("active");
								}
							}
						}
					}
				}
			}
		}
		if (path[3] != "popup") {
			container.classList.add("active");
		}
	}

	//단일 top menu 클릭 시 실행되는 함수
	topMenuClick(e) {
		let thisEle = e;
		let homePath = thisEle.dataset.path;

		if (homePath !== undefined) {
			if (homePath !== "/accounting/home") {
				window.location.href = homePath;
			} else {
				let menus = document.getElementsByClassName("sideMenu")[0].children;
				let topMenus = document.getElementsByClassName("mainTopMenu")[0].querySelectorAll("div");

				for (let i = 0; i < menus.length; i++) {
					if (menus[i].classList.contains("accounting")) {
						menus[i].style.display = "block";
					} else {
						menus[i].style.display = "none";
					}
				}

				for (let i = 0; i < topMenus.length; i++) {
					if (topMenus[i].classList.contains("active")) {
						topMenus[i].classList.remove("active");
					}
				}

				thisEle.classList.add("active");
			}
		}
	}

	//단일 side menu 클릭 시 실행되는 함수
	sideMenuItemClick() {
		let checkedRadio = document.getElementsByClassName("sideMenu")[0].querySelectorAll("input[type=\"radio\"]");

		for (let i = 0; i < checkedRadio.length; i++) {
			let item = checkedRadio[i];
			let label = item.nextElementSibling;
			let plusBtn = label.children[2];
			let panel = label.parentElement.nextElementSibling;

			if (item.checked) {
				if (label.classList.contains("active")) {
					label.classList.remove("active");
					panel.classList.remove("active");
					plusBtn.innerText = "+";
				} else {
					label.classList.add("active");
					panel.classList.add("active");
					plusBtn.innerText = "-";
				}
			} else {
				label.classList.remove("active");
				panel.classList.remove("active");
				plusBtn.innerText = "+";
			}
		}
	}

	//페이지네이션 전 페이지 값 계산에 대한 함수
	paging(total, currentPage, articlePerPage) {
		let lastPage, result = [], max, getArticle;

		if (document.getElementsByClassName("searchContainer")[0] === undefined) {
			getArticle = 10;
		} else {
			getArticle = CommonDatas.calWindowLength();
		}

		if (currentPage === undefined) {
			storage.currentPage = 1;
			currentPage = storage.currentPage;
		}

		if (articlePerPage === undefined) {
			if (isNaN(getArticle)) {
				storage.articlePerPage = 10;
			} else {
				storage.articlePerPage = getArticle;
			}
			articlePerPage = storage.articlePerPage;
		}

		max = Math.ceil(total / articlePerPage);

		lastPage = currentPage * articlePerPage;

		if (currentPage == max && total % articlePerPage !== 0) {
			lastPage = ((max - 1) * articlePerPage) + (total % articlePerPage);
		}

		result.push(currentPage, articlePerPage, lastPage, max);

		return result;
	}

	//페이지 클릭 시 이동 함수
	pageMove(page, drawFnc) {
		let selectedPage = parseInt(page);
		storage.currentPage = selectedPage;
		drawFnc();
	}

	//페이지의 높이 값 계산 함수
	calWindowLength() {
		let bodyContent, containerTitle, searchContainer, searchCal, titleCal, totalCal;

		bodyContent = document.getElementById("bodyContent");
		searchContainer = document.getElementsByClassName("searchContainer")[0];
		containerTitle = document.getElementById("containerTitle");
		searchCal = searchContainer.offsetHeight === undefined ? parseInt(bodyContent.offsetHeight) : (parseInt(bodyContent.offsetHeight) - searchContainer.offsetHeight);
		titleCal = parseInt(containerTitle.offsetHeight + 90);
		totalCal = (parseInt(searchCal - titleCal) - parseInt(36)) / parseInt(38);

		return parseInt(totalCal);
	}

	//리스트 그릴 때 그리드 출력 함수
	createGrid(gridContainer, headerDataArray, dataArray, ids, job, fnc = [], idName, className) {
		let gridHtml = "", gridContents, idStr;
		ids = (ids === undefined) ? 0 : ids;
		fnc = (fnc.length == 0) ? "" : fnc;
		job = (job === undefined) ? "" : job;

		if (idName === undefined) {
			idStr = "gridContent";
		} else {
			idStr = idName;
		}

		gridHtml = "<div class='gridHeader grid_default_header_item'>";

		for (let i = 0; i < headerDataArray.length; i++) {
			if(className === undefined){
				if (headerDataArray[i].align === "center") {
					gridHtml += "<div class=\"gridHeaderItem grid_default_text_align_center\">" + headerDataArray[i].title + "</div>";
				} else if (headerDataArray[i].align === "left") {
					gridHtml += "<div class=\"gridHeaderItem grid_default_text_align_left\">" + headerDataArray[i].title + "</div>";
				} else {
					gridHtml += "<div class=\"gridHeaderItem grid_default_text_align_right\">" + headerDataArray[i].title + "</div>";
				}
			}else{
				if (headerDataArray[i].align === "center") {
					gridHtml += "<div class=\"gridHeaderItem " + className + "_grid_default_text_align_center\">" + headerDataArray[i].title + "</div>";
				} else if (headerDataArray[i].align === "left") {
					gridHtml += "<div class=\"gridHeaderItem " + className + "_grid_default_text_align_left\">" + headerDataArray[i].title + "</div>";
				} else {
					gridHtml += "<div class=\"gridHeaderItem " + className + "_grid_default_text_align_right\">" + headerDataArray[i].title + "</div>";
				}
			}
		}

		gridHtml += "</div>";

		for (let i = 0; i < dataArray.length; i++) {
			gridHtml += "<div id='" + idStr + "_grid_" + i + "' class='gridContent grid_default_body_item' data-drag=\"true\" data-id='" + ids[i] + "' data-job='" + job[i] + "' onclick='" + fnc[i] + "'>";
			for (let t = 0; t <= dataArray[i].length; t++) {
				if (dataArray[i][t] !== undefined) {
					if (dataArray[i][t].setData === undefined) {
						gridHtml += "<div class='gridContentItem' style=\"grid-column: span " + dataArray[i][t].col + "; text-align: center;\">데이터가 없습니다.</div>";
					} else {
						gridHtml += "<div class='gridContentItem'><span class=\"textNumberFormat\">" + dataArray[i][t].setData + "</span></div>";
					}
				}
			}
			gridHtml += "</div>";
		}

		gridContainer.innerHTML = gridHtml;

		if (idName === undefined) {
			gridContents = document.getElementsByClassName("gridContent");
		} else {
			gridContents = document.querySelector("#" + idName).getElementsByClassName("gridContent");
		}

		let tempArray = [];

		for (let i = 0; i < dataArray.length; i++) {
			for (let key in dataArray[i]) {
				tempArray.push(dataArray[i][key]);
			}
		}

		for (let i = 0; i < tempArray.length; i++) {
			for (let t = 0; t < gridContents.length; t++) {
				if (gridContents[t].getElementsByClassName("gridContentItem")[i] !== undefined) {
					if (tempArray[i].align === "center") {
						gridContents[t].getElementsByClassName("gridContentItem")[i].setAttribute("class", "gridContentItem grid_default_text_align_center");
					} else if (tempArray[i].align === "left") {
						gridContents[t].getElementsByClassName("gridContentItem")[i].setAttribute("class", "gridContentItem grid_default_text_align_left");
					} else {
						gridContents[t].getElementsByClassName("gridContentItem")[i].setAttribute("class", "gridContentItem grid_default_text_align_right");
					}
				}
			}
		}
	}

	//날짜 포맷
	dateFnc(dateTimeStr, type) {
		let result, year, month, day, hh, mm, ss, date, nowDate, calTime, calTimeHour, calTimeDay;
		nowDate = new Date();
		date = new Date(dateTimeStr * 1);
		calTime = Math.floor((nowDate.getTime() - date.getTime()) / 1000 / 60);
		calTimeHour = Math.floor(calTime / 60);
		calTimeDay = Math.floor(calTime / 60 / 24);
		year = date.getFullYear();
		month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		day = (date.getDate()) < 10 ? "0" + date.getDate() : date.getDate();
		hh = (date.getHours()) < 10 ? "0" + date.getHours() : date.getHours();
		mm = (date.getMinutes()) < 10 ? "0" + date.getMinutes() : date.getMinutes();
		ss = (date.getSeconds()) < 10 ? "0" + date.getSeconds() : date.getSeconds();

		if (dateTimeStr === undefined || dateTimeStr === null) {
			return "";
		}

		if (type === undefined) {
			type = "yyyy-mm-dd";
		}

		if (type === "yyyy-mm-dd") {
			result = year + "-" + month + "-" + day;
		} else if (type === "yy-mm-dd") {
			result = year.toString().substring(2, 4) + "-" + month + "-" + day;
		} else if (type === "yyyy-mm") {
			result = year + "-" + month;
		} else if (type === "mm-dd") {
			result = month + "-" + day;
		} else if (type === "yyyy-mm-dd HH:mm:ss") {
			result = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
		} else if (type === "HH:mm:ss") {
			result = hh + ":" + mm + ":" + ss;
		} else if (type === "HH:mm") {
			result = hh + ":" + mm;
		} else if (type === "mm:ss") {
			result = mm + ":" + ss;
		} else if (type === "yyyy.mm.dd") {
			result = year + "." + month + "." + day;
		} else if (type === "yy.mm.dd") {
			result = year.toString().substring(2, 4) + "." + month + "." + day;
		} else if (type === "mm.dd") {
			result = month + "." + day;;
		} else if (type === "yyyy-mm-dd T HH:mm") {
			result = year + "-" + month + "-" + day + "T" + hh + ":" + mm;
		}

		return result;
	}

	//날짜를 받아와서 modified와 created 결정 함수
	dateDis(created, modified) {
		let result;

		if (created === undefined || isNaN(created)) {
			created = null;
		} else if (modified === undefined || isNaN(modified)) {
			modified = null;
		}

		if (created !== null && modified !== null) {
			result = modified;
		} else if (created === null && modified !== null) {
			result = modified;
		} else if (created !== null && modified === null) {
			result = created;
		}

		return result;
	}

	// 페이징 만드는 함수
	createPaging(container, max, eventListener, fncStr, current, nextCount, forwardStep) {
		let x = 0, page, html = ["", "", "", ""];
		if (container == undefined) {
			console.log("[createPaging] Paging container is Empty.");
			return false;
		} else if (!classType(container).includes("Element")) {
			console.log("[createPaging] Container is Not Html Element.");
			return false;
		} else if (isNaN(max) || max === "" || max < 1) {
			console.log("[createPaging] max value is abnormal.");
			return false;
		} else if (eventListener === undefined) {
			console.log("[createPaging] Click event listener unavailable.");
			return false;
		}

		if (current === undefined) current = 1;
		if (nextCount === undefined) nextCount = 3;
		if (forwardStep === undefined) forwardStep = 10;

		html[1] = "<div class=\"paging_cell paging_cell_current\">" + current + "</div>";

		for (page = current - 1; page >= current - nextCount && page > 0; page--) {
			html[1] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>" + html[1];
		}

		if (page === 1) {
			html[0] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>";
		} else if (page > 1) {
			if (current - forwardStep > 1) {
				html[0] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + (current - forwardStep) + ", " + fncStr + ")\">&laquo;</div>";
			}
			html[0] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(1, " + fncStr + ")\">1</div>" + html[0];
		} else {
			html[0] = undefined;
		}

		for (page = current + 1; page <= (current + nextCount) && page <= max; page++) {
			html[1] = html[1] + "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>";
		}

		if (page === max) {
			html[2] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>";
		} else if (page < max) {
			if (current + forwardStep < max) {
				html[2] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + (current + forwardStep) + ", " + fncStr + ")\">&raquo;</div>";
			}
			html[2] = html[2] + "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + max + ", " + fncStr + ")\">" + max + "</div>";
		} else html[2] = undefined;

		html[3] = html[1];
		if (html[0] !== undefined) html[3] = html[0] + "<div class=\"paging_cell_empty\">...</div>" + html[1];
		if (html[2] != undefined) html[3] = html[3] + "<div class=\"paging_cell_empty\">...</div>" + html[2];

		return html[3];
	}

	//뷰에 가리거나 보이게 하고 싶을 때 걸러내는 함수
	setViewContents(hideArr, showArr) {
		for (let i = 0; i < hideArr.length; i++) {
			let item = document.getElementsByClassName(hideArr[i])[0];
			if (item !== undefined) {
				item.style.display = "none";
			}
		}

		for (let i = 0; i < showArr.length; i++) {
			let item = document.getElementsByClassName(showArr[i].element)[0];
			if (item !== undefined) {
				item.style.display = showArr[i].display;
			}
		}
	}

	//상세 폼
	detailViewFormHtml(data) {
		let html = "";

		for (let i = 0; i < data.length; i++) {
			let dataTitle = (data[i].title === undefined) ? "" : data[i].title;
			let col = (data[i].col === undefined) ? 1 : data[i].col;

			html += "<div class='defaultFormLine' style=\"grid-column: span " + col + ";\">";

			if (dataTitle !== "") {
				html += "<div class='defaultFormSpanDiv'>";
				html += "<span class='defaultFormSpan'>" + dataTitle + "</span>";
				html += "</div>";
			}

			html += "<div class='defaultFormContent'>";
			html += this.inputSet(data[i]);
			html += "</div>";
			html += "</div>";
		}

		return html;
	}

	// 상세보기 type별 폼 전달
	detailViewForm(data, type) {
		let html = "", pageContainer, listChangeBtn, scheduleRange;

		if (type === undefined) {
			pageContainer = document.getElementsByClassName("pageContainer")[0];
			listChangeBtn = document.getElementsByClassName("listChangeBtn")[0];
			scheduleRange = document.getElementById("scheduleRange");

			if (listChangeBtn !== undefined) {
				listChangeBtn.style.display = "none";
			}

			if (scheduleRange !== null) {
				scheduleRange.style.display = "none";
			}

			pageContainer.children[0].style.display = "none";

			html = this.detailViewFormHtml(data);
		} else if (type === "board") {
			html = this.detailBoardForm(data);
		} else if (type === "modal") {
			html = this.detailViewFormHtml(data);
		} else {
			html = this.detailViewFormHtml(data);
		}

		return html;
	}

	//게시판 상세 폼
	detailBoardForm(data) {
		let html = "";

		html = "<div class='detailBoard'>";
		html += "<div class='detailBtns'></div>";
		html += "<div class='detailContents'>";
		html += "<div class='defaultFormContainer'>";
		html += this.detailViewFormHtml(data);
		html += "</div>";
		html += "</div>";
		html += "</div>";

		return html;
	}

	//상세보기 input이나 textarea 만들어주는 함수
	inputSet(data) {
		let html = "";
		let dataValue = (data.value === undefined) ? "" : data.value;
		let dataDisabled = (data.disabled === undefined) ? true : data.disabled;
		let dataType = (data.type === undefined) ? "text" : data.type;
		let dataKeyup = (data.dataKeyup === undefined) ? "" : data.dataKeyup;
		let dataKeyupEvent = (data.keyup === undefined) ? "" : data.keyup;
		let elementId = (data.elementId === undefined) ? "" : data.elementId;
		let elementName = (data.elementName === undefined) ? "" : data.elementName;
		let dataChangeEvent = (data.onChange === undefined) ? "" : data.onChange;
		let dataClickEvent = (data.onClick === undefined) ? "" : data.onClick;
		let dataComplete = (data.complete === undefined) ? "" : data.complete;
		let autoComplete = (data.autoComplete === undefined) ? "off" : data.autoComplete;
		let placeHolder = (data.placeHolder === undefined) ? "" : data.placeHolder;

		if (dataType === "text") {
			if (dataDisabled == true) {
				html += "<input type='text' id='" + elementId + "' name='" + elementName + "' autocomplete=\"" + autoComplete + "\" value='" + dataValue + "' data-complete='" + dataComplete + "' data-keyup='" + dataKeyup + "' onchange='" + dataChangeEvent + "' onclick='" + dataClickEvent + "' onkeyup='" + dataKeyupEvent + "' placeholder=\"" + placeHolder + "\" readonly>";
			} else {
				html += "<input type='text' id='" + elementId + "' name='" + elementName + "' autocomplete=\"" + autoComplete + "\" value='" + dataValue + "' data-complete='" + dataComplete + "' data-keyup='" + dataKeyup + "' onchange='" + dataChangeEvent + "' onclick='" + dataClickEvent + "' onkeyup='" + dataKeyupEvent + "' placeholder=\"" + placeHolder + "\">";
			}
		} else if (dataType === "textarea") {
			if (dataDisabled == true) {
				html += "<textarea id=\"" + elementId + "\" readonly>" + dataValue + "</textarea>";
			} else {
				html += "<textarea id=\"" + elementId + "\">" + dataValue + "</textarea>";
			}
		} else if (dataType === "radio") {
			for (let t = 0; t < data.radioValue.length; t++) {
				if (data.radioType !== "tab") {
					data.radioType = "default";
				}

				html += "<div class=\"detailRadioBox\" data-type=\"" + data.radioType + "\">";

				if (dataDisabled == true) {
					if (t == 0) {
						html += "<input type='radio' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' disabled='" + dataDisabled + "' data-type=\"" + data.radioType + "\" onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\" checked><label data-type=\"" + data.radioType + "\" for=\"" + elementId[t] + "\">" + data.radioValue[t].value + "</label>" + " ";
					} else {
						html += "<input type='radio' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' disabled='" + dataDisabled + "' data-type=\"" + data.radioType + "\" onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label data-type=\"" + data.radioType + "\" for=\"" + elementId[t] + "\">" + data.radioValue[t].value + "</label>" + " ";
					}
				} else {
					if (t == 0) {
						html += "<input type='radio' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' data-type=\"" + data.radioType + "\" onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\" checked><label data-type=\"" + data.radioType + "\" for=\"" + elementId[t] + "\">" + data.radioValue[t].value + "</label>" + " ";
					} else {
						html += "<input type='radio' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' data-type=\"" + data.radioType + "\" onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label data-type=\"" + data.radioType + "\" for=\"" + elementId[t] + "\">" + data.radioValue[t].value + "</label>" + " ";
					}
				}

				html += "</div>";
			}
		} else if (dataType === "checkbox") {
			for (let t = 0; t < data.checkValue.length; t++) {
				if (dataDisabled == true) {
					if (t == 0) {
						html += "<input type='checkbox' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.checkValue[t].value + "' disabled='" + dataDisabled + "' onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label for=\"" + elementId[t] + "\">" + data.checkValue[t].key + "</label>" + " ";
					} else {
						html += "<input type='checkbox' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.checkValue[t].value + "' disabled='" + dataDisabled + "' onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label for=\"" + elementId[t] + "\">" + data.checkValue[t].key + "</label>" + " ";
					}
				} else {
					if (t == 0) {
						html += "<input type='checkbox' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.checkValue[t].value + "' onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label for=\"" + elementId[t] + "\">" + data.checkValue[t].key + "</label>" + " ";
					} else {
						html += "<input type='checkbox' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.checkValue[t].value + "' onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label for=\"" + elementId[t] + "\">" + data.checkValue[t].key + "</label>" + " ";
					}
				}
			}
		} else if (dataType === "date") {
			if (dataDisabled == true) {
				html += "<input type='date' max='9999-12-31' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "' disabled='" + dataDisabled + "'>";
			} else {
				html += "<input type='date' max='9999-12-31' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "'>";
			}
		} else if (dataType === "datetime") {
			if (dataDisabled == true) {
				html += "<input type='datetime-local' max='9999-12-31T23:59:59' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "' disabled='" + dataDisabled + "'>";
			} else {
				html += "<input type='datetime-local' max='9999-12-31T23:59:59' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "'>";
			}
		} else if (dataType === "select") {
			if (dataDisabled == true) {
				html += "<select id='" + elementId + "' name='" + elementName + "' disabled='" + dataDisabled + "' onChange=\"" + dataChangeEvent + "\">";
			} else {
				html += "<select id='" + elementId + "' name='" + elementName + "' onChange=\"" + dataChangeEvent + "\">";
			}
			for (let t = 0; t < data.selectValue.length; t++) {
				html += "<option value='" + data.selectValue[t].key + "'>" + data.selectValue[t].value + "</option>";
			}

			html += "</select>";
		} else if (dataType === "file") {
			html += "<input type='file' id='" + elementId + "' name='" + elementName + "' onchange='" + dataChangeEvent + "'>";
		} else if (dataType === "") {
			html += "";
		}

		return html;
	}

	//formList에 데이터를 넣어주는 함수
	detailSetFormList(result) {
		storage.formList = {};
		for (let key in result) {
			if (key !== "attached" && key !== "schedules" && key !== "trades" && key !== "bills") {
				storage.formList[key] = result[key];
			}
		}
	}

	//상세보기 컨테이너 감추는 함수
	detailBoardContainerHide() {
		let detailBoard = document.getElementsByClassName("detailBoard");

		for (let i = 0; i < detailBoard.length; i++) {
			detailBoard[i].remove();
		}
	}

	//data-change를 true로 변경하는 함수
	detailTrueDatas(datas) {
		for (let i = 0; i < datas.length; i++) {
			if (document.getElementById(datas[i])) {
				document.getElementById(datas[i]).setAttribute("data-change", true);
			} else if (document.getElementsByName(datas[i]).length > 0) {
				document.getElementsByName(datas[i]).setAttribute("data-change", true);
			}
		}
	}

	//formList에 데이터를 세팅해주는 함수
	formDataSet(storageArr) {
		if (storageArr === undefined) {
			storageArr = storage.formList;
		}

		for (let key in storageArr) {
			let element = "";

			if (document.getElementById(key)) {
				element = document.getElementById(key);
			} else if (document.getElementsByName(key).length > 0) {
				element = document.getElementsByName(key);

				if(element.length > 1){
					for(let i = 0; i < element.length; i++){
						let item = element[i];
						
						if(item.checked){
							element = item;
						}
					}
				}else{
					element = document.getElementsByName(key)[0];
				}
			}

			if (element !== undefined && element !== "") {
				if (element.tagName === "TEXTAREA") {
					storageArr[key] = CKEDITOR.instances[key].getData().replaceAll("\n", "");
				} else {
					if (!element.dataset.change) {
						if (typeof storageArr[key] === "number") {
							if (element.type === "date" || element.type === "datetime-local") {
								// let dateTime = new Date(element.value).getTime();
								let dateTime = new Date(new Date(element.value).toString().split('GMT')[0]+' UTC').toISOString().slice(0, -5).replace(/T/g, " ");
								storageArr[key] = dateTime;
							} else {
								if (element.value === "") {
									storageArr[key] = 0;
								} else {
									storageArr[key] = parseInt(element.value.replaceAll(",", ""));
								}
							}
						} else {
							if (element.type === "date" || element.type === "datetime-local") {
								// let dateTime = new Date(element.value).getTime();
								if(element.value !== ""){
									let dateTime = new Date(new Date(element.value).toString().split('GMT')[0]+' UTC').toISOString().slice(0, -5).replace(/T/g, " ");
									storageArr[key] = dateTime;
								}
							} else {
								storageArr[key] = element.value;
							}
						}
					}
				}
			}
		}
	}

	//검색 부분 아코디언 함수
	searchAco(e) {
		let thisBtn, multiSearchResetBtn, multiSearchBtn, searchMultiContent;
		thisBtn = e;
		multiSearchResetBtn = document.getElementById("multiSearchResetBtn");
		multiSearchBtn = document.getElementById("multiSearchBtn");
		searchMultiContent = document.getElementsByClassName("searchMultiContent")[0];

		if (thisBtn.dataset.set === "true") {
			thisBtn.innerHTML = "<i class=\"fa-solid fa-plus fa-xl\"></i>";
			thisBtn.dataset.set = false;
			multiSearchBtn.style.display = "none";
			searchMultiContent.style.display = "none";
			multiSearchResetBtn.style.display = "none";
		} else {
			thisBtn.innerHTML = "<i class=\"fa-solid fa-minus fa-xl\"></i>";
			thisBtn.dataset.set = true;
			multiSearchBtn.style.display = "flex";
			searchMultiContent.style.display = "flex";
			multiSearchResetBtn.style.display = "flex";
		}
	}

	//검색 리셋 함수
	searchReset() {
		let searchMultiContent = document.getElementsByClassName("searchMultiContent")[0];
		let contents = searchMultiContent.querySelectorAll("div");

		for (let i = 0; i < contents.length; i++) {
			let inputs = contents[i].querySelectorAll("input");
			let selects = contents[i].querySelectorAll("select");

			for (let t = 0; t < inputs.length; t++) {
				inputs[t].value = "";
			}

			for (let t = 0; t < selects.length; t++) {
				selects[t].value = "";
			}
		}
	}

	//단일 검색 시 데이터를 걸러주는 함수
	searchDataFilter(arrayList, searchValue, type, keywords) {
		let dataArray = [];

		if (type === "input") {
			for (let key in storage.searchList) {
				if (storage.searchList[key].includes(searchValue)) {
					dataArray.push(arrayList[key]);
				}
			}
		} else {
			let keywordFlag = false;
			let keywordIndex;

			for(let i = 0; i < keywords.length; i++){
				let item = keywords[i];
				
				if(searchValue.indexOf(item) > -1){
					keywordFlag = true;
					keywordIndex = i;
				}
			}

			if(keywordFlag){
				let splitStr;
				splitStr = searchValue.split(keywords[keywordIndex]);

				for (let key in storage.searchList) {
					if (splitStr[0] <= storage.searchList[key].split(keywords[keywordIndex])[1]) {
						if (storage.searchList[key].split(keywords[keywordIndex])[1] <= splitStr[1]) {
							dataArray.push(key);
						}
					}
				}
			}else{
				let splitStr, index = "";
				splitStr = searchValue.split("#");

				if(!CommonDatas.emptyValuesCheck(splitStr[1])){
					for (let i = 0; i < splitStr[1].length; i++) {
						if (splitStr[1][i] !== "/") {
							index += splitStr[1][i];
						} else {
							break;
						}
					}

					index = parseInt(index) + parseInt(1);
	
					for (let key in storage.searchList) {
						if (storage.searchList[key].split("#")[index].includes(searchValue.split("/")[1])) {
							dataArray.push(key);
						}
					}
				}
			}
		}

		return dataArray;
	}

	//멀티 검색 시 걸러주는 함수
	searchMultiFilter(index, dataArray, arrayList) {
		let arr = [], tempResultArray = [], resultArray = [];

		if (index > 1) {
			for (let i = 0; i < dataArray.length; i++) {
				if (arr[dataArray[i]]) {
					arr[dataArray[i]]++;
				} else {
					arr[dataArray[i]] = 1;
				}
			}
			
			
			for (let key in arr) {
				if (index == arr[key]) {
					tempResultArray.push(key);
				}
			}
			
			for (let i = 0; i < tempResultArray.length; i++) {
				resultArray.push(arrayList[tempResultArray[i]]);
			}
		} else {
			for (let i = 0; i < dataArray.length; i++) {
				resultArray.push(arrayList[dataArray[i]]);
			}
		}

		return resultArray;
	}

	//자동완성 기능 만들어주는 함수
	addAutoComplete(e) {
		let thisEle, autoComplete;
		thisEle = e;

		if (!thisEle.readOnly) {
			if (document.getElementsByClassName("autoComplete")[0] !== undefined) {
				document.getElementsByClassName("autoComplete")[0].remove();
				thisEle.removeAttribute("data-value");
			}

			let createDiv = document.createElement("div");
			createDiv.className = "autoComplete";
			thisEle.after(createDiv);
			autoComplete = document.getElementsByClassName("autoComplete")[0];
			autoComplete.style.top = thisEle.offsetTop + 30 + "px";
			autoComplete.style.left = thisEle.offsetLeft + "px";
			autoComplete.style.width = thisEle.clientWidth + "px";

			if (thisEle.value === "") {
				for (let key in storage[thisEle.dataset.complete]) {
					let listDiv = document.createElement("div");
					listDiv.setAttribute("onclick", "CommonDatas.autoCompleteClick(this);");

					if (thisEle.dataset.complete === "cip" || thisEle.dataset.complete === "product") {
						if (thisEle.dataset.complete === "product") {
							listDiv.dataset.value = storage[thisEle.dataset.complete][key].productNo;
							listDiv.innerText = storage[thisEle.dataset.complete][key].productName;
						} else {
							listDiv.dataset.value = key;
							listDiv.innerText = storage[thisEle.dataset.complete][key].name;
						}
					} else if(thisEle.dataset.complete === "productCust"){
						listDiv.dataset.value = storage.customer[storage[thisEle.dataset.complete][key].custNo].custName;
						listDiv.innerText = storage[thisEle.dataset.complete][key].productName;
					} else if (thisEle.dataset.complete === "user") {
						listDiv.dataset.value = storage[thisEle.dataset.complete][key].userNo;
						listDiv.innerText = storage[thisEle.dataset.complete][key].userName;
					} else if (thisEle.dataset.complete === "customer") {
						listDiv.dataset.value = key;
						listDiv.innerText = storage[thisEle.dataset.complete][key].custName;
					} else if (thisEle.dataset.complete === "sopp") {
						listDiv.dataset.value = storage[thisEle.dataset.complete][key].soppNo;
						listDiv.innerText = storage[thisEle.dataset.complete][key].soppTitle;
					} else if (thisEle.dataset.complete === "contract") {
						listDiv.dataset.value = storage[thisEle.dataset.complete][key].contNo;
						listDiv.dataset.sopp = storage[thisEle.dataset.complete][key].soppNo;
						listDiv.innerText = storage[thisEle.dataset.complete][key].contTitle;
					} else if (thisEle.dataset.complete === "categories") {
						listDiv.dataset.value = storage[thisEle.dataset.complete][key].category;
						listDiv.innerText = storage[thisEle.dataset.complete][key].category;
					} 

					autoComplete.append(listDiv);
				}
			} else {
				for (let key in storage[thisEle.dataset.complete]) {
					if (thisEle.dataset.complete === "cip") {
						if (storage[thisEle.dataset.complete][key].name.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "CommonDatas.autoCompleteClick(this);");
							if (thisEle.dataset.complete === "product") {
								listDiv.dataset.value = storage[thisEle.dataset.complete][key].productNo;
								listDiv.innerText = storage[thisEle.dataset.complete][key].productName;
							} else {
								listDiv.dataset.value = key;
								listDiv.innerText = storage[thisEle.dataset.complete][key].name;
							}
							autoComplete.append(listDiv);
						}
					}else if(thisEle.dataset.complete === "product"){
						if (storage[thisEle.dataset.complete][key].productName.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "CommonDatas.autoCompleteClick(this);");
							listDiv.dataset.value = storage.customer[storage[thisEle.dataset.complete][key].custNo].custName;
							listDiv.innerText = storage[thisEle.dataset.complete][key].productName;
							autoComplete.append(listDiv);
						}
					}else if(thisEle.dataset.complete === "productCust"){
						if (storage[thisEle.dataset.complete][key].productName.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "CommonDatas.autoCompleteClick(this);");
							listDiv.dataset.value = storage.customer[storage[thisEle.dataset.complete][key].custNo].custName;
							listDiv.innerText = storage[thisEle.dataset.complete][key].productName;
							autoComplete.append(listDiv);
						}
					} else if (thisEle.dataset.complete === "user") {
						if (storage[thisEle.dataset.complete][key].userName.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "CommonDatas.autoCompleteClick(this);");
							listDiv.dataset.value = storage[thisEle.dataset.complete][key].userNo;
							listDiv.innerText = storage[thisEle.dataset.complete][key].userName;
							autoComplete.append(listDiv);
						}
					} else if (thisEle.dataset.complete === "customer") {
						if (storage[thisEle.dataset.complete][key].custName.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "CommonDatas.autoCompleteClick(this);");
							listDiv.dataset.value = storage[thisEle.dataset.complete][key].custNo;
							listDiv.innerText = storage[thisEle.dataset.complete][key].custName;
							autoComplete.append(listDiv);
						}
					} else if (thisEle.dataset.complete === "sopp") {
						if (storage[thisEle.dataset.complete][key].soppTitle.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "CommonDatas.autoCompleteClick(this);");
							listDiv.dataset.value = storage[thisEle.dataset.complete][key].soppNo;
							listDiv.innerText = storage[thisEle.dataset.complete][key].soppTitle;
							autoComplete.append(listDiv);
						}
					} else if (thisEle.dataset.complete === "contract") {
						if (storage[thisEle.dataset.complete][key].contTitle.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "CommonDatas.autoCompleteClick(this);");
							listDiv.dataset.value = storage[thisEle.dataset.complete][key].contNo;
							listDiv.dataset.sopp = storage[thisEle.dataset.complete][key].soppNo;
							listDiv.innerText = storage[thisEle.dataset.complete][key].contTitle;
							autoComplete.append(listDiv);
						}
					} else if (thisEle.dataset.complete === "categories") {
						if (storage[thisEle.dataset.complete][key].category.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "CommonDatas.autoCompleteClick(this);");
							listDiv.dataset.value = storage[thisEle.dataset.complete][key].category;
							listDiv.innerText = storage[thisEle.dataset.complete][key].category;
							autoComplete.append(listDiv);
						}
					} 
				}
			}
		}
	}

	//자동완성에서 아이템 클릭 함수
	autoCompleteClick(e) {
		let thisEle, input, autoComplete;
		thisEle = e;
		input = thisEle.parentElement.previousSibling;
		autoComplete = document.getElementsByClassName("autoComplete")[0];
		input.value = thisEle.innerText;
		input.setAttribute("data-change", true);

		if(input.dataset.complete === "productCust"){
			let categories = document.getElementById("categories");
			let categorySelect = categories.parentElement.parentElement.nextElementSibling.children[1].children[0];
			CommonDatas.makeCategories(thisEle.dataset.value);
			CommonDatas.makeCategoryOptions(categorySelect, "categories");
			thisEle.parentElement.previousElementSibling.value = "";
		}else{
			if (storage.formList !== undefined) {
				if (storage.formList[input.getAttribute("id")] !== undefined) {
					storage.formList[input.getAttribute("id")] = thisEle.dataset.value;
				}
			}
	
			if(thisEle.dataset.sopp !== undefined){
				input.setAttribute("data-sopp", thisEle.dataset.sopp);
			}
		
			input.setAttribute("data-value", thisEle.dataset.value);
		}
	
		autoComplete.remove();
	}

	//from, to 예외처리에 관한 함수
	searchDateDefaultSet(e) {
		let thisDateInput = e, matchDateInput, thisDate, year, month, day;

		if (thisDateInput.getAttribute("data-date-type") === "from") {
			matchDateInput = thisDateInput.nextElementSibling.nextElementSibling;
			let splitDate = thisDateInput.value.split("-");
			thisDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);
			splitDate = matchDateInput.value.split("-");
			let matchDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);

			if (matchDateInput.value === "") {
				thisDate.setDate(thisDate.getDate() + 1);
			} else if (thisDate.getTime() > matchDate.getTime()) {
				msg.set("시작일이 종료일보다 클 수 없습니다.");
				thisDate.setDate(thisDate.getDate() + 1);
			} else {
				return null;
			}
		} else {
			matchDateInput = thisDateInput.previousElementSibling.previousElementSibling;
			let splitDate = thisDateInput.value.split("-");
			thisDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);
			splitDate = matchDateInput.value.split("-");
			let matchDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);

			if (matchDateInput.value === "") {
				thisDate.setDate(thisDate.getDate() - 1);
			} else if (thisDate.getTime() < matchDate.getTime()) {
				msg.set("종료일이 시작일보다 작을 수 없습니다.");
				thisDate.setDate(thisDate.getDate() - 1);
			} else {
				return null;
			}
		}

		year = thisDate.getFullYear();
		month = thisDate.getMonth() + 1;
		day = thisDate.getDate();

		if (month < 10) {
			month = "0" + month;
		}

		if (day < 10) {
			day = "0" + day;
		}

		matchDateInput.value = year + "-" + month + "-" + day;
	}

	enableDisabled(e, clickStr, notIdArray, boxClassName) {
		let thisEle, box;
		thisEle = e;

		if (boxClassName === undefined) {
			box = document.querySelectorAll("input, select, textarea");
		} else {
			box = document.getElementsByClassName(boxClassName)[0].querySelectorAll("input, select, textarea");
		}


		for (let i = 0; i < box.length; i++) {
			if (box[i].type === "radio") {
				box[i].removeAttribute("readonly");
				box[i].removeAttribute("disabled");
			} else {
				if(box[i].getAttribute("id") !== ""){
					if (notIdArray.indexOf(box[i].getAttribute("id")) == -1) {
						box[i].removeAttribute("readonly");
						box[i].removeAttribute("disabled");
					}
				}else{
					box[i].removeAttribute("readonly");
					box[i].removeAttribute("disabled");
				}
			}
		}

		thisEle.setAttribute("onclick", clickStr);
		thisEle.setAttribute("data-hide-flag", true);
		thisEle.innerHTML = "수정완료";
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor, 100);

		
	}

	//tab 레이아웃 적용 함수
	setTabsLayOutMenu() {
		let tabs, tabItem, tabItemLength, width, temp;
		tabs = document.getElementsByClassName("tabs")[0];
		tabItem = document.getElementsByClassName("tabItem");
		tabItemLength = tabItem.length;
		temp = tabItemLength * 2;

		for (let i = 0; i < tabItemLength; i++) {
			tabItem[i].style.zIndex = temp;
			temp -= 2;
			if (i > 0) {
				tabItem[i].style.width = width + "%";
				tabItem[i].style.paddingLeft = (width * i) + "%";
			} else {
				width = 100 / tabItemLength;
				tabItem[i].style.width = width + "%";
			}
		}
	}

	//tab container 중 id값을 받아 해당하는 id값 빼고 전부 숨기는 함수
	detailTabHide(notId) {
		let tabs =  document.getElementsByClassName("tabs")[0];
		let radio = tabs.querySelectorAll("input[type=\"radio\"]");
		for (let i = 0; i < radio.length; i++) {
			let contents = document.querySelector("." + radio[i].dataset.contentId);
			
			if (notId === undefined) {
				contents.style.display = "none";
			} else {
				if (contents.getAttribute("id") !== notId) {
					contents.style.display = "none";
				}
			}
		}
	}

	//상세 탭 클릭 함수
	tabItemClick(e) {
		let thisEle = e;
		let tabs = document.getElementsByClassName("tabs")[0];
		let radios = tabs.querySelectorAll("input[type=\"radio\"]");

		for(let i = 0; i < radios.length; i++){
			let item = radios[i];
			let contentId = item.dataset.contentId;

			if(document.getElementById(contentId) !== undefined && document.getElementById(contentId) !== null){
				document.getElementById(contentId).style.display = "none";
			}else if(document.getElementsByClassName(contentId)[0] !== undefined && document.getElementsByClassName(contentId)[0] !== null){
				document.getElementsByClassName(contentId)[0].style.display = "none";
			}
		}

		if(document.getElementById(thisEle.dataset.contentId) !== undefined && document.getElementById(thisEle.dataset.contentId) !== null){
			document.getElementById(thisEle.dataset.contentId).style.display = "";
		}else if(document.getElementsByClassName(thisEle.dataset.contentId)[0] !== undefined && document.getElementsByClassName(thisEle.dataset.contentId)[0] !== null){
			document.getElementsByClassName(thisEle.dataset.contentId)[0].style.display = "";
		}
	}

	//오브젝트 유무를 확인하여 key 이름과 똑같은 radio, checkbox를 찾아 checked 설정해주는 함수
	detailCheckedTrueView() {
		for (let key in storage.formList) {
			if (typeof storage.formList[key] === "object") {
				if (key === "companyInformation" || key === "transactionInformation" || key === "typeOfSales") {
					for (let key2 in storage.formList[key]) {
						if (storage.formList[key][key2]) {
							if (document.getElementById(key + "_" + key2) !== null) {
								document.getElementById(key + "_" + key2).setAttribute("checked", "checked");
							}
						}
					}
				}
			}
		}
	}

	//리스트 Range 검색 함수
	listRangeChange(e, drawList) {
		let thisEle;
		thisEle = e;
		thisEle.nextElementSibling.innerHTML = thisEle.value;

		if (thisEle.value > 0) {
			storage.articlePerPage = thisEle.value;
		} else {
			storage.articlePerPage = undefined;
		}

		drawList();
	}

	//객체(오브젝트) empty 체크(비어있을 때 : true)
	objectCheck(obj) {
		if (obj.constructor === Object && Object.keys(obj).length === 0) {
			return true;
		} else {
			return false;
		}
	}

	//키업 이벤트 딜레이 함수
	keyupDelay() {
		if (v !== null) {
			window.clearTimeout(v);
			v = null;
		}
		v = window.setTimeout(hdr, 1000);
	}

	//자동완성 기능 유효성 검사 함수
	validateAutoComplete(value, type) {
		let result = false;
	
		for (let key in storage[type]) {
			if (type === "cip") {
				if (storage[type][key].name === value) {
					result = true;
				}
			} else if (type === "customer") {
				if (storage[type][key].custName === value) {
					result = true;
				}
			} else if (type === "product") {
				if (storage[type][key].productName === value) {
					result = true;
				}
			} else if (type === "user") {
				if (storage[type][key].userName === value) {
					result = true;
				}
			} else if (type === "sopp") {
				if (storage[type][key].soppTitle === value) {
					result = true;
				}
			} else if(type === "contract"){
				if (storage[type][key].contTitle === value) {
					result = true;
				}
			}
		}
	
		return result;
	}

	//숫자 콤마 형식으로 변환
	numberFormat(num) {
		if (num !== undefined) {
			let setNumber;
			setNumber = parseInt(num).toLocaleString("en-US");
			return setNumber;
		} else {
			return 0;
		}
	}

	//keyup 숫자 콤마 형식으로 변환
	inputNumberFormat(e) {
		let value;
		value = e.value.replaceAll(",", "");
	
		if(value > 0 && !isNaN(value)){
			e.value = e.value.replace(/[^0-9]/g,"");
			e.value = parseInt(value).toLocaleString("en-US");	
		}else{
			e.value = 0;
		}
	}

	//상세보기 back 버튼 함수
	hideDetailView(func){
		let defaultFormContainer, crudUpdateBtn, tabContent, storeType;
		defaultFormContainer = document.getElementsByClassName("defaultFormContainer")[0];
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		tabContent = document.getElementsByClassName("tabContent")[0];
		let tabPage = document.getElementsByClassName("tabPage")[0];
		defaultFormContainer.remove();
		crudUpdateBtn.innerText = "수정";
		storeType = document.getElementsByClassName("storeType")[0];
	
		if (tabContent !== undefined) {
			tabContent.remove();
		}

		if(tabPage !== undefined){
			tabPage.remove();
		}

		if(storeType !== undefined){
			storeType.remove();
		}
	
		document.querySelector("input").value = "";
	
		if(func !== undefined){
			func();
		}
	}

	//각 페이지별 검색 리스트 셋팅 함수
	searchListSet(list){
		storage.searchList = [];

		for(let i = 0; i < storage[list].length; i++){
			let item = storage[list][i];
			let str = "";

			for(let key in item){
				if(typeof item[key] !== "number"){
					if(CommonDatas.emptyValuesCheck(item[key])){
						str += "#undefined";
					}else{
						let dateCheck = new Date(item[key]).getTime();
						if(!isNaN(dateCheck)){
							str += "#" + key + item[key].substring(0, 10).replace(/-/g, "");
						}else{
							str += "#" + item[key];
						}
					}
				}else{
					if(CommonDatas.emptyValuesCheck(item[key])){
						str += "#0";
					}else{
						if(key === "soppNo"){
							str += "#" + CommonDatas.getSoppFind(item[key], "name");
						}else if(key === "contNo"){
							str += "#" + CommonDatas.getContFind(item[key], "name");
						}else if(key === "productNo"){
							str += "#" + CommonDatas.getProductFind(item[key], "name");
						}else if(key === "userNo"){
							str += "#" + storage.user[item[key]].userName;
						}else if(key === "custNo"){
							if(storage.customer[item[key]] !== undefined){
								str += "#" + storage.customer[item[key]].custName;
							}
						}else if(key === "type"){
							str += "#" + storage.code.etc[item[key]];
						}else if(key === "soppType"){
							str += "#" + storage.code.etc[item[key]];
						}else if(key === "cntrctMth"){
							str += "#" + storage.code.etc[item[key]];
						}else if(key === "soppStatus"){
							str += "#" + storage.code.etc[item[key]];
						}else{
							str += "#" + item[key];
						}
					}
				}
			}

			storage.searchList.push(str);
		}
	}

	// value 값 유효성 체크
	emptyValuesCheck(value){
		let flag = false;

		if(value === "" || value == 0 || value === undefined || value == null){
			flag = true;
		}else{
			flag = false;
		}

		return flag;
	}

	//영업기회 값 찾는 함수
	getSoppFind(value, type){
		let result;
		let flag = false;

		for(let i = 0; i < storage.sopp.length; i++){
			let item = storage.sopp[i];

			if(type === "name"){
				if(value == item.soppNo){
					result = item.soppTitle;
					flag = true;
				}
			}else{
				if(value.includes(item.soppTitle)){
					result = item.soppNo;
					flag = true;
				}
			}
		}

		if(!flag){
			result = "";
		}

		return result;
	}

	//계약 값 찾는 함수
	getContFind(value, type){
		let result;
		let flag = false;

		for(let i = 0; i < storage.contract.length; i++){
			let item = storage.contract[i];
			
			if(type === "name"){
				if(value == item.contNo){
					result = item.contTitle;
					flag = true;
				}
			}else{
				if(value.includes(item.contTitle)){
					result = item.contNo;
					flag = true;
				}
			}
		}

		if(!flag){
			result = "";
		}

		return result;
	}

	//상품 값 찾는 함수
	getProductFind(value, type){
		let result;
		let flag = false;

		for(let i = 0; i < storage.product.length; i++){
			let item = storage.product[i];

			if(type === "name"){
				if(value == item.productNo){
					result = item.productName;
					flag = true;
				}
			}else{
				if(value.includes(item.productName)){
					result = item.productNo;
					flag = true;
				}
			}
		}

		if(!flag){
			result = "";
		}

		return result;
	}

	//카테고리 배열 생성 함수
	makeCategories(value){
		if(storage.categoryArr === undefined){
			storage.categoryArr = [];
		}

		if(storage.categoryArr.length > 0){
			for(let i = 0; i < storage.categoryArr.length; i++){
				if(!storage.categoryArr.toString().includes(value)){
					storage.categoryArr.push(value);
				}
			}
		}else{
			storage.categoryArr.push(value);
		}
	}

	//카테고리 select option 생성 함수
	makeCategoryOptions(selectContent, categoryContentStr){
		let categoryContent;
		let firstOption = document.createElement("option");
		firstOption.value = "";
		firstOption.innerText = "선택";
		
		if(selectContent.options.length > 0){
			selectContent.options.length = 0;
		}

		selectContent.append(firstOption);

		if(document.getElementById(categoryContentStr) !== undefined) categoryContent = document.getElementById(categoryContentStr);
		else if(document.getElementsByClassName(categoryContentStr)[0] !== undefined) categoryContent = document.getElementsByClassName(categoryContentStr)[0];

		if(storage.categoryArr.length > 0){
			for(let i = 0; i < storage.categoryArr.length; i++){
				let item = storage.categoryArr[i];
				let createOption = document.createElement("option");
				createOption.value = item;
				createOption.innerText = item
				selectContent.append(createOption);
			}
		}

		categoryContent.value = storage.categoryArr.toString();
		selectContent.setAttribute("onChange", "CommonDatas.deleteCategory(this, \"" + categoryContentStr + "\");");
	}

	//category 아이템 삭제 함수
	deleteCategory(thisEle, categoryContentStr){
		if(confirm("카테고리 [" + thisEle.value + "] 삭제하시겠습니까??")){
			for(let i = 0; i < storage.categoryArr.length; i++){
				let item = storage.categoryArr[i];

				if(item === thisEle.value){
					storage.categoryArr.splice(i, 1);
					i--;
				}
			}

			CommonDatas.makeCategoryOptions(thisEle, categoryContentStr);
		}else{
			return false;
		}
	}

	//카테고리 셋팅 함수
	setCategories(result){
		if(storage.categories === undefined){
			storage.categories = {};
		}

		for(let i = 0; i < result.length; i++){
			let item = result[i];

			if(item.categories !== undefined){
				storage.categories[i] = {};
				storage.categories[i]["category"] = item.categories;
			}
		}
	}

	//tab 셋팅 함수
	setDetailTabs(datas){
		let tabHtml = "", contentKey = "", contentId = "", contentClass = "", contentChange = "";
		let createDiv = document.createElement("div");
		createDiv.className = "tabContent";
		let defaultFormContainer = document.getElementsByClassName("defaultFormContainer")[0];

		for(let i = 0; i < datas.length; i++){
			let item = datas[i];
			
			if(item.key !== undefined && item.key !== "") contentKey = " data-key=\"" + item.key + "\"";
			if(item.id !== undefined && item.id !== "") contentId = " id=\"" + item.id + "\"";
			if(item.class !== undefined && item.class !== "") contentClass = " class=\"" + item.class + "\"";
			if(item.onChange !== undefined && item.onChange !== "") contentChange = " onChange=\"" + item.onChange + "\"";

			if(i == 0) tabHtml += "<input type=\"radio\" name=\"detailTabs\"" + contentId + contentKey + contentClass + contentChange + " checked/>";
			else tabHtml += "<input type=\"radio\" name=\"detailTabs\"" + contentId + contentKey + contentClass + contentChange + "/>";
			tabHtml += "<label for=\"" + item.id + "\">" + item.text + "</label>";
		}

		createDiv.innerHTML = tabHtml;
		defaultFormContainer.before(createDiv);
	}

	multiEventStopSet(className){
		let classElements = document.getElementsByClassName(className);

		if(classElements.length > 0){
			for(let i = 0; i < classElements.length; i++){
				let item = classElements[i];
	
				item.addEventListener("click", e => {
					e.stopPropagation();
				});
			}
		}
	}
}



// let v = null, hdr, act;
// act = () => {
// 	if(v !== null){
// 		window.clearTimeout(v);
// 		v = null;
// 	}
// 	v = window.setTimeout(hdr,1000);
// }
// hdr = () => {
//  // 작동 코드
//  v = null;
// }