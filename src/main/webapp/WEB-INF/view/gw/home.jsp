<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<jsp:include page="../header.jsp" />
		<div id="bodyContents">
			<div id="sideContents">
				<jsp:include page="../sideMenu.jsp" />
			</div>
			<div id="bodyContent">
				<div class="container">
					<hr />
					<span>전자결재 홈</span>

					<div class="tabs">

						<input type="radio" id="tabWait" name="tabItem" data-content-id="tabWaitList"
							onclick="tabItemClick(this)" checked>
						<label class="tabItem" for="tabWait" style="z-index: 8; width:24%; padding-left: 0%;">결재 대기
							문서(0)</label>

						<input type="radio" id="tabDue" name="tabItem" data-content-id="tabDueList"
							onclick="tabItemClick(this)">
						<label class="tabItem" for="tabDue" style="z-index: 6; width: 24%; padding-left: 25%;">결재 예정
							문서(0)</label>

						<input type="radio" id="tabReceive" name="tabItem" data-content-id="tabReceiveList"
							onclick="tabItemClick(this)">
						<label class="tabItem" for="tabReceive" style="z-index: 4; width: 24%; padding-left: 50%;">결재 수신
							문서(0)</label>

						<input type="radio" id="tabRefer" name="tabItem" data-content-id="tabReferList"
							onclick="tabItemClick(this)">
						<label class="tabItem" for="tabRefer" style="z-index: 2; width: 24%; padding-left: 75%;">
							참조/열람 문서(0)</label>

						<!-- <div><button  class="waitBtn" name="domTab" id="waitBtn" onclick="drawWaitCard(0)"></button></div>

							<div><button  class="dueBtn" name="domTab" id="dueBtn" onclick="drawWaitCard(1)"></button></div>

							<div><button  class="receiveBtn" name="domTab" id="receiveBtn"
								onclick="drawWaitCard(2)"></button></div>

							<div><button  class="referBtn" name="domTab" id="referBtn" onclick="drawWaitCard(3)"></button></div> -->

					</div>


					<div class="list waitList" id="tabWaitList">
						<div><button onclick="drawWaitCardBtn(0)">카드</button><button
								onclick="drawWaitList(0)">리스트</button></div>
						<div class="card"></div>
						<div class="detailList"></div>
						<div class="pageContainer"></div>

					</div>
					<div class="list dueList" id="tabDueList" style="display: none;">
						<div><button onclick="drawWaitCardBtn(1)">카드</button><button
								onclick="drawWaitList(1)">리스트</button></div>
						<div class="card"></div>
						<div class="detailList"></div>
						<div class="pageContainer"></div>
					</div>
					<div class="list receiveList" id="tabReceiveList" style="display: none;">
						<div><button onclick="drawWaitCardBtn(2)">카드</button><button
								onclick="drawWaitList(2)">리스트</button></div>
						<div class="card"></div>
						<div class="detailList"></div>
						<div class="pageContainer"></div>
					</div>
					<div class="list referList" id="tabReferList" style="display: none;">
						<div><button onclick="drawWaitCardBtn(3)">카드</button><button
								onclick="drawWaitList(3)">리스트</button></div>
						<div class="card"></div>
						<div class="detailList"></div>
						<div class="pageContainer"></div>

					</div>



					<!-- <div class="optionDiv"><button onclick="drawWaitCardBtn()">카드</button><button
								onclick="drawWaitList()">리스트</button></div>
						<div class="comTabContent">
							<div class="waitDiv"></div>
							<div class="waitList listDiv"></div>
							<div class="pageContainer waitPage"></div>
						</div> -->



				</div>














				<!-- <div class="container">
					<hr />
					<div><span> 결재 예정 문서</span>
						<div><button class="dueVerCard" onclick="drawWaitCard(1)">카드</button><button class="dueVerList"
								onclick="drawWaitList(1)">리스트</button></div>
					</div>
					<div><button onclick="prevPage(this)">
							< </button>
								<div class="dueDiv"></div><button onclick="nextPage(this)"> > </button>
					</div>
					<div class="dueList listDiv"></div>
					<div class="pageContainer duePage"></div>
				</div>
				<div class="container">
					<hr />
					<div><span> 결재 수신 문서</span>
						<div>
							<button class="receiveCard" onclick="drawWaitCard(2)">카드</button><button
								class="receiveVerList" onclick="drawWaitList(2)">리스트</button>
						</div>
					</div>

					<div><button onclick="prevPage(this)">
							< </button>
								<div class="receiveDiv"></div><button onclick="nextPage(this)"> > </button>
					</div>
					<div class="receiveList listDiv"></div>
					<div class="pageContainer receivePage"></div>
				</div>
				<div class="container">
					<hr />
					<div><span> 참조/열람 대기 문서</span>
						<div>
							<button class="referVerCard" onclick="drawWaitCard(3)">카드</button><button
								class="referVerList" onclick="drawWaitList(3)">리스트</button>
						</div>
					</div>
					<div><button onclick="prevPage(this)">
							< </button>
								<div class="referDiv"></div><button onclick="nextPage(this)"> > </button>
					</div>
					<div class="referList listDiv"></div>
					<div class="pageContainer referPage"></div>
				</div> -->

			</div>
		</div>




		</div>
		<div class="msg_cnt"></div>
		<jsp:include page="../bottom.jsp" />