package kr.co.bizcore.v1.msg;

public class MsgKor implements Msg{
    public String idPwMisMatch = "0000/사용자 아이디 또는 비밀번호가 맞지 않습니다..";
    public String notLoggedin = "0001/세션이 만료되었거나 로그인하지 않았습니다.";
    public String compIdNotVerified = "0002/고객사 아이디를 확인할 수 없습니다.";
    public String aesKeyNotFound = "0003/암호화 키를 찾을 수 없습니다.";
    public String wrongDateFormat = "0004/날짜 포맷이 잘못되었습니다.";
    public String fileNotFound = "0006/파일이 존재하지 않거나 제거되었습니다.";
    public String permissionDenied = "0007/접근 권한이 없습니다.";
    public String unknownError = "9999/요청을 처리하는 중 문제가 발생했습니다.";
}
