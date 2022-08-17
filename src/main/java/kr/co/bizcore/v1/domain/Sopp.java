package kr.co.bizcore.v1.domain;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.xml.bind.annotation.XmlElement;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sopp extends SimpleSopp{

    private int contract;
    @XmlElement(nillable=true)
    private String picOfCustomer; //매출처 담당자
    private int ptnc;
    private int picOfBuyer;
    @XmlElement(nillable=true)
    private String detail; //내용
    @XmlElement(nillable=true)
    private Date targetDate; //예상매출예정일
    @XmlElement(nillable=true)
    private Date startOfMaintenance;
    @XmlElement(nillable=true)
    private Date endOfMaintenance;
    private int progress; //가능성
    private int source;
    @XmlElement(nillable=true)
    private String remark;
    @XmlElement(nillable=true)
    private Date remarkDate;
    @XmlElement(nillable=true)
    private String businessType;
    @XmlElement(nillable=true)
    private String priority;


    //public void setStartOfMaintenance(Date v){startOfMaintenance = v;}
    //public void setStartOfMaintenance(long v){startOfMaintenance = new Date(v);}
    //public void setEndOfMaintenance(Date v){endOfMaintenance = v;}
    //public void setEndOfMaintenance(long v){endOfMaintenance = new Date(v);}
    //public String getStartOfMaintenance(){return cvtDateToStr(startOfMaintenance);}
    //public String getEndOfMaintenance(){return cvtDateToStr(endOfMaintenance);}
    //public void setTargetDate(Date v){targetDate = v;}
    //public String getTargetDate(){return cvtDateToStr(targetDate);}

    private String cvtDateToStr(Date d){
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
        return fmt.format(d);
    }
    
}
