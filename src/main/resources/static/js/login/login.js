// BizCore login page script
let cipher, msg, apiServer;

apiServer = "";

cipher = { // 암호화 모듈
    "encRsa" : (message) => {
				let result, rsa;
				if(message === undefined || message === null)	return message;
				rsa = new RSAKey();
				rsa.setPublic(cipher.rsa.public.modulus, cipher.rsa.public.exponent);
				return rsa.encrypt(message);
	},
    "rsa" : {"public":{"modulus":undefined,
                    "exponent":undefined},
            "private":undefined},
    "aes" : {"alg":undefined,
            "key":undefined},
    "getAesKey" : () => {return message;}
}

msg = {
	"cnt" : undefined,
	"handler" : undefined,
	"time" : 5,
	"set" : (message) => {
		if(msg.cnt === undefined)	return;
		if(message === undefined)	return;
		if(msg.handler !== undefined)	window.clearTimeout(msg.handler);
		msg.cnt.innerTEXT = message;
		msg.handler = window.setTimeout(msg.clr, msg.time * 1000);
	},
	"clr" : () => {
		msg.handler = undefined;
		msg.cnt.innerTEXT = "";
	}
}

document.onreadystatechange = init;

// Initializing Page
function init(){
	let el = [];
    if(document.readyState !== "complete")  return; // 로딩 완전 종료가 아니면 종료함
	getRsaPublicKey();
	msg.cnt = document.getElementById("loginMsg");
} // End of init()


// input 엘리먼트의 keyup 이벤트
function elInputKeyUp(el, event){
	var target = [], value;
	value = el.value;
	if(event.code !== "Enter" || value === undefined || value.length === 0)	return;
	target[0] = document.getElementById("compId");
	target[1] = document.getElementById("userId");
	target[2] = document.getElementById("pw");
	if(el === target[0])		target[1].focus();
	else if(el === target[1])	target[2].focus();
	else if(el === target[2]){
		if(target[0] !== undefined && target[0].value.length === 0)		target[0].focus();
		else if(target[1] !== undefined && target[1].value.length === 0)	target[0].focus();
		else loginSubmit();
	}
} // End of elInputKeyUp()




function loginSessionClick(e){
	if($(e).attr("class") !== "active"){
		$(e).removeAttr("class");
		$(e).attr("class", "active");
	}else{
		$(e).removeAttr("class");
	}
}

function loginSubmit(){
	let t, data = {};
	let url = apiServer + "/api/user/login";

	// 값이 있는지 먼저 검증 / 값이 없는 엘리먼트가 있는 경우 포커스를 주고 종료함
	t = [];
	t[0] = document.getElementById("compId");
	t[1] = document.getElementById("userId");
	t[2] = document.getElementById("pw");
	t[3] = document.getElementById("loginSessionBtn");
	if(t[0] !== undefined && t[0].value.length === 0){
		msg.set("회사 ID를 입력하세요");
		t[0].focus();
		return;
	}else if(t[1].value.length === 0){
		msg.set("사용자 ID를 입력하세요");
		t[1].focus();
		return;
	}else if(t[2].value.length === 0){
		msg.set("비밀번호를 입력하세요");
		t[2].focus();
		return;
	}

	// 값을 가지고 와서 암호화함(compId는 암호화 제외)
	if(t[0] !== undefined)	data.compId = t.value;
	t = {"userId":t[1].value, "pw":t[2].value, "keepStatus":document.getElementById("loginSessionBtn").className === "active"};
	data.data = JSON.stringify(t);
	
	// 내용이 확인되고 암호화가 진행된 후 서버에 post를 시도함
	$.ajax({
		url: url,
		method: "post",
		data: data,
		dataType: "json",
		cache: false,
		processData: false,
		success:function(data){
			location.reload();
		},
		error:function(){
			msg.set("정보를 다시 확인하여주십시오.");
		}
	})
}

// RSA 키를 받아오는 함수
function getRsaPublicKey(){
	let url = apiServer + "/api/user/rsa";

	$.ajax({
		url: url,
		method: "get",
		dataType: "json",
		cache: false,
		success:(data) => {
			let publicKeyExponent, publicKeyModulus;
			if(data.result === "ok"){
				publicKeyExponent = data.data.publicKeyExponent;
				publicKeyModulus = data.data.publicKeyModulus;
				cipher.rsa.public.modulus = publicKeyModulus;
				cipher.rsa.public.exponent = publicKeyExponent;
				sessionStorage.setItem("rsaModulus", publicKeyModulus);
				sessionStorage.setItem("rsaExponent", publicKeyExponent);
			}else{
				msg.set(data.msg);
			}
		}
	})
} // End of getRsaPublicKey()