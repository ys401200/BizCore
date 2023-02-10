document.addEventListener("DOMContentLoaded", () => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getSoppList();
});

function getSoppList() {
	axios.get("/api/sopp").then((response) => {
		let result = cipher.decAes(response.data.data);
		result = JSON.parse(result);
		storage.soppList = result;

		if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
			window.setTimeout(drawSoppList, 600);
			window.setTimeout(addSearchList, 600);
			window.setTimeout(searchContainerSet, 600);
		}else{
			window.setTimeout(drawSoppList, 200);
			window.setTimeout(addSearchList, 200);
			window.setTimeout(searchContainerSet, 200);
		}
	})
}

function drawSoppList() {
	let container, result, job, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc, pageContainer, containerTitle, hideArr, showArr;
	
	if (storage.soppList === undefined) {
		msg.set("등록된 영업기회가 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.soppList;
		}else{
			jsonData = storage.searchDatas;
		}
	}

	result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
	
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
	containerTitle = document.getElementById("containerTitle");
	pageContainer = document.getElementsByClassName("pageContainer");
	container = document.getElementsByClassName("gridList")[0];

	header = [
		{
			"title" : "등록일",
			"align" : "center",
		},
		{
			"title" : "영업기회명",
			"align" : "center",
		},
		{
			"title" : "담당자",
			"align" : "center",
		},
		{
			"title" : "판매방식",
			"align" : "center",
		},
		{
			"title" : "계약구분",
			"align" : "center",
		},
		{
			"title" : "매출처",
			"align" : "center",
		},
		{
			"title" : "엔드유저",
			"align" : "center",
		},
		{
			"title" : "예상매출액",
			"align" : "center",
		},
		{
			"title" : "진행단계",
			"align" : "center",
		},
	];

	if(jsonData === ""){
		str = [
			{
				"setData": undefined,
				"col": 10,
			},
		];
		
		data.push(str);
	}else{
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			let soppType, contType, title, customer, endUser, employee, expectedSales, status;
			
			disDate = CommonDatas.dateDis(jsonData[i].created, jsonData[i].modified);
			setDate = CommonDatas.dateFnc(disDate, "mm-dd");
	
			soppType = (jsonData[i].soppType === null || jsonData[i].soppType === "") ? "" : storage.code.etc[jsonData[i].soppType];
			contType = (jsonData[i].contType === null || jsonData[i].contType === "") ? "" : storage.code.etc[jsonData[i].contType];
			title = (jsonData[i].title === null || jsonData[i].title === "") ? "" : jsonData[i].title;
			customer = (jsonData[i].customer === null || jsonData[i].customer == 0) ? "" : storage.customer[jsonData[i].customer].name;
			endUser = (jsonData[i].endUser === null || jsonData[i].endUser == 0 || jsonData[i].endUser === undefined) ? "" : storage.customer[jsonData[i].endUser].name;
			employee = (jsonData[i].employee === null || jsonData[i].employee == 0) ? "" : storage.user[jsonData[i].employee].userName;
			expectedSales = (jsonData[i].expectedSales === null || jsonData[i].expectedSales == 0) ? 0 : numberFormat(jsonData[i].expectedSales);
			status = (jsonData[i].status === null || jsonData[i].status === "") ? "" : storage.code.etc[jsonData[i].status];
	  
			str = [
				{
					"setData": setDate,
					"align": "center",
				},
				{
					"setData": title,
					"align": "left",
				},
				{
					"setData": employee,
					"align": "center",
				},
				{
					"setData": soppType,
					"align": "center",
				},
				{
					"setData": contType,
					"align": "center",
				},
				{
					"setData": customer,
					"align": "center",
				},
				{
					"setData": endUser,
					"align": "center",
				},
				{
					"setData": expectedSales,
					"align": "right",
				},
				{
					"setData": status,
					"align": "center",
				},
			];
	
			fnc = "soppDetailView(this);";
			ids.push(jsonData[i].no);
			data.push(str);
		}
	
		let pageNation = CommonDatas.createPaging(pageContainer[0], result[3], "pageMove", "drawSoppList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	containerTitle.innerText = "영업기회조회";
	CommonDatas.createGrid(container, header, data, ids, job, fnc);
	CommonDatas.setViewContents(hideArr, showArr);

	let path = location.pathname.split("/");
	if(path[3] !== undefined && jsonData !== ""){
		let content = document.querySelector(".gridContent[data-id=\"" + path[3] + "\"]");
		soppDetailView(content);
	}
}

function soppDetailView(e){
	let thisEle = e;

	axios.get("/api/sopp/" + thisEle.dataset.id).then((response) => {
		let result = cipher.decAes(response.data.data);
		result = JSON.parse(result);
	
		CommonDatas.detailSetFormList(result);
		let gridList = document.getElementsByClassName("gridList")[0];
		let containerTitle = document.getElementById("containerTitle");
		let detailBackBtn = document.getElementsByClassName("detailBackBtn")[0];
		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let crudDeleteBtn = document.getElementsByClassName("crudDeleteBtn")[0];
		let detailSecondTabs = document.getElementsByClassName("detailSecondTabs")[0];
		let contractReqBtn = document.getElementsByClassName("contractReqBtn");[0];
		let datas = ["employee", "customer", "picOfCustomer", "endUser"];
		let notIdArray = ["employee"];
		let disDate = CommonDatas.dateDis(result.targetDate);
		let targetDate = CommonDatas.dateFnc(disDate);
		let picOfCustomer = (result.picOfCustomer == 0 || result.picOfCustomer === undefined || result.picOfCustomer === null) ? "" : storage.cip[result.picOfCustomer].name;

		dataArray = [
			{
				"title": "담당자(*)",
				"elementId": "employee",
				"complete": "user",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": storage.user[result.employee].userName,
			},
			{
				"title": "매출처(*)",
				"elementId": "customer",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"value": storage.customer[result.customer].name,
			},
			{
				"title": "매출처 담당자",
				"complete": "cip",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "picOfCustomer",
				"value": picOfCustomer,
			},
			{
				"title": "엔드유저(*)",
				"complete": "customer",
				"keyup": "CommonDatas.addAutoComplete(this);",
				"onClick": "CommonDatas.addAutoComplete(this);",
				"elementId": "endUser",
				"value": storage.customer[result.endUser].name,
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
						"value": "견적서제출",
					},
				],
				"type": "select",
				"elementId": "status",
			},
			{
				"title": "가능성",
				"elementId": "progress",
				"value": result.progress + "%",
			},
			{
				"title": "계약구분(*)",
				"selectValue": [
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
					}
				],
				"type": "select",
				"elementId": "contType",
			},
			{
				"title": "매출예정일",
				"type": "date",
				"elementId": "targetDate",
				"value": targetDate,
			},
			{
				"title": "판매방식(*)",
				"selectValue": [
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
					}
				],
				"type": "select",
				"elementId": "soppType",
			},
			{
				"title": "예상매출",
				"elementId": "expectedSales",
				"value": CommonDatas.numberFormat(result.expectedSales),
				"keyup": "inputNumberFormat(this)",
			},
			{
				"title": "",
			},
			{
				"title": "",
			},
			{
				"title": "영업기회명(*)",
				"elementId": "title",
				"value": result.title,
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "detail",
				"value": result.detail,
				"type": "textarea",
				"disabled": false,
				"col": 4,
			},
		];

		let html = CommonDatas.detailViewForm(dataArray);
		let htmlTabs = "<input type='radio' id='tabDefault' name='tabItem' data-content-id='defaultFormContainer' onclick='CommonDatas.tabItemClick(this)' checked>";
		htmlTabs += "<label class='tabItem' for='tabDefault'>기본정보</label>";
		htmlTabs += "<input type='radio' id='tabTrade' name='tabItem' data-content-id='tabTradeList' onclick='CommonDatas.tabItemClick(this)'>";
		htmlTabs += "<label class='tabItem' for='tabTrade'>매입매출내역</label>";
		htmlTabs += "<input type='radio' id='tabFile' name='tabItem' data-content-id='tabFileList' data-id='" + result.no + "' onclick='CommonDatas.tabItemClick(this)'>";
		htmlTabs += "<label class='tabItem' for='tabFile'>파일첨부</label>";
		htmlTabs += "<input type='radio' id='tabEst' name='tabItem' data-content-id='tabEstList' onclick='CommonDatas.tabItemClick(this)'>";
		htmlTabs += "<label class='tabItem' for='tabEst'>견적내역</label>";
		htmlTabs += "<input type='radio' id='tabTech' name='tabItem' data-content-id='tabTechList' onclick='CommonDatas.tabItemClick(this)'>";
		htmlTabs += "<label class='tabItem' for='tabTech'>기술지원내역</label>";
		htmlTabs += "<input type='radio' id='tabSales' name='tabItem' data-content-id='tabSalesList' onclick='CommonDatas.tabItemClick(this)'>";
		htmlTabs += "<label class='tabItem' for='tabSales'>영업활동내역</label>";
		let createGrid = document.createElement("div");
		createGrid.className = "defaultFormContainer";
		createGrid.innerHTML = html;
		gridList.after(createGrid);
		let createTabs = document.createElement("div");
		createTabs.className = "tabs";
		createTabs.innerHTML = htmlTabs;
		let createTabLists = document.createElement("div");
		createTabLists.className = "tabLists";
		gridList.after(createTabLists);
		gridList.after(createTabs);
		CommonDatas.setTabsLayOutMenu();
		containerTitle.innerText = result.title;
		
		crudUpdateBtn.setAttribute("onclick", "enableDisabled(this, \"soppUpdate();\", \"" + notIdArray + "\");");
		crudUpdateBtn.style.display = "flex";
		crudDeleteBtn.style.display = "flex";
		
		detailBackBtn.style.display = "flex";
		storage.attachedList = result.attached;
		storage.attachedNo = result.no;
		storage.attachedType = "sopp";
		storage.attachedFlag = true;
		
		createTabTradeList(result.trades);
		createTabFileList();
		detailEstSet(result, "sopp");

		if(result.estimate.length < 1){
			createTabEstList(result.estimate);
		}else{
			createTabEstList(result.estimate[0].children);
		}

		createTabTechList(result.schedules);
		createTabSalesList(result.schedules);
		CommonDatas.detailTabHide("defaultFormContainer");
		CommonDatas.detailTrueDatas(datas);

		setTimeout(() => {
			document.querySelector("#contType option[value='" + result.contType + "']").setAttribute("selected" ,true);
			document.querySelector("#soppType option[value='" + result.soppType + "']").setAttribute("selected" ,true);
			hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
			showArr = [
				{ element: "defaultFormContainer", display: "grid" },"crudUpdateBtn", "crudDeleteBtn",
				{ element: "detailSecondTabs", display: "block" },
				{ element: "crudUpdateBtn", display: "flex" },
				{ element: "crudDeleteBtn", display: "flex" },
			];
			CommonDatas.setViewContents(hideArr, showArr);
			window.setTimeout(setEditor, 100);
		}, 100);
	}).catch((error) => {
		msg.set("상세보기 통신 에러!! \n" + error);
		console.log(error);
	});
}

