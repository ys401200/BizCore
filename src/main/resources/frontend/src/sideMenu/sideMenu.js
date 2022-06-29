import React, {Component} from "react";
import mainHomeIcon from "../images/main/icons/mainHomeIcon.png";
import mainNoticeIcon from "../images/main/icons/mainNoticeIcon.png";
import mainSchedIcon from "../images/main/icons/mainSchedIcon.png";
import mainSalesIcon from "../images/main/icons/mainSalesIcon.png";
import mainSoppIcon from "../images/main/icons/mainSoppIcon.png";
import mainPpsIcon from "../images/main/icons/mainPpsIcon.png";
import mainContIcon from "../images/main/icons/mainContIcon.png";
import mainTechIcon from "../images/main/icons/mainTechIcon.png";
import mainBoardFileIcon from "../images/main/icons/mainBoardFileIcon.png";
import mainLogOutIcon from "../images/main/icons/mainLogOutIcon.png";
import mainSoppList2Icon from "../images/main/icons/mainSoppList2Icon.png";
import mainManualIcon from "../images/main/icons/mainManualIcon.png";
import mainSettingIcon from "../images/main/icons/mainSettingIcon.png";
import "../css/sideMenu.css";

class SideMenu extends Component {
    constructor(props){
        super(props);

        this.state = {
            isActive: "unActive",
            isPanelActive: "panelUnactive"
        }

        this.panelSlideClick = this.panelSlideClick.bind(this);
    }

    panelSlideClick = (e) => {
        let target = e.target;
        let targetParent = e.target.parentNode;

        this.setState({
            isActive: "unActive",
            isPanelActive: "panelUnactive"
        });
        
        if(e.target.localName === "a"){
            if(target.className === "" || target.className === "unActive"){
                target.className = "active";
                target.nextSibling.className = "panelActive";
                target.nextSibling.style.display = "block";
                target.children.slideSpan.innerHTML = "-";
            }else{
                target.className = "unActive";
                target.nextSibling.className = "panelUnactive";
                target.nextSibling.style.display = "none";
                target.children.slideSpan.innerHTML = "+";
            }
        }else{
            if(targetParent.className === "" || targetParent.className === "unActive"){
                targetParent.className = "active";
                targetParent.nextSibling.className = "panelActive";
                targetParent.nextSibling.style.display = "block";
                targetParent.children.slideSpan.innerHTML = "-";
            }else{
                targetParent.className = "unActive";
                targetParent.nextSibling.className = "panelUnactive";
                targetParent.nextSibling.style.display = "none";
                targetParent.children.slideSpan.innerHTML = "+";
            }
        }
    }

    render(){
        return(
            <div id="sideMenu">
                <ul id="work" className="ulActive">
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>나의 업무 홈</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainNoticeIcon} id="mainNoticeIcon" />
                            <span>공지사항</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainSchedIcon} id="mainSchedIcon" />
                            <span>일정관리</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 캘린더</a></li>
                            <li><a href="#">- 일정조회</a></li>
                            <li><a href="#">- 일정등록</a></li>
                            <li><a href="#">- 개인업무일지작성</a></li>
                            <li><a href="#">- 업무일지검토</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainSalesIcon} id="mainSalesIcon" />
                            <span>영업활동관리</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 영업활동조회</a></li>
                            <li><a href="#">- 영업활동등록</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainSoppIcon} id="mainSoppIcon" />
                            <span>영업기회</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 영업기회조회</a></li>
                            <li><a href="#">- 영업기회등록</a></li>
                            <li><a href="#">- 견적관리</a></li>
                            <li><a href="#">- 견적작성</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainPpsIcon} id="mainPpsIcon"/>
                            <span>조달업무</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 조달업무할당</a></li>
                            <li><a href="#">- 조달진행상황</a></li>
                            <li><a href="#">- 조달계약관리</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainSoppList2Icon} id="mainSoppList2Icon" />
                            <span>수주판매보고</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 수주판매보고조회</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainContIcon} id="mainContIcon" />
                            <span>계약관리</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 계약조회</a></li>
                            <li><a href="#">- 계약등록</a></li>
                            <li><a href="#">- 업체정보조회</a></li>
                            <li><a href="#">- 매입/매출 자료등록</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainTechIcon} id="mainTechIcon" />
                            <span>기술지원업무</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 기술지원조회</a></li>
                            <li><a href="#">- 기술지원등록</a></li>
                            <li><a href="#">- 유지보수계약관리</a></li>
                            <li><a href="#">- 유지보수매입관리</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainBoardFileIcon} id="mainBoardFileIcon" />
                            <span>자료실</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainManualIcon} id="mainManualIcon" />
                            <span>메뉴얼가이드</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainSettingIcon} id="mainSettingIcon" />
                            <span>설정</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainLogOutIcon} id="mainLogOutIcon" />
                            <span>로그아웃</span>
                        </a>
                    </li>
                </ul>
                    
                <ul id="group" className="ulUnactive">
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>그룹웨어</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>전자결재</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 나의문서함</a></li>
                            <li><a href="#">- 나의결재함</a></li>
                            <li><a href="#">- 결재 등록/처리</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>인사업무</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 근태신청조회/관리</a></li>
                            <li><a href="#">- 근태등록</a></li>
                        </ul>
                    </li>
                </ul>
                
                <ul id="acc" className="ulUnactive">
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>회계관리</span>
                            <span id="slideSpan">+</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>전표관리</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 전표조회</a></li>
                            <li><a href="#">- 전표등록</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>매입/매출관리</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 매입매출조회</a></li>
                            <li><a href="#">- 매입매출등록</a></li>
                            <li><a href="#">- 미지급현황</a></li>
                            <li><a href="#">- 미수금현황</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>자금관리</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 자금현황조회</a></li>
                            <li><a href="#">- 계좌내역등록</a></li>
                            <li><a href="#">- 계좌내역조회</a></li>
                            <li><a href="#">- 카드내역등록</a></li>
                            <li><a href="#">- 카드내역조회</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>세금계산서관리</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 매입계산서조회</a></li>
                            <li><a href="#">- 매출계산서조회</a></li>
                            <li><a href="#">- 계산서등록</a></li>
                            <li><a href="#">- 계산서발행</a></li>
                            <li><a href="#">- 계산서연결현황</a></li>
                            <li><a href="#">- 거래처별매출원장</a></li>
                            <li><a href="#">- 거래처별매입원장</a></li>
                        </ul>
                    </li>
                </ul>
                
                <ul id="manage" className="ulUnactive">
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>경영정보</span>
                            <span id="slideSpan">+</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>매입매출현황</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 매입매출현황</a></li>
                            <li><a href="#">- 미지급현황</a></li>
                            <li><a href="#">- 미수금현황</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>자금현황</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 입출금조회</a></li>
                            <li><a href="#">- 일자별자금일보</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>프로젝트현황</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 프로젝트진행조회</a></li>
                            <li><a href="#">- 프로젝트별수익분석</a></li>
                            <li><a href="#">- 계약별수익분석</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>인사관리현황</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 근태현황조회</a></li>
                            <li><a href="#">- 개인별원가분석</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className={this.state.isActive} onClick={this.panelSlideClick}>
                            <img src={mainHomeIcon} id="mainHomeIcon" />
                            <span>영업분석</span>
                            <span id="slideSpan">+</span>
                        </a>
                        <ul className={this.state.isPanelActive} id="panel">
                            <li><a href="#">- 매출분석</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
}

export default SideMenu;