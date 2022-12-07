let R = {}, prepareSopp, scrolledSopp, moveToTarget, drawChat, inputtedComment;

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

drawChat = () => {
	let x, y, chat, html, name, dt, cnt = document.getElementsByClassName("sopp-history")[0].children[1];
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
		html += ("<div class=\"history-comment\">" + chat.message + "</div>");
		html += "</div>";
	}
	cnt.innerHTML = html;
} // End of drawChat()

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
		let cnt;

		cnt = document.getElementsByClassName("content-title")[0];
		cnt.innerText = "영업기회 : " + this.title;
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