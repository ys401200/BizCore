let R = {}, prepareSopp, scrolledSopp, moveToTarget, drawChat, inputtedComment, deleteChat, cancleEdit;

$(document).ready(() => {
	let href, no
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	href = location.href.split("/sopp2/");
	no = href.length > 1 ? href[href.length - 1] : null;
	console.log(no);
	no = no !== null ? no * 1 :  null; 
	prepareSopp(no);	
});

prepareSopp = (no) => {
	if(no === null){
		console.log("SOPP no is null!!!");
		return;
	}
	fetch(apiServer + "/api/project/sopp/" + no)
	.catch((error) => console.log("error:", error))
	.then(response => response.json())
	.then(response => {
		let data, sopp, projectOwner;
		if(response.result === "ok"){
			data = response.data;
			data = cipher.decAes(data);
			data = JSON.parse(data);
			console.log(data);
			R.projectOwner = data.projectOwner;
			R.chat = data.chat;
			R.sopp = new Sopp2(data.sopp);
			R.sopp.draw();
			drawChat();
		}else{
			console.log(response.msg);
		}
	});

} // End of prepareSopp()

// 편집 취소 함수
cancleEdit = (el) => {
	el.parentElement.parentElement.parentElement.className = "sopp-history";
	el.parentElement.parentElement.nextElementSibling.innerHTML = "";
	el.parentElement.previousSibling.innerHTML = "";
} // End of cancleEdit()

drawChat = () => {
	let x, y, chat, html, name, dt, cnt;

	cnt = document.getElementsByClassName("sopp-history")[0].children[1];
	html = "";
	for(x = 0 ; x < R.chat.length ; x++){
		chat = R.chat[x];
		dt = chat.created;
		if(dt !== undefined){
			y = new Date(dt);
			dt = (y.getFullYear() % 100) + ".";
			dt += (y.getMonth() + 1) + ".";
			dt += y.getDate() + " ";
			dt += y.getHours() + ":";
			dt += y.getMinutes();
		}else dt = "";
		chat.message = chat.message.replaceAll("<","&lt;");
		chat.message = chat.message.replaceAll(">","&gt;");
		name = "...";
		if(storage.user[chat.writer] !== undefined && storage.user[chat.writer].userName !== undefined) name = storage.user[chat.writer].userName;
		html += "<div>";
		html += ("<img src=\"" + (chat.isNotice > 0 ? "/images/sopp2/info_circle.png" : "/api/user/image/" + chat.writer) + "\" class=\"profile-small\" />");
		html += ("<div class=\"history-employee\">" + name + "</div>");
		html += ("<div class=\"history-date\">" + dt + "</div>");
		if(chat.isNotice === 0 && chat.writer === storage.my) html += ("<img src=\"/images/sopp2/circle_close.png\" class=\"history-delete\" onclick=\"deleteChat(" + x + ")\" />");
		html += ("<div class=\"history-comment\">" + chat.message + "</div>");
		html += "</div>";
	}
	cnt.innerHTML = html;
} // End of drawChat()

// chat 삭제 처리 함수
deleteChat = (no) => {
	let idx;
	if(no === undefined || R.chat[no] === undefined)	return;
	idx = R.chat[no].idx;

	fetch(apiServer + "/api/project/sopp/chat/" + idx, {
		method: "DELETE",
		header: { "Content-Type": "text/plain" },
	}).catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			if(response.result === "ok"){
				R.chat.splice(no, 1);
				drawChat();
			}else{
				console.log("error on deleteChat(" + no + ")");
			}
		});

} // End of deleteChat()

// chat 입력 처리 함수
inputtedComment = (el, event) => {
	let message, stage, sopp;
	if(!(el.tagName === "BUTTON" || event.key === "Enter"))	return;
	if(el.tagName === "BUTTON")	el = el.previousElementSibling;
	message = el.value;
	if(message === undefined || message === "") return;
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
			if(response.result === "ok"){
				document.getElementsByClassName("sopp-history")[0].children[2].children[0].value = "";
				v.idx = response.data;
				v.isNotice = 0;
				v.writer = storage.my;
				v.stage = R.sopp.stage;
				v.message = message;
				v.created = (new Date()).getTime();
				R.chat.push(v);
				drawChat();
			}else{
				document.getElementsByClassName("sopp-history")[0].children[2].children[0].focus();
			}
		});
} // End of inputtedComment()

