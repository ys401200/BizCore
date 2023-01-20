let R = {}, prepareSopp, scrolledSopp, inputExpectedSales, moveToTarget, drawChat, inputtedComment, deleteChat, cancelEdit, editSopp, changeSopp, editSoppSearch, soppStageUp, clickedDateInCalendar, getSavedLine, enteredSoppCalendarSchedule, leftSoppCalendarSchedule, clickedSoppCalendarSchedule, leftMonthlyCalendarTopEmp, enteredMonthlyCalendarTopEmp, clickedScheduleInSoppCalendar, confirmContracInSopp;
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

// 영업기회 내에서 계약 확인 창을 띄우는 함수
confirmContracInSopp = () => {

} // End of confirmContracInSopp()

// 영업기회 내 일정 목록에서 일정 클릭시 싱핼되는 함수
clickedScheduleInSoppCalendar = (el) => {
	let x, els, ym, idx;
	if (!el.checked) return;
	idx = el.dataset.idx * 1
	els = document.getElementsByClassName("sopp-calendar")[0].children;
	x = R.sopp.schedules[idx];
	ym = (x.from.getFullYear() * 100 + x.from.getMonth() + 1) + "";
	for (x = 0; x < els.length; x++) {
		if (els[x].dataset.v === ym) els[x].style = "";
		else els[x].style.display = "none";
	}
} // End of clickedScheduleInSoppCalendar()

// 월간 달력 상단 직원의 이름이 포커스 되었을 때의 이벤트 핸들러
enteredMonthlyCalendarTopEmp = (el) => {
	let cnt, els, x, emp;
	emp = el.dataset.emp;
	cnt = el.parentElement.parentElement.parentElement.children[1];
	els = cnt.getElementsByClassName("schedule-in-monthly-calendar");
	for (x = 0; x < els.length; x++) {
		if (els[x].dataset.emp === emp) els[x].style.backgroundColor = els[x].dataset.color;
		else els[x].style.backgroundColor = "#eeeeee";
	}
} // End of enteredMonthlyCalendarTopEmp()

// 월간 달력 상단 직원의 이름에서 포커스 해제 되었을 때의 이벤트 핸들러
leftMonthlyCalendarTopEmp = (el) => {
	let cnt, els, x;
	cnt = el.parentElement.parentElement.parentElement.children[1];
	els = cnt.getElementsByClassName("schedule-in-monthly-calendar");
	for (x = 0; x < els.length; x++)	els[x].style.backgroundColor = els[x].dataset.color;
} // End of leftMonthlyCalendarTopEmp()

// 서버에서 전자결재의 자주쓰는 결재선을 가져오는 함수
getSavedLine = () => {
	let url = "/api/gw/app/savedLine/" + storage.my;
	fetch(apiServer + url)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let data;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				if (R !== undefined) R.gwSavedLine = data;
			} else {
				console.log(response.msg);
			}
		});
} // End of getSavedLine()

