package kr.co.bizcore.v1.msg;

public interface Msg {
    public String idPwMisMatch = "0000/User ID or password mis match.";
    public String notLoggedin = "0001/Session expired or Not logged in.";
    public String compIdNotVerified = "0002/Company ID is Not verified.";
    public String aesKeyNotFound = "0003/Encryption key is not set.";
    public String wrongDateFormat = "0004/Wrong date format.";
    public String fileNotFound = "0006/File not found or removed.";
    public String permissionDenied = "0007/Permission denied";
    public String unknownError = "9999/An error occurred while processing your request.";
}
