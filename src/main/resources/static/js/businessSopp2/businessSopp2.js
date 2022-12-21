let R = {}, prepareSopp, scrolledSopp, moveToTarget, drawChat, inputtedComment, deleteChat, cancleEdit, editSopp, changeSopp, editSoppSearch, soppStageUp, clickedDateInCalendar, drawMiniCalendar, clickedDateOnMiniCalendar, clickedTimeOnMiniCalendar, setDateTimeInScheduleDetail, clickedScheduleDetailConfirm, inputExpectedSales, changeExpectedDate;

$(document).ready(() => {
	let href, no;
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	href = location.href.split("/sopp2/");
	no = href.length > 1 ? href[href.length - 1] : null;
	no = no !== null && no.substring(no.length - 1) === "#" ? no.substring(0, no.length - 1) : no;
	no = no !== null ? no * 1 : null;
	prepareSopp(no);
});

// 달력의 날짜 클릭 이벤트 핸들러
clickedDateInCalendar = (el) => {
	let dt, sch;

	sch = new Schedule();
	dt = new Date(el.dataset.v * 1);
	sch.drawForRequestDetail(dt);
} // End of clickedDateInCalendar()

soppStageUp = (v) => {
	let href, no;

	if (v === 0) {
		href = location.href.split("/sopp2/");
		no = href.length > 1 ? href[href.length - 1] : null;
		no = no !== null ? no * 1 : null;
		window.open("/gw/estimate/" + no, '', 'width:60%');
		// gw/extimate/soppNo 넣으면 됨 

	}
} // End of soppStageUp()

prepareSopp = (no) => {
	if (no === null) {
		console.log("SOPP no is null!!!");
		return;
	}
	fetch(apiServer + "/api/project/sopp/" + no)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let data, sopp, projectOwner;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				console.log(data);
				R.projectOwner = data.projectOwner;
				R.chat = data.chat;
				R.sopp = new Sopp2(data.sopp);
				R.sopp.draw();
				drawChat();

				setTimeout(() => {
					EstimateSet = new EstimateSet();
					EstimateSet.soppEstimateNo(R.sopp.no);
					drawDetail(R.sopp.no);
				}, 1000);


			} else {
				console.log(response.msg);
			}
		});

} // End of prepareSopp()

// 편집 취소 함수
cancelEdit = (el) => {
	let x, y;
	if(el.dataset.n === "1"){
		el.parentElement.parentElement.parentElement.className = "sopp-history";
		el.parentElement.parentElement.nextElementSibling.innerHTML = "";
		el.parentElement.previousSibling.innerHTML = "";
	}else if(el.dataset.n === "2"){
		document.getElementsByClassName("sopp-desc")[0].children[0].children[1].contentEditable = false;
		document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[0].style.display = "initial";
		document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[1].style.display = "none";
		document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[2].style.display = "none";
		document.getElementsByClassName("sopp-desc")[0].children[1].style.display = "block";
		document.getElementsByClassName("sopp-desc")[0].children[3].style.display = "none";
		document.getElementsByClassName("sopp-desc")[0].children[1].innerHTML = R.sopp.desc;
		document.getElementsByClassName("sopp-desc")[0].children[0].children[1].innerText = R.sopp.title;
	}else if(el.dataset.n === "3"){
		document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[0].style = "";
		document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[1].style = "";
		document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[2].style = "";
		document.getElementsByClassName("sopp-expected")[0].children[0].children[2].disabled = true;
		document.getElementsByClassName("sopp-expected")[0].children[0].children[2].value = R.sopp.expactetSales.toLocaleString();
		document.getElementsByClassName("sopp-expected")[0].children[1].children[3].removeAttribute("onclick");
		x = R.sopp.expactedDate;
		if (x !== undefined && x !== null && typeof x === "object" && x.constructor.name === "Date") {
			y = "'" + (x.getFullYear() % 100) + ".";
			y += ((x.getMonth() + 1) + ".");
			y += x.getDate();
			document.getElementsByClassName("sopp-expected")[0].children[1].children[3].innerText = y;
		}
	}
	
} // End of cancelEdit()

