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

    public String getContract(int no, String compId){
        String result = null;
        Contract each = null;

        each = contractMapper.getContract(no, compId);
        result = each == null ? null : each.toJson();

        return result;
    } // End of getProcure()

    public boolean addContract(Contract contract, String compId){
        int count = -1;
        count = contractMapper.addContract(compId, contract);
        return count > 0;
    } // End of addProcure()

    public boolean modifyContract(Contract contract, String compId){
        int count = -1;
        count = contractMapper.modifyContract(compId, contract);
        return count > 0;
    } // End of modifyProcure()

    public boolean removeContract(String no, String compId){
        int count = -1;
        count = contractMapper.removeContract(no, compId);
        return count > 0;
    } // End of removeProcure()
    
}
