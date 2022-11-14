

$(document).ready(() => {

	// 초기화가 끝난 후 준비단계에서 실행되는 함수
	prepare = function(){
		getEstimateBasic();
	} // End of prepare()
    
    init();
	// For Initializing Code . . . . . . .  . . . . 
});

// 기본 정보를 세팅하는 함수
function selectBasicInfo(n){
	let data = storage.estimateBasic[n];
	storage.estimate.firmName = data.firmName;
	storage.estimate.representative = data.representative;
	storage.estimate.phone = data.phone;
	storage.estimate.fax = data.fax;
	storage.estimate.address = data.address;
	setDataToPreview();
}

function clickedAdd(){
	let listContent, addPdfForm, addBtn, bodyTitle, bodyTitleFnc;
	listContent = $(".listContent");
	addPdfForm = $(".addPdfForm");
	bodyTitle = $(".bodyTitle");
	bodyTitleFnc = $(".bodyTitleFnc div");
	bodyTitle.text("견적추가");
	bodyTitleFnc.eq(0).text("새견적추가");
	bodyTitleFnc.eq(0).attr("onclick", "estimateInsert();");
	bodyTitleFnc.eq(0).show();
	bodyTitleFnc.eq(1).hide();
	bodyTitleFnc.eq(2).show();
	listContent.hide();
	addPdfForm.show();
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
	estimateFormInit();
}

function clickedUpdate(){
	let listContent, addPdfForm, bodyTitle, bodyTitleFnc;
	listContent = $(".listContent");
	addPdfForm = $(".addPdfForm");
	bodyTitle = $(".bodyTitle");
	bodyTitleFnc = $(".bodyTitleFnc div");
	bodyTitle.text("견적수정");
	bodyTitleFnc.eq(0).text("새견적추가");
	bodyTitleFnc.eq(0).attr("onclick", "estimateInsert();");
	bodyTitleFnc.eq(1).text("견적수정");
	bodyTitleFnc.eq(1).attr("onclick", "estimateUpdate();");
	bodyTitleFnc.eq(0).show();
	bodyTitleFnc.eq(1).show();
	bodyTitleFnc.eq(2).show();
	listContent.hide();
	addPdfForm.show();
	storage.estmDetail = storage.estmVerList[storage.detailIdx];
	estimateFormInit();
}

// 서버에서 견적 양식을 가져오는 함수
function getEstimateBasic(){
	let url;
	url = apiServer + "/api/estimate/basic";
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let form, info, x;
			if (data.result === "ok") {
				x = cipher.decAes(data.data);
				x = JSON.parse(x);
				form = x.form;
				info = x.info;
				for(x = 0 ; x < form.length ; x++)	form[x].form = cipher.decAes(form[x].form);
				storage.estimateForm = form;
				storage.estimateBasic = info;
                estimateFormInit();
                 selectAddressInit();
			} else {
				msg.set("[getEstimateForm] Fail to get estimate form(s).");
			}
		}
	});
} // End of getEstimateBasic()

// 서버에서 아이템을 가져오는 함수
function getEstimateItem(){
	let url;
	url = apiServer + "/api/estimate/item/";
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (data) => {
			let list;
			if (data.result === "ok") {
				list = cipher.decAes(data.data);
				list = JSON.parse(list);
				storage.item = list;
			} else {
				msg.set("[getEstimateItem] Fail to get item information.");
			}
		}
	});
} // End of getEstimateItem()

function dateFormat(l){
	let str = "", dt;
	if(l === undefined || l === null || isNaN(l))	return "";
	dt = new Date(l);
	str += (dt.getFullYear() + ".");
	str += ((dt.getMonth()+1) + ".");
	str += (dt.getDate());
	return str;
} // End of dateFormat()

