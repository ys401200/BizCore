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
	let html, vendor, category, datas, name, desc, dataArray, notIdArray, searchContainer, containerTitle, detailBackBtn, listSearchInput, listRange, detailSecondTabs, pageContainer, crudAddBtn, crudUpdateBtn, crudDeleteBtn;
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
	pageContainer = $(".pageContainer");
	datas = ["vendor"];
	notIdArray = ["vendor"];

	vendor = (result.vendor === null || result.vendor === 0 || result.vendor === undefined) ? "" : storage.customer[result.vendor].name;
	category = (result.category === null || result.category === "" || result.category === undefined) ? "" : result.category;
	name = (result.name === null || result.name === "" || result.name === undefined) ? "" : result.name;
	price = (result.price === null || result.price == 0 || result.price === undefined) ? "" : numberFormat(price)
	desc = (result.desc === null || result.desc === "" || result.desc === undefined) ? "" : result.desc;

	dataArray = [
		{
			"title": "공급사(*)",
			"elementId": "name",
            "complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"value": vendor,
            "col": 2,
		},
		{
			"title": "제품그룹(*)",
			"elementId": "ceoName",
			"value": category,
            "col": 2,
		},
		{
			"title": "상품명(*)",
			"elementId": "taxId",
			"value": name,
			"col": 3,
		},
        {
			"title": "상품기본가격(*)",
			"elementId": "taxId",
            "keyup": "inputNumberFormat(this)",
			"value": price,
		},
		{
			"title": "상품설명",
			"type": "textarea",
			"elementId": "desc",
			"value": desc,
			"col": 4,
		},
	];

	html = detailViewForm(dataArray);
	containerTitle.html(name);
	gridList.html("");
	detailBackBtn.css("display", "flex");
	searchContainer.hide();
	listSearchInput.hide();
	listRange.hide();
	gridList.html(html);
	gridList.css("padding-bottom", "20px");
	crudAddBtn.hide();
	crudUpdateBtn.attr("onclick", "enableDisabled(this, \"productUpdate();\", \"" + notIdArray + "\");");
	crudUpdateBtn.css("display", "flex");
	crudDeleteBtn.css("display", "flex");
	pageContainer.hide();
	gridList.show();
	detailTrueDatas(datas);

	setTimeout(() => {
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
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
			"elementId": "vendor",
            "complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
            "disabled": false,
            "col": 2,
		},
		{
			"title": "제품그룹(*)",
			"elementId": "category",
            "disabled": false,
            "col": 2,
		},
		{
			"title": "상품명(*)",
			"elementId": "name",
            "disabled": false,
			"col": 3,
		},
        {
			"title": "상품기본가격(*)",
			"elementId": "price",
            "disabled": false,
            "keyup": "inputNumberFormat(this)",
		},
		{
			"title": "상품설명",
			"type": "textarea",
			"elementId": "desc",
            "disabled": false,
			"col": 4,
		},
	];

	storage.formList = {
		"no": 0,
		"category" : "",
		"categoryName": "",
		"desc" : "",
		"image" : "",
		"name" : "",
		"price" : 0,
		"supplier" : 0,
		"vendor" : 0,
		"writer" : storage.my,
		"created": 0,
		"modified": 0,
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
	if($("#vendor").val() === ""){
		msg.set("공급사를 선택해주세요.");
		$("#vendor").focus();
		return false;
	}else if($("#category").val() === ""){
		msg.set("제품그룹을 입력하세요.");
		$("#category").focus();
		return false;
	}else if($("#name").val() === ""){
		msg.set("상품명을 입력해주세요.");
		$("#name").focus();
		return false;
	}else if($("#price").val() === ""){
		msg.set("가격을 입력해주세요.");
		$("#price").focus();
		return false;
	}else{
		formDataSet();
		url = "/api/product";
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