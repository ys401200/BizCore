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
	msg.set("에러");
}

function customerSuccessView(result){
	let html, name, ceoName, taxId, address, email, fax, phone, dataArray, notIdArray;
	storage.customerNo = result.no;
	name = (result.name === null || result.name === "" || result.name === undefined) ? "" : result.name;
	ceoName = (result.ceoName === null || result.ceoName === "" || result.ceoName === undefined) ? "" : result.ceoName;
	taxId = (result.taxId === null || result.taxId === "" || result.taxId === undefined) ? "" : result.taxId;
	address = (result.address === null || result.address === "" || result.address === undefined) ? "" : result.address;
	email = (result.email === null || result.email === "" || result.email === undefined) ? "" : result.email;
	fax = (result.fax === null || result.fax === "" || result.fax === undefined) ? "" : result.fax;
	phone = (result.phone === null || result.phone === "" || result.phone === undefined) ? "" : result.phone;

	dataArray = [
		{
			"title": "고객사명(*)",
			"elementId": "name",
			"disabled": true,
			"value": name,
			"col": 2,
		},
		{
			"title": "사업자번호(*)",
			"elementId": "taxId",
			"disabled": true,
			"value": taxId,
			"col": 2,
		},
		{
			"title": "주소",
			"elementId": "address",
			"disabled": true,
			"value": address,
			"col": 4,
		},
		{
			"title": "대표자명(*)",
			"elementId": "ceoName",
			"disabled": true,
			"value": ceoName,
		},
		{
			"title": "이메일(*)",
			"elementId": "email",
			"disabled": true,
			"value": email,
		},
		{
			"title": "팩스(*)",
			"elementId": "fax",
			"disabled": true,
			"value": fax,
		},
		{
			"title": "연락처",
			"elementId": "phone",
			"disabled": true,
			"keyup": "phoneFormat(this);",
			"value": phone,
		},
	];
	
	html = detailViewForm(dataArray, "modal");

	modal.show();
	modal.content.css("min-width", "70%");
	modal.content.css("max-width", "70%");
	modal.headTitle.text(name);
	modal.body.html(html);
	modal.confirm.text("수정");
	modal.close.text("취소");
	notIdArray = [];
	modal.confirm.attr("onclick", "enableDisabled(this, \"customerUpdate(" + storage.customerNo + ");\", \"" + notIdArray + "\");");
	modal.close.attr("onclick", "modal.hide();");
}

function customerErrorView(){
	msg.set("에러");
}

function customerInsertForm(){
	let html, dataArray;

	dataArray = [
		{
			"title": "고객사명(*)",
			"elementId": "name",
			"disabled": false,
			"col": 2,
		},
		{
			"title": "사업자번호(*)",
			"elementId": "taxId",
			"disabled": false,
			"col": 2,
		},
		{
			"title": "주소",
			"elementId": "address",
			"disabled": false,
			"col": 4,
		},
		{
			"title": "대표자명(*)",
			"elementId": "ceoName",
			"disabled": false,
		},
		{
			"title": "이메일(*)",
			"elementId": "email",
			"disabled": false,
		},
		{
			"title": "팩스(*)",
			"elementId": "fax",
			"disabled": false,
		},
		{
			"title": "연락처",
			"elementId": "phone",
			"keyup": "phoneFormat(this);",
			"disabled": false,
		},
	];

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
	}else if($("#fax").val() === ""){
		msg.set("팩스를 입력해주세요.");
		$("#fax").focus();
		return false;
	}else{
		let name, taxId, address, ceoName, email, fax, phone;
		name = $("#name").val();
		taxId = $("#taxId").val();
		address = $("#address").val();
		ceoName = $("#ceoName").val();
		email = $("#email").val();
		fax = $("#fax").val();
		phone = $("#phone").val();
	
		url = "/api/system/customer";
		method = "post";
		data = {
			"name": name,
			"taxId": taxId,
			"address": address,
			"ceoName": ceoName,
			"email": email,
			"fax": fax,
			"phone": phone,
		}
		type = "insert";
		data = JSON.stringify(data);
		data = cipher.encAes(data);
		crud.defaultAjax(url, method, data, type, customerSuccessInsert, customerErrorInsert);
	}
}

function customerSuccessInsert(){
	msg.set("등록완료");
	location.reload();
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
	}else if($("#fax").val() === ""){
		msg.set("팩스를 입력해주세요.");
		$("#fax").focus();
		return false;
	}else{
		let name, taxId, address, ceoName, email, fax, phone;
		name = $("#name").val();
		taxId = $("#taxId").val();
		address = $("#address").val();
		ceoName = $("#ceoName").val();
		email = $("#email").val();
		fax = $("#fax").val();
		phone = $("#phone").val();

		url = "/api/system/customer/" + storage.customerNo;
		method = "put";
		data = {
			"name": name,
			"taxId": taxId,
			"address": address,
			"ceoName": ceoName,
			"email": email,
			"fax": fax,
			"phone": phone,
		}
		type = "update";

		data = JSON.stringify(data);
		data = cipher.encAes(data);

		crud.defaultAjax(url, method, data, type, customerSuccessUpdate, customerErrorUpdate);
	}
}

function customerSuccessUpdate(){
	msg.set("수정완료");
	location.reload();
}

function customerErrorUpdate(){
	msg.set("수정에러");
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
	msg.set("삭제완료");
	location.reload();
}

function customerErrorDelete(){
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
	
	drawCustomerList();
}