function detailEstSet(result, pageType){
	localStorage.setItem("detailNo", result.no);
	localStorage.setItem("detailType", pageType);
	
	if(result.estimate.length > 0){
		localStorage.setItem("estimateNo", result.estimate[0].no);
	}
}

function soppInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "담당자(*)",
			"elementId": "employee",
			"complete": "user",
			"keyup": "CommonDatas.addAutoComplete(this);",
			"onClick": "CommonDatas.addAutoComplete(this);",
		},
		{
			"title": "매출처(*)",
			"elementId": "customer",
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
			"elementId": "picOfCustomer",
			"disabled": false,
		},
		{
			"title": "엔드유저(*)",
			"complete": "customer",
			"keyup": "CommonDatas.addAutoComplete(this);",
			"onClick": "CommonDatas.addAutoComplete(this);",
			"elementId": "endUser",
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
					"value": "견적서제출",
				},
			],
			"type": "select",
			"disabled": false,
			"elementId": "status",
		},
		{
			"title": "가능성",
			"elementId": "progress",
			"disabled": false,
		},
		{
			"title": "계약구분(*)",
			"selectValue": [
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
				}
			],
			"type": "select",
			"elementId": "contType",
			"disabled": false,
		},
		{
			"title": "매출예정일",
			"type": "date",
			"elementId": "targetDate",
			"disabled": false,
		},
		{
			"title": "판매방식(*)",
			"selectValue": [
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
				}
			],
			"type": "select",
			"elementId": "soppType",
			"disabled": false,
		},
		{
			"title": "예상매출",
			"disabled": false,
			"elementId": "expectedSales",
			"keyup": "CommonDatas.inputNumberFormat(this)",
		},
		{
			"title": "",
		},
		{
			"title": "",
		},
		{
			"title": "영업기회명(*)",
			"elementId": "title",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "내용",
			"elementId": "detail",
			"type": "textarea",
			"disabled": false,
			"col": 4,
		},
	];

	html = CommonDatas.detailViewForm(dataArray, "modal");

	modal.show();
	modal.content.style.minWidth = "70vw";
	modal.content.style.maxWidth = "70vw";
	modal.headTitle.innerText = "영업기회등록";
	modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
	modal.confirm.innerText = "등록";
	modal.close.innerText = "취소";
	modal.confirm.setAttribute("onclick", "soppInsert();");
	modal.close.setAttribute("onclick", "modal.hide();");

	storage.formList = {
		"employee": storage.my,
		"customer": 0,
		"picOfCustomer": 0,
		"endUser": 0,
		"status": "",
		"progress": 0,
		"contType": "",
		"targetDate": "",
		"soppType": "",
		"expectedSales": 0,
		"title": "",
		"detail": ""
	};
	
	setTimeout(() => {
		let my = storage.my, nowDate;
		nowDate = new Date();
		nowDate = nowDate.toISOString().substring(0, 10);
		document.getElementById("employee").value = storage.user[my].userName;
		document.getElementById("employee").setAttribute("data-change", true);
		document.getElementById("targetDate").value = nowDate;
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor, 100);
	}, 100);
}