scrolledSopp = (el) => {
	let x, y, z, v, els, position = [], vr = 60;

	v = el.scrollTop + vr;
	els = document.getElementsByClassName("sopp-sub-title");
	for(x = 0 ; x < els.length ; x++)	position.push(els[x].offsetTop);

	for(x = 0 ; x < position.length ; x++)   if(v < position[x])  break;

	console.log(position);
	console.log("v : " + v + " / x : " + x);
	els = document.getElementsByClassName("sopp-tab-cnt")[0].children;
	z = el.scrollHeight - el.offsetHeight + vr - 2;
	if(v > z){
		for(y = 0 ; y < els.length ; y++){
			if(y < els.length - 1) els[y].className = "sopp-tab";
			else    els[y].className = "sopp-tab-select";
		}
	}else{
		for(y = 0 ; y < els.length ; y++){
			if(y === x) els[y].className = "sopp-tab-select";
			else    els[y].className = "sopp-tab";
		}
	}
} // End of scrolledSopp()

moveToTarget = (el) => {
	let target, name;
	name = el.dataset.target;
	target = document.getElementsByClassName(name)[0];
	target.scrollIntoView({"behavior":"smooth"});
} // End of moveToTarget()




// ================================= C L A S S _ D E C L A R A T I O N =================================

class Sopp2{
	constructor(each){
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
	}
	isClosed(){return this.closed !== null;}

	getEmployee(arr){
		let x;
		if(arr === undefined || arr === null || arr.constructor.name !== "Array")	arr = new Array();
		if(this.owner !== undefined && this.owner !== null && !arr.includes(this.owner))	arr.push(this.owner);
		if(this.coWorker != null)	for(x = 0 ; x < this.coWorker.length ; x++)	if(this.coWorker[x] !== undefined && this.coWorker[x] !== null && !arr.includes(this.coWorker[x]))	arr.push(this.coWorker[x]);
		return arr;
	} // End of getEmployee()

	ownerName(){
		let owner, name = "...", html, x;
		owner = storage.user[this.owner];
		if(owner !== undefined && owner !== null){
			owner = owner.userName;
			if(owner !== undefined && owner !== null)	name = owner;
		}
		html = ("<img src=\"/api/user/image/" + this.owner + "\" class=\"employee_image\" /><span>" + name + "</span>")

		if(this.coWorker != null)	for(x = 0 ; x < this.coWorker.length ; x++){
			name = "...";
			owner = storage.user[this.coWorker[x]];
			if(owner !== undefined && owner !== null){
				owner = owner = owner.userName;
				if(owner !== undefined && owner !== null)	name = owner;
			}
			html += ("<img src=\"/api/user/image/" + this.coWorker[x] + "\" class=\"employee_image\" /><span>" + name + "</span>")
		}

		return html;
	} // End of ownerName()

