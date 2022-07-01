package kr.co.bizcore.v1.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User implements Domain {
    private int userNo;
    private String compId;
    private String userId;
    private String userName;
    private String deptId;

    @JsonIgnore
    private Permission permission;

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
    public String[] getAvailableFunc(int permission) {
        String[] result = {};
        if (this.permission != null)
            result = this.permission.getAvailableFunc(permission);
        return result;
    }

    @JsonIgnore
    public String[] getAvailableSub(String subId, int permission) {
        String[] result = {};
        if (this.permission != null)
            result = this.permission.getAvailableSub(subId, permission);
        return result;
    }
}
