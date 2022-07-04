// BizCore main script
let cipher, as, ac, apiServer;

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

// ========== 초기화 =====================================================

document.onreadystatechange = init;








// ========== Event Listener ==============================================

// 페이지 로딩 후 처음 로딩되는 초기화 함수
function init(){
    let x; // 변수 선언
    if(document.readyState !== "complete")  return; // 로딩 완전 종료가 아니면 종료함

    // 실행코드



} // End of init()