$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getCustomerList();
});

function getCustomerList() {
	let url, method, data, type;

	url = "/api/system/customer2";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, customerSuccessList, customerErrorList);
}

function drawCustomerList() {
	let container, result, job, jsonData, header = [], data = [], ids = [], pageContainer, str, fnc;
	
	if (storage.customerList === undefined) {
		msg.set("등록된 고객사가 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.customerList;
		}else{
			jsonData = storage.searchDatas;
		}
	}

	result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn"];
	showArr = [
		{element: "gridList", display: "grid"},
		{element: "pageContainer", display: "flex"},
		{element: "searchContainer", display: "block"},
		{element: "listRange", display: "flex"},
		{element: "listSearchInput", display: "flex"},
		{element: "crudAddBtn", display: "flex"},
	];
	pageContainer = document.getElementsByClassName("pageContainer");
	container = document.getElementsByClassName("gridList")[0];

	header = [
		{
			"title" : "고객사명",
			"align" : "center",
		},
		{
			"title" : "대표자명",
			"align" : "center",
		},
		{
			"title" : "사업자번호",
			"align" : "center",
		},
	];

	if(jsonData === ""){
		str = [
			{
				"setData": undefined,
				"align": "center",
				"col": 3,
			},
		];
		
		data.push(str);
	}else{
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			let name, taxId, ceoName;

			name = (jsonData[i].name === "" || jsonData[i].name === null || jsonData[i].name === undefined) ? "" : jsonData[i].name;
			taxId = (jsonData[i].taxId === "" || jsonData[i].taxId === null || jsonData[i].taxId === undefined) ? "" : jsonData[i].taxId;
			ceoName = (jsonData[i].ceoName === "" || jsonData[i].ceoName === null || jsonData[i].ceoName === undefined) ? "" : jsonData[i].ceoName;
	  
			str = [
				{
					"setData": name,
					"align": "center",
				},
				{
					"setData": ceoName,
					"align": "center",
				},
				{
					"setData": taxId,
					"align": "center",
				}
			];
	
			fnc = "customerDetailView(this);";
			ids.push(jsonData[i].no);
			data.push(str);
		}
	
		let pageNation = CommonDatas.createPaging(pageContainer[0], result[3], "pageMove", "drawCustomerList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	CommonDatas.createGrid(container, header, data, ids, job, fnc);
	document.getElementById("containerTitle").innerText = "고객사조회";
	document.getElementsByClassName("listRangeInput")[0].value = 0;
	document.getElementById("multiSearchBtn").setAttribute("onclick", "searchSubmit();");
	CommonDatas.setViewContents(hideArr, showArr);
}

function customerSuccessList(result){
	storage.customerList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawCustomerList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawCustomerList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function customerErrorList(){
	msg.set("에러");
}

function customerDetailView(e){
	let id, url, method, data, type;

	id = $(e).data("id");
	url = "/api/system/customer/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, customerSuccessView, customerErrorView);
}

function customerSuccessView(result){
	let html, htmlSecond, name, ceoName, taxId, address, detailAddress, zipCode, email, emailForTaxbill, fax, phone, remark1, remark2, dataArray, notIdArray, containerTitle, detailBackBtn, detailSecondTabs, crudUpdateBtn, crudDeleteBtn, createDiv;
	CommonDatas.detailSetFormList(result);
	gridList = document.getElementsByClassName("gridList")[0];
	containerTitle = document.getElementById("containerTitle");
	detailBackBtn = document.getElementsByClassName("detailBackBtn")[0];
	detailSecondTabs = document.getElementsByClassName("detailSecondTabs")[0];
	crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
	crudDeleteBtn = document.getElementsByClassName("crudDeleteBtn")[0];
	notIdArray = ["zipCode", "address"];

	name = (result.name === null || result.name === "" || result.name === undefined) ? "" : result.name;
	ceoName = (result.ceoName === null || result.ceoName === "" || result.ceoName === undefined) ? "" : result.ceoName;
	taxId = (result.taxId === null || result.taxId === "" || result.taxId === undefined) ? "" : result.taxId;
	zipCode = (result.zipCode === null || result.zipCode === 0 || result.zipCode === undefined) ? "" : result.zipCode;
	address = (result.address === null || result.address === "" || result.address === undefined) ? "" : result.address[0];
	detailAddress = (result.address === null || result.address === "" || result.address === undefined) ? "" : result.address[1];
	email = (result.email === null || result.email === "" || result.email === undefined) ? "" : result.email;
	emailForTaxbill = (result.emailForTaxbill === null || result.emailForTaxbill === "" || result.emailForTaxbill === undefined) ? "" : result.emailForTaxbill;
	fax = (result.fax === null || result.fax === "" || result.fax === undefined) ? "" : result.fax;
	phone = (result.phone === null || result.phone === "" || result.phone === undefined) ? "" : result.phone;
	remark1 = (result.remark1 === null || result.remark1 === "" || result.remark1 === undefined) ? "" : result.remark1;
	remark2 = (result.remark2 === null || result.remark2 === "" || result.remark2 === undefined) ? "" : result.remark2;

	dataArray = [
		{
			"title": undefined,
			"radioValue": [
				{
					"key": true,
					"value": "제조사",
				},
				{
					"key": false,
					"value": "협력사",
				},
				{
					"key": false,
					"value": "공공",
				},
				{
					"key": false,
					"value": "민수",
				},
			],
			"type": "radio",
			"elementId": ["manufacturer", "partner", "publicCustomer", "civilianCustomer"],
			"elementName": "companyInformation",
			"onChange" : "radioTrueChange(this);",
			"col": 4,
		},
		{
			"title": "영업정보",
			"radioValue": [
				{
					"key": true,
					"value": "조달-직판",
				},
				{
					"key": false,
					"value": "조달-간판",
				},
				{
					"key": false,
					"value": "조달-대행",
				},
				{
					"key": false,
					"value": "유지보수",
				},
				{
					"key": false,
					"value": "일반기업",
				},
				{
					"key": false,
					"value": "병원",
				},
				{
					"key": false,
					"value": "금융",
				},
				{
					"key": false,
					"value": "공공기관",
				},
			],
			"type": "radio",
			"elementId": ["directProcurement", "indirectProcurement", "agencyProcurement", "maintenance", "generalCompany", "hospital", "finance", "public"],
			"elementName": "typeOfSales",
			"onChange" : "radioTrueChange(this);",
			"col": 4,
		},
		{
			"title": "거래정보",
			"checkValue": [
				{
					"key": "공급사",
					"value": false,
				},
				{
					"key": "협력사",
					"value": false,
				},
				{
					"key": "고객사",
					"value": false,
				},
				{
					"key": "거래안함",
					"value": false,
				},
			],
			"type": "checkbox",
			"elementId": ["transactionInformation_supplier", "transactionInformation_partner", "transactionInformation_client", "transactionInformation_notTrade"],
			"onChange" : "checkTrueChange(this);",
			"col": 4,
		},
		{
			"title": "고객사명(*)",
			"elementId": "name",
			"value": name,
		},
		{
			"title": "대표자명(*)",
			"elementId": "ceoName",
			"value": ceoName,
		},
		{
			"title": "사업자번호(*)",
			"elementId": "taxId",
			"value": taxId,
			"col": 2,
		},
		{
			"title": "우편번호",
			"elementId": "zipCode",
			"onClick": "daumPostCode(\"zipCode\", \"address\", \"detailAddress\");",
			"placeHolder": "우편번호를 넣으려면 클릭해주세요.",
			"value": zipCode,
			"col": 2,
		},
		{
			"title": "주소",
			"elementId": "address",
			"onClick": "daumPostCode(\"zipCode\", \"address\", \"detailAddress\");",
			"placeHolder": "주소를 넣으려면 클릭해주세요.",
			"value": address,
			"col": 2,
		},
		{
			"title": "상세주소",
			"elementId": "detailAddress",
			"value": detailAddress,
			"col": 4,
		},
		{
			"title": "이메일(*)",
			"elementId": "email",
			"value": email,
			"col": 2,
		},
		{
			"title": "계산서이메일(*)",
			"elementId": "emailForTaxbill",
			"value": emailForTaxbill,
			"col": 2,
		},
		{
			"title": "팩스(*)",
			"elementId": "fax",
			"keyup": "phoneFormat(this);",
			"value": fax,
			"col": 2,
		},
		{
			"title": "연락처",
			"elementId": "phone",
			"keyup": "phoneFormat(this);",
			"value": phone,
			"col": 2,
		},
		{
			"title": "메모",
			"type": "textarea",
			"elementId": "remark1",
			"value": remark1,
			"col": 4,
		},
		{
			"title": "세무 메모",
			"type": "textarea",
			"elementId": "remark2",
			"value": remark2,
			"col": 4,
		},
	];

	html = CommonDatas.detailViewForm(dataArray);
	htmlSecond = "<input type='radio' id='customerTabSales' name='tabItem' data-content-id='customerTabSalesList' onclick='tabItemClick(this)' checked>";
	htmlSecond += "<label class='tabItem' for='customerTabSales'></label>";
	// htmlSecond += "<input type='radio' id='customerTabContract' name='tabItem' data-content-id='customerTabContractList' onclick='tabItemClick(this)'>";
	// htmlSecond += "<label class='tabItem' for='customerTabContract'></label>";
	htmlSecond += "<input type='radio' id='customerTabTech' name='tabItem' data-content-id='customerTabTechList' onclick='tabItemClick(this)'>";
	htmlSecond += "<label class='tabItem' for='customerTabTech'>기술지원정보</label>";
	createDiv = document.createElement("div");
	createDiv.className = "tabs";
	createDiv.innerHTML = htmlSecond;
	detailSecondTabs.append(createDiv);
	containerTitle.innerHTML = name;
	detailBackBtn.style.display = "flex";
	createDiv = document.createElement("div");
	createDiv.className = "defaultFormContainer";
	createDiv.innerHTML = html;
	gridList.after(createDiv);
	CommonDatas.setTabsLayOutMenu();
	customerTabSalesList();
	// customerTabContractList();
	customerTabTechList();
	crudUpdateBtn.setAttribute("onclick", "enableDisabled(this, \"customerUpdate();\", \"" + notIdArray + "\");");
	crudUpdateBtn.style.display = "flex";
	crudDeleteBtn.style.display = "flex";
	CommonDatas.detailCheckedTrueView();
	hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
	showArr = [
		{element: "defaultFormContainer", display: "grid"},
		{element: "detailSecondTabs", display: "grid"},
	];
	CommonDatas.setViewContents(hideArr, showArr);
	setTimeout(() => {
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
	}, 100);
	
	setTimeout(() => {
		CommonDatas.detailTabHide("customerTabSalesList");
	}, 300);
}

function customerErrorView(){
	msg.set("에러");
}

function customerInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": undefined,
			"radioValue": [
				{
					"key": true,
					"value": "제조사",
				},
				{
					"key": false,
					"value": "협력사",
				},
				{
					"key": false,
					"value": "공공",
				},
				{
					"key": false,
					"value": "민수",
				},
			],
			"type": "radio",
			"elementId": ["manufacturer", "partner", "publicCustomer", "civilianCustomer"],
			"elementName": "companyInformation",
			"disabled": false,
			"onChange" : "radioTrueChange(this);",
			"col": 4,
		},
		{
			"title": "영업정보",
			"radioValue": [
				{
					"key": true,
					"value": "조달-직판",
				},
				{
					"key": false,
					"value": "조달-간판",
				},
				{
					"key": false,
					"value": "조달-대행",
				},
				{
					"key": false,
					"value": "유지보수",
				},
				{
					"key": false,
					"value": "일반기업",
				},
				{
					"key": false,
					"value": "병원",
				},
				{
					"key": false,
					"value": "금융",
				},
				{
					"key": false,
					"value": "공공기관",
				},
			],
			"type": "radio",
			"elementId": ["directProcurement", "indirectProcurement", "agencyProcurement", "maintenance", "generalCompany", "hospital", "finance", "public"],
			"elementName": "typeOfSales",
			"onChange" : "radioTrueChange(this);",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "거래정보",
			"checkValue": [
				{
					"key": "공급사",
					"value": false,
				},
				{
					"key": "협력사",
					"value": false,
				},
				{
					"key": "고객사",
					"value": false,
				},
				{
					"key": "거래안함",
					"value": false,
				},
			],
			"type": "checkbox",
			"elementId": ["transactionInformation_supplier", "transactionInformation_partner", "transactionInformation_client", "transactionInformation_notTrade"],
			"onChange" : "checkTrueChange(this);",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "고객사명(*)",
			"elementId": "name",
			"disabled": false,
		},
		{
			"title": "대표자명(*)",
			"elementId": "ceoName",
			"disabled": false,
		},
		{
			"title": "사업자번호(*)",
			"elementId": "taxId",
			"disabled": false,
			"col": 2,
		},
		{
			"title": "우편번호",
			"elementId": "zipCode",
			"onClick": "daumPostCode(\"zipCode\", \"address\", \"detailAddress\");",
			"placeHolder": "우편번호를 넣으려면 클릭해주세요.",
			"col": 2,
		},
		{
			"title": "주소",
			"elementId": "address",
			"onClick": "daumPostCode(\"zipCode\", \"address\", \"detailAddress\");",
			"placeHolder": "주소를 넣으려면 클릭해주세요.",
			"col": 2,
		},
		{
			"title": "상세주소",
			"elementId": "detailAddress",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "이메일(*)",
			"elementId": "email",
			"disabled": false,
			"col": 2,
		},
		{
			"title": "계산서이메일(*)",
			"elementId": "emailForTaxbill",
			"disabled": false,
			"col": 2,
		},
		{
			"title": "팩스(*)",
			"elementId": "fax",
			"keyup": "phoneFormat(this);",
			"disabled": false,
			"col": 2,
		},
		{
			"title": "연락처",
			"elementId": "phone",
			"keyup": "phoneFormat(this);",
			"disabled": false,
			"col": 2,
		},
		{
			"title": "메모",
			"type": "textarea",
			"elementId": "remark1",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "세무 메모",
			"type": "textarea",
			"elementId": "remark2",
			"disabled": false,
			"col": 4,
		},
	];

	storage.formList = {
		"companyInformation" : {
			"manufacturer" : true,
			"partner" : false,
			"publicCustomer" : false,
			"civilianCustomer" : false,
		},
		"typeOfSales" : {
			"directProcurement" : true,
		 	"indirectProcurement" : false, 
			"agencyProcurement" : false, 
			"maintenance" : false, 
			"generalCompany" : false, 
			"hospital" : false, 
			"finance" : false, 
			"public" : false,
		},
		"transactionInformation" : {
			"supplier" : false,
			"partner" : false, 
			"client" : false, 
			"notTrade" : false,
		},
		"name" : "",
		"ceoName" : "",
		"taxId" : "",
		"zipCode" : 0,
		"address" : ["", ""],
		"email" : "",
		"emailForTaxbill" : "",
		"fax" : "",
		"phone" : "",
		"remark1" : "",
		"remark2" : "",
	};

	html = detailViewForm(dataArray, "modal");

	modal.show();
	modal.content.css("min-width", "70%");
	modal.content.css("max-width", "70%");
	modal.headTitle.text("고객사등록");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "customerInsert();");
	modal.close.attr("onclick", "modal.hide();");
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
}

