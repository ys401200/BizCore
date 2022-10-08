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

	url = "/api/system/customer";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, customerSuccessList, customerErrorList);
}

function drawCustomerList() {
	let container, result, job, jsonData, header = [], data = [], ids = [], pageContainer, str, fnc;
	
	if (storage.customerList === undefined) {
		msg.set("등록된 영업기회가 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.customerList;
		}else{
			jsonData = storage.searchDatas;
		}
	}

	result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);

	pageContainer = document.getElementsByClassName("pageContainer");
	container = $(".gridCustomerList");

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
				"col": 10,
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
				},
				{
					"setData": ceoName,
				},
				{
					"setData": taxId,
				}
			];
	
			fnc = "customerDetailView(this);";
			ids.push(jsonData[i].no);
			data.push(str);
		}
	
		let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawCustomerList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	createGrid(container, header, data, ids, job, fnc);

	let menu = [
		{
			"keyword": "add",
			"onclick": "customerInsertForm();"
		},
		{
			"keyword": "notes",
			"onclick": ""
		},
		{
			"keyword": "set",
			"onclick": ""
		},
	];

	plusMenuSelect(menu);
}

function customerDetailView(e){
	let id, url, method, data, type;

	id = $(e).data("id");
	url = "/api/system/customer/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, customerSuccessView, customerErrorView);
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
	alert("에러");
}

function customerSuccessView(result){
	let html, name, ceoName, taxId, dataArray, notIdArray;
	storage.customerNo = result.no;
	name = (result.name === null || result.name === "" || result.name === undefined) ? "" : result.name;
	ceoName = (result.ceoName === null || result.ceoName === "" || result.ceoName === undefined) ? "" : result.ceoName;
	taxId = (result.taxId === null || result.taxId === "" || result.taxId === undefined) ? "" : result.taxId;

	dataArray = [
		{
			"title": "고객사명",
			"elementId": "name",
			"value": name,
		},
		{
			"title": "대표자명",
			"elementId": "ceoName",
			"value": ceoName,
		},
		{
			"title": "사업자번호",
			"elementId": "taxId",
			"value": taxId,
		},
	];
	
	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text(name);
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("수정");
	modal.close.text("삭제");
	notIdArray = [];
	modal.confirm.attr("onclick", "enableDisabled(this, \"customerUpdate(" + storage.customerNo + ");\", \"" + notIdArray + "\");");
	modal.close.attr("onclick", "customerDelete();");
}

function customerErrorView(){
	alert("에러");
}

function customerInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "고객사명",
			"elementId": "name",
			"disabled": false,
		},
		{
			"title": "대표자명",
			"elementId": "ceoName",
			"disabled": false,
		},
		{
			"title": "사업자번호",
			"elementId": "taxId",
			"disabled": false,
		},
	];

	html = detailViewFormModal(dataArray);

	modal.show();
	modal.headTitle.text("고객사등록");
	modal.content.css("width", "50%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("등록");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "customerInsert();");
	modal.close.attr("onclick", "modal.hide();");
}

function customerInsert(){
	let name, taxId, ceoName;

	name = $("#name").val();
	taxId = $("#taxId").val();
	ceoName = $("#ceoName").val();

	url = "/api/system/customer";
	method = "post";
	data = {
		"name": name,
		"taxId": taxId,
		"ceoName": ceoName,
	}
	type = "insert";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, customerSuccessInsert, customerErrorInsert);
}

function customerSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function customerErrorInsert(){
	alert("등록에러");
}

function customerUpdate(){
	let name, taxId, ceoName;

	name = $("#name").val();
	taxId = $("#taxId").val();
	ceoName = $("#ceoName").val();

	url = "/api/system/customer/" + storage.customerNo;
	method = "put";
	data = {
		"name": name,
		"taxId": taxId,
		"ceoName": ceoName,
	}
	type = "update";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, customerSuccessUpdate, customerErrorUpdate);
}

function customerSuccessUpdate(){
	alert("수정완료");
	location.reload();
}

function customerErrorUpdate(){
	alert("수정에러");
}

function customerDelete(){
	let url, method, data, type;

	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/system/customer/" + storage.customerNo;
		method = "delete";
		type = "delete";
	
		crud.defaultAjax(url, method, data, type, customerSuccessDelete, customerErrorDelete);
	}else{
		return false;
	}
}

function customerSuccessDelete(){
	alert("삭제완료");
	location.reload();
}

function customerErrorDelete(){
	alert("삭제에러");
}

function searchInputKeyup(){
	let searchAllInput;
	searchAllInput = $("#searchAllInput").val();

	storage.searchDatas = searchDataFilter(storage.customerList, searchAllInput, "input");
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
	let dataArray = [], resultArray, eachIndex = 0, searchEmployee, searchCustomer, searchTitle, searchcustomerType, searchContType, searchStatus, searchCreatedFrom;

	searchName = $("#searchName").val();
	searchCeoName = $("#searchCeoName").val();
	searchTaxId = $("#searchTaxId").val();
	
	let searchValues = [searchName, searchCeoName, searchTaxId];

	for(let i = 0; i < searchValues.length; i++){
		if(searchValues[i] !== ""){
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
		alert("찾는 데이터가 없습니다.");
		return false;
	}
	
	drawCustomerList();
}