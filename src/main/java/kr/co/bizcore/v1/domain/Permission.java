package kr.co.bizcore.v1.domain;

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

} // End of Class === Permission
