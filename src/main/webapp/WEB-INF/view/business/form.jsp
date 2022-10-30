<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300&family=Outfit:wght@600&display=swap');
    @font-face {font-family:MalgunGothic; src:url(/fonts/malgun.ttf);}

    .mainPdf{
        font-family:MalgunGothic, sans-serif;
        border: 1px solid #000;
        padding: 10px;
        max-height: 600px;
        overflow-y: auto;
    }

    .imgLogo{
        display: flex;
        align-items: center;
    }

    .pdfLogoLeft{
        width: 100%;
    }

    .pdfLogoLeft > img{
        width: 350px;
    }

    .pdfLogoRight{
        padding-bottom: 7px;
    }

    .pdfLogoRight > img{
        width: 850px;
    }

    .pdfTitle{
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 30px;
        padding-bottom: 20px;
        font-size: 2.5rem;
        font-family: 'Outfit', sans-serif;
    }

    .pdfHeadInfo{
        border: 1px solid #000;
        display: grid;
        grid-template-columns: 50% 50%;
        padding: 10px;
        margin-bottom: 5px;
    }

    .pdfHeadInfo > div{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pdfHeadInfo > div > span{
        font-size: 0.8rem;
        padding-bottom: 4px;
    }

    .pdfHeadInfo > div > input{
        border: 1px solid #000;
        width: 60%;
    }

    .pdfHeadInfoPrice{
        border: 1px solid #000;
        display: grid;
        grid-template-columns: 50% 50%;
        padding: 10px;
        margin-bottom: 5px;
    }

    .pdfHeadInfoPrice > div{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pdfHeadInfoPrice > div > span{
        font-size: 0.8rem;
        padding-bottom: 4px;
    }

    .pdfHeadInfoPrice > div:first-child > input{
        border: 1px solid #000;
        width: 50%;
    }

    .pdfHeadInfoPrice > div:last-child > input{
        border: 1px solid #000;
        width: 60%;
    }

    .pdfMainContainer{
        font-size: 0.8rem;
        border-top:2px solid #000;
        border-left: 2px solid #000;
        border-right: 2px solid #000;
        margin-bottom: 15px;
    }

    .pdfMainContentHeader{
        display: grid;
        grid-template-columns: 10% 10% 30% 10% 10% 10% 10% 10%;
        border-bottom: 1px solid #000;
    }

    .pdfMainContentHeader > div{
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #000;
    }

    .pdfMainContentHeader > div:last-child{
        border-right: 0;
    }

    .pdfMainContentTitle{
        display: grid;
        grid-template-columns: 10% 10% 30% 10% 10% 10% 10% 10%;
        background-color: #FFFF75;
        font-weight: 500;
        font-size: 0.8rem;
        border-bottom: 1px solid #000;
    }

    .pdfMainContentTitle > div{
        display: flex;
        align-items: center;
        background-color: #FFFF75;
        font-weight: 500;
        font-size: 0.8rem;
        border-right: 1px solid #000;
    }

    .pdfMainContentTitle > .subTitleIndex{
        justify-content: center;
    }

    .pdfMainContentTitle > .subTitle{
        grid-column: span 2;
        justify-content: center;
    }

    .pdfMainContentTitle > .subTitle > input{
        width: 100%;
        background-color: #FFFF75;
        text-align: center;
    }

    .pdfMainContentTitle > .subTitleTotal{
        justify-content: right;
    }

    .pdfMainContentTitle > div:last-child{
        border-right: 0;
    }

    .pdfMainContentItem{
        display: grid;
        grid-template-columns: 10% 10% 30% 10% 10% 10% 10% 10%;
        border-bottom: 1px solid #000;
    }

    .pdfMainContentItem > div{
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid #000;
    }

    .pdfMainContentItem > div > input{
        width: 100%;
        text-align: center;
    }

    .pdfMainContentItem > .itemConsumer > input{
        text-align: right;
    }

    .pdfMainContentItem > .itemAmount > input{
        text-align: right;
    }

    .pdfMainContentItem > .itemTotal{
        justify-content: right;
    }

    .pdfMainContentItem > div:last-child{
        border-right: 0;
    }

    .pdfMainContentAddBtns{
        display: flex;
        align-items: center;
        justify-content: right;
        padding: 10px;
        border-bottom: 1px solid #000;
    }

    .pdfMainContentAddBtns > button{
        background-color: #2147b1;
        color: #ffffff;
        padding: 5px;
        border-radius: 5px;
        margin-right: 5px;
    }

    .pdfMainContentAddBtns > button:hover{
        background-color: #182f81;
    }

    .pdfMainContentAmount{
        border-bottom: 1px solid #000;
        display: grid;
        grid-template-columns: 10% 10% 30% 10% 10% 10% 10% 10%;
    }

    .pdfMainContentAmount > div{
        display: flex;
        align-items: center;
        border-right: 1px solid #000;
    }

    .pdfMainContentAmount > div:first-child{
        grid-column: span 6;
        justify-content: center;
        letter-spacing: 0.5em;
    }

    .pdfMainContentAmount > div:not(:first-child){
        justify-content: right;
    }

    .pdfMainContentAmount > div:last-child{
        border-right: 0;
    }

    .pdfMainContentTax{
        border-bottom: 1px solid #000;
        display: grid;
        grid-template-columns: 10% 10% 30% 10% 10% 10% 10% 10%;
    }

    .pdfMainContentTax > div{
        display: flex;
        align-items: center;
        border-right: 1px solid #000;
    }

    .pdfMainContentTax > div:first-child{
        grid-column: span 6;
        justify-content: center;
        letter-spacing: 0.5em;
    }

    .pdfMainContentTax > div:not(:first-child){
        justify-content: right;
    }

    .pdfMainContentTax > div:last-child{
        border-right: 0;
    }

    .pdfMainContentTotal{
        border-bottom: 2px solid #000;
        display: grid;
        grid-template-columns: 10% 10% 30% 10% 10% 10% 10% 10%;
    }

    .pdfMainContentTotal > div{
        display: flex;
        align-items: center;
        border-right: 1px solid #000;
    }

    .pdfMainContentTotal > div:first-child{
        grid-column: span 6;
        justify-content: center;
        letter-spacing: 0.5em;
    }

    .pdfMainContentTotal > div:not(:first-child){
        justify-content: right;
    }

    .pdfMainContentTotal > div:last-child{
        border-right: 0;
    }

    .pdfBottomRemarks{
        font-size: 0.8rem;
    }

    .pdfBottomRemarks > div{
        padding: 10px 0 10px 0;
    }

    .pdfBottomLogo{
        display: flex;
        align-items: center;
        justify-content: right;
        padding-top: 20px;
    }
</style>
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
    <div class="pdfHeadInfo">
        <div>
            <span>견&ensp;적&ensp;일&ensp;자&nbsp;:&nbsp;</span>
            <input type="text">
        </div>
        <div>
            <span>상&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;호&nbsp;:&nbsp;</span>
            <input type="text">
        </div>
        <div>
            <span>대&ensp;표&ensp;이&ensp;사&nbsp;:&nbsp;</span>
            <input type="text">
        </div>
        <div>
            <span>사&ensp;&nbsp;&nbsp;업&ensp;&nbsp;&nbsp;명&nbsp;:&nbsp;</span>
            <input type="text">
        </div>
        <div>
            <span>주&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;소&nbsp;:&nbsp;</span>
            <input type="text">
        </div>
        <div>
            <span>수&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;신&nbsp;:&nbsp;</span>
            <input type="text">
        </div>
        <div>
            <span>전 화 / 팩 스&nbsp;:&nbsp;</span>
            <input type="text">
        </div>
        <div>
            <span>영&ensp;업&ensp;담&ensp;당&nbsp;:&nbsp;</span>
            <input type="text">
        </div>
    </div>
    <div class="pdfHeadInfoPrice">
        <div>
            <span>견&ensp;적&ensp;금&ensp;액&nbsp;:&nbsp;</span>
            <input type="text">&nbsp;
            <span>(VAT 포함)</span>
        </div>
        <div>
            <span>유&ensp;효&ensp;기&ensp;간&nbsp;:&nbsp;</span>
            <input type="text">
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
        </div>
        <div class="pdfMainContentAddBtns">
            <button type="button" onclick="addEstTitle(this);">타이틀추가</button>
            <button type="button" onclick="addEstItem(this);">항목추가</button>
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