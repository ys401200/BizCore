let R = {}, showProjectMenu, clickedProject, focusProjectName, changeProjectName, focusProjectOwner, changeProjectOwner, removeContextMenu, removeProject, newSoppSelectEmployee, newSoppSelectCustomer, newSoppSelectPartner, confirmNewSopp, newSoppShowCustomer, searchCustomer, inputExpectedSales;

$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	R.project = new Projects(location.origin, document.getElementsByClassName("project-list")[0]);
	document.getElementsByClassName("container")[0].addEventListener("click", removeContextMenu);
	
});

removeContextMenu = () => {let cm = document.getElementsByClassName("context-menu")[0];if(cm !== undefined)	cm.remove();}

removeProject = (el) => {
	let x, y, v = el.dataset.v * 1;
	event.stopPropagation();
	el.remove();
	for(x = 0 ; x < R.project.list.length ; x++){
		if(R.project.list[x].no === v){
			y = R.project.list[x];
			break;
		}
	}
	if(y === undefined)	return;
	y.remove();

} // End of removeProject()

clickedProject = (el) => {
	let id, cnt;
	if(el === undefined)	return;
	id = el.getAttribute("for");
	cnt = document.getElementById(id);
	if(cnt.checked)	window.setTimeout(()=>{cnt.checked = false},1);
} // End of clickedProject()

showProjectMenu = (target, z, v) => {
	let cnt, html, el, x, y, svg, dataType, dataNo;
	y = target.offsetTop - 1;
	x = target.offsetLeft - 80;
	event.preventDefault();
	event.stopPropagation();
	dataType = target.parentElement.parentElement.dataset.data;
	dataNo = target.parentElement.parentElement.dataset.no * 1;
	console.log(dataType + " / " + dataNo);
	el = document.getElementsByClassName("context-menu")[0];
	if(el !== undefined)    el.remove();
	el = document.createElement("div");
	if(v !== undefined)	el.dataset.v = v;
	cnt = document.getElementsByClassName("container")[0];
	cnt.appendChild(el);
	el.className = "context-menu";
	el.style.top = y + "px";
	el.style.left = x + "px";
	svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\"><path fill=\"#bbbbbb\" d=\"M7.125 14 10 11.125 12.875 14 14 12.875 11.125 10 14 7.125 12.875 6 10 8.875 7.125 6 6 7.125 8.875 10 6 12.875ZM10 18.167q-1.688 0-3.177-.636-1.49-.635-2.604-1.75-1.115-1.114-1.75-2.604-.636-1.489-.636-3.177 0-1.708.636-3.187.635-1.48 1.75-2.594 1.114-1.115 2.604-1.75Q8.312 1.833 10 1.833q1.708 0 3.188.636 1.479.635 2.593 1.75 1.115 1.114 1.75 2.594.636 1.479.636 3.187 0 1.688-.636 3.177-.635 1.49-1.75 2.604-1.114 1.115-2.593 1.75-1.48.636-3.188.636Zm0-1.729q2.688 0 4.562-1.876 1.876-1.874 1.876-4.562t-1.876-4.562Q12.688 3.562 10 3.562T5.438 5.438Q3.562 7.312 3.562 10t1.876 4.562Q7.312 16.438 10 16.438ZM10 10Z\" /></svg>";
	html = "<div onclick='this.parentElement.remove()'>" + svg + "</div>";
	if(z === 1){ // 프로젝트의 컨텍스트 메뉴인 경우
		// SOPP 수를 확인하고 삭제 메뉴 표시여부 확인
		y = -1;
		for(x = 0 ; x < R.project.list.length ; x++){
			if(R.project.list[x].no === dataNo){
				y = R.project.list[x].sopp.length;
				break;
			}
		}
		html += "<div onclick=\"focusProjectName(this)\">프로젝트명 변경</div><div onclick=\"focusProjectOwner(this)\">관리자 변경</div>";
		if(y === 0)	html += "<div onclick=\"removeProject(this.parentElement)\">프로젝트 삭제</div>";
	}else if(z === 2){ // SOPP의 컨텍스트 메뉴인 경우
		html += "<div>담당자 관리</div><div>프로젝트 이동</div>";
	}
	el.innerHTML = html;
} // End of showProjectMenu()

