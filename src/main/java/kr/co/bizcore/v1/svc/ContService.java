package kr.co.bizcore.v1.svc;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Cont;
import kr.co.bizcore.v1.domain.ContFileData;
import kr.co.bizcore.v1.domain.Inout;
import kr.co.bizcore.v1.domain.Sopp;
import kr.co.bizcore.v1.domain.SoppFileData;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ContService extends Svc{
    private static final Logger logger = LoggerFactory.getLogger(ContService.class);
    
    public List<Cont> getContList(Cont cont){
        return contMapper.getContList(cont);
    }

    public Cont getCont(int compNo, String soppNo){
        Cont cont = null;
        cont = contMapper.getCont(soppNo, compNo);
        return cont;
    }

    public int insertCont(Cont cont) {
        return contMapper.contInsert(cont);
    }

    public int  delete(int compNo, String contNo) {
        return contMapper.contDelete(compNo, contNo);
    }

    public int updateCont(Cont cont) {
        return contMapper.updateCont(cont);
    }

    public List<Inout> getContInoutList(Inout inout){
        return contMapper.getContInoutList(inout);
    }

    public int contInoutSingleInsert(Inout inout){
        return contMapper.contInoutSingleInsert(inout);
    }

    public int  contInoutCheckDelete(String soppdataNo) {
        return contMapper.contInoutCheckDelete(soppdataNo);
    }

    public int contInoutDivisionInsert(Inout inout){
        return contMapper.contInoutDivisionInsert(inout);
    }
    public int contInoutUpdate(Inout inout) {
        return contMapper.contInoutUpdate(inout);
    }

    public List<ContFileData> getContFileList(ContFileData contFileData){
        return contMapper.getContFileList(contFileData);
    }

    public int contFileInsert(ContFileData contFileData){
        return contMapper.contFileInsert(contFileData);
    }

    public ContFileData downloadFile(ContFileData contFileData) {
		return contMapper.downloadFile(contFileData);
	}

    public int  contFileDelete(String FileId) {
        return contMapper.contFileDelete(FileId);
    }

    public List<Cont> calMonthTotal(Cont cont){
        LocalDate nowDate = LocalDate.now();
        int getYear = nowDate.getYear();
        return contMapper.calMonthTotal(cont, getYear);
    }

    public List<Cont> calContTypeTotal(Cont cont){
        LocalDate nowDate = LocalDate.now();
        int getYear = nowDate.getYear();
        return contMapper.calContTypeTotal(cont, getYear);
    }

    public List<Cont> calContractTypeTotal(Cont cont){
        LocalDate nowDate = LocalDate.now();
        int getYear = nowDate.getYear();
        return contMapper.calContractTypeTotal(cont, getYear);
    }
}
