// 견적 초기 세팅해주는 클래스
class EstimateSet{
	constructor(){
		this.getEstimateBasic();
		this.getEstimateItem();
	}
	
	getEstimateBasic(){
		let url;
		url = apiServer + "/api/estimate/basic";
        axios.get(url).then((response) => {
			if(response.data.result === "ok"){
                let form, info, x;
				x = cipher.decAes(response.data.data);
                x = JSON.parse(x);
                form = x.form;
                info = x.info;
                for(x = 0 ; x < form.length ; x++)	form[x].form = cipher.decAes(form[x].form);
                storage.estimateForm = form;
                storage.estimateBasic = info;
			}else{
                msg.set("[getEstimateBasic] Fail to get estimate form(s).");
            }
		}).catch((error) => {
			msg.set("getEstimateBasic 통신 에러입니다.\n" + error);
		});
	}
	
	getEstimateItem(){
		let url;
		url = apiServer + "/api/estimate/item/";
        axios.get(url).then((response) => {
			if(response.data.result === "ok"){
                let list;
				list = cipher.decAes(response.data.data);
                list = JSON.parse(list);
                storage.item = list;
			}else{
                msg.set("[getEstimateItem] Fail to get item information.");
            }
		}).catch((error) => {
			msg.set("getEstimateItem 통신 에러입니다.\n" + error);
		});
	}
	
    soppEstimateNo(soppNo){
        axios.get("/api/estimate/sopp/" + soppNo).then((response) => {
			if(response.data.result === "ok"){
				let getList = response.data.data;
                getList = cipher.decAes(getList);
                getList = JSON.parse(getList);

				if(getList.length < 1){
					storage.estimateList = "";
					this.drawEstmVerList();
				}else{
					this.soppEstimateList(getList[0].no);
				}
			}
		});
    }

    soppEstimateList(estimateNo){
        axios.get("/api/estimate/" + estimateNo).then((response) => {
			if(response.data.result === "ok"){
				let getList = response.data.data;
				getList = cipher.decAes(getList);
				getList = JSON.parse(getList);
				
				for(let i = 0; i < getList.length; i++){
					getList[i].doc = cipher.decAes(getList[i].doc);
				}
                
				console.log(getList);
				storage.estimateList = getList;
                this.drawEstmVerList();
			}
		});
    }

	list() {
		axios.get("/api/estimate").then((response) => {
			if(response.data.result === "ok"){
				let getList = response.data.data;
				getList = cipher.decAes(getList);
				getList = JSON.parse(getList);
				storage.estimateList = getList;
				this.drawEstmList();
			}
		}).catch((error) => {
			msg.set("메인 리스트 에러입니다.\n" + error);
            console.log(error);
		});
	}

	addForm(){
		this.clickedAdd();
	}