focusProjectName = (el) => {
	let v, els, x;
	v = el.parentElement.dataset.v;
	els = document.getElementsByClassName("project-box");
	el.parentElement.remove();
	for(x = 0 ; x < els.length ; x++){
		if(els[x].getAttribute("for") === "project_" + v){
			els[x].children[0].contentEditable = true;
			els[x].children[0].focus();
		}
	}
} // End of focusProjectName()

changeProjectName = (el, e) => {
	let prj, name, x, no, found = false;
	e.preventDefault();
	no = el.parentElement.getAttribute("for").substring(8) * 1;
	name = el.innerText.replaceAll("\n", "").replaceAll("\t", "");
	console.log(no + " / " + name);
	for(x in R.project.list){
		if(R.project.list[x].no === no){
			found = true;
			break;
		}
	}
	if(!found)	return;
	if(R.project.list[x] !== undefined){
		if(e.key === "Escape"){
			el.innerText = R.project.list[x].title;
			window.setTimeout(function(){el.contentEditable = false;},1);
			return;
		}else if(e.key === "Enter"){
			if(R.project.list[x].title !== name){
				R.project.list[x].title = name;
				R.project.list[x].update();
			}
			window.setTimeout(function(){el.contentEditable = false;},1);
		}
		return;
	}
} // End of changeProjectName()

focusProjectOwner = (el) => {
	let v, els, x, prj, cnt;
	v = el.parentElement.dataset.v * 1;
	el.parentElement.remove();
	for(x in R.project.list)	if(R.project.list[x].no === v)	prj = R.project.list[x];
	if(prj === undefined)	return;
	console.log(v);
	modal.show();
	document.getElementsByClassName("modalHeadTitle")[0].innerText = "관리자 변경 : " + prj.title;
	cnt = document.getElementsByClassName("modalBody")[0];
	cnt.dataset.no = prj.no;
	cnt.className = cnt.className + " deptTree";
	cnt.style.border = "none";
	cnt.style.margin = "0.3rem";
	cnt.style.width="98%";
	cnt.style.maxHeight = "600px";
	cnt.innerHTML = storage.dept.tree.getTreeHtml();
	document.getElementsByClassName("confirm")[0].addEventListener("click",changeProjectOwner);
	document.getElementsByClassName("modal")[0].getElementsByClassName("close")[0].addEventListener("click",modal.hide);
} // End of focusProjectOwner()

changeProjectOwner = () => {
	let x, els, v, prj, no;
	els = document.getElementsByName("deptTreeSelectEmp");
	for(x = 0 ; x < els.length ; x++)	if(els[x].checked)	v = els[x].dataset.select;
	if(v !== undefined && v.substring(0,3) === "emp"){
		no = document.getElementsByClassName("modalBody")[0].dataset.no * 1;
		for(x = 0 ; x < R.project.list.length ; x++)	if(R.project.list[x].no === no)	prj = R.project.list[x];
		if(prj === undefined)	return;
		modal.hide();
		prj.owner = v.substring(4) * 1;
		prj.update();
	}
} // End of changeProjectOwner()

newSoppShowEmployee = (el) => {
	let x, els, cnt = document.getElementsByClassName("new-sopp")[0].children[1];
	x = cnt.clientHeight;
	cnt.style.height = x + "px";
	cnt.style.display = "";
	cnt.style.padding = "";
	cnt.innerHTML = storage.dept.tree.getTreeHtml();
	els = cnt.getElementsByTagName("label");
	for(x = 0 ; x < els.length ; x++)	if(els[x].className !== "deptName")	els[x].setAttribute("onclick", "newSoppSelectEmployee(this,'" + el.dataset.name + "')");
} // End of newSoppSelectEmployee()