editSopp = (n) => {
	let x, y, dept, arr, el1, el2, cnt = document.getElementsByClassName("container")[0].children[1];
	if (n === undefined || typeof n !== "string") return;

	switch (n) {
		case "owner":
			cnt.className = "sopp-search";
			document.getElementsByClassName("container")[0].children[1].children[5].children[0].dataset.n = n;
			cnt.children[4].style.padding = "0.7rem";
			cnt.children[4].innerHTML = storage.dept.tree.getTreeHtml();
			y = cnt.children[4].getElementsByTagName("label");
			cnt.children[3].children[0].innerHTML = "관리자 변경";
			cnt.children[3].children[1].children[1].style.display = "none";
			arr = [];
			for (x = 0; x < y.length; x++) {
				if (y[x].getAttribute("for") !== null && y[x].getAttribute("for").substring(0, 4) === "emp:" && R.sopp.owner !== y[x].getAttribute("for").substring(4) * 1) {
					y[x].setAttribute("onclick", "changeSopp('owner'," + y[x].getAttribute("for").substring(4) + ")");
				}
			}
			break;

		case "coWorker":
			cnt.className = "sopp-search";
			document.getElementsByClassName("container")[0].children[1].children[5].children[0].dataset.n = n;
			cnt.children[4].style.padding = "0.7rem";
			cnt.children[4].innerHTML = storage.dept.tree.getTreeHtml();
			y = cnt.children[4].getElementsByTagName("label");
			cnt.children[3].children[0].innerHTML = "담당자 변경";
			cnt.children[3].children[1].children[1].style.display = "";
			cnt.children[3].children[1].children[1].setAttribute("onclick", "changeSopp('coWorker')");
			arr = [];
			for (x = 0; x < y.length; x++) {
				if (y[x].getAttribute("for") !== null && y[x].getAttribute("for").substring(0, 4) === "emp:") {
					y[x].setAttribute("onclick", "if(this.dataset.s === undefined){this.dataset.s=1;this.children[0].style.backgroundColor='#ffe6e6'}else{delete this.dataset.s;this.children[0].style.backgroundColor=''}");
				}
			}
			break;

		case "partner":
		case "customer":
			cnt.className = "sopp-search";
			document.getElementsByClassName("container")[0].children[1].children[5].children[0].dataset.n = n;
			cnt.children[3].children[0].innerText = (n === "customer" ? "고객사" : "협력사") + " 변경";
			cnt.children[3].children[1].children[1].style.display = "none";
			cnt = cnt.children[4];
			cnt.style.padding = "0.7rem";
			if (n === "partner") {
				el1 = document.createElement("div");
				el1.setAttribute("onclick", "changeSopp('" + n + "', " + -1 + ")");
				el1.style.cursor = "pointer";
				cnt.appendChild(el1);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.innerText = "<없음>";
				el1.appendChild(el2);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.style.color = "gray";
				el1.appendChild(el2);
			}
			for (x in storage.customer) {
				if (x === undefined) continue;
				y = "...";
				y = storage.customer[x] !== undefined ? storage.customer[x].name : y;
				el1 = document.createElement("div");
				el1.setAttribute("onclick", "changeSopp('" + n + "', " + x + ")");
				el1.style.cursor = "pointer";
				cnt.appendChild(el1);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.innerText = y;
				el1.appendChild(el2);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.style.color = "gray";
				el2.innerText = x;
				el1.appendChild(el2);
			}
			cnt.nextElementSibling.children[0].focus();
			break;
		case "content":
			if(R.sopp.owner === storage.my || R.projectOwner === storage.my)	document.getElementsByClassName("sopp-desc")[0].children[0].children[1].contentEditable = true;
			document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[0].style.display = "none";
			document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[1].style.display = "initial";
			document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[2].style.display = "initial";
			document.getElementsByClassName("sopp-desc")[0].children[1].style.display = "none";
			document.getElementsByClassName("sopp-desc")[0].children[3].style.display = "block";
			CKEDITOR.instances['sopp-desc-edit'].setData(R.sopp.desc);
			if(R.sopp.owner === storage.my || R.projectOwner === storage.my)	document.getElementsByClassName("sopp-desc")[0].children[0].children[1].focus();
			break;
		case "expected":
			document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[0].style.display="none";
			document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[1].style.display="initial";
			document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[2].style.display="initial";
			document.getElementsByClassName("sopp-expected")[0].children[1].children[2].disabled = false;
			document.getElementsByClassName("sopp-expected")[0].children[1].children[3].setAttribute("onclick", "this.previousElementSibling.showPicker()");
			document.getElementsByClassName("sopp-expected")[0].children[0].children[2].disabled = false;
			document.getElementsByClassName("sopp-expected")[0].children[0].children[2].focus();
			break;
	}
} // End of editSopp()

changeSopp = (n, v) => {
	let x, y, arr, change, cnt = document.getElementsByClassName("container")[0].children[1];
	change = false;

	switch (n) {
		case "coWorker":
			y = cnt.children[4].getElementsByTagName("label");
			arr = [];
			for (x = 0; x < y.length; x++)	if (y[x].getAttribute("for") !== null && y[x].getAttribute("for").substring(0, 4) === "emp:" && y[x].dataset.s === "1" && y[x].getAttribute("for").substring(4) * 1 !== R.sopp.owner) arr.push(y[x].getAttribute("for").substring(4) * 1);
			cnt.children[3].children[1].children[1].removeAttribute("onclick");
			R.sopp.coWorker = arr;
			cnt = document.getElementsByClassName("sopp-info")[0].children[1].children[1].children[0];
			y = "";
			for(x = 0 ; x < arr.length ; x++)	y += ("<img src=\"/api/user/image/" + arr[x] + "\" class=\"profile-small\" />" + (storage.user[arr[x]] === undefined || storage.user[arr[x]].userName === undefined ? "" : storage.user[arr[x]].userName + " &nbsp;"));
			cnt.innerHTML = y;
			change = true;
			break;
		case "owner":
			R.sopp[n] = v === -1 ? undefined : v;
			document.getElementsByClassName("sopp-info")[0].children[0].children[1].children[0].innerHTML = "<img src=\"/api/user/image/" + v + "\" class=\"profile-small\" />" + (storage.user[v] === undefined || storage.user[v].userName === undefined ? "" : storage.user[v].userName + " ");
			change = true;
			break;
		case "partner":
			R.sopp[n] = v === -1 ? undefined : v;
			document.getElementsByClassName("sopp-info")[0].children[3].children[1].children[0].innerHTML = v === -1 ? "<없음>" :  v !== undefined && storage.customer[v] !== undefined && storage.customer[v].name !== undefined ? storage.customer[v].name : "";
			change = true;
			break;
		case "customer":
			R.sopp[n] = v === -1 ? undefined : v;
			document.getElementsByClassName("sopp-info")[0].children[2].children[1].children[0].innerHTML = storage.customer[v] !== undefined && storage.customer[v].name !== undefined ? storage.customer[v].name : "";
			change = true;
			break;
		case "content":
			R.sopp.title = document.getElementsByClassName("sopp-desc")[0].children[0].children[1].contentEditable = false;
			document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[0].style.display = "initial";
			document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[1].style.display = "none";
			document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[2].style.display = "none";
			document.getElementsByClassName("sopp-desc")[0].children[1].style.display = "block";
			document.getElementsByClassName("sopp-desc")[0].children[3].style.display = "none";
			x = CKEDITOR.instances['sopp-desc-edit'].getData();
			CKEDITOR.instances['sopp-desc-edit'].setData("");
			R.sopp.desc = x.replaceAll("\r", "").replaceAll("\n", "").replaceAll("\t", "");
			document.getElementsByClassName("sopp-desc")[0].children[1].innerHTML = R.sopp.desc;
			R.sopp.title = document.getElementsByClassName("sopp-desc")[0].children[0].children[1].innerText;
			document.getElementsByClassName("content-title")[0].children[0].innerHTML = "영업기회 : " + R.sopp.title;
			change = true;
			break;
		case "expected":
			document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[0].style = "";
			document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[1].style = "";
			document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[2].style = "";
			document.getElementsByClassName("sopp-expected")[0].children[0].children[2].disabled = true;
			x = document.getElementsByClassName("sopp-expected")[0].children[0].children[2].value;
			x.replaceAll(",", "") * 1;
			if(!isNaN(x))	R.sopp.expactetSales = x;
			x = document.getElementsByClassName("sopp-expected")[0].children[1].children[2].value;
			if(x !== "")	R.sopp.expactedDate = new Date(x);
			change = true;
			break;
	}
	document.getElementsByClassName("container")[0].children[1].className = "sopp-history";
	document.getElementsByClassName("container")[0].children[1].children[4].innerHTML = "";
	if(change = true)	R.sopp.update();
} // End of changeSopp()