prepareSopp = (no) => {
	if (no === null) console.log("SOPP no is null!!!");
	else fetch(apiServer + "/api/project/sopp/" + no)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let data, sopp, projectOwner;
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				R.projectOwner = data.projectOwner;
				R.chat = data.chat;
				R.sopp = new Sopp2(data.sopp);
				R.sopp.getSchedule();
				R.sopp.draw();
				drawChat();
				getSavedLine();
		
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

// 예상매출액/일 수정 버튼 이벤트 핸들러
inputExpectedSales = (el) => {
	let v;
	v = el.value;
	v = v.replaceAll(/[^0-9]/g, "");
	v = v * 1;
	el.value = v.toLocaleString();
}// End of inputExpectedSales()

// 편집 취소 함수
cancelEdit = (el) => {
	let x, y;
	if (el.dataset.n === "1") {
		el.parentElement.parentElement.parentElement.className = "sopp-history";
		el.parentElement.parentElement.nextElementSibling.innerHTML = "";
		el.parentElement.previousSibling.innerHTML = "";
	} else if (el.dataset.n === "2") {
		document.getElementsByClassName("sopp-desc")[0].children[0].children[1].contentEditable = false;
		document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[0].style.display = "initial";
		document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[1].style.display = "none";
		document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[2].style.display = "none";
		document.getElementsByClassName("sopp-desc")[0].children[1].style.display = "block";
		document.getElementsByClassName("sopp-desc")[0].children[3].style.display = "none";
		document.getElementsByClassName("sopp-desc")[0].children[1].innerHTML = R.sopp.desc;
		document.getElementsByClassName("sopp-desc")[0].children[0].children[1].innerText = R.sopp.title;
	} else if (el.dataset.n === "3") {
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
			if (R.sopp.owner === storage.my || R.projectOwner === storage.my) document.getElementsByClassName("sopp-desc")[0].children[0].children[1].contentEditable = true;
			document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[0].style.display = "none";
			document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[1].style.display = "initial";
			document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[2].style.display = "initial";
			document.getElementsByClassName("sopp-desc")[0].children[1].style.display = "none";
			document.getElementsByClassName("sopp-desc")[0].children[3].style.display = "block";
			CKEDITOR.instances['sopp-desc-edit'].setData(R.sopp.desc);
			if (R.sopp.owner === storage.my || R.projectOwner === storage.my) document.getElementsByClassName("sopp-desc")[0].children[0].children[1].focus();
			break;
		case "expected":
			document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[0].style.display = "none";
			document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[1].style.display = "initial";
			document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[2].style.display = "initial";
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
			for (x = 0; x < arr.length; x++)	y += ("<img src=\"/api/user/image/" + arr[x] + "\" class=\"profile-small\" />" + (storage.user[arr[x]] === undefined || storage.user[arr[x]].userName === undefined ? "" : storage.user[arr[x]].userName + " &nbsp;"));
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
			document.getElementsByClassName("sopp-info")[0].children[3].children[1].children[0].innerHTML = v === -1 ? "<없음>" : v !== undefined && storage.customer[v] !== undefined && storage.customer[v].name !== undefined ? storage.customer[v].name : "";
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
			x = x.replaceAll(",", "") * 1;
			if (!isNaN(x)) R.sopp.expectedSales = x;
			x = document.getElementsByClassName("sopp-expected")[0].children[1].children[2].value;
			if (x !== "") R.sopp.expectedDate = new Date(x);
			change = true;
			break;
	}
	document.getElementsByClassName("container")[0].children[1].className = "sopp-history";
	document.getElementsByClassName("container")[0].children[1].children[4].innerHTML = "";
	if (change = true) R.sopp.update();
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
	let x, y, z, v, els, position = [], vr = 64;

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
	let target, name, vr = 86;
	name = el.dataset.target;
	target = document.getElementsByClassName(name)[0];
	target.parentElement.scrollTo({
		top: target.offsetTop - vr,
		left: 0,
		behavior: 'smooth'
	});
} // End of moveToTarget()
function drawDetail(soppNo) {
	fetch(location.origin + "/api/contract/parent/sopp:" + soppNo)
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			console.log(response);
			let data, cnt = document.getElementsByClassName("sopp-contract")[0];
			if (response.result === "ok") {
				data = response.data;
				data = cipher.decAes(data);
				data = JSON.parse(data);
				R.contract = new Contract(data);
				R.contract.getReportDetail(cnt);
			    window.contractData = R.contract;
				
			} else {
				R.contract = new Contract(undefined);
				R.contract.drawNone();
				console.log(response.msg);
				window.contractData = undefined;
				
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

// 월간 달력 내 일정 클릭시 실행되는 함수
clickedSoppCalendarSchedule = (no) => {
	let el = document.getElementById("sopp-schedule-detail-radio" + no);
	el.checked = true;
	el.nextElementSibling.scrollIntoViewIfNeeded({ behavior: 'smooth' });
} // End of clickedSoppCalendarSchedule()