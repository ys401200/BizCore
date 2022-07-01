package kr.co.bizcore.v1.util;

import java.net.InetAddress;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import kr.co.bizcore.v1.svc.SystemService;

@Component
public class Utility {

    @Autowired
    private SystemService systemService;

    private static boolean DEBUG;
    private static String SERVER_ADDRESS = "192.168.1.72";

    public Utility() {
        setDebugMode();
    }

    public boolean debug() {
        return DEBUG;
    }

    // ip주소 확인, 디버깅모드 확인
    private void setDebugMode() {
        String ip = null;
        try {
            ip = InetAddress.getLocalHost().getHostAddress();
            DEBUG = (SERVER_ADDRESS != ip);
        } catch (Exception e) {
        }

    } // End of setDebugMode()

    // ===============================================================================
    // 암호화
    // ===============================================================================

    private String generateKey() {
        return generateKey(32);
    } // End of generateKey()

    private String generateKey(int length) {
        byte[] data = null, src = new byte[69];
        int x = 0;
        int t = 0;

        for (x = 0; x < src.length; x++) {
            if (x < 10)
                src[x] = (byte) (x + 48);
            else if (x < 36)
                src[x] = (byte) (x + 55);
            else if (x < 62)
                src[x] = (byte) (x + 61);
            else if (x == 63)
                src[x] = (byte) 33;
            else if (x == 64)
                src[x] = (byte) 43;
            else if (x == 65)
                src[x] = (byte) 126;
            else
                src[x] = (byte) (x - 31);
        }

        data = new byte[length];
        for (x = 0; x < length; x++) {
            t = (int) (Math.random() * src.length);
            data[x] = src[t];
        }

        return new String(data);
    } // End of generateKey()

    // AES 암호화 메서드
    public String encAes(String message) {
        return message;
    } // End of encAes()

    public String encSHA256(String str) {
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-256");
            md.update(str.getBytes());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return md == null ? null : bytesToHex(md.digest());
    } // End of encSHA256()

    private String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder();
        for (byte b : bytes) {
            builder.append(String.format("%02x", b));
        }
        return builder.toString();
    }

}
