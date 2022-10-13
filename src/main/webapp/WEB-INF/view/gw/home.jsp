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
					<div><span>전자결재 홈</span>
						<div>
							<!-- <button class="waitVerCard" onclick="drawWaitCard()">카드</button><button class="waitVerList"
								onclick="drawWaitList()">리스트</button> -->
						</div>
					</div>
					<div>
						<div class="cardTabButton">
							<div>
								<button class="waitBtn" onclick="drawWaitCard(0)">결재 대기 문서</button>
							</div>
							<div>
								<button class="dueBtn" onclick="drawWaitCard(1)">결재 예정 문서</button>
							</div>
							<div>
								<button class="receiveBtn" onclick="drawWaitCard(2)">결재 수신 문서</button>
							</div>
							<div>
								<button class="referBtn" onclick="drawWaitCard(3)">참조/열람 대기 문서</button>
							</div>
						</div>
						<div class="waitDiv"></div>
					</div>

					<div class="waitList listDiv"></div>
					<div class="pageContainer waitPage"></div>

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