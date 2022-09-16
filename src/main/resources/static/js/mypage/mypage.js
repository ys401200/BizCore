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
	insertedPw = encodeURI(cipher.encAes(insertedPw));
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
				storage.myData = data;
				drawMyPage(data);
			} else {
				modal.alert("알림", "비밀번호가 틀렸습니다");
			}
		}
	})


}



function drawMyPage(data) {
	let target = $(".mypagediv");

	let addressArr = data.address.split("===");
	let maindAddress = addressArr[0];
	let detailAddress = addressArr[1];

	if (data.zipCode == undefined || data.zipCode == "null" || data.zipCode == 0) {
		data.zipCode = "";
	}
	if (maindAddress == undefined || maindAddress == "null" || maindAddress == 0) {
		maindAddress = "";
	}
	if (detailAddress == undefined || detailAddress == "null" || detailAddress == 0) {
		detailAddress = "";
	}
	data.gender = data.gender == "0" ? "남'" : "여";
	let created = getYmdHyphen(data.created);
	let modified = getYmdHyphen(data.modified);


	let html = "<div class='mypageSecondDiv'><div class='forPhoto'></div>" +
		"<div><div><div>아이디</div><input type='text'  value='" + data.userId + "' disabled/></div>" +
		"<div><div>이름</div><input type='text' value='" + data.userName + "'disabled/></div>" +
		"<div><div>직급</div><input type='text' value='" + data.rank + "'disabled/></div>" +
		"<div><div>이메일</div><input type='text' class='change email' value='" + data.email + "'disabled /></div>" +
		"<div><div>핸드폰번호</div><input type='text' class='change cellPhone' value='" + data.cellPhone + "'disabled/></div>" +
		"<div><div>전화번호</div><input type='text' class='change homePhone' value='" + data.homePhone + "'disabled/></div>" +
		"<div class='threeGrid'><div>우편번호</div><input type='text' id='postCode' class='zipCode' value='" + data.zipCode + "'disabled/><button type='button' class='daumBtn' onclick='daumPostCode()'>검색</button></div>" +
		"<div><div>주소</div><input type='text' id='mainAddress' class='address' value='" + maindAddress + "'disabled/></div>" +
		"<div><div>상세 주소</div><input type='text' id='detailAddress' class='change address' value='" + detailAddress + "'disabled/></div>" +
		"<div><div>생년월일</div><input type='text' value='" + data.birthDay + "'disabled/></div>" +
		"<div><div>성별</div><input type='text' value='" + data.gender + "'disabled/></div>" +
		"<div><div>등록 일자</div><input type='text' value='" + created + "'disabled/></div>" +
		"<div><div>최근 수정 일자</div><input type='text' value='" + modified + "'disabled/></div>" +
		"</div></div><div class='mainModBtnDiv'><button type='button' class='modifybtn' onclick='modifyInfoBtn()'>개인정보 수정</button>" +
		"<button type='button' class='modifybtn' onclick='modifyPwBtn()'>비밀번호 수정</button></div>";


	let rightHtml = "<div><img id='preview'src='/api/my/image' width=80 heigh=100></div><div><input name='attached[]' type='file'class='modPhoto' onchange ='readURL(this)'/></div>";

	target.html(html);
	$(".forPhoto").html(rightHtml);
	$(".daumBtn").hide();
	$(".modPhoto").hide();

}


function modifyPwBtn(data) {
	let target = $(".mypagediv");
	let html = "<div class='gridContainer third'><div class='infoTitle'>현재 비밀번호</div><input type='password' id='oldpw' /></div>" +
		"<div  class='gridContainer third'><div class='infoTitle'>새 비밀번호</div><input type='password' id='newpw' /></div>" +
		"<div  class='gridContainer third'><div class='infoTitle'>새 비밀번호 확인</div><input type='password' id='newpwcheck' /></div>"
		+ "<button type='button' class='modifybtn' onclick='modifypw()'>확인</button><button class='modifybtn' type='button' onclick='quitMod()'>취소</button>"
	target.html(html);
}