newSoppSelectEmployee = (el, name) => {
	let x, y, v, target, cnt = document.getElementsByClassName("new-sopp")[0].children[1];
	x = el.getAttribute("for");
	x = x.split(":")[1] * 1;
	if(name === "owner"){
		target = document.getElementsByClassName("new-sopp")[0].children[0].children[1].children[1];
		cnt.innerHTML = "";
		target.dataset.v = x;
		target.innerText = storage.user[x].userName;
		// 선택한 owner이 담당자 중에 있는 경우 이를 삭제처리함
		target = document.getElementsByClassName("new-sopp")[0].children[0].children[2].children[1];
		v = target.dataset.v;
		if(v !== undefined){
			v = v.split(",");
			for(y = 0 ; y < v.length ; y++)	v[y] = v[y] * 1;
			if(v.includes(x)){
				v.splice(v.indexOf(x),1)
				target = document.getElementsByClassName("new-sopp")[0].children[0].children[2].children[1];
				name = "";
				for(x = 0 ; x < v.length ; x++)	name += (storage.user[v[x]].userName + " ");
				target.innerText = name;
				target.dataset.v = v.toString();
			}	
		}
	}else{
		// 이미 선택한 sopp owner을 클릭할 경우 종료함
		v = document.getElementsByClassName("new-sopp")[0].children[0].children[1].children[1].dataset.v;
		v = v === undefined ? -1 : v * 1;
		if(v === x)	return;
		// 기 저장된 값과 비교 후, 미선택인 경우 추가, 기선택인 경우 삭제
		target = document.getElementsByClassName("new-sopp")[0].children[0].children[2].children[1];
		v = target.dataset.v;
		v = v === "" ? undefined : v;
		if(v === undefined){
			target.dataset.v = x;
			target.innerText = storage.user[x].userName;
		}else{
			v = v.split(",");
			for(y = 0 ; y < v.length ; y++)	v[y] = v[y] * 1;
			if(v.includes(x))	v.splice(v.indexOf(x),1)
			else				v.push(x);
			name = "";
			for(x = 0 ; x < v.length ; x++)	name += (storage.user[v[x]].userName + " ");
			target.innerText = name;
			target.dataset.v = v.toString();
		}
	}
} // End of newSoppSelectEmployee()

newSoppShowCustomer = (el) => {
	let x, html, name, target, cnt = document.getElementsByClassName("new-sopp")[0].children[1];
	target = el.dataset.name;
	x = cnt.clientHeight;
	cnt.style.height = x + "px";
	cnt.style.display = "grid";
	cnt.style.gridTemplateColumns = "1fr";
	cnt.style.gridTemplateRows = "1.75rem Auto";
	cnt.style.padding = "0";
	html = "<div onkeyup=\"searchCustomer(this)\" style=\"border-bottom:1px solid #b6b2ff;font-size:0.8rem;padding:0.3rem;\" contentEditable></div><div data-target=\"" + target + "\" style=\"overflow:auto;padding:0.5rem;\">";
	for(x in storage.customer){
		if(x === undefined)	continue;
		name = "...";
		name = storage.customer[x] !== undefined ? storage.customer[x].name : name;
		html += ("<div class=\"new-sopp-customer\" onclick=\"newSoppSelectCustomer(this, " + x + ")\"><span>" + name + "</span>");
		html += ("<span>" + x + "</span></div>");
	}
	html += "</div>";
	cnt.innerHTML = html;
	cnt.children[0].focus();
} // End of newSoppSelectCustomer()

newSoppSelectCustomer = (el, v) => {
	let target = el.parentElement.dataset.target;
	if(target === "customer")	target = document.getElementsByClassName("new-sopp")[0].children[0].children[3].children[1];
	else						target = document.getElementsByClassName("new-sopp")[0].children[0].children[4].children[1];
	target.dataset.v = v;
	target.innerText = storage.customer[v].name;
	el.parentElement.innerHTML = "";
} // End of newSoppSelectCustomer()

searchCustomer = (el) => {
	let v, x, y, name, html, cnt = el.nextElementSibling;
	v = el.innerText.toLowerCase();
	y = ["", ""];
	html = "";
	for(x in storage.customer){
		if(x === undefined)	continue;
		name = "...";
		name = storage.customer[x] !== undefined ? storage.customer[x].name : name;
		y[0] = x + "";
		y[1] = name;
		y[0] = y[0].toLowerCase();
		y[1] = y[1].toLowerCase();
		if(v === "" || y[0].includes(v) || y[1].includes(v)){
			html += ("<div class=\"new-sopp-customer\" onclick=\"newSoppSelectCustomer(this, " + x + ")\"><span>" + name + "</span>");
			html += ("<span>" + x + "</span></div>");
		}
	}
	cnt.innerHTML = html;
} // End of searchCustomer()

