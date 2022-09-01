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
            <div class="gwWriteBtns">
              <button type="button">기안 하기</button>
              <button type="button">임시 저장</button>
              <button type="button">인쇄 미리보기</button>
            </div>



            <div class="selector">
              <div>기본 설정</div>
              <div class="formDetail">
                <div>결재양식</div>
                <div class="formListDiv"></div>
                <button type="button" class="formSelectbtn" onclick="selectForm()">선택</button>
                <input type="hidden" class="formNumHidden"/>
              </div>
              <div class="formDetail">
                <div>열람권한</div>
                <div>
                  <label><input type="radio" name="authority" value="dept" />기안자 소속 부서 포함</label>
                  <label><input type="radio" name="authority" value="none" checked />권한 설정 없음</label>
                </div>
              </div>
            </div>








            <div class="selector">
              <div>결재선 <button class="createLineBtn" onclick="showModal()">결재선생성</button></div>
              <div class="modal-wrap">
                <div class="gwModal">
                  <div class="modal-title">결재선 지정</div>

                  <div class="lineDetail">
                    <div class="lineTop">
                      <div class="innerDetail" id="lineLeft"></div>
                      <div class="innerDetail" id="lineCenter">
                        <button onclick="check(this.value)" value="examine">검토 ></button>
                        <button onclick="check(this.value)" value="agree">합의 ></button>
                        <button onclick="check(this.value)" value="approval">결재 ></button>
                        <button onclick="check(this.value)" value="conduct">수신 ></button>

                        <button onclick="check(this.value)" value="refer">참조 ></button>
                      </div>
                      <div class="innerDetail" id="lineRight">
                        <label for="examine"> 검토
                          <div class="typeContainer" id="examine"></div>
                        </label>
                        <label for="agree"> 합의
                          <div class="typeContainer" id="agree"></div>
                        </label>
                        <label for="approval"> 결재
                          <div class="typeContainer" id="approval"></div>
                        </label>
                        <label for="conduct"> 수신
                          <div class="typeContainer" id="conduct"></div>
                        </label>
                        <label for="refer"> 참조
                          <div class="typeContainer" id="refer"></div>
                        </label>
                      </div>

                    </div>
                  </div>
                  <div class="close-wrap">
                    <button id="close" onclick="closeGwModal(this)">취소</button>

                    <button id="create" onclick="closeGwModal(this)">생성</button>

                  </div>


                </div>



              </div>

            </div>





            <div class="selector">
              <div>상세 입력</div>
              <div class="insertedDetail">
                <div class="reportInsertForm"></div>




                <div class="referContainer">
                  <div>참조</div>
                </div>

                <div class="fileDetail">
                  <div>파일첨부</div>
                  <div class="filebtnContainer">
                    <input type="file" class="gwFileInput" onchange="drawSelectedFileList(this)" />
                    <div class="insertedFileList"></div>
                  </div>
                </div>
              </div>

            </div>
















          </div>
        </div>
      </div>
    </div>
    <div class="msg_cnt"></div>
    <jsp:include page="../bottom.jsp" />