function customerInsert(){
	if($("#name").val() === ""){
		msg.set("고객사명을 입력해주세요.");
		$("#name").focus();
		return false;
	}else if($("#taxId").val() === ""){
		msg.set("사업자번호를 입력해주세요.");
		$("#taxId").focus();
		return false;
	}else if($("#ceoName").val() === ""){
		msg.set("대표자명을 입력해주세요.");
		$("#ceoName").focus();
		return false;
	}else if($("#email").val() === ""){
		msg.set("이메일을 입력해주세요.");
		$("#email").focus();
		return false;
	}else if(!validateEmail($("#email").val())){
		msg.set("이메일 형식이 바르지 않습니다.");
		$("#email").focus();
		return false;
	}else if(!validateEmail($("#emailForTaxbill").val())){
		msg.set("이메일 형식이 바르지 않습니다.");
		$("#emailForTaxbill").focus();
		return false;
	}else if($("#fax").val() === ""){
		msg.set("팩스를 입력해주세요.");
		$("#fax").focus();
		return false;
	}else{
		storage.formList.name = $("#name").val();
		storage.formList.ceoName = $("#ceoName").val();
		storage.formList.taxId = $("#taxId").val();
		storage.formList.zipCode = parseInt($("#zipCode").val());
		storage.formList.address = [$("#address").val(), $("#detailAddress").val()];
		storage.formList.email = $("#email").val();
		storage.formList.emailForTaxbill = $("#emailForTaxbill").val();
		storage.formList.fax = $("#fax").val();
		storage.formList.phone = $("#phone").val();
		storage.formList.remark1 = $("#remark1").val();
		storage.formList.remark2 = $("#remark2").val();
		url = "/api/system/customer";
		method = "post";
		data = storage.formList;
		type = "insert";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, customerSuccessInsert, customerErrorInsert);
	}
}