function soppInsert(){
	if(document.getElementById("title").value === ""){
		msg.set("제목을 입력해주세요.");
		document.getElementById("title").focus();
		return false;
	}else if(document.getElementById("employee").value === ""){
		msg.set("담당자를 입력해주세요.");
		document.getElementById("employee").focus();
		return false;
	}else if(document.getElementById("customer").value === ""){
		msg.set("매출처를 입력해주세요.");
		document.getElementById("customer").focus();
		return false;
	}else if(!CommonDatas.validateAutoComplete(document.getElementById("customer").value, "customer")){
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		document.getElementById("customer").focus();
		return false;
	}else if(document.getElementById("picOfCustomer").value !== "" && !CommonDatas.validateAutoComplete($("#picOfCustomer").value, "cip")){
		msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
		document.getElementById("picOfCustomer").focus();
		return false;
	}else if(document.getElementById("endUser").value === ""){
		msg.set("엔드유저를 입력해주세요.");
		document.getElementById("endUser").focus();
		return false;
	}else if(!CommonDatas.validateAutoComplete(document.getElementById("endUser").value, "customer")){
		msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
		document.getElementById("endUser").focus();
		return false;
	}else{
		CommonDatas.formDataSet();
		let url, method, data, type;
		url = "/api/sopp";
		method = "post";
		data = storage.formList;
		type = "insert";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, soppSuccessInsert, soppErrorInsert);
	}
}

