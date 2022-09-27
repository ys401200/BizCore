package kr.co.bizcore.v1.svc;

import org.springframework.stereotype.Service;

@Service
public class NotesService extends Svc{

    // 새로운 쪽지를 전달하는 메서드
    public boolean sendNewNotes(String compId, int writer, int reader, String message, String related){
        int no = -1, count = -1;
        no = getNextNumberFromDB(compId, "bizcore.notes");
        count = notesMapper.addNewNotes(compId, no, writer, reader, message, related);
        return count > 0;
    }
    
}
