package kr.co.bizcore.v1.util;

import java.net.InetAddress;

public class Utility {

    private static Utility instance = new Utility();
    private boolean DEBUG;
    private String SERVER_ADDRESS = "192.168.1.72";

    private Utility() {
        setDebugMode();
    }

    public static Utility getInstance() {
        return instance;
    }

    public void setDebug(boolean debug) {
        DEBUG = debug;
    }

    public boolean debug() {
        return DEBUG;
    }

    // ip주소 확인 메서드
    private void setDebugMode() {
        String ip = null;
        try {
            ip = InetAddress.getLocalHost().getHostAddress();
            DEBUG = (SERVER_ADDRESS != ip);
        } catch (Exception e) {
        }

    } // End of setDebugMode()

    // AES 암호화 메서드
    protected String encAes(String message) {
        return message;
    } // End of encAes()

}
