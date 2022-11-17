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

					<div class="reportContainer">
						<div class="tabs">

							<input type="radio" id="tabWait" name="tabItem" data-content-id="tabWaitList"
								onclick="tabItemClick(this)" checked>
							<label class="tabItem" for="tabWait" style="z-index: 8; width:25%; padding-left:0%;">결재 대기
								문서(0)</label>

							<input type="radio" id="tabDue" name="tabItem" data-content-id="tabDueList"
								onclick="tabItemClick(this)">
							<label class="tabItem" for="tabDue" style="z-index: 6; width: 25%; padding-left: 25%;">결재 예정
								문서(0)</label>

							<input type="radio" id="tabReceive" name="tabItem" data-content-id="tabReceiveList"
								onclick="tabItemClick(this)">
							<label class="tabItem" for="tabReceive" style="z-index: 4; width:25%; padding-left: 50%;">결재
								수신
								문서(0)</label>

							<input type="radio" id="tabRefer" name="tabItem" data-content-id="tabReferList"
								onclick="tabItemClick(this)">
							<label class="tabItem" for="tabRefer" style="z-index: 2; width: 25%; padding-left: 75%;">
								참조/열람 문서(0)</label>
						</div>

						<div class="list waitList" id="tabWaitList">
							<div class="typeBtn"><button onclick="showCard(0)">카드</button><button onclick="showList(0)">리스트</button>
							</div>
							<div class="card"></div>
							<div class="detailList"></div>
							<div class="pageContainer"></div>

						</div>
						<div class="list dueList" id="tabDueList" style="display: none;">
							<div class="typeBtn"><button onclick="showCard(1)">카드</button><button onclick="showList(1)">리스트</button>
							</div>
							<div class="card"></div>
							<div class="detailList"></div>
							<div class="pageContainer"></div>
						</div>
						<div class="list receiveList" id="tabReceiveList" style="display: none;">
							<div class="typeBtn"><button onclick="showCard(2)">카드</button><button onclick="showList(2)">리스트</button>
							</div>
							<div class="card"></div>
							<div class="detailList"></div>
							<div class="pageContainer"></div>
						</div>
						<div class="list referList" id="tabReferList" style="display: none;">
							<div class="typeBtn"><button onclick="showCard(3)">카드</button><button onclick="showList(3)">리스트</button>
							</div>
							<div class="card"></div>
							<div class="detailList"></div>
							<div class="pageContainer"></div>

						</div>
					</div>
				</div>
			</div>
		</div>

		</div>
		<div class="msg_cnt"></div>
		<jsp:include page="../bottom.jsp" />