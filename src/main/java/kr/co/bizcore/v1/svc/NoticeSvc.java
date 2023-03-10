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

    public List<SimpleNotice> getPostList(String compId) {
       return noticeMapper.getNotice(compId);
    }

    public List<SimpleNotice> getPostList(String compId, int start, int end) {
        return noticeMapper.getNoticeWithStartAndEnd(compId, start, end);
    }

    public int getCountt(String compId) {
        return noticeMapper.getNoticeCount(compId);
    }

    public int  delete(String compId, String notiNo) {
        return noticeMapper.delete(compId, notiNo);
    }
   

    public Notice getNotice(String compId, String notiNo) {
        return noticeMapper.getSelectedNotice(compId, notiNo);
    }
   
    public int insertNotice(String compId, String writer, String title, String content) {
        return noticeMapper.insert(compId, writer, title, content);
    }

    public int updateNotice(String title, String content, String compId, String notiNo) {

        return noticeMapper.updateNotice(title, content, compId, notiNo);
    }



}
