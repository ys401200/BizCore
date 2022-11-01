<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="mainPdf">
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
        <select onchange="selectAddressChange(this);"></select>
    </div>
    <div class="pdfHeadInfo">
        <div>
            <span>견&ensp;적&ensp;일&ensp;자&nbsp;:&nbsp;</span>
            <input type="date" max="9999-12-31" id="date">
        </div>
        <div>
            <span>상&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;호&nbsp;:&nbsp;</span>
            <input type="text" autocomplete="off" id="firmName" readonly>
        </div>
        <div>
            <span>사&nbsp;&nbsp;&nbsp;&nbsp;업&nbsp;&nbsp;&nbsp;명&nbsp;:&nbsp;</span>
            <input type="text" autocomplete="off" placeholder="사업명 입력" id="title">
        </div>
        <div>
            <span>대&ensp;표&ensp;이&ensp;사&nbsp;:&nbsp;</span>
            <input type="text" autocomplete="off" id="representative" class="headInfoCeoName" readonly>
        </div>
        <div>
            <span>수&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;신&nbsp;:&nbsp;</span>
            <input type="text" autocomplete="off" class="headInfoCustomer" id="customer" data-complete="customer" placeholder="ex) 무등록거래처" onclick="addAutoComplete(this);" onkeyup="addAutoComplete(this);">&nbsp;/&nbsp;
            <input type="text" autocomplete="off" class="headInfoCip" id="cip" data-complete="cip" placeholder="ex) 담당자명" onclick="addAutoComplete(this);" onkeyup="addAutoComplete(this);">
        </div>
        <div>
            <span>주&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;소&nbsp;:&nbsp;</span>
            <!-- <input type="text" autocomplete="off" id="address" class="headInfoAddress" readonly> -->
            <textarea class="address" disabled></textarea>
        </div>
        <div>
            <span>영&ensp;업&ensp;담&ensp;당&nbsp;:&nbsp;</span>
            <input type="text" autocomplete="off" id="writer" class="headInfoWriter" readonly>
        </div>
        <div>
            <span>전 화 / 팩 스&nbsp;:&nbsp;</span>
            <input type="text" autocomplete="off" id="phone" class="headInfoPhone" onkeyup="phoneFormat(this);" readonly>&nbsp;/&nbsp;
            <input type="text" autocomplete="off" id="fax" class="headInfoFax" onkeyup="phoneFormat(this);" readonly>
        </div>
    </div>
    <div class="pdfHeadInfoPrice">
        <div>
            <span>견&ensp;적&ensp;금&ensp;액&nbsp;:&nbsp;</span>
            <input type="text" autocomplete="off" id="price" readonly>&nbsp;
            <input type="radio" name="vat" data-value="true" id="vatTrue" onclick="setTotalHtml();" checked>
            <label for="vatTrue">VAT 포함</label>
            <input type="radio" name="vat" data-value="false" id="vatFalse" onclick="setTotalHtml();">
            <label for="vatFalse">VAT 비포함</label>
        </div>
        <div>
            <span>유&ensp;효&ensp;기&ensp;간&nbsp;:&nbsp;</span>
            <input type="radio" name="exp" value="1w" id="exp_1w" checked>
            <label for="exp_1w">1w</label>
            <input type="radio" name="exp" value="2w" id="exp_2w">
            <label for="exp_2w">2w</label>
            <input type="radio" name="exp" value="4w" id="exp_4w">
            <label for="exp_4w">4w</label>
            <input type="radio" name="exp" value="1m" id="exp_1m">
            <label for="exp_1m">1m</label>
        </div>
    </div>
    <div class="pdfMainContainer">
        <div class="pdfMainContentHeader">
            <div>No</div>
            <div>구분</div>
            <div>품명/규격</div>
            <div>수량</div>
            <div>소비자가</div>
            <div>공급단가</div>
            <div>합계</div>
            <div>비고</div>
            <div>추가/삭제</div>
        </div>
        <div class="pdfMainContentAddBtns">
            <button type="button" onclick="addEstTitle(this);">타이틀추가</button>
            <button type="button" onclick="addEstItem(this);">항목추가</button>
            <button type="button" onclick="removeEstItem(this);">항목제거</button>
        </div>
        <div class="pdfMainContentAmount">
            <div>공급가합계</div>
            <div></div>
            <div></div>
        </div>
        <div class="pdfMainContentTax">
            <div>부가세합계</div>
            <div></div>
            <div></div>
        </div>
        <div class="pdfMainContentTotal">
            <div>총금액</div>
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