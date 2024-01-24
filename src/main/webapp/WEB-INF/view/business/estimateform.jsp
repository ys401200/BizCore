<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div class="mainPdf">
    <div class="imgLogo">
        <img src="/images/estimate/pdf_logo_left.jpg" class="logoLeft" />
        <img src="/images/estimate/pdf_logo_right.png" class="logoRight" />
    </div>
    <div class="pdfTitle">
        <div class="titlePdf">QUOTATION</div>
    </div>
    <div class="pdfHeadInfo">
        <div>
            <span>견적일자</span>
            <input type="text">
        </div>
        <div>
            <span>상호</span>
            <input type="text">
        </div>
        <div>
            <span>대표이사</span>
            <input type="text">
        </div>
        <div>
            <span>사업명</span>
            <input type="text">
        </div>
        <div>
            <span>주소</span>
            <input type="text">
        </div>
        <div>
            <span>수신</span>
            <input type="text">
        </div>
        <div>
            <span>전화/팩스</span>
            <input type="text">
        </div>
        <div>
            <span>영업담당</span>
            <input type="text">
        </div>
    </div>
    <div class="pdfHeadInfoPrice">
        <div>
            <span>견적금액</span>
            <input type="text">
        </div>
        <div>
            <span>유효기간</span>
            <input type="text">
        </div>
    </div>
    <div class="pdfMainContainer">
        <div class="pdfMainContent">
            <div>No</div>
            <div>품명</div>
            <div>규격</div>
            <div>수량</div>
            <div>소비자가</div>
            <div>공급단가</div>
            <div>합계</div>
            <div>비고</div>
        </div>
        <div class="pdfMainContentAddBtns">
            <button type="button">타이틀추가</button>
            <button type="button">항목추가</button>
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
        <div class="remarksDetail"></div>
    </div>
    <div class="pdfBottomLogo">
        <img src="/images/estimate/pdf_bottom.png" class="pdfBottom" />
    </div>
    <!-- <c:choose>
        <c:when test="${empty infoItem}">
            <table id="headList">
                <tr>
                    <th>견&ensp;적&ensp;일&ensp;자 : ${detail.estDate}</th>
                    <th>상&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;호 : ${comList.comName}</th>
                </tr>
                <tr>
                    <th>견&ensp;적&ensp;번&ensp;호 : ${detail.estId}</th>
                    <th>대&ensp;표&ensp;이&ensp;사 : ${comList.comBoss} (직인생략)</th>
                </tr>
                <tr>
                    <th>사&ensp;&nbsp;&nbsp;업&ensp;&nbsp;&nbsp;명 : ${detail.estTitle}</th>
                    <th style="max-width:100%;"><div style="margin:0; float:left;">주&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;소 :&nbsp;</div><div style="display: flex;">${comList.comAddress}</div><div style="padding-top: 1.5%;">전 화 / 팩 스 : ${comList.comPhone} / ${comList.comFax}</div></th>
                </tr>
                <tr>
                    <th>
                        수&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;신 :
                        <c:choose>
                            <c:when test="${empty detail.custBossname}">
                                ${detail.custName}
                            </c:when>
                            <c:otherwise>
                                ${detail.custName}/${detail.custBossname}
                            </c:otherwise>
                        </c:choose> 
                    </th>
                    <th></th>
                </tr>
                <tr>
                    <th>영&ensp;업&ensp;담&ensp;당 : ${detail.userName}/${detail.userTel}/${detail.userEmail}</th>
                    <th></th>
                </tr>
            </table>
            <table id="totalInfo">
                <tr>
                    <th>견&ensp;적&ensp;금&ensp;액 : ￦&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<fmt:formatNumber value="${detail.estTotal}" pattern="#,###" />&ensp;&ensp;(VAT 포함)</th>
                    <th>유&ensp;효&ensp;기&ensp;간 : 견적일로 부터 2주</th>
                </tr>
            </table>
        </c:when>
        <c:otherwise>
            <table id="headList">
                <tr>
                    <th>견&ensp;적&ensp;일&ensp;자 : ${detail.estDate}</th>
                    <th>상&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;호 : ${infoItem.estComName}</th>
                </tr>
                <tr>
                    <th>견&ensp;적&ensp;번&ensp;호 : ${detail.estId}</th>
                    <th>대&ensp;표&ensp;이&ensp;사 : ${infoItem.estComBoss} (직인생략)</th>
                </tr>
                <tr>
                    <th>사&ensp;&nbsp;&nbsp;업&ensp;&nbsp;&nbsp;명 : ${detail.estTitle}</th>
                    <th><div style="margin:0; float:left;">주&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;소 :&nbsp;</div><div style="display: flex;">${infoItem.estComAdd}</div><div style="padding-top: 1.5%;">전 화 / 팩 스 : ${infoItem.estComPhone} / ${infoItem.estComFax}</div></th>
                </tr>
                <tr>
                    <th>
                        수&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;신 :
                        <c:choose>
                            <c:when test="${empty detail.custBossname}">
                                ${detail.custName}
                            </c:when>
                            <c:otherwise>
                                ${detail.custName}/${detail.custBossname}
                            </c:otherwise>
                        </c:choose> 
                    </th>
                    <th></th>
                </tr>
                <tr>
                    <th>영&ensp;업&ensp;담&ensp;당 : ${detail.userName}/${detail.userTel}/${detail.userEmail}</th>
                    <th></th>
                </tr>
            </table>
            <table id="totalInfo">
                <tr>
                    <th>견&ensp;적&ensp;금&ensp;액 : ￦&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<fmt:formatNumber value="${detail.estTotal}" pattern="#,###" />&ensp;&ensp;(VAT 포함)</th>
                    <th>유&ensp;효&ensp;기&ensp;간 : 견적일로 부터 ${infoItem.estComTerm}주</th>
                </tr>
            </table>
        </c:otherwise>
    </c:choose> -->
    
    <!-- <table id="mainTable">
        <colgroup>
            <col width="3%">
            <col width="10%">
            <col width="55%">
            <col width="5%">
            <col width="7%">
            <col width="7%">
            <col width="7%">
            <col width="7%">
        </colgroup>
        <thead>
            <tr>
                <th style="border-left:1px solid #000;">No.</th>
                <th>구분</th>
                <th>품 명 / 규 격</th>
                <th>수량</th>
                <th>소비자가</th>
                <th>공급 단가</th>
                <th>합계</th>
                <th>비고</th>
            </tr>
        </thead>
        <tbody>
            <c:choose>
                <c:when test="${param.title == 1}">
                    <c:forEach var="titleList" items="${titleList}">
                        <c:set var="titleNum" value="${titleNum+1}" />
                        <c:set var="dataTotal" value="${dataTotal + titleList.titleTotal}" />
                        <c:set var="vatTotal" value="${vatTotal + titleList.vatTotal}" />
                        <c:set var="amountTotal" value="${amountTotal + titleList.amountTotal}" />
                        <tr style="background-color:#FFFF75; border-bottom:1px solid #000; border-left:1px solid #000; border-right:1px solid #000;">
                            <th id="titleNumber" data-number="${titleNum}" style="border-right:1px solid #000;"></th>
                            <th></th>
                            <th style="border-right:1px solid #000;">${titleList.itemTitle}</th>
                            <th style="border-right:1px solid #000;"></th>
                            <th style="border-right:1px solid #000;"></th>
                            <th style="border-right:1px solid #000;"></th>
                            <th style="text-align:right; border-right:1px solid #000;"><fmt:formatNumber value="${titleList.amountTotal}" pattern="#,###" /></th>
                            <th></th>
                        </tr>
                        <c:forEach var="row" items="${list}" varStatus="status">
                            <c:if test="${titleList.itemTitle == row.itemTitle}">
                                <c:set var="noIndex" value="${noIndex+1}" />
                                <c:set var="repSpec" value='${row.productSpec.replaceAll("\\\<.*?\\\>","")}' />
                                <tr id="mainTr">
                                    <td style="text-align:center;">${noIndex}</td>
                                    <td style="text-align:center; font-weight:700;word-break:break-all;">${row.itemKinds}</td>
                                    <td id="specTd"><span style="font-weight:600;">${row.productName}</span><%-- ${repSpec.replaceAll("\\n", "<br>")} --%>${row.productSpec}</td>
                                    <td style="text-align:center;">${row.productQty}</td>
                                    <td></td>
                                    <td style="text-align:right;"><fmt:formatNumber value="${row.productNetprice}" pattern="#,###" /></td>
                                    <td style="text-align:right;"><fmt:formatNumber value="${row.productAmount}" pattern="#,###" /></td>
                                    <td style="border-right:1px solid #000;">${row.productRemark}</td>
                                </tr>
                            </c:if>
                            <c:if test="${titleList.itemTitle != row.itemTitle}">
                                <c:set var="noIndex" value="0" />
                            </c:if>
                        </c:forEach>
                    </c:forEach>
                </c:when>
                <c:otherwise>
                    <c:forEach var="row" items="${list}" varStatus="status">
                        <c:set var="rowIndex" value="${rowIndex+1}" />
                        <c:set var="repSpec" value='${row.productSpec.replaceAll("\\\<.*?\\\>","")}' />
                        <c:set var="dataTotal" value="${dataTotal + row.productTotal}" />
                        <c:set var="vatTotal" value="${vatTotal + row.productVat}" />
                        <c:set var="amountTotal" value="${amountTotal + row.productAmount}" />
                        <tr id="mainTr">
                            <td class="noTitleTd" style="text-align:center;">${rowIndex}</td>
                            <td style="text-align:center; font-weight:700;word-break:break-all;">${row.itemKinds}</td>
                            <td id="specTd"><span style="font-weight:600;">${row.productName}</span><%-- ${repSpec.replaceAll("\\n", "<br>")} --%>${row.productSpec}</td>
                            <td style="text-align:center;">${row.productQty}</td>
                            <td></td>
                            <td style="text-align:right;"><fmt:formatNumber value="${row.productNetprice}" pattern="#,###" /></td>
                            <td style="text-align:right;"><fmt:formatNumber value="${row.productAmount}" pattern="#,###" /></td>
                            <td style="border-right:1px solid #000;">${row.productRemark}</td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
            <tr style="border-top:1px solid #000;">
                <th colspan="6" style="border-right:1px solid #000;">공&ensp;급&ensp;가&ensp;합&ensp;계</th>
                <td style="text-align:right;"><fmt:formatNumber value="${amountTotal}" pattern="#,###" /></td>
                <th></th>
            </tr>
            <tr>
                <th colspan="6" style="border-right:1px solid #000; border-top:1px solid #000; border-bottom:1px solid #000;">부&ensp;가&ensp;가&ensp;치&ensp;세</th>
                <td style="text-align:right; border-top:1px solid #000; border-bottom:1px solid #000;"><fmt:formatNumber value="${vatTotal}" pattern="#,###" /></td>
                <th style="border-top:1px solid #000; border-bottom:1px solid #000;"></th>
            </tr>
            <tr>
                <th colspan="6" style="border-right:1px solid #000;">총&ensp;&ensp;&ensp;&ensp;금&ensp;&ensp;&ensp;&ensp;액</th>
                <td style="text-align:right;"><fmt:formatNumber value="${dataTotal}" pattern="#,###" /></td>
                <th></th>
            </tr>
        </tbody>
    </table> -->
    <div style="width:100%;">
        <button type="button" onclick="solPdf();" style="border: 0; background-color: #4680ff; color: #fff; text-align:center; width: 30%; height:44px; cursor: pointer;">PDF파일 저장</button>
    </div>
</div>