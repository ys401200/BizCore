// BizCore main script
let cipher, as, ac, apiServer, msg;

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

as = { // 자동저장 모듈
    "status" : false,
    "funcId" : undefined,
    "data" : {} 
}

ac = { // 자동완성 모듈
    "index" : 0,
    "funcId" : undefined,
    "target" : undefined,
    "container" : undefined
}

msg = { // 메시징 유닛
	"cnt" : undefined,
	"handler" : undefined,
	"time" : 10,
	"set" : (message, time) => {
        let el, handler, html;
		if(msg.cnt === undefined || msg.cnt === null)	return;
		if(message === undefined)	return;
        if(time === undefined)  time = msg.time;
		el = document.createElement("div");
		handler = window.setTimeout(()=>{
            el.remove();
        },time*1000);
        html = "<div class=\"each_msg\"><div data-handler=\"" + handler + "\" onclick=\"msg.clr(this)\" class=\"cls_btn\">&#x2715;</div><div class=\"msg_content\">" + message + "</div></div>";
        el.innerHTML = html;
        msg.cnt.appendChild(el);
	},
	"clr" : (el) => {
        let handler;
		handler = el.dataset.handler*1;
        window.clearTimeout(handler);
        el.parentElement.remove();
	}
}


$(document).ready(init)

// Initializing Page
function init(){
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
	cipher.rsa.getKey();
	msg.cnt = document.getElementsByClassName("msg_cnt")[0];
} // End of init()