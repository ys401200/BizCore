package kr.co.bizcore.v1.svc;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Notice;
import kr.co.bizcore.v1.mapper.NoticeMapper;

@Service
public class NoticeSvc extends Svc{
    
    @Autowired
    private NoticeMapper noticeMapper; 

    public List<Notice> getPostList(String compId) {
       return noticeMapper.getNotice(compId);

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
