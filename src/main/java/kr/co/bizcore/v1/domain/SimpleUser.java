package kr.co.bizcore.v1.domain;

import java.util.ArrayList;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

public class SimpleUser implements Domain {

    @Getter
    @Setter
    private int userNo;
    @Getter
    @Setter
    private String compId;
    @Getter
    @Setter
    private String userId;
    @Getter
    @Setter
    private String userName;
    private ArrayList<String> deptId;

    public void setDeptId(String[] ids){
        if(deptId == null)  deptId = new ArrayList<>();
        if(ids != null && ids.length > 0)   for(int x = 0 ; x < ids.length ; x++)   deptId.add(ids[x]);
    }

    public String[] getDeptId(){return deptId.toArray(new String[deptId.size()]);}

    public void addDeptId(String id){
        Permission p = null;
        if(deptId == null){
            deptId = new ArrayList<>();
            permission = new ArrayList<>();
        }
        if(id != null){
            deptId.add(id);
            p = new Permission();
            permission.add(p);
        }
    }

    public boolean setPermission(String deptId, String funcId, String subId, String perm){
        boolean result = false;
        Permission p = null;
        int x = 0;

        for(x = 0 ; x < this.deptId.size() ; x++){
            if(this.deptId.get(x).equals(deptId)){
                p = this.permission.get(x);
                break;
            }
        }

        if(p != null){
            x = Integer.parseInt(perm);
            p.setSubPermission(funcId, subId, x);
            result = true;
        }

        return result;
    }

    public String getDeptIdSqlIn(){
        String result = "";
        int x = 0;
        for(x = 0 ; x < deptId.size() ; x++){
            if(x == 0)  result = deptId.get(x);
            else        result += ("','" + deptId.get(x));
        }
        return result;
    }

    @JsonIgnore
    private ArrayList<Permission> permission;

    public String toJson() {
        ObjectMapper mapper = new ObjectMapper();
        String result = null;
        try {
            result = mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return result;
    } // End of toJson()

    @JsonIgnore
    public String[] getAvailableFunc(String deptId, int permission) {
        String[] result = null;
        Permission perm = null;
        int x = 0;

        if(deptId != null && deptId.length() > 0)   for(x = 0 ; x < this.deptId.size() ; x++){
            if(this.deptId.get(x).equals(deptId)){
                perm = this.permission.get(x);
                break;
            }
        }

        if(perm != null){
            result = perm.getAvailableFunc(permission);
        }

        return result;
    } // End of getAvailableFunc()

    public String[] getAvailableFunc(int permission){
        String[] result = null, t = null;
        HashSet<String> set = null;
        int x1 = 0, x2 = 0;

        set = new HashSet<>();
        for(x1 = 0 ; x1 < this.deptId.size() ; x1++){
            t = getAvailableFunc(this.deptId.get(x1), permission);
            for(x2 = 0 ; x2 < t.length ; x2++) set.add(t[x2]);
        }

        set.toArray(result);
        return result;
    } // End of getAvailableFunc()

    @JsonIgnore
    public String[] getAvailableSub(String deptId, String funcId, int permission) {
        String[] result = null;
        HashSet<String> set = null;
        Permission perm = null;
        int x = 0;

        if(deptId != null && deptId.length() > 0)   for(x = 0 ; x < this.deptId.size() ; x++){
            if(this.deptId.get(x).equals(deptId)){
                perm = this.permission.get(x);
                break;
            }
        }

        if(perm != null){
            result = perm.getAvailableSub(deptId, permission);
        }

        return result;
    } // End of getAvailableSub()
}