function soppSuccessInsert(){
	location.reload();
	msg.set("등록완료");
}

function soppErrorInsert(){
	msg.set("등록에러");
}

function soppUpdate(){
	if($("#title").val() === ""){
		msg.set("제목을 입력해주세요.");
		$("#title").focus();
		return false;
	}else if($("#employee").val() === ""){
		msg.set("담당자를 입력해주세요.");
		$("#employee").focus();
		return false;
	}else if($("#customer").val() === ""){
		msg.set("매출처를 입력해주세요.");
		$("#customer").focus();
		return false;
	}else if($("#endUser").val() === ""){
		msg.set("엔드유저를 입력해주세요.");
		$("#endUser").focus();
		return false;
	}else{
		let url, method, data, type;
		formDataSet();
		url = "/api/sopp/" + storage.formList.no;
		method = "put";
		data = storage.formList;
		type = "update";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, soppSuccessUpdate, soppErrorUpdate);
	}
}

function soppSuccessUpdate(){
	location.reload();
	msg.set("수정완료");
}

function soppErrorUpdate(){
	msg.set("수정에러");
}

function soppDelete(){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/sopp/" + storage.formList.no;
		method = "delete";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, soppSuccessDelete, soppErrorDelete);
	}else{
		return false;
	}
}

function soppSuccessDelete(){
	location.reload();
	msg.set("삭제완료");
}

