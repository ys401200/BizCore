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

removeContextMenu = () => { let cm = document.getElementsByClassName("context-menu")[0]; if (cm !== undefined) cm.remove(); }

removeProject = (el) => {
	let x, y, v = el.dataset.v * 1;
	event.stopPropagation();
	el.remove();
	for (x = 0; x < R.project.list.length; x++) {
		if (R.project.list[x].no === v) {
			y = R.project.list[x];
			break;
		}
	}
	if (y === undefined) return;
	y.remove();

} // End of removeProject()

clickedProject = (el) => {
	let id, cnt;
	if (el === undefined) return;
	id = el.getAttribute("for");
	cnt = document.getElementById(id);
	if (cnt.checked) window.setTimeout(() => { cnt.checked = false }, 1);
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
	if (el !== undefined) el.remove();
	el = document.createElement("div");
	if (v !== undefined) el.dataset.v = v;
	cnt = document.getElementsByClassName("container")[0];
	cnt.appendChild(el);
	el.className = "context-menu";
	el.style.top = y + "px";
	el.style.left = x + "px";
	svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"20\" width=\"20\"><path fill=\"#bbbbbb\" d=\"M7.125 14 10 11.125 12.875 14 14 12.875 11.125 10 14 7.125 12.875 6 10 8.875 7.125 6 6 7.125 8.875 10 6 12.875ZM10 18.167q-1.688 0-3.177-.636-1.49-.635-2.604-1.75-1.115-1.114-1.75-2.604-.636-1.489-.636-3.177 0-1.708.636-3.187.635-1.48 1.75-2.594 1.114-1.115 2.604-1.75Q8.312 1.833 10 1.833q1.708 0 3.188.636 1.479.635 2.593 1.75 1.115 1.114 1.75 2.594.636 1.479.636 3.187 0 1.688-.636 3.177-.635 1.49-1.75 2.604-1.114 1.115-2.593 1.75-1.48.636-3.188.636Zm0-1.729q2.688 0 4.562-1.876 1.876-1.874 1.876-4.562t-1.876-4.562Q12.688 3.562 10 3.562T5.438 5.438Q3.562 7.312 3.562 10t1.876 4.562Q7.312 16.438 10 16.438ZM10 10Z\" /></svg>";
	html = "<div onclick='this.parentElement.remove()'>" + svg + "</div>";
	if (z === 1) { // 프로젝트의 컨텍스트 메뉴인 경우
		// SOPP 수를 확인하고 삭제 메뉴 표시여부 확인
		y = -1;
		for (x = 0; x < R.project.list.length; x++) {
			if (R.project.list[x].no === dataNo) {
				y = R.project.list[x].sopp.length;
				break;
			}
		}
		html += "<div onclick=\"focusProjectName(this)\">프로젝트명 변경</div><div onclick=\"focusProjectOwner(this)\">관리자 변경</div>";
		if (y === 0) html += "<div onclick=\"removeProject(this.parentElement)\">프로젝트 삭제</div>";
	} else if (z === 2) { // SOPP의 컨텍스트 메뉴인 경우
		html += "<div>담당자 관리</div><div>프로젝트 이동</div>";
	}
	el.innerHTML = html;
} // End of showProjectMenu()

