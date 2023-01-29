let drawMonthList, clickedMonth, clickedWeek, drawDeptTree, clickedDeptName, clickedTreeEmployee, drawReport, getReportData, clickedButton, editBtnDisplay, clickUpdateBtn, R = {};

$(document).ready(() => {

	R.workReport = {};
	R.workReport.employee = storage.my;

    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	drawMonthList();
	clickedWeek();
	drawDeptTree();
});

// 상당 타이틀바의 버튼 클릭시 실행되는 함수
clickedButton = (el) => {
	let n, x, y, z, arr, els, cnt, url, dt;
	n = el.dataset.n;
	if(n === "print"){ // 출력 버튼
		x =  window.open('/printReport.html', 'report', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
		//x.document.head.innerHTML = "<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/businessWorkreport2/businessWorkreport2.css\" />"
		x.html = document.getElementsByClassName("report-container")[0].innerHTML;
		
	}else if(n === "pdf-s"){ // 개별 다운로드
		x = document.getElementsByClassName("report-container")[0]; // 엘리먼트
		y = "employee"; // 파일이름
		if(storage.user[R.workReport.employee] !== undefined && storage.user[R.workReport.employee].userName !== undefined)	y = storage.user[R.workReport.employee].userName;
		y = (R.workReport.date + "_" + y + ".pdf");
		z = { // 옵션설정
			margin: 10,
			filename: y,
			html2canvas: {scale:1},
			jsPDF: {orientation: "landscape", unit: "mm", format: "A4", compressPDF: true}
		  };
		html2pdf().from(x).set(z).save();
	}else if(n === "pdf-m"){ // 일괄 다운로드
		arr = [];
		els = document.getElementsByClassName("dept-tree")[0].getElementsByTagName("input");
		for(let t = 0 ; t < els.length ; t++)	if(els[t].name === "deptTreeSelectEmp" && els[t].checked)	arr.push(els[t].dataset.select.substring(4) * 1);
		cnt = document.createElement("div");
		document.getElementsByClassName("workReportContent")[0].appendChild(cnt);
		//cnt.style.display = "none";
		for(x = 0 ; x < arr.length ; x++){
			z = document.createElement("div");
			z.className = "report-container";
			//z.style.display = "none";
			z.innerHTML = "<div>주간 업무 보고</div><div><div></div><div></div></div><div><div>지난 주 진행상황</div><div>이번 주 예정상황</div></div><div><div></div><div></div></div><div><div></div><div></div></div>";
			cnt.appendChild(z);
			drawReport(false, z, arr[x]);
		}
		
		if(storage.user[R.workReport.employee] !== undefined && storage.user[R.workReport.employee].userName !== undefined)	y = storage.user[R.workReport.employee].userName;
		y = (R.workReport.date + "_주간업무보고.pdf");
		z = { // 옵션설정
			margin: 10,
			filename: y,
			html2canvas: {scale:1},
			pagebreak: { mode: "avoid-all", after:".report-container"},
			jsPDF: {orientation: "landscape", unit: "mm", format: "A4", compressPDF: true}
		  };
		html2pdf().from(cnt).set(z).save();
		  window.setTimeout(function(){
			let cnt = document.getElementsByClassName("workReportContent")[0].children;
			if(cnt.length > 3)	cnt[3].remove();
		  },100)
	}else if(n === "edit"){ // 수정 버튼
		if(R.workReport.employee !== storage.my)	return;
		el.style.display = "none";
		el.nextElementSibling.style.display = "initial";
		el.nextElementSibling.nextElementSibling.style.display = "initial";
		drawReport(true);
	}else if(n === "save"){ // 저장 버튼
		els = document.getElementsByClassName("schedule-in-use");
		url = "/api/schedule2/report/";
		z = {"report":{"prv":undefined, prvUse:undefined, crnt:undefined, crntUse:undefined},"inUse":[],"notUse":[]};
		for(x = 0 ; x < els.length ; x++){
			if(els[x].dataset.no === "previousWeek")		z.report.prvUse = els[x].checked;
			else if(els[x].dataset.no === "currentWeek")	z.report.crntUse = els[x].checked;
			else if(els[x].checked)		z.inUse.push(els[x].dataset.no * 1);
			else						z.notUse.push(els[x].dataset.no * 1);
		}
		z.report.prv = CKEDITOR.instances.previousWeekDummy.getData();
		z.report.crnt = CKEDITOR.instances.currentWeekDummy.getData();
		z.report.prv = z.report.prv.replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\\", "&bsol;");
		z.report.crnt = z.report.crnt.replaceAll("\n", "").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\\", "&bsol;");
		z = JSON.stringify(z);
		z = cipher.encAes(z);
		dt = R.workReport.date.getFullYear() + "-" + (R.workReport.date.getMonth() < 9 ? "0" + (R.workReport.date.getMonth() + 1) : (R.workReport.date.getMonth() + 1)) + "-" + (R.workReport.date.getDate() < 10 ? "0" + (R.workReport.date.getDate()) : (R.workReport.date.getDate()))

		fetch(apiServer + url + dt, {
			method: "POST",
			header: {"Content-Type": "text/plain"},
			body: z
		}).catch((error) => console.log("error:", error))
		.then(response => response.json())
		.then(response => {
			let data;
			if(response.result === "ok"){
				getReportData(dt);
			}else{
				console.log(response.msg);
			}
		});
	}else if(n === "cancel"){
		if(CKEDITOR.instances !== undefined)	for(x in CKEDITOR.instances)	CKEDITOR.instances[x].destroy();
		z = document.getElementsByClassName("workReportTitle")[0].children[1].children;
		for(x = 0 ; x < z.length ; x++){
			y = z[x].dataset.n;
			if(y === "edit" )	z[x].style.display = R.workReport.employee === storage.my ? "initial" : "none";
			else if(y === "cancel")	z[x].style.display = "none";
			else if(y === "save")	z[x].style.display = "none";
		}
		drawReport();
	}
} // End of clickedButton()

clickUpdateBtn = () => {
	let updateBtn = document.querySelector("button[data-n=\"edit\"]");
	let nowDate = new Date().getTime();

	if(R.workReport.employee == storage.my && nowDate >= R.workReport.start && nowDate <= R.workReport.endTime)	updateBtn.style.display = "initial";
	else	updateBtn.style.display = "none";
} // End of clickUpdateBtn()

// 조직도에서 직원을 클릭할 때 실행되는 함수
clickedTreeEmployee = (el) => {
	let x, y, z, els, arr;
	x = el.getAttribute("for").substring(4) * 1;
	R.workReport.employee = x;
	drawReport();

	// 버튼 활성화
	z = document.getElementsByClassName("workReportTitle")[0].children[1].children;
	for(x = 0 ; x < z.length ; x++){
		y = z[x].dataset.n;
		if(y === "print")	z[x].style.display = "initial";
		else if(y === "pdf-s")	z[x].style.display = "initial";
		else if(y === "pdf-m"){
			window.setTimeout(function(){
				let t, els, arr = [];
				els = document.getElementsByClassName("dept-tree")[0].getElementsByTagName("input");
				for(t = 0 ; t < els.length ; t++)	if(els[t].name === "deptTreeSelectEmp" && els[t].checked)	arr.push(els[t].dataset.select.substring(4));
				if(arr.length > 1)	document.getElementsByClassName("workReportTitle")[0].children[1].children[2].style.display = "initial";
				else				document.getElementsByClassName("workReportTitle")[0].children[1].children[2].style.display = "none";
			},1)
		}else if(y === "edit")	z[x].style.display = R.workReport.employee === storage.my ? "initial" : "none";
		else if(y === "cancel")	z[x].style.display = "none";
		else if(y === "save")	z[x].style.display = "none";
	}
} // End of clickedTreeEmployee()

// 서버에서 리포트 데이터를 가져오는 함수
getReportData = (date) => {
	let url, dt;
	url = "/api/schedule2/report/";
	if(date === undefined){
		dt = new Date();
		dt.setDate(dt.getDate() - dt.getDay());
		dt = dt.toISOString().substring(0, 10);
	}else dt = date;

	fetch(apiServer + url + dt)
	.catch((error) => console.log("error:", error))
	.then(response => response.json())
	.then(response => {
		let data, dt;
		if(response.result === "ok"){
			data = response.data;
			data = cipher.decAes(data);
			data = JSON.parse(data);
			if(R.workReport === undefined)	R.workReport = {};
			R.workReport.date = new Date(data.date);
			R.workReport.start = new Date(data.start);
			R.workReport.end = new Date(data.end);
			R.workReport.report = data.report;
			R.workReport.schedule = data.schedule;
			if(R.workReport.employee === undefined)	R.workReport.employee = storage.my;
			drawReport();
			if(!(new Common().objectCheck(R.workReport.report)))	editBtnDisplay();
		}else{
			console.log(response.msg);
		}
	});
}

// 주간 업무보고를 그리는 함수
drawReport = (editable, targetElement, employee) => {
	let x, y, z, t, html, el, cnt, std, sch1, sch2, data, day, reportContents;
	day = ["일", "월", "화", "수", "목", "금", "토"];
	cnt = targetElement === undefined ? document.getElementsByClassName("report-container")[0] : targetElement;
	employee = employee === undefined ? R.workReport.employee : employee;

	// 웹에디터가 있는 경우 먼저 이를 제거함
	if(CKEDITOR.instances !== undefined)	for(x in CKEDITOR.instances)	CKEDITOR.instances[x].destroy();

	// 본인인 경우 편집할 수 있도록 설정하는 변수
	if(editable !== true || employee !== storage.my)	editable = false;
	else												editable = true;

	// 기간 설정
	std = R.workReport.date;
	x = "'" + (std.getFullYear() % 100) + ". " + (std.getMonth() + 1) + ". " + (std.getDate());
	y = R.workReport.end;
	y.setDate(y.getDate() - 1);
	y = "'" + (y.getFullYear() % 100) + ". " + (y.getMonth() + 1) + ". " + (y.getDate());
	cnt.children[1].children[0].innerHTML = (x + " ~ " + y);

	// 이름 설정
	z = "...";
	if(storage.user[employee] !== undefined && storage.user[employee].userName !== undefined)	z = storage.user[R.workReport.employee].userName;
	cnt.children[1].children[1].innerHTML = z;

	// 일정을 지난 주와 이번 주로 나누어서 저장
	sch1 = [[],[],[],[],[],[],[]];
	sch2 = [[],[],[],[],[],[],[]];
	data = R.workReport.report[employee];
	if(data === undefined)	data = {prv:"", prvUse:false, crnt:'', crntUse:false};
	z = R.workReport.schedule;
	
	for(x = 0 ; x < z.length ; x++){
		if(z[x].writer !== employee)	continue;
		t = new Date(z[x].from);
		count = 0;
		if(editable){ // 이틀 이상 걸치는 일정에 대해 해당 날짜에 모두 표시되게 함, 단 편집모드일 경우 예외
			y = t.getDay();
			if(t <= std)	sch1[y].push(z[x]);
			if(t > std)		sch2[y].push(z[x]);
		}else{
			while((t.getMonth() * 100 + t.getDate()) <= (new Date(z[x].to).getMonth() * 100 + new Date(z[x].to).getDate())){
				y = t.getDay();
				if(t <= std)	sch1[y].push(z[x]);
				if(t > std)		sch2[y].push(z[x]);
				t.setDate(t.getDate() + 1);
			} // End of while()
		}
	} // End of for(x)
	
	// 일정에 따른 데이터를 기반으로 html 생성
	html = ["", ""]; // 지난 주, 이번 주
	R.formList = {};
	let index = 0;
	for(x = 0 ; x < 7 ; x++){
		// 지난 주
		if(sch1[x].length > 0){
			html[0] += ("<div>" + day[x] + "</div><div class=\"lastWeekContents\">");
			for(y = 0 ; y < sch1[x].length ; y++){
				let itemName = "lastWeekData_" + index;
				R.formList[itemName] = sch1[x][y];
				html[0] += ("<div><div class=\"weekContentTitle\" data-no=\"" + sch1[x][y].no + "\" data-job=\"" + sch1[x][y].job + "\" data-name=\"lastWeekData_" + index + "\">" + sch1[x][y].title + "</div>");
				if(editable)	html[0] += ("<input class=\"schedule-in-use\" data-no=\"" + sch1[x][y].no + "\" type=\"checkbox\" " + (sch1[x][y].inUse ? "checked " : "") + "/>");
				html[0] += "</div>";
				html[0] += ("<div class=\"weekContentDesc\">" + sch1[x][y].content + "</div>");
				index++;
			}
			html[0] += "</div>";
		}
		// 이번 주
		if(sch2[x].length > 0){
			html[1] += ("<div>" + day[x] + "</div><div class=\"thisWeekContents\">");
			for(y = 0 ; y < sch2[x].length ; y++){
				let itemName = "thisWeekData_" + index;
				R.formList[itemName] = sch2[x][y];
				html[1] += ("<div><div class=\"weekContentTitle\" data-no=\"" + sch2[x][y].no + "\" data-job=\"" + sch2[x][y].job + "\" data-name=\"thisWeekData_" + index + "\">" + sch2[x][y].title + "</div>");
				if(editable)	html[1] += ("<input class=\"schedule-in-use\" data-no=\"" + sch2[x][y].no + "\" type=\"checkbox\" " + (sch2[x][y].inUse ? "checked " : "") + "/>");
				html[1] += "</div>";
				html[1] += ("<div class=\"weekContentDesc\">" + sch2[x][y].content + "</div>");
				index++;
			}
			html[1] += "</div>";
		}
	} // End of for(x)

	cnt.children[3].children[0].innerHTML = html[0];
	cnt.children[3].children[1].innerHTML = html[1];
	// 추가 기재사항
	if(data.prvUse){ // 지난 주
		html = "<div><div>추가 기재 사항</div>";
		if(editable){
			html += ("<input class=\"schedule-in-use\" data-no=\"previousWeek\" type=\"checkbox\" " + (data.prvUse ? "checked " : "") + "/></div>");
			html += ("<div class=\"previousWeek\">" + data.prv + "</div>"); // <=== 웹에디터 부착 필요
		}else{
			html += "</div><div class=\"previousWeek\">";
			if(!data.prvUse || data.prv === undefined || data.prv === "")	html += "<div class=\"empty-cell\">데이터가 없습니다.</div></div>";
			else	html += (data.prv + "</div>");
		}
		cnt.children[4].children[0].innerHTML = html;
	}else{
		if(editable){
			html = "<div><div>추가 기재 사항</div><input  class=\"schedule-in-use\" data-no=\"previousWeek\" type=\"checkbox\" " + (data.prvUse ? "checked " : "") + "/></div><div class=\"previousWeek\"></div>";
			cnt.children[4].children[0].innerHTML = html;
		}else{
			html = "<div><div>추가 기재 사항</div></div><div class=\"previousWeek\"><div class=\"empty-cell\">데이터가 없습니다.</div></div>";
			cnt.children[4].children[0].innerHTML = html;
		}
	}
	
	if(data.crntUse){ // 이번 주
		html = "<div><div>추가 기재 사항</div>";
		if(editable){
			html += ("<input class=\"schedule-in-use\" data-no=\"currentWeek\" type=\"checkbox\" " + (data.crntUse ? "checked " : "") + "/></div>");
			html += ("<div class=\"currentWeek\">" + data.crnt + "</div>"); // <=== 웹에디터 부착 필요
		}else{
			html += "</div><div class=\"currentWeek\">";	
			if(!data.crntUse || data.crnt === undefined || data.crnt === "")	html += "<div class=\"empty-cell\">데이터가 없습니다.</div></div>";
			else	html += (data.crnt + "</div>");
		}
		cnt.children[4].children[1].innerHTML = html;
	}else{
		if(editable){
			html = "<div><div>추가 기재 사항</div><input class=\"schedule-in-use\" data-no=\"currentWeek\" type=\"checkbox\" " + (data.crntUse ? "checked " : "") + "/></div><div class=\"currentWeek\"></div>";
			cnt.children[4].children[1].innerHTML = html;
		}else{
			html = "<div><div>추가 기재 사항</div></div><div class=\"currentWeek\"><div class=\"empty-cell\">데이터가 없습니다.</div></div>";
			cnt.children[4].children[1].innerHTML = html;
		}
	}

	if(storage.my === R.workReport.employee && editable){ // 본인 보고서일 경우 웹에디터를 미리 부착해 놓음
		cnt = document.getElementsByClassName("previousWeek")[0];
		el = document.createElement("textarea");
		el.style.display = "none";
		el.id = "previousWeekDummy";
		cnt.appendChild(el);
		cnt = document.getElementsByClassName("currentWeek")[0];
		el = document.createElement("textarea");
		el.style.display = "none";
		el.id = "currentWeekDummy";
		cnt.appendChild(el);

		ckeditor.config.readOnly = false;
		CKEDITOR.replace("previousWeekDummy",
			{height:200,
			removeButtons:"Source,Save,Templates,NewPage,Preview,Print,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About,Button,Select,Textarea,TextField,Radio,Checkbox,Form,Format,Styles"
		});
		CKEDITOR.replace("currentWeekDummy",
			{height:200,
			removeButtons:"Source,Save,Templates,NewPage,Preview,Print,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,ImageButton,HiddenField,CopyFormatting,RemoveFormat,Outdent,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About,Button,Select,Textarea,TextField,Radio,Checkbox,Form,Format,Styles"
		});
		CKEDITOR.instances.previousWeekDummy.setData(data.prv);
		CKEDITOR.instances.currentWeekDummy.setData(data.crnt);

		window.setTimeout(function(){
			let el = document.getElementById("previousWeekDummy");
			el.previousElementSibling.style.display = "none";
			el = document.getElementById("currentWeekDummy");
			el.previousElementSibling.style.display = "none";
		},40);
	}

	reportContents = document.getElementsByClassName("report-contents")[0];
	// 지난 주 일정이 없는 경우
	if(reportContents.children[0].children.length == 0)	reportContents.children[0].innerHTML = "<div class=\"empty-cell\">데이터가 없습니다.</div>";
	// 이번 주 일정이 없는 경우
	if(reportContents.children[1].children.length == 0)	reportContents.children[1].innerHTML = "<div class=\"empty-cell\">데이터가 없습니다.</div>";
} // End of drawReport()

// 조직도를 그리는 함수
drawDeptTree = () => {
	let x, t, cnt, els, arr;

	// dept가 준비되지 않은 경우 종료
	if(storage.dept === undefined || storage.dept.tree === undefined){
		window.setTimeout(drawDeptTree, 100);
		return;
	}

	// 조직도 그리기
	cnt = document.getElementsByClassName("dept-tree")[0];
	cnt.innerHTML = storage.dept.tree.getTreeHtml();
	els = cnt.getElementsByTagName("img");
	for(x = 0 ; x < els.length ; x++){
		// 이미지 크기 조정
		els[x].style.width = "15px";
		els[x].style.height = "15px";
		els[x].style.marginLeft = "";
	}

	// 퇴시자 숨기기
	arr = [];
	for(x in storage.user)	if(x !== undefined && !storage.user[x].resign)	arr.push(x);
	t = cnt.getElementsByTagName("label");
	for(x = 0 ; x < t.length ; x++){
		if(t[x].getAttribute("for") !== null && t[x].getAttribute("for").substring(0,4) === "emp:"){
			if(!arr.includes(t[x].getAttribute("for").substring(4))){
				if(t[x].previousElementSibling.tagName === "INPUT" && t[x].previousElementSibling.type === "radio")	t[x].previousElementSibling.remove();
				t[x].remove();
			}
		}
	}

	// 직원 선택할 수 있도록 준비
	els = [];
	arr = cnt.getElementsByClassName("dept-tree-select");
	for(x = 0 ; x < arr.length ; x++)	els.push(arr[x]);
	for(x = 0 ; x < els.length ; x++){
		if(els[x].id.substring(0,4) === "emp:"){
			els[x].type = "checkbox";
			els[x].className = "dept-emp-select";
			if(els[x].nextElementSibling.tagName === "LABEL")	els[x].nextElementSibling.setAttribute("onclick", "clickedTreeEmployee(this)");
		}else els[x].remove();
	}

	// 부서 클릭시 하위 직원/부서 전체 선택/취소 되도록 설정
	els = cnt.getElementsByClassName("deptName");
	for(x = 0 ; x < els.length ; x++)	els[x].children[0].setAttribute("onclick", "clickedDeptName(this)");

} // End of drawDeptTree()

// 조직도에서 부서 클릭시 실행되는 함수
clickedDeptName = (el) => {
	let x, cnt, els, v = false, arr;
	cnt = el.parentElement.nextElementSibling;
	els = cnt.getElementsByClassName("dept-emp-select");
	for(x = 0 ; x < els.length ; x++){
		if(!els[x].checked){
			v = true;
			break;
		}
	}
	for(x = 0 ; x < els.length ; x++)	els[x].checked = v;

	// 일괄 출력 버튼 활성/비활성 처리
	arr = [];
	els = document.getElementsByClassName("dept-tree")[0].getElementsByTagName("input");
	for(let t = 0 ; t < els.length ; t++)	if(els[t].name === "deptTreeSelectEmp" && els[t].checked)	arr.push(els[t].dataset.select.substring(4));
	if(arr.length > 1)	document.getElementsByClassName("workReportTitle")[0].children[1].children[2].style.display = "initial";
	else				document.getElementsByClassName("workReportTitle")[0].children[1].children[2].style.display = "none";
} // End of clickedDeptName()

// 좌측 달력을 그리는 함수
drawMonthList = () => {
	let x, y, cnt, year, month, dt, el, html, startDate, endDate, today, lastMonth;

	// 달력을 만들기 위한 기초데이터 정리
	cnt = document.getElementsByClassName("month-list")[0];
	today = new Date();
	year = today.getFullYear() - 1;
	month = today.getMonth() + 1;
	if(today.getDay() > 3)	today = new Date(today.getTime() + 86400000 * 7);

	// 달력을 그릴 마지막 월 계산 / 다음 주 토요일이 다음달로 넘어가는 경우 다음달까지, 아닌 경우 이번달까지
	lastMonth = new Date();
	lastMonth.setDate(lastMonth.getDate() - lastMonth.getDay());
	lastMonth = new Date(lastMonth.getTime() + 86400000 * 13);

	// 금주 선택을 위한 일요일 날짜 잡기
	x = new Date(new Date() - ((new Date()).getDay() * 86400000));
	x = x.getFullYear() * 10000 + (x.getDate() + 1) * 100 + x.getDate();

	// 달력 그리기
	while(year * 100 + month <= lastMonth.getFullYear() * 100 + lastMonth.getMonth() + 1) {
		// 달력 타이틀
		el = document.createElement("div");
		el.innerHTML = "<div>" + year + "</div><div>" + month + "</div>";
		el.className = "month-title";
		el.setAttribute("onclick", "clickedMonth(this)");
		cnt.appendChild(el);
		el = document.createElement("div");
		el.dataset.v = year * 100 + month;
		el.className = "month-closed";
		cnt.appendChild(el);
		html = "";
		
		// 해당 월에서의 시작/끝 날짜 정리
		startDate = new Date(year, month - 1 , 1);
		startDate = new Date(startDate.getTime() - startDate.getDay() * 86400000);
		endDate = new Date(new Date(year, month, 1).getTime() - 86400000);
		endDate = new Date(endDate.getTime() + (6 - endDate.getDay()) * 86400000);
		dt = startDate;

		// 달력 본문
		while(dt.getTime() <= endDate.getTime()) {
			y = dt.getFullYear() + "-" + (dt.getMonth() < 9 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1) + "-" + (dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate());
			if(dt.getDay() === 0)	html += "<div onclick=\"clickedWeek(this)\" class=\"weekly-list\" data-v=\"" + y + "\"" + (x === y ? " style=\"background-color:#eaeaff\"" : "") + ">";
			
			if(dt.getMonth() + 1 === month)	html += ("<div>" + dt.getDate() + "</div>");
			else		html += ("<span>" + dt.getDate() + "</span>");



			if(dt.getDay() === 6)	html += "</div>";
			dt = new Date(dt.getTime() + 86400000);
		} // End of while - STEP 2
		el.innerHTML = html;

		// 연이 빠뀌는 경우 월 변경
		if(month === 12){
			month = 1;
			year++;
		}else	month++;
		
	} // End of while - STEP 1

	// 현재 월을 선택처리함
	el = cnt.getElementsByClassName("month-closed");
	year = new Date().getFullYear();
	month = new Date().getMonth() + 1;
	for(x = 0 ; x < el.length ; x++){
		if(el[x].dataset.v === (year * 100 + month) + ""){
			el[x].className = "month-opened";
			break;
		}
	}
} // End of drawMonthList()

clickedMonth = (el) => {
	let target;
	if(el.nextElementSibling.className === "month-closed"){
		document.getElementsByClassName("month-opened")[0].className = "month-closed";
		el.nextElementSibling.className = "month-opened";
	}
} // End of clickedMonth()

clickedWeek = (el) => {
	let x, y, cnt, els, color = "#eaeaff";
	els = [];
	cnt = document.getElementsByClassName("month-list")[0];
	for(x = 1 ; x < cnt.children.length ; x += 2)	for(y = 0 ; y < cnt.children[x].children.length ; y++)	els.push(cnt.children[x].children[y]);
	if(el !== undefined)	y = el.dataset.v;
	else{
		y = new Date();
		y.setDate(y.getDate() - y.getDay());
		y = `${y.getFullYear()}-${y.getMonth() < 9 ? "0" + (y.getMonth() + 1) : (y.getMonth() + 1)}-${y.getDate() < 10 ? "0" + y.getDate() : y.getDate()}`;
	}
	getReportData(y);
	for(x = 0 ; x < els.length ; x++){
		if(els[x].dataset.v === y)	els[x].style.backgroundColor = color;
		else 						els[x].style.backgroundColor = "";
	}
} // End of clickedWeek()

editBtnDisplay = () => {
	let date = new Date();
	date.setDate(date.getDate() - date.getDay());
	let resultDate = new Date(date.toISOString().substring(0, 10) + " " + "00:00:00").getTime();
	document.querySelector("button[data-n=\"edit\"]").style.display = "none";
	if(resultDate < R.workReport.end && storage.my === R.workReport.employee)	document.querySelector("button[data-n=\"edit\"]").style.display = "inline-block";
} // End of editBtnDisplay()








// 오리지날 함수들 =====================================================================================================
function getWorkReport() {
	let url, method, data, type;

	url = "/api/schedule/workreport/personal/";
	method = "get";
	data = "";
	type = "list";

	crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}

function drawWorkReportList() {
	let workReportContent, jsonData, html = "", header, disDate, start, end, week, getLastDate, getNextDate, nowDate;
    
    if(storage.workReportList.workReport === null){
        jsonData = storage.workReportList.previousWeek;
    }else{
        jsonData = storage.workReportList.workReport;
    }

	workReportContent = document.getElementsByClassName("workReportContent")[0];

    header = [
        {
            "title": "주차"
        },
        {
            "title": "요일"
        },
        {
            "title": "일정제목"
        },
        {
            "title": "일정내용"
        },
        {
            "title": "일정시작"
        },
        {
            "title": "일정종료"
        },
        {
            "title": "업무일지반영"
        },
    ];

    start = new Date(storage.workReportList.start);
    start = new Date(start.getTime() + 86400000 * 7);
    disDate = dateDis(start);
    start = dateFnc(disDate);

    getLastDate = calDays(start, "last");
    getNextDate = calDays(start, "next");

    html = "<div class='reportBtns'>";
    html += "<div class='reportBtnPrev'>";
    html += "<button type='button' data-date='" + getLastDate + "' onclick='workReportWeekBtn(this);'>이전</button>";
    html += "</div>";
    html += "<div class='reportBtnNext'>";
    html += "<button type='button' data-date='" + getNextDate + "' onclick='workReportWeekBtn(this);'>다음</button>";
    html += "</div>";
    html += "</div>";

    html += "<div class='reportContents'>";
    html += "<div class='reportHeader'>";

    for(let i = 0; i < header.length; i++){
        if(i == 2 || i == 3){
            html += "<div style='justify-content: left;'>" + header[i].title + "</div>";
        }else{
            html += "<div style='justify-content: center;'>" + header[i].title + "</div>";
        }
    }

    html += "</div>";
    
    html += "<div class='reportContent'>";
    
    scheduleDatas = jsonData.schedules.sort(function(a, b){return a.date - b.date;});

    let rowLength = 0;
    for(let i = 0; i < scheduleDatas.length; i++){
        let date = new Date(scheduleDatas[i].date);
        let dateStart = new Date(storage.workReportList.start);
        if(dateStart.getTime() + 86400000 * 7 < date.getTime()){
            rowLength++;
        }
    }

    html += "<div style='grid-row: span " + (rowLength + 1) + "; justify-content: center;'>" + storage.workReportList.week + "</div>";
    
    for(let i = 0; i < scheduleDatas.length; i++){
        let date = new Date(scheduleDatas[i].date);
        let dateStart = new Date(storage.workReportList.start);
        if(dateStart.getTime() + 86400000 * 7 < date.getTime()){
            week = calWeekDay(scheduleDatas[i].date);
            html += "<div class=\"rowSpanColumn\" style='justify-content: center;'>" + week + "</div>";
            html += "<div style='justify-content: left;'>" + "<a href=\"#\" data-id=\"" + scheduleDatas[i].no + "\" data-job=\"" + scheduleDatas[i].job + "\" onclick=\"reportDetailView(this);\">" + scheduleDatas[i].title + "</a></div>";
            html += "<div style='justify-content: left;'>" + scheduleDatas[i].content + "</div>";
            html += "<div style='justify-content: center;'>" + date.toISOString().substring(0, 10) + "</div>";
            html += "<div style='justify-content: center;'>" + date.toISOString().substring(0, 10) + "</div>";
            
            if(scheduleDatas[i].report){
                html += "<div style='justify-content: center;'><input class='schedCheck' type='checkbox' data-id='" + scheduleDatas[i].no + "' data-job='" + scheduleDatas[i].job + "' checked></div>"; 
            }else{
                html += "<div style='justify-content: center;'><input class='schedCheck' type='checkbox' data-id='" + scheduleDatas[i].no + "' data-job='" + scheduleDatas[i].job + "'></div>";
            }
        }
    }
    html += "<div style='justify-content: center;'>추가기재사항</div>";
    html += "<div style='grid-column: span 4'>";
    html += "<textarea id='currentWeek' style='width: -webkit-fill-available;'>" + jsonData.previousWeek + "</textarea>";
    html += "</div>";

    if(jsonData.previousWeekCheck){
        html += "<div style='justify-content: center;'><input type='checkbox' id='previousWeekCheck' checked></div>"; 
    }else{
        html += "<div style='justify-content: center;'><input type='checkbox' id='previousWeekCheck'></div>";
    }

    html += "</div>";
    html += "</div>";

    workReportContent.style.display = "none";
    workReportContent.innerHTML = html;
    gridSetRowSpan("rowSpanColumn");
    workReportContent.style.display = "block";

    nowDate = new Date();
    nowDate = nowDate.toISOString().substring(0, 10).replaceAll("-", "");

    if($("#reportInsertBtn").attr("onclick") === undefined){
        $("#reportInsertBtn").attr("onclick", "reportInsert(" + nowDate + ")");
    }

    ckeditor.config.readOnly = false;
    window.setTimeout(setEditor, 100);
}

function reportDetailView(e){
	let id, job, url, method, data, type;

	id = $(e).data("id");
	job = $(e).data("job");
	url = "/api/schedule/" + job + "/" + id;
	method = "get";
	type = "detail";

	crud.defaultAjax(url, method, data, type, reportSuccessView, reportErrorView);
}

function reportSuccessView(result){
	let html, title, dataArray, notIdArray, datas, defaultFormLine;

	title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
	dataArray = reportUpdateForm(result.job, result);
	html = detailViewForm(dataArray, "modal");
	
	modal.show();
	modal.content.css("min-width", "70%").css("max-width", "70%");
	modal.headTitle.text(title);
	modal.body.html(html);
	notIdArray = ["writer"];

	if(storage.my == result.writer){
		modal.confirm.text("수정");
		modal.confirm.attr("onclick", "enableDisabled(this, \"reportUpdate();\", \"" + notIdArray + "\");");
		defaultFormLine = $(".defaultFormLine");
		defaultFormLine.eq(0).append("<button type=\"button\" class=\"modalDeleteBtn\" onclick=\"reportDelete();\">삭제</button>");
	}else{
		modal.confirm.hide();
	}

	modal.close.text("취소");
	modal.close.attr("onclick", "modal.hide();");

	setTimeout(() => {
		$("[name='job'][value='" + result.job + "']").attr("checked", true).removeAttr("onclick");
		if(result.job === "sales"){
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
			datas = ["sopp", "writer", "customer", "partner"];
			$("#type option[value='" + type + "']").attr("selected", true);
		}else if(result.job === "tech"){
			let contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : result.contractMethod;
			let type = (result.type === null || result.type === "" || result.type === undefined) ? "" : result.type;
			let supportStep = (result.supportStep === null || result.supportStep === "" || result.supportStep === undefined) ? "" : result.supportStep;
			datas = ["sopp", "writer", "customer", "partner", "cipOfCustomer", "contract"];

			$("[name='contractMethod'][value='" + contractMethod + "']").attr("checked", true);
			$("#type option[value='" + type + "']").attr("selected", true);
			$("#supportStep option[value='" + supportStep + "']").attr("selected", true);
		}else{
			datas = ["sopp", "writer", "customer"];
		}

		let jobArray = $("input[name=\"job\"]");

		for(let i = 0; i < jobArray.length; i++){
			if(!$(jobArray[i]).is(":checked")){
				$(jobArray[i]).hide();
				$(jobArray[i]).next().hide();
			}
		}

		detailTrueDatas(datas);
		ckeditor.config.readOnly = true;
		window.setTimeout(setEditor, 100);
	}, 100);

	setTimeout(() => {
		document.getElementsByClassName("cke_textarea_inline")[0].style.height = "300px";
	}, 300);
}

function reportErrorView(){
	msg.set("에러");
}

function reportUpdateForm(value, result){
	let dataArray; 

	if(value === "sales"){
		detailSetFormList(result);
		let from, to, place, writer, sopp, customer, partner, title, content;
		
		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
        sopp = "";
        for(let key in storage.sopp){
            if(storage.sopp[key].no == result.sopp){
                sopp = storage.sopp[key].title;
            }
        }

		writer = (result.writer === null || result.writer == 0 || result.writer === undefined) ? "" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
		
		dataArray = [
			{
				"title": undefined,
				"radioValue": [
					{
						"key": "sales",
						"value": "영업일정",
					},
					{
						"key": "tech",
						"value": "기술일정",
					},
					{
						"key": "schedule",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "job",
				"radioType": "tab",
				"elementId": ["jobSales", "jobTech", "jobSchedule"],
				"col": 4,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "활동시작일(*)",
				"elementId": "from",
				"type": "date",
				"value": from,
			},
			{
				"title": "활동종료일(*)",
				"elementId": "to",
				"type": "date",
				"value": to,
			},
			{
				"title": "장소",
				"elementId": "place",
				"value": place,
			},
			{
				"title": "활동형태(*)",
				"selectValue": [
					{
						"key": "10170",
						"value": "회사방문",
					},
					{
						"key": "10171",
						"value": "기술지원",
					},
					{
						"key": "10221",
						"value": "제품설명",
					},
					{
						"key": "10222",
						"value": "시스템데모",
					},
					{
						"key": "10223",
						"value": "제품견적",
					},
					{
						"key": "10224",
						"value": "계약건 의사결정지원",
					},
					{
						"key": "10225",
						"value": "계약",
					},
					{
						"key": "10226",
						"value": "사후처리",
					},
					{
						"key": "10227",
						"value": "기타",
					},
					{
						"key": "10228",
						"value": "협력사요청",
					},
					{
						"key": "10229",
						"value": "협력사문의",
					},
					{
						"key": "10230",
						"value": "교육",
					},
					{
						"key": "10231",
						"value": "전화상담",
					},
					{
						"key": "10232",
						"value": "제조사업무협의",
					},
					{
						"key": "10233",
						"value": "외부출장",
					},
					{
						"key": "10234",
						"value": "제안설명회",
					}
				],
				"type": "select",
				"elementId": "type",
			},
			{
				"title": "담당자(*)",
				"elementId": "writer",
				"complete": "user",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": writer,				
			},
			{
				"title": "영업기회",
				"elementId": "sopp",
				"complete": "sopp",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": sopp,
			},
			{
				"title": "매출처",
				"elementId": "customer",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": customer,
			},
			{
				"title": "엔드유저",
				"elementId": "partner",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": partner,
			},
			{
				"type": "",
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"value": title,
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "content",
				"type": "textarea",
				"value": content,
				"col": 4,
			}
		];
	}else if(value === "tech"){
		detailSetFormList(result);
		let from, to, place, writer, sopp, contract, contractMethod, customer, cipOfCustomer, partner, title, content, supportModel, supportVersion;
		
		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
		sopp = "";
        for(let key in storage.sopp){
            if(storage.sopp[key].no == result.sopp){
                sopp = storage.sopp[key].title;
            }
        }

		writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
		partner = (result.partner == 0 || result.partner === null || result.partner === undefined) ? "" : storage.customer[result.partner].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;
		supportModel = (result.supportModel === null || result.supportModel === "" || result.supportModel === undefined) ? "" : result.supportModel;
		supportVersion = (result.supportVersion === null || result.supportVersion === "" || result.supportVersion === undefined) ? "" : result.supportVersion;
		cipOfCustomer = (result.cipOfCustomer === null || result.cipOfCustomer === "" || result.cipOfCustomer === undefined) ? "" : result.cipOfCustomer;
		contractMethod = (result.contractMethod === null || result.contractMethod === "" || result.contractMethod === undefined) ? "" : storage.code.etc[result.contractMethod];
		supportStep = (result.supportStep === "" || result.supportStep === null || result.supportStep === undefined) ? "" : storage.code.etc[result.supportStep];
		type = (result.type === "" || result.type === null || result.type === undefined) ? "" : storage.code.etc[result.type]; 

        contract = "";
        for(let key in storage.contract){
            if(storage.contract[key].no == result.contract){
                contract = storage.contract[key].title;
            }
        }

		cipOfCustomer = "";
        for(let key in storage.cip){
            if(storage.contract[key].no == cipOfCustomer){
                cipOfCustomer = storage.cip[key].name;
            }
        }

		dataArray = [
			{
				"title": undefined,
				"radioValue": [
					{
						"key": "sales",
						"value": "영업일정",
					},
					{
						"key": "tech",
						"value": "기술일정",
					},
					{
						"key": "schedule",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "job",
				"radioType": "tab",
				"elementId": ["jobSales", "jobTech", "jobSchedule"],
				"col": 4,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "등록구분(*)",
				"radioValue": [
					{
						"key": "10247",
						"value": "신규영업지원",
					},
					{
						"key": "10248",
						"value": "유지보수",
					},
				],
				"type": "radio",
				"elementId": "contractMethod",
				"elementName": "contractMethod",
				"col": 4,
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
				"title": "계약",
				"elementId": "contract",
				"complete": "contract",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": contract,
			},
			{
				"title": "매출처",
				"elementId": "partner",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": partner,
			},
			{
				"title": "매출처 담당자",
				"complete": "cip",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"elementId": "cipOfCustomer",
				"value": cipOfCustomer,
			},
			{
				"title": "엔드유저(*)",
				"elementId": "customer",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": customer,
			},
			{
				"title": "모델",
				"elementId": "supportModel",
				"value": supportModel,
			},
			{
				"title": "버전",
				"elementId": "supportVersion",
				"value": supportVersion,
			},
			{
				"title": "단계",
				"selectValue": [
					{
						"key": "10213",
						"value": "접수단계",
					},
					{
						"key": "10214",
						"value": "출동단계",
					},
					{
						"key": "10215",
						"value": "미계약에 따른 보류",
					},
					{
						"key": "10253",
						"value": "처리완료",
					}
				],
				"type": "select",
				"elementId": "supportStep",
			},
			{
				"title": "지원형태",
				"selectValue": [
					{
						"key": "10187",
						"value": "전화상담",
					},
					{
						"key": "10208",
						"value": "현장방문",
					},
					{
						"key": "10209",
						"value": "원격지원",
					}
				],
				"type": "select",
				"elementId": "type",
			},
			{
				"title": "장소",
				"elementId": "place",
				"value": place,
			},
			{
				"title": "담당자(*)",
				"complete": "user",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"elementId": "writer",
				"value": writer,
			},
			{
				"title": "지원일자 시작일(*)",
				"elementId": "from",
				"type": "date",
				"value": from,
			},
			{
				"title": "지원일자 종료일(*)",
				"elementId": "to",
				"type": "date",
				"value": to,
			},
			{
				"title": "",
			},
			{
				"title": "",
			},
			{
				"title": "",
			},
			{
				"title": "기술지원명(*)",
				"elementId": "title",
				"value": title,
				"col": 4,
			},
			{
				"title": "내용",
				"type": "textarea",
				"elementId": "content",
				"value": content,
				"col": 4,
			},
		];
	}else{
		detailSetFormList(result);
		let from, to, disDate, place, sopp, customer, writer, title, content;

		disDate = dateDis(result.from);
		from = dateFnc(disDate);

		disDate = dateDis(result.to);
		to = dateFnc(disDate);

		place = (result.place === null || result.place === "" || result.place === undefined) ? "" : result.place;
		
		sopp = "";
        for(let key in storage.sopp){
            if(storage.sopp[key].no == result.sopp){
                sopp = storage.sopp[key].title;
            }
        }

		writer = (result.writer === null || result.writer === "" || result.writer === undefined) ? "" : storage.user[result.writer].userName;
		customer = (result.customer == 0 || result.customer === null || result.customer === undefined) ? "" : storage.customer[result.customer].name;
		title = (result.title === null || result.title === "" || result.title === undefined) ? "" : result.title;
		content = (result.content === null || result.content === "" || result.content === undefined) ? "" : result.content;

		dataArray = [
			{
				"title": undefined,
				"radioValue": [
					{
						"key": "sales",
						"value": "영업일정",
					},
					{
						"key": "tech",
						"value": "기술일정",
					},
					{
						"key": "schedule",
						"value": "기타일정",
					},
				],
				"type": "radio",
				"elementName": "job",
				"radioType": "tab",
				"elementId": ["jobSales", "jobTech", "jobSchedule"],
				"col": 4,
				"onClick": "scheduleRadioClick(this);",
			},
			{
				"title": "일정시작일(*)",
				"type": "date",
				"elementId": "from",
				"value": from,
			},
			{
				"title": "일정종료일(*)",
				"type": "date",
				"elementId": "to",
				"value": to,
			},
			{
				"title": "장소",
				"elementId": "place",
				"value": place,
			},
			{
				"title": "영업기회",
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
				"value": writer,
			},
			{
				"title": "매출처",
				"elementId": "customer",
				"complete": "customer",
				"keyup": "addAutoComplete(this);",
				"onClick": "addAutoComplete(this);",
				"value": customer,
			},
			{
				"title": "",
			},
			{
				"title": "",
			},
			{
				"title": "제목(*)",
				"elementId": "title",
				"value": title,
				"col": 4,
			},
			{
				"title": "내용",
				"elementId": "content",
				"value": content,
				"type": "textarea",
				"col": 4,
			},
		];
	}

	return dataArray;
}

function workReportSuccessList(result){
	storage.workReportList = result;
	
	if(storage.customer === undefined || storage.code === undefined || storage.dept === undefined){
		window.setTimeout(drawWorkReportList, 600);
	}else{
		window.setTimeout(drawWorkReportList, 200);
	}
}

function workReportErrorList(){
	alert("에러");
}

function workReportWeekBtn(e){
    let url, method, data, type, getDate;

    getDate = $(e).data("date");
    $("#reportInsertBtn").attr("onclick", "reportInsert(" + getDate + ")");

    url = "/api/schedule/workreport/personal/" + getDate;
    method = "get";
    type = "list";

    crud.defaultAjax(url, method, data, type, workReportSuccessList, workReportErrorList);
}

function reportInsert(date){
    let url, method, data, type, jsonData, dataArray = [], schedCheck;
    schedCheck = document.getElementsByClassName("schedCheck");

    if(storage.workReportList.workReport === null){
        jsonData = storage.workReportList.previousWeek;
    }else{
        jsonData = storage.workReportList.workReport;
    }

    for(let i = 0; i < schedCheck.length; i++){
        let item = schedCheck[i];
        let temp = {
            "no": $(item).data("id").toString(),
            "job": $(item).data("job"),
            "report": ($(item).is(":checked") == true) ? true : false,
        }
        dataArray.push(temp);
    }

    url = "/api/schedule/workreport/personal/" + date;
    method = "post";
    data = {
        "currentWeek": jsonData.currentWeek,
        "currentWeekCheck": jsonData.currentWeekCheck,
        "previousWeek": CKEDITOR.instances.currentWeek.getData().replaceAll("\n", ""),
        "previousWeekCheck": ($("#previousWeekCheck").is(":checked") == true) ? true : false,
        "schedule": dataArray,
    };
    type = "insert";

    data = JSON.stringify(data);
    data = cipher.encAes(data);

    crud.defaultAjax(url, method, data, type, workReportSuccessInsert, workReportErrorInsert);
}

function workReportSuccessInsert(){
    alert("등록완료");
    location.reload();
}

function workReportErrorInsert(){
    alert("에러");
}

function reportUpdate(){
	let url, method, data, type, job;

	job = $("[name='job']:checked").val();

	url = "/api/schedule/" + job + "/" + storage.formList.no;
	method = "put";
	type = "update";

	if(job === "sales"){
		if($("#from").val() === ""){
			msg.set("활동시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			msg.set("활동종료일을 선택해주세요.");
			return false;
		}else if($("#title").val() === ""){
			msg.set("제목을 입력해주세요.");
			$("#title").focus();
			return false;
		}else if($("#sopp").val() !== "" && !validateAutoComplete($("#sopp").val(), "sopp")){
			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
			$("#sopp").focus();
			return false;
		}else if($("#customer").val() !== "" && !validateAutoComplete($("#customer").val(), "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			$("#customer").focus();
			return false;
		}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
			$("#partner").focus();
			return false;
		}
	}else if(job === "tech"){
		if($("#title").val() === ""){
			msg.set("기술요청명을 입력해주세요.");
			$("#title").focus();
			return false;
		}else if($("#sopp").val() === ""){
			msg.set("영업기회를 선택해주세요.");
			$("#sopp").focus();
			return false;
		}else if(!validateAutoComplete($("#sopp").val(), "sopp")){
			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
			$("#sopp").focus();
			return false;
		}else if($("#contract").val() !== "" && !validateAutoComplete($("#contract").val(), "contract")){
			msg.set("조회된 계약이 없습니다.\n다시 확인해주세요.");
			$("#contract").focus();
			return false;
		}else if($("#partner").val() !== "" && !validateAutoComplete($("#partner").val(), "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			$("#partner").focus();
			return false;
		}else if($("#cipOfCustomer").val() !== "" && !validateAutoComplete($("#cipOfCustomer").val(), "cip")){
			msg.set("조회된 매출처 담당자가 없습니다.\n다시 확인해주세요.");
			$("#cipOfCustomer").focus();
			return false;
		}else if($("#customer").val() === ""){
			msg.set("엔드유저를 선택해주세요.");
			$("#customer").focus();
			return false;
		}else if(!validateAutoComplete($("#customer").val(), "customer")){
			msg.set("조회된 엔드유저가 없습니다.\n다시 확인해주세요.");
			$("#customer").focus();
			return false;
		}else if($("#from").val() === ""){
			msg.set("지원시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			msg.set("지원종료일을 선택해주세요.");
			$("#title").focus();
			return false;
		}
	}else{
		if($("#from").val() === ""){
			msg.set("일정시작일을 선택해주세요.");
			return false;
		}else if($("#to").val() === ""){
			msg.set("일정종료일을 선택해주세요.");
			return false;
		}else if($("#title").val() === ""){
			msg.set("제목을 입력해주세요.");
			$("#title").focus();
			return false;
		}else if($("#sopp").val() !== "" && !validateAutoComplete($("#sopp").val(), "sopp")){
			msg.set("조회된 영업기회가 없습니다.\n다시 확인해주세요.");
			$("#sopp").focus();
			return false;
		}else if($("#customer").val() !== "" && !validateAutoComplete($("#customer").val(), "customer")){
			msg.set("조회된 매출처가 없습니다.\n다시 확인해주세요.");
			$("#customer").focus();
			return false;
		}
	}

	formDataSet();
	data = storage.formList;
	data = JSON.stringify(data);
	data = cipher.encAes(data);

	crud.defaultAjax(url, method, data, type, reportSuccessUpdate, reportErrorUpdate);
}

function reportSuccessUpdate(){
	location.reload();
	msg.set("수정완료");
}

function reportErrorUpdate(){
	msg.set("에러");
}

function reportDelete(){
	if(confirm("삭제하시겠습니까??")){
		let url, method, data, type;

		url = "/api/schedule/" + storage.formList.job + "/" + storage.formList.no;
		method = "delete";
		type = "delete";

		crud.defaultAjax(url, method, data, type, reportSuccessDelete, reportErrorDelete);
	}else{
		return false;
	}
}

function reportSuccessDelete(){
	location.reload();
	msg.set("삭제완료");
}

function reportErrorDelete(){
	msg.set("에러");
}