editSoppSearch = (el) => {
	let x, y, cnt, els, el1, el2, v;
	v = el.value;
	cnt = el.parentElement.previousElementSibling;
	if (el.dataset.n === "owner" || el.dataset.n === "coWorker") {
		els = cnt.getElementsByTagName("label");
		for (x = 0; x < els.length; x++) {
			if (els[x].getAttribute("for") !== null && els[x].getAttribute("for").substring(0, 4) === "emp:") {
				if (v === "" || els[x].innerText.includes(v)) els[x].style.display = "";
				else els[x].style.display = "none";
			}
		}
	} else if (el.dataset.n === "customer" || el.dataset.n === "partner") {
		cnt.innerHTML = "";
		if (el.dataset.n === "partner") {
			el1 = document.createElement("div");
			el1.setAttribute("onclick", "changeSopp(" + el.dataset.n + ", " + -1 + ")");
			el1.style.cursor = "pointer";
			cnt.appendChild(el1);
			el2 = document.createElement("span");
			el2.style.fontSize = "0.8rem";
			el2.innerText = "<없음>";
			el1.appendChild(el2);
			el2 = document.createElement("span");
			el2.style.fontSize = "0.8rem";
			el2.style.color = "gray";
			el1.appendChild(el2);
		}
		for (x in storage.customer) {
			if (x === undefined) continue;
			y = "...";
			y = storage.customer[x] !== undefined ? storage.customer[x].name : y;
			if (v === "" || (y !== "..." && (x.includes(v) || y.includes(v)))) {
				el1 = document.createElement("div");
				el1.setAttribute("onclick", "changeSopp(" + el.dataset.n + ", " + x + ")");
				el1.style.cursor = "pointer";
				cnt.appendChild(el1);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.innerText = y;
				el1.appendChild(el2);
				el2 = document.createElement("span");
				el2.style.fontSize = "0.8rem";
				el2.style.color = "gray";
				el2.innerText = x;
				el1.appendChild(el2);
			}
		}
	}
} // End of editSoppSearch()

drawChat = () => {
	let x, y, chat, html, name, dt, cnt;

	cnt = document.getElementsByClassName("sopp-history")[0].children[1];
	html = "";
	for (x = 0; x < R.chat.length; x++) {
		chat = R.chat[x];
		dt = chat.created;
		if (dt !== undefined) {
			y = new Date(dt);
			dt = (y.getFullYear() % 100) + ".";
			dt += (y.getMonth() + 1) + ".";
			dt += y.getDate() + " ";
			dt += y.getHours() + ":";
			dt += y.getMinutes();
		} else dt = "";
		chat.message = chat.message.replaceAll("<", "&lt;");
		chat.message = chat.message.replaceAll(">", "&gt;");
		name = "...";
		if (storage.user[chat.writer] !== undefined && storage.user[chat.writer].userName !== undefined) name = storage.user[chat.writer].userName;
		html += "<div>";
		html += ("<img src=\"" + (chat.isNotice > 0 ? "/images/sopp2/info_circle.png" : "/api/user/image/" + chat.writer) + "\" class=\"profile-small\" />");
		html += ("<div class=\"history-employee\">" + name + "</div>");
		html += ("<div class=\"history-date\">" + dt + "</div>");
		if (chat.isNotice === 0 && chat.writer === storage.my) html += ("<img src=\"/images/sopp2/circle_close.png\" class=\"history-delete\" onclick=\"deleteChat(" + x + ")\" />");
		html += ("<div class=\"history-comment\">" + chat.message + "</div>");
		html += "</div>";
	}
	cnt.innerHTML = html;
} // End of drawChat()

// chat 삭제 처리 함수
deleteChat = (no) => {
	let idx;
	if (no === undefined || R.chat[no] === undefined) return;
	idx = R.chat[no].idx;

	fetch(apiServer + "/api/project/sopp/chat/" + idx, {
		method: "DELETE",
		header: { "Content-Type": "text/plain" },
	}).catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			if (response.result === "ok") {
				R.chat.splice(no, 1);
				drawChat();
			} else {
				console.log("error on deleteChat(" + no + ")");
			}
		});

} // End of deleteChat()

// chat 입력 처리 함수
inputtedComment = (el, event) => {
	let message, stage, sopp;
	if (!(el.tagName === "BUTTON" || event.key === "Enter")) return;
	if (el.tagName === "BUTTON") el = el.previousElementSibling;
	message = el.value;
	if (message === undefined || message === "") return;
	stage = R.sopp.stage;
	sopp = R.sopp.no;

	fetch(apiServer + "/api/project/sopp/chat/" + sopp + "/" + stage, {
		method: "POST",
		header: { "Content-Type": "text/plain" },
		body: cipher.encAes(message)
	}).catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let v = {};
			if (response.result === "ok") {
				document.getElementsByClassName("sopp-history")[0].children[2].children[0].value = "";
				v.idx = response.data;
				v.isNotice = 0;
				v.writer = storage.my;
				v.stage = R.sopp.stage;
				v.message = message;
				v.created = (new Date()).getTime();
				R.chat.push(v);
				drawChat();
			} else {
				document.getElementsByClassName("sopp-history")[0].children[2].children[0].focus();
			}
		});
} // End of inputtedComment()

scrolledSopp = (el) => {
	let x, y, z, v, els, position = [], vr = 60;

	v = el.scrollTop + vr;
	els = document.getElementsByClassName("sopp-sub-title");
	for (x = 0; x < els.length; x++)	position.push(els[x].offsetTop);

	for (x = 0; x < position.length; x++)   if (v < position[x]) break;

	els = document.getElementsByClassName("sopp-tab-cnt")[0].children;
	z = el.scrollHeight - el.offsetHeight + vr - 2;
	if (v > z) {
		for (y = 0; y < els.length; y++) {
			if (y < els.length - 1) els[y].className = "sopp-tab";
			else els[y].className = "sopp-tab-select";
		}
	} else {
		for (y = 0; y < els.length; y++) {
			if (y === x) els[y].className = "sopp-tab-select";
			else els[y].className = "sopp-tab";
		}
	}
} // End of scrolledSopp()

moveToTarget = (el) => {
	let target, name, vr = 83;
	name = el.dataset.target;
	target = document.getElementsByClassName(name)[0];
	target.parentElement.scrollTo({
		top: target.offsetTop - vr,
		left: 0,
		behavior: 'smooth'
	});
} // End of moveToTarget()

