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
	let container, result, job, jsonData, header = [], data = [], ids = [], str, fnc, pageContainer, containerTitle;
	
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

	hideArr = ["detailBackBtn", "crudUpdateBtn", "crudDeleteBtn"];
	showArr = ["gridList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "crudAddBtn", "listSearchInput"];
	containerTitle = $("#containerTitle");
	pageContainer = document.getElementsByClassName("pageContainer");
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
			"align" : "center",
		},
		{
			"title" : "가격",
			"align" : "center",
		},
	];

	if(jsonData === ""){
		str = [
			{
				"setData": undefined,
				"col": 5,
			},
		];
		
		data.push(str);
	}else{
		for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
			let vendor, categoryName, name, desc, price;
			vendor = storage.customer[jsonData[i].vendor].name;
			categoryName = (jsonData[i].categoryName === null || jsonData[i].categoryName === "" || jsonData[i].categoryName === undefined) ? "" : jsonData[i].categoryName;
			name = (jsonData[i].name === null || jsonData[i].name === "" || jsonData[i].name === undefined) ? "" : jsonData[i].name;
			desc = (jsonData[i].desc === null || jsonData[i].desc === "" || jsonData[i].desc === undefined) ? "" : jsonData[i].desc;
			price = (jsonData[i].price === null || jsonData[i].price == 0 || jsonData[i].price === undefined) ? "" : jsonData[i].price;
			str = [
				{
					"setData": vendor,
					"align": "center",
				},
				{
					"setData": categoryName,
					"align": "center",
				},
				{
					"setData": name,
					"align": "center",
				},
				{
					"setData": desc,
					"align": "left",
				},
				{
					"setData": price.toLocaleString("en-US"),
					"align": "right",
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
	createGrid(container, header, data, ids, job, fnc);
	setViewContents(hideArr, showArr);
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
	let html, vendor, categoryName, price, datas, name, desc, dataArray, notIdArray, searchContainer, containerTitle, detailBackBtn, listSearchInput, listRange, detailSecondTabs, pageContainer, crudAddBtn, crudUpdateBtn, crudDeleteBtn;
	detailSetFormList(result);
	gridList = $(".gridList");
	containerTitle = $("#containerTitle");
	detailBackBtn = $(".detailBackBtn");
	detailSecondTabs = $(".detailSecondTabs");
	crudUpdateBtn = $(".crudUpdateBtn");
	crudDeleteBtn = $(".crudDeleteBtn");
	datas = ["vendor"];
	notIdArray = ["vendor"];

	vendor = (result.vendor === null || result.vendor === 0 || result.vendor === undefined) ? "" : storage.customer[result.vendor].name;
	categoryName = (result.categoryName === null || result.categoryName === "" || result.categoryName === undefined) ? "" : result.categoryName;
	name = (result.name === null || result.name === "" || result.name === undefined) ? "" : result.name;
	price = (result.price === null || result.price == 0 || result.price === undefined) ? "" : numberFormat(result.price);
	desc = (result.desc === null || result.desc === "" || result.desc === undefined) ? "" : result.desc;

	dataArray = [
		{
			"title": "공급사(*)",
			"elementId": "vendor",
            "complete": "customer",
			"keyup": "addAutoComplete(this);",
			"onClick": "addAutoComplete(this);",
			"value": vendor,
            "col": 2,
		},
		{
			"title": "제품그룹(*)",
			"elementId": "categoryName",
			"value": categoryName,
            "col": 2,
		},
		{
			"title": "상품명(*)",
			"elementId": "name",
			"value": name,
			"col": 3,
		},
        {
			"title": "상품기본가격(*)",
			"elementId": "price",
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
	detailBackBtn.css("display", "flex");
	gridList.after(html);
	gridList.css("padding-bottom", "20px");
	hideArr = ["gridList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
	showArr = ["defaultFormContainer", "detailSecondTabs"];
	setViewContents(hideArr, showArr);
	crudUpdateBtn.attr("onclick", "enableDisabled(this, \"productUpdate();\", \"" + notIdArray + "\");");
	crudUpdateBtn.css("display", "flex");
	crudDeleteBtn.css("display", "flex");
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
			"elementId": "categoryName",
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
		"category" : 1,
		"categoryName" : "",
		"desc" : "",
		"image" : "0",
		"name" : "",
		"price" : 0,
		"vendor" : 0,
		"writer" : storage.my,
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

	setTimeout(() => {
		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
	}, 300);
}

function productInsert(){
	if($("#vendor").val() === ""){
		msg.set("공급사를 선택해주세요.");
		$("#vendor").focus();
		return false;
	}else if(!validateAutoComplete($("#vendor").val(), "customer")){
		msg.set("조회된 공급사가 없습니다.\n다시 확인해주세요.");
		$("#vendor").focus();
		return false;
	}else if($("#categoryName").val() === ""){
		msg.set("제품그룹을 입력하세요.");
		$("#categoryName").focus();
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
	if($("#vendor").val() === ""){
		msg.set("공급사를 선택해주세요.");
		$("#vendor").focus();
		return false;
	}else if(!validateAutoComplete($("#vendor").val(), "customer")){
		msg.set("조회된 공급사가 없습니다.\n다시 확인해주세요.");
		$("#vendor").focus();
		return false;
	}else if($("#categoryName").val() === ""){
		msg.set("제품그룹을 입력하세요.");
		$("#categoryName").focus();
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
		url = "/api/product/" + storage.formList.no;
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
		url = "/api/product/" + storage.formList.no;
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
	tempArray = searchDataFilter(storage.productList, searchAllInput, "input");

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
		let vendor, categoryName, name, desc;
		vendor = storage.customer[storage.productList[i].vendor].name;
		categoryName = storage.productList[i].categoryName;
		name = storage.productList[i].name;
		storage.searchList.push("#" + vendor + "#" + categoryName + "#" + name);
	}
}

function searchSubmit(){
	let dataArray = [], resultArray, eachIndex = 0, searchVendor, searchCategoryName, searchName;

	searchVendor = $("#searchVendor").val();
	searchCategoryName = $("#searchCategoryName").val();
	searchName = $("#searchName").val();
	
	let searchValues = [searchVendor, searchCategoryName, searchName];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null){
			let tempArray = searchDataFilter(storage.productList, searchValues[i], "multi");
			
			for(let t = 0; t < tempArray.length; t++){
				dataArray.push(tempArray[t]);
			}

			eachIndex++;
		}
	}

	resultArray = searchMultiFilter(eachIndex, dataArray, storage.productList);
	
	storage.searchDatas = resultArray;

	if(storage.searchDatas.length == 0){
		msg.set("찾는 데이터가 없습니다.");
		storage.searchDatas = storage.productList;
	}
	
	drawProductList();
}