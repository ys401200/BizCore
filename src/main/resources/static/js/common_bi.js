let changeExpectedDate, clearStorage, editSchedule;

// 일정 수정 함수
editSchedule = (v) => {
	let x, sch;

	if(v === undefined)	sch = new Schedule()
	else if(v.constructor.name === "Object")	sch = new Schedule(v);
	else if(v.constructor.name === "Schedule")	sch = v;
	else if(v.constructor.name === "Number")	for(x = 0 ; x < R.sopp.schedules.length ; x++){
		if(R.sopp.schedules[x] !== undefined && R.sopp.schedules[x].no === v){
			sch = R.sopp.schedules[x];
			sch.popupModalForEdit(sch);
			break;
		}
	}
} // End of editSchedule()

// web storage 정리 함수
clearStorage = () => {
	let x;
	for(x in sessionStorage) sessionStorage.removeItem(x);
	for(x in localStorage) localStorage.removeItem(x);
} // end of clearStorage()

changeExpectedDate = (el) => {
	let x, yy, mm, dd, v = el.value;
	x = v.split("-");
	yy = (x[0] * 1) % 100;
	mm = x[1] * 1;
	dd = x[2] * 1;
	x = "'" + yy + "." + mm + "." + dd;
	el.nextElementSibling.innerText = x;
} // End of changeExpectedDate()

// 달력의 날짜 클릭 이벤트 핸들러
clickedDateInCalendar = (el) => {
	let dt;

	R.schedule = new Schedule();
	dt = new Date(el.dataset.v * 1);
	R.schedule.popupModalForEdit(dt, true);
} // End of clickedDateInCalendar()




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
		this.expectedSales = each.expectedSales;
		this.expectedDate = each.expectedDate === undefined ? null : new Date(each.expectedDate);
		this.related = each.related == undefined ? {} : JSON.parse(each.related);
		this.closed = each.closed == undefined ? null : new Date(each.closed);
		this.created = each.created == undefined ? null : new Date(each.created);
		this.modified = each.modified == undefined ? null : new Date(each.modified);
		this.estm = each.estm !== undefined ? each.estm : 0;
		this.calendar = [];
		this.colorTable = ["#daadc5", "#afadda", "#addac4", "#dac4ad", "#daadb2", "#dad0ad", "#daadd9", "#cddaad", "#adc2da", "#addac0", "#f6ffde", "#defcff", "#fedeff", "#dee7ff", "#e4ffde", "#ffdede", "#a688c9", "#88c9a7", "#c9a788", "#c0daad"];
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
		// 관리자와 프로젝트 오너만이 본문 및 제목을 수정할 수 있도록 함
		if(R.sopp.owner !== storage.my && R.projectOwner !== storage.my)	document.getElementsByClassName("sopp-desc")[0].children[0].children[2].children[0].style.display = "none";

		// 본문 에디터 설정
		ckeditor.config.readOnly = false;
		CKEDITOR.replace('sopp-desc-edit',
			{height:496,
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
		if (R.sopp.coWorker !== undefined && R.sopp.coWorker !== null && R.sopp.coWorker.constructor.name === "Array") for (x = 0; x < R.sopp.coWorker.length; x++) {
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
		if (R.sopp.expectedSales !== undefined && R.sopp.expectedSales !== null && typeof R.sopp.expectedSales === "number") x = R.sopp.expectedSales.toLocaleString();
		cnt.value = x;
		// 시작일
		cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[0];
		x = R.sopp.created;
		y = "'" + (x.getFullYear() % 100) + ".";
		y += ((x.getMonth() + 1) + ".");
		y += x.getDate();
		cnt.innerText = y;
		// 예상매출일
		x = R.sopp.expectedDate;
		if (x !== undefined && x !== null && typeof x === "object" && x.constructor.name === "Date") {
			cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[3];
			y = "'" + (x.getFullYear() % 100) + ".";
			y += ((x.getMonth() + 1) + ".");
			y += x.getDate();
			cnt.innerText = y;
			// 날짜 진행바
			cnt = document.getElementsByClassName("sopp-expected")[0].children[1].children[1].children;
			x = R.sopp.expectedDate.getTime() - R.sopp.created.getTime();
			y = (new Date()).getTime() - R.sopp.created.getTime();
			x = Math.floor(y * 1000 / x) / 10;
			x = x < 0 ? 0 : x > 100 ? 100 : x;
			cnt[0].style.width = x + "%";
			cnt[1].style.left = "calc(" + x + "% - 0.3rem)";
		}
		// 관리자와 프로젝트 오너만 예상매출액/일를 변경할 수 있도록 함
		if(R.sopp.owner !== storage.my && R.projectOwner !== storage.my)	document.getElementsByClassName("sopp-expected")[0].children[0].children[3].children[0].style.display = "none";

		// 스테이지바
		html = "";
		y = ["<T>개</T><T>설</T>", "<T>접</T><T>촉<T>", "<T>제</T><T>안</T>", "<T>견</T><T>적</T>", "<T>협</T><T>상</T>", "<T>계</T><T>약</T>", "<T>종</T><T>료</T>"];

		cnt = document.getElementsByClassName("sopp-progress")[0];
		for (x = 0; x < y.length; x++) {
			html += ("<div " + (x < R.sopp.stage ? " class=\"sopp-done\"" : (x === R.sopp.stage ? " class=\"sopp-doing\"" : (x === R.sopp.stage + 1 && (R.sopp.owner === storage.my || R.projectOwner === storage.my) ? " onclick=\"R.sopp.stageUp()\" style=\"cursor:pointer;\"" : " style=\"cursor:default;\""))) + ">" + y[x] + "</div>");
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
			cal = new MonthlyCalendar(dt.getFullYear(), dt.getMonth() + 1, el);
			y = dt.getFullYear() * 100 + dt.getMonth() + 1;
			z = (new Date).getFullYear() * 100 + (new Date).getMonth() + 1;
			if(y === z)	el.style.display = "";
			else	el.style.display = "none";
			this.calendar.push(cal);
			cal.drawForSopp();
		}
	} // End of draw()

	// 화면에 그려진 달력에 일정을 채우는 메서드
	setScheduleToCalendar(){
		let c, x, y, z, name, cnt, emp = [], color = {}, html, type;
		type = {"outside":"외근/출장","inside":"내근","education":"교육","vacation":"휴가"};
		//직원별 색상 부여
		emp = this.getEmployee();
		for(x = 0 ; x < R.sopp.schedules.length ; x++)	if(!emp.includes(R.sopp.schedules[x].writer))	emp.push(R.sopp.schedules[x].writer);
		for(x = 0 ; x < emp.length ; x++)	color[emp[x]] = this.colorTable[x];
		this.empColor = color;
		// 캘린더에 스케줄을 추가해 줌
		for(x = 0 ; x < R.sopp.calendar.length ; x++)	for(y = 0 ; y < R.sopp.schedules.length ; y++)	R.sopp.calendar[x].addSchedule(R.sopp.schedules[y]);
		//캘린더에 스케줄을 그려넣어줌
		for(x = 0 ; x < R.sopp.calendar.length ; x++)	R.sopp.calendar[x].drawScheduleInSopp(color);
		// 전체 일정 리스트를 달력 우측에 그려 넣음
		cnt = document.getElementsByClassName("sopp-schedule-detail")[0];
		for(x = 0 ; x < R.sopp.schedules.length ; x++){
			z = R.sopp.schedules[x];
			c = "#dddddd";
			c = color[z.writer] !== undefined ? color[z.writer] : color;
			name = "...";
			name = storage.user[z.writer] !== undefined && storage.user[z.writer].userName !== undefined ? storage.user[z.writer].userName : name;
			y = document.createElement("input");
			y.setAttribute("type","radio");
			y.className = "sopp-schedule-detail-radio";
			y.name = "sopp-schedule-detail-radio";
			y.id = "sopp-schedule-detail-radio" + z.no;
			y.dataset.idx = x;
			y.setAttribute("onchange", "clickedScheduleInSoppCalendar(this)");
			cnt.appendChild(y);
			y = document.createElement("label");
			y.setAttribute("for","sopp-schedule-detail-radio" + z.no);
			// 상단 제목, 날짜 등
			html = "<div><circle style=\"background-color:" + c + ";\">✔</circle><title>" + z.title + "</title></div>";
			html += ("<div><name>" + name + "</name><tp>" + (type[z.type]) + "</tp>" + z.dateToStr());
			// 본인 작성 일정에 대해 편집 버튼 생성
			if(z.writer == storage.my)	html += ("<img src=\"/images/sopp2/edit_square.png\" onclick=\"editSchedule(" + z.no + ")\" />");
			html += "</div>";
			// 장소 등 세부내용
			html += "<div>";
			if(z.permitted !== undefined){
				html += ("<scs><sct>전자결재</sct><scd>" + (z.permitted === 0 ? "진행중" : z.permitted === 0 ? "승인" : "미승인") + "</scd></scs>");
			}
			if(z.related.place !== undefined){
				html += "<scs><sct>장소</sct><scd>";
				html +=(z.related.place === "customer" ? "고객사" : z.related.place === "partner" ? "협력사" : z.related.place === "office" ? "사무실" : z.related.place.substring(4));
				html += "</scd></scs>";
			}
			if(z.related.typeOfDetail !== undefined){
				html += ("<scs><sct>종류</sct><scd>" + z.related.typeOfDetail + "</scd></scs>");
			}
			if(z.related.method !== undefined){
				html += ("<scs><sct>방법</sct><scd>" + z.related.method + "</scd><scs>");
			}
			html += "</div>";
			// 본문
			html += ("<div>" + z.content + "</div>");
			y.innerHTML = html;
			cnt.appendChild(y);

			// 상단 탭에 일정의 수를 표시함
			x = 0;
			if(R.sopp !== undefined && R.sopp.schedules !== undefined && R.sopp.schedules.constructor.name === "Array")	x = R.sopp.schedules.length;
			cnt = document.getElementsByClassName("sopp-tab-cnt")[0].children[1].children[2];
			cnt.innerHTML = "<span> " + x + " </span>";
		}
	} // End of setScheduleToCalendar()

	// 서버에서 일정을 가져오는 메서드
	getSchedule(){
		fetch(apiServer + "/api/schedule2/sopp/" + this.no)
			.catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let data, schedule, x, arr = [];
				if (response.result === "ok") {
					data = response.data;
					data = cipher.decAes(data);
					data = JSON.parse(data);
					for(x = 0 ; x < data.length ; x++){
						schedule = new Schedule(data[x]);
						arr.push(schedule);
					}
					arr.sort(function(a,b){return a.from - b.from});
					R.sopp.schedules = arr;
					R.sopp.setScheduleToCalendar();
				} else {
					console.log(response.msg);
				}
			});
	} // End of getSchedule()

	// 프로젝트에서 영업기회 목록을 그리는 메서드
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
		el.innerText = "예상매출액 : ₩ " + this.expectedSales.toLocaleString();

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerHTML = this.ownerName();

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = this.created.toISOString().substring(0, 10) + " » " + (this.expectedDate == null ? "미정" : this.expectedDate.toISOString().substring(0, 10));

		el = document.createElement("div");
		cnt.appendChild(el);
		el.innerText = "견적 : " + this.estm + "건";

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

	stageUp(){
		let soppNo;
	
		if(this.stage < 4){ // 협상 전 단계일 때
			this.stage += 1;
			this.update();
		}else if (this.stage === 4) { // 협상 단계일 때
			soppNo = this.no;
			window.setTimeout(() => {
				setPrevModal(soppNo)
			}, 2000);
		}else if (this.stage === 5){ // 계약 단계일 때 / 성공 혹은 실패 선택

		}
	
	
	} // End of stageUp()

	update() {
		let json = Object.assign({}, this), data;

		delete json.calendar;
		delete json.colorTable;
		delete json.schedules;
		delete json.empColor;
		json.created = (json.created === undefined || json.created === null) ? null : json.created.getTime();
		json.closed = (json.closed === undefined || json.closed === null) ? null : json.closed.getTime();
		json.modified = (json.modified === undefined || json.modified === null) ? null : json.modified.getTime();
		json.expectedDate = (json.expectedDate === undefined || json.expectedDate === null) ? null : json.expectedDate.getTime();
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

} // End of Class === Sopp2 ===========================================================================

