$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getProductList();
});

function getProductList() {
	let url, method, data, type;

	url = "/api/product";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, productSuccessList, productErrorList);
}

function drawProductList() {
	let container, result, job, jsonData, header = [], data = [], ids = [], disDate, setDate, str, fnc, pageContainer, containerTitle, detailBackBtn, listSearchInput;
	
	if (storage.productList === undefined) {
		msg.set("등록된 상품이 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.productList;
		}else{
			jsonData = storage.searchDatas;
		}
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	pageContainer = document.getElementsByClassName("pageContainer");
	listSearchInput = $(".listSearchInput");
	container = $(".gridList");

	header = [
		{
			"title" : "공급사",
			"align" : "center",
		},
		{
			"title" : "제품그룹",
			"align" : "center",
		},
		{
			"title" : "상품명",
			"align" : "center",
		},
		{
			"title" : "상품설명",
			"align" : "left",
		},
	];

	if(jsonData === ""){
		str = [
			{
				"setData": undefined,
				"col": 4,
			},
		];
		
		data.push(str);
	}else{
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			let vendor, category, name, desc;
			vendor = storage.customer[jsonData[i].vendor].name;
			category = (jsonData[i].category === null || jsonData[i].category === "" || jsonData[i].category === undefined) ? "" : jsonData[i].category;
			name = (jsonData[i].name === null || jsonData[i].name === "" || jsonData[i].name === undefined) ? "" : jsonData[i].name;
			desc = (jsonData[i].desc === null || jsonData[i].desc === "" || jsonData[i].desc === undefined) ? "" : jsonData[i].desc;
			console.log(vendor);
			str = [
				{
					"setData": vendor,
				},
				{
					"setData": category,
				},
				{
					"setData": name,
				},
				{
					"setData": desc,
				},
			];
	
			fnc = "productDetailView(this);";
			ids.push(jsonData[i].no);
			data.push(str);
		}
	
		let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawProductList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	containerTitle.html("상품조회");
	$(pageContainer).children().show();
	detailBackBtn.hide();
	listSearchInput.show();
	createGrid(container, header, data, ids, job, fnc);
}

function productSuccessList(result){
	storage.productList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawProductList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawProductList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function productErrorList(){
	msg.set("에러");
}

function productDetailView(e){
	let id, url, method, data, type;

	id = $(e).data("id");
	url = "/api/product/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, productSuccessView, productErrorView);
}

function productSuccessView(result){
	let html, htmlSecond, name, ceoName, taxId, address, detailAddress, zipCode, email, emailForTaxbill, fax, phone, remark1, remark2, dataArray, notIdArray, searchContainer, containerTitle, detailBackBtn, listSearchInput, listRange, detailSecondTabs, pageContainer, crudAddBtn, crudUpdateBtn, crudDeleteBtn;
	detailSetFormList(result);
	gridList = $(".gridList");
	searchContainer = $(".searchContainer");
	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	listSearchInput = $(".listSearchInput");
	detailSecondTabs = $(".detailSecondTabs");
	listRange = $(".listRange");
	crudAddBtn = $(".crudAddBtn");
	crudUpdateBtn = $(".crudUpdateBtn");
	crudDeleteBtn = $(".crudDeleteBtn");
	notIdArray = [];

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
			"title": "공급사(*)",
			"elementId": "name",
            "complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"value": name,
            "col": 2,
		},
		{
			"title": "제품그룹(*)",
			"elementId": "ceoName",
			"value": ceoName,
            "col": 2,
		},
		{
			"title": "상품명(*)",
			"elementId": "taxId",
			"value": taxId,
			"col": 3,
		},
        {
			"title": "상품기본가격(*)",
			"elementId": "taxId",
            "keyup": "inputNumberFormat(this)",
			"value": taxId,
		},
		{
			"title": "상품설명",
			"type": "textarea",
			"elementId": "remark1",
			"value": remark1,
			"col": 4,
		},
	];

	html = detailViewForm(dataArray);
	htmlSecond = "<div class='tabs'>";
	htmlSecond += "<input type='radio' id='customerTabSales' name='tabItem' data-content-id='customerTabSalesList' onclick='tabItemClick(this)' checked>";
	htmlSecond += "<label class='tabItem' for='customerTabSales'></label>";
	htmlSecond += "<input type='radio' id='customerTabContract' name='tabItem' data-content-id='customerTabContractList' onclick='tabItemClick(this)'>";
	htmlSecond += "<label class='tabItem' for='customerTabContract'>계약정보</label>";
	htmlSecond += "<input type='radio' id='customerTabTech' name='tabItem' data-content-id='customerTabTechList' onclick='tabItemClick(this)'>";
	htmlSecond += "<label class='tabItem' for='customerTabTech'>기술지원정보</label>";
	htmlSecond += "</div>";
	detailSecondTabs.append(htmlSecond);
	detailSecondTabs.show();
	containerTitle.html(name);
	gridList.html("");
	detailBackBtn.css("display", "flex");
	searchContainer.hide();
	listSearchInput.hide();
	listRange.hide();
	gridList.html(html);
	crudAddBtn.hide();
	crudUpdateBtn.attr("onclick", "enableDisabled(this, \"productUpdate();\", \"" + notIdArray + "\");");
	crudUpdateBtn.css("display", "flex");
	crudDeleteBtn.css("display", "flex");
	setTabsLayOutMenu();
	customerTabSalesList();
	customerTabTechList();
	gridList.show();

	setTimeout(() => {
		detailCheckedTrueView();
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
		detailTabHide("customerTabSalesList");
	}, 500);
}