	drawEstmList(){
		let container, result, job, jsonData, header = [], data = [], ids = [], disDate, str, fnc, pageContainer, containerTitle, crudAddBtn, crudUpdateBtn, hideArr, showArr;
		
		if (storage.estimateList === undefined) {
			msg.set("등록된 견적이 없습니다");
		}
		else {
			if(storage.searchDatas === undefined){
				jsonData = storage.estimateList;
			}else{
				jsonData = storage.searchDatas;
			}
		}

		result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		
		crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "estimatePdf", "addPdfForm"];
		showArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "crudAddBtn", "versionPreview", "previewDefault"];
		containerTitle = $("#containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer");
        container = $(".estimateList");

		header = [
			{
				"title" : "견적일자",
				"align" : "center",
			},
			{
				"title" : "견적명",
				"align" : "center",
			},
			{
				"title" : "버전",
				"align" : "center",
			},
			{
				"title" : "양식",
				"align" : "center",
			},
			{
				"title" : "금액",
				"align" : "center",
			},
		];
	
		if(jsonData === ""){
			str = [
				{
					"setData": undefined,
					"col": 5,
					"align": "center",
				},
			];
			
			data.push(str);
		}else{
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				disDate = dateDis(jsonData[i].date);
				disDate = dateFnc(disDate, "yyyy.mm.dd");
		  
				str = [
					{
						"setData": disDate,
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": jsonData[i].version,
						"align": "center",
					},
					{
						"setData": jsonData[i].form,
						"align": "center",
					},
					{
						"setData": numberFormat(jsonData[i].total),
						"align": "right",
					},
				];
		
				fnc = "EstimateSet.clickedEstimate(this);";
				ids.push(jsonData[i].no);
				data.push(str);
			}
		
			let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "EstimateSet.drawEstmList", result[0]);
			pageContainer[0].innerHTML = pageNation;
		}
	
		containerTitle.html("견적");
		createGrid(container, header, data, ids, job, fnc);
		crudAddBtn.innerText = "견적추가";
		crudAddBtn.setAttribute("onclick", "EstimateSet.clickedAdd();");
		crudUpdateBtn.innerText = "견적수정";
		crudUpdateBtn.setAttribute("onclick", "EstimateSet.clickedUpdate();");
		setViewContents(hideArr, showArr);
	}

	drawEstmVerList(){
		let container, result, job, jsonData, header = [], data = [], ids = [], disDate, str, fnc, pageContainer, containerTitle, crudAddBtn, crudUpdateBtn, hideArr, showArr;
		
		if (storage.estimateList === undefined) {
			msg.set("등록된 견적이 없습니다");
		}
		else {
			if(storage.searchDatas === undefined){
				jsonData = storage.estimateList;
			}else{
				jsonData = storage.searchDatas;
			}
		}

		result = paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		
		crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "estimatePdf", "addPdfForm"];
		showArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "crudAddBtn", "versionPreview", "previewDefault"];
		containerTitle = $("#containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer");
        container = $(".estimateList");

		header = [
			{
				"title" : "견적일자",
				"align" : "center",
			},
			{
				"title" : "견적명",
				"align" : "center",
			},
			{
				"title" : "버전",
				"align" : "center",
			},
			{
				"title" : "양식",
				"align" : "center",
			},
			{
				"title" : "금액",
				"align" : "center",
			},
		];
	
		if(jsonData === ""){
			str = [
				{
					"setData": undefined,
					"col": 5,
					"align": "center",
				},
			];
			
			data.push(str);
		}else{
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				let total = 0;
				disDate = dateDis(jsonData[i].date);
				disDate = dateFnc(disDate, "yyyy.mm.dd");
				
				for(let t = 0; t < jsonData[i].related.estimate.items.length; t++){
					let item = jsonData[i].related.estimate.items[t];
					total += item.price + (item.price * 0.1);
				}

				str = [
					{
						"setData": disDate,
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": jsonData[i].version,
						"align": "center",
					},
					{
						"setData": jsonData[i].form,
						"align": "center",
					},
					{
						"setData": numberFormat(total),
						"align": "right",
					},
				];
		
				fnc = "EstimateSet.clickedEstmVer(this);";
				ids.push(i);
				data.push(str);
			}
		
			let pageNation = createPaging(pageContainer[0], result[3], "pageMove", "EstimateSet.drawEstmVerList", result[0]);
			pageContainer[0].innerHTML = pageNation;
		}
	
		containerTitle.html("견적");
		createGrid(container, header, data, ids, job, fnc);
		crudAddBtn.innerText = "견적추가";
		crudAddBtn.setAttribute("onclick", "EstimateSet.clickedAdd();");
		crudUpdateBtn.innerText = "견적수정";
		crudUpdateBtn.setAttribute("onclick", "EstimateSet.clickedUpdate();");
		setViewContents(hideArr, showArr);
	}

	drawBack(){
		let crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let estimatePdf = document.getElementsByClassName("estimatePdf")[0];
		let containerTitle = $("#containerTitle");
		let hideArr = ["detailBackBtn", "addPdfForm", "mainPdf"];
		let showArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "crudAddBtn", "versionPreview"];
		let versionList = document.getElementsByClassName("versionList");
		containerTitle.html("견적");
		crudAddBtn.innerText = "견적추가";
		crudAddBtn.setAttribute("onclick", "EstimateSet.clickedAdd();");
		crudUpdateBtn.innerText = "견적수정";
		crudUpdateBtn.setAttribute("onclick", "EstimateSet.clickedUpdate();");

		for(let i = 0; i < versionList.length; i++){
			let item = versionList[i];
			if(item.style.display !== "none"){
				item.querySelector(".versionListBody[data-click-check=\"true\"]").click();
			}
		}

		if(crudUpdateBtn.style.display !== "none"){
			estimatePdf.style.display = "flex";
		}
		
		setViewContents(hideArr, showArr);
		document.getElementsByClassName("copyMainPdf")[0].remove();
	}
	
	clickedEstimate(el){
		let x, cnt, els, color = "#2147b1", estmNo, versionList, thisEle;
	
		versionList = document.getElementsByClassName("versionList");
	
		if(versionList.length > 0){
			for(let i = 0; i < versionList.length; i++){
				versionList[i].remove();
			}
		}
	
		thisEle = el;
		versionList = document.createElement("div");
		versionList.className = "versionList";
		thisEle.after(versionList);
		cnt = thisEle.parentElement;
		els = cnt.children;
	
		for(x = 1 ; x < els.length ; x++){
			els[x].style.backgroundColor = "";
			els[x].style.color = "";
		}	
	
		thisEle.style.backgroundColor = color;
		thisEle.style.color = "#ffffff";
		estmNo = thisEle.dataset.id;
		this.getEstmVerList(estmNo);
		setTimeout(() => {
			storage.thisEle = thisEle.nextSibling.getElementsByClassName("versionListBody")[0];
			thisEle.nextSibling.getElementsByClassName("versionListBody")[0].click();
		}, 300);
	}
	
	clickedEstmVer(el){
		let x, cnt, els, color = "#e1e9ff", versionList, title, userName;
		els = el.parentElement.children;
		for(x = 1 ; x < els.length ; x++)	els[x].style.backgroundColor = "";
		el.style.backgroundColor = color;
		x = el.dataset.id * 1;
		el.dataset.clickCheck = true;
		storage.detailIdx = x;
		
		if(document.getElementsByClassName("versionList")[0] !== undefined){
			versionList = document.getElementsByClassName("versionList")[0];
			title = versionList.getElementsByClassName("versionListBody")[0].children[1].innerHTML;
			userName = versionList.getElementsByClassName("versionListBody")[0].children[2].innerHTML;
		}else{
			title = el.children[1].children[0].innerText;
			userName = storage.user[R.sopp.owner].userName;
		}

		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let estimatePdf = document.getElementsByClassName("estimatePdf")[0];
		estimatePdf.setAttribute("onclick", "EstimateSet.estimatePdf(\"" + title + "\", \"" + userName + "\");");
		crudUpdateBtn.style.display = "flex";
		estimatePdf.style.display = "flex";

		if(storage.estimateVerList === undefined){
			document.getElementsByClassName("versionPreview")[0].innerHTML = storage.estimateList[x].doc;
		}else{
			document.getElementsByClassName("versionPreview")[0].innerHTML = storage.estimateVerList[x].doc;
		}

		let versionPreview = document.getElementsByClassName("versionPreview")[0];
        let indexMain = versionPreview.children;
		
		for(let i = 0; i < indexMain.length; i++){
			if(indexMain[i].className === "mainPdf"){
				indexMain[i].remove();
			}
		}
		
		indexMain[indexMain.length-1].setAttribute("class", "mainPreviewPdf");
		indexMain[indexMain.length-1].setAttribute("id", "estPrintPdf");
	} 

	getEstmVerList(estmNo){
		axios.get("/api/estimate/" + estmNo).then((response) => {
			if(response.data.result === "ok"){
				let getList = response.data.data;
				getList = cipher.decAes(getList);
				getList = JSON.parse(getList);
				
				for(let i = 0; i < getList.length; i++){
					getList[i].doc = cipher.decAes(getList[i].doc);
				}
	
				storage.estimateVerList = getList;
				this.drawPanelVerList();
			}
			
		}).catch((error) => {
			alert("버전 리스트 에러입니다.\n" + error);
		});
	} 
	
	drawPanelVerList(){
		let versionList, html = "", x;
		versionList = document.getElementsByClassName("versionList")[0];
		html = "<div class=\"versionListHeader\">";
		html += "<div>버전</div>";
		html += "<div>견적명</div>";
		html += "<div>담당자</div>";
		html += "<div>견적일자</div>";
		html += "<div>금액</div>";
		html += "</div>";
		
		for(x = storage.estimateVerList.length-1 ; x >= 0 ; x--){
			let total = 0, dateSet;
	
			for(let i = 0; i < storage.estimateVerList[x].related.estimate.items.length; i++){
				let item = storage.estimateVerList[x].related.estimate.items[i];
				total += (item.price * item.quantity) + (item.price * item.quantity * 0.1);
			}
	
			dateSet = dateDis(storage.estimateVerList[x].date);
			dateSet = dateFnc(dateSet);

			html += "<div class=\"versionListBody\" onclick=\"EstimateSet.clickedEstmVer(this)\" data-id=\"" + x + "\">";
			html += "<div style=\"justify-content: center;\">" + storage.estimateVerList[x].version + "</div>";
			html += "<div style=\"justify-content: left;\">" + storage.estimateVerList[x].title + "</div>";
			html += "<div style=\"justify-content: center;\">" + storage.user[storage.estimateVerList[x].writer].userName + "</div>";
			html += "<div style=\"justify-content: center;\">" + dateSet + "</div>";
			html += "<div style=\"justify-content: right;\">" + numberFormat(total) + "</div>";
			html += "</div>";
		}
	
		versionList.innerHTML = html;
	}
	
	clickedUpdate(){
		let containerTitle, crudAddBtn, crudUpdateBtn, hideArr, showArr, mainPdf, copyMainPdf;
		containerTitle = document.getElementById("containerTitle");
        mainPdf = document.getElementsByClassName("addPdfForm")[0].getElementsByClassName("mainPdf")[0];
		copyMainPdf = document.createElement("div");
		copyMainPdf.className = "copyMainPdf";
		copyMainPdf.innerHTML = mainPdf.innerHTML;
		crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
        mainPdf.after(copyMainPdf);
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		hideArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "versionPreview", "estimatePdf", "mainPdf"];
		showArr = [
			{
				element: "detailBackBtn",
				display: "flex",
			},
			{
				element: "crudAddBtn",
				display: "flex",
			},
			{
				element: "crudUpdateBtn",
				display: "flex",
			},
			{
				element: "addPdfForm",
				display: "block",
			},
		];

		this.copyContainer = document.getElementsByClassName("copyMainPdf")[0];
		crudAddBtn.innerText = "새견적추가";

		if(storage.estimateVerList !== undefined){
			storage.estmDetail = storage.estimateVerList[storage.detailIdx];
		}else{
			storage.estmDetail = storage.estimateList[storage.detailIdx];
		}

		crudAddBtn.setAttribute("onclick", "const InsertClass = new Estimate(); InsertClass.insert();");
		crudUpdateBtn.setAttribute("onclick", "const UpdateClass = new Estimate(storage.estmDetail.related.estimate); UpdateClass.update();");
		setViewContentsCopy(hideArr, showArr);
		this.estimateFormInit();
	}

	clickedAdd(){
		let containerTitle, crudAddBtn, hideArr, showArr, mainPdf, copyMainPdf;
		containerTitle = document.getElementById("containerTitle");
		mainPdf = document.getElementsByClassName("mainPdf");
        console.log(mainPdf);
        if(mainPdf.length > 1){
            mainPdf = document.getElementsByClassName("mainPdf")[1];
        }else{
            mainPdf = document.getElementsByClassName("mainPdf")[0];
        }

		copyMainPdf = document.createElement("div");
		copyMainPdf.className = "copyMainPdf";
		copyMainPdf.innerHTML = mainPdf.innerHTML;
		crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		mainPdf.after(copyMainPdf);
		hideArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "versionPreview", "crudUpdateBtn", "estimatePdf", "mainPdf"];
		showArr = [
			{
				element: "detailBackBtn",
				display: "flex",
			},
			{
				element: "crudAddBtn",
				display: "flex",
			},
			{
				element: "copyMainPdf",
				display: "block",
			},
			{
				element: "addPdfForm",
				display: "block",
			},
		];
	
		this.copyContainer = document.getElementsByClassName("copyMainPdf")[0];
		crudAddBtn.innerText = "새견적추가";
		crudAddBtn.setAttribute("onclick", "const InsertClass = new Estimate(); InsertClass.insert();");
		setViewContentsCopy(hideArr, showArr);
		storage.estmDetail = undefined;
		this.estimateFormInit();
	}
	
	estimateFormInit(){
		let selectAddress, writer, date, pdfMainContentAddBtns;
		selectAddress = this.copyContainer.getElementsByClassName("selectAddress")[0].querySelector("select");
		writer = this.copyContainer.querySelector("#writer");
		date = this.copyContainer.querySelector("#date");
		pdfMainContentAddBtns = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0];
	
		let html = "";
		for(let index in storage.estimateBasic){
			html += "<option value=\"" + index + "\">" + storage.estimateBasic[index].name + "</option>";
		}
	
		selectAddress.innerHTML = html;
		writer.value = storage.user[storage.my].userName;
		date.value = new Date().toISOString().substring(0, 10);
	
		if(storage.estmDetail !== undefined){
			for(let key in storage.estmDetail.related.estimate){
				let keyId = this.copyContainer.querySelector("#" + key);

				if(keyId !== undefined && keyId !== null){
					let value = storage.estmDetail.related.estimate[key];
					if(key === "date"){
						if(storage.estmDetail.related.estimate[key] !== null){
							value = new Date(storage.estmDetail.related.estimate[key]);
							value = dateDis(value);
							value = dateFnc(value);
						}else{
							value = new Date().toISOString().substring(0, 10);
						}
					}else if(key === "customer"){
						keyId.dataset.value = value;
						value = storage.customer[value].name;
						keyId.value = value;
					}else{
						keyId.value = value;
					}
				}
	
			}
	
			if(storage.estmDetail.related.estimate.items.length > 0){
				const Detail = new Estimate(storage.estmDetail.related.estimate);
				Detail.detail();
			}
		}
	
		this.selectAddressInit();
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor(this.copyContainer), 100);
	}

	productNameSet(){
		let pdfMainContentItem, itemProductName;
		pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContentItem");
		itemProductName = this.copyContainer.getElementsByClassName("itemSpec");
	
		for(let i = 1; i <= pdfMainContentItem.length; i++){
			itemProductName[i-1].querySelector("textarea").setAttribute("id", "itemProductName_" + i);
		}
	}

	addItemIndex(){
		let mainDiv;
		let index = 0;
		mainDiv = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll("div");
		
		for(let i = 0; i < mainDiv.length; i++){
			if(mainDiv[i].getAttribute("class") === "pdfMainContentItem"){
				index++;
				mainDiv[i].getElementsByClassName("itemIndex")[0].innerHTML = index;
			}else if(mainDiv[i].getAttribute("class") === "pdfMainContentTitle"){
				index = 0;
			}
		}
	}

	selectAddressInit(index){
		let firmName, representative, address, phone, fax;
		firmName = this.copyContainer.querySelector("#firmName");
		representative = this.copyContainer.querySelector("#representative");
		address = this.copyContainer.getElementsByClassName("address")[1];
		phone = this.copyContainer.querySelector("#phone");
		fax = this.copyContainer.querySelector("#fax");
	
		if(index === undefined){
			firmName.value = storage.estimateBasic[1].firmName;
			representative.value = storage.estimateBasic[1].representative;
			address.value = storage.estimateBasic[1].address;
			phone.value = storage.estimateBasic[1].phone;
			fax.value = storage.estimateBasic[1].fax;
		}else{
			firmName.value = storage.estimateBasic[index].firmName;
			representative.value = storage.estimateBasic[index].representative;
			address.value = storage.estimateBasic[index].address;
			phone.value = storage.estimateBasic[index].phone;
			fax.value = storage.estimateBasic[index].fax;
		}
	}

	addSearchList(){
		storage.searchList = [];
	
		for(let i = 0; i < storage.estmList.length; i++){
			let form, title, version, disDate, setDate;
			disDate = dateDis(storage.estmList[i].date);
			setDate = parseInt(dateFnc(disDate).replaceAll("-", ""));
			title = storage.estmList[i].title;
			version = storage.estmList[i].version;
			form = storage.estmList[i].form;
			total = storage.estmList[i].total;
			storage.searchList.push("#" + title + "#" + version + "#" + form + "#date" + setDate + "#price" + total);
		}
	}
	
	searchSubmit(){
		let dataArray = [], resultArray, eachIndex = 0, searchTitle, searchVersion, searchForm, searchPriceFrom, searchDateFrom;
	
		searchTitle = $("#searchTitle").val();
		searchVersion = $("#searchVersion").val();
		searchForm = $("#searchForm").val();
		searchPriceFrom = ($("#searchPriceFrom").val() === "") ? "" : $("#searchPriceFrom").val().replaceAll(",", "") + "#price" + $("#searchPriceTo").val().replaceAll(",", "");
		searchDateFrom = ($("#searchDateFrom").val() === "") ? "" : $("#searchDateFrom").val().replaceAll("-", "") + "#date" + $("#searchDateTo").val().replaceAll("-", "");
		
		let searchValues = [searchTitle, searchVersion, searchForm, searchPriceFrom, searchDateFrom];
	
		for(let i = 0; i < searchValues.length; i++){
			if(searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null){
				let tempArray = searchDataFilter(storage.estmList, searchValues[i], "multi");
				
				for(let t = 0; t < tempArray.length; t++){
					dataArray.push(tempArray[t]);
				}
	
				eachIndex++;
			}
		}
	
		resultArray = searchMultiFilter(eachIndex, dataArray, storage.estmList);
		
		storage.searchDatas = resultArray;
	
		if(storage.searchDatas.length == 0){
			msg.set("찾는 데이터가 없습니다.");
			storage.searchDatas = storage.estmList;
		}
		
		drawEstmList();
	}
	
	searchInputKeyup(){
		let searchAllInput, tempArray;
		searchAllInput = $("#searchAllInput").val();
		tempArray = searchDataFilter(storage.estmList, searchAllInput, "input");
	
		if(tempArray.length > 0){
			storage.searchDatas = tempArray;
		}else{
			storage.searchDatas = "";
		}
	
		drawEstmList();
	}
	
	addEstTitle(e){
		let thisEle, subTitleIndex, createDiv;
		createDiv = document.createElement("div");
		createDiv.className = "pdfMainContentTitle";
		createDiv.innerHTML = "<div class=\"subTitleIndex\"></div><div class=\"subTitle\"><input type=\"text\" placeholder=\"타이틀입력\"></div><div></div><div></div><div></div><div class=\"subTitleTotal\"></div><div></div><div></div>";
		thisEle = e;
		thisEle.parentElement.before(createDiv);
		subTitleIndex = this.copyContainer.getElementsByClassName("subTitleIndex");
		subTitleIndex[subTitleIndex.length - 1].innerHTML = this.romanize(subTitleIndex.length);
		storage.subItemLength = 0;
	}
	
	addEstItem(e){
		let thisEle, createDiv;
		createDiv = document.createElement("div");
		createDiv.className = "pdfMainContentItem";
		createDiv.innerHTML = "<div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"EstimateSet.itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"EstimateSet.itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"EstimateSet.oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"EstimateSet.oneEstItemRemove(this);\">-</button></div>";
		thisEle = e;
		thisEle.parentElement.before(createDiv);
		this.productNameSet();
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor(this.copyContainer), 100);
		this.addItemIndex();
	}
	
	oneEstItemAdd(e){
		let thisEle, parent, createDiv;
		createDiv = document.createElement("div");
		createDiv.className = "pdfMainContentItem";
		createDiv.innerHTML = "<div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"EstimateSet.itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"EstimateSet.itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"EstimateSet.oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"EstimateSet.oneEstItemRemove(this);\">-</button></div>";
		thisEle = e;
		parent = thisEle.parentElement.parentElement;
		parent.after(createDiv);
		this.productNameSet();
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor(this.copyContainer), 100);
		this.addItemIndex();
	}
	
	removeEstItem(e){
		let thisEle;
		thisEle = e;
	
		if(thisEle.parentElement.previousSibling.getAttribute("class") !== "pdfMainContentHeader"){
			thisEle.parentElement.previousSibling.remove();
		}
	
		this.addItemIndex();
		this.setTotalHtml();
		this.setTitleTotal();
	}
	
	oneEstItemRemove(e){
		let thisEle, parent;
		thisEle = e;
		parent = thisEle.parentElement.parentElement;
		parent.remove();
		this.addItemIndex();
		this.setTotalHtml();
		this.setTitleTotal();
	}
	
	romanize(num) {
		let digits, key, roman, i;
		if (isNaN(num)) return NaN;
		digits = String(+num).split("");
		key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM","","X","XX","XXX","XL","L","LX","LXX","LXXX","XC","","I","II","III","IV","V","VI","VII","VIII","IX"];
		roman = "";
		i = 3;
		while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
		return Array(+digits.join("") + 1).join("M") + roman;
	}
	
	itemCalKeyup(e){
		let thisEle, itemQuantity, itemAmount, itemTotal, cal;
		thisEle = e;
		itemQuantity = thisEle.parentElement.parentElement.getElementsByClassName("itemQuantity")[0].children[0];
		itemAmount = thisEle.parentElement.parentElement.getElementsByClassName("itemAmount")[0].children[0];
		itemTotal = thisEle.parentElement.parentElement.getElementsByClassName("itemTotal")[0];
		
		if(itemQuantity.value === ""){
			itemQuantity.value = 1;
		}
		
		thisEle.value = thisEle.value.replace(/[^0-9]/g,"");
		cal = parseInt(itemAmount.value.replaceAll(",", "")) * parseInt(itemQuantity.value);
		itemTotal.innerHTML = cal.toLocaleString("en-US");
		inputNumberFormat($(e));
		this.setTotalHtml();
		this.setTitleTotal();
	}
	
	selectAddressChange(e){
		let thisEle, thisEleIndex;
		thisEle = e;
		thisEleIndex = thisEle.value;
		this.selectAddressInit(thisEleIndex);
	}
	
	setTotalHtml(){
		let pdfMainContentAmount, pdfMainContentTotal, pdfHeadInfoPrice, pdfMainContentItem, pdfMainContentTax, calAmount = 0;
		pdfMainContentAmount = this.copyContainer.getElementsByClassName("pdfMainContentAmount")[0].querySelectorAll("div")[1];
		pdfMainContentTotal = this.copyContainer.getElementsByClassName("pdfMainContentTotal")[0].querySelectorAll("div")[1];
		pdfHeadInfoPrice = this.copyContainer.getElementsByClassName("pdfHeadInfoPrice")[0].querySelectorAll("div")[0].children[2];
		pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContentItem");
		pdfMainContentTax = this.copyContainer.getElementsByClassName("pdfMainContentTax")[0].querySelectorAll("div")[1];
	
		for(let i = 0; i < pdfMainContentItem.length; i++){
			let item = parseInt(pdfMainContentItem[i].getElementsByClassName("itemTotal")[0].innerHTML.replace(/,/g, ""));
			
			if(isNaN(item)){
				item = 0;
			}
			
			calAmount += item;
		}
	
		pdfMainContentAmount.innerHTML = calAmount.toLocaleString("en-US");
	
		if(this.copyContainer.querySelector("#vatTrue").checked){
			pdfMainContentTax.innerHTML = parseInt(pdfMainContentAmount.innerHTML.replace(/,/g, "") / 10).toLocaleString("en-US");
		}else{
			pdfMainContentTax.innerHTML = 0;
		}
	
		pdfMainContentTotal.innerHTML = (calAmount + parseInt(pdfMainContentTax.innerHTML.replace(/,/g, ""))).toLocaleString("en-US");
		pdfHeadInfoPrice.value = pdfMainContentTotal.innerHTML;
	}
	
	setTitleTotal(){
		let mainDiv;
		let calTotal = 0;
		mainDiv = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll("div");
		
		for(let i = mainDiv.length-1; i >= 0; i--){
			if(mainDiv[i].getAttribute("class") === "pdfMainContentItem"){
				if(mainDiv[i].getElementsByClassName("itemTotal")[0].innerHTML !== ""){
					calTotal += parseInt(mainDiv[i].getElementsByClassName("itemTotal")[0].innerHTML.replace(/,/g, ""));
				}
			}else if(mainDiv[i].getAttribute("class") === "pdfMainContentTitle"){
				mainDiv[i].getElementsByClassName("subTitleTotal")[0].innerHTML = calTotal.toLocaleString("en-Us");
				calTotal = 0;
			}
		}
	}
	
	insertCopyPdf(){
		let mainPdf, pdfMainContentAddBtns;
		pdfMainContentAddBtns = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0];
		this.copyContainer.getElementsByClassName("selectAddress")[0].remove();
		pdfMainContentAddBtns.remove();
	
		if (typeof CKEDITOR !== undefined) {
			if ($(CKEDITOR.instances).length) {
				for (var key in CKEDITOR.instances) {
					CKEDITOR.instances[key].destroy();
				}
			}
		}
		
		let mainInput = this.copyContainer.querySelectorAll("input");
		for(let i = 0; i < mainInput.length; i++){
			let item = mainInput[i];
			let parent = item.parentElement;
	
			if(item.getAttribute("type") === "radio"){
				if(item.getAttribute("name") === "vat"){
					let createDiv = document.createElement("div");
					createDiv.className = "afterDiv";

					if(this.copyContainer.querySelector("[name=\"vat\"]").checked && this.copyContainer.querySelector("[name=\"vat\"]").dataset.value){
						createDiv.innerText = " (VAT 포함)";
						item.after(createDiv);
					}else if(this.copyContainer.querySelector("[name=\"vat\"]").checked && !this.copyContainer.querySelector("[name=\"vat\"]").dataset.value){
						createDiv.innerText = " (VAT 비포함)";
						item.after(createDiv);
					}
					
					for(let i = 0; i < parent.querySelectorAll("input[type=\"radio\"]").length; i++){
						parent.querySelectorAll("input[type=\"radio\"]")[i].remove();
					}
					
					for(let i = 0; i < parent.querySelectorAll("label").length; i++){
						parent.querySelectorAll("label")[i].remove();
					}
				}
			}else{
				let createDiv = document.createElement("div");
				createDiv.className = "afterDiv";

				if(parent.getAttribute("class") === "vatInfo"){
					createDiv.innerText = item.value;
					parent.children[1].after(createDiv);
					item.remove();
				}else{
					createDiv.innerText = item.value;
					parent.append(createDiv);
					item.remove();
				}
			}
		}
		
		let createSpan = document.createElement("span");
		createSpan.style.fontSize = "11px";
		createSpan.style.display = "flex";
		createSpan.style.alignItems = "center";
		createSpan.style.paddingLeft = "3px";
		createSpan.style.paddingRight = "3px";
		createSpan.innerText = "/";
		this.copyContainer.getElementsByClassName("headInfoCustomer")[0].querySelectorAll(".afterDiv")[0].after(createSpan);

		createSpan = document.createElement("span");
		createSpan.style.fontSize = "11px";
		createSpan.style.display = "flex";
		createSpan.style.alignItems = "center";
		createSpan.style.paddingLeft = "3px";
		createSpan.style.paddingRight = "3px";
		createSpan.innerText = "/";
		this.copyContainer.getElementsByClassName("headInfoPhone")[0].querySelectorAll(".afterDiv")[0].after(createSpan);
	
		let pdfMainContainer = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll("div");
		for(let i = 0; i < pdfMainContainer.length; i++){
			let item = pdfMainContainer[i];
			if(item.getAttribute("class") === "pdfMainContentHeader" || item.getAttribute("class") === "pdfMainContentTitle" || item.getAttribute("class") === "pdfMainContentItem"){
				item.querySelectorAll("div")[item.querySelectorAll("div").length - 1].remove();
				item.style.gridTemplateColumns = "10% 10% 30% 10% 10% 10% 10% 10%";
			}
		}
		
		let textarea = this.copyContainer.querySelectorAll("textarea");
		for(let i = 0; i < textarea.length; i++){
			let item = textarea[i];
			let parent = item.parentElement;
			let createDiv = document.createElement("div");
			createDiv.className = "afterDiv";
			createDiv.innerHTML = item.value;
			parent.appendChild(createDiv);
			item.remove();
		}
	}
	
	estimatePdf(title, userName){
		let element = document.getElementById("estPrintPdf");
	 
		html2pdf().from(element).set({
			margin: 0,
			filename: title + "_" + userName + ".pdf",
			html2canvas: { width: 835, height: 1000, scale: 10 },
			jsPDF: {orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: true}
		}).save();
	}
}