inputExpectedSales = (el) => {
	let v;
	v = el.value;
	v = v.replaceAll(/[^0-9]/g,"");
	v = v * 1;
	el.value = v.toLocaleString();


}// End of inputExpectedSales()
confirmNewSopp = () => {
	let x, v, target, value;
	target = [];
	value = [];
	for(x = 0 ; x < 7 ; x++){
		target[x] = document.getElementsByClassName("new-sopp")[0].children[0].children[x].children[1];
		v = x === 0 ? target[x].innerText : x < 5 ? target[x].dataset.v : target[x].value;
		if((x !== 2 && x !== 4)  && (v === undefined || v === "")){
			target[x].style.backgroundColor = "#ffeeee";
			if(x === 0 || x === 5) target[x].focus();
			else target[x].onclick();
			window.setTimeout(function(){target[x].style.backgroundColor = "";},5000);
			return;
		}
		value[x] = v;
	}
	value[1] = value[1] * 1;
	value[2] = value[2] !== undefined ? value[2] * 1 : -1;
	value[3] = value[3] * 1;
	value[4] = value[4] !== undefined ? value[4] * 1 : -1;
	value[5] = value[5].replaceAll(/[^0-9]/g,"") * 1;
	value[6] = new Date(value[6]);
	value[6] = value[6].getTime();

	console.log(value);

	// ===================================================
	// Sopp2 객체 만들고 서버로 post 하는 코드 필요
	// ===================================================
	
} // End of confirmNewSopp()


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
		let x, prj, el, child, svg;
		svg = "<svg onclick=\"R.project.newProject(this.parentElement.parentElement)\" xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" width=\"40\"><path stroke=\"#d1d1d1\" fill=\"#cccccc\" d=\"M18.625 28.417h2.917v-6.834h6.875v-2.916h-6.875v-7.084h-2.917v7.084h-7.042v2.916h7.042ZM20 36.958q-3.5 0-6.583-1.333-3.084-1.333-5.396-3.646-2.313-2.312-3.646-5.396Q3.042 23.5 3.042 20q0-3.542 1.333-6.625T8.021 8q2.312-2.292 5.396-3.625Q16.5 3.042 20 3.042q3.542 0 6.625 1.333T32 8q2.292 2.292 3.625 5.375 1.333 3.083 1.333 6.625 0 3.5-1.333 6.583-1.333 3.084-3.625 5.396-2.292 2.313-5.375 3.646-3.083 1.333-6.625 1.333Zm0-3.166q5.75 0 9.771-4.021Q33.792 25.75 33.792 20q0-5.75-4-9.771-4-4.021-9.792-4.021-5.75 0-9.771 4-4.021 4-4.021 9.792 0 5.75 4.021 9.771Q14.25 33.792 20 33.792ZM20 20Z\" /></svg>";
		for(x = 0 ; x < this.list.length ; x++){
			prj = this.list[x];
			el = document.createElement("div");
			this.container.appendChild(el);
			prj.draw(el);			
		}

		// 프로젝트 권한 검증 후 신규 프로젝트 생성 엘리먼트 추가
		// if(!storage.permission.all.project)	return;
		el = document.createElement("div");
		el.className = "project-wrap";
		this.container.appendChild(el);
		child = document.createElement("label");
		child.setAttribute("for", "project_new");
		child.className = "project-new";
		child.innerHTML = svg;
		el.appendChild(child);
	} // End of draw()

	newProject(cnt){
		let data;
		data = {no:-1,title:"프로젝트이름",desc:"프로젝트설명",owner:storage.my,related:{},closed:null,created:(new Date()).getTime(),modified:null};
		this.list[-1] = new Project(data);
		cnt.innerHTML = "";
		this.list[-1].draw(cnt);
		cnt.children[0].children[0].contentEditable = true;
		cnt.children[0].children[0].focus();
	} // End of newProject()

	newSopp(prjNo){
		let html, x, title, dt;
		console.log("--- add sopp  / project number is : " + prjNo);
		dt = new Date();
		dt.setMonth(dt.getMonth() + 3);
		modal.show();
		modal.headTitle[0].innerText = "영업기회 추가";

		html = "<div class=\"new-sopp\"><div><div><div>";
		title = "영업기회명";
		for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div contentEditable data-name=\"name\"></div></div>";

		html += "<div><div>";
		title = "관리자";
		for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div onclick=\"newSoppShowEmployee(this)\" data-name=\"owner\"></div></div>";

		html += "<div><div>";
		title = "담당자";
		for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div onclick=\"newSoppShowEmployee(this)\" data-name=\"coworker\"></div></div>";

		html += "<div><div>";
		title = "고객사";
		for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div onclick=\"newSoppShowCustomer(this)\" data-name=\"customer\"></div></div>";

		html += "<div><div>";
		title = "협력사";
		for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div onclick=\"newSoppShowCustomer(this)\" data-name=\"partner\"></div></div>";

		html += "<div><div>";
		title = "예상매출액";
		for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><input data-name=\"expectedSales\" style=\"text-align:right;\" onkeyup=\"inputExpectedSales(this)\" /></div>";

		html += "<div><div>";
		title = "예상납기";
		for(x = 0 ; x < title.length ; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><input type=\"date\" value=\"" + dt.toISOString().substring(0,10) + "\" data-name=\"expectedDate\" /></div></div><div></div></div>";


		modal.body[0].innerHTML = html;
		modal.confirm[0].onclick = confirmNewSopp;
		modal.close[0].onclick = modal.hide;
		// newSoppSelectEmployee() / newSoppSelectCustomer() / newSoppSelectPartner()
	} // End of newSopp()
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
		let el, child, x, y, z, sopp, arr, name, html, t, svg;
		svg = "<svg onclick=\"R.project.newSopp(this.parentElement.parentElement.parentElement.parentElement.dataset.no)\" xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" width=\"40\"><path stroke=\"#d1d1d1\" fill=\"#cccccc\" d=\"M18.625 28.417h2.917v-6.834h6.875v-2.916h-6.875v-7.084h-2.917v7.084h-7.042v2.916h7.042ZM20 36.958q-3.5 0-6.583-1.333-3.084-1.333-5.396-3.646-2.313-2.312-3.646-5.396Q3.042 23.5 3.042 20q0-3.542 1.333-6.625T8.021 8q2.312-2.292 5.396-3.625Q16.5 3.042 20 3.042q3.542 0 6.625 1.333T32 8q2.292 2.292 3.625 5.375 1.333 3.083 1.333 6.625 0 3.5-1.333 6.583-1.333 3.084-3.625 5.396-2.292 2.313-5.375 3.646-3.083 1.333-6.625 1.333Zm0-3.166q5.75 0 9.771-4.021Q33.792 25.75 33.792 20q0-5.75-4-9.771-4-4.021-9.792-4.021-5.75 0-9.771 4-4.021 4-4.021 9.792 0 5.75 4.021 9.771Q14.25 33.792 20 33.792ZM20 20Z\" /></svg>";

		if(cnt === undefined && this.cnt !== undefined)	cnt = this.cnt;
		else if(cnt !== undefined && this.cnt === undefined)	this.cnt = cnt;
		else if(cnt === undefined && this.cnt === undefined)	return;

		// 프로젝트 래퍼 클래스명 지정 및 데이터 타입 데이터 번호 세팅
		cnt.className = "project-wrap";
		cnt.dataset.data = "project";
		cnt.dataset.no = this.no;
		cnt.innerHTML = "";

		// 프로젝트 컨테이너 앞에 히든 라디오 삽입
		if(cnt.previousElementSibling === null || cnt.previousElementSibling.className !== "_hidden"){
			el = document.createElement("input");
		el.type = "radio";
		el.className = "_hidden";
		el.name = "project";
		el.id = "project_" + this.no;
		cnt.parentElement.insertBefore(el, cnt);
		}

		// 레이블 엘리먼트 생성
		el = document.createElement("label");
		cnt.appendChild(el);
		el.className = "project-box";
		el.setAttribute("for", "project_" +this.no);
		el.setAttribute("onclick", "clickedProject(this)");

		child = document.createElement("name");
		el.appendChild(child);
		child.innerText = this.title;
		child.setAttribute("onkeyup", "changeProjectName(this, event)");

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
		if(this.owner === storage.my){
			child.innerText = "⋮";
			child.setAttribute("onclick", "showProjectMenu(this,1,this.parentElement.getAttribute(\"for\").substring(8))");
		}else child.style.cursor = "initial";

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
		if(this.owner !== storage.my && this.sopp.length === 0){
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
			sopp.drawList(child);
		}

		if(this.owner === storage.my){
			child = document.createElement("div");
			child.className = "sopp-box sopp-add";
			child.innerHTML = "<span>" + svg + "</span>";
			el.appendChild(child);
		}
	} // End of draw()

	update() {
		let prj = Object.assign({}, this), data;
		delete prj.sopp;
		delete prj.cnt;
		prj.related = JSON.stringify(prj.related);
		if(prj.created !== null)	prj.created = prj.created.getTime();
		if(prj.closed !== null)	prj.closed = prj.closed.getTime();
		if(prj.modified !== null)	prj.modified = prj.modified.getTime();
		data = JSON.stringify(prj);
		data = cipher.encAes(data);
		console.log(this);
		fetch(apiServer + "/api/project",{
				method:"POST",
				header:{"Content-Type": "text/plain"},
				body:data
			}).catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let cnt, el, child, svg;
				svg = svg = "<svg onclick=\"R.project.newProject(this.parentElement.parentElement)\" xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" width=\"40\"><path stroke=\"#d1d1d1\" fill=\"#cccccc\" d=\"M18.625 28.417h2.917v-6.834h6.875v-2.916h-6.875v-7.084h-2.917v7.084h-7.042v2.916h7.042ZM20 36.958q-3.5 0-6.583-1.333-3.084-1.333-5.396-3.646-2.313-2.312-3.646-5.396Q3.042 23.5 3.042 20q0-3.542 1.333-6.625T8.021 8q2.312-2.292 5.396-3.625Q16.5 3.042 20 3.042q3.542 0 6.625 1.333T32 8q2.292 2.292 3.625 5.375 1.333 3.083 1.333 6.625 0 3.5-1.333 6.583-1.333 3.084-3.625 5.396-2.292 2.313-5.375 3.646-3.083 1.333-6.625 1.333Zm0-3.166q5.75 0 9.771-4.021Q33.792 25.75 33.792 20q0-5.75-4-9.771-4-4.021-9.792-4.021-5.75 0-9.771 4-4.021 4-4.021 9.792 0 5.75 4.021 9.771Q14.25 33.792 20 33.792ZM20 20Z\" /></svg>";
				if(response.result !== "ok")	console.log(response);
				else{
					this.draw();
					cnt = document.getElementsByClassName("project-new");
					if(cnt.length === 0){
						el = document.createElement("div");
						el.className = "project-wrap";
						R.project.container.appendChild(el);
						child = document.createElement("label");
						child.setAttribute("for", "project_new");
						child.className = "project-new";
						child.innerHTML = svg;
						el.appendChild(child);
					}
				}
			});
		console.log("UPDATE!!");
		console.log(prj);
	} // End of update()

	remove(){
		console.log("remove : " + this.no)
		fetch(apiServer + "/api/project/" + this.no,{method:"DELETE"})
		.catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let x, no, cnt, els;
			if(response.result === "ok"){
				no = response.data;
				els = document.getElementsByClassName("project-wrap");
				for(x = 0 ; x < els.length ; x++){
					if(els[x].dataset.data === "project" &&els[x].dataset.no * 1 === no){
						if(els[x].previousElementSibling != null && els[x].previousElementSibling.className === "_hidden")	els[x].previousElementSibling.remove();
						els[x].remove();
						break;
					}
				}
			}else console.log(response.msg);
		});
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
		for(x = 0 ; x < lb.length ; x++)	html += ("<prgbar " + (this.stage > x ? "class=\"done\"" : (this.stage === x ? "class=\"doing\"" : "")) + ";\">" + lb[x] + "</prgbar>");
		el.innerHTML = html;

	} // End of draw()
} // End of Class _ Sopp2