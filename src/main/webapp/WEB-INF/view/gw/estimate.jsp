<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

		<!DOCTYPE html>
		<html>

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
					<button onclick="reportInsert()">기안하기</button>
				</div>
			</div>

			<div class="estDiv" style="border : 1px solid black; height :fit-content; ">



				<head>
					<meta charset="UTF-8" />
					<meta http-equiv="X-UA-Compatible" content="IE=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
					<title>Document</title>
				</head>

				<body>
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
							background-color: #dad9ff;
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
							grid-template-columns: repeat(5, 1fr);
							border-left: 1px solid black;
							border-top: 1px solid black;
						}


						.subDataDetail>div>div {
							padding: 0.3em 0;
							background-color: #dad9ff;
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
							background-color: #dad9ff;
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





						.detailDiv,
						.detailcontentDiv {
							display: grid;
							grid-template-columns: 5% 10% 10% 12% 10% 5% 10% 8% 10% 10% 10%;
							text-align: center;
							border-left: 1px solid black;
						}

						.detailDivSche {
							display: grid;
							grid-template-columns: 10% 10% 20% 45% 5% 10%;
							text-align: center;
							border-left: 1px solid black;
						}

						.insertedData,
						.detailcontentDiv {
							margin-left: 1em;
							margin-right: 1em;

						}

						.insertedData {

							margin-top: 1em;
						}



						.insertedData>div>.datailTitle,
						.datailTitlelast,
						.insertedTotalContainer>div {
							padding: 0.2em;
						}

						.insertedData .subTitle {
							text-align: center;
							background-color: #b4b3f3;
							border: 1px solid black;
							border-bottom: none;
							padding: 0.2em;
						}





						.insertedDataList>* {
							border-left: 1px solid black;
						}



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
							background-color: #dad9ff;
						}

						.datailTitlelast {
							border-right: 1px solid black;
							border-top: 1px solid black;
							border-bottom: 1px solid black;
							background-color: #dad9ff;
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

							grid-template-columns: 70% 10% 20%;
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
							background-color: #dad9ff;
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
							background-color: #dad9ff;
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
							background-color: #dad9ff;
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

						.scheData {
							margin: 0 1em;
						}

						.scheData>div {
							display: grid;
							grid-template-columns: 10% 10% 20% 45% 5% 10%;
							border-left: 1px solid black;
						}

						.scheData>div>* {
							border-radius: 0;
							border: none;

						}

						.soppFileContainer {
							margin: 1em;
							height: 3em;
							display: grid;
							grid-template-columns: 15% 85%;
							border-left: 1px solid black;
							border-top: 1px solid black;
						}

						.soppFileContainer>label {
							display: flex;
							align-items: center;
							justify-content: center;
							background-color: #dad9ff;

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
										<input class="inputsAuto infoContent" type="text" id="doc_Form_SalesReport_no"
											data-detail="" onkeyup="this.dataset.detail=this.value"
											style="border-top : 1px solid black;border-right: 1px solid black;padding:0.3em;" />
									</div>
									<div class="infoDiv">
										<div class="infoTitle">담당 사원</div>

										<input class="infoContent inputsAuto" type="text"
											id="doc_Form_SalesReport_writer" data-detail=""
											style="border-top: 1px solid black;border-right: 1px solid black; padding:0.3em; text-align: left;" />

									</div>
									<div class="infoDiv">
										<div class="infoTitle">작성일</div>
										<input class="inputsAuto infoContent" type="text"
											id="doc_Form_SalesReport_created" data-detail=""
											style="border-top : 1px solid black;border-right: 1px solid black;padding:0.3em; text-align: left;" />
									</div>
									<div class="infoDiv">
										<div class="infoTitle">영업기회</div>

										<input class="inputs infoContent" type="text" id="doc_Form_SalesReport_sopp"
											data-detail="" onkeyup="this.dataset.detail=this.value"
											style="border-top : 1px solid black ;border-right: 1px solid black;padding:0.3em;" />

									</div>
									<div class="infoDiv">
										<div class="infoTitle">고객사</div>
										<input class="inputs infoContentlast" type="text"
											id="doc_Form_SalesReport_infoCustomer" data-detail=""
											onkeyup="this.dataset.detail=this.value"
											style="border-bottom: 1px solid black; border-top : 1px solid black;border-right: 1px solid black; padding:0.3em;" />
									</div>
								</div>

								<div id="doc_Form_SalesReport_line">결재선</div>
							</div>
						</div>



						<div class="list_detail">

							<div clsss="list_content">
								<div class="insertedContent">
									<div class="contentDiv">
										<div class="infoTitle">제목</div>
										<div
											style="border-top: 1px solid black;border-right: 1px solid black;padding: 0.3em;">
											<input type="text" class="inputs" id="doc_Form_SalesReport_title"
												data-detail="" onkeyup="this.dataset.detail=this.value">
										</div>

									</div>
									<div class="contentDiv">
										<div class="infoTitleContent" style="border-bottom:1px solid black;">내용</div>
										<div class="infoContentlast" id="contentContainer"
											style="border-top: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;">

											<div class="doc_Form_SalesReport_content"></div>
											<textarea class="inputs" id="doc_Form_SalesReport_content" data-detail=""
												onkeyup="this.dataset.detail=this.value"></textarea>
										</div>
									</div>
								</div>
							</div>
							<div class="subDataDetail">

								<div>
									<div>고객사 담당자</div>
									<div>협력사</div>
									<div>가능성</div>
									<div>매출예정일</div>
									<div>매출액</div>
								</div>

								<div>
									<input type="text" class="inputs" data-detail=""
										onkeyup="this.dataset.detail=this.value"
										id="doc_Form_SalesReport_custmemberName" style="padding:0.5em;">
									<input type="text" class="inputs" data-detail=""
										onkeyup="this.dataset.detail=this.value" id="doc_Form_SalesReport_endCustName">
									<input type=text onkeyup="setText(this)" class="inputs" data-detail=""
										onkeyup="this.dataset.detail=this.value" id="doc_Form_SalesReport_soppRate"
										placeholder="%" style="text-align:right;">
									<input class="inputs" type="date" data-detail=""
										onchange="this.dataset.detail=this.value"
										id="doc_Form_SalesReport_expectedDate">
									<input onkeyup="setText(this)" class="inputs" type="text" data-detail=""
										onkeyup="this.dataset.detail=this.value" id="doc_Form_SalesReport_soppTargetAmt"
										placeholder="원" style="text-align:right">
								</div>








							</div>


							<div class="insertedData">
								<div class="subTitle">매입매출내역</div>
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
									<div class="datailTitle">적요</div>
									<div class="datailTitlelast">승인번호</div>

								</div>
							</div>

							<div class="insertedDataList inSum"></div>
							<div class="insertedTotalContainer inSumTotal">
								<div>매입 합계</div>
								<input type="text" class="inputsAuto inSumAllTotal" data-detail="" disabled
									style="border-right : 1px solid black;padding:0.3em;text-align:right;">
								<input disabled
									style="border : none;border-right : 1px solid black;padding:0.3em;text-align:right;" />
							</div>
							<div class="insertedDataList outSum"></div>
							<div class="insertedTotalContainer outSumTotal">
								<div>매출 합계</div>
								<input type="text" class="inputsAuto outSumAllTotal" data-detail="" disabled
									style="border-right : 1px solid black;padding:0.3em; text-align: right;">
								<input disabled
									style="border : none;border-right : 1px solid black;padding:0.3em;text-align:right;" />
							</div>

							<div class="calculateDiv">
								<div>매입 합계</div><input type="text" class="inputsAuto inAmountTotal" data-detail="">
								<div>매출 합계</div><input type="text" class="inputsAuto outAmountTotal" data-detail="">
								<div>이익 합계</div><input type="text" class="inputsAuto doc_Form_SalesReport_profit"
									data-detail="">
								<div>이익률</div><input type="text" class="inputsAuto doc_Form_SalesReport_profitper"
									data-detail="">
							</div>
							<div class="insertedData">
								<div class="subTitle">기술지원내역</div>
								<div class="detailDivSche">
									<div class="datailTitle">일자</div>
									<div class="datailTitle">활동 종류</div>
									<div class="datailTitle">제목</div>
									<div class="datailTitle">비고</div>
									<div class="datailTitle">담당자</div>
									<div class="datailTitle">장소</div>
								</div>
							</div>
							<div class="techSche scheData">
							</div>


							<div class="insertedData">
								<div class="subTitle">영업활동내역</div>
								<div class="detailDivSche">
									<div class="datailTitle">일자</div>
									<div class="datailTitle">활동 종류</div>
									<div class="datailTitle">제목</div>
									<div class="datailTitle">비고</div>
									<div class="datailTitle">담당자</div>
									<div class="datailTitle">장소</div>
								</div>
							</div>
							<div class="slaesSche scheData">

							</div>




							<div class="soppFileContainer">
								<label
									style="border-bottom: 1px solid black; border-right: 1px solid black;">첨부파일</label>
								<div style="border-bottom: 1px solid black; border-right: 1px solid black;">
									<div class="soppFileData"></div>
								</div>
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
										} else if (i == 4 || i == 5 || i == 6 || i == 7) {
											dataNoneForm +=
												"<input type='text' oninput='setNum(this)'  onkeyup='this.dataset.detail=this.value;keyUpFunction(this)' style='padding:0.3em;border-right: 1px solid black;border-bottom: 1px solid black;' class='inputs doc_Form_" +
												reportForm +
												"_" +
												title[i] +
												"'/>";

										} else if (i == 8) {

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
								getTotalCount(obj);
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
					</body>
				</html>
			</div>
		


			<script src="/js/header.js"></script>
			<script src="/js/cipher.js"></script>
			<script src="/js/loading.js"></script>
			<script src="/js/editor/ckeditor.js"></script>
			<script src="/js/gwEstimate/gwEstimate.js"></script>



		</body>


	</html>