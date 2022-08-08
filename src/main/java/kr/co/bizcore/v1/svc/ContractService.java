package kr.co.bizcore.v1.svc;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import kr.co.bizcore.v1.domain.Contract;
import kr.co.bizcore.v1.domain.SimpleContract;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import org.slf4j.Logger;

@Service
@Slf4j
public class ContractService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ContractService.class);
    
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
    } // End of getProcureList()

    public Contract getContract(int no, String compId){
        Contract result = null;
        result = contractMapper.getContract(no, compId);
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

        ogn = getContract(strToInt(no), compId);
        sql = ogn.createUpdateQuery(contract, null);
        if(sql != null){
            sql = sql + " WHERE compno = (SELECT compno FROM swc_company WHERE compid = '" + compId + "')";
            count = executeSqlQuery(sql);
        }
        return count > 0;
    } // End of modifyProcure()

    public boolean removeContract(String no, String compId){
        int count = -1;
        count = contractMapper.removeContract(no, compId);
        return count > 0;
    } // End of removeProcure()
    
}
