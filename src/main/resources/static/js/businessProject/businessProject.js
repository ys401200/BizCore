let R = {}, showProjectMenu, clickedProject;

$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	R.project = new Projects(location.origin, document.getElementsByClassName("project-list")[0]);

	
});

clickedProject = (el) => {
	let id, cnt;
	if(el === undefined)	return;
	id = el.getAttribute("for");
	cnt = document.getElementById(id);
	if(cnt.checked)	window.setTimeout(()=>{cnt.checked = false},1);
} // End of clickedProject()

showProjectMenu = (target, z) => {
	let cnt, html, el, x, y;
	y = target.offsetTop + 20;
	x = target.offsetLeft - 80;
	event.preventDefault();
	el = document.getElementsByClassName("context-menu")[0];
	if(el !== undefined)    el.remove();
	el = document.createElement("div");
	cnt = document.getElementsByClassName("project-list")[0];
	cnt.appendChild(el);
	el.className = "context-menu";
	el.style.top = y + "px";
	el.style.left = x + "px";
	if(z === 1) html = "<div onclick='this.parentElement.remove()'>X</div><div>관리자 변경</div><div>프로젝트 닫기</div>";
	if(z === 2) html = "<div onclick='this.parentElement.remove()'>X</div><div>담당자 관리</div><div>프로젝트 이동</div>";
	el.innerHTML = html;
} // End of showProjectMenu()


// ================================= C L A S S _ D E C L A R A T I O N =================================

class Projects{
	constructor(_server, cnt){
		this.list = [];
		this.container = cnt;
		fetch(_server + "/api/project")
			.catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let data, arr, x;
				if(response.result !== "ok")	console.log(response.msg);
				else{
					data = cipher.decAes(response.data);
					arr = JSON.parse(data);
					for(x = 0 ; x < arr.length ; x++)	R.project.addProject(new Project(arr[x]));
					R.project.getSoppFromServer(_server);
				}
			});
	}
	addProject(prj){this.list.push(prj);}

	addSopp(sopp){
		let x;
		if(sopp === null || sopp === undefined || sopp.constructor.name !== "Sopp2" || sopp.related == undefined)	return false;
		for(x = 0 ; x < this.list.length ; x++)	if(sopp.related.parent === "project:" + this.list[x].no)	return this.list[x].addSopp(sopp);
		return false;
	} // End of addSopp()

	getSoppFromServer(_server){
		fetch(_server + "/api/project/sopp")
			.catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let data, arr, x;
				if(response.result !== "ok")	console.log(response.msg);
				else{
					data = cipher.decAes(response.data);
					arr = JSON.parse(data);
					for(x = 0 ; x < arr.length ; x++)	R.project.addSopp(new Sopp2(arr[x]));
					R.project.draw();
				}
			});
	} // End of setSopp()

	draw(){
		let x, prj, el;
		for(x = 0 ; x < this.list.length ; x++){
			prj = this.list[x];
			el = document.createElement("div");
			this.container.appendChild(el);
			prj.draw(el);			
		}
	} // End of draw()
}

