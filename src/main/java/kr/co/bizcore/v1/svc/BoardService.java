package kr.co.bizcore.v1.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Article;
import kr.co.bizcore.v1.domain.AttachedFile;
import kr.co.bizcore.v1.domain.SimpleArticle;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BoardService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(BoardService.class);

    public String getFileboxArticleList(String compId){
        String result = null;
        List<SimpleArticle> list = null;
        SimpleArticle each = null; 
        int x = 0;

        list = boardMapper.getFileboxList(compId);

        if(list != null && list.size() > 0){
            result = "{";
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   result += ",";
                result += ("\"" + each.getNo() + "\":");
                result += each.toJson();
            }
            result += "}";
        }

        return result;
    } // End of getFileboxArticalList()

    public Article getFileboxArticle(String compId, int articleNo){
        Article result = null;
        List<AttachedFile> fileList = null;
        int x = 0;

        result = boardMapper.getFileboxArticle(articleNo, compId);
        fileList = boardMapper.getAttachedFileList(articleNo, compId);

        if(result != null && fileList != null){
            for(x = 0 ; x < fileList.size() ; x++)  result.addAttachedFile(fileList.get(x));
        }
        return result;
    }

    public boolean saveAttachedFile(String compId, String name, byte[] fileData){
        String path = fileStoragePath + "/" + compId + "/temp";
        File file = null;
        FileOutputStream stream = null;
        
        file = new File(path + "/" + name);
        if(file.exists())   return false;

        try {
            if(!file.createNewFile())   return false;
            stream = new FileOutputStream(file, false);
            stream.write(fileData);
            stream.flush();
            stream.close();
        } catch (Exception e) {e.printStackTrace();}

        return true;
    } // End of saveAttachedFile()

    public int postNewArticle(String compId, Article article, List<Object> files, HashMap<String, String> attached){
        String ognName = null;
        String savedName = null;
        String path = null;
        File tempFile = null, targetFile = null;
        Long size = 0L;
        Object[] keyset = null;
        int result = 0, read = 0;
        FileInputStream fin = null;
        FileOutputStream fout = null;
        byte[] buffer = new byte[1024];

        // 신규 게시글 DB에 저장
        article.setNo(boardMapper.getNewFileboxNo(compId)); // 글 번호 지정
        boardMapper.insertNewFileboxArticle(compId, article); // DB 저장
        path = fileStorage.getFileStoragePath(compId); // company id 에 해당하는 경로 가져오기
        if(attached != null){

            // 저장된 파일에 대해 map에서 제거하고 DB저장, 파일을 temp에서 attached로 이동
            for(Object each : files){
                ognName = (String)each;
                savedName = attached.get(ognName);
                attached.remove(ognName);
                tempFile = new File(path + "/temp/" + savedName);
                targetFile = new File(path + "/attached/" + savedName);
                if(tempFile.exists()){ //파일이 존재하는지 먼저 검증
                    if(tempFile.renameTo(targetFile)){ // 1차 : renameTo()로 간단히 이동 시도
                        result++;
                    }else{  // 실패시 2차 시도 : 파일 읽어서 이동 후 임시 파일 삭제
                        try {
                            fin = new FileInputStream(tempFile);
                            fout = new FileOutputStream(targetFile);
                            read = 0;
                            while((read = fin.read(buffer, 0, buffer.length)) != -1){
                                fout.write(buffer, 0, read);
                            }
                            fin.close();
                            fout.flush();
                            fout.close();
                            tempFile.delete();
                            result++;
                        } catch (Exception e) {e.printStackTrace();}
                    }
                }
            }

            // map에서 제거되지 않은, 즉, 업로드 후 삭제처리한 파일들에 대한 정리
            keyset = attached.keySet().toArray();
            for(Object key : keyset){
                savedName = attached.get(key);
                tempFile = new File(path + "/temp/" + savedName);
                tempFile.delete();
            }
        }
        return result;
    } // End of postNewArticle()
    
}