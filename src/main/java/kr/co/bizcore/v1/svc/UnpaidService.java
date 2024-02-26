package kr.co.bizcore.v1.svc;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Unpaid;
import kr.co.bizcore.v1.domain.UnpaidSub;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UnpaidService extends Svc {

    private static final Logger logger = LoggerFactory.getLogger(UnpaidService.class);

    public List<Unpaid> getUnpaidList(Unpaid unpaid, int compNo, String selectYear) {
        LocalDate now = LocalDate.now();
        if (selectYear == null) {
            selectYear = Integer.toString(now.getYear());
        }
        if (unpaid.getVatIssueDateTo() == null) {
            unpaid.setVatIssueDateFrom(selectYear + "-01-01 00:00:00.000");
            unpaid.setVatIssueDateTo(selectYear + "-12-31 23:59:59.999");
        }

        return unpaidMapper.getUnpaidList(unpaid.getCompNo(), selectYear,
                unpaid.getVatIssueDateFrom(), unpaid.getVatIssueDateTo());
    } // End of getUnpaidList()

    public List<UnpaidSub> getUnpaidSub(String selectYear) {
        LocalDate now = LocalDate.now();
        if (selectYear == null) {
            selectYear = Integer.toString(now.getYear());
        }
        return unpaidMapper.getUnpaidSub(selectYear);
    } // End of getUnpaidList()

}
