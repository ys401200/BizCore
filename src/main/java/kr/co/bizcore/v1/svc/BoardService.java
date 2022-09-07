package kr.co.bizcore.v1.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
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
            result = "[";
            for(x = 0 ; x < list.size() ; x++){
                each = list.get(x);
                if(x > 0)   result += ",";
                result += each.toJson();
            }
            result += "]";
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
        String s = File.separator, path = null;
        File file = null;
        FileOutputStream stream = null;

        path = this.fileStoragePath + s + compId + s + "temp";
        
        file = new File(path + s + name);
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
        String path = null, s = File.separator;
        File tempFile = null, targetFile = null;
        Long size = 0L;
        Object[] keyset = null;
        AttachedFile attachedFile = null;
        int result = 0, read = 0;
        FileInputStream fin = null;
        FileOutputStream fout = null;
        byte[] buffer = new byte[1024];

        // 신규 게시글 DB에 저장
        article.setNo(boardMapper.getNewFileboxNo(compId)); // 글 번호 지정
        boardMapper.insertNewFileboxArticle(compId, article); // DB 저장
        path = fileStoragePath + s + compId; // company id 에 해당하는 경로 가져오기
        if(attached != null){

            // 저장된 파일에 대해 map에서 제거하고 DB저장, 파일을 temp에서 attached로 이동
            for(Object each : files){
                ognName = (String)each;
                savedName = attached.get(ognName);
                attached.remove(ognName);
                tempFile = new File(path + s + "temp" + s + savedName);
                targetFile = new File(path + s + "attached" + s + savedName);
                if(tempFile.exists()){ //파일이 존재하는지 먼저 검증
                    if(tempFile.renameTo(targetFile)){ // 1차 : renameTo()로 간단히 이동 시도
                        result++;

                        attachedFile = new AttachedFile();
                        attachedFile.setArticleNo(article.getNo());
                        attachedFile.setOgnName(ognName);
                        attachedFile.setSavedName(savedName);
                        attachedFile.setSize(targetFile.length());
                        boardMapper.addAttachedFile(compId, attachedFile);
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

                            attachedFile = new AttachedFile();
                            attachedFile.setArticleNo(article.getNo());
                            attachedFile.setOgnName(ognName);
                            attachedFile.setSavedName(savedName);
                            attachedFile.setSize(targetFile.length());
                            boardMapper.addAttachedFile(compId, attachedFile);
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

    // 자료실 게시글 삭제
    public boolean deleteFileboxArticle(String no, String compId){
        boolean result = false;
        List<AttachedFile> fileList = null;
        AttachedFile eachItem = null;
        String path = null, s = File.separator;
        int x = 0;
        File eachFile = null;

        path = fileStoragePath + s + compId; // company id 에 해당하는 경로 가져오기
        fileList = boardMapper.getAttachedFileList(strToInt(no), compId);
        for(x = 0 ; x < fileList.size() ; x++){
            eachItem = fileList.get(x);
            eachFile = new File(path + s + "attached" + s + eachItem.getSavedName());
            if(eachFile.exists())   eachFile.delete();
            boardMapper.deleteFileboxAttachedFile(no, compId, eachItem.getSavedName());
        }
        boardMapper.deleteFileboxArticle(no, compId);
        result = true;
        return result;
    }

    // 자료실 게시글 업데이트
    public void updateFileboxArticle(String compId, Article article, List<Object> addFiles, List<Object> removeFiles, HashMap<String, String> attached){
        String ognName = null;
        String savedName = null;
        String path = null, s = File.separator;
        File tempFile = null, targetFile = null;
        Long size = 0L;
        List<AttachedFile> fileList = null;
        AttachedFile eachFile = null;
        Object[] keyset = null;
        int result = 0, read = 0, x = 0;
        FileInputStream fin = null;
        FileOutputStream fout = null;
        byte[] buffer = new byte[1024];

        // 게시글 DB 업데이트
        boardMapper.updateFileboxArticle(article, compId);
        path = fileStoragePath + s + compId + s + "attached"; // company id 에 해당하는 경로 가져오기

        // 삭제 파일 처리
        if(removeFiles != null && removeFiles.size() > 0){
            fileList = boardMapper.getAttachedFileList(article.getNo(), compId); // 기존 첨부된파일을 가지고 옴
            if(fileList != null && fileList.size() > 0) for(x = 0 ; x < fileList.size() ; x++){
                savedName = fileList.get(x).getSavedName();
                ognName = fileList.get(x).getOgnName();
                for(Object obj : removeFiles){
                    if(ognName != null && ognName.equals(obj)){
                        targetFile = new File(path + s + fileList.get(x).getSavedName());
                        if(targetFile.exists()) targetFile.delete();
                        boardMapper.deleteFileboxAttachedFile(article.getNo() + "", compId, savedName);
                    }
                }
            }
        }
        
        // 첨부 파일 처리
        path = fileStoragePath + s + compId;
        if(attached != null){

            // 저장된 파일에 대해 map에서 제거하고 DB저장, 파일을 temp에서 attached로 이동
            for(Object each : addFiles){
                ognName = (String)each;
                savedName = attached.get(ognName);
                attached.remove(ognName);
                tempFile = new File(path + s + "temp" + s + savedName);
                targetFile = new File(path + s + "attached" + s + savedName);
                if(tempFile.exists()){ //파일이 존재하는지 먼저 검증
                    if(tempFile.renameTo(targetFile)){ // 1차 : renameTo()로 간단히 이동 시도
                        result++;

                        eachFile = new AttachedFile();
                        eachFile.setArticleNo(article.getNo());
                        eachFile.setOgnName(ognName);
                        eachFile.setSavedName(savedName);
                        eachFile.setSize(targetFile.length());
                        boardMapper.addAttachedFile(compId, eachFile);
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

                            eachFile = new AttachedFile();
                            eachFile.setArticleNo(article.getNo());
                            eachFile.setOgnName(ognName);
                            eachFile.setSavedName(savedName);
                            eachFile.setSize(targetFile.length());
                            boardMapper.addAttachedFile(compId, eachFile);
                        } catch (Exception e) {e.printStackTrace();}
                    }
                }
            }

            // map에서 제거되지 않은, 즉, 업로드 후 삭제처리한 파일들에 대한 정리
            keyset = attached.keySet().toArray();
            for(Object key : keyset){
                savedName = attached.get(key);
                tempFile = new File(path + s + "temp" + s + savedName);
                tempFile.delete();
            }
        }
    } // End of updateFileboxArticle()

    // 첨부파일 다운로드 처리 메서드
    public byte[] getFileboxAttachedFile(String no, String fileName, String compId){
        byte[] result = null;
        String path = null, s = File.separator, savedName = null;
        File file = null;
        FileInputStream fis = null;

        path = fileStoragePath + s + compId; // company id 에 해당하는 경로 가져오기
        savedName = boardMapper.getFileboxSavedFileName(compId, no, fileName);
        if(savedName == null)   return result;
        file = new File(path + s + "attached" + s + savedName);
        if(!file.exists())  return result;

        try{
            fis = new FileInputStream(file);
            result = fis.readAllBytes();
            fis.close();
        }catch(IOException e){e.printStackTrace();}finally{
            try{if(fis != null) fis.close();}catch(IOException e){e.printStackTrace();}
        }

        return result;
    }
    
}
