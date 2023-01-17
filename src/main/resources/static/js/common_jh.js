//공지사항 셋팅 클래스
class NoticeSet{
	//공지사항 리스트 저장 함수
	list(){
		axios.get("/api/notice").then((response) => {
			if(response.data.result === "ok"){
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				storage.noticeList = result;

				if (storage.customer === undefined || storage.code === undefined || storage.dept === undefined) {
					window.setTimeout(this.drawNoticeList, 600);
					window.setTimeout(this.addSearchList, 600);
				} else {
					window.setTimeout(this.drawNoticeList, 200);
					window.setTimeout(this.addSearchList, 200);
				}
			}
		}).catch((error) => {
			msg.set("공지사항 메인 리스트 에러입니다.\n" + error);
			console.log(error);
		})
	}

	//공지사항 리스트 출력 함수
	drawNoticeList() {
		let container, result, jsonData, job, header = [], data = [], ids = [], disDate, setDate, str, fnc, pageContainer;

		if (storage.noticeList === undefined) {
			msg.set("등록된 공지사항이 없습니다");
		}
		else {
			if (storage.searchDatas === undefined) {
				jsonData = storage.noticeList;
			} else {
				jsonData = storage.searchDatas;
			}
		}
	
		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		pageContainer = document.getElementsByClassName("pageContainer")[0];
		container = document.getElementsByClassName("gridNoticeList")[0];
	
		header = [
			{
				"title": "등록일",
				"align": "center",
			},
			{
				"title": "제목",
				"align": "center",
			},
			{
				"title": "작성자",
				"align": "center",
			},
		];
	
		if (jsonData === "") {
			str = [
				{
					"setData": undefined,
					"align": "center",
					"col": 4,
				},
			];
	
			data.push(str);
		} else {
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				disDate = CommonDatas.dateDis(jsonData[i].created, jsonData[i].modified);
				setDate = CommonDatas.dateFnc(disDate, "mm-dd");
				let userName = storage.user[jsonData[i].writer].userName;
	
				str = [
					{
						"setData": setDate,
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": userName,
						"align": "center",
					},
				]
	
				fnc = "const noticeDetail = new NoticeSet(); noticeDetail.noticeDetailView(this)";
				ids.push(jsonData[i].no);
				data.push(str);
			}
	
			let pageNation = CommonDatas.createPaging(pageContainer, result[3], "pageMove", "drawNoticeList", result[0]);
			pageContainer.innerHTML = pageNation;
		}
	
		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		document.getElementById("multiSearchBtn").setAttribute("onclick", "const SearchSubmit = new NoticeSet(); SearchSubmit.searchSubmit();");
		
		let path = $(location).attr("pathname").split("/");
	
		if (path[3] !== undefined && jsonData !== null) {
			let content = document.querySelector(".gridContent[data-id=\"" + path[3] + "\"]");
			this.noticeDetailView(content);
		}
	}

	//메인 화면에서 클릭한 공지사항 가져오는 함수
	noticeDetailView(e) {
		let thisEle = e;
		storage.gridContent = e;

		axios.get("/api/notice/" + thisEle.dataset.id).then((response) => {
			if(response.data.result === "ok"){
				let result;
				result = cipher.decAes(response.data.data);
				result = JSON.parse(result);
				const Detail = new Notice(result);
				Detail.detail();
			}
		}).catch((error) => {
			msg.set("상세보기 에러 입니다.\n" + error);
			console.log(error);
		});
	}

	//공지사항 등록 폼
	noticeInsertForm(){
		let html, dataArray, datas;

		dataArray = [
			{
				"title": "담당자",
				"elementId": "writer",
				"col": 4,
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"disabled": false,
				"col": 4,
			},
			{
				"title": "내용(*)",
				"elementId": "content",
				"type": "textarea",
				"disabled": false,
				"col": 4,
			},
		];

		datas = ["writer"];
		html = CommonDatas.detailViewForm(dataArray, "modal");
		modal.show();
		modal.content.css("min-width", "70%");
		modal.content.css("max-width", "70%");
		modal.headTitle.text("공지사항등록");
		modal.body.html("<div class='defaultFormContainer'>" + html + "</div>");
		modal.confirm.text("등록");
		modal.close.text("취소");
		modal.confirm.attr("onclick", "const Insert = new Notice(); Insert.insert();");
		modal.close.attr("onclick", "modal.hide();");

		storage.formList = {
			"writer": storage.my,
			"title": "",
			"content": "",
		};

		setTimeout(() => {
			let my = storage.my;
			CommonDatas.detailTrueDatas(datas);
			document.getElementById("writer").value = storage.user[my].userName;
			ckeditor.config.readOnly = false;
			window.setTimeout(setEditor, 100);
		}, 100);
	
		setTimeout(() => {
			document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
		}, 300);
	}

	//공지사항 메인 검색 리스트 저장 함수
	addSearchList() {
		storage.searchList = [];
	
		for (let i = 0; i < storage.noticeList.length; i++) {
			let no, title, writer, disDate, setDate;
			no = storage.noticeList[i].no;
			title = storage.noticeList[i].title;
			writer = (storage.noticeList[i].writer === null || storage.noticeList[i].writer == 0) ? "" : storage.user[storage.noticeList[i].writer].userName;
			disDate = CommonDatas.dateDis(storage.noticeList[i].created, storage.noticeList[i].modified);
			setDate = parseInt(CommonDatas.dateFnc(disDate).replaceAll("-", ""));
			storage.searchList.push("#" + title + "#" + writer + "#created" + setDate);
		}
	}

	//공지사항 검색 버튼 클릭 함수
	searchSubmit() {
		let dataArray = [], resultArray, eachIndex = 0, searchTitle, searchWriter, searchCreatedFrom;
		searchTitle = "#1/" + document.getElementById("searchTitle").value;
		searchWriter = "#2/" + document.getElementById("searchWriter").value;
		searchCreatedFrom = (document.getElementById("searchCreatedFrom").value === "") ? "" : document.getElementById("searchCreatedFrom").value.replaceAll("-", "") + "#created" + document.getElementById("searchCreatedTo").value.replaceAll("-", "");
		let searchValues = [searchTitle, searchWriter, searchCreatedFrom];
		for (let i = 0; i < searchValues.length; i++) {
			if (searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null) {
				let tempArray = CommonDatas.searchDataFilter(storage.noticeList, searchValues[i], "multi");

				for (let t = 0; t < tempArray.length; t++) {
					dataArray.push(tempArray[t]);
				}

				eachIndex++;
			}
		}

		resultArray = CommonDatas.searchMultiFilter(eachIndex, dataArray, storage.noticeList);

		storage.searchDatas = resultArray;

		if (storage.searchDatas.length == 0) {
			msg.set("찾는 데이터가 없습니다.");
			storage.searchDatas = storage.noticeList;
		}

		this.drawNoticeList();
	}

	//공지사항 단일 검색 keyup 이벤트
	searchInputKeyup() {
		let searchAllInput, tempArray;
		searchAllInput = document.getElementById("searchAllInput").value;
		tempArray = CommonDatas.searchDataFilter(storage.noticeList, searchAllInput, "input");
	
		if (tempArray.length > 0) {
			storage.searchDatas = tempArray;
		} else {
			storage.searchDatas = "";
		}
	
		this.drawNoticeList();
	}
}

//공지사항 기능 클래스
class Notice{
	constructor(getData){
		if(getData !== undefined){
			this.getData = getData;
			this.title = getData.title;
			this.content = getData.content;
			this.writer = getData.writer;
			this.created = getData.created;
			this.modified = getData.modified;
		}else{
			this.title = "";
			this.content = "";
			this.writer = storage.my;
		}
	}

	//공지사항 상세보기
	detail(){
		let html = "";
		let btnHtml = "";
		let setDate, datas, dataArray, createDiv, notIdArray;
		
		CommonDatas.detailSetFormList(this.getData);

		setDate = CommonDatas.dateDis(this.created, this.modified);
		setDate = CommonDatas.dateFnc(setDate);
		datas = ["writer"];
		dataArray = [
			{
				"title": "제목(*)",
				"elementId": "title",
				"value": this.title,
				"col": 4,
			},
			{
				"title": "내용(*)",
				"elementId": "content",
				"value": this.content,
				"type": "textarea",
				"col": 4,
			},
		];
		html += CommonDatas.detailViewForm(dataArray, "board");
		CommonDatas.detailBoardContainerHide();
		createDiv = document.createElement("div");
		createDiv.innerHTML = html;
		storage.gridContent.after(createDiv);
		notIdArray = ["writer", "created"];
		CommonDatas.detailTrueDatas(datas);
		
		if(storage.my == storage.formList.writer){
			btnHtml += "<button type=\"button\" class=\"updateBtn\" onclick=\"CommonDatas.enableDisabled(this, 'const Update = new Notice(); Update.update();', '" + notIdArray + "', 'detailBoard');\">수정</button>";
			btnHtml += "<button type=\"button\" onclick=\"const Delete = new Notice(); Delete.delete();\">삭제</button>";
		}

		btnHtml += "<button type='button' onclick='CommonDatas.detailBoardContainerHide();'><i class=\"fa-solid fa-xmark\"></i></button>";
		document.getElementsByClassName("detailBtns")[0].innerHTML = btnHtml;

		setTimeout(() => {
			ckeditor.config.readOnly = true;
			window.setTimeout(setEditor, 100);
		}, 100);
	}

