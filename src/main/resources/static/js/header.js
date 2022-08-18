let cipher, msg, apiServer, modal, storage;	

function init(){
	setTimeout(() => {
		$("#loadingDiv").loading({
			onStart: function(loading) {
				loading.overlay.fadeIn(1000);
			},
			onStop: function(loading) {
				loading.overlay.fadeOut(1000);
			}
		});
	}, 70);
	
	apiServer = "";
	storage = {};
	
	getUserMap();
	getDeptMap();
	getBasicInfo();
	getCustomer();
	getCommonCode();
		
	cipher = { // 암호화 모듈
		"encRsa" : (message) => {
					let result, rsa;
					if(message === undefined || message === null)	return message;
					rsa = new RSAKey();
					rsa.setPublic(cipher.rsa.public.modulus, cipher.rsa.public.exponent);
					return btoa(rsa.encrypt(message));
		},
		"encAes":(message)=>{
			let cp, result;
			cp = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(cipher.aes.key), {
				"iv": CryptoJS.enc.Utf8.parse(cipher.aes.iv),
				"padding": CryptoJS.pad.Pkcs7,
				"mode": CryptoJS.mode.CBC
			});
			result = cp.toString();
			return result;
		},
		"decAes":(message)=>{
			let cp, result;
			cp = CryptoJS.AES.decrypt(message, CryptoJS.enc.Utf8.parse(cipher.aes.key), {
				iv: CryptoJS.enc.Utf8.parse(cipher.aes.iv),
				padding: CryptoJS.pad.Pkcs7,
				mode: CryptoJS.mode.CBC
			});
			result = cp.toString(CryptoJS.enc.Utf8);
			return result;
		},
		"rsa" : {"public":{"modulus":undefined,
						"exponent":undefined},
				"private":undefined,
				"getKey":()=>{
					let url = apiServer + "/api/user/rsa";
					$.ajax({
						url: url,
						method: "get",
						dataType: "json",
						cache: false,
						success:(data) => {
							let publicKeyExponent, publicKeyModulus, aesKey, aesIv, url = apiServer + "/api/user/aes";
							if(data.result === "ok"){
								aesKey = [cipher.genKey(8), cipher.genKey(8), cipher.genKey(8), cipher.genKey(8)];
								aesIv = [cipher.genKey(8), cipher.genKey(8)];
								cipher.aes.key = aesKey[0] + aesKey[1] + aesKey[2] + aesKey[3];
								cipher.aes.iv = aesIv[0] + aesIv[1];
								publicKeyExponent = data.data.publicKeyExponent;
								publicKeyModulus = data.data.publicKeyModulus;
								cipher.rsa.public.modulus = publicKeyModulus;
								cipher.rsa.public.exponent = publicKeyExponent;
								sessionStorage.setItem("rsaModulus", publicKeyModulus);
								sessionStorage.setItem("rsaExponent", publicKeyExponent);
								sessionStorage.setItem("aesKey", cipher.aes.key);
								sessionStorage.setItem("aesIv", cipher.aes.iv);
								$.ajax({
									"url": url,
									"method": "post",
									data: cipher.encRsa(aesKey[0]) + "\n" + cipher.encRsa(aesKey[1]) + "\n" + cipher.encRsa(aesKey[2]) + "\n" + cipher.encRsa(aesKey[3]) + "\n"+ cipher.encRsa(aesIv[0]) + "\n" + cipher.encRsa(aesIv[1]),
									contentType:"text/plain",
									"cache": false,
									success:(data) => {
									}
								})
							}else{
								msg.set(data.msg);
							}
						}
					})
				}},
		"aes" : {"iv":undefined,
				"key":undefined},
		"genKey" : (length)=>{
			let x, t, result = "", src = [];
			if(isNaN(length) || length < 8)	length = 32;
			for(x = 0 ; x < 69 ; x++){
				if (x < 10)
					src[x] = (x + 48);
				else if (x < 36)
					src[x] = (x + 55);
				else if (x < 62)
					src[x] = (x + 61);
				else if (x == 63)
					src[x] = 33;
				else if (x == 64)
					src[x] = 43;
				else if (x == 65)
					src[x] = 126;
				else
					src[x] = (x - 31);
			}
			for (x = 0; x < length; x++) {
				t = Math.floor((Math.random() * src.length));
				result += String.fromCharCode(src[t])
			}
			return result;
		} // End of getKey()
	}

	msg = { // 메시징 유닛
		"cnt" : undefined,
		"handler" : undefined,
		"time" : 10,
		"set" : (message, time) => {
			let el, handler, html;
			if(msg.cnt === undefined || msg.cnt === null)	return;
			if(message === undefined)	return;
			if(time === undefined)  time = msg.time;
			el = document.createElement("div");
			handler = window.setTimeout(()=>{
				el.remove();
			},time*1000);
			html = "<div class=\"each_msg\"><div data-handler=\"" + handler + "\" onclick=\"msg.clr(this)\" class=\"cls_btn\">&#x2715;</div><div class=\"msg_content\">" + message + "</div></div>";
			el.innerHTML = html;
			msg.cnt.appendChild(el);
		},
		"clr" : (el) => {
			let handler;
			handler = el.dataset.handler*1;
			window.clearTimeout(handler);
			el.parentElement.remove();
		}
	}

	//모달
	modal = {
		"container": $(".modalContainer"),
		"content": $(".modalContainer").find(".modal"),
		"wrap": $(".modalContainer").find(".modalWrap"),
		"head": $(".modalContainer").find(".modalWrap .modalHead"),
		"headTitle": $(".modalContainer").find(".modalWrap").find(".modalHead .modalHeadTitle"),
		"body": $(".modalContainer").find(".modalWrap .modalBody"),
		"foot": $(".modalContainer").find(".modalWrap .modalFoot"),
		"footBtns": $(".modalContainer").find(".modalWrap .modalFoot .modalBtns"),
		"confirm": $(".modalContainer").find(".modalWrap .modalFoot .confirm"),
		"close": $(".modalContainer").find(".modalWrap .modalFoot .close"),
		"xClose": () => {
			modal.hide();
		},
		"alert": (title, content) => {
			modal.show();
			modal.content.css("width", "400px");
			modal.headTitle.text(title);
			modal.body.html(content);
			modal.confirm.hide();
			modal.close.text("확인");
			modal.close.css("width", "100%");
		},
		"show": () => {
			modal.clear();

			setTimeout(() => {
				setTiny();
				inputDataList();
			},100);

			modal.wrap.css('display','flex').hide().fadeIn();
		},
		"hide": () => {
			modal.clear();
			modal.wrap.fadeOut();
		},
		"clear": () => {
			modal.headTitle.text("");
			modal.body.html("");
			modal.confirm.show();
			modal.close.show();
			modal.footBtns.css("width", "49%");
			modal.confirm.text("확인");
			modal.close.text("닫기");
		},
		"tabs": {
			"content": {
				"hide": (notId) => {
					$(document).find(".tabs input:radio").each((index, item) => {
						if(notId === undefined){
							$(document).find("#" + $(item).data("content-id")).hide();
						}else{
							$(document).find("#" + $(item).data("content-id")).not("#" + notId).hide();
						}
					});
				}
			}
		}
	}

	dragAndDrop = {
		"fileDragEnter": (e) => {
			e.stopPropagation();
			e.preventDefault();
			toggleClass("dragenter");
		},

		"fileDragLeave": (e) => {
			e.stopPropagation();
			e.preventDefault();
			toggleClass("dragleave");
		},

		"fileDragOver": (e) => {
			e.stopPropagation();
			e.preventDefault();
			toggleClass("dragover");
		},

		"fileDrop": (e) => {
			e.preventDefault();
			let files = e.dataTransfer && e.dataTransfer.files;

			toggleClass("drop");
			showFile(files);
		},
	},

	crud = {
		"defaultAjax": (url, method, data, type, successFnc, errorFnc) => {
			$.ajax({
				url: url,
				method: method,
				data: data,
				dataType: "json",
				contentType: "text/plain",
				success: (result) => {
					if(result.result === "ok"){
						if(successFnc !== undefined){
							let jsonData;
							
							if(type === "list"){
								jsonData = cipher.decAes(result.data);
								jsonData = JSON.parse(jsonData);
								if(localStorage.getItem("searchList")){
									let searchCategory, searchText, temp = [], resultArray = [];
									searchCategory = localStorage.getItem("searchCategory");
									searchText = localStorage.getItem("searchText");
	
									for(let i = 0; i < jsonData.length; i++){
										temp.push(jsonData[i]);
									}
	
									for(let t = 0; t < temp.length; t++){
										if(temp[t][searchCategory].toString().indexOf(searchText) > -1){
											resultArray.push(temp[t]);
										}
									}
	
									successFnc(resultArray);
								}else{
									successFnc(jsonData);
								}
	
								localStorage.clear();
							}else if(type === "detail"){
								jsonData = cipher.decAes(result.data);
								jsonData = JSON.parse(jsonData);
								successFnc(jsonData);
							}else{
								successFnc();
							}
						}
					}
				},
				error: () => {
					if(errorFnc !== undefined){
						errorFnc();
					}
				}
			});
		}
	}

	cipher.aes.key = sessionStorage.getItem("aesKey");
	cipher.aes.iv = sessionStorage.getItem("aesIv");
	msg.cnt = document.getElementsByClassName("msg_cnt")[0];
	
	$("#sideMenu").find("ul:not(#panel) li a").click(function(){
		if($(this).attr("class") !== "active"){
			$("#sideMenu").find("ul:not(#panel) li a").removeAttr("class");
			$("#sideMenu").find("ul:not(#panel) li a").next().removeAttr("class");
			$("#sideMenu").find("ul:not(#panel) li a").find("#slideSpan").text("+");
			$(this).next().attr("class", "active");
			$(this).find("#slideSpan").text("-");
			$(this).attr("class", "active");
		}else{
			$(this).removeAttr("class");
			$(this).next().removeAttr("class");
			$(this).find("#slideSpan").text("+");
		}
	});

	
	$(".close").click(function(){
		modalClose();
	});
	
	menuActive();

	setTimeout(() => {
		setTiny();
	}, 100);
}

