$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	getPurchasebillList()
});

function getPurchasebillList() {
	let url, method, data, type;

	url = "/api/accounting/taxbillAll/B";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, purchasebillSuccessList, purchasebillErrorList);
}

function drawPurchasebillList() {
	let container, result, job, jsonData, header = [], data = [], ids = [], str, fnc, pageContainer, containerTitle, detailBackBtn, listSearchInput;
	
	if (storage.purchasebillList === undefined) {
		msg.set("등록된 매입계산서가 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.purchasebillList;
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
			"title" : "발행일",
			"align" : "center",
		},
		{
			"title" : "고객사",
			"align" : "center",
		},
		{
			"title" : "발행번호",
			"align" : "center",
		},
		{
			"title" : "공급가",
			"align" : "right",
		},
		{
			"title" : "세액",
			"align" : "right",
		},
		{
			"title" : "합계금액",
			"align" : "right",
		},
		{
			"title" : "품목",
			"align" : "left",
		},
		{
			"title" : "규격",
			"align" : "left",
		},
		{
			"title" : "비고",
			"align" : "left",
		},
		{
			"title" : "상태",
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
			let disDate, setDate, sellerCustomer, sn, status, amount, tax, product, standard, remark;
			
			disDate = dateDis(jsonData[i].issueDate);
			setDate = dateFnc(disDate);
			sellerCustomer = (jsonData[i].sellerCustomer === null || jsonData[i].sellerCustomer == 0 || jsonData[i].sellerCustomer === undefined) ? "" : storage.customer[jsonData[i].sellerCustomer].name;
			sn = (jsonData[i].sn === null || jsonData[i].sn === "" || jsonData[i].sn === undefined) ? "" : jsonData[i].sn;
			status = (jsonData[i].status === null || jsonData[i].status === "" || jsonData[i].status === undefined) ? "" : jsonData[i].status;

			if(status === "B1"){
				status = "매입발행";
			}else if(status === "B3") {
				status = "지급처리중";
			}else{
				status = "지급완료";
			}

			amount = (jsonData[i].amount === null || jsonData[i].amount == 0 || jsonData[i].amount === undefined) ? "" : jsonData[i].amount;
			tax = (jsonData[i].tax === null || jsonData[i].tax == 0 || jsonData[i].tax === undefined) ? "" : jsonData[i].tax;
			product = (jsonData[i].product === null || jsonData[i].product === "" || jsonData[i].product === undefined) ? "" : jsonData[i].product;
			standard = (jsonData[i].standard === null || jsonData[i].standard === "" || jsonData[i].standard === undefined) ? "" : jsonData[i].standard;
			remark = (jsonData[i].remark === null || jsonData[i].remark === "" || jsonData[i].remark === undefined) ? "" : jsonData[i].remark;

			str = [
				{
					"setData": setDate,
				},
				{
					"setData": sellerCustomer,
				},
				{
					"setData": sn,
				},
				{
					"setData": amount.toLocaleString("en-US"),
				},
				{
					"setData": tax.toLocaleString("en-US"),
				},
				{
					"setData": parseInt(amount + tax).toLocaleString("en-US"),
				},
				{
					"setData": product,
				},
				{
					"setData": standard,
				},
				{
					"setData": remark,
				},
				{
					"setData": status,
				},
			];
	
			fnc = "purchasebillDetailView(this);";
			ids.push(jsonData[i].no);
			data.push(str);
		}
	
		let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawPurchasebillList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	containerTitle.html("매입계산서조회");
	$(pageContainer).children().show();
	detailBackBtn.hide();
	listSearchInput.show();
	createGrid(container, header, data, ids, job, fnc);
}

function purchasebillSuccessList(result){
	storage.purchasebillList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawPurchasebillList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawPurchasebillList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function purchasebillErrorList(){
	msg.set("에러");
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

	for(let i = 0; i < storage.purchasebillList.length; i++){
		let disDate, setDate, sellerCustomer, sn, status, amount, tax, product, standard, remark;
		disDate = dateDis(storage.purchasebillList[i].created, storage.purchasebillList[i].modified);
		setDate = parseInt(dateFnc(disDate).replaceAll("-", ""));
		sellerCustomer = (storage.purchasebillList[i].sellerCustomer === null || storage.purchasebillList[i].sellerCustomer == 0 || storage.purchasebillList[i].sellerCustomer === undefined) ? "" : storage.customer[storage.purchasebillList[i].sellerCustomer].name;
		sn = (storage.purchasebillList[i].sn === null || storage.purchasebillList[i].sn === "" || storage.purchasebillList[i].sn === undefined) ? "" : storage.purchasebillList[i].sn;
		status = (storage.purchasebillList[i].status === null || storage.purchasebillList[i].status === "" || storage.purchasebillList[i].status === undefined) ? "" : storage.purchasebillList[i].status;

		if(status === "B1"){
			status = "매입발행";
		}else if(status === "B3") {
			status = "지급처리중";
		}else{
			status = "지급완료";
		}

		amount = (storage.purchasebillList[i].amount === null || storage.purchasebillList[i].amount == 0 || storage.purchasebillList[i].amount === undefined) ? "" : storage.purchasebillList[i].amount;
		tax = (storage.purchasebillList[i].tax === null || storage.purchasebillList[i].tax == 0 || storage.purchasebillList[i].tax === undefined) ? "" : storage.purchasebillList[i].tax;
		product = (storage.purchasebillList[i].product === null || storage.purchasebillList[i].product === "" || storage.purchasebillList[i].product === undefined) ? "" : storage.purchasebillList[i].product;
		standard = (storage.purchasebillList[i].standard === null || storage.purchasebillList[i].standard === "" || storage.purchasebillList[i].standard === undefined) ? "" : storage.purchasebillList[i].standard;
		remark = (storage.purchasebillList[i].remark === null || storage.purchasebillList[i].remark === "" || storage.purchasebillList[i].remark === undefined) ? "" : storage.purchasebillList[i].remark;

		storage.searchList.push("#issueDate" + setDate + "#" + sellerCustomer + "#" + sn + "#" + status + "#" + (amount + tax) + "#" + product + "#" + standard + "#" + remark + "#");
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