	//공지사항 등록
	insert(){
		if (document.getElementById("title").value === "") {
			msg.set("제목을 입력해주세요.");
			document.getElementById("title").focus();
			return false;
		} else {
			CommonDatas.formDataSet();
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);
			axios.post("/api/notice", data, {
				headers: {"Content-Type": "text/plain"}
			}).then((response) => {
				if(response.data.result === "ok"){
					location.reload();
					msg.set("등록되었습니다.");
				}else{
					msg.set("등록 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("등록 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//공지사항 수정
	update(){
		if (document.getElementById("title").value === "") {
			msg.set("제목을 입력해주세요.");
			document.getElementById("title").focus();
			return false;
		} else {
			CommonDatas.formDataSet();
			let data = storage.formList;
			data = JSON.stringify(data);
			data = cipher.encAes(data);
			axios.put("/api/notice/" + storage.formList.no, data, {
				headers: {"Content-Type": "text/plain"}
			}).then((response) => {
				if(response.data.result === "ok"){
					location.reload();
					msg.set("수정되었습니다.");
				}else{
					msg.set("수정 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("수정 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		}
	}

	//공지사항 삭제
	delete(){
		if (confirm("정말로 삭제하시겠습니까??")) {
			axios.delete("/api/notice/" + storage.formList.no, {
				headers: {"Content-Type": "text/plain"}
			}).then((response) => {
				if(response.data.result === "ok"){
					location.reload();
					msg.set("삭제되었습니다.");
				}else{
					msg.set("삭제 중 에러가 발생하였습니다.");
					return false;
				}
			}).catch((error) => {
				msg.set("삭제 도중 에러가 발생하였습니다.\n" + error);
				console.log(error);
				return false;
			});
		} else {
			return false;
		}
	}
}

// 견적 초기 세팅해주는 클래스
class EstimateSet{
	constructor(){
		this.getEstimateBasic();
		this.getEstimateItem();
	}
	
	//베이직 견적 storage 저장 함수
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
	
	//견적 아이템 저장 함수
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
	
	//영업기회 견적번호 및 현재 영업기회 번호 저장 함수
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

				storage.estimateVerSoppNo = soppNo;
			}
		});
    }

	//영업기회 견적리스트를 가져오는 함수
    soppEstimateList(estimateNo){
        axios.get("/api/estimate/" + estimateNo).then((response) => {
			if(response.data.result === "ok"){
				let getList = response.data.data;
				getList = cipher.decAes(getList);
				getList = JSON.parse(getList);
				
				for(let i = 0; i < getList.length; i++){
					getList[i].doc = cipher.decAes(getList[i].doc);
				}
                
				storage.estimateList = getList;
                this.drawEstmVerList();
			}
		});
    }

	//메인 리스트 데이터 가져오는 함수
	list() {
		axios.get("/api/estimate").then((response) => {
			if(response.data.result === "ok"){
				let getList = response.data.data;
				getList = cipher.decAes(getList);
				getList = JSON.parse(getList);
				storage.estimateList = getList;
				this.drawEstmList();
				this.addSearchList();
			}
		}).catch((error) => {
			msg.set("메인 리스트 에러입니다.\n" + error);
            console.log(error);
		});
	}
	
	//견적 추가에 대한 폼
	addForm(){
		this.clickedAdd();
	}

	//메인 리스트 출력 함수
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

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		
		crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "estimatePdf", "addPdfForm"];
		showArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "crudAddBtn", "versionPreview", "previewDefault"];
		containerTitle = document.getElementById("containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer");
        container = document.getElementsByClassName("estimateList")[0];

		header = [
			{
				"title" : "버전",
				"align" : "center",
			},
			{
				"title" : "견적명",
				"align" : "center",
			},
			{
				"title" : "견적일자",
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
					"col": 4,
					"align": "center",
				},
			];
			
			data.push(str);
		}else{
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				disDate = CommonDatas.dateDis(jsonData[i].date);
				disDate = CommonDatas.dateFnc(disDate, "yyyy.mm.dd");
		  
				str = [
					{
						"setData": jsonData[i].version,
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": disDate,
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
		
			let pageNation = CommonDatas.createPaging(pageContainer[0], result[3], "pageMove", "EstimateSet.drawEstmList", result[0]);
			pageContainer[0].innerHTML = pageNation;
		}
	
		containerTitle.innerHTML = "견적";
		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		document.getElementById("multiSearchBtn").setAttribute("onclick", "EstimateSet.searchSubmit();");
		crudAddBtn.innerText = "견적추가";
		crudAddBtn.setAttribute("onclick", "EstimateSet.clickedAdd();");
		crudUpdateBtn.innerText = "견적수정";
		crudUpdateBtn.setAttribute("onclick", "EstimateSet.clickedUpdate();");
		CommonDatas.setViewContents(hideArr, showArr);
	}

	//영업기회 버전리스트만 출력하기 위한 리스트 함수
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

		result = CommonDatas.paging(jsonData.length, storage.currentPage, storage.articlePerPage);
		
		crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		hideArr = ["detailBackBtn", "crudUpdateBtn", "estimatePdf", "addPdfForm"];
		showArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "versionPreview", "previewDefault"];
		containerTitle = document.getElementById("containerTitle");
		pageContainer = document.getElementsByClassName("pageContainer");
        container = document.getElementsByClassName("estimateList")[0];

		header = [
			{
				"title" : "버전",
				"align" : "center",
			},
			{
				"title" : "견적명",
				"align" : "center",
			},
			{
				"title" : "견적일자",
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
					"col": 4,
					"align": "center",
				},
			];
			
			data.push(str);
			crudAddBtn.style.display = "flex";
			crudAddBtn.setAttribute("onclick", "EstimateSet.clickedAdd();");
		}else{
			for (let i = (result[0] - 1) * result[1]; i < result[2]; i++) {
				let total = 0;
				disDate = CommonDatas.dateDis(jsonData[i].date);
				disDate = CommonDatas.dateFnc(disDate, "yyyy.mm.dd");
				
				for(let t = 0; t < jsonData[i].related.estimate.items.length; t++){
					let item = jsonData[i].related.estimate.items[t];
					total += item.price + (item.price * 0.1);
				}

				str = [
					{
						"setData": jsonData[i].version,
						"align": "center",
					},
					{
						"setData": jsonData[i].title,
						"align": "left",
					},
					{
						"setData": disDate,
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
		
			let pageNation = CommonDatas.createPaging(pageContainer[0], result[3], "pageMove", "EstimateSet.drawEstmVerList", result[0]);
			pageContainer[0].innerHTML = pageNation;
			crudAddBtn.remove();
		}
	
		containerTitle.innerHTML = "견적";
		CommonDatas.createGrid(container, header, data, ids, job, fnc);
		crudUpdateBtn.innerText = "견적수정";
		crudUpdateBtn.setAttribute("onclick", "EstimateSet.clickedUpdate();");
		CommonDatas.setViewContents(hideArr, showArr);
	}

	//상세보기에서 Back 실행 함수
	drawBack(){
		let crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
		let crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		let estimatePdf = document.getElementsByClassName("estimatePdf")[0];
		let containerTitle = document.getElementById("containerTitle");
		let hideArr = ["detailBackBtn", "addPdfForm", "mainPdf"];
		let showArr = ["estimateList", "pageContainer", "searchContainer", "listRange", "listSearchInput", "crudAddBtn", "versionPreview"];
		let versionList = document.getElementsByClassName("versionList");
		containerTitle.innerHTML = "견적";

		if(crudAddBtn !== undefined){
			crudAddBtn.innerText = "견적추가";
			crudAddBtn.setAttribute("onclick", "EstimateSet.clickedAdd();");
		}

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
		
		CommonDatas.setViewContents(hideArr, showArr);
		document.getElementsByClassName("copyMainPdf")[0].remove();
	}
	
	//메인 리스트 클릭 함수
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
	
	//메인 버전 리스트 클릭 함수
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

	//메인 버전리스트 저장 함수
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
	
	//메인 버전리스트 셋팅 함수
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
	
	//견적 상세보기 셋팅 함수
	clickedUpdate(){
		let containerTitle, crudUpdateBtn, hideArr, showArr, mainPdf, copyMainPdf;
		containerTitle = document.getElementById("containerTitle");
        mainPdf = document.getElementsByClassName("addPdfForm")[0].getElementsByClassName("mainPdf")[0];
		copyMainPdf = document.createElement("div");
		copyMainPdf.className = "copyMainPdf";
		copyMainPdf.innerHTML = mainPdf.innerHTML;
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
		
		if(storage.estimateVerList !== undefined){
			storage.estmDetail = storage.estimateVerList[storage.detailIdx];
			let crudAddBtn = document.getElementsByClassName("crudAddBtn")[0];
			crudAddBtn.innerText = "새견적추가";
			crudAddBtn.setAttribute("onclick", "const InsertClass = new Estimate(); InsertClass.insert();");
		}else{
			storage.estmDetail = storage.estimateList[storage.detailIdx];
		}

		crudUpdateBtn.setAttribute("onclick", "const UpdateClass = new Estimate(storage.estmDetail.related.estimate); UpdateClass.update();");
		setViewContentsCopy(hideArr, showArr);
		this.estimateFormInit();
	}

	//견적 추가 셋팅 함수
	clickedAdd(){
		let containerTitle, crudAddBtn, hideArr, showArr, mainPdf, copyMainPdf;
		containerTitle = document.getElementById("containerTitle");
		mainPdf = document.getElementsByClassName("mainPdf");

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
	
	//견적 추가 및 상세보기 시 폼안에 value 값들을 설정해주는 함수
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

	//견적 아이템 항목에 대한 textarea id 값 부여 함수
	productNameSet(){
		let pdfMainContentItem, itemProductName;
		pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContentItem");
		itemProductName = this.copyContainer.getElementsByClassName("itemSpec");
	
		for(let i = 1; i <= pdfMainContentItem.length; i++){
			itemProductName[i-1].querySelector("textarea").setAttribute("id", "itemProductName_" + i);
		}
	}

	//아이템의 순서를 셋팅해주는 함수
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

	//회사 주소들을 셋팅해주는 함수
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

	//견적 메인 검색 리스트 저장 함수
	addSearchList(){
		storage.searchList = [];
	
		for(let i = 0; i < storage.estimateList.length; i++){
			let total, title, version, disDate, setDate;
			disDate = CommonDatas.dateDis(storage.estimateList[i].date);
			setDate = parseInt(CommonDatas.dateFnc(disDate).replaceAll("-", ""));
			title = storage.estimateList[i].title;
			version = storage.estimateList[i].version;
			total = storage.estimateList[i].total;
			storage.searchList.push("#" + title + "#" + version + "#date" + setDate + "#price" + total);
		}
	}
	
	//견적 메인 검색 버튼 실행 함수
	searchSubmit(){
		let dataArray = [], resultArray, eachIndex = 0, searchTitle, searchVersion, searchPriceFrom, searchDateFrom;
	
		searchTitle = "#1/" + document.getElementById("searchTitle").value;
		searchVersion = "#2/" + document.getElementById("searchVersion").value;
		searchPriceFrom = (document.getElementById("searchPriceFrom").value === "") ? "" : document.getElementById("searchPriceFrom").value.replaceAll(",", "") + "#price" + document.getElementById("searchPriceTo").value.replaceAll(",", "");
		searchDateFrom = (document.getElementById("searchDateFrom").value === "") ? "" : document.getElementById("searchDateFrom").value.replaceAll("-", "") + "#date" + document.getElementById("searchDateTo").value.replaceAll("-", "");
		
		let searchValues = [searchTitle, searchVersion, searchPriceFrom, searchDateFrom];
	
		for(let i = 0; i < searchValues.length; i++){
			if(searchValues[i] !== "" && searchValues[i] !== undefined && searchValues[i] !== null){
				let tempArray = CommonDatas.searchDataFilter(storage.estimateList, searchValues[i], "multi");
				
				for(let t = 0; t < tempArray.length; t++){
					dataArray.push(tempArray[t]);
				}
	
				eachIndex++;
			}
		}
	
		resultArray = CommonDatas.searchMultiFilter(eachIndex, dataArray, storage.estimateList);
		
		storage.searchDatas = resultArray;
	
		if(storage.searchDatas.length == 0){
			msg.set("찾는 데이터가 없습니다.");
			storage.searchDatas = storage.estimateList;
		}
		
		this.drawEstmList();
	}
	
	//견적 메인 input 검색 keyup 함수
	searchInputKeyup(){
		let searchAllInput, tempArray;
		searchAllInput = document.getElementById("searchAllInput").value;
		tempArray = CommonDatas.searchDataFilter(storage.estimateList, searchAllInput, "input");
	
		if(tempArray.length > 0){
			storage.searchDatas = tempArray;
		}else{
			storage.searchDatas = "";
		}
	
		this.drawEstmList();
	}
	
	//견적 타이틀 추가 함수
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
	
	//견적 아이템 추가 함수
	addEstItem(e){
		let thisEle, createDiv;
		createDiv = document.createElement("div");
		createDiv.className = "pdfMainContentItem";
		createDiv.innerHTML = "<div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><input type=\"text\" data-complete=\"product\" data-value=\"0\" onclick=\"addAutoComplete(this);\" onkeyup=\"addAutoComplete(this);\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"EstimateSet.itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"EstimateSet.itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"EstimateSet.oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"EstimateSet.oneEstItemRemove(this);\">-</button></div>";
		thisEle = e;
		thisEle.parentElement.before(createDiv);
		this.productNameSet();
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor(this.copyContainer), 100);
		this.addItemIndex();
	}
	
	//견적 아이템 + 버튼 함수
	oneEstItemAdd(e){
		let thisEle, parent, createDiv;
		createDiv = document.createElement("div");
		createDiv.className = "pdfMainContentItem";
		createDiv.innerHTML = "<div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><input type=\"text\" data-complete=\"product\" data-value=\"0\" onclick=\"addAutoComplete(this);\" onkeyup=\"addAutoComplete(this);\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"EstimateSet.itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"EstimateSet.itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"EstimateSet.oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"EstimateSet.oneEstItemRemove(this);\">-</button></div>";
		thisEle = e;
		parent = thisEle.parentElement.parentElement;
		parent.after(createDiv);
		this.productNameSet();
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor(this.copyContainer), 100);
		this.addItemIndex();
	}
	
	//견적 아이템 제거 함수
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
	
	//견적 아이템 - 버튼 함수
	oneEstItemRemove(e){
		let thisEle, parent;
		thisEle = e;
		parent = thisEle.parentElement.parentElement;
		parent.remove();
		this.addItemIndex();
		this.setTotalHtml();
		this.setTitleTotal();
	}
	
	//견적 타이틀 번호 로마 숫자로 변환할때 쓰는 함수
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
	
	//견적 현재 아이템 총합 계산 함수
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
	
	//주소 변경 함수
	selectAddressChange(e){
		let thisEle, thisEleIndex;
		thisEle = e;
		thisEleIndex = thisEle.value;
		this.selectAddressInit(thisEleIndex);
	}
	
	//견적 아이템 공급가액, 부가세액, 총합을 계산하는 함수
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
	
	//견적 타이틀 총합 계산 출력해주는 함수
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
	
	//견적 추가/수정 시 모든 input 및 textarea 등을 제거하고 텍스트만 그대로 div로 이동시키는 함수
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
	
	//견적 pdf 다운로드 클릭 시 실행되는 함수
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

	//견적 상세보기 아이템 셋팅 함수
	detail(){
		let thisBtn;
		let items = this.items;
		
		for(let i = 0; i < items.length; i++){
			let createDiv = document.createElement("div");
			createDiv.className = "pdfMainContentItem";

			if(this.form === "서브타이틀"){
				let pdfMainContentTitle = this.copyContainer.getElementsByClassName("pdfMainContentTitle");
				
				if(pdfMainContentTitle.length == 0 || pdfMainContentTitle === undefined){
					thisBtn = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0].querySelector("button");
					EstimateSet.addEstTitle(thisBtn);
					let subTitle = this.copyContainer.getElementsByClassName("subTitle");
					subTitle[i].querySelector("input").value = items[i].title;
				}
			}
			
			createDiv.innerHTML = "<div class=\"itemIndex\"></div><div class=\"itemDivision\"><input type=\"text\" placeholder=\"SW\"></div><div class=\"itemSpec\"><input type=\"text\" data-complete=\"product\" data-value=\"0\" onclick=\"addAutoComplete(this);\" onkeyup=\"addAutoComplete(this);\"><textarea placeholder=\"품명\"></textarea></div><div class=\"itemQuantity\"><input type=\"text\" value=\"1\" onkeyup=\"EstimateSet.itemCalKeyup(this);\"></div><div class=\"itemConsumer\"></div><div class=\"itemAmount\"><input type=\"text\" onkeyup=\"EstimateSet.itemCalKeyup(this);\" placeholder=\"1,000,000\"></div><div class=\"itemTotal\"></div><div class=\"itemRemarks\"><input type=\"text\" placeholder=\"비고\"></div><div class=\"itemBtns\"><button type=\"button\" onclick=\"EstimateSet.oneEstItemAdd(this);\">+</button><button type=\"button\" onclick=\"EstimateSet.oneEstItemRemove(this);\">-</button></div>";
			thisBtn = this.copyContainer.getElementsByClassName("pdfMainContentAddBtns")[0].querySelectorAll("button")[1];
			thisBtn.parentElement.before(createDiv);
			let pdfMainContentItem = this.copyContainer.getElementsByClassName("pdfMainContentItem")[i];
			pdfMainContentItem.getElementsByClassName("itemDivision")[0].querySelector("input").value = items[i].div;
			pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("input").value = items[i].item;
			pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("input").dataset.value = 0;
			
			for(let t = 0; t < storage.product.length; t++){
				if(storage.product[t].no.toString() === items[i].item){
					pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("input").value = storage.product[t].name;
					pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("input").dataset.value = storage.product[t].no;
				}
			}
			
			pdfMainContentItem.getElementsByClassName("itemSpec")[0].querySelector("textarea").value = items[i].spec;
			pdfMainContentItem.getElementsByClassName("itemQuantity")[0].querySelector("input").value = items[i].quantity;
			pdfMainContentItem.getElementsByClassName("itemAmount")[0].querySelector("input").value = numberFormat(items[i].price);
			pdfMainContentItem.getElementsByClassName("itemRemarks")[0].querySelector("input").value = items[i].remark;
			EstimateSet.itemCalKeyup(pdfMainContentItem.getElementsByClassName("itemAmount")[0].querySelector("input"));
		}

		EstimateSet.productNameSet();
		EstimateSet.addItemIndex();
	}

	//새 견적 추가 실행 함수
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
			msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
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
			let address, cip, customer, date, exp, fax, firmName, phone, representative, title, pdfMainContentTitle, pdfMainContentItem, addPdfForm, items, form, datas, remarks, soppNo;
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
			soppNo = (storage.estimateVerSoppNo === undefined) ? null : storage.estimateVerSoppNo;
			items = [];
			
			if(pdfMainContentTitle.length > 0){
				form = "서브타이틀";
			}else{
				form = "기본견적서";
			}
		
			for(let i = 0; i < pdfMainContentItem.length; i++){
				let item = pdfMainContentItem[i];
				let textareaId = item.getElementsByClassName("itemSpec")[0].querySelector("textarea").getAttribute("id");
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
					"item": (item.getElementsByClassName("itemSpec")[0].children[0].dataset.value === undefined || item.getElementsByClassName("itemSpec")[0].children[0].dataset.value.toString() === "0") ? item.getElementsByClassName("itemSpec")[0].children[0].value.toString() : item.getElementsByClassName("itemSpec")[0].children[0].dataset.value.toString(),
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
						"parent": "sopp:" + soppNo + "",
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
					msg.set("등록되었습니다.");
				}).catch((error) => {
					msg.set("등록 에러입니다.\n다시 확인해주십시오.\n" + error);
				});
			}, 300)
		}
	}	

	//견적 수정 실행 함수
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
			let address, cip, customer, date, exp, fax, firmName, phone, representative, title, pdfMainContentTitle, pdfMainContentItem, addPdfForm, items, form, datas, remarks, soppNo;
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
			soppNo = (storage.estimateVerSoppNo === undefined) ? null : storage.estimateVerSoppNo;
			items = [];
			
			if(pdfMainContentTitle.length > 0){
				form = "서브타이틀";
			}else{
				form = "기본견적서";
			}
		
			for(let i = 0; i < pdfMainContentItem.length; i++){
				let item = pdfMainContentItem[i];
				let textareaId = item.getElementsByClassName("itemSpec")[0].querySelector("textarea").getAttribute("id");
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
					"item": (item.getElementsByClassName("itemSpec")[0].children[0].dataset.value === undefined || item.getElementsByClassName("itemSpec")[0].children[0].dataset.value.toString() === "0") ? item.getElementsByClassName("itemSpec")[0].children[0].value.toString() : item.getElementsByClassName("itemSpec")[0].children[0].dataset.value.toString(),
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
						"parent": "sopp:" + soppNo + "",
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

class Common{
	//페이지 로드될 때 top menu active 함수
	setTopPathActive(){
		let path = location.pathname.split("/");
		let container;

		if(path[1] === "" || path[1] === "business"){
			container = document.getElementsByClassName("mainTopMenu")[0].querySelector("div[data-path=\"/\"]");
		}else if(path[1] === "gw"){
			container = document.getElementsByClassName("mainTopMenu")[0].querySelector("div[data-path=\"/gw/home\"]");
		}else{
			container = document.getElementsByClassName("mainTopMenu")[0].querySelector("div[data-path=\"/accounting/home\"]");
		}

		container.classList.add("active");
	}

	//페이지 로드될 때 side menu active 함수
	setSidePathActive(){
		let path = location.pathname.split("/");
		let menuItem = document.getElementsByClassName("menuItem");
		let container
		
		if(path[1] === "" || path[1] === "business"){
			container = document.getElementsByClassName("sideMenu")[0].querySelector("div[data-path=\"/\"]");
		}else if(path[1] === "gw"){
			container = document.getElementsByClassName("sideMenu")[0].querySelector("div[data-path=\"/gw/home\"]");
		}else{
			container = document.getElementsByClassName("sideMenu")[0].querySelector("div[data-path=\"/accounting/home\"]");
		}

		for(let i = 0; i < menuItem.length; i++){
			let item = menuItem[i];
			
			if(path[1] !== ""){
				let label = item.querySelector("label");

				if(label === null){
					let itemA = item.querySelector("a");

					if(itemA.getAttribute("href").indexOf("/" + path[1] + "/" + path[2]) > -1){
						itemA.classList.add("active");
					}else{
						if(path[2] === "sopp2"){
							if(itemA.getAttribute("href") === "/" + path[1] + "/project"){
								itemA.classList.add("active");
							}
						}
					}
				}else{
					let aTarget = item.nextElementSibling.querySelectorAll("div");
					
					for(let t = 0; t < aTarget.length; t++){
						let target = aTarget[t].querySelector("a");
						let targetLabel = target.parentElement.parentElement.previousElementSibling.children[1];
						let targetPlus = target.parentElement.parentElement.previousElementSibling.children[1].children[2];
						let targetPanel = target.parentElement.parentElement;
	
						if(target.getAttribute("href").indexOf("/" + path[1] + "/" + path[2]) > -1){
							if(path[2] === "sopp"){
								if(target.getAttribute("href") === "/" + path[1] + "/" + path[2]){
									target.classList.add("active");
								}
							}else if(path[2] === "workreport"){
								if(target.getAttribute("href") === "/" + path[1] + "/" + path[2]){
									target.classList.add("active");
								}
							}else{
								target.classList.add("active");
							}

							targetLabel.classList.add("active");
							targetPlus.innerText = "-";
							targetPanel.classList.add("active");
						}else{
							if(path[2] === "sopp2"){
								if(target.getAttribute("href") === "/" + path[1] + "/project"){
									target.classList.add("active");
									targetLabel.classList.add("active");
									targetPlus.innerText = "-";
									targetPanel.classList.add("active");
								}
							}
						}
					}
				}
			}
		}

		container.classList.add("active");
	}

	//단일 top menu 클릭 시 실행되는 함수
	topMenuClick(e){
		let thisEle = e;
		let homePath = thisEle.dataset.path;
		
		if(homePath !== undefined){
			if(homePath !== "/accounting/home"){
				window.location.href = homePath;
			}else{
				let menus = document.getElementsByClassName("sideMenu")[0].children;
				let topMenus = document.getElementsByClassName("mainTopMenu")[0].querySelectorAll("div");
				
				for(let i = 0; i < menus.length; i++){
					if(menus[i].classList.contains("accounting")){
						menus[i].style.display = "block";
					}else{
						menus[i].style.display = "none";
					}
				}

				for(let i = 0; i < topMenus.length; i++){
					if(topMenus[i].classList.contains("active")){
						topMenus[i].classList.remove("active");
					}
				}

				thisEle.classList.add("active");
			}
		}
	}

	//단일 side menu 클릭 시 실행되는 함수
	sideMenuItemClick(){
		let checkedRadio = document.getElementsByClassName("sideMenu")[0].querySelectorAll("input[type=\"radio\"]");

		for(let i = 0; i < checkedRadio.length; i++){
			let item = checkedRadio[i];
			let label = item.nextElementSibling;
			let plusBtn = label.children[2];
			let panel = label.parentElement.nextElementSibling;

			if(item.checked){
				if(label.classList.contains("active")){
					label.classList.remove("active");
					panel.classList.remove("active");
					plusBtn.innerText = "+";
				}else{
					label.classList.add("active");
					panel.classList.add("active");
					plusBtn.innerText = "-";
				}
			}else{
				label.classList.remove("active");
				panel.classList.remove("active");
				plusBtn.innerText = "+";
			}
		}
	}

	//페이지네이션 전 페이지 값 계산에 대한 함수
	paging(total, currentPage, articlePerPage) {
		let getArticle = this.calWindowLength();
		let lastPage, result = [], max;
	
		if (currentPage === undefined) {
			storage.currentPage = 1;
			currentPage = storage.currentPage;
		}
	
		if (articlePerPage === undefined) {
			if(isNaN(getArticle)){
				storage.articlePerPage = 10;
			}else{
				storage.articlePerPage = getArticle;
			}
			articlePerPage = storage.articlePerPage;
		}
	
		max = Math.ceil(total / articlePerPage);
	
		lastPage = currentPage * articlePerPage;
	
		if (currentPage == max && total % articlePerPage !== 0) {
			lastPage = ((max - 1) * articlePerPage) + (total % articlePerPage);
		}
	
		result.push(currentPage, articlePerPage, lastPage, max);
	
		return result;
	}

	//페이지 클릭 시 이동 함수
	pageMove(page, drawFnc) {
		let selectedPage = parseInt(page);
		storage.currentPage = selectedPage;
		drawFnc();
	}

	//페이지의 높이 값 계산 함수
	calWindowLength() {
		let bodyContent, containerTitle, searchContainer, searchCal, titleCal, totalCal;
	
		bodyContent = document.getElementById("bodyContent");
		searchContainer = document.getElementsByClassName("searchContainer")[0];
		containerTitle = document.getElementById("containerTitle");
		searchCal = searchContainer.offsetHeight === undefined ? parseInt(bodyContent.offsetHeight) : (parseInt(bodyContent.offsetHeight) - searchContainer.offsetHeight);
		titleCal = parseInt(containerTitle.offsetHeight + 70);
		totalCal = (parseInt(searchCal - titleCal) - parseInt(36)) / parseInt(38);
	
		return parseInt(totalCal);
	}

	//리스트 그릴 때 그리드 출력 함수
	createGrid(gridContainer, headerDataArray, dataArray, ids, job, fnc, idName) {
		let gridHtml = "", gridContents, idStr;
		ids = (ids === undefined) ? 0 : ids;
		fnc = (fnc === undefined) ? "" : fnc;
		job = (job === undefined) ? "" : job;
	
		if (idName === undefined) {
			idStr = "gridContent";
		} else {
			idStr = idName;
		}
	
		gridHtml = "<div class='gridHeader grid_default_header_item'>";
	
		for (let i = 0; i < headerDataArray.length; i++) {
			if (headerDataArray[i].align === "center") {
				gridHtml += "<div class='gridHeaderItem grid_default_text_align_center'>" + headerDataArray[i].title + "</div>";
			} else if (headerDataArray[i].align === "left") {
				gridHtml += "<div class='gridHeaderItem grid_default_text_align_left'>" + headerDataArray[i].title + "</div>";
			} else {
				gridHtml += "<div class='gridHeaderItem grid_default_text_align_right'>" + headerDataArray[i].title + "</div>";
			}
		}
	
		gridHtml += "</div>";
	
		for (let i = 0; i < dataArray.length; i++) {
			gridHtml += "<div id='" + idStr + "_grid_" + i + "' class='gridContent grid_default_body_item' data-drag=\"true\" data-id='" + ids[i] + "' data-job='" + job[i] + "' onclick='" + fnc + "'>";
			for (let t = 0; t <= dataArray[i].length; t++) {
				if (dataArray[i][t] !== undefined) {
					if (dataArray[i][t].setData === undefined) {
						gridHtml += "<div class='gridContentItem' style=\"grid-column: span " + dataArray[i][t].col + "; text-align: center;\">데이터가 없습니다.</div>";
					} else {
						gridHtml += "<div class='gridContentItem'><span class=\"textNumberFormat\">" + dataArray[i][t].setData + "</span></div>";
					}
				}
			}
			gridHtml += "</div>";
		}
	
		gridContainer.innerHTML = gridHtml;
	
		if (idName === undefined) {
			gridContents = document.getElementsByClassName("gridContent");
		} else {
			gridContents = document.querySelector("#" + idName).getElementsByClassName("gridContent");
		}
	
		let tempArray = [];
	
		for (let i = 0; i < dataArray.length; i++) {
			for (let key in dataArray[i]) {
				tempArray.push(dataArray[i][key]);
			}
		}
	
		for (let i = 0; i < tempArray.length; i++) {
			for (let t = 0; t < gridContents.length; t++) {
				if(gridContents[t].getElementsByClassName("gridContentItem")[i] !== undefined){
					if (tempArray[i].align === "center") {
						gridContents[t].getElementsByClassName("gridContentItem")[i].setAttribute("class", "gridContentItem grid_default_text_align_center");
					} else if (tempArray[i].align === "left") {
						gridContents[t].getElementsByClassName("gridContentItem")[i].setAttribute("class", "gridContentItem grid_default_text_align_left");
					} else {
						gridContents[t].getElementsByClassName("gridContentItem")[i].setAttribute("class", "gridContentItem grid_default_text_align_right");
					}
				}
			}
		}
	}

	//날짜 포맷
	dateFnc(dateTimeStr, type) {
		let result, year, month, day, hh, mm, ss, date, nowDate, calTime, calTimeHour, calTimeDay;
		nowDate = new Date();
		date = new Date(dateTimeStr * 1);
		calTime = Math.floor((nowDate.getTime() - date.getTime()) / 1000 / 60);
		calTimeHour = Math.floor(calTime / 60);
		calTimeDay = Math.floor(calTime / 60 / 24);
		year = date.getFullYear();
		month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		day = (date.getDate()) < 10 ? "0" + date.getDate() : date.getDate();
		hh = (date.getHours()) < 10 ? "0" + date.getHours() : date.getHours();
		mm = (date.getMinutes()) < 10 ? "0" + date.getMinutes() : date.getMinutes();
		ss = (date.getSeconds()) < 10 ? "0" + date.getSeconds() : date.getSeconds();

		if (dateTimeStr === undefined || dateTimeStr === null) {
			return "";
		}

		if (type === undefined) {
			type = "yyyy-mm-dd";
		}

		if (type === "yyyy-mm-dd") {
			result = year + "-" + month + "-" + day;
		} else if (type === "yy-mm-dd") {
			result = year.toString().substring(2, 4) + "-" + month + "-" + day;
		} else if (type === "yyyy-mm") {
			result = year + "-" + month;
		} else if (type === "mm-dd") {
			result = month + "-" + day;
		} else if (type === "yyyy-mm-dd HH:mm:ss") {
			result = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
		} else if (type === "HH:mm:ss") {
			result = hh + ":" + mm + ":" + ss;
		} else if (type === "HH:mm") {
			result = hh + ":" + mm;
		} else if (type === "mm:ss") {
			result = mm + ":" + ss;
		} else if (type === "yyyy.mm.dd") {
			result = year + "." + month + "." + day;
		} else if (type === "yy.mm.dd") {
			result = year.toString().substring(2, 4) + "." + month + "." + day;
		} else if (type === "yyyy-mm-dd T HH:mm") {
			result = year + "-" + month + "-" + day + "T" + hh + ":" + mm;
		}

		return result;
	}

	//날짜를 받아와서 modified와 created 결정 함수
	dateDis(created, modified) {
		let result;

		if (created === undefined) {
			created = null;
		} else if (modified === undefined) {
			modified = null;
		}

		if (created !== null && modified !== null) {
			result = modified;
		} else if (created === null && modified !== null) {
			result = modified;
		} else if (created !== null && modified === null) {
			result = created;
		}

		return result;
	}

	// 페이징 만드는 함수
	createPaging(container, max, eventListener, fncStr, current, nextCount, forwardStep) {
		let x = 0, page, html = ["", "", "", ""];
		if (container == undefined) {
			console.log("[createPaging] Paging container is Empty.");
			return false;
		} else if (!classType(container).includes("Element")) {
			console.log("[createPaging] Container is Not Html Element.");
			return false;
		} else if (isNaN(max) || max === "" || max < 1) {
			console.log("[createPaging] max value is abnormal.");
			return false;
		} else if (eventListener === undefined) {
			console.log("[createPaging] Click event listener unavailable.");
			return false;
		}

		if (current === undefined) current = 1;
		if (nextCount === undefined) nextCount = 3;
		if (forwardStep === undefined) forwardStep = 10;

		html[1] = "<div class=\"paging_cell paging_cell_current\">" + current + "</div>";

		for (page = current - 1; page >= current - nextCount && page > 0; page--) {
			html[1] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>" + html[1];
		}

		if (page === 1) {
			html[0] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>";
		} else if (page > 1) {
			if (current - forwardStep > 1) {
				html[0] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + (current - forwardStep) + ", " + fncStr + ")\">&laquo;</div>";
			}
			html[0] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(1, " + fncStr + ")\">1</div>" + html[0];
		} else {
			html[0] = undefined;
		}

		for (page = current + 1; page <= (current + nextCount) && page <= max; page++) {
			html[1] = html[1] + "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>";
		}

		if (page === max) {
			html[2] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>";
		} else if (page < max) {
			if (current + forwardStep < max) {
				html[2] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + (current + forwardStep) + ", " + fncStr + ")\">&raquo;</div>";
			}
			html[2] = html[2] + "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + max + ", " + fncStr + ")\">" + max + "</div>";
		} else html[2] = undefined;

		html[3] = html[1];
		if (html[0] !== undefined) html[3] = html[0] + "<div class=\"paging_cell_empty\">...</div>" + html[1];
		if (html[2] != undefined) html[3] = html[3] + "<div class=\"paging_cell_empty\">...</div>" + html[2];

		return html[3];
	}

	//뷰에 가리거나 보이게 하고 싶을 때 걸러내는 함수
	setViewContents(hideArr, showArr){
		for(let i = 0; i < hideArr.length; i++){
			let item = document.getElementsByClassName(hideArr[i])[0];
			if(item !== undefined){
				item.style.display = "none";
			}
		}
	
		for(let i = 0; i < showArr.length; i++){
			let item = document.getElementsByClassName(showArr[i].element)[0];
			if(item !== undefined){
				item.style.display = showArr[i].display;
			}
		}
	}

	//상세 폼
	detailViewFormHtml(data) {
		let html = "";

		for (let i = 0; i < data.length; i++) {
			let dataTitle = (data[i].title === undefined) ? "" : data[i].title;
			let col = (data[i].col === undefined) ? 1 : data[i].col;

			html += "<div class='defaultFormLine' style=\"grid-column: span " + col + ";\">";

			if (dataTitle !== "") {
				html += "<div class='defaultFormSpanDiv'>";
				html += "<span class='defaultFormSpan'>" + dataTitle + "</span>";
				html += "</div>";
			}

			html += "<div class='defaultFormContent'>";

			html += this.inputSet(data[i]);

			html += "</div>";
			html += "</div>";
		}

		return html;
	}

	// 상세보기 type별 폼 전달
	detailViewForm(data, type) {
		let html = "", pageContainer, listChangeBtn, scheduleRange;

		if (type === undefined) {
			pageContainer = document.getElementsByClassName("pageContainer")[0];
			listChangeBtn = document.getElementsByClassName("listChangeBtn")[0];
			scheduleRange = document.getElementById("scheduleRange");

			if (listChangeBtn !== undefined) {
				listChangeBtn.style.display = "none";
			}

			if (scheduleRange !== undefined) {
				scheduleRange.style.display = "none";
			}

			pageContainer.children[0].style.display = "none";

			html = this.detailViewFormHtml(data);
		} else if (type === "board") {
			html = this.detailBoardForm(data);
		} else if (type === "modal") {
			html = this.detailViewFormHtml(data);
		}

		return html;
	}

	//게시판 상세 폼
	detailBoardForm(data) {
		let html = "";

		html = "<div class='detailBoard'>";
		html += "<div class='detailBtns'></div>";
		html += "<div class='detailContents'>";
		html += "<div class='defaultFormContainer'>";
		html += this.detailViewFormHtml(data);
		html += "</div>";
		html += "</div>";
		html += "</div>";

		return html;
	}

	//상세보기 input이나 textarea 만들어주는 함수
	inputSet(data) {
		let html = "";
		let dataValue = (data.value === undefined) ? "" : data.value;
		let dataDisabled = (data.disabled === undefined) ? true : data.disabled;
		let dataType = (data.type === undefined) ? "text" : data.type;
		let dataKeyup = (data.dataKeyup === undefined) ? "" : data.dataKeyup;
		let dataKeyupEvent = (data.keyup === undefined) ? "" : data.keyup;
		let elementId = (data.elementId === undefined) ? "" : data.elementId;
		let elementName = (data.elementName === undefined) ? "" : data.elementName;
		let dataChangeEvent = (data.onChange === undefined) ? "" : data.onChange;
		let dataClickEvent = (data.onClick === undefined) ? "" : data.onClick;
		let dataComplete = (data.complete === undefined) ? "" : data.complete;
		let autoComplete = (data.autoComplete === undefined) ? "off" : data.autoComplete;
		let placeHolder = (data.placeHolder === undefined) ? "" : data.placeHolder;
	
		if (dataType === "text") {
			if (dataDisabled == true) {
				html += "<input type='text' id='" + elementId + "' name='" + elementName + "' autocomplete=\"" + autoComplete + "\" value='" + dataValue + "' data-complete='" + dataComplete + "' data-keyup='" + dataKeyup + "' onchange='" + dataChangeEvent + "' onclick='" + dataClickEvent + "' onkeyup='" + dataKeyupEvent + "' placeholder=\"" + placeHolder + "\" readonly>";
			} else {
				html += "<input type='text' id='" + elementId + "' name='" + elementName + "' autocomplete=\"" + autoComplete + "\" value='" + dataValue + "' data-complete='" + dataComplete + "' data-keyup='" + dataKeyup + "' onchange='" + dataChangeEvent + "' onclick='" + dataClickEvent + "' onkeyup='" + dataKeyupEvent + "' placeholder=\"" + placeHolder + "\">";
			}
		} else if (dataType === "textarea") {
			if (dataDisabled == true) {
				html += "<textarea id=\"" + elementId + "\" readonly>" + dataValue + "</textarea>";
			} else {
				html += "<textarea id=\"" + elementId + "\">" + dataValue + "</textarea>";
			}
		} else if (dataType === "radio") {
			for (let t = 0; t < data.radioValue.length; t++) {
				if (data.radioType !== "tab") {
					data.radioType = "default";
				}
	
				html += "<div class=\"detailRadioBox\" data-type=\"" + data.radioType + "\">";
	
				if (dataDisabled == true) {
					if (t == 0) {
						html += "<input type='radio' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' disabled='" + dataDisabled + "' data-type=\"" + data.radioType + "\" onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\" checked><label data-type=\"" + data.radioType + "\" for=\"" + elementId[t] + "\">" + data.radioValue[t].value + "</label>" + " ";
					} else {
						html += "<input type='radio' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' disabled='" + dataDisabled + "' data-type=\"" + data.radioType + "\" onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label data-type=\"" + data.radioType + "\" for=\"" + elementId[t] + "\">" + data.radioValue[t].value + "</label>" + " ";
					}
				} else {
					if (t == 0) {
						html += "<input type='radio' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' data-type=\"" + data.radioType + "\" onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\" checked><label data-type=\"" + data.radioType + "\" for=\"" + elementId[t] + "\">" + data.radioValue[t].value + "</label>" + " ";
					} else {
						html += "<input type='radio' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' data-type=\"" + data.radioType + "\" onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label data-type=\"" + data.radioType + "\" for=\"" + elementId[t] + "\">" + data.radioValue[t].value + "</label>" + " ";
					}
				}
	
				html += "</div>";
			}
		} else if (dataType === "checkbox") {
			for (let t = 0; t < data.checkValue.length; t++) {
				if (dataDisabled == true) {
					if (t == 0) {
						html += "<input type='checkbox' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.checkValue[t].value + "' disabled='" + dataDisabled + "' onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label for=\"" + elementId[t] + "\">" + data.checkValue[t].key + "</label>" + " ";
					} else {
						html += "<input type='checkbox' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.checkValue[t].value + "' disabled='" + dataDisabled + "' onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label for=\"" + elementId[t] + "\">" + data.checkValue[t].key + "</label>" + " ";
					}
				} else {
					if (t == 0) {
						html += "<input type='checkbox' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.checkValue[t].value + "' onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label for=\"" + elementId[t] + "\">" + data.checkValue[t].key + "</label>" + " ";
					} else {
						html += "<input type='checkbox' id='" + elementId[t] + "' name='" + elementName + "' value='" + data.checkValue[t].value + "' onclick='" + dataClickEvent + "' onChange=\"" + dataChangeEvent + "\"><label for=\"" + elementId[t] + "\">" + data.checkValue[t].key + "</label>" + " ";
					}
				}
			}
		} else if (dataType === "date") {
			if (dataDisabled == true) {
				html += "<input type='date' max='9999-12-31' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "' disabled='" + dataDisabled + "'>";
			} else {
				html += "<input type='date' max='9999-12-31' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "'>";
			}
		} else if (dataType === "datetime") {
			if (dataDisabled == true) {
				html += "<input type='datetime-local' max='9999-12-31T23:59:59' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "' disabled='" + dataDisabled + "'>";
			} else {
				html += "<input type='datetime-local' max='9999-12-31T23:59:59' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "'>";
			}
		} else if (dataType === "select") {
			if (dataDisabled == true) {
				html += "<select id='" + elementId + "' name='" + elementName + "' disabled='" + dataDisabled + "'>";
			} else {
				html += "<select id='" + elementId + "' name='" + elementName + "'>";
			}
			for (let t = 0; t < data.selectValue.length; t++) {
				html += "<option value='" + data.selectValue[t].key + "'>" + data.selectValue[t].value + "</option>";
			}
	
			html += "</select>";
		} else if (dataType === "file") {
			html += "<input type='file' id='" + elementId + "' name='" + elementName + "' onchange='fileChange();' multiple>";
		} else if (dataType === "") {
			html += "";
		}
	
		return html;
	}

	//formList에 데이터를 넣어주는 함수
	detailSetFormList(result) {
		storage.formList = {};
		for (let key in result) {
			if (key !== "attached" && key !== "schedules" && key !== "trades" && key !== "bills") {
				storage.formList[key] = result[key];
			}
		}
	}

	//상세보기 컨테이너 감추는 함수
	detailBoardContainerHide() {
		let detailBoard = document.getElementsByClassName("detailBoard");
		
		for(let i = 0; i < detailBoard.length; i++){
			detailBoard[i].remove();
		}
	}

	//data-change를 true로 변경하는 함수
	detailTrueDatas(datas) {
		for (let i = 0; i < datas.length; i++) {
			if (document.getElementById(datas[i])) {
				document.getElementById(datas[i]).setAttribute("data-change", true);
			} else if (document.getElementsByName(datas[i]).length > 0) {
				document.getElementsByName(datas[i]).setAttribute("data-change", true);
			}
		}
	}

	//formList에 데이터를 세팅해주는 함수
	formDataSet(storageArr) {
		if (storageArr === undefined) {
			storageArr = storage.formList;
		}
		
		for (let key in storageArr) {
			let element = "";
			if (document.getElementById(key)) {
				element = document.getElementById(key);
			} else if (document.getElementsByName(key).length > 0) {
				if (document.getElementsByName(key).checked.length > 0) {
					element = document.getElementsByName(key).checked;
				} else {
					element = document.getElementsByName(key);
				}
			}
	
			if (element !== undefined && element !== "") {
				if (element.tagName === "TEXTAREA") {
					storageArr[key] = CKEDITOR.instances[key].getData().replaceAll("\n", "");
				} else {
					if (!element.dataset.change) {
						if (typeof storageArr[key] === "number") {
							if (element.type === "date" || element.type === "datetime-local") {
								let dateTime = new Date(element.value).getTime();
								storageArr[key] = dateTime;
							} else {
								if (element.value === "") {
									storageArr[key] = 0;
								} else {
									storageArr[key] = parseInt(element.value.replaceAll(",", ""));
								}
							}
						} else {
							if (element.type === "date" || element.type === "datetime-local") {
								let dateTime = new Date(element.value).getTime();
								storageArr[key] = dateTime;
							} else {
								storageArr[key] = element.value;
							}
						}
					}
				}
			}
		}
	}

	//검색 부분 아코디언 함수
	searchAco(e) {
		let thisBtn, multiSearchResetBtn, multiSearchBtn, searchMultiContent;
		thisBtn = e;
		multiSearchResetBtn = document.getElementById("multiSearchResetBtn");
		multiSearchBtn = document.getElementById("multiSearchBtn");
		searchMultiContent = document.getElementsByClassName("searchMultiContent")[0];
	
		if (thisBtn.dataset.set) {
			thisBtn.innerHTML = "<i class=\"fa-solid fa-plus fa-xl\"></i>";
			thisBtn.dataset.set = false;
			multiSearchBtn.style.display = "none";
			searchMultiContent.style.display = "none";
			multiSearchResetBtn.style.display = "none";
		} else {
			thisBtn.innerHTML = "<i class=\"fa-solid fa-minus fa-xl\"></i>";
			thisBtn.dataset.set = true;
			multiSearchBtn.style.display = "flex";
			searchMultiContent.style.display = "flex";
			multiSearchResetBtn.style.display = "flex";
		}
	}

	//검색 리셋 함수
	searchReset() {
		let searchMultiContent = document.getElementsByClassName("searchMultiContent")[0];
		let contents = searchMultiContent.querySelectorAll("div");

		for(let i = 0; i < contents.length; i++){
			let inputs = contents[i].querySelectorAll("input");
			let selects = contents[i].querySelectorAll("select");

			for(let t = 0; t < inputs.length; t++){
				inputs[t].value = "";
			}

			for(let t = 0; t < selects.length; t++){
				selects[t].value = "";
			}
		}
	}

	//단일 검색 시 데이터를 걸러주는 함수
	searchDataFilter(arrayList, searchDatas, type) {
		let dataArray = [];
	
		if (type === "input") {
			for (let key in storage.searchList) {
				if (storage.searchList[key].indexOf(searchDatas) > -1) {
					dataArray.push(arrayList[key]);
				}
			}
		} else {
			if (searchDatas.indexOf("#created") > -1) {
				let splitStr;
				splitStr = searchDatas.split("#created");
	
				for (let key in storage.searchList) {
					if (splitStr[0] <= storage.searchList[key].split("#created")[1]) {
						if (storage.searchList[key].split("#created")[1] <= splitStr[1]) {
							dataArray.push(key);
						}
					}
				}
			} else if (searchDatas.indexOf("#date") > -1) {
				let splitStr;
				splitStr = searchDatas.split("#date");
	
				for (let key in storage.searchList) {
					if (splitStr[0] <= storage.searchList[key].split("#date")[1]) {
						if (storage.searchList[key].split("#date")[1] <= splitStr[1]) {
							dataArray.push(key);
						}
					}
				}
			} else if (searchDatas.indexOf("#from") > -1) {
				let splitStr;
				splitStr = searchDatas.split("#from");
	
				for (let key in storage.searchList) {
					if (splitStr[0] <= storage.searchList[key].split("#from")[1]) {
						if (storage.searchList[key].split("#from")[1] <= splitStr[1]) {
							dataArray.push(key);
						}
					}
				}
			} else if (searchDatas.indexOf("#startOfFreeMaintenance") > -1) {
				let splitStr;
				splitStr = searchDatas.split("#startOfFreeMaintenance");
	
				for (let key in storage.searchList) {
					if (splitStr[0] <= storage.searchList[key].split("#startOfFreeMaintenance")[1]) {
						if (storage.searchList[key].split("#startOfFreeMaintenance")[1] <= splitStr[1]) {
							dataArray.push(key);
						}
					}
				}
			} else if (searchDatas.indexOf("#startOfPaidMaintenance") > -1) {
				let splitStr;
				splitStr = searchDatas.split("#startOfPaidMaintenance");
	
				for (let key in storage.searchList) {
					if (splitStr[0] <= storage.searchList[key].split("#startOfPaidMaintenance")[1]) {
						if (storage.searchList[key].split("#startOfPaidMaintenance")[1] <= splitStr[1]) {
							dataArray.push(key);
						}
					}
				}
			} else if (searchDatas.indexOf("#saleDate") > -1) {
				let splitStr;
				splitStr = searchDatas.split("#saleDate");
	
				for (let key in storage.searchList) {
					if (splitStr[0] <= storage.searchList[key].split("#saleDate")[1]) {
						if (storage.searchList[key].split("#saleDate")[1] <= splitStr[1]) {
							dataArray.push(key);
						}
					}
				}
			} else if (searchDatas.indexOf("#issueDate") > -1) {
				let splitStr;
				splitStr = searchDatas.split("#issueDate");
	
				for (let key in storage.searchList) {
					if (splitStr[0] <= storage.searchList[key].split("#issueDate")[1]) {
						if (storage.searchList[key].split("#issueDate")[1] <= splitStr[1]) {
							dataArray.push(key);
						}
					}
				}
			} else if (searchDatas.indexOf("#price") > -1) {
				let splitStr;
				splitStr = searchDatas.split("#price");
	
				for(let key in storage.searchList){
					if(parseInt(splitStr[0]) <= parseInt(storage.searchList[key].split("#price")[1])){
						if(parseInt(storage.searchList[key].split("#price")[1]) <= parseInt(splitStr[1])){
							dataArray.push(key);
						}
					}
				}
			} else {
				let splitStr, index = "";
				splitStr = searchDatas.split("#");

				for(let i = 0; i < splitStr[1].length; i++){
					if(splitStr[1][i] !== "/"){
						index += splitStr[1][i];
					}else{
						break;
					}
				}

				for (let key in storage.searchList) {
					if (storage.searchList[key].split("#")[index].indexOf(searchDatas.split("/")[1]) > -1) {
						dataArray.push(key);
					}
				}
			}
		}
		
		return dataArray;
	}

	//멀티 검색 시 걸러주는 함수
	searchMultiFilter(index, dataArray, arrayList) {
		let arr = [], tempResultArray = [], resultArray = [];
	
		if (index > 1) {
			for (let i = 0; i < dataArray.length; i++) {
				if (arr[dataArray[i]]) {
					arr[dataArray[i]]++;
				} else {
					arr[dataArray[i]] = 1;
				}
			}
	
			for (let key in arr) {
				if (index == arr[key]) {
					tempResultArray.push(key);
				}
			}
	
			for (let i = 0; i < tempResultArray.length; i++) {
				resultArray.push(arrayList[tempResultArray[i]]);
			}
		} else {
			for (let i = 0; i < dataArray.length; i++) {
				resultArray.push(arrayList[dataArray[i]]);
			}
		}

		return resultArray;
	}

	//자동완성 기능 만들어주는 함수
	addAutoComplete(e) {
		let thisEle, autoComplete;
		thisEle = e;
		
		if (!thisEle.readOnly) {
			if (document.getElementsByClassName("autoComplete")[0] !== undefined) {
				document.getElementsByClassName("autoComplete")[0].remove();
				thisEle.removeAttribute("data-value");
			}
	
			let createDiv = document.createElement("div");
			createDiv.className = "autoComplete";
			thisEle.after(createDiv);
			autoComplete = document.getElementsByClassName("autoComplete")[0];
			autoComplete.style.top = thisEle.offsetTop + 30 + "px";
			autoComplete.style.left =  thisEle.offsetLeft + "px";
			autoComplete.style.width = thisEle.clientWidth + "px";
	
			if (thisEle.value === "") {
				for (let key in storage[thisEle.dataset.complete]) {
					let listDiv = document.createElement("div");
					listDiv.setAttribute("onclick", "autoCompleteClick(this);");
	
					if (thisEle.dataset.complete === "customer" || thisEle.dataset.complete === "cip" || thisEle.dataset.complete === "product") {
						if(thisEle.dataset.complete === "product"){
							listDiv.dataset.value = storage[thisEle.dataset.complete][key].no;
							listDiv.innerHTML = storage[thisEle.dataset.complete][key].name;
						}else{
							listDiv.dataset.value = key;
							listDiv.innerHTML = storage[thisEle.dataset.complete][key].name;
						}
					} else if (thisEle.dataset.complete === "user") {
						listDiv.dataset.value = storage[thisEle.dataset.complete][key].userNo;
						listDiv.innerHTML = storage[thisEle.dataset.complete][key].userName;
					} else if (thisEle.dataset.complete === "sopp" || thisEle.dataset.complete === "contract") {
						listDiv.dataset.value = storage[thisEle.dataset.complete][key].no;
						listDiv.innerHTML = storage[thisEle.dataset.complete][key].title;
					}
	
					autoComplete.append(listDiv);
				}
			} else {
				for (let key in storage[thisEle.dataset.complete]) {
					if (thisEle.dataset.complete === "customer" || thisEle.dataset.complete === "cip" || thisEle.dataset.complete === "product") {
						if (storage[thisEle.dataset.complete][key].name.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "autoCompleteClick(this);");
							if(thisEle.dataset.complete === "product"){
								listDiv.dataset.value = storage[thisEle.dataset.complete][key].no;
								listDiv.innerHTML = storage[thisEle.dataset.complete][key].name;
							}else{
								listDiv.dataset.value = key;
								listDiv.innerHTML = storage[thisEle.dataset.complete][key].name;
							}
							autoComplete.append(listDiv);
						}
					} else if (thisEle.dataset.complete === "user") {
						if (storage[thisEle.dataset.complete][key].userName.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "autoCompleteClick(this);");
							listDiv.dataset.value = storage[thisEle.dataset.complete][key].userNo;
							listDiv.innerHTML = storage[thisEle.dataset.complete][key].userName;
							autoComplete.append(listDiv);
						}
					} else if (thisEle.dataset.complete === "sopp" || thisEle.dataset.complete === "contract") {
						if (storage[thisEle.dataset.complete][key].title.indexOf(thisEle.value) > -1) {
							let listDiv = document.createElement("div");
							listDiv.setAttribute("onclick", "autoCompleteClick(this);");
							listDiv.dataset.value = storage[thisEle.dataset.complete][key].no;
							listDiv.innerHTML = storage[thisEle.dataset.complete][key].title;
							autoComplete.append(listDiv);
						}
					}
				}
			}
		}
	}

	//from, to 예외처리에 관한 함수
	searchDateDefaultSet(e) {
		let thisDateInput = e, matchDateInput, thisDate, year, month, day;
	
		if (thisDateInput.getAttribute("data-date-type") === "from") {
			matchDateInput = thisDateInput.nextElementSibling.nextElementSibling;
			let splitDate = thisDateInput.value.split("-");
			thisDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);
			splitDate = matchDateInput.value.split("-");
			let matchDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);
	
			if (matchDateInput.value === "") {
				thisDate.setDate(thisDate.getDate() + 1);
			} else if (thisDate.getTime() > matchDate.getTime()) {
				msg.set("시작일이 종료일보다 클 수 없습니다.");
				thisDate.setDate(thisDate.getDate() + 1);
			} else {
				return null;
			}
		} else {
			matchDateInput = thisDateInput.previousElementSibling.previousElementSibling;
			let splitDate = thisDateInput.value.split("-");
			thisDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);
			splitDate = matchDateInput.value.split("-");
			let matchDate = new Date(splitDate[0], parseInt(splitDate[1] - 1), splitDate[2]);
	
			if (matchDateInput.value === "") {
				thisDate.setDate(thisDate.getDate() - 1);
			} else if (thisDate.getTime() < matchDate.getTime()) {
				msg.set("종료일이 시작일보다 작을 수 없습니다.");
				thisDate.setDate(thisDate.getDate() - 1);
			} else {
				return null;
			}
		}
	
		year = thisDate.getFullYear();
		month = thisDate.getMonth() + 1;
		day = thisDate.getDate();
	
		if (month < 10) {
			month = "0" + month;
		}
	
		if (day < 10) {
			day = "0" + day;
		}
	
		matchDateInput.value = year + "-" + month + "-" + day;
	}

	enableDisabled(e, clickStr, notIdArray, boxClassName) {
		let thisEle, box;
		thisEle = e;

		if(boxClassName === undefined){
			box = document.querySelectorAll("input, select, textarea");
		}else{
			box = document.getElementsByClassName(boxClassName)[0].querySelectorAll("input, select, textarea");
		}

	
		for (let i = 0; i < box.length; i++) {
			if (box[i].type === "radio") {
				box[i].removeAttribute("readonly");
				box[i].removeAttribute("disabled");
			} else {
				if (notIdArray.indexOf(box[i].getAttribute("id")) == -1) {
					box[i].removeAttribute("readonly");
					box[i].removeAttribute("disabled");
				}
			}
		}
	
		thisEle.setAttribute("onclick", clickStr);
		thisEle.setAttribute("data-hide-flag", true);
		thisEle.innerHTML = "수정완료";
		ckeditor.config.readOnly = false;
		window.setTimeout(setEditor, 100);
	
		if (modal.wrap.css("display") !== "none") {
			setTimeout(() => {
				document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
			}, 300);
		}
	}
	
	//객체(오브젝트) empty 체크(비어있을 때 : true)
	objectCheck(obj) {
		if(obj.constructor === Object && Object.keys(obj).length === 0){
			return true;
		}else{
			return false;
		}
	}
}