//페이징될 때 header, sideMenu active를 위한 함수
function menuActive(){
	let i = null, pathName = null, fullStr = null, firstStr = null, lastStr = null, strLength = null, sideMenu = null, mainTopMenu = null;
	
	pathName = $("#pathName").val();
	mainTopMenu = $("#mainTopMenu");
	sideMenu = $("#sideMenu");
	strLength = pathName.length;
	i = 0;

	if(pathName === "root"){
		mainTopMenu.find("ul li button").removeAttr("class");
		mainTopMenu.find("ul li button[data-keyword='business']").attr("class", "active");

		readyTopPageActive();
	}else{
		readyTopPageActive();

		while(i <= strLength){
			fullStr = pathName.charAt(i);
	
			if(fullStr == fullStr.toUpperCase()){
				firstStr = pathName.substring(0, i).toLowerCase();
				lastStr = pathName.substring(i, strLength).toLowerCase();
				
				mainTopMenu.find("ul li button").removeAttr("class");
				mainTopMenu.find("ul li button[data-keyword='"+firstStr+"']").attr("class", "active");

				sideMenu.find("ul[id='"+firstStr+"']").attr("class", "active");
				sideMenu.find("ul[id='"+firstStr+"']").find("a[href='"+"/"+firstStr+"/"+lastStr+"']").parents("#panel").prev().attr("class", "active");
				sideMenu.find("ul[id='"+firstStr+"']").find("a[href='"+"/"+firstStr+"/"+lastStr+"']").parents("#panel").prev().find("#slideSpan").text("-");
				sideMenu.find("ul[id='"+firstStr+"']").find("a[href='"+"/"+firstStr+"/"+lastStr+"']").parents("#panel").attr("class", "active");
				sideMenu.find("ul[id='"+firstStr+"']").find("a[href='"+"/"+firstStr+"/"+lastStr+"']").attr("class", "active");
				break;
			}
	
			i++;
		}
	}
}

