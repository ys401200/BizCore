<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
  <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <jsp:include page="../header.jsp" />
    <div id="bodyContents">
      <div id="sideContents">
        <jsp:include page="../sideMenu.jsp" />
      </div>
      <div id="bodyContent">
        <div class="mywriteContainer">
          <hr />
          <span>새 결재 진행</span>
          <div class="ContentDiv">
            <div class="leftContentDiv">






              <div class="selector">
                <label onclick="selectChangeEvent(1)" class="forSelect_1" for="select_1">1.결재 양식 선택</label><input
                  type="radio" name="radio" id="select_1" class="form" />
                <div class="formDetail">
                  <div class="formLeft">
                    <div class="searchDiv">
                      <input type="text" class="searchFormText" /><button type="button" class="searchFormbtn">
                        검색
                      </button>
                    </div>
                    <div class="formListDiv"></div>
                  </div>
                  <div class="formRight">
                    <input type="hidden" class="formNumHidden" />
                    <div class="formPreview"> </div>
                    <button type="button" class="formSelectbtn" onclick="selectForm()">
                      선택
                    </button>
                  </div>
                </div>
              </div>








              <div class="selector">
                <label onclick="selectChangeEvent(2)" class="forSelect_2" for="select_2">2.결재선 선택</label><input
                  type="radio" name="radio" id="select_2" class="form" />
                <div class="lineDetail">
                  <div class="lineTop">
                    <div class="innerDetail" id="lineLeft"></div>
                    <div class="innerDetail" id="lineCenter">
                      <button onclick="check(this.value)" value="examine">검토 ></button>
                      <button onclick="check(this.value)" value="agree">합의 ></button>
                      <button onclick="check(this.value)" value="approval">결재 ></button>
                      <button onclick="check(this.value)" value="conduct">수신 ></button>
                      <button onclick="check(this.value)" value="read">열람 ></button>
                      <button onclick="check(this.value)" value="refer">참조 ></button>
                    </div>
                    <div class="innerDetail" id="lineRight">
                      <label for="examine"> 검토 </label>
                      <div class="typeContainer" id="examine"></div>
                      <label for="agree"> 합의 </label>
                      <div class="typeContainer" id="agree"></div>
                      <label for="approval"> 결재 </label>
                      <div class="typeContainer" id="approval"></div>
                      <label for="conduct"> 수신 </label>
                      <div class="typeContainer" id="conduct"></div>
                      <label for="read"> 열람 </label>
                      <div class="typeContainer" id="read"></div>
                      <label for="refer"> 참조 </label>
                      <div class="typeContainer" id="refer"></div>
                    </div>

                  </div>
                  <div id="lineBottom"><button class="createLineBtn" onclick="createLine()">결재선 생성</button></div>
                </div>
              </div>









              <div class="selector">
                <label onclick="selectChangeEvent(3)" class="forSelect_3" for="select_3">3.양식 내용 입력</label><input
                  type="radio" name="radio" id="select_3" class="form" />

              </div>






              <div class="selector">
                <label onclick="selectChangeEvent(4)" class="forSelect_4" for="select_4">4.상신하기</label><input
                  type="radio" name="radio" id="select_4" class="form" />
                <div></div>
              </div>



            </div>



            <div class="rightContentDiv">
              <div class="reportInsertForm"></div>
            </div>


          </div>
        </div>
      </div>
    </div>
    <div class="msg_cnt"></div>
    <jsp:include page="../bottom.jsp" />