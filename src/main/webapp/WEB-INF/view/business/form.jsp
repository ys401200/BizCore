<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="mainPdf" id="mainPdf">
    <div class="imgLogo">
        <div class="pdfLogoLeft">
            <img src="/images/estimate/pdf_logo_left.jpeg" class="logoLeft" />
        </div>
        <div class="pdfLogoRight">
            <img src="/images/estimate/pdf_logo_right.png" class="logoRight" />
        </div>
    </div>
    <div class="pdfTitle">
        <div class="titlePdf">QUOTATION</div>
    </div>
    <div class="selectAddress">
        <select id="estimateSelectSoppNo" class="estimateSelectSoppNo"></select>
        <select onchange="CommonDatas.Temps.estimateSet.selectAddressChange(this);"></select>
    </div>
    <div class="pdfHeadInfo">
        <div class="date">
            <span>견 적 일 자</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <input type="text" autocomplete="off" placeholder="숫자만 입력" onkeyup="CommonDatas.inputDateFormat(this)" maxlength="10" id="date">
        </div>
        <div class="firmName">
            <span>상 호</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <input type="text" autocomplete="off" id="firmName" readonly>
        </div>
        <div class="title">
            <span>사 업 명</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <input type="text" autocomplete="off" placeholder="사업명" id="title">
        </div>
        <div class="representative">
            <span>대 표 이 사</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <input type="text" autocomplete="off" id="representative" class="headInfoCeoName" readonly>
        </div>
        <div class="headInfoCustomer">
            <span>수 신</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <input type="text" autocomplete="off" class="headInfoCustomer" placeholder="ex) 부경대학교" id="customer" data-complete="customer" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
            <input type="text" autocomplete="off" class="headInfoCip" id="cip" placeholder="ex) 담당자명" data-complete="cip" onclick="CommonDatas.addAutoComplete(this);" onkeyup="CommonDatas.addAutoComplete(this);">
        </div>
        <div class="address">
            <span>주 소</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <!-- <input type="text" autocomplete="off" id="address" class="headInfoAddress" readonly> -->
            <textarea class="address" disabled></textarea>
        </div>
        <div class="writer">
            <span>영 업 담 당</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <input type="text" autocomplete="off" id="writer" class="headInfoWriter" readonly>
        </div>
        <div class="headInfoPhone">
            <span>전 화 / 팩 스</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <input type="text" autocomplete="off" id="phone" class="headInfoPhone" onkeyup="CommonDatas.phoneFormat(this);" readonly>
            <input type="text" autocomplete="off" id="fax" class="headInfoFax" onkeyup="CommonDatas.phoneFormat(this);" readonly>
        </div>
    </div>
    <div class="pdfHeadInfoPrice">
        <div class="vatInfo">
            <span>견 적 금 액</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <input type="text" autocomplete="off" id="price" readonly>
            <input type="radio" name="vat" data-value="true" id="vatTrue" onclick="CommonDatas.Temps.estimateSet.setTotalHtml();" checked>
            <label for="vatTrue">VAT 포함</label>
            <input type="radio" name="vat" data-value="false" id="vatFalse" onclick="CommonDatas.Temps.estimateSet.setTotalHtml();">
            <label for="vatFalse">VAT 비포함</label>
        </div>
        <div class="expInfo">
            <span>유 효 기 간</span><span style="padding-left: 5px; padding-right: 4px; padding-top: 3px;">:</span>
            <input type="text" placeholder="견적일로부터 4주" id="exp">
        </div>
    </div>
    <div class="pdfMainContainer">
        <div class="pdfMainContentHeader">
            <div>No</div>
            <div>품명</div>
            <div>규격</div>
            <div>수량</div>
            <div>소비자가</div>
            <div>공급단가</div>
            <div>합계</div>
            <div>비고</div>
            <div>추가/삭제</div>
        </div>
        <div class="pdfMainContentAddBtns">
            <!-- <button type="button" onclick="CommonDatas.Temps.estimateSet.addEstTitle(this);">타이틀추가</button> -->
            <button type="button" onclick="CommonDatas.Temps.estimateSet.addEstItem(this);">항목추가</button>
            <button type="button" onclick="CommonDatas.Temps.estimateSet.removeEstItem(this);">항목제거</button>
        </div>
        <div class="pdfMainContentAmount">
            <div>공&nbsp;급&nbsp;가&nbsp;합&nbsp;계</div>
            <div></div>
            <div></div>
        </div>
        <div class="pdfMainContentTax">
            <div>부&nbsp;가&nbsp;세&nbsp;합&nbsp;계</div>
            <div></div>
            <div></div>
        </div>
        <div class="pdfMainContentTotal">
            <div>총&ensp;&ensp;&ensp;금&ensp;&ensp;&ensp;액</div>
            <div></div>
            <div></div>
        </div>
    </div>
    <div class="pdfBottomRemarks">
        <span>Remarks</span>
        <textarea class="remarksDetail" id="remarks">
            결제조건은 검수(납품) 당월 계산서 발행, 익월 결제 입니다.<br />
            납기기간은 발주 후 최대 4주 입니다.<br />
            설치비용 포함 견적이며 고객사 응용프로그램 사용에 따른 커스터 마이징 비용은 미 포함이며 협의 후 포함합니다.
        </textarea>
    </div>
    <div class="pdfBottomLogo">
        <img src="/images/estimate/pdf_bottom.png" class="pdfBottom" />
    </div>
</div>