function customerSuccessInsert(){
	// location.reload();
	msg.set("등록완료");
}

function customerErrorInsert(){
	msg.set("등록에러");
}

function customerUpdate(){
	if($("#name").val() === ""){
		msg.set("고객사명을 입력해주세요.");
		$("#name").focus();
		return false;
	}else if($("#taxId").val() === ""){
		msg.set("사업자번호를 입력해주세요.");
		$("#taxId").focus();
		return false;
	}else if($("#ceoName").val() === ""){
		msg.set("대표자명을 입력해주세요.");
		$("#ceoName").focus();
		return false;
	}else if($("#email").val() === ""){
		msg.set("이메일을 입력해주세요.");
		$("#email").focus();
		return false;
	}else if(!validateEmail($("#email").val())){
		msg.set("이메일 형식이 바르지 않습니다.");
		$("#email").focus();
		return false;
	}else if(!validateEmail($("#emailForTaxbill").val())){
		msg.set("이메일 형식이 바르지 않습니다.");
		$("#emailForTaxbill").focus();
		return false;
	}else if($("#fax").val() === ""){
		msg.set("팩스를 입력해주세요.");
		$("#fax").focus();
		return false;
	}else{
		storage.formList.name = $("#name").val();
		storage.formList.ceoName = $("#ceoName").val();
		storage.formList.taxId = $("#taxId").val();
		storage.formList.zipCode = parseInt($("#zipCode").val());
		storage.formList.address = [$("#address").val(), $("#detailAddress").val()];
		storage.formList.email = $("#email").val();
		storage.formList.emailForTaxbill = $("#emailForTaxbill").val();
		storage.formList.fax = $("#fax").val();
		storage.formList.phone = $("#phone").val();
		storage.formList.remark1 = $("#remark1").val();
		storage.formList.remark2 = $("#remark2").val();
		url = "/api/system/customer/" + storage.formList.no;
		method = "put";
		data = storage.formList;
		type = "update";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, customerSuccessUpdate, customerErrorUpdate);
	}
}

