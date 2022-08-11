package kr.co.bizcore.v1.domain;

import java.text.SimpleDateFormat;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

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

    public int getContract(){return contract;}
    public String getPicOfCustomer(){return picOfCustomer;}
    public int getPtnc(){return ptnc;}
    public int getPicOfBuyer(){return picOfBuyer;}
    public String getDetail(){return detail;}
    public int getProgress(){return progress;}
    public int getSource(){return source;}
    public String getRemark(){return remark;}
    public Date getRemarkDate(){return remarkDate;}
    public String getBusinessType(){return businessType;}
    public String getPriority(){return priority;}

    public void setStartOfMaintenance(Date v){startOfMaintenance = v;}
    public void setStartOfMaintenance(long v){startOfMaintenance = new Date(v);}
    public void setEndOfMaintenance(Date v){endOfMaintenance = v;}
    public void setEndOfMaintenance(long v){endOfMaintenance = new Date(v);}
    public String getStartOfMaintenance(){return cvtDateToStr(startOfMaintenance);}
    public String getEndOfMaintenance(){return cvtDateToStr(endOfMaintenance);}
    public void setTargetDate(Date v){targetDate = v;}
    public String getTargetDate(){return cvtDateToStr(targetDate);}

    private String cvtDateToStr(Date d){
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
        return fmt.format(d);
    }
    
}
