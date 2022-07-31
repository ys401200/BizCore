package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Contract extends SimpleContract{

    private int sopp;
    private int prvCont;
    private int employee2;
    private int customer;
    private int cipOfCustomer;
    private String detail;
    private int cipOfBuyer;
    private int partner;
    private int cipOfPartner;
    private int supplier;
    private int cipOfSupplier;
    private Date sullpied;
    private Date delivered;
    private boolean taxInclude;
    private Date startPaidMaintenence;
    private Date endPaidMaintenence;
    private String area;
    private String typeOfBusiness;
    private Date created;
    private Date modified;

    public void setTaxInclude(String yn){taxInclude = yn != null && yn.equals("Y");}
    
}
