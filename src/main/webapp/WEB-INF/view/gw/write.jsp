<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
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
        <div class="selectFormDiv">
          <div class="selector">
            <label
              onclick="selectChangeEvent(1)"
              class="forSelect_1"
              for="select_1"
              >1.결재 양식 선택</label
            ><input type="radio" name="radio" id="select_1" class="form" />
            <div class="formDetail">
              <div class="formLeft">
                <div class="searchDiv">
                  <input type="text" class="searchFormText" /><button
                    type="button"
                    class="searchFormbtn"
                  >
                    검색
                  </button>
                </div>
                <div class="formListDiv"></div>
              </div>
              <div class="formRight">
                <input type="hidden" class="formNumHidden"/>
                <div class="formPreview">미리보기</div>
                <button
                  type="button"
                  class="formSelectbtn"
                  onclick="selectForm()"
                >
                  선택
                </button>
              </div>
            </div>
          </div>

          <div class="selector">
            <label
              onclick="selectChangeEvent(2)"
              class="forSelect_2"
              for="select_2"
              >2.결재선 선택</label
            ><input
              type="radio"
              name="radio"
              id="select_2"
              class="approvalLine"
            />
            <div class="lineDetail">
              <div class="lineLeft">
                <div class="searchDiv">
                  <input type="text" class="lineFormText" /><button
                    type="button"
                    class="lineFormbtn"
                  >
                    검색
                  </button>
                </div>
                <div class="lineListDiv"></div>
              </div>
              <div class="lineRight"></div>
            </div>
          </div>

          <div class="selector">
            <label
              onclick="selectChangeEvent(3)"
              class="forSelect_3"
              for="select_3"
              >3.양식 내용 입력</label
            ><input
              type="radio"
              name="radio"
              id="select_3"
              class="insertForm"
            />
            <div class="reportInsertForm"></div>
          </div>

          <div class="selector">
            <label
              onclick="selectChangeEvent(4)"
              class="forSelect_4"
              for="select_4"
              >4.상신하기</label
            ><input type="radio" name="radio" id="select_4" class="sendForm" />
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="msg_cnt"></div>
<jsp:include page="../bottom.jsp" />
