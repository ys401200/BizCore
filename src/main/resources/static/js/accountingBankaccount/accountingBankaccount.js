
let bnkXls = {};

bnkXls.code = {"002": "KDB산업은행","003": "IBK기업은행","004": "KB국민은행","007": "수협은행","011": "NH농협은행","012": "농협중앙회(단위농축협)","020": "우리은행","023": "SC제일은행","027": "한국씨티은행","031": "대구은행","032": "부산은행","034": "광주은행","035": "제주은행","037": "전북은행","039": "경남은행","045": "새마을금고중앙회","048": "신협중앙회","050": "저축은행중앙회","064": "산림조합중앙회","071": "우체국","081": "하나은행","088": "신한은행","089": "케이뱅크","090": "카카오뱅크","092": "토스뱅크","218": "KB증권","238": "미래에셋대우","240": "삼성증권","243": "한국투자증권","247": "NH투자증권","261": "교보증권","262": "하이투자증권","263": "현대차증권","264": "키움증권","265": "이베스트투자증권","266": "SK증권","267": "대신증권","269": "한화투자증권","271": "토스증권","278": "신한금융투자","279": "DB금융투자","280": "유진투자증권","287": "메리츠증권"};    
	bnkXls.rxp = [
		["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{4})+[-]+(\\d{3})$",["004"]],
		["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{5})+[-]+(\\d{1})$",["002","007","081"]],
		["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{6})$",["023","088"]],
		["^(\\d{3})+[-]+(\\d{2})+[-]+(\\d{6})+[-]+(\\d{1})$",["003","032"]],
		["^(\\d{3})+[-]+(\\d{3})+[-]+(\\d{6})$",["088","089"]],
		["^(\\d{3})+[-]+(\\d{4})+[-]+(\\d{4})+[-]+(\\d{2})$",["011","032"]],
		["^(\\d{3})+[-]+(\\d{6})+[-]+(\\d{2})+[-]+(\\d{3})$",["003"]],
		["^(\\d{3})+[-]+(\\d{6})+[-]+(\\d{3})$",["027","081"]],
		["^(\\d{3})+[-]+(\\d{6})+[-]+(\\d{5})$",["081"]],
		["^(\\d{3})+[-]+(\\d{7})+[-]+(\\d{1})+[-]+(\\d{3})$",["002"]],
		["^(\\d{3})+[-]+(\\d{8})+[-]+(\\d{1})$",["007"]],
		["^(\\d{3})+[-]+(\\d{8})+[-]+(\\d{3})$",["002"]],
		["^(\\d{4})+[-]+(\\d{2})+[-]+(\\d{7})$",["090"]],
		["^(\\d{4})+[-]+(\\d{2})+[-]+(\\d{7})+[-]+(\\d{1})$",["004"]],
		["^(\\d{4})+[-]+(\\d{3})+[-]+(\\d{6})$",["020"]],
		["^(\\d{6})+[-]+(\\d{2})+[-]+(\\d{6})$",["004"]]
    ]

    bnkXls.readXlsFile = function(file){
      let reader, evfn;
      reader = new FileReader();
	  console.log("STEP 2 : Read xls file second stage");
      evfn = function(){
        let data, wrkBook;
        data = this.result;
        wrkBook = XLSX.read(data, {"type":"binary"});
        bnkXls.parseXlsFile(wrkBook);
      } // End of Anonymous Function in readExcel()

      reader.readAsBinaryString(file);
      reader.onload = evfn;
    } // End of bnkXls.readXlsFile()

    bnkXls.parseXlsFile = function(wb){
      let r, c, x, y, z, t, spLine, data = [], data1, data2, result;
      let bnkList, accList;
	  console.log("STEP 3 : data arrange with parsed data");
      // A1 타입 셀 이름 추출
      t = [];
      for(x in wb.Sheets[wb.SheetNames[0]]) if(x.substring(0,1) !== "!")  t.push(x);
      t.sort();

      // 2차원 배열로 변환
      for(x in t){
        r = t[x].substring(0,1).charCodeAt() - 65;
        c = t[x].substring(1) * 1 - 1;
        if(data[c] === undefined) data[c] = [];
        data[c][r] = wb.Sheets[wb.SheetNames[0]][t[x]].v;
      }
      
      // 헤더부분과 본문 부분 구분하기
      // 1차 시도 / 빈 줄 찾기
      for(x = 0 ; x < data.length ; x++)  if(data[x] === undefined) spLine = x;

      // 1차 시도 성공여부 검증 / 실패시 2차 시도 / row 중 숫자가 없는 row 찾기
      t = undefined;
      if(spLine === undefined){
          for(x = 0 ; x < data.length ; x++){
            if(data[x] !== undefined && !bnkXls.haveNumeric(data[x])) spLine = x;
          }
      }
      console.log(spLine);
      data1 = data.slice(0, spLine);
      data2 = data.slice(spLine);

      // ================ 은행명과 계좌번호 찾기 ===================
      bnkList = []; // 은행명 추정 데이터
      accList = []; // 계좌번호 추정 데이터
      t = [];

      // 추정 은행명 수집
      for(x = 0 ; x < data1.length ; x++) for(y = 0 ; y < data1[x].length ; y++)  t.push(data1[x][y]); // 2차원 배열을 1차원 배열로 전환
      
      // 추정 계좌번호 수집
      for(x = 0 ; x < t.length ; x++){
        if(t[x].includes("은행")) bnkList.push(t[x]);
        else{
          y = bnkXls.charCut(t[x]);
          if(y !== null && y !== undefined && y.includes("-")) accList.push(y);
        }
      }

      // 추정 계좌번호 중 날짜 형식 제거
      y = [new RegExp("^(\\d{4})+[-]+(\\d{1,2})+[-]+(\\d{1,2})$"), new RegExp("^(\\d{2})+[-]+(\\d{1,2})+[-]+(\\d{1,2})$")];
      t = [];
      for(x = 0 ; x < accList.length ; x++){
        if(!y[0].test(accList[x]) && !y[1].test(accList[x]))  t.push(accList[x]);
      }
      accList = t;
      
      // 추정 은행명이 없는 경우 정규식으로 재 추정 시도
      if(bnkList.length === 0 && accList.length > 0){
        t = accList[0];
        y = null;
        for(x = 0 ; x < bnkXls.rxp.length ; x++){          
          reg = new RegExp(bnkXls.rxp[x][0]);
          if((reg.test(t))){
            for(z = 0 ; z < bnkXls.rxp[x][1].length ; z++){
              y = bnkXls.code[bnkXls.rxp[x][1][z]];
              bnkList.push(y);
            }
          }
        }
      }

      // ================ 거래내역 정리하기 ===================      
      // 헤더 정리
      r = [-1,-1,-1,-1,-1,-1,-1,-1]; // 0-거래일시(일시,날짜,월일) 1-적요(적요) 2-내용(내용) 3-입금(입금,넣) 4-출금(출금,지금,찾) 5-잔액(잔액) 6-취급점(취급점,거래점) 7-메모(메모) 
      for(z in data2){
        t = data2[z];
        break;
      }
      z = z * 1;

      for(x = 0 ; x < t.length ; x++){
        if(t[x].includes("일시") || t[x].includes("월일") || t[x].includes("날짜")) r[0] = x;
        else if(t[x].includes("적요")) r[1] = x;
        else if(t[x].includes("내용")) r[2] = x;
        else if((t[x].includes("입금") || t[x].includes("넣")) && !t[x].includes("입금인")) r[3] = x;
        else if(t[x].includes("출금") || t[x].includes("지급") || t[x].includes("찾")) r[4] = x;
        else if(t[x].includes("잔액")) r[5] = x;
        else if(t[x].includes("취급점") || t[x].includes("거래점")) r[6] = x;
        else if(t[x].includes("메모")) r[7] = x;
      }

      t = [];
      for(x = z + 1 ; x < data2.length ; x++){
        if(r[0] >= 0 && data2[x][r[0]] === undefined) break;
        if(r[1] >= 0 && data2[x][r[1]] === undefined) break;
        if(r[2] >= 0 && data2[x][r[2]] === undefined) break;
        if(r[3] >= 0 && data2[x][r[3]] === undefined) break;
        if(r[4] >= 0 && data2[x][r[4]] === undefined) break;
        if(r[5] >= 0 && data2[x][r[5]] === undefined) break;
        if(r[6] >= 0 && data2[x][r[6]] === undefined) break;
        y = [data2[x][r[0]].replaceAll("(","").replaceAll(")",""), data2[x][r[1]], data2[x][r[2]], data2[x][r[3]], data2[x][r[4]], data2[x][r[5]], data2[x][r[6]], data2[x][r[7]] === undefined ? null : data2[x][r[7]]];
        t.push(y);
      }
      t.sort(function(a,b){let x,y;x=new Date(a[0]);y=new Date(b[0]);return x.getTime()-y.getTime();})
      result = {"bnkList":bnkList,"accList":accList,"detail":t};
	  console.log("STEP 4 : End of data arrange");
      console.log(result);
      processAccData(result);
    } // End of bnkXls.parseXlsFile()

    bnkXls.haveNumeric = function(arr){
      let x, y, z;
      if(arr === undefined) return false;
      if(typeof arr === "string"){
        for(x = 0 ; x < arr.length ; x++){
          z = arr.substring(x,x+1);
          z = z.charCodeAt();
          if(z > 47 && z < 58)  return true;
        }
      }else if(typeof arr === "object"){
        for(x = 0 ; x < arr.length ; x++){
          if(arr[x] !== undefined)  for(y = 0 ; y < arr[x].length ; y++){
            z = arr[x].substring(y,y+1);
            z = z.charCodeAt();
            if(z > 47 && z < 58)  return true;
          }
        }
      }
      return false;
    } // End of bnkXls.haveNumeric()

    bnkXls.charCut = (str)=>{
      let result="", x , y = 0, z = 0;
      for(x = 0 ; x < str.length ; x++){
        console.log(x + " / " + str[x] + " / y : " + y)
        if(str[x].charCodeAt() === 45){
          if(z === 0) z = 1;
          else break;
          if(y === 0) y = 1;
          result += str[x];
        }else if(str[x].charCodeAt() >= 48 && str[x].charCodeAt() <= 57){
          if(y === 0) y = 1;
          result += str[x];
          z = 0;
        }//else if(x === 1) break;
      }
      if(result === "") return null;
      else return result;
    } // End of bnkXls.charCut()

document.addEventListener("DOMContentLoaded", () => {
	callerFun();
  });
  
  async function callerFun(){
  await promiseInit();
	const setAccountingBankaccount = new AccountingBankaccountSet();
	locationBlock = false;
	history.pushState(null, null, null);
	setAccountingBankaccount.getBankAccountList();
  }