package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Procure;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProcureService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(ProcureService.class);
    public String getProcureList(String compId){
        String result = null;
        List<Procure> list = null;
        Procure each = null;
        int x = 0;

        list = procureMapper.getList(compId);
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(result == null)  result = "[";
            if(x > 0)   result += ",";
            result += each.toJson();
        }
        if(result != null)  result += "]";

        return result;
    } // End of getProcureList()

    public Procure getProcure(String no, String compId){
        Procure result = null;
        result = procureMapper.getProcure(no, compId);
        return result;
    } // End of getProcure()

    public boolean addProcure(Procure procure, String compId){
        int count = -1;
        String sql = null;
        sql = procure.createInsertQuery(null, compId);
        if(sql != null) count = executeSqlQuery(sql);
        return count > 0;
    } // End of addProcure()

    public boolean modifyProcure(String no, Procure procure, String compId){
        int count = -1;
        String sql = null;
        Procure ogn = null;

        ogn = getProcure(no, compId);
        sql = ogn.createUpdateQuery(procure, null);
        if(sql != null){
            sql = sql + " WHERE ppsid = " + no + " AND compno = (SELECT compno FROM swc_company WHERE compid = '" + compId + "')";
            count = executeSqlQuery(sql);
        }
        return count > 0;
    } // End of modifyProcure()

    public boolean removeProcure(String no, String compId){
        int count = -1;
        count = procureMapper.removeProcure(no, compId);
        return count > 0;
    } // End of removeProcure()
    
}