//사이드 메뉴 클릭
function bodyTopPageClick(e){
	let id = $(e).attr("data-keyword");
	
	$("#mainTopMenu ul li button").removeAttr("class");
	$(e).attr("class", "active");
	
	$("#sideMenu").find("ul").not("#panel").removeAttr("class");
	$("#sideMenu").find("#" + id).attr("class", "active");
}

//header active 여부에 따라 사이드메뉴 active 적용
function readyTopPageActive(){
	let sideMenu = null, mainTopMenu = null;

	mainTopMenu = $("#mainTopMenu");
	sideMenu = $("#sideMenu");

	mainTopMenu.find("ul li button").each(function(index, item){
		if($(item).attr("class") === "active"){
			sideMenu.find("ul").not("[id='"+$(item).attr("data-keyword")+"']").removeAttr("class");
			sideMenu.find("ul[id='"+$(item).attr("data-keyword")+"']").attr("class", "active");
		}
	});
}

//기본 그리드
function createGrid(gridContainer, headerDataArray, dataArray, ids, fnc, idName){
	let gridHtml = "", gridContents, idStr;

	ids = (ids === undefined) ? 0 : ids;
	fnc = (fnc === undefined) ? "" : fnc;
	
	if(idName === undefined){
		idStr = "gridContent";
	}else{
		idStr = idName;
	}

	gridHtml = "<div class='gridHeader grid_default_header_item'>";
	
	for(let i = 0; i < headerDataArray.length; i++){
		if(headerDataArray[i].align === "center"){
			gridHtml += "<div class='gridHeaderItem grid_default_text_align_center'>"+headerDataArray[i].title+"</div>";
		}else if(headerDataArray[i].align === "left"){
			gridHtml += "<div class='gridHeaderItem grid_default_text_align_left'>"+headerDataArray[i].title+"</div>";
		}else{
			gridHtml += "<div class='gridHeaderItem grid_default_text_align_right'>"+headerDataArray[i].title+"</div>";
		}
	}

	gridHtml += "</div>";
	for(let i = 0; i < dataArray.length; i++){
		gridHtml += "<div id='"+idStr+"_grid_"+i+"' class='gridContent grid_default_body_item' data-drag=\"true\" data-id='"+ids[i]+"' onclick='"+fnc+"'>";
		for(let t = 0; t <= dataArray[i].length; t++){
			if(dataArray[i][t] !== undefined){
				gridHtml += "<div class='gridContentItem'>"+dataArray[i][t].setData+"</div>";
			}
		}
		gridHtml += "</div>";
	}

	gridContainer.html(gridHtml);

	if(idName === undefined){
		gridContents = $(".gridContent");
	}else{
		gridContents = $("#" + idName + " div .gridContent");
	}

	for(let i = 0; i < headerDataArray.length; i++){
		gridContents.each(function(index, item){
			if(headerDataArray[i].align === "center"){
				$(item).find(".gridContentItem").eq(i).attr("class", "gridContentItem grid_default_text_align_center");
			}else if(headerDataArray[i].align === "left"){
				$(item).find(".gridContentItem").eq(i).attr("class", "gridContentItem grid_default_text_align_left");
			}else{
				$(item).find(".gridContentItem").eq(i).attr("class", "gridContentItem grid_default_text_align_right");
			}
		});
	}
}

//날짜 포맷
function dateFnc(dateTimeStr, type){
	let result, year, month, day, hh, mm, ss, date;
	date = new Date(dateTimeStr*1);
	year = date.getFullYear();
	month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	day = (date.getDate()) < 10 ? "0" + date.getDate() : date.getDate();
	hh = date.getHours();
	mm = date.getMinutes();
	ss = date.getSeconds();
	
	if(dateTimeStr === undefined || dateTimeStr === null){
		return "";
	}

	if(type === undefined){
		type = "yyyy-mm-dd";
	}

	if(type === "yyyy-mm-dd"){
		result = year + "-" + month + "-" + day;
	}else if(type === "yyyy-mm"){
		result = year + "-" + month;
	}else if(type === "mm-dd"){
		result = month + "-" + day;
	}else if(type === "yyyy-mm-dd HH:mm:ss"){
		result = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
	}else if(type === "HH:mm:ss"){
		result = hh + ":" + mm + ":" + ss;
	}else if(type === "HH:mm"){
		result = hh + ":" + mm;
	}else if(type === "mm:ss"){
		result = mm + ":" + ss;
	}

	return result;
}