class MonthlyCalendar {
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
		this.schedule = [];
		this.color = {};
	}

	// 일정을 추가하는 메서드
	addSchedule(sch){
		if(sch === undefined || sch === null || !(typeof sch === "object" && sch.constructor.name === "Schedule"))	return;
		if(sch.from > this.endDate || sch.to < this.from)	return;
		this.schedule.push(sch);
	} // End of addSchedule()

	// 영업기회에 달력을 그리는 메서드
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
		//html = "<div style=\"grid-area:cal-type;\"><span>연</span><span>월</span><span>주</span></div>";
		html = "<div style=\"grid-area:cal-type;\"></div>";
		html += "<div style=\"grid-area:prv-month;\"><img src=\"/images/sopp2/triangle_left.png\" onclick=\"if(this.parentElement.parentElement.parentElement.previousElementSibling !== null){this.parentElement.parentElement.parentElement.previousElementSibling.style.display='';this.parentElement.parentElement.parentElement.style.display='none'}\"></div>";
		html += ("<div style=\"grid-area:crnt-month;\">" + (this.year + " / " + (this.month)) + "</div>");
		html += ("<div style=\"grid-area:next-month;\"><img src=\"/images/sopp2/triangle_right.png\" onclick=\"if(this.parentElement.parentElement.parentElement.nextElementSibling !== null){this.parentElement.parentElement.parentElement.nextElementSibling.style.display='';this.parentElement.parentElement.parentElement.style.display='none'}\"></div>");
		html += ("<div style=\"grid-area:emp-list;\"></div>"); // 담당자별 일정 요약
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

	// 그려진 달력에 일정을 표시하는 메서드
	drawScheduleInSopp(colorTable){
		let x, y, z, st, et, writer, name, days = [], color = "#dddddd", emps = {}, html;
		
		// 월간 달력 컨테이너에서 일간 컨테이너 찾아서 배열(days)에 담기 
		z = this.container.children[1];
		for(x = 0 ; x < z.children.length ; x++){
			for(y = 0 ; y < z.children[x].children.length ; y++){
				days.push(z.children[x].children[y]);
			}
		}
		
		// 일간 달력에 스케줄을 표시하기
		for(x = 0 ; x < days.length ; x++){ // 일간 컨테이너 순회
			st = days[x].dataset.v * 1;
			et = st + 86400000;
			for(y = 0 ; y < this.schedule.length ; y++){ // 일정 순회
				if(this.schedule[y].from >= st && this.schedule[y].from < et){ // 일간 컨테이너와 일정이 일치하는 경우, 일정표시 진행
					color = "#dddddd";
					name = "..."; // 이름을 못 찾는 경우 undefined 방지
					writer = this.schedule[y].writer;
					name = storage.user[writer] !== undefined && storage.user[writer].userName !== undefined ? storage.user[writer].userName : name;
					color = colorTable !== undefined && colorTable[writer] !== undefined ? colorTable[writer] : color;
					z = document.createElement("div");
					z.className = "schedule-in-monthly-calendar";
					z.dataset.emp = writer;
					z.setAttribute("onclick","event.stopPropagation();clickedSoppCalendarSchedule(" + this.schedule[y].no + ")");
					z.style.backgroundColor = color;
					z.dataset.color = color;
					//z.innerText = name;
					z.innerText = this.schedule[y].title;
					days[x].appendChild(z);
					// 직원별 일정 갯수 저장
					if(emps[writer] === undefined)	emps[writer] = 1;
					else							emps[writer]++;
				}
			}
		}

		// 월간 달력 상단에 직원별 일정의 수를 표시하도록 함
		z = this.container.children[0].children[4];
		st = 0;
		for(x in emps){
			if(x === undefined)	continue;
			st++;
			color = "#dddddd"
			color = colorTable !== undefined && colorTable[x] !== undefined ? colorTable[x] : color;
			name = "...";
			name = storage.user[x] !== undefined && storage.user[x].userName !== undefined ? storage.user[x].userName : name;
			y = document.createElement("div");
			y.style.gridArea = "a" + st; // 좌측 하단에서부터 상단으로 하나씩 쌓아가도록 그리드를 이용하여 배치함
			y.setAttribute("onmouseenter", "enteredMonthlyCalendarTopEmp(this)");
			y.setAttribute("onmouseleave", "leftMonthlyCalendarTopEmp(this)");
			y.dataset.emp = x;
			html = "<span style=\"background-color:" + color + ";\">" + emps[x] + "</span><span>" + name + "</span>";
			y.innerHTML = html;
			z.appendChild(y);
		}
	} // End of drawScheduleInSopp()

} // End of Class ========== MonthlyCalendar ==========

