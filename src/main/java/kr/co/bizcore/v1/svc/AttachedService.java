package kr.co.bizcore.v1.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AttachedService extends Svc{

    private static final Logger logger = LoggerFactory.getLogger(AttachedService.class);

    // 첨부파일의 요청에 대한 응담을 처리하는 메서드
    public byte[] getAttachedFileData(String compId, String funcName, int funcNo, String fileName){
        byte[] result = null;
        String sql = "";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        FileInputStream fis = null;
        String rootPath = null, path = null, savedName = null, s = File.separator;
        File file = null;

        rootPath = fileStoragePath + s + compId;
        savedName = systemMapper.getAttachedFileName(compId, funcName, funcNo, fileName);
        if(savedName == null)   return result;

        path = rootPath + s + funcName + s + funcNo + s + savedName;
        file = new File(path);
        if(!file.exists())  return result;

            try {
                fis = new FileInputStream(file);
                result = fis.readAllBytes();
                fis.close();
            } catch (Exception e) {e.printStackTrace();}

        return result;
    }

    public boolean saveAttachedFileToTemp(String compId, String savedName, byte[] fileData) {
        boolean result = false;
        FileOutputStream fos = null;
        String path = null, s = File.separator;
        File file = null;

        path = fileStoragePath + s + compId + s + "temp" + s + savedName;
        file = new File(path);

        try{
            fos = new FileOutputStream(file);
            fos.write(fileData);
            result = true;
        }catch(IOException e){e.printStackTrace();}

        return result;
    }

    public boolean saveAttachedFile(String compId, String fileName, String savedName, byte[] fileData, String funcName, int funcNo) {
        boolean result = false;
        FileOutputStream fos = null;
        String path = null, s = File.separator;
        File file = null;
        int v = 0;

        try{
            path = fileStoragePath + s + compId + s + funcName + s + funcNo;
            file = new File(path);
            if(!file.exists())  file.mkdirs();
            file = new File(path + s + savedName);
            fos = new FileOutputStream(file);
            v = systemMapper.setAttachedFileData(compId, funcName, funcNo, fileName, savedName, fileData.length);
            if(v > 0){
                fos.write(fileData);
                fos.close();
                result = v > 0;
            }
        }catch(IOException e){e.printStackTrace();}

        return result;
    }

    public int deleteAttachedFile(String compId, String funcName, int no, String fileName) {
        String rootPath = null, path = null, savedName = null, s = File.separator;
        File file = null;

        rootPath = fileStoragePath + s + compId;
        savedName = systemMapper.getAttachedFileName(compId, funcName, no, fileName);

        path = rootPath + s + funcName + s + no + s + savedName;
        file = new File(path);
        if(!file.exists())      return -2;
        else if(file.delete())  return 0;
        else                    return -1;
    }
    
}
