package kr.co.bizcore.v1.domain;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class SimpleContract extends Domain {
    
    protected int no; //번호
    protected int salesType; //판매방식
    protected String contractType; //계약방식
    protected String title; //계약명
    protected int endUser; //엔드유저
    protected long contractAmount; //계약금액
    protected int profit; //매출이익
    protected int employee; //담당자
    protected Date startOfFreeMaintenance; //무상유지보수일자 시작일
    protected Date endOfFreeMaintenance; //무상유지보수일자 종료일
    protected Date startOfPaidMaintenance; //유상유지보수일자 시작일
    protected Date endOfPaidMaintenance; //유상유지보수일자 종료일
    protected Date saleDate; //발주일자? 판매일자?

    public void setStartOfFreeMaintenance(Date v){startOfFreeMaintenance = v;}
    public void setStartOfFreeMaintenance(long v){startOfFreeMaintenance = new Date(v);}
    public void setEndOfFreeMaintenance(Date v){endOfFreeMaintenance = v;}
    public void setEndOfFreeMaintenance(long v){endOfFreeMaintenance = new Date(v);}
    public void setStartOfPaidMaintenance(Date v){startOfPaidMaintenance = v;}
    public void setStartOfPaidMaintenance(long v){startOfPaidMaintenance = new Date(v);}
    public void setEndOfPaidMaintenance(Date v){endOfPaidMaintenance = v;}
    public void setEndOfPaidMaintenance(long v){endOfPaidMaintenance = new Date(v);}

}