class Schedule{
	constructor(data){
		let v;
		if(data === null || data === undefined || !(typeof data === "object" && data.constructor.name === "Object")){
			v = {
				no:-1,
				writer:storage.my,
				title:"제목",
				content:"",
				report:true,
				type:null,
				from:new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate(),9,0,0),
				to:new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate(),18,0,0),
				related:"{}",
				permitted:null,
				created:(new Date()).getTime(),
				modified:null
			};
		}else v = data;
		this.data = data;
		this.no = v.no;
		this.writer = v.writer;
		this.title = v.title;
		this.content = v.content;
		this.report = v.report;
		this.type = v.type;
		this.from = (v.from === undefined || v.from === null ? new Date() : v.from.constructor.name === "Number" ? new Date(v.from) : v.from);
		this.to = (v.to === undefined || v.to === null ? new Date() : v.to.constructor.name === "Number" ? new Date(v.to) : v.to);
		this.related = (v.related === undefined ? {} : v.related.constructor.name === "String" ? JSON.parse(v.related) : v.related.constructor.name === " Object" ? v.related : {});
		this.permitted = v.permitted;
		this.created = (v.created === undefined || v.created === null ? null : v.created.constructor.name === "Number" ? new Date(v.created) : v.created);
		this.modified = (v.modified === undefined || v.modified === null ? null : v.modified.constructor.name === "Number" ? new Date(v.modified) : v.modified);
	} // End of constructor()

	scheduleDetailDataSet() {
		let html, dataArray, gridList, containerTitle, crudUpdateBtn, crudDeleteBtn, detailBackBtn, hideArr, showArr, createDiv, soppSplit, sopp;
		gridList = document.getElementsByClassName("gridList")[0];
		containerTitle = document.getElementById("containerTitle");
		crudUpdateBtn = document.getElementsByClassName("crudUpdateBtn")[0];
		crudDeleteBtn = document.getElementsByClassName("crudDeleteBtn")[0];
		detailBackBtn = document.getElementsByClassName("detailBackBtn")[0];

		this.from = CommonDatas.dateDis(this.from);
		this.from = CommonDatas.dateFnc(this.from, "yyyy-mm-dd T HH:mm");
		
		this.to = CommonDatas.dateDis(this.to);
		this.to = CommonDatas.dateFnc(this.to, "yyyy-mm-dd T HH:mm");

		if(this.related.parent !== null){
			soppSplit = this.related.parent.split(":");
			if(soppSplit[0] === "sopp"){
				axios.get("/api/sopp/" + soppSplit[1]).then((response) => {
					let result = response.data.data;
					result = cipher.decAes(result);
					result = JSON.parse(result);
					sopp = result.title;
				});
			}
		}

		dataArray = [
			{
				"title": "일정시작일(*)",
				"type": "datetime",
				"elementId": "from",
				"value": this.from,
			},
			{
				"title": "일정종료일(*)",
				"type": "datetime",
				"elementId": "to",
				"value": this.to,
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"complete": "sopp",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": sopp,
			},
			{
				"title": "담당자(*)",
				"elementId": "writer",
				"complete": "user",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": storage.user[this.writer].userName,
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"value": this.title,
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "content",
				"value": this.content,
				"type": "textarea",
				"col": 4,
			},
		];

		html = CommonDatas.detailViewForm(dataArray);
		containerTitle.innerHTML = this.title;
		createDiv = document.createElement("div");
		createDiv.className = "defaultFormContainer";
		createDiv.innerHTML = html;
		gridList.after(createDiv);
		hideArr = ["gridList", "calendarList", "listRange", "crudAddBtn", "listSearchInput", "searchContainer", "pageContainer"];
		showArr = [
			{element: "defaultFormContainer", display: "grid"}
		];
		CommonDatas.setViewContents(hideArr, showArr);
		detailBackBtn.style.display = "flex";
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
	}

	calendarDetailDataSet() {
		let sopp, html, dataArray, soppSplit;

		this.from = CommonDatas.dateDis(this.from);
		this.from = CommonDatas.dateFnc(this.from, "yyyy-mm-dd T HH:mm");
		
		this.to = CommonDatas.dateDis(this.to);
		this.to = CommonDatas.dateFnc(this.to, "yyyy-mm-dd T HH:mm");

		if(this.related.parent !== null){
			soppSplit = this.related.parent.split(":");
			if(soppSplit[0] === "sopp"){
				axios.get("/api/sopp/" + soppSplit[1]).then((response) => {
					let result = response.data.data;
					result = cipher.decAes(result);
					result = JSON.parse(result);
					sopp = result.title;
				});
			}
		}

		dataArray = [
			{
				"title": "일정시작일(*)",
				"type": "datetime",
				"elementId": "from",
				"value": this.from,
			},
			{
				"title": "일정종료일(*)",
				"type": "datetime",
				"elementId": "to",
				"value": this.to,
			},
			{
				"title": "영업기회(*)",
				"elementId": "sopp",
				"complete": "sopp",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": sopp,
			},
			{
				"title": "담당자(*)",
				"elementId": "writer",
				"complete": "user",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": storage.user[this.writer].userName,
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"value": this.title,
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "content",
				"value": this.content,
				"type": "textarea",
				"col": 4,
			},
		];

		html = CommonDatas.detailViewForm(dataArray, "modal");
	
		modal.show();
		modal.content.style.minWidth = "70%";
		modal.content.style.maxWidth = "70%";
		modal.headTitle.innerText = this.title;
		modal.body.innerHTML = "<div class=\"defaultFormContainer\">" + html + "</div>";
		modal.confirm.style.display = "none";
		modal.close.innerText = "취소";
		modal.close.setAttribute("onclick", "modal.hide();");
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
	}

	// ========== 일정 수정 모달을 띄우는 함수 ==========
	popupModalForEdit(dt, gw){ // dt : 일정 생성할 날의 Date 객체, 날짜만 사용함 / gw : 전자결재 자동상신, 신규 일정 생성에서만 사용하고 기존 일정 수정에서는 사용하지 말 것!
		let html, x, y, start, end, cnt, el, child, isVacation = false, isOverTime = false, inSopp = false;
		modal.show();
		modal.headTitle[0].innerText = "일정 신규 등록";

		// 편집 대상 확인
		if(dt === undefined || dt === null){
			if(R.schedule === undefined || R.schedule === null || R.constructor.name !== "Schedule")	R.schedule = new Schedule();
		}else{
			if(dt.constructor.name === "Object")		R.schedule = new Schedule(dt);
			else if(dt.constructor.name === "Schedule")	R.schedule = dt;
			else if(dt.constructor.name === "Date"){
				R.schedule = new Schedule();
				R.schedule.from = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),9,0,0);
				R.schedule.to = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),18,0,0);
			}
		}

		//유형 파악
		if(R.sopp !== null && R.sopp !== undefined)	inSopp = true;

		// 타임 바에 표현할 시작 및 끝 시간 설정
		start = 7;
		end = 21;

		// 모달 내 컨테이너 생성 및 부착 / 기본 값 설정
		cnt = document.createElement("div");
		cnt.className = "schedule-detail";
		modal.body[0].appendChild(cnt);
		// --- 일정 시작 및 종료
		x = (R.schedule.from.getFullYear() * 10000 + (R.schedule.from.getMonth()+1) * 100 + R.schedule.from.getDate()) + "";
		y = (R.schedule.to.getFullYear() * 10000 + (R.schedule.to.getMonth()+1) * 100 + R.schedule.to.getDate()) + "";
		cnt.dataset.ds = x;
		cnt.dataset.de = x === y ? "x" : y;
		x = ((R.schedule.from.getHours() * 100 + R.schedule.from.getMinutes() + 10000) + "").substring(1);
		y = ((R.schedule.to.getHours() * 100 + R.schedule.to.getMinutes() + 10000) + "").substring(1);
		cnt.dataset.ts = x;
		cnt.dataset.te = y;
		cnt.dataset.no = R.schedule.no;		

		// 본문 및 제목 엘리먼트 생성 및 부착
		el = document.createElement("div");
		cnt.appendChild(el);
		html = "<div><img src=\"/images/sopp2/article.png\" /><input placeholder=\"제목\"/></div><textarea name=\"schedule-modal-content\"></textarea>";
		el.innerHTML = html;

		// 컨텐트에 웹에디터 부착
		ckeditor.config.readOnly = false;
		CKEDITOR.replace("schedule-modal-content",
			{height:305,
			removeButtons:"Source,Save,Templates,NewPage,Preview,Print,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About,Button,Select,Textarea,TextField,Radio,Checkbox,Form,Format,Styles"
		});

		// 날짜/시간 및 상세정보 컨테이너 생성 및 부착
		el = document.createElement("div");
		cnt.appendChild(el);

		// 날짜정보 엘리먼트 생성 및 부착
		child = document.createElement("label");
		child.setAttribute("for", "mini-calendar-check");
		el.appendChild(child);
		child.innerHTML = "<img src=\"/images/sopp2/icon_calendar.png\" />" + R.schedule.dateToStr();

		child = document.createElement("input");
		child.setAttribute("type", "checkbox");
		child.setAttribute("id", "mini-calendar-check");
		child.checked = false;
		el.appendChild(child);

		// 날짜 선택용 달력 컨테이너 생성 및 부착
		child = document.createElement("div");
		el.appendChild(child);
		x = document.createElement("div");
		x.innerHTML = R.schedule.drawMiniCalendar(new Date(R.schedule.from.getFullYear(), R.schedule.from.getMonth() - 1, 1));
		child.appendChild(x);
		x = document.createElement("div");
		x.innerHTML = R.schedule.drawMiniCalendar(R.schedule.from);
		child.appendChild(x);
		x = document.createElement("div");
		x.innerHTML = R.schedule.drawMiniCalendar(new Date(R.schedule.from.getFullYear(), R.schedule.from.getMonth() + 1, 1));
		child.appendChild(x);

		// 타임 바 생성 및 부착
		child = document.createElement("div");
		el.appendChild(child);
		html = ("<div style=\"grid-template-columns:1px 2fr repeat(" + (end - start - 1) + ", 4fr) 2fr 1px;\"><div></div><div></div>")
		for(x = start + 1 ; x < end ; x++)	html += ("<div>" + x + "</div>");
		html += "<div></div></div>";
		html += ("<div style=\"grid-template-columns:1px repeat(" + ((end - start) * 2) + ",2fr) 1px;\" data-s=\"x\" data-e=\"0\"><span></span>");
		for(x = start ; x < end ; x++)	html += ("<div class=\"schedule-time-empty\" data-h=\"" + (x < 10 ? "0" + x : x) + "\" data-m=\"00\" onclick=\"R.schedule.clickedTimeOnMiniCalendar(this)\"></div><div class=\"schedule-time-empty\" data-h=\"" + (x < 10 ? "0" + x : x) + "\" data-m=\"30\" onclick=\"R.schedule.clickedTimeOnMiniCalendar(this)\"></div>");
		html += "<span></span></div></div>";
		child.innerHTML = html;

		// 일정 종류 라디오버튼 부착
		child = document.createElement("div");
		el.appendChild(child);
		child.className = "schedule-type1";
		html = "<input type=\"radio\" data-n=\"type1\" name=\"schedule-type1\" id=\"schedule-type1a\" checked value=\"outside\" /><label for=\"schedule-type1a\">외근/출장</label>";
		html += "<input type=\"radio\" data-n=\"type1\" name=\"schedule-type1\" id=\"schedule-type1b\" value=\"inside\" /><label for=\"schedule-type1b\">내 근</label>";
		html += "<input type=\"radio\" data-n=\"type1\" name=\"schedule-type1\" id=\"schedule-type1c\" value=\"education\" /><label for=\"schedule-type1c\">교 육</label>";
		html += "<input type=\"radio\" data-n=\"type1\" name=\"schedule-type1\" id=\"schedule-type1d\" value=\"vacation\" /><label for=\"schedule-type1d\">휴 가</label>";
		child.innerHTML = html;
		// 영업기회 내부인 경우 교육/휴가 비활성화
		if(inSopp){
			child.children[6].remove();
			child.children[4].remove();
		}

		// 일정 상세내용 부착
		child = document.createElement("div");
		el.appendChild(child);

		// ----- 일정의 소속에 대한 선택 ////////// 유지보수에 대한 내용 정리 후 재작업 필요 //////////
		y = document.createElement("div");
		y.className = "sub-title";
		child.appendChild(y);
		html = "<circle></circle><div>영업기회/유지보수</div><line></line>";
		y.innerHTML = html;
		y = document.createElement("div");
		y.className = "schedule-belong-to";
		child.appendChild(y);
		html = "<input type=\"radio\" data-n=\"belong-to\" name=\"schedule-belong-to\" id=\"schedule-belong-to1\" checked value=\"sopp:" + R.sopp.no + "\" /><label for=\"schedule-belong-to1\">영업기회 : " + R.sopp.title + "</label>";
		if(contract !=undefined && contract.maintenance !=undefined) {
		let mtnc = contract.maintenance; 
		for(let i = 0 ; i <= mtnc.length -1 ; i++) {
			html += "<input type=\"radio\" data-n=\"belong-to\" name=\"schedule-belong-to\" id='schedule-belong-to"+(i+2)+"' value='maintenance:"+mtnc[i].no+"' /><label for='schedule-belong-to"+(i+2)+"'>유지보수 : "+mtnc[i].title+"</label>";
		}	
		}
		
		y.innerHTML = html;

		// ----- 장소 부분
		y = document.createElement("div");
		y.className = "sub-title";
		child.appendChild(y);
		html = "<circle></circle><div>장 소</div><line></line>";
		y.innerHTML = html;
		y = document.createElement("div");
		y.className = "schedule-place";
		child.appendChild(y);
		html = "<input type=\"radio\" data-n=\"place\" name=\"schedule-place\" id=\"schedule-place1\" checked value=\"customer\" /><label for=\"schedule-place1\">고객사</label>";
		html += "<input type=\"radio\" data-n=\"place\" name=\"schedule-place\" id=\"schedule-place2\" value=\"partner\" /><label for=\"schedule-place2\">협력사</label>";
		html += "<input type=\"radio\" data-n=\"place\" name=\"schedule-place\" id=\"schedule-place3\" value=\"office\" /><label for=\"schedule-place3\">사무실</label>";
		html += "<input type=\"radio\" data-n=\"place\" name=\"schedule-place\" id=\"schedule-place4\" value=\"etc\" onchange=\"if(this.checked) this.nextElementSibling.nextElementSibling.value=''\"/><label for=\"schedule-place4\">기 타</label>";
		html += "<input type=\"text\" name=\"schedule-place-etc\" onkeyup=\"this.previousElementSibling.previousElementSibling.value='etc:'+this.value;\"/>";
		y.innerHTML = html;

		// ----- 일정 유형 부분
		y = document.createElement("div");
		y.className = "sub-title";
		child.appendChild(y);
		html = "<circle></circle><div>종 류</div><line></line>";
		y.innerHTML = html;
		y = document.createElement("div");
		y.className = "schedule-type2";
		child.appendChild(y);
		html = "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2a\" value=\"회사방문\" /><label for=\"schedule-type2a\">회사방문</label>";
		html += "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2b\" value=\"제안/설명\" /><label for=\"schedule-type2b\">제안/설명</label>";
		html += "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2c\" value=\"견적\" /><label for=\"schedule-type2c\">견 적</label>";
		html += "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2d\" value=\"계약\" /><label for=\"schedule-type2d\">계 약</label>";
		html += "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2e\" value=\"교육\" /><label for=\"schedule-type2e\">교 육</label>";
		html += "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2f\" value=\"기술지원\" /><label for=\"schedule-type2f\">기술지원</label>";
		html += "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2g\" value=\"시스템데모\" /><label for=\"schedule-type2g\">시스템데모</label>";
		html += "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2h\" value=\"납품/설치\" /><label for=\"schedule-type2h\">납품/설치</label>";
		html += "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2i\" value=\"검수\" /><label for=\"schedule-type2i\">검 수</label>";
		html += "<input type=\"radio\" data-n=\"type2\" name=\"schedule-type2\" id=\"schedule-type2j\" value=\"xx\" /><label for=\"schedule-type2j\">....</label>";
		y.innerHTML = html;

		// ----- 방법 부분
		y = document.createElement("div");
		y.className = "sub-title";
		child.appendChild(y);
		html = "<circle></circle><div>방 법</div><line></line>";
		y.innerHTML = html;
		y = document.createElement("div");
		y.className = "schedule-method";
		child.appendChild(y);
		html = "<input type=\"radio\" data-n=\"method\" name=\"schedule-method\" id=\"schedule-method1\" checked value=\"visit\" /><label for=\"schedule-method1\">현장방문</label>";
		html += "<input type=\"radio\" data-n=\"method\" name=\"schedule-method\" id=\"schedule-method2\" value=\"telephone\" /><label for=\"schedule-method2\">전화상담</label>";
		html += "<input type=\"radio\" data-n=\"method\" name=\"schedule-method\" id=\"schedule-method3\" value=\"remote\" /><label for=\"schedule-method3\">원격접속</label>";
		y.innerHTML = html;

		// ----- 주간 업무 보고에 포함하는지 여부
		y = document.createElement("div");
		y.className = "sub-title";
		child.appendChild(y);
		html = "<circle></circle><div>주간 업무 보고</div><line></line>";
		y.innerHTML = html;
		y = document.createElement("div");
		y.className = "schedule-report";
		child.appendChild(y);
		html = "<input type=\"radio\" data-n=\"report\" name=\"schedule-report\" id=\"schedule-report1\" checked value=\"true\" /><label for=\"schedule-report1\">포 함</label>";
		html += "<input type=\"radio\" data-n=\"report\" name=\"schedule-report\" id=\"schedule-report2\" value=\"false\" /><label for=\"schedule-report2\">미포함</label>";
		y.innerHTML = html;

		// ----- 전자결재 자동상신 부분
		if(gw === true){
			y = document.createElement("div");
			y.className = "sub-title";
			child.appendChild(y);
			html = "<circle></circle><div>전자결재</div><line></line>";
			y.innerHTML = html;
			y = document.createElement("div");
			y.className = "schedule-gw";
			child.appendChild(y);
			html = "<div>결 재 선 : </div><select class=\"schedule-app-line\" onchange=\"R.schedule.showSavedLineInScheduleDetail(this)\"><option selected value=\"-1\">- - 자주 쓰는 결재선 - -</option>";
			if(R.gwSavedLine !== undefined)	for(x = 0 ; x < R.gwSavedLine.length ; x++){
				html += "<option value=\"" + (R.gwSavedLine[x].no) + "\">" + (R.gwSavedLine[x].title) + "</option>";
			}
			html += "</select><div></div>";
			y.innerHTML = html;
		}

		// 달력에 날짜 선택 미니 캘린더 표시
		y = (this.from.getFullYear() * 10000 + (this.from.getMonth() + 1) * 100 + this.from.getDate()) + "";
		cnt.dataset.ds = y;
		child = document.getElementsByClassName("mini-calendar-cell");
		for(x = 0 ; x < child.length ; x++)	if(child[x].dataset.v === y)	child[x].style.backgroundColor = "#c1eaff";

		// 타임 바에 시간 선택 표시
		start = cnt.dataset.ts * 1;
		end = cnt.dataset.te * 1;
		child = cnt.children[1].children[3].children[1].children;
		for(x = 1 ; x < child.length - 1 ; x++){
			y = (child[x].dataset.h * 100) + (child[x].dataset.m * 1);
			if(y >= start && y < end)	child[x].className = "schedule-time-select";
		}

		// 미니 달력 상단, 선택된 기간에 대한 문자열 표시
		R.schedule.setDateTimeInScheduleDetail();		

		// 모달 버튼 이벤트 핸들러 설정
		modal.close[0].onclick = () => {CKEDITOR.instances['schedule-modal-content'].destroy();modal.hide();};
		modal.confirm[0].onclick = this.clickedScheduleModalConfirm;
	} // End of popupModalForEdit()

	// 기간의 시작 및 종료 날짜/시간 문자열 만드는 메서드
	dateToStr(){
		let str, s1, s2, e1, e2;
		s1 = "'" + (this.from.getFullYear() % 100) + "." + (this.from.getMonth() + 1) + "." + this.from.getDate();
		e1 = "'" + (this.to.getFullYear() % 100) + "." + (this.to.getMonth() + 1) + "." + this.to.getDate();
		s2 = (this.from.getHours() < 10 ? "0" + this.from.getHours() : this.from.getHours()) + ":" + (this.from.getMinutes() < 10 ? "0" + this.from.getMinutes() : this.from.getMinutes());
		e2 = (this.to.getHours() < 10 ? "0" + this.to.getHours() : this.to.getHours()) + ":" + (this.to.getMinutes() < 10 ? "0" + this.to.getMinutes() : this.to.getMinutes());
		str = "<date>" + s1 + " </date><time>" + s2 + "</time>";
		if(s1 === e1)	str += ("<span> ~ </span><time>" + e2 + "</time>");
		else			str += "<span> ~ </span><date>" + e1 + " </date><time>" + e2 + "</time>";
		return str;
	} // End of dateToStr()

	// JSON 문자열을 만드는 함수
	toJson(){
		let json = Object.assign({}, this);
		delete json.calendar;
		json.created = (json.created === undefined || json.created === null) ? null : json.created.getTime();
		json.modified = (json.modified === undefined || json.modified === null) ? null : json.modified.getTime();
		json.from = (json.from === undefined || json.from === null) ? null : json.from.getTime();
		json.to = (json.to === undefined || json.to === null) ? null : json.to.getTime();
		json.related = (json.related === undefined || json.related === null) ? null : JSON.stringify(json.related);
		return json;
	}

	// 스케줄 객체의 변경 내용에 대해에 저장하는 메서드
	update() {
		let data = JSON.stringify(this.toJson());
		data = cipher.encAes(data);
		fetch(apiServer + "/api/schedule2", {
			method: "POST",
			header: { "Content-Type": "text/plain" },
			body: data
		}).catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				console.log(response);
				if (response.result === "ok") {
					

				} else {
					console.log(response.msg);
				}
			});
		console.log("UPDATE SCHEDULE!!");
	} // End of update()

	// =============================================================================================
	// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 일정 신규/수정 모달 이벤트 리스너 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
	// =============================================================================================

	// 모달의 미니 캘린더에서 날짜를 클릭할 때 실행되는 메서드
	clickedDateOnMiniCalendar(el){
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
		R.schedule.setDateTimeInScheduleDetail();
	} // End of clickedDateOnMiniCalendar()

	// 모달의 미니 캘린더에서 타임바를 클릭했을 때 실행되는 메서드
	clickedTimeOnMiniCalendar(el){
		let de, cnt, dts, dte, start, end, x, y, z, els;
		cnt = document.getElementsByClassName("schedule-detail")[0];
		dts = cnt.dataset.ts;
		dte = cnt.dataset.te;
		de = cnt.dataset.de;
		els = el.parentElement.children;
	
		if(dte === "x"){ // 1 / 두번째 선택일 때
			start = dts;
			if(de === "x"){ // 2 / 시작날짜와 종료 날짜가 동일할 때 
				end = el.dataset.h + el.dataset.m;
				if(start*1 > end*1){ // 3 / 시작 시간이 종료 시간보다 클 때 / 반전 필요
					x = end;console.log(1);
					end = start;
					start = x;
					cnt.dataset.ts = start;
				}
				//start = (((start * 1) % 100 === 30) ? (start * 1) - 30 : (start * 1) - 70) + "";
				start = start.length < 4 ? "0" + start : start;				
				end = (((end * 1) % 100 === 30) ? (end * 1) + 70 : (end * 1) + 30) + "";
				end = end.length < 4 ? "0" + end : end;
				cnt.dataset.te = end;
				for(x = 1 ; x < els.length - 1 ; x++){
					z = (els[x].dataset.h + els[x].dataset.m) * 1;
					if(z >= start * 1 && z < end * 1)	els[x].className = "schedule-time-select";
				}
			}else{ // 2 / 시작날짜와 종료 날짜가 다를 때 
				end = el.dataset.h + el.dataset.m;
				end = (((end * 1) % 100 === 30) ? (end * 1) + 70 : (end * 1) + 30) + "";
				end = end.length < 4 ? "0" + end : end;
				cnt.dataset.ts = start;
				cnt.dataset.te = end;
				if(start*1 > end*1){ // 3 / 시작 시간이 종료 시간보다 클 때
					for(x = 1 ; x < els.length - 1 ; x++){
						z = (els[x].dataset.h + els[x].dataset.m) * 1;
						if(z >= start * 1 || z < end * 1)	els[x].className = "schedule-time-select";
					}
				}else{ // 3 / 시작 시간이 종료 시간보다 작을 때
					for(x = 1 ; x < els.length - 1 ; x++){
						z = (els[x].dataset.h + els[x].dataset.m) * 1;
						if(z >= start * 1 && z < end * 1)els[x].className = "schedule-time-select";
					}
				}
			}
			
		}else{ // 1 / 첫번째 선택일 때
			start = el.dataset.h + el.dataset.m;
			cnt.dataset.ts = start;
			cnt.dataset.te = "x";
			for(x = 1 ; x < els.length - 1 ; x++)	els[x].className = "schedule-time-empty";
			el.className = "schedule-time-select";
		}
		window.setTimeout(R.schedule.setDateTimeInScheduleDetail,50);
	} // end of clickedTimeOnMiniCalendar()

	// 자주 쓰는 결재선 선택시 실행되는 함수
	showSavedLineInScheduleDetail(v){
		let value, x, y, cnt, line, html;
		if(v === undefined)	return;
		if(typeof v === "object" && v.constructor.name === "HTMLSelectElement")	value = v.value;
		else if(typeof v === "string")	value = v * 1;
		else if(typeof v === "number")	value = v;
		else							return;

		if(value > 0)	for(x = 0 ; x < R.gwSavedLine.length ; x++){
			if(R.gwSavedLine[x].no == value){
				line = R.gwSavedLine[x].appLine;
				break;
			}
		}

		if(value > 0 && line === undefined)	return;
		html = "";
		cnt = document.getElementsByClassName("schedule-detail")[0].getElementsByClassName("schedule-gw")[0].children[2];
		if(value > 0){
			y = storage.user[storage.my] !== undefined && storage.user[storage.my].userName !== undefined ? "<span> " + storage.user[storage.my].userName + " </span>" : "<span> ... </span>";
			html += y;
			for(x = 0 ; x < line.length ; x++){
				html += "<span style=\"color:#ababab;\"> &gt; </span>";
				y = storage.user[line[x][1]] !== undefined && storage.user[line[x][1]].userName !== undefined ? "<span> " + storage.user[line[x][1]].userName + " </span>" : "<span> ... </span>";
				html += y;
			}
		}		

		cnt.innerHTML = html;

	} // End of showSavedLineInScheduleDetail()

	// 모달의 확인 버튼 클릭시 실행되는 메서드
	clickedScheduleModalConfirm(){
		let cnt, els, x, y;
		
		cnt = document.getElementsByClassName("schedule-detail")[0];
		if(R.schedule.related === undefined || R.schedule.related === null)	R.schedule.related = {};
	
		// 제목
		R.schedule.title = cnt.children[0].children[0].children[1].value;
		
		// 내용
		x = CKEDITOR.instances["schedule-modal-content"].getData();
		x = x.replaceAll("\r","").replaceAll("\n","").replaceAll("\t","");
		R.schedule.content = x;
		
		// 주간보고 포함 여부
		els = document.getElementsByName("schedule-report");
		y = undefined;
		for(x = 0 ; x < els.length ; x++){
			if(els[x].checked){
				y = els[x].value;
				break;
			}
		}
		R.schedule.report = y === "true";
	
		// 알정 종류 1
		els = document.getElementsByName("schedule-type1");
		y = undefined;
		for(x = 0 ; x < els.length ; x++){
			if(els[x].checked){
				y = els[x].value;
				break;
			}
		}
		R.schedule.type = y;
	
		// 알정 종류 2
		els = document.getElementsByName("schedule-type2");
		y = undefined;
		for(x = 0 ; x < els.length ; x++){
			if(els[x].checked){
				y = els[x].value;
				break;
			}
		}
		R.schedule.related.typeOfDetail = y;
	
		// 알정 장소
		els = document.getElementsByName("schedule-place");
		y = undefined;
		for(x = 0 ; x < els.length ; x++){
			if(els[x].checked){
				y = els[x].value;
				break;
			}
		}
		R.schedule.related.place = y;
	
		// 알정 방법
		els = document.getElementsByName("schedule-method");
		y = undefined;
		for(x = 0 ; x < els.length ; x++){
			if(els[x].checked){
				y = els[x].value;
				break;
			}
		}
		R.schedule.related.method = y;
	
		// 전자결재의 결재선
		els = document.getElementsByClassName("schedule-app-line")[0];
		y = els.value;
		if(y !== undefined && y !== null){
			R.schedule.related.appLine = y * 1;
			R.schedule.permitted = 0;
		}
		// =============== parent = ===============
		if(R.sopp !== undefined){
			if(R.schedule.related === undefined)	R.schedule.related = {};
			R.schedule.related.parent = "sopp:" + R.sopp.no;
		}

		// ===== 필수 데이터 검증
		x = document.getElementsByClassName("schedule-gw");
		if(R.schedule.title === ""){
			document.getElementsByClassName("schedule-detail")[0].children[0].children[0].children[1].style.animation = "not-enough-warn 7s forwards";
			document.getElementsByClassName("schedule-detail")[0].children[0].children[0].children[1].focus();
			window.setTimeout(()=>{document.getElementsByClassName("schedule-detail")[0].children[0].children[0].children[1].style.animation = "";},7000);
			return;
		}else if(x.length > 0 && x[0].offsetHeight > 0 && R.schedule.related.appLine === -1){
			document.getElementsByClassName("schedule-gw")[0].children[1].scrollIntoView({behavior: 'smooth'});
			document.getElementsByClassName("schedule-gw")[0].children[1].style.animation = "not-enough-warn 7s forwards";
			document.getElementsByClassName("schedule-gw")[0].children[1].focus();
			window.setTimeout(()=>{document.getElementsByClassName("schedule-gw")[0].children[1].style.animation = "";},7000);
			return;
		}
	
		// 모달 내 에디터 제거, 모달 닫기
		CKEDITOR.instances['schedule-modal-content'].destroy();
		modal.hide();
		
		// Schedule 객체 업데이트하기
		R.schedule.update();
		
	} // End of clickedScheduleModalConfirm()

	// 미니 달력을 그리는 함수
	drawMiniCalendar(date){
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
			else	html += ("<span onclick=\"R.schedule.clickedDateOnMiniCalendar(this)\" class=\"mini-calendar-cell\" data-v=\"" + x + "\">" + dt.getDate() + "</span>");

			//if(dt.getDay() === 6)	html += "</div>";
			dt = new Date(dt.getTime() + 86400000);
		} // End of while
		return html;
	} // End of drawMonthList()

	// 미니 캘린더와 타임바의 클릭 이벤트 후 상단에 날짜/시간 표시를 변경하는 메서드
	setDateTimeInScheduleDetail(){
		let ds, de, ts, te, s1, s2, e1, e2, str, cnt = document.getElementsByClassName("schedule-detail")[0];
		ds = cnt.dataset.ds;
		de = cnt.dataset.de;
		de = de === "x" ? ds : de;
		ts = cnt.dataset.ts;
		te = cnt.dataset.te;
		if(te === "x"){
			te = ts * 1;
			if(te % 100 === 30)	te = (te + 70) + "";
			else	te = (te + 30) + "";
			te = te.length < 4 ? "0" + te : te;
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
		this.from = new Date("20" + s1.replace("'","") + " " + s2);
		this.to = new Date("20" + e1.replace("'","") + " " + e2);
	} // End of setDateTimeInScheduleDetail()

} // End of Class === Schedule =======================================================================================