function dateDis(created, modified){
	let result;

	if(created === undefined){
		created = null;
	}else if(modified === undefined){
		modified = null;
	}

	if(created !== null && modified !== null){
		result = modified;
	}else if(created === null && modified !== null){
		result = modified;
	}else if(created !== null && modified === null){
		result = created;
	}

	return result;
}

function modalClose(){
	modal.hide();
}

function modalClear(){
	modal.clear();
}

// 페이징 만드는 함수
function createPaging(container, max, eventListener, fncStr, current, nextCount, forwardStep){
	let x = 0, page, html = ["", "", "", ""];
	if(container == undefined){
		console.log("[createPaging] Paging container is Empty.");
		return false;
	}else if(!classType(container).includes("Element")){
		console.log("[createPaging] Container is Not Html Element.");
		return false;
	}else if(isNaN(max) || max === "" || max < 1){
		console.log("[createPaging] max value is abnormal.");
		return false;
	}else if(eventListener === undefined){
		console.log("[createPaging] Click event listener unavailable.");
		return false;
	}

	if(current === undefined) current = 1;
	if(nextCount === undefined)	nextCount = 3;
	if(forwardStep === undefined) forwardStep = 10;

	html[1] = "<div class=\"paging_cell paging_cell_current\">" + current + "</div>";

	for(page = current - 1 ; page >= current - nextCount && page > 0; page--){
		html[1] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>" + html[1];
	}

	if(page === 1){
		html[0] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>";
	}else if(page > 1){
		if(current - forwardStep > 1){
			html[0] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + (current - forwardStep) + ", " + fncStr + ")\">&laquo;</div>";
		}
		html[0] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(1, " + fncStr + ")\">1</div>" + html[0];
	}else{
		html[0] = undefined;
	}

	for(page = current + 1 ; page <= (current + nextCount) && page <= max ; page++){
		html[1] = html[1] + "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>";
	}

	if(page === max){
		html[2] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + page + ", " + fncStr + ")\">" + page + "</div>";
	}else if(page < max){
		if(current + forwardStep < max){
			html[2] = "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + (current + forwardStep) + ", " + fncStr + ")\">&raquo;</div>";
		}
		html[2] = html[2] + "<div class=\"paging_cell\" onclick=\"" + eventListener + "(" + max + ", " + fncStr + ")\">" + max + "</div>";
	}else html[2] = undefined;

	html[3] = html[1];
	if(html[0] !== undefined) html[3] = html[0] + "<div class=\"paging_cell_empty\">...</div>" + html[1];
	if(html[2] != undefined) html[3] = html[3] + "<div class=\"paging_cell_empty\">...</div>" + html[2];
	
	return html[3];
} // End of createPaging

function pageMove(page, drawFnc) {
	let selectedPage = parseInt(page);
	storage.currentPage = selectedPage;
	drawFnc();
}

// 데이터 타입 확인 하수
function classType(obj){
	return obj == undefined ? obj : Object.prototype.toString.call(obj).slice(8, -1);
} // End of classType()

// API 서버에서 직원 정보를 가져오는 함수
function getUserMap(){
	let url;

	url = apiServer + "/api/user/map";

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
				storage.user = list;
				console.log("[getUserMap] Success getting employee information.");
			} else {
				msg.set("직원 정보를 가져오지 못했습니다.");
			}
		}
	})
} // End of getUserMap()

// API 서버에서 직원 정보를 가져오는 함수
function getDeptMap(){
	let url;

	url = apiServer + "/api/dept/map";

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
				storage.dept = list;
				console.log("[getDeptMap] Success getting department information.");
			} else {
				msg.set("부서 정보를 가져오지 못했습니다.");
			}
		}
	})
} // End of getDeptMap()

// API 서버에서 고객사 정보를 가져오는 함수
function getCustomer(){
	let url;

	url = apiServer + "/api/system/customer";

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
				storage.customer = list;
				console.log("[getCustomer] Success getting customer information.");
			} else {
				msg.set("고객 정보를 가져오지 못했습니다.");
			}
		}
	})
} // End of getCustomer()

// API 서버에서 회사 및 사용자 사번을 정보를 가져오는 함수
function getBasicInfo(){
	let url;

	url = apiServer + "/api/system/basic";

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
				storage.company = list.company;
				storage.my = list.my;
				console.log("[getBasicInfo] Success getting basic information.");
			} else {
				msg.set("기본 정보를 가져오지 못했습니다.");
			}
		}
	})
} // End of getBasicInfo()

// API 서버에서 코드 정보를 가져오는 함수
function getCommonCode(){
	let url;

	url = apiServer + "/api/system/code";

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
				storage.code = list;
				console.log("[getCommonCode] Success getting Common code list.");
			} else {
				msg.set("코드 정보를 가져오지 못했습니다.");
			}
		}
	});
} // End of getDeptMap()

