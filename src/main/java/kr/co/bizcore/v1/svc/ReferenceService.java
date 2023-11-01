package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.NoticeFileData;
import kr.co.bizcore.v1.domain.Reference;
import kr.co.bizcore.v1.domain.SoppFileData;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ReferenceService extends Svc {
    private static final Logger logger = LoggerFactory.getLogger(ReferenceService.class);

    public List<Reference> getReferenceList(Reference reference){
        return referenceMapper.getReferenceList(reference);
    }

    public Reference getReference(String bf_pk){
        Reference reference = null;
        reference = referenceMapper.getReference(bf_pk);
        return reference;
    }

    public int insertReference(Reference reference) {
        return referenceMapper.referenceInsert(reference);
    }

    public int  delete(String bf_pk) {
        return referenceMapper.referenceDelete(bf_pk);
    }

    public int updateReference(Reference reference) {
        return referenceMapper.updateReference(reference);
    }

    public List<NoticeFileData> getNoticeFileData(String bf_pk){
        return referenceMapper.getNoticeFileData(bf_pk);
    }

    public NoticeFileData downloadFile(NoticeFileData noticeFileData) {
		return referenceMapper.downloadFile(noticeFileData);
	}

    public int referenceFileInsert(NoticeFileData noticeFileData){
        return referenceMapper.referenceFileInsert(noticeFileData);
    }

    public int  referenceFileDelete(String FileId) {
        return referenceMapper.referenceFileDelete(FileId);
    }
}
