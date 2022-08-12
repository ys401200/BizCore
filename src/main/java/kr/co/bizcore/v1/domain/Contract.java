package kr.co.bizcore.v1.domain;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Contract extends SimpleContract{

    private int sopp; //영업기회
    private int prvCont;
    private int employee2; //(부)담당사원
    private int customer; //매출처
    private int cipOfCustomer; //매출처 담당자
    private String detail; //내용
    private int cipOfendUser; //엔드유저 담당자
    private int partner;
    private int cipOfPartner;
    private int supplier;
    private int cipOfSupplier;
    private Date supplied;
    private Date delivered; //검수일자
    private String taxInclude; //vat 포함여부
    private String area;
    private String typeOfBusiness;

    // public void setTaxInclude(String yn){taxInclude = yn;}
    // public void setTaxInclude(boolean yn){taxInclude = yn ? "Y" : "N";}
    // public void setStartOfPaidMaintenance(Date e){startOfPaidMaintenance = e;}
    // public void setStartOfPaidMaintenance(long e){startOfPaidMaintenance = new Date(e);}
    // public void setEndOfPaidMaintenance(Date e){endOfPaidMaintenance = e;}
    // public void setEndOfPaidMaintenance(long e){endOfPaidMaintenance = new Date(e);}
    // public void setSupplied(Date e){supplied = e;}
    // public void setSupplied(long e){supplied = new Date(e);}
    // public void setDelivered(Date e){delivered = e;}
    // public void setDelivered(long e){delivered = new Date(e);}
    // public void setCreated(Date e){created = e;}
    // public void setCreated(long e){created = new Date(e);}
    // public void setModified(Date e){modified = e;}
    // public void setModified(long e){modified = new Date(e);}
    // public void setStartOfFreeMaintenance(Date e){startOfFreeMaintenance = e;}
    // public void setStartOfFreeMaintenance(long e){startOfFreeMaintenance = new Date(e);}
    // public void setEndOfFreeMaintenance(Date e){endOfFreeMaintenance = e;}
    // public void setEndOfFreeMaintenance(long e){endOfFreeMaintenance = new Date(e);}
    // public void setSaleDate(long e){saleDate = new Date(e);}
    // public void setSaleDate(Date e){saleDate = e;}
    
}
