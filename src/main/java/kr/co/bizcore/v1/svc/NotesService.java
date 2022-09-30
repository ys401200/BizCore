package kr.co.bizcore.v1.svc;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotesService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(NotesService.class);

    // 신규 메시지 카운트
    public String getNewCount(String compId, String userNo){
        String result = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = notesMapper.getNewCount(compId, userNo);
        result = "{";
        if(list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(x > 0)   result += ",";
            result += ("\"" + each.get("writer") + "\":" + each.get("ct"));
        }
        result += "}";

        return result;
    } // End of getNewCount()

    // 특정 상대방과의 대화 내용을 가져오는 메서드
    public String getMessage(String compId, String userNo, int writer, long time){
        String result = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        String t = null;
        int x = 0;
        logger.error("||||||||||||||||||||||||||||||||||||||||||||||||| compId : " + compId);
        logger.error("||||||||||||||||||||||||||||||||||||||||||||||||| userNo : " + userNo);
        logger.error("||||||||||||||||||||||||||||||||||||||||||||||||| writer : " + writer);
        logger.error("||||||||||||||||||||||||||||||||||||||||||||||||| time : " + (new Date(time)));
        list = notesMapper.getMessage(compId, writer, userNo, new Date(time));
        logger.error("||||||||||||||||||||||||||||||||||||||||||||||||| Size of list : " + list.size());
        if(list.size() > 0){
            result = "[";
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   result += ",";
                result += ("{\"writer\":" + each.get("writer") + ",");
                result += ("\"sent\":" + each.get("sent") + ",");
                result += ("\"read\":" + each.get("read") + ",");
                result += ("\"msg\":\"" + each.get("message") + "\",");
                result += ("\"related\":" + each.get("read") + "}");
            }
            result += "]";
            notesMapper.setReadStatus(compId, writer, userNo, new Date(time));
        }

        return result;
    } // End of getMessage()

    // 특정 상대방과의 대화 내용을 가져오는 메서드
    public String getNewMessage(String compId, String userNo, int writer){
        String result = null;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        String t = null;
        int x = 0;

        list = notesMapper.getNewMessage(compId, writer, userNo);
        if(list.size() > 0){
            result = "[";
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   result += ",";     
                
                result += ("{\"writer\":" + writer + ",");
                result += ("\"sent\":" + each.get("sent") + ",");
                result += ("\"read\":null,");
                result += ("\"msg\":\"" + each.get("message") + "\",");
                result += ("\"related\":" + each.get("read") + "}");
            }
            result += "]";
            notesMapper.setReadStatus(compId, writer, userNo, new Date(System.currentTimeMillis()));            
        }

        return result;
    } // End of getMessage()

    // 새로운 쪽지를 전달하는 메서드
    public boolean sendNewNotes(String compId, int writer, int reader, String message, String related){
        int no = -1, count = -1;
        no = getNextNumberFromDB(compId, "bizcore.notes");
        count = notesMapper.addNewNotes(compId, no, writer, reader, message, related);
        return count > 0;
    }
    
}
