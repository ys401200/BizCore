package kr.co.bizcore.v1.msg;

public class MsgKor extends Msg{
    public MsgKor(){
        idPwMisMatch = "0000/사용자 아이디 또는 비밀번호가 맞지 않습니다.";
        notLoggedin = "0001/세션이 만료되었거나 로그인하지 않았습니다.";
        compIdNotVerified = "0002/고객사 아이디를 확인할 수 없습니다.";
        compNoNotVerified = "0002/고객사 number를 확인할 수 없습니다.";
        aesKeyNotFound = "0003/암호화 키를 찾을 수 없습니다.";
        wrongDateFormat = "0004/날짜 포맷이 잘못되었습니다.";
        fileNotFound = "0006/파일이 존재하지 않거나 제거되었습니다.";
        permissionDenied = "0007/접근 권한이 없습니다.";
        noResult = "0008/결과가 없습니다.";
        invalidCondition = "0009/조회 조건이 잘못되었습니다.";
        failDecrypt = "0010/암호문을 해제하는데 실패했습니다.";
        formNotFound = "0011/문서 양식을 찾을 수 없습니다.";
        dataIsWornFormat = "0012/수신된 데이터가 잘못된 형식입니다.";
        docNotFound = "0013/요청한 문서를 찾을 수 없습니다.";
        errorDocAppLine = "0014/요청한 문서를 처리하는 동안 오류가 발생했습니다. [결재선]";
        errorDocBody = "0015/요청한 문서를 처리하는 동안 오류가 발생했습니다. [문서 본문]";
        unknownError = "9999/요청을 처리하는 중 문제가 발생했습니다.";
    }
}