function customerSuccessUpdate(){
	location.reload();
	msg.set("수정완료");
}

function customerErrorUpdate(){
	msg.set("수정에러");
}

function customerDelete(){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/system/customer/" + storage.formList.no;
		method = "delete";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, customerSuccessDelete, customerErrorDelete);
	}else{
		return false;
	}
}

function customerSuccessDelete(){
	location.reload();
	msg.set("삭제완료");
}

function customerErrorDelete(){
	msg.set("삭제에러");
}

function searchInputKeyup(){
	let searchAllInput, tempArray;
	searchAllInput = document.getElementById("searchAllInput").value;
	tempArray = CommonDatas.searchDataFilter(storage.customerList, searchAllInput, "input");

	if(tempArray.length > 0){
		storage.searchDatas = tempArray;
	}else{
		storage.searchDatas = "";
	}
	
	drawCustomerList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.customerList.length; i++){
		let name, ceoName, taxId;
		name = storage.customerList[i].name;
		ceoName = storage.customerList[i].ceoName;
		taxId = storage.customerList[i].taxId;
		storage.searchList.push("#" + name + "#" + ceoName + "#" + taxId);
	}
}

function searchSubmit(){
	let dataArray = [], resultArray, eachIndex = 0;

	searchName = "#1/" + document.getElementById("searchName").value;
	searchCeoName = "#2/" + document.getElementById("searchCeoName").value;
	searchTaxId = "#3/" + document.getElementById("searchTaxId").value;
	
	let searchValues = [searchName, searchCeoName, searchTaxId];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null){
			let tempArray = CommonDatas.searchDataFilter(storage.customerList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = CommonDatas.searchMultiFilter(eachIndex, dataArray, storage.customerList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		msg.set("찾는 데이터가 없습니다.");
		storage.searchDatas = storage.customerList;
	}
	
	drawCustomerList();
}

function customerTabSalesList(){
	axios.get("/api/schedule/sales/sopp/0/customer/" + storage.formList.no).then((response) => {
		let container, header = [], data = [], str, detailSecondTabs, ids, job, fnc, disDate, idName, result, createDiv;
		detailSecondTabs = document.getElementsByClassName("detailSecondTabs")[0];
		header = [
			{
				"title" : "일자",
				"align" : "center",
			},
			{
				"title" : "영업활동명",
				"align" : "center",
			},
			{
				"title" : "비고",
				"align" : "center",
			},
			{
				"title" : "담당자",
				"align" : "center",
			},
		];
		
		createDiv = document.createElement("div");
		createDiv.className = "customerTabSalesList";
		createDiv.id = "customerTabSalesList";
		detailSecondTabs.append(createDiv);
		container = detailSecondTabs.getElementsByClassName("customerTabSalesList")[0];

		if(response.data.result === "ok"){
			result = cipher.decAes(response.data.data);
			result = JSON.parse(result);

			if(result.length > 0){
				document.querySelector(".tabItem[for=\"customerTabSales\"]").innerText = "영업활동정보(" + result.length + ")";
			}else{
				document.querySelector(".tabItem[for=\"customerTabSales\"]").innerText = "영업활동정보(0)";
			}
		
			if(result.length > 0){
				for(let i = 0; i < result.length; i++){
					disDate = CommonDatas.dateDis(result[i].created, result[i].modified);
					disDate = CommonDatas.dateFnc(disDate); 
	
					str = [
						{
							"setData": disDate,
							"align" : "center",
						},
						{
							"setData": result[i].title,
							"align" : "left",
						},
						{
							"setData": result[i].content,
							"align" : "left",
						},
						{
							"setData": storage.user[result[i].writer].userName,
							"align" : "center",
						},
					];

					data.push(str);
				}
			}else{
				str = [
					{
						"setData": undefined,
						"align": "center",
						"col": 4,
					},
				];
				data.push(str);
			}
		}else{
			document.querySelector(".tabItem[for=\"customerTabSales\"]").innerText = "영업활동정보(0)";
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 4,
				},
			];
			data.push(str);
		}

		idName = "customerTabSalesList";
		setTimeout(() => {
			CommonDatas.createGrid(container, header, data, ids, job, fnc, idName);
		}, 100);
	}).catch((error) => {
		msg.set("영업활동내역을 불러오는 중에 에러가 발생했습니다.\n" + error);
		console.log(error);
		return false;
	});
}