function drawDetail(soppNo) {
	let contNo;
	for (let i = 0; i < storage.contract.length; i++) {
		let contSopp = JSON.parse(storage.contract[i].related).parent.split(":");
		if (contSopp[1] == soppNo) {
			contNo = storage.contract[i].no;
		}
	}

	let cnt = document.getElementsByClassName("sopp-contract")[0];
	fetch(location.origin + "/api/contract/" + contNo)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			console.log(response);
			let data;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				R.contract = new Contract(data);
				R.contract.getReportDetail(cnt);

			} else {
				let none;
				R.contract = new Contract(none);
				R.contract.drawNone();
				console.log(response.msg);
			}
		});

} // End of drawDetail()


function getYmdSlashShort(date) {
	let d = new Date(date);
	return (
		(d.getFullYear() % 100) +
		"/" +
		(d.getMonth() + 1 > 9
			? (d.getMonth() + 1).toString()
			: "0" + (d.getMonth() + 1)) +
		"/" +
		(d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
	);
} // End of getYmdSlashShort()



function getYmdHypen(date) {
	let d = new Date(date);
	return (
		(d.getFullYear()) +
		"-" +
		(d.getMonth() + 1 > 9
			? (d.getMonth() + 1).toString()
			: "0" + (d.getMonth() + 1)) +
		"-" +
		(d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString())
	);
} // End of getYmdHypen()




// ================================= C L A S S _ D E C L A R A T I O N =================================

class Sopp2 {
	constructor(each) {
		this.no = each.no;
		this.stage = each.stage;
		this.title = each.title;
		this.desc = each.desc;
		this.owner = each.owner;
		this.coWorker = each.coWorker == undefined ? null : JSON.parse(each.coWorker);
		this.customer = each.customer;
		this.picOfCustomer = each.picOfCustomer;
		this.partner = each.partner;
		this.picOfPartner = each.picOfPartner;
		this.expactetSales = each.expactetSales;
		this.expactedDate = each.expactedDate === undefined ? null : new Date(each.expactedDate);
		this.related = each.related == undefined ? {} : JSON.parse(each.related);
		this.closed = each.closed == undefined ? null : new Date(each.closed);
		this.created = each.created == undefined ? null : new Date(each.created);
		this.modified = each.modified == undefined ? null : new Date(each.modified);
		this.calendar = [];
	}
	isClosed() { return this.closed !== null; }

	getEmployee(arr) {
		let x;
		if (arr === undefined || arr === null || arr.constructor.name !== "Array") arr = new Array();
		if (this.owner !== undefined && this.owner !== null && !arr.includes(this.owner)) arr.push(this.owner);
		if (this.coWorker != null) for (x = 0; x < this.coWorker.length; x++)	if (this.coWorker[x] !== undefined && this.coWorker[x] !== null && !arr.includes(this.coWorker[x])) arr.push(this.coWorker[x]);
		return arr;
	} // End of getEmployee()

	ownerName() {
		let owner, name = "...", html, x;
		owner = storage.user[this.owner];
		if (owner !== undefined && owner !== null) {
			owner = owner.userName;
			if (owner !== undefined && owner !== null) name = owner;
		}
		html = ("<img src=\"/api/user/image/" + this.owner + "\" class=\"employee_image\" /><span>" + name + "</span>")

		if (this.coWorker != null) for (x = 0; x < this.coWorker.length; x++) {
			name = "...";
			owner = storage.user[this.coWorker[x]];
			if (owner !== undefined && owner !== null) {
				owner = owner = owner.userName;
				if (owner !== undefined && owner !== null) name = owner;
			}
			html += ("<img src=\"/api/user/image/" + this.coWorker[x] + "\" class=\"employee_image\" /><span>" + name + "</span>")
		}

		return html;
	} // End of ownerName()

	draw() {
		let cnt, x, y, z, name, html, month = [], dt, el, cal;

		// 제목 설정
		cnt = document.getElementsByClassName("content-title")[0].children[0];
		cnt.innerText = "영업기회 : " + this.title;
		cnt = document.getElementsByClassName("sopp-desc")[0].children[0].children[1];
		cnt.innerText = this.title;

		// 본문 설정
		cnt = document.getElementsByClassName("sopp-desc")[0].children[1];
		cnt.innerHTML = this.desc;

		// 본문 에디터 설정
		ckeditor.config.readOnly = false;
		CKEDITOR.replace('sopp-desc-edit',
			{height:496,
			contentsCss:['http://cdn.ckeditor.com/4.20.1/full-all/contents.css',
					'https://ckeditor.com/docs/ckeditor4/4.20.1/examples/assets/css/classic.css'],
			removeButtons:"Source,Save,Templates,NewPage,Preview,Print,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About,Button,Select,Textarea,TextField,Radio,Checkbox,Form"
		});

		// 관리자
		cnt = document.getElementsByClassName("sopp-info")[0].children[0].children[1].children[0];
		name = "...";
		html = "<img src=\"/api/user/image/" + R.sopp.owner + "\" class=\"profile-small\" />";
		if (storage.user[R.sopp.owner] !== undefined && storage.user[R.sopp.owner].userName !== undefined) name = storage.user[R.sopp.owner].userName;
		html += name;
		cnt.innerHTML = html;
		// 관리자와 프로젝트 오너만 관리자를 변경할 수 있도록 함
		if(R.sopp.owner !== storage.my && R.projectOwner !== storage.my)	document.getElementsByClassName("sopp-info")[0].children[0].children[1].children[1].style.display = "none";

		// 담당자
		cnt = document.getElementsByClassName("sopp-info")[0].children[1].children[1].children[0];
		html = "";
		if (R.sopp.coWorker !== undefined && R.sopp.coWorker.constructor.name === "Array") for (x = 0; x < R.sopp.coWorker.length; x++) {
			name = "...";
			html += ("<img src=\"/api/user/image/" + R.sopp.coWorker[x] + "\" class=\"profile-small\" />");
			if (storage.user[R.sopp.coWorker[x]] !== undefined && storage.user[R.sopp.coWorker[x]].userName !== undefined) name = storage.user[R.sopp.coWorker[x]].userName;
			html += (name + " &nbsp;");
		}
		cnt.innerHTML = html;
		// 관리자와 프로젝트 오너만 담당자를 변경할 수 있도록 함
		if(R.sopp.owner !== storage.my && R.projectOwner !== storage.my)	document.getElementsByClassName("sopp-info")[0].children[1].children[1].children[1].style.display = "none";

		// 고객사
		cnt = document.getElementsByClassName("sopp-info")[0].children[2].children[1].children[0];
		name = "...";
		html = "";
		if (storage.customer[R.sopp.customer] !== undefined && storage.customer[R.sopp.customer].name !== undefined) name = storage.customer[R.sopp.customer].name;
		html += name;
		cnt.innerHTML = html;
		// 관리자와 프로젝트 오너만 고객사를 변경할 수 있도록 함
		if(R.sopp.owner !== storage.my && R.projectOwner !== storage.my)	document.getElementsByClassName("sopp-info")[0].children[2].children[1].children[1].style.display = "none";

		// 협력사
		cnt = document.getElementsByClassName("sopp-info")[0].children[3].children[1].children[0];
		html = "";
		name = "...";
		if (R.sopp.partner === undefined) name = "&lt;없음&gt;";
		else if (R.sopp.partner != undefined && typeof R.sopp.partner === "number") if (storage.customer[R.sopp.partner] !== undefined && storage.customer[R.sopp.partner].name !== undefined) name = storage.customer[R.sopp.partner].name;
		html += name;
		cnt.innerHTML = html;
		// 관리자와 프로젝트 오너만 협력사를 변경할 수 있도록 함
		if(R.sopp.owner !== storage.my && R.projectOwner !== storage.my)	document.getElementsByClassName("sopp-info")[0].children[3].children[1].children[1].style.display = "none";

		// ============= 예상매출
		// 예상매출액
		cnt = document.getElementsByClassName("sopp-expected")[0].children[0].children[2];
		x = 0;
		if (R.sopp.expactetSales !== undefined && R.sopp.expactetSales !== null && typeof R.sopp.expactetSales === "number") x = R.sopp.expactetSales.toLocaleString();
		cnt.value = x;
		// 시작일
		cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[0];
		x = R.sopp.created;
		y = "'" + (x.getFullYear() % 100) + ".";
		y += ((x.getMonth() + 1) + ".");
		y += x.getDate();
		cnt.innerText = y;
		// 예상매출일
		x = R.sopp.expactedDate;
		if (x !== undefined && x !== null && typeof x === "object" && x.constructor.name === "Date") {
			cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[3];
			y = "'" + (x.getFullYear() % 100) + ".";
			y += ((x.getMonth() + 1) + ".");
			y += x.getDate();
			cnt.innerText = y;
			// 날짜 진행바
			cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[1].children;
			x = R.sopp.expactedDate.getTime() - R.sopp.created.getTime();
			y = (new Date()).getTime() - R.sopp.created.getTime();
			x = Math.floor(y * 1000 / x) / 10;
			x = x < 0 ? 0 : x > 100 ? 100 : x;
			cnt[0].style.width = x + "%";
			cnt[1].style.left = "calc(" + x + "% - 0.3rem)";
		}
		// 관리자와 프로젝트 오너만 예상매출액/일를 변경할 수 있도록 함
		if(R.sopp.owner !== storage.my && R.projectOwner !== storage.my)	document.getElementsByClassName("sopp-expected")[0].children[0].children[2].style.display = "none";

		// 스테이지바
		html = "";
		y = ["<T>개</T><T>설</T>", "<T>접</T><T>촉<T>", "<T>제</T><T>안</T>", "<T>견</T><T>적</T>", "<T>협</T><T>상</T>", "<T>계</T><T>약</T>", "<T>종</T><T>료</T>"];

		cnt = document.getElementsByClassName("sopp-progress")[0];
		for (x = 0; x < y.length; x++) {
			html += ("<div " + (x < R.sopp.stage ? " class=\"sopp-done\"" : (x === R.sopp.stage ? " class=\"sopp-doing\"" : (x === R.sopp.stage + 1 ? " onclick=\"soppStageUp(" + R.sopp.stage + ")\" style=\"cursor:pointer;\"" : ""))) + ">" + y[x] + "</div>");
		}
		cnt.innerHTML = html;

		// 달력
		x = 0;
		y = new Date();
		y = new Date(y.getFullYear(), y.getMonth() + 1, 1);
		cnt = document.getElementsByClassName("sopp-calendar")[0];
		dt = new Date(this.created.getFullYear(), this.created.getMonth(), 1);
		month.push(dt);
		while (dt.getTime() < y.getTime()) {
			x++;
			dt = new Date(dt.getFullYear(), dt.getMonth() + 1, 1);
			month.push(dt);
			console.log(month);
			if (dt.getTime() > (new Date()).getTime()) break;
			if (x > 100) break;
		}
		month.push(new Date(dt.getFullYear(), dt.getMonth() + 1, 1));
		month.push(new Date(dt.getFullYear(), dt.getMonth() + 2, 1));
		month.push(new Date(dt.getFullYear(), dt.getMonth() + 3, 1));

		for (x = 0; x < month.length; x++) {
			el = document.createElement("div");
			cnt.appendChild(el);
			dt = month[x];
			cal = new BizCalendar(dt.getFullYear(), dt.getMonth() + 1, el);
			y = dt.getFullYear() * 100 + dt.getMonth() + 1;
			z = (new Date).getFullYear() * 100 + (new Date).getMonth() + 1;
			if(y === z)	el.style.display = "";
			else	el.style.display = "none";
			this.calendar.push(cal);
			cal.drawForSopp();
		}
	} // End of draw()

	drawList(cnt) {
		let el, x, z, lb = ["개설", "접촉", "제안", "견적", "협상", "계약", "종료"], html;

		if (this.stage < 6) cnt.className = cnt.className + " sopp-doing";
		else if (this.stage === 6) cnt.className = cnt.className + " sopp-done";
		else cnt.className = cnt.className + " sopp-fail";

		cnt.setAttribute("onclick", "location.href='/business/sopp2/" + this.no + "'");

		el = document.createElement("name");
		cnt.appendChild(el);
		el.innerText = this.title;

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = "예상매출액 : ₩ " + this.expactetSales.toLocaleString();

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerHTML = this.ownerName();

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = this.created.toISOString().substring(0, 10) + " » " + (this.expactedDate == null ? "미정" : this.expactedDate.toISOString().substring(0, 10));

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = "견적 : 0건";

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = "⋮";
		el.setAttribute("onclick", "showProjectMenu(this,2)");

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = "예상마진 : 99%";

		el = document.createElement("div");
		cnt.appendChild(el);
		el.className = "progress";
		html = "";
		for (x = 0; x < lb.length; x++)	html += ("<prgbar " + (this.stage > x ? "class=\"done\"" : (this.stage === x ? "class=\"doing\"" : "")) + ">" + lb[x] + "</prgbar>");
		el.innerHTML = html;

	} // End of draw()

	update() {
		let json = Object.assign({}, this), data;

		delete json.calendar;
		json.created = (json.created === undefined || json.created === null) ? null : json.created.getTime();
		json.closed = (json.closed === undefined || json.closed === null) ? null : json.closed.getTime();
		json.modified = (json.modified === undefined || json.modified === null) ? null : json.modified.getTime();
		json.expactedDate = (json.expactedDate === undefined || json.expactedDate === null) ? null : json.expactedDate.getTime();
		json.coWorker = (json.coWorker === undefined || json.coWorker === null) ? null : JSON.stringify(json.coWorker);
		json.related = (json.related === undefined || json.related === null) ? null : JSON.stringify(json.related);
		data = JSON.stringify(json);
		data = cipher.encAes(data);
		fetch(apiServer + "/api/project/sopp", {
			method: "POST",
			header: { "Content-Type": "text/plain" },
			body: data
		}).catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let sopp, prjNo, x;
				console.log(response);
				if (response.result === "ok") {
					x = response.data;
					x = cipher.decAes(x)
					x = JSON.parse(x);
					sopp = new Sopp2(x);
					console.log(sopp);
					prjNo = sopp.related.parent;
					if (prjNo !== undefined) prjNo = prjNo.split(":")[1];
					if (prjNo !== undefined && R !== undefined && R.project !== undefined && R.project.list !== undefined) {
						prjNo = prjNo * 1;
						for (x = 0; x < R.project.list.length; x++) {
							if (R.project.list[x].no === prjNo) {
								R.project.list[x].addSopp(sopp);
								R.project.list[x].draw();
								break;
							}
						}
					}

				} else {
					console.log(response.msg);
				}
			});
		console.log("UPDATE SOPP!!");
	}
} // End of Class _ Sopp2

