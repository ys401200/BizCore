package kr.co.bizcore.v1.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Select;

import kr.co.bizcore.v1.domain.SimpleContract;

public interface ContractMapper {
    
    @Select("SELECT contno AS no, conttype AS salesType, cntrctmth AS contractType, conttitle AS title, buyrno AS buyer, contamt AS contractAmount, net_profit AS profit, userno AS employee, freemaintsdate AS maintenanceStart, freemaintedate as maintenanceEnd, contorddate AS saleDate FROM swc_cont WHERE attrib NOT like 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = #{compId}) ORDER BY regdatetime DESC")
    public List<SimpleContract> getContractList(String compId);

    @Select("")
    public SimpleContract getContract(String compId);
}
