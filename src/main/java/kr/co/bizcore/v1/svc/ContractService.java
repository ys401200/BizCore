package kr.co.bizcore.v1.svc;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import kr.co.bizcore.v1.domain.Contract;
import kr.co.bizcore.v1.domain.Schedule;
import kr.co.bizcore.v1.domain.SimpleContract;
import kr.co.bizcore.v1.domain.TaxBill;
import kr.co.bizcore.v1.domain.TradeDetail;
import lombok.extern.slf4j.Slf4j;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;

@Service
@Slf4j
public class ContractService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ContractService.class);
    
    // 계약 전부
    public String getContractList(String compId){
        String result = null;
        List<SimpleContract> list = null;
        SimpleContract each = null;
        int x = 0;

        list = contractMapper.getList(compId);
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(result == null)  result = "[";
            if(x > 0)   result += ",";
            result += each.toJson();
        }
        if(result != null)  result += "]";

        return result;
    } // End of getContractList()

    // 계약 일부
    public String getContractList(String compId, int start, int end){
        String result = null;
        List<SimpleContract> list = null;
        SimpleContract each = null;
        int x = 0;

        list = contractMapper.getList(compId);
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(result == null)  result = "[";
            if(x > 0)   result += ",";
            result += each.toJson();
        }
        if(result != null)  result += "]";

        return result;
    } // End of getContractList()

    // 계약 수량 가져오기
    public int getContractCount(String compId){
        return contractMapper.getCount(compId);
    }

    public String getContract(int no, String compId){
        String result = null;
        List<HashMap<String, String>> files = null;
        List<Schedule> schedule1 = null;
        List<Schedule> schedule2 = null;
        List<TradeDetail> trades = null;
        List<TaxBill> bills = null;

        files = systemMapper.getAttachedFileList(compId, "contract", no);
        trades = tradeMapper.getTradeDetailForContractXXXXX(no);
        schedule1 = scheduleMapper.getScheduleListFromSchedWithContrct(compId, no);
        schedule2 = scheduleMapper.getScheduleListFromTechdWithContrct(compId, no);
        schedule1.addAll(schedule2);
        Collections.sort(schedule1);
        bills = accMapper.getTaxBillForContract(compId, no);
        Contract cnt = contractMapper.getContract(no, compId);
        result = cnt.toJson(files, schedule1, trades, bills);
        return result;
    } // End of getContract()

    public boolean addContract(Contract contract, String compId){
        int count = -1;
        String sql = null;
        sql = contract.createInsertQuery(null, compId);
        count = executeSqlQuery(sql);
        return count > 0;
    } // End of addProcure()

    public boolean modifyContract(String no, Contract contract, String compId){
        int count = -1;
        String sql = null;
        Contract ogn = null;

        ogn = contractMapper.getContract(strToInt(no), compId);
        sql = ogn.createUpdateQuery(contract, null);
        if(sql != null){
            sql = sql + " WHERE contno = " + no + " AND compno = (SELECT compno FROM swc_company WHERE compid = '" + compId + "')";
            count = executeSqlQuery(sql);
        }
        return count > 0;
    } // End of modifyProcure()

    public boolean removeContract(String no, String compId){
        int count = -1;
        count = contractMapper.removeContract(no, compId);
        return count > 0;
    } // End of removeProcure()

    public String getContract(String compId, int sopp, int customer){
        String result = null;
        String sql = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        Contract cont = null;
        ArrayList<Contract> list = new ArrayList<>();
        int x = 0;

        sql = "SELECT contno AS no, conttype AS salesType, cntrctmth AS contractType, conttitle AS title, soppno AS sopp, IFNULL(buyrno,0) AS endUser, custno AS partner, contamt AS contractAmount, net_profit AS profit, userno AS employee, unix_timestamp(freemaintsdate)*1000 AS startOfFreeMaintenance, unix_timestamp(freemaintedate)*1000 as endOfFreeMaintenance, unix_timestamp(paymaintSdate)*1000 as startOfPaidMaintenance, unix_timestamp(paymaintEdate)*1000 as endOfPaidMaintenance, unix_timestamp(contorddate)*1000 AS saleDate, unix_timestamp(regdatetime)*1000 AS created, unix_timestamp(moddatetime)*1000 AS modified ";
        sql += "FROM swc_cont ";
        sql += "WHERE attrib NOT LIKE 'XXX%' AND compno = (SELECT compno FROM swc_company WHERE compid = '" + compId + "') ";
        if(sopp > 0)        sql += " AND soppno = " + sopp;
        if(customer > 0)    sql += (" AND (buyrno = " + customer + " OR custno = " + customer + ")");
        sql += " ORDER BY regdatetime DESC";

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            while(rs.next()){
                cont = new Contract();
                cont.setNo(rs.getInt("no"));
                cont.setSalesType(rs.getInt("salesType"));
                cont.setContractType(rs.getString("contractType"));
                cont.setTitle(rs.getString("title"));
                cont.setSopp(rs.getInt("sopp"));
                cont.setEndUser(rs.getInt("endUser"));
                cont.setPartner(rs.getInt("partner"));
                cont.setContractAmount(rs.getLong("contractAmount"));
                cont.setProfit(rs.getInt("profit"));
                cont.setEmployee(rs.getInt("employee"));
                cont.setStartOfFreeMaintenance(rs.getLong("startOfFreeMaintenance"));
                cont.setEndOfFreeMaintenance(rs.getLong("endOfFreeMaintenance"));
                cont.setStartOfPaidMaintenance(rs.getLong("startOfPaidMaintenance"));
                cont.setEndOfPaidMaintenance(rs.getLong("endOfPaidMaintenance"));
                cont.setSaleDate(rs.getLong("saleDate"));
                cont.setCreated(rs.getLong("created"));
                cont.setModified(rs.getLong("modified"));
                list.add(cont);
            }
        }catch(SQLException e){e.printStackTrace();}

        result = "[";
        for(x = 0 ; x < list.size() ; x++){
            cont = list.get(x);
            if(x > 0)   result += ",";
            result += cont.toJson();
        }
        result += "]";

        return result;

    } // End of getContract()
    
}
