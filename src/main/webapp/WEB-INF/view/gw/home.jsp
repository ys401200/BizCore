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
					<div><span> 결재 대기 문서</span>
						<div><button class="waitVerCard" onclick="drawWaitCard(0)">카드</button><button
								class="waitVerList" onclick="drawWaitList(0)">리스트</button></div>
					</div>
					<div class="waitDiv"></div>
					<div class="waitList listDiv"></div>
					<div class="pageContainer waitPage"></div>

				</div>
				<div class="container">
					<hr />
					<div><span> 결재 예정 문서</span>
						<div><button class="dueVerCard" onclick="drawWaitCard(1)">카드</button><button class="dueVerList"
								onclick="drawWaitList(1)">리스트</button></div>
					</div>
					<div class="dueDiv"></div>
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

					<div class="receiveDiv"></div>
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
					<div class="referDiv"></div>
					<div class="referList listDiv"></div>
					<div class="pageContainer referPage"></div>
				</div>

			</div>
		</div>




		</div>
		<div class="msg_cnt"></div>
		<jsp:include page="../bottom.jsp" />