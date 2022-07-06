package kr.co.bizcore.v1.util;

import java.net.InetAddress;

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

}
