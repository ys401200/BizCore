let cipher, msg, apiServer;

apiServer = "";

cipher = { // 암호화 모듈
	"encRsa" : (message) => {
				let result, rsa;
				if(message === undefined || message === null)	return message;
				rsa = new RSAKey();
				rsa.setPublic(cipher.rsa.public.modulus, cipher.rsa.public.exponent);
				return btoa(rsa.encrypt(message));
	},
	"encAes":(message)=>{
		let cp, result;
		cp = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(cipher.aes.key), {
			"iv": CryptoJS.enc.Utf8.parse(cipher.aes.iv),
			"padding": CryptoJS.pad.Pkcs7,
			"mode": CryptoJS.mode.CBC
		});
		result = cp.toString();
		return result;
	},
	"decAes":(message)=>{
		let cp, result;
		cp = CryptoJS.AES.decrypt(message, CryptoJS.enc.Utf8.parse(cipher.aes.key), {
			iv: CryptoJS.enc.Utf8.parse(cipher.aes.iv),
			padding: CryptoJS.pad.Pkcs7,
			mode: CryptoJS.mode.CBC
		});
		result = cp.toString(CryptoJS.enc.Utf8);
		return result;
	},
	"rsa" : {"public":{"modulus":undefined,
					"exponent":undefined},
			"private":undefined,
			"getKey":()=>{
				let url = apiServer + "/api/user/rsa";
				$.ajax({
					url: url,
					method: "get",
					dataType: "json",
					cache: false,
					success:(data) => {
						let publicKeyExponent, publicKeyModulus, aesKey, aesIv, url = apiServer + "/api/user/aes";
						if(data.result === "ok"){
							aesKey = [cipher.genKey(8), cipher.genKey(8), cipher.genKey(8), cipher.genKey(8)];
							aesIv = [cipher.genKey(8), cipher.genKey(8)];
							cipher.aes.key = aesKey[0] + aesKey[1] + aesKey[2] + aesKey[3];
							cipher.aes.iv = aesIv[0] + aesIv[1];
							publicKeyExponent = data.data.publicKeyExponent;
							publicKeyModulus = data.data.publicKeyModulus;
							cipher.rsa.public.modulus = publicKeyModulus;
							cipher.rsa.public.exponent = publicKeyExponent;
							sessionStorage.setItem("rsaModulus", publicKeyModulus);
							sessionStorage.setItem("rsaExponent", publicKeyExponent);
							sessionStorage.setItem("aesKey", cipher.aes.key);
							sessionStorage.setItem("aesIv", cipher.aes.iv);
							$.ajax({
								"url": url,
								"method": "post",
								data: cipher.encRsa(aesKey[0]) + "\n" + cipher.encRsa(aesKey[1]) + "\n" + cipher.encRsa(aesKey[2]) + "\n" + cipher.encRsa(aesKey[3]) + "\n"+ cipher.encRsa(aesIv[0]) + "\n" + cipher.encRsa(aesIv[1]),
								contentType:"text/plain",
								"cache": false,
								success:(data) => {
								}
							})
						}else{
							msg.set(data.msg);
						}
					}
				})
			}},
	"aes" : {"iv":undefined,
			"key":undefined},
	"genKey" : (length)=>{
		let x, t, result = "", src = [];
		if(isNaN(length) || length < 8)	length = 32;
		for(x = 0 ; x < 69 ; x++){
			if (x < 10)
				src[x] = (x + 48);
			else if (x < 36)
				src[x] = (x + 55);
			else if (x < 62)
				src[x] = (x + 61);
			else if (x == 63)
				src[x] = 33;
			else if (x == 64)
				src[x] = 43;
			else if (x == 65)
				src[x] = 126;
			else
				src[x] = (x - 31);
		}
		for (x = 0; x < length; x++) {
			t = Math.floor((Math.random() * src.length));
			result += String.fromCharCode(src[t])
		}
		return result;
	} // End of getKey()
}

msg = {
	"cnt" : undefined,
	"handler" : undefined,
	"time" : 5,
	"set" : (message) => {
		if(msg.cnt === undefined)	return;
		if(message === undefined)	return;
		if(msg.handler !== undefined)	window.clearTimeout(msg.handler);
		msg.cnt.innerText = message;
		msg.handler = window.setTimeout(msg.clr, msg.time * 1000);
	},
	"clr" : () => {
		msg.handler = undefined;
		msg.cnt.innerText = "";
	}
}

document.onreadystatechange = init;

// Initializing Page
function init(){
	let el = [];
    if(document.readyState !== "complete")  return; // 로딩 완전 종료가 아니면 종료함
	cipher.rsa.getKey();
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
		if(!(target[0] === undefined || target[0] === null) && target[0].value.length === 0)		target[0].focus();
		else if(target[1] !== undefined && target[1].value.length === 0)	target[1].focus();
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

// 로그인 시도 함수
function loginSubmit(){
	let t, data = {}, url = apiServer + "/api/user/login/";

	// 임시변수 및  타겟 엘리먼트 설정
	t = [];
	t[0] = document.getElementById("compId");
	t[1] = document.getElementById("userId");
	t[2] = document.getElementById("pw");
	t[3] = document.getElementById("loginSessionBtn");

	// 값이 있는지 먼저 검증 / 값이 없는 엘리먼트가 있는 경우 포커스를 주고 종료함
	if(!(t[0] === undefined || t[0] === null) && t[0].value.length === 0){
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
	} // End of loginSubmit()

	// 값을 가지고 와서 암호화함(compId는 암호화 제외)
	data = {"userId":t[1].value, "pw":t[2].value, "keepStatus":document.getElementById("loginSessionBtn").className === "active"};
	if(!(t[0] === undefined || t[0] === null))	url = url + t[0].value;
	data = cipher.encAes(JSON.stringify(data));
	//data = btoa(JSON.stringify(data));
	
	
	// 내용이 확인되고 암호화가 진행된 후 서버에 post를 시도함
	$.ajax({
		url: url,
		method: "post",
		data: data,
		dataType: "json",
		contentType: "text/plain",
		cache: false,
		processData: false,
		success:function(data){
			if(data.result === "ok"){
				location.reload();
			}else{
				msg.set(data.msg);
				document.getElementById("userId").focus();
			}
			
		},
		error:function(){
			msg.set("정보를 다시 확인하여주십시오.");
		}
	})
}