//파일 dropzone class 변경
function toggleClass(className){
	let list = ["dragenter", "dragleave", "dragover", "drop"];
	let dropZone = $(".dropZone");

	for(let i = 0; i < list.length; i++){
		if(className === list[i]){
			dropZone.addClass("dropZone_" + list[i]);
		}else{
			dropZone.removeClass("dropZone_" + list[i]);
		}
	}
}

//파일 drag show 샘플
function showFile(files){
	let dropZone = $(".dropZone");
	dropZone.innerHTML = "";

	for(let i = 0; i < files.length; i++){
		dropZone.html("<p>" + files[i].name + "</p>");
	}
}

//drag 최상위 부모 클래스 전달
function enableDragSort(listClass) {
	let sortableLists = document.getElementsByClassName(listClass);
	Array.prototype.map.call(sortableLists, (list) => {enableDragList(list)});
}
  
//drag 자식 클래스 전달
function enableDragList(list) {
	Array.prototype.map.call(list.children, (item) => {enableDragItem(item)});
}

//자식 클래스 draggable, ondrag, ondragend 기능 적용
function enableDragItem(item) {
	item.setAttribute('draggable', true);
	item.ondrag = handleDrag;
	item.ondragend = handleDrop;
}

//drag 기능
function handleDrag(item) {
	let selectedItem, tempEl, currentEl, x, t;

	currentEl = item.target;
	tempEl = currentEl;
	while(true){
		if(tempEl === document.body) break;
		if(tempEl.dataset.drag === "true"){
			selectedItem = tempEl;
			break;
		}else tempEl = tempEl.parentElement;
	}

	if(selectedItem === undefined) return;

	list = selectedItem.parentNode;
	x = item.clientX;
	y = item.clientY + (Math.floor(selectedItem.clientHeight)/2);

	selectedItem.classList.add('dragActive');
	let swapItem = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);

	tempEl = swapItem;

	while(true){
		if(tempEl === document.body) break;
		if(tempEl.dataset.drag === "true"){
			swapItem = tempEl;
			break
		}else tempEl = tempEl.parentElement;
	}

	list.insertBefore(selectedItem, swapItem);
}

//drop 기능
function handleDrop(item) {
	item.target.classList.remove('dragActive');
}