function estimateUpdate(){
	if($("#date").val() === ""){
		msg.set("견적일자를 입력해주세요.");
		$("#date").focus();
		return false;
	}else if($("#title").val() === ""){
		msg.set("사업명을 입력해주세요.");
		$("#title").focus();
		return false;
	}else if($("#customer").val() === ""){
		msg.set("고객사를 입력해주세요.");
		$("#customer").focus();
		return false;
	}else if(!validateAutoComplete($("#customer").val(), "customer")){
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#customer").focus();
		return false;
	}else if($("#cip").val() === ""){
		msg.set("고객사 담당자를 입력해주세요.");
		$("#cip").focus();
		return false;
	}else if(!validateAutoComplete($("#cip").val(), "cip")){
		msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
		$("#cip").focus();
		return false;
	}else if($("#exp").val() === ""){
		msg.set("유효기간을 입력해주세요.");
		$("#exp").focus();
		return false;
	}else if($(".pdfMainContainer").find(".pdfMainContentItem").length < 1){
		msg.set("항목을 1개 이상 추가하여 입력해주세요.");
		return false;
	}else{
		let address, cip, customer, date, exp, fax, firmName, phone, representative, title, pdfMainContentTitle, pdfMainContentItem, addPdfForm, items, form, datas;
		pdfMainContentTitle = $(".pdfMainContainer").find(".pdfMainContentTitle");
		pdfMainContentItem = $(".pdfMainContainer").find(".pdfMainContentItem");
        $(".addBtn").remove();
		remarks = CKEDITOR.instances.remarks.getData().replaceAll("\n", "");
		address = $(".address").val();
		cip = $("#cip").val();
		customer = $("#customer").data("value").toString();
		date = new Date($("#date").val()).getTime();
		exp = $("#exp").val();
		fax = $("#fax").val();
		firmName = $("#firmName").val();
		phone = $("#phone").val();
		representative = $("#representative").val();
		title = $("#title").val();
		items = [];
		
		if(pdfMainContentTitle.length > 0){
			form = "서브타이틀";
		}else{
			form = "기본견적서";
		}
	
		for(let i = 0; i < pdfMainContentItem.length; i++){
			let item = $(pdfMainContentItem[i]);
			let textareaId = item.find(".itemSpec").children().attr("id");
			let itemTitle = item.prevAll(".pdfMainContentTitle").eq(0).find(".subTitle").children().val();
			let price;
	
			if($("[name=\"vat\"]:checked").data("value")){
				let tax = parseInt(item.find(".itemTotal").html().replaceAll(",", "") / 10);
				price = parseInt(item.find(".itemTotal").html().replaceAll(",", "")) + parseInt(tax);
			}else{
				price = parseInt(item.find(".itemTotal").html().replaceAll(",", ""));
			}
	
			if(itemTitle === undefined){
				itemTitle = "";
			}
	
			let itemDatas = {
				"div": item.find(".itemDivision").children().val(),
				"price": parseInt(item.find(".itemTotal").html().replaceAll(",", "")), 
				"quantity": parseInt(item.find(".itemQuantity").children().val()),
				"remark": item.find(".itemRemarks").children().val(),
				"spec": CKEDITOR.instances[textareaId].getData().replaceAll("\n", ""),
				"item": "1100041",
				"supplier": $("#customer").data("value").toString(),
				"title": itemTitle,
				"vat": $("[name=\"vat\"]:checked").data("value"),
			};
			items.push(itemDatas);
		}
	
		insertCopyPdf();
		
		setTimeout(() => {
			addPdfForm = $(".addPdfForm");
            let parent = localStorage.getItem("detailType") + ":" + localStorage.getItem("detailNo");
			datas = {
				"doc": addPdfForm.html().replaceAll("\r","").replaceAll("\n",""),
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
				"no": localStorage.getItem("estimateNo"),
				"version": 1,
				"related": {
					"parent": parent,
					"previous": null,
					"next": [null],
					"estimate": {
						"doc": addPdfForm.html().replaceAll("\r","").replaceAll("\n",""),
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
						"no": localStorage.getItem("estimateNo"),
						"version": 1,
						"remarks": remarks,
					}
				},
				"remarks": remarks,
			};
		
			datas = JSON.stringify(datas);
			datas = cipher.encAes(datas);
		
			$.ajax({
				url: "/api/estimate/" + localStorage.getItem("estimateNo"),
				method: "post",
				data: datas,
				dataType: "json",
				contentType: "text/plain",
				success: (result) => {
                    let url, method;
                    url = "/api/" + localStorage.getItem("detailType") + "/" + localStorage.getItem("detailNo");
                    method = "get";
                    opener.parent.getJsonData(url, method);
                    window.close();
                    
                    setTimeout(() =>{
                        opener.parent.msg.set("등록되었습니다.");
                    }, 300);
				},
				error: () => {
					msg.set("에러입니다.");
				}
			});
		}, 300)
	}
}

function addEstTitle(e){
	let thisEle, subTitleIndex;
	thisEle = $(e);
	thisEle.parent().before("<div class=\"pdfMainContentTitle\"><div class=\"subTitleIndex\"></div><div class=\"subTitle\"><input type=\"text\" placeholder=\"타이틀입력\"></div><div></div><div></div><div></div><div class=\"subTitleTotal\"></div><div></div><div></div></div>");
	
	if($(".mainPdf").length > 1){
		subTitleIndex = $(".mainPdf").eq(1).find(".subTitleIndex");
	}else{
		subTitleIndex = $(".mainPdf").eq(0).find(".subTitleIndex");
	}

	subTitleIndex.eq(subTitleIndex.length - 1).html(romanize(subTitleIndex.length));
	storage.subItemLength = 0;
}

