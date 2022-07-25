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
	storage = {
		"drag": {x: 0, y: 0}
	};
	
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
			},100);
			modal.wrap.css('display','flex').hide().fadeIn();
		},
		"hide": () => {
			modal.clear();
			modal.wrap.fadeOut();
		},
		clear: () => {
			modal.headTitle.text("");
			modal.body.html("");
			modal.confirm.show();
			modal.close.show();
			modal.footBtns.css("width", "49%");
			modal.confirm.text("확인");
			modal.close.text("닫기");
		},
	}

	dragAndDrop = {
		// "dragStart": (e) => {
		// 	e.dataTransfer.setData("text", e.target.id);
		// },

		// "dragEnd": (e) => {
		// 	$(e.target).prev().css("background-color", "");
		// },

		// "dragEnter": (e) => {
		// 	$(e.target).css("background-color", "#EAEAEA");
		// },

		// "dragLeave": (e) => {
		// 	$(e.target).css("background-color", "");
		// },

		// "dragOver": (e) => {
		// 	$(e.target).css("background-color", "#EAEAEA");
		// 	e.preventDefault();
		// },

		// "dragDrop": (e) => {
		// 	$(e.target).after($("#" + e.dataTransfer.getData("text")));
		// 	e.preventDefault();
		// },

		// "gridDragStart": (e) => {
		// 	e.dataTransfer.setData("text", e.target.id);
		// },

		// "gridDragEnd": (e) => {
		// 	$(e.target).prev().css("background-color", "");
		// },

		// "gridDragEnter": (e) => {
		// 	$(e.target).parent().css("background-color", "#EAEAEA");
		// },

		// "gridDragLeave": (e) => {
		// 	$(e.target).parent().css("background-color", "");
		// },

		// "gridDragOver": (e) => {
		// 	$(e.target).parent().css("background-color", "#EAEAEA");
		// 	e.preventDefault();
		// },

		// "gridDrop": (e) => {
		// 	$(e.target).parent().after($("#" + e.dataTransfer.getData("text")));
		// 	e.preventDefault();
		// },

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
		"defaultAjax": (url, method, data, successFnc, errorFnc) => {
			$.ajax({
				url: url,
				method: method,
				data: data,
				dataType: "json",
				success: () => {
					if(successFnc !== undefined){
						successFnc();
					}
				},
				error: () => {
					if(errorFnc !== undefined){
						errorFnc();
					}
				}
			})
		}
	}

	cipher.aes.key = sessionStorage.getItem("aesKey");
	cipher.aes.iv = sessionStorage.getItem("aesIv");
	msg.cnt = document.getElementsByClassName("msg_cnt")[0];

	$("#sideMenu").find("ul:not(#panel) li a").click(function(){
		if($(this).attr("class") !== "active"){
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
	setTiny();
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
	})
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

//tinyMCE
function setTiny(){
	var plugins = [
		"advlist", "autolink", "lists", "link", "image", "charmap", "print", "preview", "anchor",
		"searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table",
		"paste", "code", "help", "wordcount", "save"
	];
	
	var edit_toolbar = 'formatselect fontselect fontsizeselect |'
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