package kr.co.bizcore.v1.ctrl;

import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/schedule")
@RestController
public class ApiScheduleCtrl extends Ctrl {

    @RequestMapping(value = {"", "/**"}, method = RequestMethod.GET)
    public String get(HttpServletRequest request){
        String result = null;
        String compId = null, userNo = null, yy = null, mm = null, uri = null, aesKey = null, aesIv = null, data = null;
        String[] t = null;
        HttpSession session = null;
        int year = -1, month = -1, maxYear = 0, minYear = 0;
        Calendar cal = Calendar.getInstance();

        minYear = cal.get(Calendar.YEAR) - 5;
        maxYear = minYear + 10;
        session = request.getSession();


        // 날짜가 있는 경우 이를 받음
        uri = request.getRequestURI();
        if(uri.substring(0, 1).equals("/")) uri = uri.substring(1);
        if(uri.substring(uri.length() - 1).equals("/")) uri = uri.substring(0, uri.length() - 1);
        t = uri.split("/");

        // 날짜에 대한 검증/기본값 설정
        if(t.length >= 4){
            yy = t[2];
            mm = t[3];
            year = convertStrToInt(yy);
            month = convertStrToInt(mm);
        }

        if(year < minYear || year > maxYear || month < 1 || month > 12){
            year = cal.get(Calendar.YEAR);
            month = cal.get(Calendar.MONTH) + 1;
        }

        // 로그인 및 compId 검증
        compId = (String)session.getAttribute("compId");
        if(compId == null)  compId = (String)request.getAttribute("compId");
        userNo = (String)session.getAttribute("userNo");

        if(compId == null){
            result = "{\"result\":\"failure\",\"msg\":\"Company ID is Not verified.\"}";
        }else if(userNo == null){
            result = "{\"result\":\"failure\",\"msg\":\"Session Expired and/or Not logged in..\"}";
        }else{
            aesKey = (String)session.getAttribute("aesKey");
            aesIv = (String)session.getAttribute("aesIv");
            data = null; // 서비스에서 데이터 받아오는 코드 작성 필요
        }

        return result;
    }

    private int convertStrToInt(String number){
        int result = -1;
        if(number != null)  try{
            result = Integer.parseInt(number);
        }catch(NumberFormatException e){}
        return result;
    } // End of convertStrToInt()


    
}