class BizCalendar {
	constructor(year, month, container) {
		let startDate, endDate, dt = new Date();
		if (year === undefined || isNaN(year)) year = dt.getFullYear();
		if (month === undefined || isNaN(month)) month = dt.getMonth() + 1;
		startDate = new Date(year, month - 1, 1);
		endDate = new Date(new Date(year, month, 1).getTime() - 86400000);
		this.year = year;
		this.month = month;
		this.container = container === undefined ? null : container;
		this.container.dataset.v = year * 100 + month;
		this.startDate = new Date(startDate.getTime() - startDate.getDay() * 86400000); // 달력 시작하는 날짜 잡기
		this.endDate = new Date(endDate.getTime() + (6 - endDate.getDay()) * 86400000); // 달력 끝나는 날 찾기
	}
	drawForSopp() {
		let headCnt, bodyCnt, x, y, z, w, dt, weeks, html, bColor;
		if (this.container === null) return;
		bColor = ["#fbe4e8", "#cbf6ce", "#e4e3f1", "#ffd890", "#c8edff", "#F5DB02", "#ecc8ff", "#e3e3e3", "#ffdcf3", "#e4f3ca"];
		headCnt = document.createElement("div");
		headCnt.className = "calendar-head";
		bodyCnt = document.createElement("div");
		bodyCnt.className = "calendar-body";
		this.container.appendChild(headCnt);
		this.container.appendChild(bodyCnt);

		// 헤드부분 생성
		html = "<div><img src=\"/images/sopp2/triangle_left.png\" onclick=\"if(this.parentElement.parentElement.parentElement.previousElementSibling !== null){this.parentElement.parentElement.parentElement.previousElementSibling.style.display='';this.parentElement.parentElement.parentElement.style.display='none'}\"></div>";
		html += ("<div>" + (this.year + " / " + (this.month)) + "</div>");
		html += ("<div><img src=\"/images/sopp2/triangle_right.png\" onclick=\"if(this.parentElement.parentElement.parentElement.nextElementSibling !== null){this.parentElement.parentElement.parentElement.nextElementSibling.style.display='';this.parentElement.parentElement.parentElement.style.display='none'}\"></div>");
		html += ("<div></div>"); // 담당자별 일정 요약
		headCnt.innerHTML = html;

		// 바디부분 생성
		weeks = (this.endDate / 86400000 - this.startDate / 86400000 + 1) / 7;
		bodyCnt.className += (" calendar-week-" + weeks);
		html = "";
		for (x = 0; x < weeks; x++) {
			w = "<div>";
			for (y = 0; y < 7; y++) {
				dt = new Date(this.startDate.getTime() + (x * 7 + y) * 86400000);
				w += ("<div class=\"" + (dt.getMonth() + 1 !== this.month ? "other" : "this") + "-month\" data-v=\"" + dt.getTime() + "\" onclick=\"clickedDateInCalendar(this)\" ><div>" + dt.getDate() + "</div>");
				// w += ("<div><img src=\"/api/user/image/10044\" class=\"profile-small\">이장희</div>");
				w += ("</div>");
			}
			w += "</div>";
			html += w;
		}
		bodyCnt.innerHTML = html;
	} // End of drawForSopp()
} // End of Class _ BizCalendar

