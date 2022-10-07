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
          <span>새 결재 진행</span>
          <div class="ContentDiv">
            <div class='gwWriteBtns'>
              <button type='button' onclick='reportInsert()' class='writeBtn'>기안 하기</button>
              <button class='saveBtn' type='button' onclick='tempSave()' disabled>임시 저장</button>
            </div>
            <div class='selector'>


              <div>기본 설정</div>
              <div>
                <div class='formDetail'>

                  <div>

                    <div>
                      <div>결재양식</div>
                      <div>
                        <div class='formListDiv'></div>
                        <button type='button' class='formSelectbtn' onclick='selectForm()'>선택</button>
                        <input type='hidden' class='formNumHidden' />
                      </div>

                    </div>
                    <div>
                      <div>작성자</div>
                      <div>누구누구</div>
                    </div>
                  </div>


                  <div>
                    <div>
                      <div>열람권한</div>
                      <div><label><input type='radio' name='authority' value='dept' checked />기안자 소속 부서
                          포함</label><label><input type='radio' name='authority' value='none' />권한 설정 없음</label>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>


            <div class='selector'>
              <div>결재선</div>

              <div class="lineBtnContainer">
                <div>
                  <div class='guide'> 결재 양식을 선택하면 결재선 생성을 할 수 있습니다. </div><button class='createLineBtn'
                    onclick='showModal()'>결재선생성</button>
                </div>
                <div class='modal-wrap'>
                  <div class='gwModal'></div>
                </div>

              </div>

            </div>







            <div class='selector'>
              <div>상세 입력</div>
              <div class="lineBtnContainer">
                <div class='guide'> 결재 양식을 선택하면 상세 입력을 할 수 있습니다.</div>
                <div class='insertedDetail'>
                  <div class='reportInsertForm'></div>
                  <div class='referContainer'>
                    <div>참조</div>
                  </div>
                  <div class='fileDetail'>
                    <div>파일첨부</div>
                    <div class='filebtnContainer'><input type='file' multiple id='attached' name='attached[]'
                        onchange='docFileChange()' />
                      <div class='filePreview'></div>
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