package kr.co.bizcore.v1.domain;

import java.util.ArrayList;
import java.util.HashMap;

public class Permission {

    private HashMap<String, HashMap<String, Integer>> permission;

    public Permission() {
        permission = new HashMap<>();
    }

    public void setPermission(String funcId, int permission) {
        this.setSubPermission(funcId, "A", permission);
    } // End of setPermission)_

    public void setSubPermission(String funcId, String subId, int permission) {
        HashMap<String, Integer> sub = null;
        if (funcId == null || subId == null)
            return;
        sub = this.permission.get(funcId);
        if (sub == null) {
            sub = new HashMap<>();
            this.permission.put(funcId, sub);
        }
        sub.put(subId, permission);
    } // End of setSub()

    public int getPermission(String funcId) {
        return this.getSubPermission(funcId, "A");
    } // End of getPermission()

    public int getSubPermission(String funcId, String subId) {
        int result = 0;
        Integer t = null;
        HashMap<String, Integer> sub = null;
        if (funcId == null || subId == null)
            return result;
        sub = this.permission.get(funcId);
        t = sub.get(subId);
        if (t != null) {
            result = t;
            result = result < -1 ? -1 : result > 2 ? 2 : result;
        }

        return result;
    } // End of getSubPermission()

    // 권한이 있는 funcId를 반환하는 메서드,
    public String[] getAvailableFunc(int permission) {
        String[] result = null;
        ArrayList<String> data = new ArrayList<>();
        HashMap<String, Integer> sub = null;
        Object[] keys = this.permission.keySet().toArray();
        Integer t1 = null;
        int t2 = 0;

        for (Object each : keys) {
            sub = this.permission.get(each);
            t1 = sub.get("A");
            if (t1 != null) {
                t2 = t1;
                if (permission <= t2)
                    data.add((String) each);
            }
        }

        data.toArray(result);
        return result;
    } // End of getAvailableFunc()

    // 권한이 있는 서브id를 반환하는 메서드
    public String[] getAvailableSub(String subId, int permission) {
        String[] result = null;
        ArrayList<String> data = new ArrayList<>();
        HashMap<String, Integer> sub = this.permission.get(subId);
        Object[] keys = null;
        Integer t1 = null;
        int t2 = 0;

        if (sub != null) {
            keys = this.permission.keySet().toArray();
            for (Object each : keys) {
                t1 = sub.get(each);
                if (t1 != null) {
                    t2 = t1;
                    if (permission <= t2)
                        data.add((String) each);
                }
            }
        }

        data.toArray(result);
        return result;
    } // End of getAvailableSub()

} // End of Class === Permission
