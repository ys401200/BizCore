let R = {}

$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	R.project = new Projects(location.origin, document.getElementsByClassName("project-list")[0]);
});


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

		this.container.innerHTML = html;
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
	addSopp(sopp){
		if(sopp === null || sopp === undefined || sopp.constructor.name !== "Sopp2")	return false;
		this.sopp.push(sopp);
		return true;
	} // End of addSopp()
	draw(cnt){
		let el, child;

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

		child = document.createElement("name");
		el.appendChild(child);
		child.innerText = this.title;

		child = document.createElement("owner");
		el.appendChild(child);
		child.innerText = this.owner;

		child = document.createElement("pic");
		el.appendChild(child);
		child.innerText = "담당자";

		child = document.createElement("open");
		el.appendChild(child);
		child.innerText = "개설일 : " + this.created;

		child = document.createElement("setting");
		el.appendChild(child);
		child.innerText = "⋮";
		el.setAttribute("onclick", "showProjectMenu(this,1)");

		child = document.createElement("sopp");
		el.appendChild(child);
		child.innerHTML = "<div class=\"doing\" style=\"width:20%\">3 / ₩ 234,000,000</div><div class=\"done\" style=\"width:65%\">12 / ₩ 1,234,000,000</div><div class=\"fail\" style=\"width:15%\">1 / ₩ 87,000,000</div>";

		// SOPP 컨테이너 생성
		el = document.createElement("div");
		cnt.appendChild(el);
		el.className = "sopp-wrap";
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
} // End of Class _ Sopp2