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

	url = "/api/accounting/taxbillAll/S";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, salesbillSuccessList, salesbillErrorList);
}

function drawSalesbillList() {
	let container, result, job, jsonData, header = [], data = [], ids = [], str, fnc, pageContainer, containerTitle, detailBackBtn, listSearchInput;
	
	if (storage.salesbillList === undefined) {
		msg.set("등록된 매입계산서가 없습니다");
	}
	else {
		if(storage.searchDatas === undefined){
			jsonData = storage.salesbillList;
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
			let disDate, setDate, buyerCustomer, sn, status, amount, tax, product, standard, remark;
			
			disDate = dateDis(jsonData[i].issueDate);
			setDate = dateFnc(disDate);
			buyerCustomer = (jsonData[i].buyerCustomer === null || jsonData[i].buyerCustomer == 0 || jsonData[i].buyerCustomer === undefined) ? "" : storage.customer[jsonData[i].buyerCustomer].name;
			sn = (jsonData[i].sn === null || jsonData[i].sn === "" || jsonData[i].sn === undefined) ? "" : jsonData[i].sn;
			status = (jsonData[i].status === null || jsonData[i].status === "" || jsonData[i].status === undefined) ? "" : jsonData[i].status;

			if(status === "S1"){
				status = "매출발행";
			}else if(status === "S3") {
				status = "수금처리중";
			}else{
				status = "수금완료";
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
					"setData": buyerCustomer,
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
	
		let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "drawSalesbillList", result[0]);
		pageContainer[0].innerHTML = pageNation;
	}

	containerTitle.html("매입계산서조회");
	$(pageContainer).children().show();
	detailBackBtn.hide();
	listSearchInput.show();
	createGrid(container, header, data, ids, job, fnc);
}

function salesbillSuccessList(result){
	storage.salesbillList = result;

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawSalesbillList, 600);
		window.setTimeout(addSearchList, 600);
		window.setTimeout(searchContainerSet, 600);
	}else{
		window.setTimeout(drawSalesbillList, 200);
		window.setTimeout(addSearchList, 200);
		window.setTimeout(searchContainerSet, 200);
	}
}

function salesbillErrorList(){
	msg.set("에러");
}