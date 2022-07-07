// BizCore main script
let cipher, as, ac, apiServer, msg;

apiServer = "";

cipher = { // 암호화 모듈
    "encAes" : (message) => {return message;},
    "decAes" : (message) => {return message;},
    "encRsa" : (message) => {return message;},
    "decRsa" : (message) => {return message;},
    "rsa" : {"public":{"modulus":undefined,
                    "exponent":private},
            "private":undefined},
    "aes" : {"alg":undefined,
            "key":undefined},
    "getAesKey" : () => {return message;}
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
		if(msg.cnt === undefined)	return;
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

// ========== 초기화 =====================================================

document.onreadystatechange = init;








// ========== Event Listener ==============================================

// 페이지 로딩 후 처음 로딩되는 초기화 함수
function init(){
    let x; // 변수 선언
    if(document.readyState !== "complete")  return; // 로딩 완전 종료가 아니면 종료함

    msg.cnt = document.getElementsByClassName("msg_cnt")[0]



} // End of init()






document.onreadystatechange = init;

// Initializing Page
function init(){
	let el = [];
    if(document.readyState !== "complete")  return; // 로딩 완전 종료가 아니면 종료함
	cipher.rsa.getKey();
	msg.cnt = document.getElementById("loginMsg");
} // End of init()