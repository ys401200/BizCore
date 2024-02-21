package kr.co.bizcore.v1.svc;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Unpaid;
import kr.co.bizcore.v1.domain.UnpaidTarget;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UnpaidService extends Svc {

    private static final Logger logger = LoggerFactory.getLogger(UnpaidService.class);

    public List<Unpaid> getUnpaidList(Unpaid unpaid, int compNo, String selectYear) {
        LocalDate now = LocalDate.now();
        if (unpaid.getToDate() == null) {
            unpaid.setFromDate(now.getYear() + "-01-01");
            unpaid.setToDate(now.getYear() + "-12-31");
        }

        return unpaidMapper.getUnpaidList(unpaid, unpaid.getCompNo(), Integer.toString(now.getYear()),
                now.getYear() + "-01-01", now.getYear() + "-12-31");
    } // End of getUnpaidList()

    public Unpaid getUnpaid(int compNo, String unpaidNo) {
        Unpaid unpaid = null;
        unpaid = unpaidMapper.getUnpaid(unpaidNo, compNo);
        return unpaid;
    } // End of getUnpaid();

    // public int insertUnpaid(Unpaid unpaid) {
    // return unpaidMapper.unpaidInsert(unpaid);
    // }

    // public int delete(int compNo, String unpaidNo) {
    // return unpaidMapper.unpaidDelete(compNo, unpaidNo);
    // }

    // public int updateUnpaid(Unpaid unpaid) {
    // return unpaidMapper.updateUnpaid(unpaid);
    // }

    // public List<UnpaidTarget> getGoalList(UnpaidTarget unpaidTarget) {
    // LocalDate nowDate = LocalDate.now();
    // int getYear = nowDate.getYear();
    // return unpaidMapper.getGoalList(unpaidTarget, getYear);
    // }

    // public int goalInsert(UnpaidTarget unpaidTarget) {
    // return unpaidMapper.goalInsert(unpaidTarget);
    // }

    // public int goalUpdate(UnpaidTarget unpaidTarget) {
    // return unpaidMapper.goalUpdate(unpaidTarget);
    // }

    // public boolean modifyUnpaid(String unpaidNo, Unpaid unpaid, int compNo){
    // int x = -1;
    // Unpaid ogn = null;
    // String sql = null;

    // ogn = getUnpaid(compNo, unpaidNo);
    // sql = ogn.createUpdateQuery(unpaid, null);
    // sql = sql + " WHERE unpaidno = " + unpaidNo + " AND compno = (SELECT compno
    // FROM swc_company WHERE compNo = '" + compNo + "')";
    // x = executeSqlQuery(sql);
    // return x > 0;
    // }

    // public boolean removeUnpaid(String no, String compId){
    // int x = -1;
    // x = unpaidMapper.removeUnpaid(no, compId);
    // return x > 0;
    // }

}
