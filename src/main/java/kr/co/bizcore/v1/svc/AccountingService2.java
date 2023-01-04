package kr.co.bizcore.v1.svc;

import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AccountingService2 extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(AccountingService2.class);

    public String getAccountSubject(String compId){
        String result = null;
        HashMap<String, String> each = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, Object> sbj = null;
        HashMap<String, Object> ca = null;
        HashMap<String, Object> cb = null;
        HashMap<String, Object> cc = null;
        HashMap<String, String> cd = null;
        String[] r = new String[5];
        int x = 0;
        String code = null, t = null, sa = null, sb = null, sc = null, sd = null, se = null;
        Object[] ka = null, kb = null, kc = null, kd = null, ke = null;
        boolean[] isFirst = {true, true, true, true, true};

        // JSON 만들기 전
        list = accMapper2.getAccountSubject(compId);
        sbj = new HashMap<>();
        if(list != null)    for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            code = each.get("code");
            t = code.substring(0, 1);
            r[0] = t + "." + each.get("class_a");
            t = code.substring(1, 3);
            r[1] = t + "." + each.get("class_b");
            t = code.substring(3, 5);
            r[2] = t + "." + each.get("class_c");
            t = code.substring(5, 7);
            r[3] = t + "." + each.get("class_d");
            r[4] = each.get("class_e");

            ca = (HashMap<String, Object>)sbj.get(r[0]);
            if(ca == null){
                ca = new HashMap<>();
                sbj.put(r[0], ca);
            }

            cb = (HashMap<String, Object>)ca.get(r[1]);
            if(cb == null){
                cb = new HashMap<>();
                ca.put(r[1], cb);
            }

            cc = (HashMap<String, Object>)cb.get(r[2]);
            if(cc == null){
                cc = new HashMap<>();
                cb.put(r[2], cc);
            }

            cd = (HashMap<String, String>)cc.get(r[3]);
            if(cd == null){
                cd = new HashMap<>();
                cc.put(r[3], cd);
            }

            cd.put(code, r[4]);
        }

        // JSON 만들기 시작
        result = "{";
        ka = sbj.keySet().toArray();
        for(Object o1 : ka){
            sa = (String)o1;
            ca = (HashMap<String, Object>)sbj.get(sa);
            if(isFirst[0])  isFirst[0] = false;
            else            result += ",";
            result += ("\"" + sa + "\":{");

            kb = ca.keySet().toArray();
            for(Object o2 : kb){
                sb = (String)o2;
                cb = (HashMap<String, Object>)ca.get(sb);
                if(isFirst[1])  isFirst[1] = false;
                else            result += ",";
                result += ("\"" + sb + "\":{");

                kc = cb.keySet().toArray();
                for(Object o3 : kc){
                    sc = (String)o3;
                    cc = (HashMap<String, Object>)cb.get(sc);
                    if(isFirst[2])  isFirst[2] = false;
                    else            result += ",";
                    result += ("\"" + sc + "\":{");

                    kd = cc.keySet().toArray();
                    for(Object o4 : kd){
                        sd = (String)o4;
                        cd = (HashMap<String, String>)cc.get(sd);
                        if(isFirst[3])  isFirst[3] = false;
                        else            result += ",";
                        result += ("\"" + sd + "\":{");

                        ke = cd.keySet().toArray();
                        for(Object o5 : ke){
                            se = (String)o5;
                            t = cd.get(se);
                            if(isFirst[4])  isFirst[4] = false;
                            else            result += ",";
                            result += ("\"" + se + "\":\"" + t + "\"");
                        } // End of for(o4)
                        result += "}";
                        isFirst[4] = true;

                    } // End of for(o4)
                    result += "}";
                    isFirst[3] = true;

                } // End of for(o3)
                result += "}";
                isFirst[2] = true;

            } // End of for(o2)
            result += "}";
            isFirst[1] = true;

        } // End of for(o1)
        result += "}";

        return result;
    } // End of getAccountSubject()
    
}