class Projects {
	constructor(_server, cnt) {
		this.list = [];
		this.container = cnt;
		fetch(_server + "/api/project")
			.catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let data, arr, x;
				if (response.result !== "ok") console.log(response.msg);
				else {
					data = cipher.decAes(response.data);
					arr = JSON.parse(data);
					for (x = 0; x < arr.length; x++)	R.project.addProject(new Project(arr[x]));
					R.project.getSoppFromServer(_server);
				}
			});
	}
	addProject(prj) { this.list.push(prj); }

	addSopp(sopp) {
		let x;
		if (sopp === null || sopp === undefined || sopp.constructor.name !== "Sopp2" || sopp.related == undefined) return false;
		for (x = 0; x < this.list.length; x++)	if (sopp.related.parent === "project:" + this.list[x].no) return this.list[x].addSopp(sopp);
		return false;
	} // End of addSopp()

	getSoppFromServer(_server) {
		fetch(_server + "/api/project/sopp")
			.catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let data, arr, x;
				if (response.result !== "ok") console.log(response.msg);
				else {
					data = cipher.decAes(response.data);
					arr = JSON.parse(data);
					for (x = 0; x < arr.length; x++)	R.project.addSopp(new Sopp2(arr[x]));
					R.project.draw();
				}
			});
	} // End of setSopp()

	draw() {
		let x, prj, el, child, svg;
		svg = "<svg onclick=\"R.project.newProject(this.parentElement.parentElement)\" xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" width=\"40\"><path stroke=\"#d1d1d1\" fill=\"#cccccc\" d=\"M18.625 28.417h2.917v-6.834h6.875v-2.916h-6.875v-7.084h-2.917v7.084h-7.042v2.916h7.042ZM20 36.958q-3.5 0-6.583-1.333-3.084-1.333-5.396-3.646-2.313-2.312-3.646-5.396Q3.042 23.5 3.042 20q0-3.542 1.333-6.625T8.021 8q2.312-2.292 5.396-3.625Q16.5 3.042 20 3.042q3.542 0 6.625 1.333T32 8q2.292 2.292 3.625 5.375 1.333 3.083 1.333 6.625 0 3.5-1.333 6.583-1.333 3.084-3.625 5.396-2.292 2.313-5.375 3.646-3.083 1.333-6.625 1.333Zm0-3.166q5.75 0 9.771-4.021Q33.792 25.75 33.792 20q0-5.75-4-9.771-4-4.021-9.792-4.021-5.75 0-9.771 4-4.021 4-4.021 9.792 0 5.75 4.021 9.771Q14.25 33.792 20 33.792ZM20 20Z\" /></svg>";
		for (x = 0; x < this.list.length; x++) {
			prj = this.list[x];
			el = document.createElement("div");
			this.container.appendChild(el);
			prj.draw(el);
		}

		// 프로젝트 권한 검증 후 신규 프로젝트 생성 엘리먼트 추가
		if(storage.permission._project !== undefined && storage.permission._project === true){
			el = document.createElement("div");
			el.className = "project-wrap";
			this.container.appendChild(el);
			child = document.createElement("label");
			child.setAttribute("for", "project_new");
			child.className = "project-new";
			child.innerHTML = svg;
			el.appendChild(child);
		}
	} // End of draw()

	newProject(cnt) {
		let data;
		data = { no: -1, title: "프로젝트이름", desc: "프로젝트설명", owner: storage.my, related: {}, closed: null, created: (new Date()).getTime(), modified: null };
		this.list[-1] = new Project(data);
		cnt.innerHTML = "";
		this.list[-1].draw(cnt);
		cnt.children[0].children[0].contentEditable = true;
		cnt.children[0].children[0].focus();
	} // End of newProject()

	newSopp(prjNo) {
		let html, x, title, dt;
		console.log("--- add sopp  / project number is : " + prjNo);
		dt = new Date();
		dt.setMonth(dt.getMonth() + 3);
		modal.show();
		modal.headTitle[0].innerText = "영업기회 추가";

		html = "<div class=\"new-sopp\" data-project=\"" + prjNo + "\"><div><div><div>";
		title = "영업기회명";
		for (x = 0; x < title.length; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div contentEditable data-name=\"name\" onfocusin=\"this.parentElement.parentElement.nextElementSibling.innerHTML=''\"></div></div>";

		html += "<div><div>";
		title = "관리자";
		for (x = 0; x < title.length; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div onclick=\"newSoppShowEmployee(this)\" data-name=\"owner\"></div></div>";

		html += "<div><div>";
		title = "담당자";
		for (x = 0; x < title.length; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div onclick=\"newSoppShowEmployee(this)\" data-name=\"coworker\"></div></div>";

		html += "<div><div>";
		title = "고객사";
		for (x = 0; x < title.length; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div onclick=\"newSoppShowCustomer(this)\" data-name=\"customer\"></div></div>";

		html += "<div><div>";
		title = "협력사";
		for (x = 0; x < title.length; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><div onclick=\"newSoppShowCustomer(this)\" data-name=\"partner\"></div></div>";

		html += "<div><div>";
		title = "예상매출액";
		for (x = 0; x < title.length; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><input data-name=\"expectedSales\" style=\"text-align:right;\" onkeyup=\"inputExpectedSales(this)\" onfocusin=\"this.parentElement.parentElement.nextElementSibling.innerHTML=''\" /></div>";

		html += "<div><div>";
		title = "예상납기";
		for (x = 0; x < title.length; x++)	html += ("<T>" + title[x] + "</T>");
		html += "</div><input type=\"date\" value=\"" + dt.toISOString().substring(0, 10) + "\" data-name=\"expectedDate\" onfocusin=\"this.parentElement.parentElement.nextElementSibling.innerHTML=''\" /></div></div><div></div></div>";


		modal.body[0].innerHTML = html;
		modal.confirm[0].onclick = confirmNewSopp;
		modal.close[0].onclick = modal.hide;
		// newSoppSelectEmployee() / newSoppSelectCustomer() / newSoppSelectPartner()
	} // End of newSopp()
} // End of Class === Projects =======================================================================================

class Project {
	constructor(each) {
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
	isClosed() { return this.closed !== null; }
	getEmployee(arr) {
		let x, sopp;
		if (arr === undefined || arr === null || arr.constructor.name !== "Array") arr = new Array();
		if (this.sopp != null && this.sopp.length > 0) for (x = 0; x < this.sopp.length; x++)	arr = this.sopp[x].getEmployee(arr);
		return arr;
	}// End of getEmployee()
	ownerName() {
		let owner, name = "...";
		owner = storage.user[this.owner];
		if (owner !== undefined && owner !== null) {
			owner = owner.userName;
			if (owner !== undefined && owner !== null) name = owner;
		}
		return ("<img src=\"/api/user/image/" + this.owner + "\" class=\"employee_image\" /><span>" + name + "</span>");
	} // End of ownerName()
	addSopp(sopp) {
		if (sopp === null || sopp === undefined || sopp.constructor.name !== "Sopp2") return false;
		this.sopp.push(sopp);
		return true;
	} // End of addSopp()
	draw(cnt) {
		let el, child, x, y, z, sopp, arr, name, html, t, svg;
		svg = "<svg onclick=\"R.project.newSopp(this.parentElement.parentElement.parentElement.parentElement.dataset.no)\" xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" width=\"40\"><path stroke=\"#d1d1d1\" fill=\"#cccccc\" d=\"M18.625 28.417h2.917v-6.834h6.875v-2.916h-6.875v-7.084h-2.917v7.084h-7.042v2.916h7.042ZM20 36.958q-3.5 0-6.583-1.333-3.084-1.333-5.396-3.646-2.313-2.312-3.646-5.396Q3.042 23.5 3.042 20q0-3.542 1.333-6.625T8.021 8q2.312-2.292 5.396-3.625Q16.5 3.042 20 3.042q3.542 0 6.625 1.333T32 8q2.292 2.292 3.625 5.375 1.333 3.083 1.333 6.625 0 3.5-1.333 6.583-1.333 3.084-3.625 5.396-2.292 2.313-5.375 3.646-3.083 1.333-6.625 1.333Zm0-3.166q5.75 0 9.771-4.021Q33.792 25.75 33.792 20q0-5.75-4-9.771-4-4.021-9.792-4.021-5.75 0-9.771 4-4.021 4-4.021 9.792 0 5.75 4.021 9.771Q14.25 33.792 20 33.792ZM20 20Z\" /></svg>";

		if (cnt === undefined && this.cnt !== undefined) cnt = this.cnt;
		else if (cnt !== undefined && this.cnt === undefined) this.cnt = cnt;
		else if (cnt === undefined && this.cnt === undefined) return;

		// 프로젝트 래퍼 클래스명 지정 및 데이터 타입 데이터 번호 세팅
		cnt.className = "project-wrap";
		cnt.dataset.data = "project";
		cnt.dataset.no = this.no;
		cnt.innerHTML = "";

		// 프로젝트 컨테이너 앞에 히든 라디오 삽입
		if (cnt.previousElementSibling === null || cnt.previousElementSibling.className !== "_hidden") {
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
		el.setAttribute("for", "project_" + this.no);
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
		for (x = 0; x < arr.length; x++) {
			name = "...";
			t = storage.user[arr[x]];
			if (t !== undefined && t !== null) {
				t = t.userName;
				if (t !== undefined && t !== null) name = t;
			}
			html += ("<img src=\"/api/user/image/" + arr[x] + "\" class=\"employee_image\" /><span>" + name + "</span>");
		}
		child = document.createElement("pic");
		el.appendChild(child);
		child.innerHTML = html;

		child = document.createElement("open");
		el.appendChild(child);
		child.innerText = "개설일 : " + this.created.toISOString().substring(0, 10);

		child = document.createElement("setting");
		el.appendChild(child);
		if (this.owner === storage.my) {
			child.innerText = "⋮";
			child.setAttribute("onclick", "showProjectMenu(this,1,this.parentElement.getAttribute(\"for\").substring(8))");
		} else child.style.cursor = "initial";

		x = [0, 0, 0];
		y = [0, 0, 0];
		for (z = 0; z < this.sopp.length; z++) {
			if (this.sopp[z].stage < 6) {
				x[0]++;
				y[0] += this.sopp[z].expectedSales;
			} else if (this.sopp[z].stage === 6) {
				x[1]++;
				y[1] += this.sopp[z].expectedSales;
			} else {
				x[2]++;
				y[2] += this.sopp[z].expectedSales;
			}
		}
		z = [0, 0, 0];
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
		if (this.owner !== storage.my && this.sopp.length === 0) {
			child = document.createElement("div");
			child.className = "sopp-box sopp-empty";
			child.innerHTML = "<span style='grid-column:span 4;display:flex;align-items:center;justify-content:center;color:gray;'>내용이 없습니다.</span>";
			el.appendChild(child);
		} else for (x = 0; x < this.sopp.length; x++) {
			// 개별 SOPP를 담을 박스 생성
			sopp = this.sopp[x];
			child = document.createElement("div");
			child.className = "sopp-box";
			el.appendChild(child);
			sopp.drawList(child);
		}

		if (this.owner === storage.my && storage.permission._project !== undefined && storage.permission._project === true) {
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
		if (prj.created !== null) prj.created = prj.created.getTime();
		if (prj.closed !== null) prj.closed = prj.closed.getTime();
		if (prj.modified !== null) prj.modified = prj.modified.getTime();
		data = JSON.stringify(prj);
		data = cipher.encAes(data);
		console.log(this);
		fetch(apiServer + "/api/project", {
			method: "POST",
			header: { "Content-Type": "text/plain" },
			body: data
		}).catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let cnt, el, child, svg;
				svg = svg = "<svg onclick=\"R.project.newProject(this.parentElement.parentElement)\" xmlns=\"http://www.w3.org/2000/svg\" height=\"40\" width=\"40\"><path stroke=\"#d1d1d1\" fill=\"#cccccc\" d=\"M18.625 28.417h2.917v-6.834h6.875v-2.916h-6.875v-7.084h-2.917v7.084h-7.042v2.916h7.042ZM20 36.958q-3.5 0-6.583-1.333-3.084-1.333-5.396-3.646-2.313-2.312-3.646-5.396Q3.042 23.5 3.042 20q0-3.542 1.333-6.625T8.021 8q2.312-2.292 5.396-3.625Q16.5 3.042 20 3.042q3.542 0 6.625 1.333T32 8q2.292 2.292 3.625 5.375 1.333 3.083 1.333 6.625 0 3.5-1.333 6.583-1.333 3.084-3.625 5.396-2.292 2.313-5.375 3.646-3.083 1.333-6.625 1.333Zm0-3.166q5.75 0 9.771-4.021Q33.792 25.75 33.792 20q0-5.75-4-9.771-4-4.021-9.792-4.021-5.75 0-9.771 4-4.021 4-4.021 9.792 0 5.75 4.021 9.771Q14.25 33.792 20 33.792ZM20 20Z\" /></svg>";
				if (response.result !== "ok") console.log(response);
				else {
					this.draw();
					cnt = document.getElementsByClassName("project-new");
					if (cnt.length === 0) {
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

	remove() {
		console.log("remove : " + this.no)
		fetch(apiServer + "/api/project/" + this.no, { method: "DELETE" })
			.catch((error) => console.log("error:", error))
			.then(response => response.json())
			.then(response => {
				let x, no, cnt, els;
				if (response.result === "ok") {
					no = response.data;
					els = document.getElementsByClassName("project-wrap");
					for (x = 0; x < els.length; x++) {
						if (els[x].dataset.data === "project" && els[x].dataset.no * 1 === no) {
							if (els[x].previousElementSibling != null && els[x].previousElementSibling.className === "_hidden") els[x].previousElementSibling.remove();
							els[x].remove();
							break;
						}
					}
				} else console.log(response.msg);
			});
	}

} // End of Class === Project =======================================================================================

class Maintenance{
	constructor(data){
		let v;
		if(data === null || data === undefined || !(typeof data === "object" && data.constructor.name === "Maintenance")){
			if(data.constructor.name === "Object")	v = JSON.parse(data);
			else	v = {
						no:-1,
						contract:null,
						customer:null,
						title:"",
						product:null,
						startDate:new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate(),0,0,0),
						endDate:new Date((new Date()).getFullYear() + 1,(new Date()).getMonth(),(new Date()).getDate(),0,0,0),
						engineer:null,
						coworker:[],
						related:{},
						created:new Date(),
						modified:null
					}
		}else v = data;
		this.no = v.no;
		this.contract = v.contract;
		this.customer = v.customer;
		this.product = v.product;
		this.startDate = (v.startDate === undefined || v.startDate === null ? new Date() : v.startDate.constructor.name === "Number" ? new Date(v.startDate) : v.startDate);
		this.endDate = (v.endDate === undefined || v.endDate === null ? new Date() : v.endDate.constructor.name === "Number" ? new Date(v.endDate) : v.endDate);
		this.engineer = v.engineer;
		this.coworker = (v.coworker === undefined ? [] : v.coworker.constructor.name === "String" ? JSON.parse(v.coworker) : v.coworker.constructor.name === " Array" ? v.related : []);
		this.related = (v.related === undefined ? {} : v.related.constructor.name === "String" ? JSON.parse(v.related) : v.related.constructor.name === " Object" ? v.related : {});
		this.created = (v.created === undefined || v.created === null ? new Date() : v.created.constructor.name === "Number" ? new Date(v.tocreated) : v.created);
		this.modified = (v.modified === undefined || v.modified === null ? new Date() : v.modified.constructor.name === "Number" ? new Date(v.modified) : v.modified);

	}

} // End of Class === Maintenance =======================================================================================

class Trade{
	constructor(data){
		this.no;
		this.dt;
		this.belongTo;
		this.writer;
		this.type;
		this.product;
		this.customer;
		this.taxbill;
		this.title;
		this.qty;
		this.price;
		this.vat;
		this.remark;
		this.pair;
		this.related;    
	} // End of constructor()

	// 영업기회 내 매입매출 컨테이너에 기본 구조를 그려넣는 메서드
	drawContainerInSopp(){
		let x, cnt;

		cnt = document.getElementsByClassName("")[0];
	} // End of drawContainerInSopp()
	/* ============================================================
	protected int no;
    protected Date dt;
    protected String belongTo;
    protected int writer;
    protected String type;
    protected int product;
    protected int customer;
    protected String taxbill;
    protected String title;
    protected int qty;
    protected long price;
    protected long vat;
    protected String remark;
    protected String pair;
    protected String related;    
	*/
}
/* =======================
let maintenance = {
	no:-1, // int
	contract:-1, // int
	customer:-1, // int
	title:"", // string
	product:-1, // int
	startDate:-1, // long or Date
	endDate:-1, // long or Date
	engineer:-1, // int
	coworker:[-1, -1], // Array[int,int]
	related:{},
	created:null,
	modified:null
}
============================= */