class Schedule{
	constructor(data){
		let v;
		if(data === null || data === undefined)	v = {
			no:-1,
			writer:storage.my,
			title:"제목",
			content:"",
			report:true,
			type:null,
			from:new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate(),9,0,0),
			to:new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate(),18,0,0),
			related:{},
			created:(new Date()).getTime(),
			modified:null
		};
		else v = data;
		this.no = v.no;
		this.writer = v.writer;
		this.title = v.title;
		this.content = v.title;
		this.report = v.report;
		this.type = v.type;
		this.from = v.from;
		this.to = v.to;
		this.related = v.related;
		this.created = v.create;
		this.modified = v.modified;
	}
	drawForRequestDetail(dt){
		let html, x, y, start, end, cnt, el, child;
		modal.show();
		modal.headTitle[0].innerText = "일정 신규 등록";

		// 시간 옵션
		start = 7;
		end = 21;

		// 모달 내 컨테이너 생성 및 부착
		cnt = document.createElement("div");
		cnt.className = "schedule-detail";
		cnt.dataset.ds = "x";
		cnt.dataset.de = "x";
		cnt.dataset.ts = "0900";
		cnt.dataset.te = "1800";
		modal.body[0].appendChild(cnt);

		// 본문 및 제목 엘리먼트 생성 및 부착
		el = document.createElement("div");
		cnt.appendChild(el);
		html = "<input placeholder=\"제목\" /><textarea name=\"schedule-detail-content\"></textarea>";
		el.innerHTML = html;

		// 날짜/시간 및 상세정보 컨테이너 생성 및 부착
		el = document.createElement("div");
		cnt.appendChild(el);

		// 날짜정보 엘리먼트 생성 및 부착
		child = document.createElement("label");
		child.setAttribute("for", "mini-calendar-check");
		el.appendChild(child);
		child.innerHTML = "<img src=\"/images/sopp2/icon_calendar.png\" />" + this.dateToStr();

		child = document.createElement("input");
		child.setAttribute("type", "checkbox");
		child.setAttribute("id", "mini-calendar-check");
		child.checked = false;
		el.appendChild(child);

		// 날짜 선택용 달력 컨테이너 생성 및 부착
		child = document.createElement("div");
		el.appendChild(child);
		x = document.createElement("div");
		x.innerHTML = drawMiniCalendar(new Date(dt.getFullYear(), dt.getMonth() - 1, 2));
		child.appendChild(x);
		x = document.createElement("div");
		x.innerHTML = drawMiniCalendar(dt);
		child.appendChild(x);
		x = document.createElement("div");
		x.innerHTML = drawMiniCalendar(new Date(dt.getFullYear(), dt.getMonth() + 1, 1));
		child.appendChild(x);

		// 타임 바 생성 및 부착
		child = document.createElement("div");
		el.appendChild(child);
		html = ("<div style=\"grid-template-columns:1px 2fr repeat(" + (end - start - 1) + ", 4fr) 2fr 1px;\"><div></div><div></div>")
		for(x = start + 1 ; x < end ; x++)	html += ("<div>" + x + "</div>");
		html += "<div></div></div>";
		html += ("<div style=\"grid-template-columns:1px repeat(" + ((end - start) * 2) + ",2fr) 1px;\" data-s=\"x\" data-e=\"0\"><span></span>");
		for(x = start ; x < end ; x++)	html += ("<div class=\"schedule-time-empty\" data-h=\"" + (x < 10 ? "0" + x : x) + "\" data-m=\"00\" onclick=\"clickedTimeOnMiniCalendar(this)\"></div><div class=\"schedule-time-empty\" data-h=\"" + (x < 10 ? "0" + x : x) + "\" data-m=\"30\" onclick=\"clickedTimeOnMiniCalendar(this)\"></div>");
		html += "<span></span></div></div>";
		child.innerHTML = html;

		// 상세정보 컨테이너 생성 및 부착
		child = document.createElement("div");
		el.appendChild(child);











		// 달력에 날짜 선택 표시
		y = (dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate()) + "";
		cnt.dataset.ds = y;
		child = document.getElementsByClassName("mini-calendar-cell");
		for(x = 0 ; x < child.length ; x++){
			if(child[x].dataset.v === y)	child[x].style.backgroundColor = "#c1eaff";
		}

		// 타임 바에 시간 선택 표시
		start = cnt.dataset.ts * 1;
		end = cnt.dataset.te * 1;
		child = cnt.children[1].children[3].children[1].children;
		for(x = 1 ; x < child.length - 1 ; x++){
			y = (child[x].dataset.h * 100) + (child[x].dataset.m * 1);
			if(y >= start && y < end)	child[x].className = "schedule-time-select";
		}

		// 기간 문자열 표시
		setDateTimeInScheduleDetail();

		// 컨텐트에 웹에디터 부착
		ckeditor.config.readOnly = false;
		CKEDITOR.replace("schedule-detail-content",
			{height:245,
			contentsCss:['http://cdn.ckeditor.com/4.20.1/full-all/contents.css',
					'https://ckeditor.com/docs/ckeditor4/4.20.1/examples/assets/css/classic.css'],
			removeButtons:"Source,Save,Templates,NewPage,Preview,Print,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About,Button,Select,Textarea,TextField,Radio,Checkbox,Form,Format,Styles"
		});
		//cnt.children[0].children[2].style.maxHeight = "20.5rem";
		//cnt.children[0].children[2].style.padding = "0.5rem";

		// 모달 버튼 설정
		modal.close[0].onclick = () => {CKEDITOR.instances['schedule-detail-content'].destroy();modal.hide();};
		modal.confirm[0].onclick = clickedScheduleDetailConfirm


		return;
	}
	dateToStr(){ // 시작 및 종료에 대한 문자열을 만들어주는 함수
		let str, s1, s2, e1, e2;
		s1 = "'" + (this.from.getFullYear() % 100) + "." + (this.from.getMonth() + 1) + "." + this.from.getDate();
		e1 = "'" + (this.to.getFullYear() % 100) + "." + (this.to.getMonth() + 1) + "." + this.to.getDate();
		s2 = (this.from.getHours() < 10 ? "0" + this.from.getHours() : this.from.getHours()) + ":" + (this.from.getMinutes() < 10 ? "0" + this.from.getMinutes() : this.from.getMinutes());
		e2 = (this.to.getHours() < 10 ? "0" + this.to.getHours() : this.to.getHours()) + ":" + (this.to.getMinutes() < 10 ? "0" + this.to.getMinutes() : this.to.getMinutes());
		str = "<date>" + s1 + " </date><time>" + s2 + "</time>";
		if(s1 === e1){
			str += ("<span> ~ </span><time>" + e2 + "</time>");
		}else{
			str = "<span> ~ </span><date>" + e1 + " </date><time>" + e2 + "</time>";
		}
		return str;
	}

} // End of Class _ Schedule

