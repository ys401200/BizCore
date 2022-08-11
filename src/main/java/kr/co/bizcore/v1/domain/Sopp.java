package kr.co.bizcore.v1.domain;

import java.text.SimpleDateFormat;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sopp extends SimpleSopp{

    private int contract;
    private String picOfCustomer; //매출처 담당자
    private int ptnc;
    private int picOfBuyer;
    private String detail; //내용
    private Date targetDate; //예상매출예정일
    private Date startOfMaintenance;
    private Date endOfMaintenance;
    private int progress; //가능성
    private int source;
    private String remark;
    private Date remarkDate;
    private String businessType;
    private String priority;

    public void setStartOfMaintenance(Date v){startOfMaintenance = v;}
    public void setStartOfMaintenance(long v){startOfMaintenance = new Date(v);}
    public void setEndOfMaintenance(Date v){endOfMaintenance = v;}
    public void setEndOfMaintenance(long v){endOfMaintenance = new Date(v);}
    public String getStartOfMaintenance(){return cvtDateToStr(startOfMaintenance);}
    public String getEndOfMaintenance(){return cvtDateToStr(endOfMaintenance);}
    public String getTargetDate(){return cvtDateToStr(targetDate);}

    private String cvtDateToStr(Date d){
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
        return fmt.format(d);
    }
    
}