function addEstItem(e){
	let thisEle, findClass;
	thisEle = $(e);
	thisEle.parent().before("<div class=\"pdfMainContentItem\"><div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"oneEstItemRemove(this);\">-</button></div></div>");
	productNameSet();
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
	addItemIndex();
}

function oneEstItemAdd(e){
	let thisEle, parent;
	thisEle = $(e);
	parent = thisEle.parents(".pdfMainContentItem");
	parent.after("<div class=\"pdfMainContentItem\"><div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"oneEstItemRemove(this);\">-</button></div></div>");
	productNameSet();
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
	addItemIndex();
}

function removeEstItem(e){
	let thisEle;
	thisEle = $(e);

	if(thisEle.parent().prev().attr("class") !== "pdfMainContentHeader"){
		thisEle.parent().prev().remove();
	}

	addItemIndex();
	setTotalHtml();
	setTitleTotal();
}

function oneEstItemRemove(e){
	let thisEle, parent;
	thisEle = $(e);
	parent = thisEle.parents(".pdfMainContentItem");
	parent.remove();
	addItemIndex();
	setTotalHtml();
	setTitleTotal();
}

function addItemIndex(){
	let mainDiv, mainPdf;
	let index = 0;
	mainPdf = $(".mainPdf");

	if(mainPdf.length > 1){
		mainDiv = mainPdf.eq(1).find(".pdfMainContainer").children("div");
	}else{
		mainDiv = mainPdf.eq(0).find(".pdfMainContainer").children("div");
	}
	
	for(let i = 0; i < mainDiv.length; i++){
		if($(mainDiv[i]).attr("class") === "pdfMainContentItem"){
			index++;
			$(mainDiv[i]).find(".itemIndex").html(index);
		}else if($(mainDiv[i]).attr("class") === "pdfMainContentAddBtns"){
			return false;
		}else{
			index = 0;
		}
	}
}

function productNameSet(){
	let pdfMainContentItem, itemProductName, mainPdf;
	mainPdf = $(".mainPdf");

	if(mainPdf.length > 1){
		pdfMainContentItem = mainPdf.eq(1).find(".pdfMainContentItem");
		itemProductName = mainPdf.eq(1).find(".itemSpec textarea");
	}else{
		pdfMainContentItem = mainPdf.eq(0).find(".pdfMainContentItem");
		itemProductName = mainPdf.eq(0).find(".itemSpec textarea");
	}

	for(let i = 1; i <= pdfMainContentItem.length; i++){
		$(itemProductName[i-1]).attr("id", "itemProductName_" + i);
	}
}