// 견적 등록/상세/수정 기능에 관한 클래스(this 처리에 대한 부분 아직 미적용 추후 수정할 예정(insert와 update도 합칠 예정))
class Estimate{
	constructor(getData){
		if(getData !== undefined){
			this.doc = getData.doc;
			this.address = getData.address;
			this.cip = getData.cip;
			this.customer = getData.customer;
			this.date = getData.date;
			this.fax = getData.fax;
			this.firmName = getData.firmName;
			this.form = getData.form;
			this.items = getData.items;
			this.phone = getData.phone;
			this.representative = getData.representative;
			this.title = getData.title;
			this.width = getData.width;
			this.height = getData.height;
			this.no = getData.no;
			this.version = getData.version;
			this.related = getData.related;
			this.remarks = getData.remarks;
		}
		this.copyContainer = document.getElementsByClassName("copyMainPdf")[0];
	}

	detail(){
		let thisBtn, createDiv;
		let items = this.items;
		createDiv = document.createElement("div");
		createDiv.className = "pdfMainContentItem";
	
		for(let i = 0; i < items.length; i++){
			if(this.form === "서브타이틀"){
				let pdfMainContentTitle = this.copyContainer.getElementsByClassName("pdfMainContentTitle");
				
				if(pdfMainContentTitle.length == 0 || pdfMainContentTitle === undefined){
					thisBtn = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0].querySelector("button");
					EstimateSet.addEstTitle(thisBtn);
					let subTitle = this.copyContainer.getElementsByClassName("subTitle");
					subTitle[i].querySelector("input").value = items[i].title;
				}
			}
			
			createDiv.innerHTML = "<div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"EstimateSet.itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"EstimateSet.itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"EstimateSet.oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"EstimateSet.oneEstItemRemove(this);\">-</button></div>";
			thisBtn = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0].querySelectorAll("button")[1];
			thisBtn.parentElement.before(createDiv);
			let pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContentItem")[i];
			pdfMainContentItem.getElementsByClassName("itemDivision")[0].querySelector("input").value = items[i].div;
			pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("textarea").value = items[i].spec;
			pdfMainContentItem.getElementsByClassName("itemQuantity")[0].querySelector("input").value = items[i].quantity;
			pdfMainContentItem.getElementsByClassName("itemAmount")[0].querySelector("input").value = numberFormat(items[i].price);
			pdfMainContentItem.getElementsByClassName("itemRemarks")[0].querySelector("input").value = items[i].remark;
			EstimateSet.itemCalKeyup(pdfMainContentItem.getElementsByClassName("itemAmount")[0].querySelector("input"));
		}

		EstimateSet.productNameSet();
		EstimateSet.addItemIndex();
	}

	insert(){
		if(this.copyContainer.querySelector("#date").value === ""){
			msg.set("견적일자를 입력해주세요.");
			this.copyContainer.querySelector("#date").focus();
			return false;
		}else if(this.copyContainer.querySelector("#title").value === ""){
			msg.set("사업명을 입력해주세요.");
			this.copyContainer.querySelector("#title").focus();
			return false;
		}else if(this.copyContainer.querySelector("#customer").value === ""){
			msg.set("고객사를 입력해주세요.");
			this.copyContainer.querySelector("#customer").focus();
			return false;
		}else if(!validateAutoComplete($("#customer").val(), "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			this.copyContainer.querySelector("#customer").focus();
			return false;
		}else if(this.copyContainer.querySelector("#cip").value === ""){
			msg.set("고객사 담당자를 입력해주세요.");
			this.copyContainer.querySelector("#cip").focus();
			return false;
		}else if(!validateAutoComplete($("#cip").val(), "cip")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			this.copyContainer.querySelector("#cip").focus();
			return false;
		}else if(this.copyContainer.querySelector("#exp").value === ""){
			msg.set("유효기간을 입력해주세요.");
			this.copyContainer.querySelector("#exp").focus();
			return false;
		}else if(this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll(".pdfMainContentItem").length < 1){
			msg.set("항목을 1개 이상 추가하여 입력해주세요.");
			return false;
		}else{
			let address, cip, customer, date, exp, fax, firmName, phone, representative, title, pdfMainContentTitle, pdfMainContentItem, addPdfForm, items, form, datas, remarks;
			pdfMainContentTitle = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll(".pdfMainContentTitle");
			pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].querySelectorAll(".pdfMainContentItem");
			remarks = CKEDITOR.instances.remarks.getData().replaceAll("\n", "");
			address = this.copyContainer.getElementsByClassName("address")[1].value;
			cip = this.copyContainer.querySelector("#cip").value;
			customer = this.copyContainer.querySelector("#customer").dataset.value.toString();
			date = new Date(this.copyContainer.querySelector("#date").value).getTime();
			exp = this.copyContainer.querySelector("#exp").value;
			fax = this.copyContainer.querySelector("#fax").value;
			firmName = this.copyContainer.querySelector("#firmName").value;
			phone = this.copyContainer.querySelector("#phone").value;
			representative = this.copyContainer.querySelector("#representative").value;
			title = this.copyContainer.querySelector("#title").value;
			items = [];
			
			if(pdfMainContentTitle.length > 0){
				form = "서브타이틀";
			}else{
				form = "기본견적서";
			}
		
			for(let i = 0; i < pdfMainContentItem.length; i++){
				let item = pdfMainContentItem[i];
				let textareaId = item.getElementsByClassName("itemSpec")[0].children[0].getAttribute("id");
				let itemTitle = $(item).prevAll(".pdfMainContentTitle").eq(0).find(".subTitle").children().val();
				let price;
		
				if(this.copyContainer.querySelector("[name=\"vat\"]:checked").dataset.value){
					let tax = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "") / 10);
					price = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "")) + parseInt(tax);
				}else{
					price = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", ""));
				}
		
				if(itemTitle === undefined){
					itemTitle = "";
				}
		
				let itemDatas = {
					"div": item.getElementsByClassName("itemDivision")[0].children[0].value,
					"price": parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "")), 
					"quantity": parseInt(item.getElementsByClassName("itemQuantity")[0].children[0].value),
					"remark": item.getElementsByClassName("itemRemarks")[0].children[0].value,
					"spec": CKEDITOR.instances[textareaId].getData().replaceAll("\n", ""),
					"item": "1100041",
					"supplier": this.copyContainer.querySelector("#customer").dataset.value.toString(),
					"title": itemTitle,
					"vat": this.copyContainer.querySelector("[name=\"vat\"]:checked").dataset.value,
				};
				items.push(itemDatas);
			}
		
			EstimateSet.insertCopyPdf();
			
			setTimeout(() => {
				addPdfForm = document.getElementsByClassName("addPdfForm")[0];	
			
				datas = {
					"doc": addPdfForm.innerHTML.replaceAll("\r","").replaceAll("\n",""),
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
					"no": null,
					"version": 1,
					"related": {
						"parent": null,
						"previous": null,
						"next": [null],
						"estimate": {
							"doc": addPdfForm.innerHTML.replaceAll("\r","").replaceAll("\n",""),
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
							"no": null,
							"version": 1,
							"remarks": remarks,
						}
					},
					"remarks": remarks,
				};
			
				datas = JSON.stringify(datas);
				datas = cipher.encAes(datas);
			
				axios.post("/api/estimate", datas, {
					headers: {"Content-Type": "text/plain"}
				}).then(() => {
					location.reload();
					msg.set("등록되었습니다..");
				}).catch((error) => {
					msg.set("등록 에러입니다.\n다시 확인해주십시오.\n" + error);
				});
			}, 300)
		}
	}	

	update(){
		if(this.copyContainer.querySelector("#date").value === ""){
			msg.set("견적일자를 입력해주세요.");
			this.copyContainer.querySelector("#date").focus();
			return false;
		}else if(this.copyContainer.querySelector("#title").value === ""){
			msg.set("사업명을 입력해주세요.");
			this.copyContainer.querySelector("#title").focus();
			return false;
		}else if(this.copyContainer.querySelector("#customer").value === ""){
			msg.set("고객사를 입력해주세요.");
			this.copyContainer.querySelector("#customer").focus();
			return false;
		}else if(!validateAutoComplete($("#customer").val(), "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			$("#customer").focus();
			return false;
		}else if(this.copyContainer.querySelector("#cip").value === ""){
			msg.set("고객사 담당자를 입력해주세요.");
			this.copyContainer.querySelector("#cip").focus();
			return false;
		}else if(!validateAutoComplete($("#cip").val(), "cip")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			this.copyContainer.querySelector("#cip").focus();
			return false;
		}else if(this.copyContainer.querySelector("#exp").value === ""){
			msg.set("유효기간을 입력해주세요.");
			this.copyContainer.querySelector("#exp").focus();
			return false;
		}else if(this.copyContainer.getElementsByClassName("pdfMainContainer")[0].getElementsByClassName("pdfMainContentItem").length < 1){
			msg.set("항목을 1개 이상 추가하여 입력해주세요.");
			return false;
		}else{
			let address, cip, customer, date, exp, fax, firmName, phone, representative, title, pdfMainContentTitle, pdfMainContentItem, addPdfForm, items, form, datas, remarks;
			pdfMainContentTitle = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].getElementsByClassName("pdfMainContentTitle");
			pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContainer")[0].getElementsByClassName("pdfMainContentItem");
			remarks = CKEDITOR.instances.remarks.getData().replaceAll("\n", "");
			address = this.copyContainer.getElementsByClassName("address")[1].value;
			cip = this.copyContainer.querySelector("#cip").value;
			customer = this.copyContainer.querySelector("#customer").dataset.value.toString();
			date = new Date(this.copyContainer.querySelector("#date").value).getTime();
			exp = this.copyContainer.querySelector("#exp").value;
			fax = this.copyContainer.querySelector("#fax").value;
			firmName = this.copyContainer.querySelector("#firmName").value;
			phone = this.copyContainer.querySelector("#phone").value;
			representative = this.copyContainer.querySelector("#representative").value;
			title = this.copyContainer.querySelector("#title").value;
			items = [];
			
			if(pdfMainContentTitle.length > 0){
				form = "서브타이틀";
			}else{
				form = "기본견적서";
			}
		
			for(let i = 0; i < pdfMainContentItem.length; i++){
				let item = pdfMainContentItem[i];
				let textareaId = item.getElementsByClassName("itemSpec")[0].children[0].getAttribute("id");
				let itemTitle = $(item).prevAll(".pdfMainContentTitle").eq(0).find(".subTitle").children().val();
				let price;
		
				if(this.copyContainer.querySelector("[name=\"vat\"]:checked").dataset.value){
					let tax = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "") / 10);
					price = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "")) + parseInt(tax);
				}else{
					price = parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", ""));
				}
		
				if(itemTitle === undefined){
					itemTitle = "";
				}
		
				let itemDatas = {
					"div": item.getElementsByClassName("itemDivision")[0].children[0].value,
					"price": parseInt(item.getElementsByClassName("itemTotal")[0].innerHTML.replaceAll(",", "")), 
					"quantity": parseInt(item.getElementsByClassName("itemQuantity")[0].children[0].value),
					"remark": item.getElementsByClassName("itemRemarks")[0].children[0].value,
					"spec": CKEDITOR.instances[textareaId].getData().replaceAll("\n", ""),
					"item": "1100041",
					"supplier": this.copyContainer.querySelector("#customer").dataset.value.toString(),
					"title": itemTitle,
					"vat": this.copyContainer.querySelector("[name=\"vat\"]:checked").dataset.value,
				};
				items.push(itemDatas);
			}
		
			EstimateSet.insertCopyPdf();
			
			setTimeout(() => {
				addPdfForm = document.getElementsByClassName("addPdfForm")[0];
			
				datas = {
					"doc": addPdfForm.innerHTML.replaceAll("\r","").replaceAll("\n",""),
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
					"no": storage.estmDetail.no,
					"version": 1,
					"related": {
						"parent": null,
						"previous": null,
						"next": [null],
						"estimate": {
							"doc": addPdfForm.innerHTML.replaceAll("\r","").replaceAll("\n",""),
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
							"no": storage.estmDetail.no,
							"version": 1,
							"remarks": remarks,
						}
					},
					"remarks": remarks,
				};
			
				datas = JSON.stringify(datas);
				datas = cipher.encAes(datas);
			
				axios.post("/api/estimate/" + storage.estmDetail.no, datas, {
					headers: {"Content-Type": "text/plain"}
				}).then(() => {
					location.reload();
					msg.set("수정되었습니다.");
				}).catch((error) => {
					msg.set("수정 에러입니다.\n다시 확인해주십시오.\n" + error);
				});
			}, 300)
		}
	}
}