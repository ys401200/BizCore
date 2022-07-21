package kr.co.bizcore.v1.svc;

import java.io.File;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Article;
import kr.co.bizcore.v1.domain.SimpleArticle;

@Service
public class BoardService extends Svc{

    public String getFileboxArticalList(String compId){
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
    } // End of getFileboxArticalList(()

    public boolean saveAttachedFile(String compId, String name, byte[] fileData){
        String path = fileStorage.getFileStoragePath(compId) + "/temp";
        File file = null;
        FileOutputStream stream = null;
        
        file = new File(path + "/" + name);
        if(file.exists())   return false;

        try {
            if(!file.createNewFile())   return false;
            stream = new FileOutputStream(file, false);
            stream.write(fileData);
        } catch (Exception e) {e.printStackTrace();}

        return true;
    } // End of saveAttachedFile()

    public void postNewArticle(String compId, Article article, HashMap<String, String> attached){
        String ognName = null;
        String savedName = null;
        String path = null;
        File tempFile = null, targetFile = null;
        Long size = 0L;
        Object[] keyset = null;

        article.setNo(boardMapper.getNewFileboxNo(compId));
        boardMapper.insertNewFileboxArticle(compId, article);
        path = fileStorage.getFileStoragePath(compId);
        if(attached != null){
            keyset = attached.keySet().toArray();
            for(Object key : keyset){
                ognName = (String)key;
                savedName = attached.get(key);
                tempFile = new File(path + "/temp/" + savedName);
                targetFile = new File(path + "/attached/" + savedName);
                if(tempFile.exists()){
                    if(tempFile.renameTo(targetFile)){
                        size = targetFile.length();
                        boardMapper.addFileboxAttachedFile(compId, article.getNo(), ognName, savedName, size);
                    }
                }
            }
        }
        
    } // End of postNewArticle()
    
}
