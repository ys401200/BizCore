package kr.co.bizcore.v1.domain;

import java.util.ArrayList;
import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Estimate extends SimpleEstimate{

    protected String type;
    protected int ver;
    protected int sopp;
    protected int discount;

    protected EstimateInfo info = new EstimateInfo();

    public void setCompany(String company){info.setCompany(company);}
    public void setCeo(String ceo){info.setCeo(ceo);}
    public void setAddress(String address){info.setAddress(address);}
    public void setPhone(String phone){info.setPhone(phone);}
    public void setFax(String fax){info.setFax(fax);}
    public void setPeriod(int period){info.setPeriod(period);}
    public void setContent(String content){info.setContent(content);}

    public String getCompany(){return info.getCompany();}
    public String getCeo(){return info.getCeo();}
    public String getAddress(){return info.getAddress();}
    public String getPhone(){return info.getPhone();}
    public String getFax(){return info.getFax();}
    public int getPeriod(){return info.getPeriod();}
    public String getContent(){return info.getContent();}

    public String getInfoInsertQuery(String compId){return info.createInsertQuery(null, compId);}
    public String getInfoUpdateQuery(EstimateInfo info, String tableName){return info.createUpdateQuery(info, tableName);}

    private ArrayList<EstimateItem> items = new ArrayList<>();

    public void addItem(EstimateItem item){items.add(item);}
    
}

@Setter @Getter
class EstimateInfo extends Domain{
    protected String company;
    protected String ceo;
    protected String address;
    protected String phone;
    protected String fax;
    protected int period;
    protected String content;
}
