package kr.co.bizcore.v1.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReceivableSub extends Domain {

    private int custNo;
    private int modal_receive_data;

    private String custName;
}