// 미니 달력을 그리는 함수
drawMiniCalendar = (date) => {
	let x, y, year, month, dt, html, startDate, endDate;
	
	year = date.getFullYear();
	month = date.getMonth();
	html = "<div>'" + (year % 100) + " / " + (month + 1) + "</div>";
	
	// 해당 월에서의 시작/끝 날짜 정리
	startDate = new Date(year, month , 1);
	startDate = new Date(startDate.getTime() - startDate.getDay() * 86400000);
	endDate = new Date(new Date(year, month + 1, 1).getTime() - 86400000);
	endDate = new Date(endDate.getTime() + (6 - endDate.getDay()) * 86400000);
	dt = startDate;

	// 달력 본문
	while(dt.getTime() <= endDate.getTime()) {
		x = (year * 10000) + ((month + 1) * 100) + dt.getDate();
		y = dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate();
		//if(dt.getDay() === 0)	html += "<div>";

		if(dt.getMonth() !== month)	html += "<span></span>";
		else	html += ("<span onclick=\"clickedDateOnMiniCalendar(this)\" class=\"mini-calendar-cell\" data-v=\"" + x + "\">" + dt.getDate() + "</span>");

		//if(dt.getDay() === 6)	html += "</div>";
		dt = new Date(dt.getTime() + 86400000);
	} // End of while
	return html;
} // End of drawMonthList()

