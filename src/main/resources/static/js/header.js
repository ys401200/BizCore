let cipher, msg, apiServer;

$(document).ready(function(){

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

	cipher.aes.key = sessionStorage.getItem("aesKey");
	cipher.aes.iv = sessionStorage.getItem("aesIv");
	msg.cnt = document.getElementsByClassName("msg_cnt")[0];
	
	setTimeout(() => {
		$("#loadingDiv").loading({
			onStart: function(loading) {
				loading.overlay.fadeIn(1000);
		  	},
		 	onStop: function(loading) {
		    	loading.overlay.fadeOut(1000);
		  	}
		});
	}, 70);
	
	$("#sideMenu ul").not("#business, #panel").hide();
	
	$("#sideMenu ul li a").find("#slideSpan").each(function(index, item){
		if($(item).parent().next().attr("id") === "panel"){
			$(item).show();
		}		
	});
	
	$("#mainTopMenu ul li button").mouseover(function(){
		$(this).prop("style", "background: linear-gradient(to bottom, #ffffff 95%, #302D81 5%); cursor: pointer;");
	}).mouseout(function(){
		if($(this).attr("class") !== "active"){
			$(this).prop("style", "background: linear-gradient(to bottom, #ffffff 100%, #302D81 0%); cursor: pointer;");
		}
	});
	
	$("#sideMenu").find("ul li").mouseover(function(){
		$(this).prop("style", "background-color:#EDEDF4; cursor: pointer;");
		if($(this).parent().attr("id") !== "panel"){
			$(this).find("span").css("color", "");
			$(this).find("span").css("color", "#302D81");
			$(this).find("img").prop("src", $(this).find("img").prop("src").replace(".png", "_hover.png"));
		}else{
			$(this).find("a").css("color", "");
			$(this).find("a").css("color", "#302D81");
		}
	}).mouseout(function(){
		if($(this).parent().attr("id") !== "panel"){
			if($(this).attr("class") !== "active"){
				$(this).css("background-color", "");
				$(this).css("background-color", "#302D81");
				$(this).find("span").css("color", "");
				$(this).find("span").css("color", "#ffffff");
				$(this).find("img").prop("src", $(this).find("img").prop("src").replace("_hover.png", ".png"));
			}
		}else{
			$(this).css("background-color", "");
			$(this).css("background-color", "#302D81");
			$(this).find("a").css("color", "");
			$(this).find("a").css("color", "#ffffff");
		}
	});
	
	$("#sideMenu").find("ul li a").click(function(){
		if(!$(this).attr("disabled")){
			let panel = $(this).next();
			
			$(this).attr("disabled", true);
			
			if($(this).parent().parent().attr("id") !== "panel"){
				if(panel.css("display") === "block"){
					$(this).removeAttr("class");
					$(this).find("#slideSpan").text("+");
					$(this).find("#slideSpan").css("font-size", "");
					$(this).find("#slideSpan").css("font-size", "30px");
					panel.slideToggle(1000, "easeInOutElastic");
				}else{
					$("#sideMenu ul").not("#panel").find("li a").removeAttr("class");
					$("#sideMenu ul").not("#panel").find("li a #slideSpan").text("+");
					$("#sideMenu ul").not("#panel").find("li a #slideSpan").css("font-size", "");
					$("#sideMenu ul").not("#panel").find("li a #slideSpan").css("font-size", "30px");
					$("#sideMenu ul #panel").not(this).slideUp(400);
					$(this).attr("class", "active");
					$(this).find("#slideSpan").text("-");
					$(this).find("#slideSpan").css("font-size", "");
					$(this).find("#slideSpan").css("font-size", "47px");
					panel.slideToggle(1000, "easeInOutElastic");
				}
			}
			
			setTimeout(() => {
				$(this).attr("disabled", false);
			}, 1000)
		}
	});
});

function bodyTopPageClick(e){
	let id = $(e).attr("data-keyword");
	
	$("#mainTopMenu ul li button").removeAttr("class");
	$("#mainTopMenu ul li button").prop("style", "background: linear-gradient(to bottom, #ffffff 100%, #302D81 0%); cursor: pointer;");
	
	$(e).attr("class", "active");
	$(e).prop("style", "background: linear-gradient(to bottom, #ffffff 95%, #302D81 5%); cursor: pointer;");
	
	$("#sideMenu").find("ul").not("#panel").hide();
	$("#sideMenu").find("#" + id).fadeIn(400);
	
	localStorage.setItem("setSideMenu", id);
}

function drawGridTable(container, data, header, border, innerPadding, rowClassName, cellClassName){
	let html = "", x1, x2, x3, t, gridTemplateColumns, columnCount;

	if(container === null || container === undefined)	return undefined;
	if(data === null || data === undefined)	return undefined;
	if(innerPadding === undefined || innerPadding === null)	innerPadding = "";
	if(header !== undefined && header !== null)	columnCountmnCount = header.length;

	if(border === undefined || border === unll)	border = {};
	if(border.top === undefined || border.top === null)			border.top = "1px solid black";
	if(border.bottom === undefined || border.bottom === null)	border.bottom = "1px solid black";
	if(border.left === undefined || border.left === null)		border.left = "1px solid black";
	if(border.right === undefined || border.right === null)		border.right = "1px solid black";
	if(border.inner === undefined || border.inner === null)		border.inner = "1px solid black";

	if(header !== null && header !== undefined){
		html += "<div style=\"display:grid;border-top:" + (border.top) + ";border-left:" + (border.left) + "\" " + (rowClassName !== undefined ? ("\"class=\"" + rowClassName + "\"") : "") + ">";
		for(x1 = 0 ; x1 < header.length ; x++){
			html += ("<div style=\"border-left:" + (border-left) + ";padding:" + (innerPadding) + ";border-right:" + (header.length - 1 === x1 ? border.right : border.inner) + "\">");
		}
		html += "</div>";
	}
	//for()

} // End of drawTable()
