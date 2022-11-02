<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

		<!DOCTYPE html>

		<head>
			<meta charset="UTF-8" />
			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="stylesheet" type="text/css" href="/css/gwEstimate/gwEstimate.css">
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
			<title>Document</title>
		</head>

		<body>


			<div class="mainBtnDiv">
				<div class="savedLineContainer"><select>
						<option val="">자주 쓰는 결재선</option>
					</select></div>

				<div><button class="lineCreateBtn" onclick="createLine()">결재선 생성</button>
					<button>기안하기</button>
				</div>
			</div>



			<div class="estDiv" style="border : 1px solid black; width: 1050px; height :1200px ">


				
 
				<style>
					/* 에디터 체크  */
					.cke_chrome {
					  border: none;
					  box-shadow: none;
					}
				
					.inputsAuto,
					.inputs {
					  margin: 0;
					  border: none;
					  padding: 0;
					  background-color: transparent;
					}
				
					textarea {
					  margin: 0;
					  border: none;
					}
				
					.list_header,
					.insertedContent {
					  margin: 1em;
					}
				
					.title {
					  font-size: 2.5em;
					  font-weight: 500;
					  text-align: center;
					  margin: 1em;
					}
				
					.cbContainer {
					  text-align: center;
					  margin: 1em;
					}
				
					.infoline {
					  display: grid;
					  grid-template-columns: 50% 50%;
					}
				
					.infoDiv {
					  display: grid;
					  grid-template-columns: 30% 70%;
					}
				
					.line {
					  text-align: center;
					}
				
				
					.info .infoDiv>div {
					  border: 1px solid black;
					  border-bottom: none;
					  background-color: #efefef;
					  text-align: center;
					  padding: 0.5em;
					  font-weight: 500;
					}
				
					.info .infoDiv:last-of-type>div {
					  border: 1px solid black;
					}
				
					.subDataDetail {
					  margin: 1em;
					  display: flex;
					  flex-direction: column;
					}
				
					.subDataDetail>div {
					  text-align: center;
					  display: grid;
					  grid-template-columns: 15% 10% 15% 10% 15% 10% 15% 10%;
					  border-left: 1px solid black;
					  border-top: 1px solid black;
					}
				
				
					.subDataDetail>div>div {
					  padding: 0.3em 0;
					  background-color: #efefef;
					  border-right: 1px solid black;
					}
				
					.subDataDetail>div:last-of-type>div {
					  border-bottom: 1px solid black;
					}
				
				
				
					.subDataDetail>div>input,
					.subDataDetail>div>select {
					  text-align: center;
					  padding: 0.3em;
					  border-radius: 0;
					  border: none;
					}
				
					.subDataDetail>div>input,
					.subDataDetail>div>select {
					  text-align: center;
					  padding: 0.3em;
					  border-radius: 0;
					  border: none;
					  border-right: 1px solid black;
					}
				
					.subDataDetail>div:last-of-type>input,
					.subDataDetail>div:last-of-type>select {
				
					  border-bottom: 1px solid black;
					}
				
				
				
					.contentDiv {
					  display: grid;
					  grid-template-columns: 15% 85%;
					}
				
					.contentDiv>div:first-of-type {
					  border: 1px solid black;
					  border-bottom: none;
					  background-color: #efefef;
					  text-align: center;
					  padding: 0.5em;
					  font-weight: 500;
					}
				
					.contentDiv input {
					  width: 100%;
					}
				
					.contentDiv:nth-of-type(2)>div {
					  border-bottom: 1px solid black;
					}
				
				
				
					/* .infoContent {
					  padding: 0.5em;
					  border-top: 1px solid black;
					  border-right: 1px solid black;
					}
				
					.infoContentlast {
					  border-top: 1px solid black;
					  border-right: 1px solid black;
					  border-bottom: 1px solid black;
					  padding: 0.5em;
					} */
				
					/* .infoTitleContentlast {
					  border: 1px solid black;
					  background-color: #efefef;
					  text-align: center;
					  padding: 0.5em;
					  font-weight: 500;
					}
				
					.infoTitlelast {
					  padding: 0.5em;
					  border: 1px solid black;
					} */
				
					.detailDiv {
					  display: grid;
					  grid-template-columns: 5% 10% 10% 15% 10% 5% 10% 10% 10% 15%;
					  text-align: center;
					  border-left: 1px solid black;
					}
				
				
					.insertedData,
					.detailcontentDiv {
					  margin-left: 1em;
					  margin-right: 1em;
					}
				
					.insertedData>div>.datailTitle,
					.datailTitlelast,
					.insertedTotalContainer>div {
					  padding: 0.2em;
					}
				
				
				
					.detailcontentDiv {
					  display: grid;
					  text-align: center;
					  font-size: 0.5em;
					  margin-left: 2em;
					  margin-right: 2em;
					  grid-template-columns: 5% 10% 10% 15% 10% 5% 10% 10% 10% 10% 5%;
					}
				
					.detailDivHide {
					  border-left: 1px solid black;
					  grid-template-columns: 5% 10% 10% 15% 10% 5% 10% 10% 10% 10% 5%;
					}
				
					.detailcontentHide {
					  grid-template-columns: 5% 10% 10% 15% 10% 5% 10% 10% 10% 15%;
					}
				
				
					.insertedDataList>* {
					  border-left: 1px solid black;
					}
				
					/* .insertedDataList>*>* {
					  border-right: 1px solid black;
					  border-bottom: 1px solid black;
					  padding: 0.25em 0;
					} */
				
					.insertedDataList>div input {
				
					  border-radius: 0;
					  background-color: transparent;
					}
				
					.insertedDataList>div input:nth-of-type(1) {
					  text-align: center;
					}
				
					.insertedDataList>div input:nth-of-type(n + 5):nth-of-type(-n + 9) {
					  text-align: right;
					}
				
				
					.datailTitle {
					  border-right: 1px solid black;
					  border-top: 1px solid black;
					  border-bottom: 1px solid black;
					  background-color: #efefef;
					}
				
					.datailTitlelast {
					  border-right: 1px solid black;
					  border-top: 1px solid black;
					  border-bottom: 1px solid black;
					  background-color: #efefef;
					}
				
					.datailTitlebox {
					  display: flex;
					  align-items: center;
					  justify-content: center;
					  border-top: 1px solid black;
					  border-right: 1px solid black;
					  border-bottom: 1px solid black;
					}
				
					.detailcontentlast {
					  border-right: 1px solid black;
					  border-bottom: 1px solid black;
					}
				
					.detailcontent {
					  border-bottom: 1px solid black;
					}
				
					.detailcontentbox {
					  display: flex;
					  align-items: center;
					  justify-content: center;
					  border-right: 1px solid black;
					  border-bottom: 1px solid black;
					}
				
				
					.btnDiv {
					  text-align: right;
					}
				
				
				
					.insertedTotalContainer {
					  box-sizing: border-box;
					  margin: 0 1em;
					  border: 1px solid black;
					  border-top: none;
					  border-right: none;
					  display: grid;
				
					  grid-template-columns: 75% 10% 15%;
					}
				
					.insertedTotalContainer>* {
					  border-right: 1px solid black;
					}
				
					.insertedTotal {
					  text-align: right;
					}
				
					.insertedTotalContainer>div {
					  box-sizing: border-box;
					  border-right: 1px solid black;
					}
				
					.insertedTotalContainer>div:first-of-type {
					  box-sizing: border-box;
					  display: flex;
					  align-items: center;
					  justify-content: center;
					  background-color: #efefef;
					}
				
					.list_comment {
					  text-align: center;
					}
				
				
				
					.calculateDiv {
					  margin: 1em;
					  display: grid;
					  grid-template-columns: 15% 10% 15% 10% 15% 10% 15% 10%;
					  border-top: 1px solid black;
					  border-left: 1px solid black;
					}
				
					.calculateDiv>div {
					  border-right: 1px solid black;
					  border-bottom: 1px solid black;
					  text-align: center;
					  padding: 0.3em;
					  background-color: #efefef;
					}
				
					.calculateDiv input {
					  text-align: center;
					  border: none;
					  border-right: 1px solid black;
					  border-bottom: 1px solid black;
					}
				
					/* 결재선 관련 css  */
				
					.lineGridContainer:first-of-type {
					  padding-bottom: 0.5rem;
					  height: 45%;
					  display: flex;
					  align-items: right;
					  justify-content: right;
				
					}
				
					.lineGridContainer:last-of-type {
					  padding-top: 0.5rem;
					  height: 45%;
					  display: flex;
					  align-items: right;
					  justify-content: right;
					}
				
					.lineGrid {
					  display: flex;
					  flex-direction: row;
					  margin-right: 0.3em;
					}
				
					.lineGridContainer:first-of-type .lineGrid:last-of-type,
					.lineGridContainer:last-of-type .lineGrid:last-of-type {
					  margin-right: 0;
					}
				
					.lineSet {
					  display: grid;
					  grid-template-rows: 25% 25% 25% 25%;
					  width: 5em;
				
					}
				
					.lineSet input {
					  width: 95%;
					}
				
					.lineTitle {
					  background-color: #efefef;
					  text-align: center;
					  border: 1px solid black;
					  display: flex;
					  align-items: center;
					  justify-content: center;
					}
				
					.twoBorder {
					  border-top: 1px solid black;
					  border-right: 1px solid black;
					  text-align: center;
					}
				
					.twoBorderLast {
					  border-top: 1px solid black;
					  border-right: 1px solid black;
					  text-align: center;
					}
				
					.dateBorder {
					  text-align: center;
					  border-top: 1px solid black;
					  border-right: 1px solid black;
					  border-bottom: 1px solid black;
					}
				
					.dateBorderLast {
					  text-align: center;
					  border-top: 1px solid black;
					  border-bottom: 1px solid black;
					}
				
					.list_comment {
					  margin: 1em;
					}
				  </style>
				
				  <!--수주 판매 보고(doc_Form_SalesReport)-->
				
				  <div class="mainDiv">
					<div class="list_header">
				
					  <div class="title">수주 판매 보고</div>
				
				
					  <div class="infoline">
						<div class="info">
						  <div class="infoDiv">
							<div class="infoTitle">번호</div>
							<input class="inputsAuto infoContent" type="text" id="doc_Form_SalesReport_no" data-detail=""
							  onkeyup="this.dataset.detail=this.value"
							  style="border-top : 1px solid black;border-right: 1px solid black;padding:0.3em;" />
						  </div>
						  <div class="infoDiv">
							<div class="infoTitle">담당 사원</div>
				
							<input class="infoContent inputsAuto" type="text" id="doc_Form_SalesReport_writer"
							  style="border-top: 1px solid black;border-right: 1px solid black; padding:0.3em;" />
				
						  </div>
						  <div class="infoDiv">
							<div class="infoTitle">작성일</div>
							<input class="inputsAuto infoContent" type="text" id="doc_Form_SalesReport_created"
							  style="border-top : 1px solid black;border-right: 1px solid black;padding:0.3em;" />
						  </div>
						  <div class="infoDiv">
							<div class="infoTitle">영업기회</div>
				
							<input class="inputs infoContent" type="text" id="doc_Form_SalesReport_sopp" data-detail=""
							  onkeyup="this.dataset.detail=this.value"
							  style="border-top : 1px solid black ;border-right: 1px solid black;padding:0.3em;" />
				
						  </div>
						  <div class="infoDiv">
							<div class="infoTitle">매출처</div>
							<input class="inputs infoContentlast" type="text" id="doc_Form_SalesReport_infoCustomer" data-detail=""
							  onkeyup="this.dataset.detail=this.value" style="border-bottom: 1px solid black; border-top : 1px solid black;border-right: 1px solid black;
							  padding:0.3em;" />
						  </div>
						</div>
				
						<div id="doc_Form_SalesReport_line">결재선</div>
					  </div>
					</div>
				
				
				
					<div class="list_detail">
					  <div class="subDataDetail">
				
						<div>
						  <div>매출처 담당자</div><input type="text" class="inputs" data-detail="" onkeyup="this.dataset.detail=this.value"
							id="doc_Form_SalesReport_custmemberName" style="padding:0.5em;">
						  <div>엔드유저</div> <input type="text" class="inputs" data-detail="" onkeyup="this.dataset.detail=this.value"
							id="doc_Form_SalesReport_endCustName">
						  <div>진행단계</div> <select class="inputs" id="doc_Form_SalesReport_soppStatus" data-detail=""
							onchange="this.dataset.detail=this.value">
							<option value="10178" selected>영업 정보 파악</option>
							<option value="10179">초기 접촉</option>
							<option value="10180">제안서 제출 및 PT</option>
							<option value="10181">견적서 제출</option>
							<option value="10182">계약요청</option>
							<option value="10183">수주</option>
							<option value="10184">매출</option>
							<option value="10185">계약 실패</option>
							<option value="10193">계약 진행 보류</option>
							<option value="10192">계약중</option>
						  </select>
						  <div>가능성</div> <input type=text onkeyup="setText(this)" class="inputs" data-detail=""
							onkeyup="this.dataset.detail=this.value" id="doc_Form_SalesReport_soppRate" placeholder="%"
							style="text-align:right;">
				
						</div>
				
						<div>
						  <div>계약구분</div><select class="inputs" id="doc_Form_SalesReport_cntrctMtn" data-detail=""
							onchange="this.dataset.detail=this.value">
							<option value="10247" selected>판매 계약</option>
							<option value="10248">유지보수</option>
							<option value="10254">임대 계약</option>
						  </select>
						  <div>매출예정일</div> <input class="inputs" type="date" data-detail="" onchange="this.dataset.detail=this.value"
							id="doc_Form_SalesReport_targetDate">
						  <div>판매방식</div> <select class="inputs" id="doc_Form_SalesReport_soppType" data-detail=""
							onchange="this.dataset.detail=this.value">
							<option value="10173" selected>조달직판</option>
							<option value="10174">조달간판</option>
							<option value="10175">조달대행</option>
							<option value="10176">직접판매</option>
							<option value="10218">간접판매</option>
							<option value="10255">기타</option>
						  </select>
						  <div>예상매출</div><input onkeyup="setText(this)" class="inputs" type="text" data-detail=""
							onkeyup="this.dataset.detail=this.value" id="doc_Form_SalesReport_soppTargetAmt" placeholder="원"
							style="text-align:right">
						</div>
				
				
				
					  </div>
				
					  <div clsss="list_content">
						<div class="insertedContent">
						  <div class="contentDiv">
							<div class="infoTitle">제목</div>
							<div style="border-top: 1px solid black;border-right: 1px solid black;padding: 0.3em;"><input type="text"
								class="inputs" id="doc_Form_SalesReport_title" data-detail="" onkeyup="this.dataset.detail=this.value">
							</div>
				
						  </div>
						  <div class="contentDiv">
							<div class="infoTitleContent" style="border-bottom:1px solid black;">내용</div>
							<div class="infoContentlast" id="contentContainer" style="border-top: 1px solid black;border-right: 1px solid black;
							border-bottom: 1px solid black;">
				
							  <div class="doc_Form_SalesReport_content"></div>
							  <textarea class="inputs" id="doc_Form_SalesReport_content" data-detail=""
								onkeyup="this.dataset.detail=this.value"></textarea>
							</div>
						  </div>
						</div>
					  </div>
				
					  <div class="insertedData">
						<div class="btnDiv"><label><input type="radio" name="setType" value="1101" checked>매입</label><label><input
							  type="radio" name="setType" value="1102">매출</label>
						  <button class=" insertbtn" onclick="insertData()">추가</button><button class="deletebtn"
							onclick="deleteData()">삭제</button>
						</div>
						<div class="detailDiv">
						  <div class="datailTitle">구분</div>
						  <div class="datailTitle">거래일자</div>
						  <div class="datailTitle">거래처</div>
						  <div class="datailTitle">항목</div>
						  <div class="datailTitle">단가</div>
						  <div class="datailTitle">수량</div>
						  <div class="datailTitle">공급가액</div>
						  <div class="datailTitle">부가세액</div>
						  <div class="datailTitle">금액</div>
						  <div class="datailTitlelast">적요</div>
						  <div class="datailTitlebox">
							<input type="checkbox" class="checkAll" />
						  </div>
						</div>
					  </div>
				
					  <div class="insertedDataList inSum"></div>
					  <div class="insertedTotalContainer inSumTotal">
						<div>매입 합계</div>
						<input type="text" class="inputsAuto inSumAllTotal" data-detail="" disabled
						  style="border-right : 1px solid black;padding:0.3em;text-align:right;">
						<div></div>
					  </div>
					  <div class="insertedDataList outSum"></div>
					  <div class="insertedTotalContainer outSumTotal">
						<div>매출 합계</div>
						<input type="text" class="inputsAuto outSumAllTotal" data-detail="" disabled
						  style="border-right : 1px solid black;padding:0.3em; text-align: right;">
						<div></div>
					  </div>
				
					  <div class="calculateDiv">
						<div>매입 합계</div><input type="text" class="inputsAuto inSumAllTotal" data-detail="">
						<div>매출 합계</div><input type="text" class="inputsAuto outSumAllTotal" data-detail="">
						<div>이익 합계</div><input type="text" class="inputsAuto doc_Form_SalesReport_profit" data-detail="">
						<div>이익률</div><input type="text" class="inputsAuto doc_Form_SalesReport_profitper" data-detail="">
					  </div>
				
					</div>
					<div class="list_comment" data-tag="writeTag">-이하 여백-</div>
				
				
					<script>
				
					  $(".inputsAuto").prop("disabled", "true");
				
					  $(".checkAll").change(function () {
						if ($(".checkAll").prop("checked") == true) {
						  $(".detailBox").prop("checked", true);
						} else if ($(".checkAll").prop("checked") == false) {
						  $(".detailBox").prop("checked", false);
						}
					  });
				
					  $(".detailDiv").addClass("detailDivHide");
				
					  function toReadMode() {
						$("select").attr("disabled", "disabled");
						$(".list_comment").attr("data-tag", "readTag");
						$(".detailDiv").removeClass("detailDivHide");
						$(".detailcontentDiv").addClass("detailcontentHide");
						$(".datailTitlebox").hide();
						$(".detailcontentbox").hide();
						$(".inputs").attr("readonly", true);
						$(".inputsAuto").attr("readonly", true);
				
						$(".datailTitlebox").hide();
						$("#TRS").prop("disabled", true);
						$("#BUY").prop("disabled", true);
						$(".btnDiv").hide();
					  }
				
					  function toWriteMode() {
						$("select").attr("disabled", "false");
						$(".list_comment").attr("data-tag", "writeTag");
						$(".detailDiv").addClass("detailDivHide");
						$(".detailcontentDiv").removeClass("detailcontentHide");
						$(".datailTitlebox").show();
						$(".detailcontentbox").show();
						$(".inputs").attr("readonly", false);
						$("#TRS").prop("disabled", false);
						$("#BUY").prop("disabled", false);
						$(".btnDiv").show();
					  }
				
					  function insertData() {
						let val = $("input[name=setType]:checked").val();
						let countlow = $(".detailcontentDiv").length;
						let target;
						if (val == 1101) {
						  target = $(".inSum");
						} else {
						  target = $(".outSum");
						}
				
				
						let dataNoneForm = "<div class='detailcontentDiv'>";
						let title = [
						  "type",
						  "date",
						  "customer",
						  "product",
						  "price",
						  "quantity",
						  "amount",
						  "tax",
						  "total",
						  "remark",
						];
						let reportForm = "SalesReport";
				
						for (let i = 0; i < title.length; i++) {
						  if (i < title.length - 1) {
							if (i == 0) {
							  if (val == 1101) {
								dataNoneForm +=
								  "<input value='매입' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_" +
								  reportForm +
								  "_" +
								  title[i] +
								  "'/>";
							  } else {
								dataNoneForm +=
								  "<input value='매출' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_" +
								  reportForm +
								  "_" +
								  title[i] +
								  "'/>";
							  }
				
							}
							else if (i == 1) {
							  dataNoneForm +=
								"<input onchange='this.dataset.detail=this.value;' type='date' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_" +
								reportForm +
								"_" +
								title[i] +
								"'/>";
							} else if (i == 4 || i == 5 || i == 6 || i == 7 ) {
							  dataNoneForm +=
								"<input type='text' oninput='setNum(this)'  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_" +
								reportForm +
								"_" +
								title[i] +
								"'/>";
				
							} else if ( i == 8) {
				
							 if (val == 1101) {
								dataNoneForm +=
								  "<input type='text' oninput='setNum(this)'  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inTotal inputsAuto doc_Form_" +
								  reportForm +
								  "_" +
								  title[i] +
								  "'/>";
							  } else {
								dataNoneForm +=
								  "<input type='text' oninput='setNum(this)'  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='outTotal inputsAuto doc_Form_" +
								  reportForm +
								  "_" +
								  title[i] +
								  "'/>";
							  }
				
							} else {
							  dataNoneForm +=
								"<input type='text' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)'  style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_" +
								reportForm +
								"_" +
								title[i] +
								"'/>";
							}
						  } else
							dataNoneForm +=
							  "<input type='text' onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs  doc_Form_" +
							  reportForm +
							  "_" +
							  title[i] +
							  "'/>";
						}
				
				
						dataNoneForm += "<div  class ='detailcontentbox'><input type='checkbox' class='detailBox'/></div></div>";
						target.append(dataNoneForm);
				
				
					  }
				
					  function deleteData() {
						for (let i = $(".detailBox").length - 1; i >= 0; i--) {
						  if ($($(".detailBox")[i]).prop("checked") == true) {
							let parent = $(".detailBox")[i].parentElement.parentElement;
							parent.remove();
						  }
						}
						getTotalCount();
					  }
				
					  function setNum(obj) {
						obj.value = obj.value.replace(/[^0-9.]/g, "");
						obj.value = Number(obj.value).toLocaleString();
					  }
				
				
					  function keyUpFunction(obj) {
						if ($(".list_comment").attr("data-tag") == "writeTag") {
						  let parent = obj.parentElement.parentElement.className.split(" ")[1];
						  let name = obj.className;
						  let idType = name.split("_");
						  idType = idType[3];
						  if (idType == "price") {
				
				
							let quantity = $(obj).next();
							let amount = quantity.next();
							let tax = amount.next();
							let total = tax.next();
							quantity.val(0);
							amount.val((obj.value.replace(/,/g, "") * quantity.val().replace(/,/g, "")).toLocaleString());
							tax.val(Math.round((obj.value.replace(/,/g, "") * quantity.val().replace(/,/g, "") * 0.1)).toLocaleString());
							total.val(Number(amount.val().replace(/,/g, "")) + Number(tax.val().replace(/,/g, ""))).toLocaleString();
				
						  } else if (idType == "quantity") {
				
							let price = $(obj).prev();
							let amount = $(obj).next();
							let tax = amount.next();
							let total = tax.next();
							amount.val((
							  price.val().replace(/,/g, "") * obj.value.replace(/,/g, "")
							).toLocaleString());
							amount.attr("data-detail", amount.val());
							tax.val((((Math.round(price.val().replace(/,/g, ""))) * obj.value.replace(/,/g, "")) * 0.1).toLocaleString());
							tax.attr("data-detail", tax.val());
							total.val((Number(amount.val().replace(/,/g, "")) + Number(tax.val().replace(/,/g, "")))
							  .toLocaleString());
							total.attr("data-detail", total.val());
				
				
						  } else if (idType == "total") {
				
							let tax = $(obj).prev();
							let amount = tax.prev();
							let quantity = amount.prev();
							let price = quantity.prev();
							let total = Number(obj.value.replace(/,/g, ""));
							tax.val(Math.round(total / 11).toLocaleString());
							tax.attr("data-detail", tax.val());
							amount.val(Math.round((total / 11) * 10).toLocaleString());
							amount.attr("data-detail", amount.val());
							price.val(amount.val());
							price.attr("data-detail", price.val());
							quantity.val(1);
							quantity.attr("data-detail", quantity.val());
						  } else if (idType == "tax") {
							let tax = Number(obj.value.replace(/,/g, ""));
							let total = $(obj).next();
							let amount = $(obj).prev();
							total.val((Number(amount.val().replace(/,/g, "")) + tax).toLocaleString());
							total.attr("data-detail", total.val());
						  }
				
						  getTotalCount(obj);
				
						}
					  }
				
					  function setText(obj) {
						let name = obj.id;
						let idType = name.split("_");
						idType = idType[3];
						if (idType == "soppRate") {
						  obj.value = obj.value.replace(/[^0-9.%]/g, "");
						  obj.dataset.detail = obj.value;
				
						} else if (idType == "soppTargetAmt") {
						  obj.value = obj.value.replace(/[^0-9.]/g, "");
						  obj.value = Number(obj.value).toLocaleString();
						  obj.dataset.detail = obj.value;
						}
				
					  }
				
				
					  function getTotalCount(obj) {
						let parent = obj.parentElement.parentElement.className.split(" ")[1];
						if (parent == "inSum") {
						  let totalCount = Number(0);
						  for (let i = 0; i < $(".inTotal").length; i++) {
							if ($(".inTotal")[i].dataset.detail != undefined) {
							  totalCount += Number($(".inTotal")[i].dataset.detail.replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
							} else {
							  totalCount += 0;
							}
						  }
				
						  $(".inSumAllTotal").val(Number(totalCount).toLocaleString() + "원");
						  $(".inSumAllTotal").attr("data-detail", Number(totalCount).toLocaleString() + "원");
				
						} else {
						  let totalCount = Number(0);
						  for (let i = 0; i < $(".outTotal").length; i++) {
							if ($(".inTotal")[i].dataset.detail != undefined) {
							  totalCount += Number($(".outTotal")[i].dataset.detail.replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
							} else {
							  totalCount += 0;
							}
				
						  }
				
						  $(".outSumAllTotal").val(Number(totalCount).toLocaleString() + "원");
						  $(".outSumAllTotal").attr("data-detail", Number(totalCount).toLocaleString() + "원");
				
				
				
						}
						let profit, profitper;
						if ($(".outSumAllTotal").val() != "" && $(".inSumAllTotal").val() != "") {
						  profit = Number($(".outSumAllTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", "")) - Number($(".inSumAllTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""));
						  profitper = (profit / Number($(".outSumAllTotal").val().split("원")[0].replace(",", "").replace(",", "").replace(",", "").replace(",", "").replace(",", ""))) * 100;
						  $(".doc_Form_SalesReport_profit").val(Number(profit).toLocaleString() + "원");
						  $(".doc_Form_SalesReport_profit").attr("data-detail", Number(profit).toLocaleString() + "원");
						  $(".doc_Form_SalesReport_profitper").val(Number(profitper).toLocaleString() + "%");
						  $(".doc_Form_SalesReport_profitper").attr("data-detail", Number(profitper).toLocaleString() + "%");
						}
				
					  } 
					</script>
				



				</div>


		</body>
		<script src="/js/header.js"></script>
		<script src="/js/cipher.js"></script>
		<script src="/js/gwEstimate/gwEstimate.js"></script>

		</html>