function customerTabContractList(){
	$.ajax({
		url: "/api/contract/sopp/0/customer/" + storage.formList.no,
		method: "get",
		dataType: "json",
		contentType: "text/plain",
		success: (result) => {
			let html = "", container, header = [], data = [], str, detailSecondTabs, ids, job, fnc, disDate, idName;
			result = cipher.decAes(result.data);
			result = JSON.parse(result);

			if(result.length > 0){
				$(".tabItem[for=\"customerTabContract\"]").text("계약정보(" + result.length + ")");
			}else{
				$(".tabItem[for=\"customerTabContract\"]").text("계약정보(0)");
			}

			detailSecondTabs = $(".detailSecondTabs");
			html = "<div class='customerTabContractList' id='customerTabContractList'></div>";
			header = [
				{
					"title" : "일자",
					"align" : "center",
				},
				{
					"title" : "계약명",
					"align" : "center",
				},
				{
					"title" : "비고",
					"align" : "center",
				},
				{
					"title" : "계약금액",
					"align" : "center",
				},
			];
			
			detailSecondTabs.append(html);
			container = detailSecondTabs.find(".customerTabContractList");
		
			if(result.length > 0){
				for(let i = 0; i < result.length; i++){
					disDate = dateDis(result[i].created, result[i].modified);
					disDate = dateFnc(disDate); 
	
					str = [
						{
							"setData": disDate,
							"align" : "center",
						},
						{
							"setData": result[i].title,
							"align" : "left",
						},
						{
							"setData": result[i].detail,
							"align" : "left",
						},
						{
							"setData": parseInt(result[i].contractAmount).toLocaleString("en-US"),
							"align" : "right",
						},
					];
					
					data.push(str);
				}
			}else{
				str = [
					{
						"setData": undefined,
						"col": 4,
					},
				];
			}

			idName = "customerTabContractList";
			setTimeout(() => {
				createGrid(container, header, data, ids, job, fnc, idName);
			}, 100);
		}
	})
}