function soppErrorDelete(){
	msg.set("삭제에러");
}

function searchInputKeyup(){
	let searchAllInput, tempArray;
	searchAllInput = $("#searchAllInput").val();
	tempArray = searchDataFilter(storage.soppList, searchAllInput, "input");

	if(tempArray.length > 0){
		storage.searchDatas = tempArray;
	}else{
		storage.searchDatas = "";
	}

	drawSoppList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.soppList.length; i++){
		let no, soppType, contType, title, customer, endUser, employee, expectedSales, status, disDate, setDate;
		no = storage.soppList[i].no;
		soppType = storage.code.etc[storage.soppList[i].soppType];
		contType = storage.code.etc[storage.soppList[i].contType];
		title = storage.soppList[i].title;
		customer = (storage.soppList[i].customer === null || storage.soppList[i].customer == 0) ? "" : storage.customer[storage.soppList[i].customer].name;
		endUser = (storage.soppList[i].endUser === null || storage.soppList[i].endUser == 0 || storage.soppList[i].endUser == 104571) ? "" : storage.customer[storage.soppList[i].endUser].name;
		employee = (storage.soppList[i].employee === null || storage.soppList[i].employee == 0) ? "" : storage.user[storage.soppList[i].employee].userName;
		expectedSales = storage.soppList[i].expectedSales;
		status = storage.code.etc[storage.soppList[i].status];
		disDate = dateDis(storage.soppList[i].created, storage.soppList[i].modified);
		setDate = parseInt(dateFnc(disDate).replaceAll("-", ""));
		storage.searchList.push("#" + no + "#" + employee + "#" + customer + "#" + title + "#" + soppType + "#" + contType + "#" + status + "#" + endUser + "#" + expectedSales + "#created" + setDate);
	}
}

function searchSubmit(){
	let dataArray = [], resultArray, eachIndex = 0, searchEmployee, searchCustomer, searchTitle, searchSoppType, searchContType, searchStatus, searchCreatedFrom;

	searchEmployee = $("#searchEmployee").val();
	searchCustomer = $("#searchCustomer").val();
	searchTitle = $("#searchTitle").val();
	searchSoppType = $("#searchSoppType").val();
	searchContType = $("#searchContType").val();
	searchStatus = $("#searchStatus").val();
	searchCreatedFrom = ($("#searchCreatedFrom").val() === "") ? "" : $("#searchCreatedFrom").val().replaceAll("-", "") + "#created" + $("#searchCreatedTo").val().replaceAll("-", "");
	
	let searchValues = [searchEmployee, searchCustomer, searchTitle, searchSoppType, searchContType, searchStatus, searchCreatedFrom];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null){
			let tempArray = searchDataFilter(storage.soppList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.soppList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		msg.set("찾는 데이터가 없습니다.");
		storage.searchDatas = storage.soppList;
	}
	
	drawSoppList();
}