//페이지네이션에 필요한 계산 공통함수
function paging(total, currentPage, articlePerPage){
	let lastPage, result = [], max;

	if (currentPage === undefined) {
		storage.currentPage = 1;
		currentPage = storage.currentPage;
	}
	
	if (articlePerPage === undefined) {
		storage.articlePerPage = 5;
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

// function inputClick(e){
// 	let ele, auto;

// 	ele = $(e);
// 	auto = ele.parents("div").find("#autoDiv");

// 	if(ele.attr("type") === "text" && ele.data("keyup") !== "" && ele.data("keyup") !== undefined){
// 		auto.remove();
// 		ele.after("<datalist id='autoDiv'></datalist>");
// 	}
// }

// function inputTextKeyup(e){
// 	let text, jsonData, auto, ele, dataKey;

// 	ele = $(e);
// 	text = ele.val();
// 	auto = ele.parents("div").find("#autoDiv");
// 	dataKey = ele.data("keyup");
// 	auto.html("");
	
// 	jsonData = storage[dataKey];

// 	for(let key in jsonData){
// 		if(ele.val() !== ""){
// 			if(jsonData[key].name.indexOf(text) > -1){
// 				auto.append("<option value='"+jsonData[key].name+"'></option>");
// 			}
// 			auto.show();
// 		}else{
// 			auto.html("");
// 			auto.hide();
// 		}
// 	}
// }

//자동완성
function inputDataList(){
	setTimeout(() => {
		let input, jsonData;

		input = $(document).find("input[type='text']");

		input.each((index, item) => {
			let dataKey = $(item).data("keyup");
			
			if($(item).data("keyup") !== undefined){
				$(item).attr("list", "_" + $(item).attr("id"));
				$(item).after("<datalist id='_" + $(item).attr("id") + "'></datalist>");

				if(storage[dataKey] !== undefined){
					jsonData = storage[dataKey];
					
					for(let key in jsonData){
						if($(item).data("keyup") === "user"){
							$(item).parents("div").find("datalist#_" + $(item).attr("id")).append("<option data-value='" + key + "' value='" + jsonData[key].userName + "'></option>");
						}else if($(item).data("keyup") === "customer"){
							$(item).parents("div").find("datalist#_" + $(item).attr("id")).append("<option data-value='" + key + "' value='" + jsonData[key].name + "'></option>");
						}
					}
				}else{
					if($(item).data("keyup") === "sopp"){
						$.ajax({
							url: "/api/sopp",
							method: "get",
							dataType: "json",
							success:(result) => {
								if(result.result === "ok"){
									let resultJson;
									resultJson = cipher.decAes(result.data);
									resultJson = JSON.parse(resultJson);
									
									for(let i = 0; i < resultJson.length; i++){
										$(item).parents("div").find("datalist#_" + $(item).attr("id")).append("<option data-value='" + resultJson[i].no + "' value='" + resultJson[i].title + "'></option>");
									}
								}
							},
							error:() => {
								msg.set("sopp 에러");
							}
						});
					}
				}
			}
		});
	}, 700);
}

//숫자 포맷
function numberFormat(num){
	if(num !== undefined){
		let setNumber;
		setNumber = parseInt(num).toLocaleString("en-US");
		return setNumber;
	}else{
		return "format undefined";
	}
}

//input text keyup 숫자포맷
function inputNumberFormat(e){
	let value;
	value = $(e).val().replaceAll(",", "");

	$(e).val(parseInt(value).toLocaleString("en-US"));	
}

//임시 crud 폼
function detailViewFormModal(data){
	let html = "";

	html = "<div class='defaultFormContainer'>";

	for(let i = 0; i < data.length; i++){
		let dataTitle = (data[i].title === undefined) ? "" : data[i].title;
		let dataValue = (data[i].value === undefined) ? "" : data[i].value;
		let dataDisabled = (data[i].disabled === undefined) ? true : data[i].disabled;
		let dataType = (data[i].type === undefined) ? "text" : data[i].type;
		let dataKeyup = (data[i].dataKeyup === undefined) ? "" : data[i].dataKeyup;
		let dataKeyupEvent = (data[i].keyup === undefined) ? "" : data[i].keyup;
		let elementId = (data[i].elementId === undefined) ? "" : data[i].elementId;
		let elementName = (data[i].elementName === undefined) ? "" : data[i].elementName;
		let dataChangeEvent = (data[i].onChange === undefined) ? "" : data[i].onChange;
		let dataClickEvent = (data[i].onClick === undefined) ? "" : data[i].onClick;
		let userId = (data[i].userId === undefined) ? "" : data[i].userId;

		html += "<div class='defaultFormLine'>";
		html += "<div class='defaultFormSpanDiv'>";
		html += "<span class='defaultFormSpan'>" + dataTitle + "</span>";
		html += "</div>";
		html += "<div class='defaultFormContent'>";

		if(dataType === "text"){
			if(dataDisabled == true){
				html += "<input type='text' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "' data-keyup='" + dataKeyup + "' data-user-id='" + userId + "' onchange='" + dataChangeEvent + "' onclick='" + dataClickEvent + "' onkeyup='" + dataKeyupEvent + "' disabled='" + dataDisabled + "'>";
			}else{
				html += "<input type='text' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "' data-keyup='" + dataKeyup + "' data-user-id='" + userId + "' onchange='" + dataChangeEvent + "' onclick='" + dataClickEvent + "' onkeyup='" + dataKeyupEvent + "'>";
			}
		}else if(dataType === "textarea"){
			html += "<textarea>" + dataValue + "</textarea>";
		}else if(dataType === "radio"){
			for(let t = 0; t < data[i].radioValue.length; t++){
				if(dataDisabled == true){
					html += "<input type='radio' id='" + elementId + "' name='" + elementName + "' value='" + data[i].radioValue[t].key + "' disabled='" + dataDisabled + "' onclick='" + dataClickEvent + "'><label>" + data[i].radioValue[t].value + "</label>" + " ";
				}else{
					html += "<input type='radio' id='" + elementId + "' name='" + elementName + "' value='" + data[i].radioValue[t].key + "' onclick='" + dataClickEvent + "'><label>" + data[i].radioValue[t].value + "</label>" + " ";
				}
			}
		}else if(dataType === "date"){
			if(dataDisabled == true){
				html += "<input type='date' max='9999-12-31' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "' disabled='" + dataDisabled + "'>";
			}else{
				html += "<input type='date' max='9999-12-31' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "'>";
			}
		}else if(dataType === "select"){
			if(dataDisabled == true){
				html += "<select id='" + elementId + "' name='" + elementName + "' disabled='" + dataDisabled + "'>";
			}else{
				html += "<select id='" + elementId + "' name='" + elementName + "'>";
			}
			for(let t = 0; t < data[i].selectValue.length; t++){
				html += "<option value='" + data[i].selectValue[t].key + "'>" + data[i].selectValue[t].value + "</option>";
			}

			html += "</select>";
		}else if(dataType === "file"){
			html += "<input type='file' id='" + elementId + "' name='" + elementName + "' onchange='fileChange();' multiple>";
		}
		
		html += "</div>";
		html += "</div>";
	}

	html += "</div>";

	return html;
}

function detailViewForm(data){
	let html = "";

	html = "<div class='detailViewContainer tabContent' id='tabContentAll'>";

	for(let i = 0; i < data.length; i++){
		let dataTitle = (data[i].title === undefined) ? "" : data[i].title;
		let dataValue = (data[i].value === undefined) ? "" : data[i].value;

		html += "<div class='detailViewForm'>";
		html += "<div class='detailViewFormSpanDiv'>";
		html += "<span class='detailViewFormSpan'>" + dataTitle + ": </span>";
		html += "</div>";
		html += "<div class='detailViewFormContent'>" + dataValue + "</div>";
		html += "</div>";
	}

	html += "</div>";

	return html;
}

//tinyMCE
function setTiny(){
	let plugins = [
		"advlist", "autolink", "lists", "link", "image", "charmap", "print", "preview", "anchor",
		"searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table",
		"paste", "code", "help", "wordcount", "save"
	];
	
	let edit_toolbar = 'formatselect fontselect fontsizeselect |'
		   + ' forecolor backcolor |'
		   + ' bold italic underline strikethrough |'
		   + ' alignjustify alignleft aligncenter alignright |'
		   + ' bullist numlist |'
		   + ' table tabledelete |'
		   + ' link image';
	
	tinymce.init({
		language: "ko_KR",
		menubar: false,
		plugins: plugins,
		toolbar: edit_toolbar,
		selector: 'textarea',
		height : "200",
	});
}

function dataListFormat(id, value){
	let result;

	result = $(document).find("datalist#_" + id + " option[value='" + value + "']").data("value");

	if(result === undefined){
		return "";
	}else{
		return result;
	}
}

// crud tab 클릭 함수
function tabItemClick(e){
	setTimeout(() => {
		modal.tabs.content.hide();

		if($(e).data("content-id") === "tabContentAll"){
			modal.confirm.show();
			modal.close.show();
			modal.content.css("width", "50%");
			modal.confirm.text("수정");
			modal.close.text("취소");
		}else if($(e).data("content-id") === "tabTradeList"){
			modal.confirm.show();
			modal.close.show();
			modal.content.css("width", "90%");
			modal.confirm.text("분할추가");
			modal.close.text("추가");
		}else{
			modal.content.css("width", "80%");
			modal.confirm.hide();
			modal.close.hide();
		}

		if($(e).data("first-fnc") === undefined){
			modal.confirm.attr("onclick", "");
		}else{
			modal.confirm.attr("onclick", $(e).data("first-fnc"));
		}

		if($(e).data("second-fnc") === undefined){
			modal.close.attr("onclick", "");
		}else{
			modal.close.attr("onclick", $(e).data("second-fnc"));
		}

		$(document).find("#" + $(e).data("content-id")).show();
	}, 300);
}

function createTabTradeList(){
	let html = "";

	html = "<div class='tradeList' id='tabTradeList'>";

	html += "<div class='tradeFirstTitle'>";
	html += "<div class='tradeFirstTitleItem'>구분(매입/매출)</div>";
	html += "<div class='tradeFirstTitleItem'>거래일자</div>";
	html += "<div class='tradeFirstTitleItem'>분할횟수</div>";
	html += "<div class='tradeFirstTitleItem'>단위(개월)</div>";
	html += "<div class='tradeFirstTitleItem'>계약금액</div>";
	html += "<div class='tradeFirstTitleItem'>거래처(매입/매출처)</div>";
	html += "<div class='tradeFirstTitleItem'>항목</div>";
	html += "</div>";

	html += "<div class='tradeFirstFormContent'>";
	html += "<div class='tradeFirstContentItem'>";
	html += "<select>"
	html += "<option value='매입'>매입</option>";
	html += "<option value='매출'>매출</option>";
	html += "</select>";
	html += "</div>"
	html += "<div class='tradeFirstContentItem'>";
	html += "<input type='date' />";
	html += "</div>";
	html += "<div class='tradeFirstContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "<div class='tradeFirstContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "<div class='tradeFirstContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "<div class='tradeFirstContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "<div class='tradeFirstContentItem'>";
	html += "<div>";
	html += "<select>";
	html += "<option value='항목선택'>항목선택</option>";
	html += "<option value='직접입력'>직접입력</option>";
	html += "</select>";
	html += "</div>";
	html += "<div>";
	html += "<input type='text' />";
	html += "</div>";
	html += "</div>";
	html += "</div>";

	html += "<div class='tradeSecondFormTitle'>";
	html += "<div class='tradeSecondTitleItem'>단가</div>";
	html += "<div class='tradeSecondTitleItem'>수량</div>";
	html += "<div class='tradeSecondTitleItem'>공급가</div>";
	html += "<div class='tradeSecondTitleItem'>부가세</div>";
	html += "<div class='tradeSecondTitleItem'>합계금액</div>";
	html += "<div class='tradeSecondTitleItem'>승인번호</div>";
	html += "<div class='tradeSecondTitleItem'>적요</div>";
	html += "</div>";

	html += "<div class='tradeSecondFormContent'>";
	html += "<div class='tradeSecondContentItem'>";
	html += "<input type='text' />";
	html += "</div>"
	html += "<div class='tradeSecondContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "<div class='tradeSecondContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "<div class='tradeSecondContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "<div class='tradeSecondContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "<div class='tradeSecondContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "<div class='tradeSecondContentItem'>";
	html += "<input type='text' />";
	html += "</div>";
	html += "</div>";

	html += "<div class='tradeThirdFormTitle'>";
	html += "<div class='tradeThirdTitleItem'>구분(등록/수정일)</div>";
	html += "<div class='tradeThirdTitleItem'>거래처(매입/매출처)</div>";
	html += "<div class='tradeThirdTitleItem'>항목</div>";
	html += "<div class='tradeThirdTitleItem'>단가</div>";
	html += "<div class='tradeThirdTitleItem'>수량</div>";
	html += "<div class='tradeThirdTitleItem'>부가세액</div>";
	html += "<div class='tradeThirdTitleItem'>공급가액</div>";
	html += "<div class='tradeThirdTitleItem'>금액</div>";
	html += "<div class='tradeThirdTitleItem'>비고</div>";
	html += "<div class='tradeThirdTitleItem'>승인번호</div>";
	html += "<div class='tradeThirdTitleItem'>수정</div>";
	html += "<div class='tradeThirdTitleItem'>삭제</div>";
	html += "</div>";
	html += "<div class='tradeThirdFormContent'>";

	// $.ajax({
	// 	url: "/api/trade",
	// 	method: "get",
	// 	async: false,
	// 	dataType: "json",
	// 	contentType: "text/plan",
	// 	success:(result) => {
	// 		if(result.result === "ok"){
	// 			let jsonData;
	// 			jsonData = cipher.decAes(result.data);
	// 			jsonData = JSON.parse(jsonData);

	// 			html += "<div class='tradThirdContentItem'>";
	
	// 			for(let i = 0; i < jsonData.length; i++){
	// 				html += "<div class='tradeThirdContentList'>";
	// 				html += "<div>" + jsonData[i].no + "</div>";
	// 				html += "</div>";
	// 			}
	
	// 			html += "</div>";
	// 		}
	// 	}
	// });

	html += "</div>";
	html += "<div class='tradeThirdContentCal_1'>";
	html += "</div>";
	html += "<div class='tradeThirdContentCal_2'>";
	html += "</div>";
	html += "</div>";

	html += "</div>";

	return html;
}

function createTabEstList(){
	let html = "", container, header = [], data = [], str, detailContainer;

	detailContainer = $(document).find(".detailContainer");

	html = "<div class='tabEstList' id='tabEstList'>";
	html += "</div>";
	
	header = [
		{
			"title" : "견적일자",
			"align" : "center",
		},
		{
			"title" : "작성자",
			"align" : "center",
		},
		{
			"title" : "견적번호",
			"align" : "center",
		},
		{
			"title" : "견적명",
			"align" : "left",
		},
		{
			"title" : "거래처",
			"align" : "center",
		},
		{
			"title" : "공급가합계",
			"align" : "right",
		},
		{
			"title" : "부가세합계",
			"align" : "right",
		},
		{
			"title" : "금액",
			"align" : "right",
		},
		{
			"title" : "적요",
			"align" : "left",
		},
	]
	
	detailContainer.find(".detailContent").append(html);
	container = detailContainer.find(".detailContent .tabEstList");

	str = [
		{
			"setData": "test1",
		},
		{
			"setData": "test2",
		},
		{
			"setData": "test3",
		},
		{
			"setData": "test4",
		},
		{
			"setData": "test5",
		},
		{
			"setData": "test6",
		},
		{
			"setData": "test7",
		},
		{
			"setData": "test8",
		},
		{
			"setData": "test9",
		}
	];

	data.push(str);

	setTimeout(() => {
		createGrid(container, header, data);
	}, 100);
}

function createTabTechList(){
	let html = "";

	html = "<div class='tabTechist'>";
	html += "<div class='tabTechHeader'>";
	html += "<div>견적일자</div>";
	html += "<div>작성자</div>";
	html += "<div>견적번호</div>";
	html += "<div>견적명</div>";
	html += "<div>거래처</div>";
	html += "<div>공급가합계</div>";
	html += "<div>부가세합계</div>";
	html += "<div>금액</div>";
	html += "<div>적요</div>";
	html += "</div>";

	$.ajax({
		url: "/api/tech",
		method: "get",
		async: false,
		dataType: "json",
		contentType: "text/plan",
		success:(result) => {
			if(result.result === "ok"){
				let jsonData;
				jsonData = cipher.decAes(result.data);
				jsonData = JSON.parse(jsonData);

				html += "<div class='tabTechBody'>";
	
				for(let i = 0; i < jsonData.length; i++){
					html += "<div>" + jsonData[i].no + "</div>";
				}
	
				html += "</div>";
			}
		}
	});

	html += "</div>";

	setTimeout(() => {
		modal.body.append(html);
	}, 100);
}

function createTabSalesList(){
	let html = "";

	html = "<div class='tabSalesist'>";
	html += "<div class='tabSalesHeader'>";
	html += "<div>견적일자</div>";
	html += "<div>작성자</div>";
	html += "<div>견적번호</div>";
	html += "<div>견적명</div>";
	html += "<div>거래처</div>";
	html += "<div>공급가합계</div>";
	html += "<div>부가세합계</div>";
	html += "<div>금액</div>";
	html += "<div>적요</div>";
	html += "</div>";

	$.ajax({
		url: "/api/sales",
		method: "get",
		async: false,
		dataType: "json",
		contentType: "text/plan",
		success:(result) => {
			if(result.result === "ok"){
				let jsonData;
				jsonData = cipher.decAes(result.data);
				jsonData = JSON.parse(jsonData);

				html += "<div class='tabSalesBody'>";
	
				for(let i = 0; i < jsonData.length; i++){
					html += "<div>" + jsonData[i].no + "</div>";
				}
	
				html += "</div>";
			}
		}
	});

	html += "</div>";

	setTimeout(() => {
		modal.body.append(html);
	}, 100);
}

function detailContainerHide(){
	$(document).find(".detailContainer").hide();
}

function customerChange(e){
	let getCustNumber;
	getCustNumber = dataListFormat("customer", $(e).val());

	$(document).find("#" + $(e).data("user-id")).val(storage.customer[getCustNumber].ceoName);
}

function sizeToStr(s){
    let result, t, r;
    r = 1024;
    if(s === undefined || s === null || isNaN(s) || s === "")   return s;
    if(s < r) return s + "b";
    s = Math.floor(s / 102.4) / 10;
    if(s < r) return s + "kb";
    s = Math.floor(s / 102.4) / 10;
    if(s < r) return s + "mb";
    s = Math.floor(s / 102.4) / 10;
    return s + "gb";
}