function romanize(num) {
    let digits, key, roman, i;
    if (isNaN(num)) return NaN;
    digits = String(+num).split("");
    key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM","","X","XX","XXX","XL","L","LX","LXX","LXXX","XC","","I","II","III","IV","V","VI","VII","VIII","IX"];
    roman = "";
    i = 3;
    while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function itemCalKeyup(e){
	let thisEle, itemQuantity, itemAmount, itemTotal, cal;
	thisEle = $(e);
	itemQuantity = thisEle.parent().parent().find(".itemQuantity").children();
	itemAmount = thisEle.parent().parent().find(".itemAmount").children();
	itemTotal = thisEle.parent().nextAll(".itemTotal");
	
	if(itemQuantity.val() === ""){
		itemQuantity.val(1);
	}
	
	thisEle.val(thisEle.val().replace(/[^0-9]/g,""));
	cal = parseInt(itemAmount.val().replaceAll(",", "")) * parseInt(itemQuantity.val());
	itemTotal.html(cal.toLocaleString("en-US"));
	inputNumberFormat(thisEle);
	setTotalHtml();
	setTitleTotal();
}

function estimateFormInit(){
	let selectAddress, writer, date, pdfMainContentAddBtns;
	selectAddress = $(".selectAddress select");
	writer = $("#writer");
	date = $("#date");
	pdfMainContentAddBtns = $(".pdfMainContentAddBtns");

	for(let index in storage.estimateBasic){
		selectAddress.append("<option value=\"" + index + "\">" + storage.estimateBasic[index].name + "</option>")
	}
	
	writer.val(storage.user[storage.my].userName);
	date.val(new Date().toISOString().substring(0, 10));

	if(storage.estmDetail !== undefined){
		for(let key in storage.estmDetail.related.estimate){
			if($("#" + key) !== undefined){
				let value = storage.estmDetail.related.estimate[key];

				if(key === "date"){
					value = new Date(storage.estmDetail.related.estimate[key]);
					value = dateDis(value);
					value = dateFnc(value);
				}else if(key === "customer"){
					$("#" + key).attr("data-value", value);
					value = storage.customer[value].name;
				}
				
				$("#" + key).val(value);
			}

		}

		if(storage.estmDetail.related.estimate.items.length > 0){
			detailItemSet();
		}
	}

	selectAddressInit();
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
}

function detailItemSet(){
	let thisBtn;
	let item = storage.estmDetail.related.estimate;
	let items = storage.estmDetail.related.estimate.items;
	$(".pdfMainContentTitle").remove();
	$(".pdfMainContentItem").remove();

	for(let i = 0; i < items.length; i++){
		if(item.form === "서브타이틀"){
			let pdfMainContentTitle = $(".mainPdf").eq(1).find(".pdfMainContentTitle");
			
			if(pdfMainContentTitle.length == 0 || pdfMainContentTitle === undefined){
				thisBtn = $(".mainPdf").eq(1).find(".pdfMainContentAddBtns button").eq(0);
				addEstTitle(thisBtn);
				let subTitle = $(".mainPdf").eq(1).find(".subTitle");
				subTitle.eq(i).find("input").val(items[i].title);
			}
		}
		
		thisBtn = $(".mainPdf").eq(1).find(".pdfMainContentAddBtns button").eq(1);
		thisBtn.parent().before("<div class=\"pdfMainContentItem\"><div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"oneEstItemRemove(this);\">-</button></div></div>");
		productNameSet();
		addItemIndex();
		let pdfMainContentItem = $(".mainPdf").eq(1).find(".pdfMainContentItem").eq(i);
		pdfMainContentItem.find(".itemDivision input").val(items[i].div);
		pdfMainContentItem.find(".itemSpec").find("textarea").val(items[i].spec);
		pdfMainContentItem.find(".itemQuantity").find("input").val(items[i].quantity);
		pdfMainContentItem.find(".itemAmount").find("input").val(numberFormat(items[i].price));
		pdfMainContentItem.find(".itemRemarks").find("input").val(items[i].remark);
		itemCalKeyup(pdfMainContentItem.find(".itemAmount input"));
	}
	ckeditor.config.readOnly = false;
	window.setTimeout(setEditor, 100);
}

function selectAddressChange(e){
	let thisEle, thisEleIndex;
	thisEle = $(e);
	thisEleIndex = thisEle.val();
	selectAddressInit(thisEleIndex);
}

function selectAddressInit(index){
	let firmName, representative, address, phone, fax;
	firmName = $("#firmName");
	representative = $("#representative");
	address = $(".address");
	phone = $("#phone");
	fax = $("#fax");

	if(index === undefined){
		firmName.val(storage.estimateBasic[1].firmName);
		representative.val(storage.estimateBasic[1].representative);
		address.val(storage.estimateBasic[1].address);
		phone.val(storage.estimateBasic[1].phone);
		fax.val(storage.estimateBasic[1].fax);
	}else{
		firmName.val(storage.estimateBasic[index].firmName);
		representative.val(storage.estimateBasic[index].representative);
		address.val(storage.estimateBasic[index].address);
		phone.val(storage.estimateBasic[index].phone);
		fax.val(storage.estimateBasic[index].fax);
	}
}

function setTotalHtml(){
	let pdfMainContentAmount, pdfMainContentTotal, pdfHeadInfoPrice, pdfMainContentItem, pdfMainContentTax, calAmount = 0;
	if($(".mainPdf").length > 1){
		pdfMainContentAmount = $(".mainPdf").eq(1).find(".pdfMainContentAmount div").eq(1);
		pdfMainContentTotal = $(".mainPdf").eq(1).find(".pdfMainContentTotal div").eq(1);
		pdfHeadInfoPrice = $(".mainPdf").eq(1).find(".pdfHeadInfoPrice div:eq(0) input");
		pdfMainContentItem = $(".mainPdf").eq(1).find(".pdfMainContentItem .itemTotal");
		pdfMainContentTax = $(".mainPdf").eq(1).find(".pdfMainContentTax div").eq(1);
	}else{
		pdfMainContentAmount = $(".pdfMainContentAmount div").eq(1);
		pdfMainContentTotal = $(".pdfMainContentTotal div").eq(1);
		pdfHeadInfoPrice = $(".pdfHeadInfoPrice div:eq(0) input");
		pdfMainContentItem = $(".pdfMainContentItem .itemTotal");
		pdfMainContentTax = $(".pdfMainContentTax div").eq(1);
	}

	for(let i = 0; i < pdfMainContentItem.length; i++){
		let item = parseInt($(pdfMainContentItem[i]).html().replaceAll(",", ""));
		
		if(isNaN(item)){
			item = 0;
		}
		
		calAmount += item;
	}
	
	pdfMainContentAmount.html(calAmount.toLocaleString("en-US"));

	if($("#vatTrue").is(":checked")){
		
		pdfMainContentTax.html(parseInt(pdfMainContentAmount.html().replaceAll(",", "") / 10).toLocaleString("en-US"));
	}else{
		pdfMainContentTax.html(0);
	}

	pdfMainContentTotal.html((calAmount + parseInt(pdfMainContentTax.html().replaceAll(",", ""))).toLocaleString("en-US"));
	pdfHeadInfoPrice.val(pdfMainContentTotal.html());
}

function setTitleTotal(){
	let mainDiv;
	let calTotal = 0;
	mainDiv = $(".pdfMainContainer").children("div");
	
	for(let i = 0; i < mainDiv.length; i++){
		if($(mainDiv[i]).attr("class") === "pdfMainContentItem"){
			if($(mainDiv[i]).find(".itemTotal").html() !== ""){
				calTotal += parseInt($(mainDiv[i]).find(".itemTotal").html().replaceAll(",", ""));
			}

			$(mainDiv[i]).prevAll(".pdfMainContentTitle").eq(0).find(".subTitleTotal").html(calTotal.toLocaleString("en-Us"));
		}else if($(mainDiv[i]).attr("class") === "pdfMainContentAddBtns"){
			return false;
		}else{
			calTotal = 0;
		}
	}
}

function insertCopyPdf(){
	let mainPdf, pdfMainContentAddBtns;

	if($(".mainPdf").length > 1){
		mainPdf = $(".mainPdf").eq(1);
	}else{
		mainPdf = $(".mainPdf").eq(0);
	}
	
	pdfMainContentAddBtns = mainPdf.find(".pdfMainContentAddBtns");
	mainPdf.find(".selectAddress").remove();
	pdfMainContentAddBtns.remove();

	if (typeof CKEDITOR !== undefined) {
		if ($(CKEDITOR.instances).length) {
			for (var key in CKEDITOR.instances) {
				CKEDITOR.instances[key].destroy();
			}
		}
	}
	
	let mainInput = mainPdf.find("input");
	for(let i = 0; i < mainInput.length; i++){
		let item = $(mainInput[i]);
		let parent = item.parent();

		if(item.attr("type") === "radio"){
			if(item.attr("name") === "vat"){
				if($(".mainPdf").find("[name=\"vat\"]:checked").data("value")){
					item.after("<div class=\"afterDiv\">(VAT 포함)</div>");
					parent.children("input[type=\"radio\"]").remove();
				}else{
					item.after("<div class=\"afterDiv\">(VAT 비포함)</div>");
					parent.children("input[type=\"radio\"]").remove();
				}

				parent.children("label").remove();
			}
		}else{
			if(parent.attr("class") === "vatInfo"){
				parent.children().eq(1).after("<div class=\"afterDiv\" style=\"padding-left: 2vw; padding-right: 1vw; font-weight: 600;\">" + item.val() + "</div>");
				item.remove();
			}else{
				parent.append("<div class=\"afterDiv\">" + item.val() + "</div>");
				item.remove();
			}
		}
	}
	
	mainPdf.find(".headInfoCustomer").children(".afterDiv").eq(0).after("<span style=\"font-size: 11px; display: flex; align-items: center; padding-left: 3px; padding-right: 3px;\">/</span>");
	mainPdf.find(".headInfoPhone").children(".afterDiv").eq(0).after("<span style=\"font-size: 11px; display: flex; align-items: center; padding-left: 3px; padding-right: 3px;\">/</span>");

	let pdfMainContainer = mainPdf.find(".pdfMainContainer").children("div");
	for(let i = 0; i < pdfMainContainer.length; i++){
		let item = $(pdfMainContainer[i]);
		if(item.attr("class") === "pdfMainContentHeader" || item.attr("class") === "pdfMainContentTitle" || item.attr("class") === "pdfMainContentItem"){
			item.children("div").last().remove();
			item.css("grid-template-columns", "10% 10% 30% 10% 10% 10% 10% 10%");
		}
	}
	
	let textarea = mainPdf.find("textarea");
	for(let i = 0; i < textarea.length; i++){
		let item = $(textarea[i]);
		let parent = item.parent();
		parent.append("<div class=\"afterDiv\">" + item.val() + "</div>");
		item.remove();
	}
}