class Project{
	constructor(each){
		this.no = each.no;
		this.title = each.title;
		this.desc = each.desc;
		this.owner = each.owner;
		this.related = each.related;
		this.closed = each.closed === undefined ? null : new Date(each.closed);
		this.created = each.created === undefined ? null : new Date(each.created);
		this.modified = each.modified === undefined ? null : new Date(each.modified);
		this.sopp = [];
	}
	isClosed(){return this.closed !== null;}
	getEmployee(arr){
		let x, sopp;
		if(arr === undefined || arr === null || arr.constructor.name !== "Array")	arr = new Array();
		if(this.sopp != null && this.sopp.length > 0)	for(x = 0 ; x < this.sopp.length ; x++)	arr = this.sopp[x].getEmployee(arr);
		return arr;
	}// End of getEmployee()
	ownerName(){
		let owner, name = "...";
		owner = storage.user[this.owner];
		if(owner !== undefined && owner !== null){
			owner = owner.userName;
			if(owner !== undefined && owner !== null)	name = owner;
		}
		return ("<img src=\"/api/user/image/" + this.owner + "\" class=\"employee_image\" /><span>" + name + "</span>");
	} // End of ownerName()
	addSopp(sopp){
		if(sopp === null || sopp === undefined || sopp.constructor.name !== "Sopp2")	return false;
		this.sopp.push(sopp);
		return true;
	} // End of addSopp()
	draw(cnt){
		let el, child, x, y, z, sopp, arr, name, html, t;

		// 프로젝트 래퍼 클래스명 지정
		cnt.className = "project-wrap";

		// 프로젝트 컨테이너 앞에 히든 라디오 삽입
		el = document.createElement("input");
		el.type = "radio";
		el.className = "_hidden";
		el.name = "project";
		el.id = "project_" + this.no;
		cnt.parentElement.insertBefore(el, cnt);

		// 레이블 엘리먼트 생성
		el = document.createElement("label");
		cnt.appendChild(el);
		el.className = "project-box";
		el.setAttribute("for", "project_" +this.no);
		el.setAttribute("onclick", "clickedProject(this)");

		child = document.createElement("name");
		el.appendChild(child);
		child.innerText = this.title;

		child = document.createElement("owner");
		el.appendChild(child);
		child.innerHTML = this.ownerName();

		// 담당자 이름 먼저 수집
		arr = this.getEmployee();
		html = "";
		for(x = 0 ; x < arr.length ; x++){
			name = "...";
			t = storage.user[arr[x]];
			if(t !== undefined && t !== null){
				t = t.userName;
				if(t !== undefined && t !== null)	name = t;
			}
			html += ("<img src=\"/api/user/image/" + arr[x] + "\" class=\"employee_image\" /><span>" + name + "</span>");
		}
		child = document.createElement("pic");
		el.appendChild(child);
		child.innerHTML = html;

		child = document.createElement("open");
		el.appendChild(child);
		child.innerText = "개설일 : " + this.created.toISOString().substring(0,10);

		child = document.createElement("setting");
		el.appendChild(child);
		child.innerText = "⋮";
		child.setAttribute("onclick", "showProjectMenu(this,1)");

		x = [0,0,0];
		y = [0,0,0];
		for(z = 0 ; z < this.sopp.length ; z++){
			if(this.sopp[z].stage < 6){
				x[0]++;
				y[0] += this.sopp[z].expactetSales;
			}else if(this.sopp[z].stage === 6){
				x[1]++;
				y[1] += this.sopp[z].expactetSales;
			}else{
				x[2]++;
				y[2] += this.sopp[z].expactetSales;
			}
		}
		z = [0,0,0];
		z[1] = Math.floor(y[1] / ((y[0] + y[1] + y[2]) / 100));
		z[1] = isNaN(z[1]) ? 0 : z[1];
		z[2] = Math.floor(y[2] / ((y[0] + y[1] + y[2]) / 100));
		z[2] = isNaN(z[2]) ? 0 : z[2];
		z[0] = 100 - (z[1] + z[2]);

		child = document.createElement("sopp");
		el.appendChild(child);
		child.innerHTML = "<div class=\"doing\" style=\"width:" + z[0] + "%\">" + x[0] + " / ₩ " + y[0].toLocaleString() + "</div><div class=\"done\" style=\"width:" + z[1] + "%\">" + x[1] + " / ₩ " + y[1].toLocaleString() + "</div><div class=\"fail\" style=\"width:" + z[2] + "%\">" + x[2] + " / ₩ " + y[2].toLocaleString() + "</div>";

		// SOPP 컨테이너 생성
		el = document.createElement("div");
		cnt.appendChild(el);
		el.className = "sopp-wrap";

		// (현재 미사용, 장래 사용할 것으로 예상됨)
		child = document.createElement("div");
		child.className = "sopp-summary";
		el.appendChild(child);
		if(this.sopp.length === 0){
			child = document.createElement("div");
			child.className = "sopp-box sopp-empty";
			child.innerHTML = "<span style='grid-column:span 4;display:flex;align-items:center;justify-content:center;color:gray;'>내용이 없습니다.</span>";
			el.appendChild(child);
		}else	for(x = 0 ; x < this.sopp.length ; x++){
			// 개별 SOPP를 담을 박스 생성
			sopp = this.sopp[x];
			child = document.createElement("div");
			child.className = "sopp-box";
			el.appendChild(child);
			sopp.draw(child);
		}
	}
} // End of Class _ Project

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
		this.closed = each.closed === undefined ? null : new Date(each.closed);
		this.created = each.created === undefined ? null : new Date(each.created);
		this.modified = each.modified === undefined ? null : new Date(each.modified);
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

	draw(cnt){
		let el, x, z, lb = ["개설", "접촉", "제안", "견적", "협상", "계약", "종료"], html;

		if(this.stage < 6)			cnt.className = cnt.className + " sopp-doing";
		else if(this.stage === 6)	cnt.className = cnt.className + " sopp-done";
		else						cnt.className = cnt.className + " sopp-fail";

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
		z = 100;
		for(x = 0 ; x < lb.length ; x++)	html += ("<prgbar " + (this.stage > x ? "class=\"done\"" : (this.stage === x ? "class=\"doing\"" : "")) + " style=\"z-index:" + (z--) + ";\">" + lb[x] + "</prgbar>");
		el.innerHTML = html;

	} // End of draw()
} // End of Class _ Sopp2