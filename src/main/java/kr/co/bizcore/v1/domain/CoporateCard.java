package kr.co.bizcore.v1.domain;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class CoporateCard extends Domain {
    private int no;
    private String compId;
    private String card;
    private String alias;
    private String div;
    private int bank;
    private String status;
    private int hipass;
    private String remark;
    private Date issued;
    private Date created;
    private Date modified;
    private Date deleted;



    public String toJson() {
        String result = "{";
        result += ("\"no\":"+ no + ",");
        result += ("\"compId\":\"" + compId + "\",");
        result += ("\"card\":\"" + card + "\",");
        result += ("\"alias\":\"" + alias + "\",");
        result += ("\"div\":\"" + div + "\",");
        result += ("\"bank\":" + bank + ",");
        result += ("\"status\":\"" + status + "\",");
        result += ("\"hipass\":" + hipass + ",");
        result += ("\"remark\":\"" + remark + "\",");
        result += ("\"issued\":\"" + issued + "\",");
        result += ("\"created\":" + (created == null ? "null" :created.getTime()) + ",");
        result += ("\"modified\":" + (modified == null ? "null" :modified.getTime()) + ",");
        result += ("\"deleted\":" + (deleted == null ? "null" :deleted.getTime()) + "}");
        return result;
    }
}