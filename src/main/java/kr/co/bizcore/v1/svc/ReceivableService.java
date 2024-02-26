package kr.co.bizcore.v1.svc;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Receivable;
import kr.co.bizcore.v1.domain.ReceivableSub;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ReceivableService extends Svc {

    private static final Logger logger = LoggerFactory.getLogger(ReceivableService.class);

    public List<Receivable> getReceivableList(Receivable receivable, int compNo, String selectYear) {
        LocalDate now = LocalDate.now();
        if (selectYear == null) {
            selectYear = Integer.toString(now.getYear());
        }
        if (receivable.getVatIssueDateTo() == null) {
            receivable.setVatIssueDateFrom(selectYear + "-01-01 00:00:00.000");
            receivable.setVatIssueDateTo(selectYear + "-12-31 23:59:59.999");
        }

        return receivableMapper.getReceivableList(receivable.getCompNo(), selectYear,
                receivable.getVatIssueDateFrom(), receivable.getVatIssueDateTo());
    } // End of getReceivableList()

    public List<ReceivableSub> getReceivableSub(String selectYear) {
        LocalDate now = LocalDate.now();
        if (selectYear == null) {
            selectYear = Integer.toString(now.getYear());
        }
        return receivableMapper.getReceivableSub(selectYear);
    } // End of getReceivableList()

}