clickedDateOnMiniCalendar = (el) => {
	let x, y, start, end, els, cnt;
	cnt = document.getElementsByClassName("schedule-detail")[0];
	els = cnt.getElementsByClassName("mini-calendar-cell");
	start = cnt.dataset.ds;
	end = cnt.dataset.de;

	if(start === "x"){ // 최초 클릭인 경우
		start = el.dataset.v * 1;
		cnt.dataset.ds = start;
		end = null;
		cnt.dataset.de = "x";
	}else if(end === "x"){ // 짝수번째 클릭인 경우
		end = el.dataset.v * 1;
		cnt.dataset.de = end;
		start = cnt.dataset.ds * 1;
	}else{ // 홀수번째 클릭인 경우
		end = null;
		cnt.dataset.de = "x";
		start = el.dataset.v * 1;
		cnt.dataset.ds = start;
	}

	// 시작 날짜가 종료날짜보다 큰 경우 두가지를 바꿈
	if(end !== null && start > end){
		x = start;
		start = end;
		end = x;
		cnt.dataset.ds = start;
		cnt.dataset.de = end;
	}

	if(end === null){ // 첫 번째 클릭인 경우 / 기간의 시작을 클릭
		for(x = 0 ; x < els.length ; x++)	els[x].style.backgroundColor = "";
		el.style.backgroundColor = "#c1eaff";
	}else{ // 두 번째 클릭인 경우 / 기간의 종료를 클릭
		for(x = 0 ; x < els.length ; x++){
			y = els[x].dataset.v * 1;
			if(y < start || y > end)	els[x].style.backgroundColor = "";
			else if(start === y || end === y)	el.style.backgroundColor = "#c1eaff";
			else	els[x].style.backgroundColor = "#eef9ff";
		}
	}
	setDateTimeInScheduleDetail();
} // End of clickedDateOnMiniCalendar()


clickedTimeOnMiniCalendar = (el) => {
	let cnt, dts, dte, start, end, x, y, z, els;
	cnt = document.getElementsByClassName("schedule-detail")[0];
	dts = cnt.dataset.ts;
	dte = cnt.dataset.te;
	els = el.parentElement.children;

	if(dte === "x"){ // 두번째 선택일 때
		start = dts;
		end = el.dataset.h + el.dataset.m;
		end = (((end * 1) % 100 === 30) ? (end * 1) + 70 : (end * 1) + 30) + "";
		if(start > end){
			x = end;
			end = start;
			start = x;
			end = (((end * 1) % 100 === 30) ? (end * 1) + 70 : (end * 1) + 30) + "";
			start = (((start * 1) % 100 === 30) ? (start * 1) - 30 : (start * 1) - 70) + "";
			cnt.dataset.ts = start;
		}
		cnt.dataset.te = end;
		for(x = 1 ; x < els.length - 1 ; x++){
			z = (els[x].dataset.h + els[x].dataset.m) * 1;
			if(z >= start * 1 && z < end * 1){
				els[x].className = "schedule-time-select";
			}
		}
	}else{ // 첫번째 선택일 때
		start = el.dataset.h + el.dataset.m;
		cnt.dataset.ts = start;
		cnt.dataset.te = "x";
		for(x = 1 ; x < els.length - 1 ; x++)	els[x].className = "schedule-time-empty";
		el.className = "schedule-time-select";
	}
	window.setTimeout(setDateTimeInScheduleDetail,50);
} // end of clickedTimeOnMiniCalendar()

setDateTimeInScheduleDetail = () => {
	let ds, de, ts, te, s1, s2, e1, e2, cnt = document.getElementsByClassName("schedule-detail")[0];
	ds = cnt.dataset.ds;
	de = cnt.dataset.de;
	de = de === "x" ? ds : de;
	ts = cnt.dataset.ts;
	te = cnt.dataset.te;
	if(te === "x"){
		te = ts * 1;
		if(te % 100 === 30)	te = (te + 70) + "";
		else	te = (te + 30) + "";
	}
	s1 = "'" + ds.substring(2,4) + "." + ds.substring(4,6) + "." + ds.substring(6,8);
	e1 = "'" + de.substring(2,4) + "." + de.substring(4,6) + "." + de.substring(6,8);
	s2 = ts.substring(0,2) + ":" + ts.substring(2,4);
	e2 = te.substring(0,2) + ":" + te.substring(2,4);
	str = "<img src=\"/images/sopp2/icon_calendar.png\" />" + "<date>" + s1 + " </date><time>" + s2 + "</time>";
	if(s1 === e1){
		str += ("<span> ~ </span><time>" + e2 + "</time>");
	}else{
		str += ("<span> ~ </span><date>" + e1 + " </date><time>" + e2 + "</time>");
	}
	cnt.children[1].children[0].innerHTML = str;
} // End of setDateTimeInScheduleDetail()

inputExpectedSales = (el) => {
	let v;
	v = el.value;
	v = v.replaceAll(/[^0-9]/g, "");
	v = v * 1;
	el.value = v.toLocaleString();
}// End of inputExpectedSales()

changeExpectedDate = (el) => {
	let x, yy, mm, dd, v = el.value;
	x = v.split("-");
	yy = (x[0] * 1) % 100;
	mm = x[1] * 1;
	dd = x[2] * 1;
	x = "'" + yy + "." + mm + "." + dd;
	el.nextElementSibling.innerText = x;
} // End of changeExpectedDate()

clickedScheduleDetailConfirm = () => {


	// 모달 내 에디터 제거
	CKEDITOR.instances['schedule-detail-content'].destroy();
} // End of clickedScheduleDetailConfirm()