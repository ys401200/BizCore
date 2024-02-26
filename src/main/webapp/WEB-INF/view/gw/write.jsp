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
          <span class="titleSpan">새 결재 진행</span>
          <div class="ContentDiv">
            <div class="crudBtns paddingBottom">
              <button type='button' onclick='CommonDatas.Temps.gwWriteSet.reportInsert()' class='writeBtn'>기안 하기</button>
              <button class='saveBtn' type='button' onclick='CommonDatas.Temps.gwWriteSet.tempSave()' disabled>임시 저장</button>
              <!-- <button class="createEst" type="button" onclick="window.open('/gw/estimate','','width:1100px')">견적서 셋</button> -->
            </div>


            <div class='selector'>
              <div class="stepLabel">● 기본 설정</div>
              <div class='formDetail'>

                <div>

                  <div>
                    <div> 결재양식</div>
                    <div class="crudBtns">
                      <div class='formListDiv'></div>
                      <button type='button' class='formSelectbtn' onclick='CommonDatas.Temps.gwWriteSet.selectForm()'>선택</button>
                      <input type='hidden' class='formNumHidden' />
                    </div>

                  </div>

                  <div>
                    <div>작성자</div>
                    <div class="setWriter"></div>
                  </div>
                </div>


                <div>
                  <div>
                    <div>열람권한</div>
                    <div><label><input type='radio' name='authority' value='dept' checked style="display: inline;" />기안자 소속 부서
                        포함</label><label><input type='radio' name='authority' value='none' style="display: inline;" />권한 설정 없음</label>
                    </div>
                  </div>
                </div>


              </div>

            </div>


            <div class='selector'>

              <div class="stepLabel crudBtns">● 결재선<button class='createLineBtn' onclick='CommonDatas.Temps.gwWriteSet.showModal()'>결재선 생성</button>
              </div>
              <div class="lineBtnContainer">

                <div class='guide stepLabel'> 결재 양식을 선택하면 결재선 생성을 할 수 있습니다. </div>

                <div class="simpleAppLine">
                  <div>결재정보</div>
                  <div class="simpleAppLineData"></div>
                </div>

                <div class='modal-wrap'>
                  <div class='gwModal'></div>
                </div>

              </div>

            </div>


            <div class='selector'>


              <div class="stepLabel">● 상세 입력</div>
              <div class='insertedDetail'>

                <div class='fileDetail'>
                  <div>파일첨부</div>
                  <div class='filebtnContainer'><input type='file' multiple id='attached' name='attached[]'
                      onchange='CommonDatas.Temps.gwWriteSet.docFileChange()' />
                    <div class='filePreview'></div>
                  </div>
                </div>

                <div class='reportInsertForm'></div>
                <!-- <div class='referContainer'>
                  <div>참조</div>
                </div> -->

              </div>

            </div>

          </div>
        </div>
      </div>
      <div class="msg_cnt"></div>
      <jsp:include page="../bottom.jsp" />