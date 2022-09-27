let cipher, msg, apiServer, modal, storage, fileDataArray = [], removeDataArray = [], updateDataArray = [];
storage = {};

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
	
	getCommonCode();
	getUserMap();
	getDeptMap();
	getBasicInfo();
	getCustomer();
	getUserRank();
		
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
	
	tiny = {
		options: {
			language: "ko_KR",
			menubar: false,
			plugins: ["advlist", "autolink", "lists", "link", "image", "charmap", "print", "preview", "anchor","searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table","paste", "code", "help", "wordcount", "save"],
			toolbar: "formatselect fontselect fontsizeselect | forecolor backcolor | bold italic underline strikethrough | alignjustify alignleft aligncenter alignright | bullist numlist | table tabledelete | link image",
			selector: "textarea",
			width: "100%",
			height : "200",
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
			selectFile(files);
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
	
	
	setTimeout(() => {
		setTiny();
		menuActive();
	}, 100);
	
	$(document).mouseup((e) => {
		if(modal.content.has(e.target).length === 0){
			modal.hide();
		}
	})

	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined || storage.user === undefined){
		window.setTimeout(headerMyInfo, 1500);
	}else{
		window.setTimeout(headerMyInfo, 200);
	}
}

// 위젯 관련 세팅 및 기본설정
storage.widget = {};
storage.widget.chart = [
    {
        "size":[2,1],
        "type":"bar",
        "period":"monthly",
        "content":["sales/total","goal/total", "sales/cumulative", "goal/cumulative"]
    },
    {
        "size":[1,1],
        "type":"pie",
        "period":"yearly",
        "content":["sales/cumulative", "goal/cumulative"]
    }
];
storage.widget.schedule = [
    {
        "size":[2,1],
        "type":"list"
    },
    {
        "size":[4,1],
        "type":"calendar/weekly"
    },
    {
        "size":[4,2],
        "type":"calendar/monthly"
    },
    {
        "size":[2,1],
        "type":"calendar/yearly"
    },
    {
        "size":[2,1],
        "type":"calendar/daily"
    }
]
storage.widget.docApp = [
    {
        "size":[4,1],
        "type":"tile",
        "content":"wait"
    },
    {
        "size":[2,1],
        "type":"list",
        "content":"wait"
    },
    {
        "size":[4,1],
        "type":"tile",
        "content":"mydraft"
    },
    {
        "size":[2,1],
        "type":"list",
        "content":"due"
    }
]
storage.widget.notice = [
    {
        "size":[2,1],
    }
];
storage.widget.sopp = [
    {
        "size":[2,1],
        "type":"list"
    },
    {
        "size":[4,1],
        "type":"tile"
    }
];
storage.widget.set = [
    "chart/0",
    "notice/0",
    "docApp/1"
];

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
	}else if(pathName === "mypage"){
		mainTopMenu.find("ul li button").removeAttr("class");
		mainTopMenu.find("ul li button").eq(0).attr("class", "active");

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
function createGrid(gridContainer, headerDataArray, dataArray, ids, job, fnc, idName){
	let gridHtml = "", gridContents, idStr;

	ids = (ids === undefined) ? 0 : ids;
	fnc = (fnc === undefined) ? "" : fnc;
	job = (job === undefined) ? "" : job;
	
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
		gridHtml += "<div id='"+idStr+"_grid_"+i+"' class='gridContent grid_default_body_item' data-drag=\"true\" data-id='"+ids[i]+"' data-job='"+job[i]+"' onclick='"+fnc+"'>";
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
	let url, userMapTime, userMapData;

	url = apiServer + "/api/user/map";
	userMapTime = sessionStorage.getItem("userMapTime");
	userMapTime = userMapTime == null ? 0 : userMapTime * 1;
	if((new Date()).getTime() < userMapTime + 600000){
		userMapData = sessionStorage.getItem("userMapData");
		userMapData = JSON.parse(userMapData);
		storage.user = userMapData;
		console.log("[getUserMap] set user data from sessionStorage.");
	}else{
		$.ajax({
			"url": url,
			"method": "get",
			"dataType": "json",
			"cache": false,
			success: (data) => {
				let list;
	
				if (data.result === "ok") {
					list = cipher.decAes(data.data);
					sessionStorage.setItem("userMapData", list);
					sessionStorage.setItem("userMapTime", (new Date()).getTime() + "");
					list = JSON.parse(list);
					storage.user = list;
					console.log("[getUserMap] Success getting employee information.");
				} else {
					msg.set("직원 정보를 가져오지 못했습니다.");
				}
			}
		})
	}
} // End of getUserMap()

// API 서버에서 직원 정보를 가져오는 함수
function getDeptMap(){
	let url, deptMapData, deptMapTime;

	url = apiServer + "/api/dept/map";
	deptMapTime = sessionStorage.getItem("deptMapTime");
	deptMapTime = deptMapTime == null ? 0 : deptMapTime * 1;
	if((new Date()).getTime() < deptMapTime + 600000){
		deptMapData = sessionStorage.getItem("deptMapData");
		deptMapData = JSON.parse(deptMapData);
		storage.dept = deptMapData;
		console.log("[getUserMap] set dept data from sessionStorage.");
	}else{
		$.ajax({
			"url": url,
			"method": "get",
			"dataType": "json",
			"cache": false,
			success: (data) => {
				let list;
				if (data.result === "ok") {
					list = cipher.decAes(data.data);
					sessionStorage.setItem("deptMapData", list);
					sessionStorage.setItem("deptMapTime", (new Date()).getTime() + "");
					list = JSON.parse(list);
					storage.dept = list;
					console.log("[getDeptMap] Success getting department information.");
				} else {
					msg.set("부서 정보를 가져오지 못했습니다.");
				}
			}
		});
	}
} // End of getDeptMap()

// API 서버에서 고객사 정보를 가져오는 함수
function getCustomer(){
	let url, customerTime, customerData;

	url = apiServer + "/api/system/customer";
	customerTime = sessionStorage.getItem("customerTime");
	customerTime = customerTime == null ? 0 : customerTime * 1;
	if((new Date()).getTime() < customerTime + 600000){
		customerData = sessionStorage.getItem("customerData");
		customerData = JSON.parse(customerData);
		storage.customer = customerData;
		console.log("[getUserMap] set customer data from sessionStorage.");
	}else{
		$.ajax({
			"url": url,
			"method": "get",
			"dataType": "json",
			"cache": false,
			success: (data) => {
				let list;	
				if (data.result === "ok") {
					list = cipher.decAes(data.data);
					sessionStorage.setItem("customerData", list);
					sessionStorage.setItem("customerTime", (new Date()).getTime() + "");
					list = JSON.parse(list);
					storage.customer = list;
					console.log("[getCustomer] Success getting customer information.");
				} else {
					msg.set("고객 정보를 가져오지 못했습니다.");
				}
			}
		})
	}
} // End of getCustomer()

// API 서버에서 회사 및 사용자 사번을 정보를 가져오는 함수
function getBasicInfo(){
	let url, basicInfoTime, basicInfoData;

	url = apiServer + "/api/system/basic";
	basicInfoTime = sessionStorage.getItem("basicInfoTime");
	basicInfoTime = basicInfoTime == null ? 0 : basicInfoTime * 1;
	if((new Date()).getTime() < basicInfoTime + 600000){
		basicInfoData = sessionStorage.getItem("basicInfoData");
		basicInfoData = JSON.parse(basicInfoData);
		storage.company = basicInfoData.company;
		// storage.widget.set = basicInfoData.widget;
		storage.my = basicInfoData.my;
		console.log("[getUserMap] set basic info from sessionStorage.");
	}else{
		$.ajax({
			"url": url,
			"method": "get",
			"dataType": "json",
			"cache": false,
			success: (data) => {
				let list;	
				if (data.result === "ok") {
					list = cipher.decAes(data.data);
					sessionStorage.setItem("basicInfoData", list);
					sessionStorage.setItem("basicInfoTime", (new Date()).getTime() + "");
					list = JSON.parse(list);
					storage.company = list.company;
					// storage.widget.set = list.widget;
					storage.my = list.my;
					console.log("[getBasicInfo] Success getting basic information.");
				} else {
					msg.set("기본 정보를 가져오지 못했습니다.");
				}
			}
		});
	}
} // End of getBasicInfo()

// API 서버에서 회사 및 사용자 사번을 정보를 가져오는 함수
function getUserRank(){
	let url, userRankTime, userRankData;

	url = apiServer + "/api/user/rank";
	userRankTime = sessionStorage.getItem("userRankTime");
	userRankTime = userRankTime == null ? 0 : userRankTime * 1;
	if((new Date()).getTime() < userRankTime + 600000){
		userRankData = sessionStorage.getItem("userRankData");
		userRankData = JSON.parse(userRankData);
		storage.userRank = userRankData;
		console.log("[getUserMap] set rank info from sessionStorage.");
	}else{
		$.ajax({
			"url": url,
			"method": "get",
			"dataType": "json",
			"cache": false,
			success: (data) => {
				let list;	
				if (data.result === "ok") {
					list = cipher.decAes(data.data);
					sessionStorage.setItem("userRankData", list);
					sessionStorage.setItem("userRankTime", (new Date()).getTime() + "");
					list = JSON.parse(list);
					storage.userRank = list;
					console.log("[getBasicInfo] Success getting rank information.");
				} else {
					msg.set("직급 정보를 가져오지 못했습니다.");
				}
			}
		})
	}
} // End of getUserRank()

// API 서버에서 코드 정보를 가져오는 함수
function getCommonCode(){
	let url, commonCodeTime, commonCodeData;

	url = apiServer + "/api/system/code";
	commonCodeTime = sessionStorage.getItem("commonCodeTime");
	commonCodeTime = commonCodeTime == null ? 0 : commonCodeTime * 1;
	if((new Date()).getTime() < commonCodeTime + 600000){
		commonCodeData = sessionStorage.getItem("commonCodeData");
		commonCodeData = JSON.parse(commonCodeData);
		storage.code = commonCodeData;
		console.log("[getUserMap] set common code from sessionStorage.");
	}else{
		$.ajax({
			"url": url,
			"method": "get",
			"dataType": "json",
			"cache": false,
			success: (data) => {
				let list;	
				if (data.result === "ok") {
					list = cipher.decAes(data.data);
					sessionStorage.setItem("commonCodeData", list);
					sessionStorage.setItem("commonCodeTime", (new Date()).getTime() + "");
					list = JSON.parse(list);
					storage.code = list;
					console.log("[getCommonCode] Success getting Common code list.");
				} else {
					msg.set("코드 정보를 가져오지 못했습니다.");
				}
			}
		});
	}
	
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

function selectFile(files){
	let file;
	file = document.getElementById("attached");

	file.files = files;
	showFile(file.files);
	fileChange();
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
	let getArticle = calWindowLength();
	let lastPage, result = [], max;

	if (currentPage === undefined) {
		storage.currentPage = 1;
		currentPage = storage.currentPage;
	}
	
	if (articlePerPage === undefined) {
		storage.articlePerPage = getArticle;
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
					}else if($(item).data("keyup") === "contract"){
						$.ajax({
							url: "/api/contract",
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
								msg.set("contract 에러");
							}
						});
					}else if($(item).data("keyup") === "customerUser"){
						$.ajax({
							url: "/api/system/cip",
							method: "get",
							dataType: "json",
							success:(result) => {
								if(result.result === "ok"){
									let resultJson;
									resultJson = cipher.decAes(result.data);
									resultJson = JSON.parse(resultJson);

									for(let key in resultJson){
										$(item).parents("div").find("datalist#_" + $(item).attr("id")).append("<option data-value='" + key + "' value='" + resultJson[key].name + "'></option>");
									}
								}
							},
							error:() => {
								msg.set("contract 에러");
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

		if(dataTitle !== ""){
			html += "<div class='defaultFormLine'>";
			html += "<div class='defaultFormSpanDiv'>";
			html += "<span class='defaultFormSpan'>" + dataTitle + "</span>";
			html += "</div>";
			html += "<div class='defaultFormContent'>";
	
			html += inputSet(data[i]);
			
			html += "</div>";
			html += "</div>";
		}
	}

	html += "</div>";

	return html;
}

// 상세보기 임시 폼
function detailViewForm(data){
	let html = "", detailContents, pageContainer, detailBtns, listChangeBtn, scheduleRange;

	pageContainer = $(".pageContainer");
	detailContents = $(".detailContents");
	listChangeBtn = $(".listChangeBtn");
	scheduleRange = $("#scheduleRange");
	detailBtns = $(".detailBtns");

	if(listChangeBtn !== undefined){
		listChangeBtn.hide();
	}

	if(scheduleRange !== undefined){
		scheduleRange.hide();
	}

	pageContainer.hide();
	pageContainer.prev().hide();
	detailContents.hide();
	detailBtns.hide();

	html = "<div class='detailViewContainer tabContent' id='tabContentAll'>";

	for(let i = 0; i < data.length; i++){
		let dataTitle = (data[i].title === undefined) ? "" : data[i].title;
		let row = (data[i].row === undefined) ? 1 : data[i].row;
		let col = (data[i].col === undefined) ? 1 : data[i].col;

		html += "<div class='detailViewFormSpan'>" + dataTitle + "</div>";
		html += "<div class='detailViewContent' style='grid-row: span " + row + "; grid-column: span " + col + ";'>";
		html += inputSet(data[i]);
		html += "</div>";
	}

	html += "</div>";

	return html;
}

function detailBoardForm(data){
	let html = "";

	html = "<div class='detailBoard'>";
	html += "<div class='detailBtns'></div>"
	html += "<div class='detailContents'>";
	html += "<div class='detailBoardContainer'>";

	for(let i = 0; i < data.length; i++){
		let dataTitle = (data[i].title === undefined) ? "" : data[i].title;
		let row = (data[i].row === undefined) ? 1 : data[i].row;
		let col = (data[i].col === undefined) ? 1 : data[i].col;

		html += "<div class='detailViewFormSpan'>" + dataTitle + "</div>";
		html += "<div class='detailViewContent' style='grid-row: span " + row + "; grid-column: span " + col + ";'>";
		html += inputSet(data[i]);
		html += "</div>";
	}
	
	html += "</div>";
	html += "</div>";
	html += "</div>";

	return html;
}

function inputSet(data){
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

	if(dataType === "text"){
		if(dataDisabled == true){
			html += "<input type='text' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "' data-keyup='" + dataKeyup + "' onchange='" + dataChangeEvent + "' onclick='" + dataClickEvent + "' onkeyup='" + dataKeyupEvent + "' disabled='" + dataDisabled + "'>";
		}else{
			html += "<input type='text' id='" + elementId + "' name='" + elementName + "' value='" + dataValue + "' data-keyup='" + dataKeyup + "' onchange='" + dataChangeEvent + "' onclick='" + dataClickEvent + "' onkeyup='" + dataKeyupEvent + "'>";
		}
	}else if(dataType === "textarea"){
		html += "<textarea id='editorSet'>" + dataValue + "</textarea>";
	}else if(dataType === "radio"){
		for(let t = 0; t < data.radioValue.length; t++){
			if(dataDisabled == true){
				if(t == 0){
					html += "<input type='radio' id='" + elementId + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' disabled='" + dataDisabled + "' onclick='" + dataClickEvent + "' checked><label>" + data.radioValue[t].value + "</label>" + " ";
				}else{
					html += "<input type='radio' id='" + elementId + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' disabled='" + dataDisabled + "' onclick='" + dataClickEvent + "'><label>" + data.radioValue[t].value + "</label>" + " ";
				}
			}else{
				if(t == 0){
					html += "<input type='radio' id='" + elementId + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' onclick='" + dataClickEvent + "' checked><label>" + data.radioValue[t].value + "</label>" + " ";
				}else{
					html += "<input type='radio' id='" + elementId + "' name='" + elementName + "' value='" + data.radioValue[t].key + "' onclick='" + dataClickEvent + "'><label>" + data.radioValue[t].value + "</label>" + " ";
				}
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
		for(let t = 0; t < data.selectValue.length; t++){
			html += "<option value='" + data.selectValue[t].key + "'>" + data.selectValue[t].value + "</option>";
		}

		html += "</select>";
	}else if(dataType === "file"){
		html += "<input type='file' id='" + elementId + "' name='" + elementName + "' onchange='fileChange();' multiple>";
	}else if(dataType === ""){
		html += "";
	}

	return html;
}

function detailTabHide(notId){
	$(".tabs input:radio").each((index, item) => {
		if(notId === undefined){
			$(document).find("#" + $(item).data("content-id")).hide();
		}else{
			$(document).find("#" + $(item).data("content-id")).not("#" + notId).hide();
		}
	});
}

//tinyMCE
function setTiny(){
	tinymce.remove();
	tinymce.init(tiny.options);
}

// datalist
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
	$(document).find(".tabs input:radio").each((index, item) => {
		$(document).find("#" + $(item).data("content-id")).hide();
	});

	$(document).find("#" + $(e).data("content-id")).show();
}

//매입매출내역 리스트
function createTabTradeList(result){
	let html = "";

	html = "<div class='tradeList' id='tabTradeList'>";

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

	if(result.length > 0){
		let disDate, setDate, customer, product, netPrice, quantity, tax, amount, total, remark, vatSerial, calTotal = 0;

		html += "<div class='tradeThirdFormContentDiv'>";
		
		for(let i = 0; i < result.length; i++){
			if(result[i].type === "1101"){
				disDate = dateDis(result[i].created, result[i].modified);
				setDate = dateFnc(disDate);
				customer = (result[i].customer == 0 || result[i].customer === null || result[i].customer === undefined) ? "없음 " : storage.customer[result[i].customer].name;
				product = (result[i].product === null || result[i].product == 0 || result[i].product === undefined) ? "없음" : "임시 항목";
				netPrice = (result[i].netPrice == 0 || result[i].netPrice === null || result[i].netPrice === undefined) ? 0 : numberFormat(result[i].netPrice);
				quantity = (result[i].quantity == 0 || result[i].quantity === null || result[i].quantity === undefined) ? 0 : result[i].quantity;
				tax = (result[i].tax == 0 || result[i].tax === null || result[i].tax === undefined) ? 0 : numberFormat(result[i].tax);
				amount = (result[i].amount == 0 || result[i].amount === null || result[i].amount === undefined) ? 0 : numberFormat(result[i].amount);
				total = (result[i].total == 0 || result[i].total === null || result[i].total === undefined) ? 0 : numberFormat(result[i].total);
				remark = (result[i].remark === null || result[i].remark === "" || result[i].remark === undefined) ? "비고 없음" : result[i].remark;
				vatSerial = (result[i].vatSerial === null || result[i].vatSerial === "" || result[i].vatSerial === undefined) ? "없음" : result[i].vatSerial;

				html += "<div class='tradeThirdContentItem'>" + setDate + "</div>";
				html += "<div class='tradeThirdContentItem'>" + customer + "</div>";
				html += "<div class='tradeThirdContentItem'>" + product + "</div>";
				html += "<div class='tradeThirdContentItem'>" + netPrice + "</div>";
				html += "<div class='tradeThirdContentItem'>" + quantity + "</div>";
				html += "<div class='tradeThirdContentItem'>" + tax + "</div>";
				html += "<div class='tradeThirdContentItem'>" + amount + "</div>";
				html += "<div class='tradeThirdContentItem'>" + total + "</div>";
				html += "<div class='tradeThirdContentItem'>" + remark + "</div>";
				html += "<div class='tradeThirdContentItem'>" + vatSerial + "</div>";
				html += "<div class='tradeThirdContentItem'>수정</div>";
				html += "<div class='tradeThirdContentItem'>삭제</div>";

				calTotal += parseInt(result[i].total);
			}
		}

		html +="</div>";
		html += "<div class='tradeThirdFormContentTotal'><span>매입합계</span><span>" + numberFormat(calTotal) + "</span></div>";
		html += "<div class='tradeThirdFormContentDiv'>";

		calTotal = 0;

		for(let i = 0; i < result.length; i++){
			if(result[i].type === "1102"){
				disDate = dateDis(result[i].created, result[i].modified);
				setDate = dateFnc(disDate);
				customer = (result[i].customer == 0 || result[i].customer === null || result[i].customer === undefined) ? "없음 " : storage.customer[result[i].customer].name;
				product = (result[i].product === null || result[i].product == 0 || result[i].product === undefined) ? "없음" : "임시 항목";
				netPrice = (result[i].netPrice == 0 || result[i].netPrice === null || result[i].netPrice === undefined) ? 0 : numberFormat(result[i].netPrice);
				quantity = (result[i].quantity == 0 || result[i].quantity === null || result[i].quantity === undefined) ? 0 : result[i].quantity;
				tax = (result[i].tax == 0 || result[i].tax === null || result[i].tax === undefined) ? 0 : numberFormat(result[i].tax);
				amount = (result[i].amount == 0 || result[i].amount === null || result[i].amount === undefined) ? 0 : numberFormat(result[i].amount);
				total = (result[i].total == 0 || result[i].total === null || result[i].total === undefined) ? 0 : numberFormat(result[i].total);
				remark = (result[i].remark === null || result[i].remark === "" || result[i].remark === undefined) ? "비고 없음" : result[i].remark;
				vatSerial = (result[i].vatSerial === null || result[i].vatSerial === "" || result[i].vatSerial === undefined) ? "없음" : result[i].vatSerial;

				html += "<div class='tradeThirdContentItem'>" + setDate + "</div>";
				html += "<div class='tradeThirdContentItem'>" + customer + "</div>";
				html += "<div class='tradeThirdContentItem'>" + product + "</div>";
				html += "<div class='tradeThirdContentItem'>" + netPrice + "</div>";
				html += "<div class='tradeThirdContentItem'>" + quantity + "</div>";
				html += "<div class='tradeThirdContentItem'>" + tax + "</div>";
				html += "<div class='tradeThirdContentItem'>" + amount + "</div>";
				html += "<div class='tradeThirdContentItem'>" + total + "</div>";
				html += "<div class='tradeThirdContentItem'>" + remark + "</div>";
				html += "<div class='tradeThirdContentItem'>" + vatSerial + "</div>";
				html += "<div class='tradeThirdContentItem'>수정</div>";
				html += "<div class='tradeThirdContentItem'>삭제</div>";

				calTotal += parseInt(result[i].total);
			}
		}

		html += "</div>";
		html += "<div class='tradeThirdFormContentTotal'><span>매출합계</span><span>" + numberFormat(calTotal) + "</span></div>";
	}else{
		html += "<div class='tradeThirdFormContentDiv'>";
		html += "<div class='tradeThirdContentItem' style='grid-column: span 12; text-align:center;'>데이터가 없습니다.</div>";
		html += "</div>";
	}

	html += "</div>";

	return html;
}

function tradeInsertForm(){
	let html = "";

	html += "<div class='tradeList'>";
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
	html += "</div>";

	modal.show();
	modal.headTitle.text("매입매출등록");
	modal.content.css("width", "90%");
	modal.body.html(html);
	modal.body.css("max-height", "800px");
	modal.confirm.text("추가");
	modal.close.text("취소");
	modal.confirm.attr("onclick", "tradeInsert();");
	modal.close.attr("onclick", "modal.hide();");
}

function createTabFileList(){
	let html = "", container, header = [], data = [], str, detailContents, ids, job, fnc, url;
	
	detailContents = $(".detailContents");

	html = "<div class='tabFileList' id='tabFileList'>";
	html += "<input type='file' class='dropZone' ondragenter='dragAndDrop.fileDragEnter(event)' ondragleave='dragAndDrop.fileDragLeave(event)' ondragover='dragAndDrop.fileDragOver(event)' ondrop='dragAndDrop.fileDrop(event)' name='attached[]' id='attached' onchange='fileChange();' multiple>";
	html += "<div class='fileList'></div>";
	html += "</div>";
	
	header = [
		{
			"title" : "파일명",
			"align" : "center",
		},
		{
			"title" : "삭제",
			"align" : "center",
		},
	];
	
	detailContents.append(html);
	container = detailContents.find(".tabFileList .fileList");
	
	if(storage.attachedList.length > 0){
		for(let i = 0; i < storage.attachedList.length; i++){
			url = "/api/attached/" + storage.attachedType + "/" + storage.attachedNo + "/" + storage.attachedList[i].fileName;
			if(storage.attachedList[i].removed){
				str = [
					{
						"setData": "<div style='text-decoration: line-through;'>" + storage.attachedList[i].fileName + "</div>",
					},
					{
						"setData": "<button type='button' disabled>삭제</button>",
					},
				];
			}else{
				str = [
					{
						"setData": "<a href='/api/attached/" + storage.attachedType + "/" + storage.attachedNo + "/" + encodeURI(storage.attachedList[i].fileName) + "'>" + storage.attachedList[i].fileName + "</a>",
					},
					{
						"setData": "<button type='button' onclick='tabFileDelete(" + storage.attachedNo + ", \"" + storage.attachedType + "\", \"" + storage.attachedList[i].fileName + "\", " + i + ");'>삭제</button>",
					},
				];
			}
			data.push(str);
		}
	}else{
		str = [
			{
				"setData": "<div>데이터가 없습니다.</div>",
			},
			{
				"setData": "<button type='button' disabled>삭제</button>",
			},
			
		];
		data.push(str);
	}

	setTimeout(() => {
		createGrid(container, header, data, ids, job, fnc);
	}, 100);
}

function fileChange(){
	let method, data, type, attached, fileDatas = [], html = "", flag;
	attached = $(document).find("[name='attached[]']")[0].files;

	if(storage.attachedList === undefined || storage.attachedList <= 0){
		storage.attachedList = [];
	}

	flag = storage.attachedFlag;

	for(let i = 0; i < attached.length; i++){
		let reader = new FileReader();
		let temp, fileName, indexFlag = false;

		fileName = attached[i].name;

		reader.onload = (e) => {
			let binary, x, fData = e.target.result;
            const bytes = new Uint8Array(fData);
            binary = "";
            for(x = 0 ; x < bytes.byteLength ; x++) binary += String.fromCharCode(bytes[x]);
			let fileData = cipher.encAes(btoa(binary));
			let fullData = (fileName + "\r\n" + fileData);

			let url = (flag == false) ? "/api/board/filebox/attached" : "/api/attached/" + storage.attachedType + "/" + storage.attachedNo;
			
			url = url;
			method = "post";
			data = fullData;
			type = "insert";
			
			crud.defaultAjax(url, method, data, type, submitFileSuccess, submitFileError);
		}

		reader.readAsArrayBuffer(attached[i]);
		
		temp = attached[i].name;
		fileDatas.push(temp);
		updateDataArray.push(temp);

		for(let t = 0; t < storage.attachedList.length; t++){
			if(storage.attachedList[t].fileName == temp){
				indexFlag = true;
			}
		}

		if(!indexFlag){
			temp = {
				"fileName": attached[i].name,
				"removed": attached[i].removed,
			}
	
			storage.attachedList.push(temp);
		}
	}

	if(flag){
		tabFileItemListUpdate();
	}else{
		$(document).find(".filePreview").html(html);
	
		for(let i = 0; i < fileDatas.length; i++){
			fileDataArray.push(fileDatas[i]);
		}
	
		if(fileDataArray.length > 0){
			for(let i = 0; i < fileDataArray.length; i++){
				html += "<div style='padding-bottom: 4%;'><span style='float:left; display: block; width: 95%;'>" + fileDataArray[i] + "</span><button type='button' id='fileDataDelete' style='float:right; width: 5%;' data-index='" + i + "' onclick='fileViewDelete(this);'>삭제</button></div>";
				$(document).find(".filePreview").html(html);
			}
		}
	}

	// divHeight = $(document).find(".filePreview").innerHeight();
	// $(document).find("#attached").parent().parent().next().css("padding-top", divHeight);
}

function tabFileDownload(no, fileType, fileName){
	$.ajax({
		url: "/api/attached/" + fileType + "/" + no + "/" + fileName,
		method: "get",
		dataType: "json",
	});
}

function fileViewDelete(e){
	fileDataArray.splice($(e).data("index"), 1);
	
	for(let i = 0; i < updateDataArray.length; i++){
		if(updateDataArray[i] === $(e).prev().text()){
			updateDataArray.splice(i, 1);
		}
	}

	removeDataArray.push($(e).prev().text());
	$(e).parent().remove();

	$(document).find(".filePreview div button").each((index, item) => {
		$(item).attr("data-index", index);		
	});
}

function submitFileSuccess(){
	return false;
}

function submitFileError(){
	alert("파일을 올리는 도중 에러가 생겼습니다.\n다시 시도해주세요.");
}

function tabFileInsert(url){
	let writer, data, method, type;

	writer = $(document).find("#writer");
	writer = dataListFormat(writer.attr("id"), writer.val());
	
	url = url;
	method = "post";
	data = {
		"writer": writer,
		"files": fileDataArray,
	}
	type = "insert";

	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, tabFileSuccessInsert, tabFileErrorInsert);
}

function tabFileSuccessInsert(){
	alert("등록완료");
	location.reload();
}

function tabFileErrorInsert(){
	alert("등록에러");
}

function tabFileDelete(no, fileType, fileName){
	let method, data, type;
	
	if(confirm("정말로 삭제하시겠습니까??")){
		url = "/api/attached/" + fileType + "/" + no + "/" + fileName;
		method = "delete";
		type = "detail";
	
		crud.defaultAjax(url, method, data, type, tabFileSuccessDelete, tabFileErrorDelete);
	}else{
		return false;
	}
}

function tabFileSuccessDelete(result){
	storage.attachedList = result;
	tabFileItemListUpdate();
}

function tabFileErrorDelete(){
	alert("삭제에러");
}

function tabFileItemListUpdate(){
	let header, data = [], ids, job, fnc, content, html = "";
	
	header = [
		{
			"title" : "파일명",
			"align" : "center",
		},
		{
			"title" : "삭제",
			"align" : "center",
		},
	];
	
	container = $(".detailContents .tabFileList .fileList");
	
	if(storage.attachedList.length > 0){
		for(let i = 0; i < storage.attachedList.length; i++){
			url = "/api/attached/" + storage.attachedType + "/" + storage.attachedNo + "/" + storage.attachedList[i].fileName;
			if(storage.attachedList[i].removed){
				str = [
					{
						"setData": "<div style='text-decoration: line-through;'>" + storage.attachedList[i].fileName + "</div>",
					},
					{
						"setData": "<button type='button' disabled>삭제</button>",
					},
				];
			}else{
				str = [
					{
						"setData": "<a href='/api/attached/" + storage.attachedType + "/" + storage.attachedNo + "/" + encodeURI(storage.attachedList[i].fileName) + "'>" + storage.attachedList[i].fileName + "</a>",
					},
					{
						"setData": "<button type='button' onclick='tabFileDelete(" + storage.attachedNo + ", \"" + storage.attachedType + "\", \"" + storage.attachedList[i].fileName + "\", " + i + ");'>삭제</button>",
					},
				];
			}
			data.push(str);
		}
	}else{
		str = [
			{
				"setData": "<div>데이터가 없습니다.</div>",
			},
			{
				"setData": "<button type='button' disabled>삭제</button>",
			},
			
		];
		data.push(str);
	}

	setTimeout(() => {
		createGrid(container, header, data, ids, job, fnc);
	}, 100);

	content = $(".tabFileList .fileList .gridContent");
	content.html("");

	for(let i = 0; i < storage.attachedList.length; i++){
		html += "<div class='gridContentItem grid_default_text_align_center'>" + storage.attachedList[i].fileName + "</div>";
		html += "<div class='gridContentItem grid_default_text_align_center' data-name='" + storage.attachedList[i].fileName + "'><button type='button' onclick='tabFileDelete('/api/attached/'" + storage.attchedType + "/" + storage.attchedNo + "/" + storage.attachedList[i].fileName + "');>삭제</button></div>";
	}

	content.html(html);
}

//견적내역 리스트
function createTabEstList(){
	let html = "", container, header = [], data = [], str, detailContents;

	detailContents = $(".detailContents");

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
	
	detailContents.append(html);
	container = detailContents.find(".tabEstList");

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

//기술지원내역 리스트
function createTabTechList(result){
	let html = "", container, header = [], data = [], str, detailContents, ids, job, fnc;

	detailContents = $(".detailContents");

	html = "<div class='tabTechList' id='tabTechList'></div>";
	
	header = [
		{
			"title" : "일자",
			"align" : "center",
		},
		{
			"title" : "지원형태",
			"align" : "center",
		},
		{
			"title" : "장소",
			"align" : "center",
		},
		{
			"title" : "담당자",
			"align" : "center",
		},
		{
			"title" : "비고",
			"align" : "left",
		},
	]
	
	detailContents.append(html);
	container = detailContents.find(".tabTechList");

	for(let i = 0; i < result.length; i++){
		if(result[i].job === "tech"){
			str = [
				{
					"setData": result[i].created,
				},
				{
					"setData": storage.code.etc[result[i].type],
				},
				{
					"setData": result[i].place,
				},
				{
					"setData": storage.user[result[i].writer].userName,
				},
				{
					"setData": result[i].content,
				},
			];
			
			data.push(str);
		}
	}

	setTimeout(() => {
		createGrid(container, header, data, ids, job, fnc);
	}, 100);
}

//영업활동내역 리스트
function createTabSalesList(result){
	let html = "", container, header = [], data = [], str, detailContents, ids, job, fnc;

	detailContents = $(".detailContents");
	html = "<div class='tabSalesList' id='tabSalesList'></div>";
	
	header = [
		{
			"title" : "일자",
			"align" : "center",
		},
		{
			"title" : "활동종류",
			"align" : "center",
		},
		{
			"title" : "제목",
			"align" : "left",
		},
		{
			"title" : "비고",
			"align" : "left",
		},
		{
			"title" : "담당자",
			"align" : "center",
		},
		{
			"title" : "장소",
			"align" : "center",
		},
	]
	
	detailContents.append(html);
	container = detailContents.find(".tabSalesList");

	for(let i = 0; i < result.length; i++){
		if(result[i].job === "sales"){
			str = [
				{
					"setData": result[i].created,
				},
				{
					"setData": storage.code.etc[result[i].type],
				},
				{
					"setData": result[i].title,
				},
				{
					"setData": result[i].content,
				},
				{
					"setData": storage.user[result[i].writer].userName,
				},
				{
					"setData": result[i].place,
				},
			];
			data.push(str);
		}
	}

	setTimeout(() => {
		createGrid(container, header, data, ids, job, fnc);
	}, 100);
}

//상세보기 숨김
function detailViewContainerHide(titleStr){
	let detailContents, pageContainer, detailBtns, listChangeBtn, scheduleRange, searchContainer;

	pageContainer = $(".pageContainer");
	detailContents = $(".detailContents");
	listChangeBtn = $(".listChangeBtn");
	scheduleRange = $("#scheduleRange");
	detailBtns = $(".detailBtns");
	searchContainer = $(".searchContainer");

	if(listChangeBtn !== undefined){
		listChangeBtn.show();
	}

	if(scheduleRange !== undefined){
		scheduleRange.show();
	}

	pageContainer.show();
	pageContainer.prev().show();
	detailContents.hide();
	detailContents.html("");
	detailBtns.hide();
	searchContainer.show();


	conTitleChange("containerTitle", titleStr);
}

function detailBoardContainerHide(){
	$(".detailBoard").each((index, item) => {
		$(item).hide();
	});
}

function conTitleChange(contentId, str){
	$("#" + contentId).html(str);
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

function calWeekDay(date){
    let disDate, week;

    disDate = dateDis(date);
    date = dateFnc(disDate);

    week = new Date(date).getDay();

    if(week == 0){
        week = "일";
    }else if(week == 1){
        week = "월";
    }else if(week == 2){
        week = "화";
    }else if(week == 3){
        week = "수";
    }else if(week == 4){
        week = "목";
    }else if(week == 5){
        week = "금";
    }else{
		week = "토";
	}

    return week;
}

function calDays(date, type){
    let getDate, year, month, day, resultDate;

    getDate = new Date(date);

    year = getDate.getFullYear();
    month = getDate.getMonth();
    day = getDate.getDate();
	
    if(type === "last"){
		day = day - 6;
        resultDate = new Date(year, month, day).toISOString().substring(0, 10).replaceAll("-", "");
    }else{
		day = day + 8;
        resultDate = new Date(year, month, day).toISOString().substring(0, 10).replaceAll("-", "");
    }

    return resultDate;
}

function contentTopBtn(content){
	$("#" + content).animate({
		scrollTop: 0,
	}, 100);
}

function enableDisabled(e, clickStr, notIdArray){
	let box = $("input, select");

	for(let i = 0; i < box.length; i++){
		if($(box[i]).attr("type") === "radio"){
			$(box[i]).prop("disabled", false);
		}else{
			if(notIdArray.indexOf($(box[i]).attr("id")) == -1){
				$(box[i]).prop("disabled", false);
			}
		}
	}
	
	$(e).attr("onclick", clickStr);
	tinymce.activeEditor.mode.set('design'); 
}

function calWindowLength(){
	let bodyContents, gridContent;

	bodyContents = $("#bodyContents");
	gridContent = $(".gridContent");

	return parseInt((bodyContents.innerHeight() - 360) / 40);
}

function daumPostCode(){
	let popupWidth, popupHeight;
	popupWidth = 500;
	popupHeight = 500;

	new daum.Postcode({
		theme: {
			searchBgColor: "#0B65C8",
			queryTextColor: "#FFFFFF"
		},
		animation: true,
		pleaseReadGuide: true,
		width: popupWidth,
		height: popupHeight,
        oncomplete: function(data) {
			$("#postCode").val(data.zonecode);
			$("#mainAddress").val(data.address + " " + data.buildingName);
			$("#detailAddress").focus();
        }
    }).open({
		left: Math.ceil((document.body.offsetWidth / 2) - (popupWidth / 2) + window.screenLeft),
		top: Math.ceil((document.body.offsetHeight / 2) - (popupHeight / 2))
	});
}

function addChart(){
	addChart_1();
	addChart_2();
	addChart_3();
	addChart_4();
}

function addChart_1(){
	let now, url, method, data, type;
	
	now = new Date();
	now = now.toISOString().substring(0, 10).replaceAll("-", "");

	url = "/api/accounting/statistics/sales/" + now;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, chartSuccess_1, chartError_1);
}

function chartSuccess_1(result){
	let chartContent_1, dataArray = [], t = 0;
	chartContent_1 = document.getElementById('chartContent_1').getContext('2d');

	for(let i = 0; i < 12; i++){
		if(result[i] === undefined){
			dataArray.push(0);
			t += 0
		}else{
			dataArray.push(result[i].sales);
			t += result[i].sales;
		}
	}

	new Chart(chartContent_1, {
		type: "bar",
		data: {
			labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			datasets: [
				{
					label: "월별목표",
					data: [100000000, 1200000000, 1600000000, 1100000000, 1300000000, 180000000, 1400000000, 1500000000, 1700000000, 1900000000, 800000000, 600000000],
					backgroundColor: "#5f46c6", //#4374D9
					borderColor: "#5f46c6",
					borderWidth: 3,
					radius: 0,
				},
				{
					label: "월별매출",
					data: dataArray,
					backgroundColor: "#76e3f1",//#B7F0B
					borderColor: "#76e3f1",
					borderWidth: 3,
					radius: 0,
				},
				// {
				// 	type: "line",
				// 	label: "누적목표",
				// 	data: [100000000, 200000000, 1000000000, 580000000, 250000000, 930000000, 270000000, 360000000, 480000000, 310000000, 850000000, 730000000],
				// 	fill: false,
				// 	lineTension: 0,
				// 	backgroundColor: "#A566FF",
				// 	borderColor: "#A566FF",
				// },
				// {
				// 	type: "line",
				// 	label: "누적매출",
				// 	data: dataArray,
				// 	fill: false,
				// 	lineTension: 0,
				// 	backgroundColor: "#F15F5F",
				// 	borderColor: "#F15F5F",
				// },
			],
		},
		options: {
			scales: {
			  	yAxes: [{
					ticks: {
						beginAtZero: true,
						callback: function(value, index) {
							if(value.toString().length > 8){
								return (Math.floor(value / 100000000)).toLocaleString("ko-KR") + " (억원)";
							}else if(value.toString().length > 4){
								return (Math.floor(value / 10000)).toLocaleString("ko-KR") + " (만원)";
							}else{
								return value.toLocaleString("ko-KR"); 
							}
						}
					},
				}]
		  	},
			tooltips: { 
				callbacks: { 
					label: function(tooltipItem, data) {
						return " " + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원"; 
						} 
				 },
			},
		}
	});

	console.log("cal: " + t);
	console.log("total: " + parseInt(100000000 + 1200000000 + 1600000000 + 1100000000 + 1300000000 + 180000000 + 1400000000 + 1500000000 + 1700000000 + 1900000000 + 800000000 + 600000000));
}

function chartError_1(){
	alert("첫번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

function addChart_2(){
	let now, url, method, data, type;
	
	now = new Date();
	now = now.toISOString().substring(0, 10).replaceAll("-", "");

	url = "/api/accounting/statistics/sales/" + now;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, chartSuccess_2, chartError_2);
}

function chartSuccess_2(result){
	let chartContent_2, infoHtml = "", calResult = 0;
	chartContent_2 = document.getElementById('chartContent_2').getContext('2d');

	for(let i = 0; i < result.length; i++){
		if(result[i] === undefined){
			calResult += 0;
		}else{
			calResult += result[i].sales
		}
	}

	new Chart(chartContent_2, {
		type: "doughnut",
		data: {
			labels: ["달성률", "미달성률"],
			datasets: [
				{
					data: [(calResult / 13380000000 * 100).toFixed(2), (100 - (calResult / 13380000000 * 100).toFixed(2))],
					backgroundColor: [
						"#31cca2",
						"#95c1e6"
					],
					radius:0,
					borderWidth: 1,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			},
		},
	});

	infoHtml = "<div>목표 13,380,000,000</div>";
	infoHtml += "<div>매출 " + parseInt(calResult).toLocaleString("en-US") + "</div>";
	infoHtml += "<div>달성률 " + (calResult / 13380000000 * 100).toFixed(2) + "%<div>";
	infoHtml += "<hr />";
	infoHtml += "<div>-" + parseInt(13380000000 - calResult).toLocaleString("en-US") + "</div>";

	$("#bodyChart_2 #chartContentInfo").html(infoHtml);
}

function chartError_2(){
	alert("두번째 차트에 에러가 있습니다.\n다시 확인해주세요.");
}

function addChart_3(){
	let chartContent_3, infoHtml = "";
	chartContent_3 = document.getElementById('chartContent_3').getContext('2d');

	new Chart(chartContent_3, {
		type: "doughnut",
		data: {
			labels: ["달성률", "미달성률"],
			datasets: [
				{
					data: [70, 30],
					backgroundColor: [
						"#247de5",
						"#f3db5f"
					]
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		},
	});

	infoHtml = "<div>목표 13,660,000,000</div>";
	infoHtml += "<div>매출 8,045,953,735</div>";
	infoHtml += "<div>달성률 58.90%<div>";
	infoHtml += "<hr />";
	infoHtml += "<div>-5,614,046,265</div>";

	$("#bodyChart_3 .chartContentContainer #chartContentInfo").html(infoHtml);
}

function addChart_4(){
	let chartContent_4;
	chartContent_4 = document.getElementById('chartContent_4').getContext('2d');

	new Chart(chartContent_4, {
		type: "pie",
		data: {
			labels: ["조달직판", "조달간판", "조달대행", "직접판매", "간접판매", "기타"],
			datasets: [
				{
					data: [310, 200, 110, 220, 100, 50],
					backgroundColor: [
						"#29cea6",
						"#2795f7",
						"#f7d766",
						"#ff5377",
						"#7952e9",
						"#d9d9d9",
					]
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		},
	});
}

function searchContainerSet(){
	let searchContainer, searchChangeBtn, multiSearchResetBtn, multiSearchBtn, searchInputContent, searchMultiContent, jsonData, html = "";
	searchContainer = $(".searchContainer");
	searchChangeBtn = $("#searchChangeBtn");
	multiSearchResetBtn = $("#multiSearchResetBtn");
	multiSearchBtn = $("#multiSearchBtn");
	searchInputContent = $(".searchInputContent");
	searchMultiContent = $(".searchMultiContent");

	searchChangeBtn.hide();
	multiSearchResetBtn.hide();
	multiSearchBtn.hide();
	searchInputContent.hide();
	searchMultiContent.hide();
	
	searchMultiContent.find("div input").each((index, item) => {
		if($(item).data("type") !== undefined){
			$(item).attr("list", "_" + $(item).attr("id"));
			$(item).after("<datalist id=\"_" + $(item).attr("id") + "\"></datalist>");
			
			if($(item).data("type") === "user"){
				jsonData = storage.user;
				for(let key in jsonData){
					$(item).next().append("<option data-value=\"" + key + "\" value=\"" + jsonData[key].userName + "\">");
				}
			}else if($(item).data("type") === "customer"){
				jsonData = storage.customer;
				for(let key in jsonData){
					$(item).next().append("<option data-value=\"" + key + "\" value=\"" + jsonData[key].name + "\">");
				}
			}else if($(item).data("type") === "sopp"){
				$.ajax({
					url: "/api/sopp",
					method: "get",
					dataType: "json",
					success: (result) => {
						jsonData = cipher.decAes(result.data);
						jsonData = JSON.parse(jsonData);
						
						for(let i = 0; i < jsonData.length; i++){
							$(item).next().append("<option data-value='" + jsonData[i].no + "' value='" + jsonData[i].title + "'></option>");
						}
					}
				})
			}else if($(item).data("type") === "contract"){
				$.ajax({
					url: "/api/contract",
					method: "get",
					dataType: "json",
					success: (result) => {
						jsonData = cipher.decAes(result.data);
						jsonData = JSON.parse(jsonData);
						
						for(let i = 0; i < jsonData.length; i++){
							$(item).next().append("<option data-value='" + jsonData[i].no + "' value='" + jsonData[i].title + "'></option>");
						}
					}
				})
			}
		}
	});

	searchContainer.show();
}

function searchAco(e){
	let thisBtn, searchChangeBtn, multiSearchResetBtn, multiSearchBtn, searchInputContent, searchMultiContent;
	thisBtn = $(e);
	searchChangeBtn = $("#searchChangeBtn");
	multiSearchResetBtn = $("#multiSearchResetBtn");
	multiSearchBtn = $("#multiSearchBtn");
	searchInputContent = $(".searchInputContent");
	searchMultiContent = $(".searchMultiContent");

	if(!thisBtn.data("set")){
		thisBtn.html("<i class=\"fa-solid fa-minus fa-xl\"></i>");
		thisBtn.data("set", true);
		searchChangeBtn.html("<i class=\"fa-solid fa-list fa-xl\"></i>");
		searchChangeBtn.data("set", false);
		searchChangeBtn.show();
		searchInputContent.show();
		multiSearchBtn.hide();
		searchMultiContent.hide();
		multiSearchResetBtn.hide();
	}else{
		thisBtn.html("<i class=\"fa-solid fa-plus fa-xl\"></i>");
		thisBtn.data("set", false);
		searchChangeBtn.hide();
		searchChangeBtn.html("<i class=\"fa-solid fa-list fa-xl\"></i>");
		searchChangeBtn.data("set", false);
		multiSearchBtn.hide();
		searchInputContent.hide();
		searchMultiContent.hide();
		multiSearchResetBtn.hide();
	}
}

function searchChange(e){
	let thisBtn, multiSearchResetBtn, multiSearchBtn, searchInputContent, searchMultiContent;
	thisBtn = $(e);
	multiSearchResetBtn = $("#multiSearchResetBtn");
	multiSearchBtn = $("#multiSearchBtn");
	searchInputContent = $(".searchInputContent");
	searchMultiContent = $(".searchMultiContent");

	if(!thisBtn.data("set")){
		thisBtn.html("<i class=\"fa-solid fa-keyboard fa-xl\"></i>");
		thisBtn.data("set", true);
		multiSearchResetBtn.show();
		multiSearchBtn.show();
		searchInputContent.hide();
		searchMultiContent.show();
	}else{
		thisBtn.html("<i class=\"fa-solid fa-list fa-xl\"></i>");
		thisBtn.data("set", false);
		multiSearchResetBtn.hide();
		multiSearchBtn.hide();
		searchInputContent.show();
		searchMultiContent.hide();
	}
}

function searchReset(){
	let searchMultiContent = $(".searchMultiContent");

	searchMultiContent.find("div input, select").each((index, item) => {
		$(item).val("");
	});
}

function searchDataFilter(arrayList, searchDatas, type){
	let dataArray = [];
	
	if(type === "input"){
		for(let key in storage.searchList){
			if(storage.searchList[key].indexOf(searchDatas) > -1){
				dataArray.push(arrayList[key]);
			}
		}
	}else{
		if(searchDatas.indexOf("#created") > -1){
			let splitStr;
			splitStr = searchDatas.split("#created");

			for(let key in storage.searchList){
				if(splitStr[0] <= storage.searchList[key].split("#created")[1]){
					if(storage.searchList[key].split("#created")[1] <= splitStr[1]){
						dataArray.push(key);
					}
				}
			}
		}else if(searchDatas.indexOf("#from") > -1){
			let splitStr;
			splitStr = searchDatas.split("#from");

			for(let key in storage.searchList){
				if(splitStr[0] <= storage.searchList[key].split("#from")[1]){
					if(storage.searchList[key].split("#from")[1] <= splitStr[1]){
						dataArray.push(key);
					}
				}
			}
		}else if(searchDatas.indexOf("#startOfFreeMaintenance") > -1){
			let splitStr;
			splitStr = searchDatas.split("#startOfFreeMaintenance");

			for(let key in storage.searchList){
				if(splitStr[0] <= storage.searchList[key].split("#startOfFreeMaintenance")[1]){
					if(storage.searchList[key].split("#startOfFreeMaintenance")[1] <= splitStr[1]){
						dataArray.push(key);
					}
				}
			}
		}else if(searchDatas.indexOf("#startOfPaidMaintenance") > -1){
			let splitStr;
			splitStr = searchDatas.split("#startOfPaidMaintenance");

			for(let key in storage.searchList){
				if(splitStr[0] <= storage.searchList[key].split("#startOfPaidMaintenance")[1]){
					if(storage.searchList[key].split("#startOfPaidMaintenance")[1] <= splitStr[1]){
						dataArray.push(key);
					}
				}
			}
		}else if(searchDatas.indexOf("#saleDate") > -1){
			let splitStr;
			splitStr = searchDatas.split("#saleDate");

			for(let key in storage.searchList){
				if(splitStr[0] <= storage.searchList[key].split("#saleDate")[1]){
					if(storage.searchList[key].split("#saleDate")[1] <= splitStr[1]){
						dataArray.push(key);
					}
				}
			}
		}else{
			for(let key in storage.searchList){
				if(storage.searchList[key].indexOf(searchDatas) > -1){
					dataArray.push(key);
				}
			}
		}
	}
		
	return dataArray;
}

function searchMultiFilter(index, dataArray, arrayList){
	let arr = [], tempResultArray = [], resultArray = [];

	if(index > 1){
		for(let i = 0; i < dataArray.length; i++){
			if(arr[dataArray[i]]){
				arr[dataArray[i]]++;
			}else{
				arr[dataArray[i]] = 1;
			}
		}
	
		for(let key in arr){
			if(index == arr[key]){
				tempResultArray.push(key);
			}
		}

		for(let i = 0; i < tempResultArray.length; i++){
			resultArray.push(arrayList[tempResultArray[i]]);
		}
	}else{
		for(let i = 0; i < dataArray.length; i++){
			resultArray.push(arrayList[dataArray[i]]);
		}
	}

	return resultArray;
}

function searchDateDefaultSet(e){
	let thisDateInput = $(e), matchDateInput, thisDate, year, month, day;

	if(thisDateInput.data("date-type") === "from"){
		matchDateInput = thisDateInput.next().next();
		let splitDate = thisDateInput.val().split("-");
		thisDate = new Date(splitDate[0], parseInt(splitDate[1]-1), splitDate[2]);
		splitDate = matchDateInput.val().split("-");
		let matchDate = new Date(splitDate[0], parseInt(splitDate[1]-1), splitDate[2]);

		if(matchDateInput.val() === ""){
			thisDate.setDate(thisDate.getDate()+1);
		}else if(thisDate.getTime() > matchDate.getTime()){
			alert("시작일이 종료일보다 클 수 없습니다.");
			thisDate.setDate(thisDate.getDate()+1);
		}else{
			return null;
		}
	}else{
		matchDateInput = thisDateInput.prev().prev();
		let splitDate = thisDateInput.val().split("-");
		thisDate = new Date(splitDate[0], parseInt(splitDate[1]-1), splitDate[2]);
		splitDate = matchDateInput.val().split("-");
		let matchDate = new Date(splitDate[0], parseInt(splitDate[1]-1), splitDate[2]);

		if(matchDateInput.val() === ""){
			thisDate.setDate(thisDate.getDate()-1);
		}else if(thisDate.getTime() < matchDate.getTime()){
			alert("종료일이 시작일보다 작을 수 없습니다.");
			thisDate.setDate(thisDate.getDate()-1);
		}else{
			return null;
		}
	}

	year = thisDate.getFullYear();
	month = thisDate.getMonth()+1;
	day = thisDate.getDate();

	if(month < 10){
		month = "0" + month;
	}
	
	if(day < 10){
		day = "0" + day;
	}

	matchDateInput.val(year + "-" + month + "-" + day);	
}

function headerMyInfo(){
	let mainInfo, html = "";
	mainInfo = $("#mainInfo");

	html += "<i class=\"fa-regular fa-envelope fa-beat fa-2xl\" id=\"envelope\"></i>";
	// html += "<i class=\"fa-solid fa-envelope fa-shake fa-2xl\" id=\"envelope\"></i>";
	// html += "<i class=\"fa-regular fa-envelope-open fa-beat-fade fa-2xl\" id=\"envelope\"></i>";
	html += "<img id=\"myInfoImage\" src=\"/api/my/image\" >";
	html += "<a href=\"/mypage\">";
	html += "<span>" + storage.user[storage.my].userName + "</span>&nbsp;";
	html += "<span>" + storage.userRank[storage.user[storage.my].rank][0] + "</span>";
	html += "</a>";
	html += "<a href=\"/api/user/logout\" onclick=\"return confirm('로그아웃 하시겠습니까??');\"><i class=\"fa-solid fa-person-walking-arrow-right fa-xl\" id=\"logoutBtn\"></i></a>";

	mainInfo.html(html);	
	
	$("#logoutBtn").hover((e) => {
		$(e.target).removeAttr("class");
		$(e.target).attr("class", "fa-solid fa-person-walking-arrow-right fa-bounce fa-xl");
	}, () => {
		$("#logoutBtn").removeAttr("class");
		$("#logoutBtn").attr("class", "fa-solid fa-person-walking-arrow-right fa-xl");
	});
}

function plusBtnClick(e){
	let thisBtn;
	thisBtn = $(e);

	if(thisBtn.data("click") == false){
		thisBtn.html("<i class=\"fa-solid fa-xmark\"></i>");
		thisBtn.data("click", true);
		thisBtn.prev().find("button[data-status=\"true\"]").fadeIn(400);
	}else{
		thisBtn.html("<i class=\"fa-solid fa-ellipsis\"></i>");
		thisBtn.data("click", false);
		thisBtn.prev().find("button[data-status=\"true\"]").fadeOut();
	}
}

function plusMenuSelect(select){
	let btnItems, plusBtn;
	btnItems = $(".plusItems button");
	plusBtn = $("#plusBtn");

	plusBtn.data("click", true);
	plusBtnClick(plusBtn);
	btnItems.attr("data-status", false);
	btnItems.attr("onclick", "");

	for(let i = 0; i < select.length; i++){
		$(".plusItems button[data-keyword=\"" + select[i].keyword + "\"]").attr("data-status", true);
		$(".plusItems button[data-keyword=\"" + select[i].keyword + "\"]").attr("onclick", select[i].onclick);
	}
}