	draw(){
		let cnt, x, y, name, html;

		// 제목 설정
		cnt = document.getElementsByClassName("content-title")[0].children[0];
		cnt.innerText = "영업기회 : " + this.title;

		// 관리자
		cnt = document.getElementsByClassName("sopp-info")[0].children[0].children[1].children[0];
		name = "...";
		html = "<img src=\"/api/user/image/" + R.sopp.owner + "\" class=\"profile-small\" />";
		if(storage.user[R.sopp.owner] !== undefined && storage.user[R.sopp.owner].userName !== undefined)	name = storage.user[R.sopp.owner].userName;
		html += name;
		cnt.innerHTML = html;

		// 담당자
		cnt = cnt = document.getElementsByClassName("sopp-info")[0].children[1].children[1].children[0];
		html = "";
		if(R.sopp.coWorker !== undefined && R.sopp.coWorker.constructor.name === "Array")	for(x = 0 ; x < R.sopp.coWorker.length ; x++){
			name = "...";
			html += ("<img src=\"/api/user/image/" + R.sopp.coWorker[x] + "\" class=\"profile-small\" />");
			if(storage.user[R.sopp.coWorker[x]] !== undefined && storage.user[R.sopp.coWorker[x]].userName !== undefined)	name = storage.user[R.sopp.coWorker[x]].userName;
			html += (name + " ");
		}
		cnt.innerHTML = html;

		// 고객사
		cnt = document.getElementsByClassName("sopp-info")[0].children[2].children[1].children[0];
		name = "...";
		html = "";
		if(storage.customer[R.sopp.customer] !== undefined && storage.customer[R.sopp.customer].name !== undefined)	name = storage.customer[R.sopp.customer].name;
		html += name;
		cnt.innerHTML = html;

		// 협력사
		cnt = document.getElementsByClassName("sopp-info")[0].children[3].children[1].children[0];
		html = "";
		name = "...";
		if(R.sopp.partner === undefined)	name = "&lt;없음&gt;";
		else if(R.sopp.partner != undefined && typeof R.sopp.partner === "number")	if(storage.customer[R.sopp.partner] !== undefined && storage.customer[R.sopp.partner].name !== undefined)	name = storage.customer[R.sopp.partner].name;			
		html += name;
		cnt.innerHTML = html;

		// ============= 예상매출
		// 예상매출액
		cnt = document.getElementsByClassName("sopp-expected")[0].children[0].children[1];
		x = 0;
		if(R.sopp.expactetSales !== undefined && R.sopp.expactetSales !== null && typeof R.sopp.expactetSales === "number")	x = R.sopp.expactetSales.toLocaleString();
		cnt.innerText = x;
		// 시작일
		cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[0];
		x = R.sopp.created;
		y = "'" + (x.getFullYear() % 100) + ".";
		y += ((x.getMonth() + 1) + ".");
		y += x.getDate();
		cnt.innerText = y;
		// 예상매출일
		x = R.sopp.expactedDate;
		if(x !== undefined && x !== null && typeof x === "object" && x.constructor.name === "Date"){
			cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[2];
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

		// 스테이지바
		html = "";
		y = ["<T>개</T><T>설</T>", "<T>접</T><T>촉<T>", "<T>제</T><T>안</T>", "<T>견</T><T>적</T>", "<T>협</T><T>상</T>", "<T>계</T><T>약</T>", "<T>종</T><T>료</T>"];
		cnt = document.getElementsByClassName("sopp-progress")[0];
		for(x = 0 ; x < y.length ; x++){
			html += ("<div" + (x < R.sopp.stage ? " class=\"sopp-done\"" : (x === R.sopp.stage ? " class=\"sopp-doing\"" : (x === R.sopp.stage + 1 ? " onclick=\"soppStageUp(" + R.sopp.stage + ")\" style=\"cursor:pointer;\"" : ""))) + ">" + y[x] + "</div>");
		}
		cnt.innerHTML = html;
	} // End of draw()

	drawList(cnt){
		let el, x, z, lb = ["개설", "접촉", "제안", "견적", "협상", "계약", "종료"], html;

		if(this.stage < 6)			cnt.className = cnt.className + " sopp-doing";
		else if(this.stage === 6)	cnt.className = cnt.className + " sopp-done";
		else						cnt.className = cnt.className + " sopp-fail";

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
		el.innerText = this.created.toISOString().substring(0,10) + " » " +  (this.expactedDate == null ? "미정" :  this.expactedDate.toISOString().substring(0,10));

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
		for(x = 0 ; x < lb.length ; x++)	html += ("<prgbar " + (this.stage > x ? "class=\"done\"" : (this.stage === x ? "class=\"doing\"" : "")) + ">" + lb[x] + "</prgbar>");
		el.innerHTML = html;

	} // End of draw()

	update(){
		let json = Object.assign({}, this), data;
		
		json.created = (json.created === undefined || json.created === null) ? null : json.created.getTime();
		json.closed = (json.closed === undefined || json.closed === null) ? null : json.closed.getTime();
		json.modified = (json.modified === undefined || json.modified === null)	? null : json.modified.getTime();
		json.expactedDate = (json.expactedDate === undefined || json.expactedDate === null) ? null :  json.expactedDate.getTime();
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
				if(response.result === "ok"){
					x = response.data;
					x = cipher.decAes(x)
					x = JSON.parse(x);
					sopp = new Sopp2(x);
					console.log(sopp);
					prjNo = sopp.related.parent;
					if(prjNo !== undefined)	prjNo = prjNo.split(":")[1];
					if(prjNo !== undefined && R !== undefined && R.project !== undefined && R.project.list !== undefined){
						prjNo = prjNo * 1;
						for(x = 0 ; x < R.project.list.length ; x++){
							if(R.project.list[x].no === prjNo){
								R.project.list[x].addSopp(sopp);
								R.project.list[x].draw();
								break;
							}
						}
					}

				}else{
					console.log(response.msg);
				}
			});
		console.log("UPDATE SOPP!!");
	}
} // End of Class _ Sopp2