function productErrorView(){
	msg.set("에러");
}

function productInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "공급사(*)",
			"elementId": "name",
            "complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
            "disabled": false,
            "col": 2,
		},
		{
			"title": "제품그룹(*)",
			"elementId": "ceoName",
            "disabled": false,
            "col": 2,
		},
		{
			"title": "상품명(*)",
			"elementId": "taxId",
            "disabled": false,
			"col": 3,
		},
        {
			"title": "상품기본가격(*)",
			"elementId": "taxId",
            "disabled": false,
            "keyup": "inputNumberFormat(this)",
		},
		{
			"title": "상품설명",
			"type": "textarea",
			"elementId": "remark1",
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
	modal.headTitle.text("상품등록");
	modal.body.html(html);
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "productInsert();");
	modal.close.attr("onclick", "modal.hide();");
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
}

function productInsert(){
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
		crud.defaultAjax(url, method, data, type, productSuccessInsert, productErrorInsert);
	}
}

function productSuccessInsert(){
	location.reload();
	msg.set("등록완료");
}

function productErrorInsert(){
	msg.set("등록에러");
}

function productUpdate(){
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
		crud.defaultAjax(url, method, data, type, productSuccessUpdate, productErrorUpdate);
	}
}

function productSuccessUpdate(){
	location.reload();
	msg.set("수정완료");
}

function productErrorUpdate(){
	msg.set("수정에러");
}

function productDelete(){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/system/customer/" + storage.formList.no;
		method = "delete";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, productSuccessDelete, productErrorDelete);
	}else{
		return false;
	}
}

function productSuccessDelete(){
	location.reload();
	msg.set("삭제완료");
}

function productErrorDelete(){
	msg.set("삭제에러");
}

function searchInputKeyup(){
	let searchAllInput, tempArray;
	searchAllInput = $("#searchAllInput").val();
	tempArray = searchDataFilter(storage.customerList, searchAllInput, "input");

	if(tempArray.length > 0){
		storage.searchDatas = tempArray;
	}else{
		storage.searchDatas = "";
	}
	
	drawProductList();
}

function addSearchList(){
	storage.searchList = [];

	for(let i = 0; i < storage.productList.length; i++){
		let name, ceoName, taxId;
		name = storage.productList[i].name;
		ceoName = storage.productList[i].ceoName;
		taxId = storage.productList[i].taxId;
		storage.searchList.push("#" + name + "#" + ceoName + "#" + taxId);
	}
}

function searchSubmit(){
	let dataArray = [], resultArray, eachIndex = 0;

	searchName = $("#searchName").val();
	searchCeoName = $("#searchCeoName").val();
	searchTaxId = $("#searchTaxId").val();
	
	let searchValues = [searchName, searchCeoName, searchTaxId];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null){
			let tempArray = searchDataFilter(storage.customerList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.customerList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		msg.set("찾는 데이터가 없습니다.");
		storage.searchDatas = storage.customerList;
	}
	
	drawProductList();
}