function customerTabTechList(){
	axios.get("/api/schedule/tech/sopp/0/customer/" + storage.formList.no + "/contract/0").then((response) => {
		let container, header = [], data = [], str, detailSecondTabs, ids, job, fnc, disDate, idName, result, createDiv;
		detailSecondTabs = document.getElementsByClassName("detailSecondTabs")[0];
		header = [
			{
				"title" : "일자",
				"align" : "center",
			},
			{
				"title" : "기술지원명",
				"align" : "center",
			},
			{
				"title" : "비고",
				"align" : "center",
			},
			{
				"title" : "담당자",
				"align" : "center",
			},
		];
		
		createDiv = document.createElement("div");
		createDiv.className = "customerTabTechList";
		createDiv.id = "customerTabTechList";
		detailSecondTabs.append(createDiv);
		container = detailSecondTabs.getElementsByClassName("customerTabTechList")[0];

		if(response.data.result === "ok"){
			result = cipher.decAes(response.data.data);
			result = JSON.parse(result);
		
			if(result.length > 0){
				document.querySelector(".tabItem[for=\"customerTabTech\"]").innerText = "기술지원정보(" + result.length + ")";
			}else{
				document.querySelector(".tabItem[for=\"customerTabTech\"]").innerText = "기술지원정보(0)";
			}

			if(result.length > 0){
				for(let i = 0; i < result.length; i++){
					disDate = CommonDatas.dateDis(result[i].created, result[i].modified);
					disDate = CommonDatas.dateFnc(disDate); 
	
					str = [
						{
							"setData": disDate,
							"align" : "center",
						},
						{
							"setData": result[i].title,
							"align" : "left",
						},
						{
							"setData": result[i].content,
							"align" : "left",
						},
						{
							"setData": storage.user[result[i].writer].userName,
							"align" : "center",
						},
					];
					
					data.push(str);
				}

			}else{
				str = [
					{
						"setData": undefined,
						"align": "center",
						"col": 4,
					},
				];
				data.push(str);
			}
		}else{
			document.querySelector(".tabItem[for=\"customerTabTech\"]").innerText = "기술지원정보(0)";
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 4,
				},
			];
			data.push(str);
		}
		
		idName = "customerTabTechList";
		setTimeout(() => {
			CommonDatas.createGrid(container, header, data, ids, job, fnc, idName);
		}, 100);
	}).catch((error) => {
		msg.set("기술지원내역을 불러오는 중에 에러가 발생했습니다.\n" + error);
		console.log(error);
		return false;
	});
}