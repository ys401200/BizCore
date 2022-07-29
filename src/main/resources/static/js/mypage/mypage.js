$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	showCheckPwForm();
});




function showCheckPwForm() {
	let target = $(".mypagediv");
	let html = "";
	html = "<div class='mypageFirstDiv'><label for='pwInput'>비밀번호 확인</label><input type='password' id='pwInput'/>"
		+ "<button type='button' id='pwCheckbtn' onclick='checkPw()'>확인</button><div>"
	target.html(html);


}



function checkPw() {
	let insertedPw = $("#pwInput").val(); // 입력받은 비밀번호 
	insertedPw = cipher.encAes(insertedPw);
	console.log(insertedPw);
	let url;

	url = apiServer + "/api/my/" + insertedPw;
	$.ajax({
		"url": url,
		"method": "get",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			let data;
			if (result.result === "ok") {
				data = cipher.decAes(result.data);
				data = JSON.parse(data);
			
				drawMyPage(data);
			} else {
				modal.alert("알림", "비밀번호가 틀렸습니다");
			}
		}
	})


}



function drawMyPage(data) {

	let target = $(".mypagediv");
	console.log(data.id);

	let html = "<div class='mypageSecondDiv'><div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>아이디</div><div class='infoData'>" + data.id + "</div></div>" +
		"<div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>이름</div><div class='infoData'>" + data.name + "</div></div>" +
		"<div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>사번</div><div class='infoData'>" + data.no + "</div></div>" +
		"<div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>전화번호</div><div class='infoData'>" + data.phone + "</div></div>" +
		"<div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>이메일</div><div class='infoData'>" + data.email + "</div></div>" +
		"<button type='button' class='modifybtn'>개인정보 수정</button>" +
		"<button type='button' class='modifybtn'>비밀번호 수정</button></div>";


	//let rightHtml = "<div><img src='../../images/icons/png.png' width=80 heigh=100></div><div><input type='file' onchange='changePhoto(event)'/></div>";

	target.html(html);
	modifyInfo(data);


}


function modifyInfo(data) {
	let btn = $(".modifybtn");
	let target = $(".mypagediv");
	btn[0].addEventListener('click', () => {

		let html = "<div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>전화번호</div><input type='text' id='modifyPhone' value='" + data.phone + "' required/></div>" +
			"<div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>이메일</div><input type='email' id='modifyEmail' value='" + data.email + "'required/></div>" +
			"<button type='button' class='modifybtn' onclick='modifyConfirm()'>확인</button>"




		target.html(html);
	});

	btn[1].addEventListener('click', () => {

		let html = "<div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>현재 비밀번호</div><input type='password' id='oldpw' /></div>" +
			"<div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>새 비밀번호</div><input type='password' id='newpw' /></div>" +
			"<div style='display:grid;grid-template-columns:30% 70%' class='gridContainer'><div class='infoTitle'>새 비밀번호 확인</div><input type='password' id='newpwcheck' /></div>"
			+"<button type='button' class='modifybtn' onclick='modifypw()'>확인</button>"

		target.html(html);
	});


}


function modifyConfirm() {
	let phone = $("#modifyPhone").val();
	let email = $("#modifyEmail").val();


	let phonecheck = /^(01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;
	if (!phonecheck.test(phone)) {
		modal.alert("알림", "핸드폰 번호를 입력하세요 ex)000-0000-0000");
		return;
	}

	email = email.trim();
	let emailcheck = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

	if (!emailcheck.test(email)) {
		modal.alert("알림", "이메일 양식을 확인하세요");
		return;
	}


	let url = apiServer + "/api/my";

	let data = {
		"email": email,
		"phone": phone
	};
	data = JSON.stringify(data)
	data = cipher.encAes(data);
	$.ajax({
		"url": url,
		"method": "post",
		"data": data,
		"contentType": "application/json ",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			if (result.result === "ok") {
				modal.alert("알림", "개인정보가 변경되었습니다");
				showCheckPwForm();
			} else {
				modal.alert("알림", "개인정보 수정에 실패했습니다");
			}
		}
	})


}


function modifypw() {
	let oldpw = $("#oldpw").val();
	let newpw = $("#newpw").val();
	let newpwcheck =$("#newpwcheck").val(); 



	if (oldpw.length == 0) {
		modal.alert("알림", "현재 비밀번호를 입력하세요");
		return;
	}

	if (newpw.length == 0) {
		modal.alert("알림", "새로운 비밀번호를 입력하세요");
		return;
	}

	if(newpw != newpwcheck) {
		modal.alert("알림", "비밀번호 확인이 틀렸습니다");
		return;
	} 




	let url = apiServer + "/api/my";

	let data = {
		"old": oldpw,
		"new": newpw
	};
	data = JSON.stringify(data)
	data = cipher.encAes(data);


	$.ajax({
		"url": url,
		"method": "put",
		"data": data,
		"contentType": "application/json ",
		"dataType": "json",
		"cache": false,
		success: (result) => {
			if (result.result === "ok") {
				modal.alert("알림", "비밀번호가 변경되었습니다");
				showCheckPwForm();
			} else {
				modal.alert("알림", "비밀번호 수정에 실패했습니다");

			}
		}
	})

}



