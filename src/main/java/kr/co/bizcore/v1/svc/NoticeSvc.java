package kr.co.bizcore.v1.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Notice;
import kr.co.bizcore.v1.domain.SimpleNotice;
import kr.co.bizcore.v1.mapper.NoticeMapper;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NoticeSvc extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(NoticeSvc.class);
    
    @Autowired
    private NoticeMapper noticeMapper; 

    public List<SimpleNotice> getPostList(int compNo) {
       return noticeMapper.getNotice(compNo);
    }

    public List<SimpleNotice> getPostList(String compId, int start, int end) {
        return noticeMapper.getNoticeWithStartAndEnd(compId, start, end);
    }

    public int getCountt(String compId) {
        return noticeMapper.getNoticeCount(compId);
    }

    public int  delete(int compNo, String noticeNo) {
        return noticeMapper.delete(compNo, noticeNo);
    }
   

    public Notice getNotice(int compNo, String noticeNo) {
        return noticeMapper.getSelectedNotice(compNo, noticeNo);
    }
   
    public int insertNotice(int compNo, String userNo, String noticeTitle, String noticeContents) {
        return noticeMapper.insert(compNo, userNo, noticeTitle, noticeContents);
    }

    public int updateNotice(String noticeTitle, String noticeContents, int compNo, String noticeNo) {
        return noticeMapper.updateNotice(noticeTitle, noticeContents, compNo, noticeNo);
    }



}
