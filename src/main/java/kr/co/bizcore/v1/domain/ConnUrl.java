package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConnUrl implements Domain {

    private String connAddr;
    private String compId;

    @Override
    public String toJson() {
        return null;
    }

}
