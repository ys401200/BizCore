import React, {Component} from "react";
import {mainNoticeList} from "../utilApi/api";
import "../css/main/work.css";

class Work extends Component{
    constructor(props){
        super(props);

        this.getNoticeList = this.getNoticeList.bind(this);
    }

    componentDidMount(){
        this.getNoticeList();
    }

    getNoticeList(){
        mainNoticeList().then(res => {
            console.log(res);
        });
    }

    render(){
        return(
            <>
                <div id="bodyNotice">
                    <hr />
                    <span>공지사항</span>
                    <div id="noticeTableDiv">
                        <table id="noticeTable" frame="void">
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th id="notiTitle">제목</th>
                                    <th>작성자</th>
                                    <th>등록일</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div id="bodySched">
                    <hr />
                    <span>일정조회</span>
                    <div id="schedTableDiv">
                        <table id="schedTable" frame="void">
                            <thead>
                                <tr>
                                    <th>작성일자</th>
                                    <th id="schedTitle">일정제목</th>
                                    <th id="schedTitle">일정설명</th>
                                    <th>일정</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div id="bodyMyDoc">
                    <hr />
                    <span>나의 문서함</span>
                    <div id="myDocTableDiv">
                        <table id="myDocTable" frame="void">
                            <thead>
                                <tr>
                                    <th>작성일자</th>
                                    <th id="myDocTitle">문서명</th>
                                    <th>금액</th>
                                    <th>진행상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div id="bodyDocList">
                    <hr />
                    <span>나의 결재함</span>
                    <div id="docListTableDiv">
                        <table id="docListTable" frame="void">
                            <thead>
                                <tr>
                                    <th>작성일자</th>
                                    <th id="docListTitle">문서명</th>
                                    <th>금액</th>
                                    <th>진행상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div id="bodyDocList">
                    <hr />
                    <span>나의 결재함</span>
                    <div id="docListTableDiv">
                        <table id="docListTable" frame="void">
                            <thead>
                                <tr>
                                    <th>작성일자</th>
                                    <th id="docListTitle">문서명</th>
                                    <th>금액</th>
                                    <th>진행상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div id="bodyAtt">
                    <hr />
                    <span>근태조회</span>
                    <div id="attTableDiv">
                        <table id="attTable" frame="void">
                            <thead>
                                <tr>
                                    <th>작성일자</th>
                                    <th>근태종류</th>
                                    <th id="attTitle">내용</th>
                                    <th>시작일</th>
                                    <th>종료일</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div id="bodyCont">
                    <hr />
                    <span>계약조회</span>
                    <div id="contTableDiv">
                        <table id="contTable" frame="void">
                            <thead>
                                <tr>
                                    <th>작성일자</th>
                                    <th>판매방식</th>
                                    <th>계약방식</th>
                                    <th id="contTitle">계약명</th>
                                    <th>매출처</th>
                                    <th>계약금액</th>
                                    <th>매출이익</th>
                                    <th>담당자</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }
}

export default Work;