focusProjectName = (el) => {
	let v, els, x;
	v = el.parentElement.dataset.v;
	els = document.getElementsByClassName("project-box");
	el.parentElement.remove();
	for (x = 0; x < els.length; x++) {
		if (els[x].getAttribute("for") === "project_" + v) {
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
	for (x in R.project.list) {
		if (R.project.list[x].no === no) {
			found = true;
			break;
		}
	}
	if (!found) return;
	if (R.project.list[x] !== undefined) {
		if (e.key === "Escape") {
			el.innerText = R.project.list[x].title;
			window.setTimeout(function () { el.contentEditable = false; }, 1);
			return;
		} else if (e.key === "Enter") {
			if (R.project.list[x].title !== name) {
				R.project.list[x].title = name;
				R.project.list[x].update();
			}
			window.setTimeout(function () { el.contentEditable = false; }, 1);
		}
		return;
	}
} // End of changeProjectName()

focusProjectOwner = (el) => {
	let v, els, x, prj, cnt;
	v = el.parentElement.dataset.v * 1;
	el.parentElement.remove();
	for (x in R.project.list) if (R.project.list[x].no === v) prj = R.project.list[x];
	if (prj === undefined) return;
	console.log(v);
	modal.show();
	document.getElementsByClassName("modalHeadTitle")[0].innerText = "관리자 변경 : " + prj.title;
	cnt = document.getElementsByClassName("modalBody")[0];
	cnt.dataset.no = prj.no;
	cnt.className = cnt.className + " deptTree";
	cnt.style.border = "none";
	cnt.style.margin = "0.3rem";
	cnt.style.width = "98%";
	cnt.style.maxHeight = "600px";
	cnt.innerHTML = storage.dept.tree.getTreeHtml();
	document.getElementsByClassName("confirm")[0].addEventListener("click", changeProjectOwner);
	document.getElementsByClassName("modal")[0].getElementsByClassName("close")[0].addEventListener("click", modal.hide);
} // End of focusProjectOwner()

changeProjectOwner = () => {
	let x, els, v, prj, no;
	els = document.getElementsByName("deptTreeSelectEmp");
	for (x = 0; x < els.length; x++)	if (els[x].checked) v = els[x].dataset.select;
	if (v !== undefined && v.substring(0, 3) === "emp") {
		no = document.getElementsByClassName("modalBody")[0].dataset.no * 1;
		for (x = 0; x < R.project.list.length; x++)	if (R.project.list[x].no === no) prj = R.project.list[x];
		if (prj === undefined) return;
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
	for (x = 0; x < els.length; x++)	if (els[x].className !== "deptName") els[x].setAttribute("onclick", "newSoppSelectEmployee(this,'" + el.dataset.name + "')");
} // End of newSoppSelectEmployee()

newSoppSelectEmployee = (el, name) => {
	let x, y, v, target, cnt = document.getElementsByClassName("new-sopp")[0].children[1];
	x = el.getAttribute("for");
	x = x.split(":")[1] * 1;
	if (name === "owner") {
		target = document.getElementsByClassName("new-sopp")[0].children[0].children[1].children[1];
		cnt.innerHTML = "";
		target.dataset.v = x;
		target.innerText = storage.user[x].userName;
		// 선택한 owner이 담당자 중에 있는 경우 이를 삭제처리함
		target = document.getElementsByClassName("new-sopp")[0].children[0].children[2].children[1];
		v = target.dataset.v;
		if (v !== undefined) {
			v = v.split(",");
			for (y = 0; y < v.length; y++)	v[y] = v[y] * 1;
			if (v.includes(x)) {
				v.splice(v.indexOf(x), 1)
				target = document.getElementsByClassName("new-sopp")[0].children[0].children[2].children[1];
				name = "";
				for (x = 0; x < v.length; x++)	name += (storage.user[v[x]].userName + " ");
				target.innerText = name;
				target.dataset.v = v.toString();
			}
		}
	} else {
		// 이미 선택한 sopp owner을 클릭할 경우 종료함
		v = document.getElementsByClassName("new-sopp")[0].children[0].children[1].children[1].dataset.v;
		v = v === undefined ? -1 : v * 1;
		if (v === x) return;
		// 기 저장된 값과 비교 후, 미선택인 경우 추가, 기선택인 경우 삭제
		target = document.getElementsByClassName("new-sopp")[0].children[0].children[2].children[1];
		v = target.dataset.v;
		v = v === "" ? undefined : v;
		if (v === undefined) {
			target.dataset.v = x;
			target.innerText = storage.user[x].userName;
		} else {
			v = v.split(",");
			for (y = 0; y < v.length; y++)	v[y] = v[y] * 1;
			if (v.includes(x)) v.splice(v.indexOf(x), 1)
			else v.push(x);
			name = "";
			for (x = 0; x < v.length; x++)	name += (storage.user[v[x]].userName + " ");
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
	for (x in storage.customer) {
		if (x === undefined) continue;
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
	if (target === "customer") target = document.getElementsByClassName("new-sopp")[0].children[0].children[3].children[1];
	else target = document.getElementsByClassName("new-sopp")[0].children[0].children[4].children[1];
	target.dataset.v = v;
	target.innerText = storage.customer[v].name;
	el.parentElement.innerHTML = "";
} // End of newSoppSelectCustomer()

searchCustomer = (el) => {
	let v, x, y, name, html, cnt = el.nextElementSibling;
	v = el.innerText.toLowerCase();
	y = ["", ""];
	html = "";
	for (x in storage.customer) {
		if (x === undefined) continue;
		name = "...";
		name = storage.customer[x] !== undefined ? storage.customer[x].name : name;
		y[0] = x + "";
		y[1] = name;
		y[0] = y[0].toLowerCase();
		y[1] = y[1].toLowerCase();
		if (v === "" || y[0].includes(v) || y[1].includes(v)) {
			html += ("<div class=\"new-sopp-customer\" onclick=\"newSoppSelectCustomer(this, " + x + ")\"><span>" + name + "</span>");
			html += ("<span>" + x + "</span></div>");
		}
	}
	cnt.innerHTML = html;
} // End of searchCustomer()

inputExpectedSales = (el) => {
	let v;
	v = el.value;
	v = v.replaceAll(/[^0-9]/g, "");
	v = v * 1;
	el.value = v.toLocaleString();


}// End of inputExpectedSales()
confirmNewSopp = () => {
	let x, v, target, value, sopp;
	target = [];
	value = [];
	for (x = 0; x < 7; x++) {
		target[x] = document.getElementsByClassName("new-sopp")[0].children[0].children[x].children[1];
		v = x === 0 ? target[x].innerText : x < 5 ? target[x].dataset.v : target[x].value;
		if ((x !== 2 && x !== 4) && (v === undefined || v === "")) {
			target[x].style.backgroundColor = "#ffeeee";
			if (x === 0 || x === 5) target[x].focus();
			else target[x].onclick();
			window.setTimeout(function () { target[x].style.backgroundColor = ""; }, 5000);
			return;
		}
		value[x] = v;
	}
console.log(" == 1 ==");
console.log(value);
	value[1] = value[1] * 1;
	v = value[2] === undefined ? [] : value[2].split(",");
	value[2] = [];
	for (x = 0; x < v.length; x++)	value[2].push(v[x] * 1);
	value[3] = value[3] * 1;
	value[4] = value[4] !== undefined ? value[4] * 1 : -1;
	value[5] = value[5].replaceAll(/[^0-9]/g, "") * 1;
	value[6] = new Date(value[6]);
	value[6] = value[6].getTime();
	value[7] = document.getElementsByClassName("new-sopp")[0].dataset.project * 1;
console.log(" == 2 ==");
console.log(value);
	v = {};
	v.no = -1;
	v.stage = 0;
	v.title = value[0];
	v.desc = null;
	v.owner = value[1];
	v.coWorker = JSON.stringify(value[2]);
	v.customer = value[3];
	v.picOfCustomer = null;
	v.partner = value[4] == -1 ? null : value[4];
	v.picOfPartner = null;
	v.expectedSales = value[5];
	v.expectedDate = value[6];
	v.related = "{\"parent\":\"project:" + value[7] + "\"}";
	v.closed = null;
	v.created = null;
	v.modified = null;
console.log(" == 3 ==");
console.log(v);
	sopp = new Sopp2(v);
	sopp.update();
	modal.hide();

} // End of confirmNewSopp()


// ================================= C L A S S _ D E C L A R A T I O N =================================

