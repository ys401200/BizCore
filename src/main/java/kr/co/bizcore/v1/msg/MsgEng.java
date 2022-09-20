package kr.co.bizcore.v1.msg;

public class MsgEng extends Msg{   
    public MsgEng(){
        idPwMisMatch = "0000/User ID or password mis match.";
        notLoggedin = "0001/Session expired or Not logged in.";
        compIdNotVerified = "0002/Company ID is Not verified.";
        aesKeyNotFound = "0003/Encryption key is not set.";
        wrongDateFormat = "0004/Wrong date format.";
        fileNotFound = "0006/File not found or removed.";
        permissionDenied = "0007/Permission denied";
        noResult = "0008/Result is empty.";
        invalidCondition = "0009/Invalid query condition.";
        failDecrypt = "0010/Failed to decrypt the ciphertext.";
        formNotFound = "0011/The document form could not be found.";
        dataIsWornFormat = "0012/The received data is in the wrong format";
        unknownError = "9999/An error occurred while processing your request.";
    }
}