function modifypw() {
	let oldpw = $("#oldpw").val();
	let newpw = $("#newpw").val();
	let newpwcheck = $("#newpwcheck").val();
	// 최소 8 자, 최소 한개의 영문자 최소 한 개의 숫자 
	let pwCheck = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

	if (oldpw.length == 0) {
		modal.alert("알림", "현재 비밀번호를 입력하세요");
		return;
	}

	if (newpw.length == 0) {
		modal.alert("알림", "새로운 비밀번호를 입력하세요");
		return;
	}

	// if (!pwCheck.test(newpw)) {
	// 	modal.alert("알림", "영문자와 숫자를 포함한 최소 8자리를 입력하세요");
	// 	return;
	// }

	if (newpw != newpwcheck) {
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
				window.setTimeout(function () { location.href = "/mypage" }, 2000);
			} else {
				modal.alert("알림", "현재 비밀번호를 확인하세요");
			}
		}
	})

}

function modifyInfoBtn() {
	let target = $(".mainModBtnDiv");
	target.html("<button type='button' class='modifybtn'  onclick='doMod()'>확인</button><button class='modifybtn' type='button' onclick='quitMod()'>취소</button>");
	$(".change").attr("disabled", false);
	$(".change").css("border-bottom", "1px solid #6469e5");
	$("#postCode").css("border-bottom", "1px solid #6469e5");
	$("#mainAddress").css("border-bottom", "1px solid #6469e5");
	$(".daumBtn").show();
	$(".modPhoto").show();
}

function quitMod() {  // 스토리지에 담아서 쓸 수 있는지 물어ㅇ
	// let target = $(".mainModBtnDiv");
	// target.html("<button type='button' onclick='modifyInfoBtn()'>개인정보 수정</button>" +
	// 	"<button type='button' onclick='modifyPwBtn()'>비밀번호 수정</button>");
	// $(".change").attr("disabled", true);
	// $(".change").css("border-bottom", "none");
	// $(".daumBtn").hide();
	// $(".modPhoto").hide();
	let data = storage.myData;
	drawMyPage(data);
}


function doMod() {
	let cellPhone = $(".cellPhone").val();
	let homePhone = $(".homePhone").val();
	let email = $(".email").val();
	let zipCode = $("#postCode").val();
	let mainAddress = $("#mainAddress").val();
	let detailAddress = $("#detailAddress").val();

	let phonecheck = /^(01[01346-9])-?([1-9]{1}[0-9]{2,3})-?([0-9]{4})$/;
	if (cellPhone != "" && !phonecheck.test(cellPhone)) {
		modal.alert("알림", "핸드폰 번호를 입력하세요 ex)000-0000-0000");
		return;
	}

	let homePhoneCheck = /^\d{2,3}-\d{3}-\d{4}$/;
	if (homePhone != "" && !homePhoneCheck.test(homePhone)) {
		modal.alert("알림", "전화 번호를 입력하세요 ex)000-000-0000");
		return;
	}


	email = email.trim();
	let emailcheck = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
	if (email != "" && !emailcheck.test(email)) {
		modal.alert("알림", "이메일 양식을 확인하세요");
		return;
	}


	let url = apiServer + "/api/my";

	let data = {
		"cellPhone": cellPhone,
		"homePhone": homePhone,
		"email": email,
		"zipCode": zipCode,
		"address": (mainAddress + "===" + detailAddress)
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



function getYmdHyphen(date) {
	let d = new Date(date);
	return d.getFullYear() + "-" + ((d.getMonth() + 1) > 9 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1)) + "-" + (d.getDate() > 9 ? d.getDate().toString() : "0" + d.getDate().toString());
}


// 첨부파일 미리보기 & 임시저장 
function readURL(input) {
	if (input.files && input.files[0]) {
		let reader = new FileReader();
		reader.onload = function (e) {
			document.getElementById('preview').src = e.target.result;
		};
		reader.readAsDataURL(input.files[0]);
	} else {
		document.getElementById('preview').src = "";
	}

	let method, data, type, attached;
	attached = $(document).find("[name='attached[]']")[0].files;

	if (storage.attachedList === undefined || storage.attachedList <= 0) {
		storage.attachedList = [];
	}

	for (let i = 0; i < attached.length; i++) {
		let reader = new FileReader();

		reader.onload = (e) => {
			let binary, x, fData = e.target.result;
			const bytes = new Uint8Array(fData);
			binary = "";
			for (x = 0; x < bytes.byteLength; x++) binary += String.fromCharCode(bytes[x]);
			let fileData = cipher.encAes(btoa(binary));
			let fullData = fileData;

			let url = "/api/my/image"
			url = url;
			method = "post";
			data = fullData;
			type = "insert";

			crud.defaultAjax(url, method, data, type, submitFileSuccess, submitFileError);
		}

		reader.readAsArrayBuffer(attached[i]);
	}
}





