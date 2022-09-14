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
import java.util.HashMap;
import java.util.List;

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

    // 업로드된 파일을 저장하는 메서드. 동일 파일명이 존재하는 경우 기 존재 파일을 삭제처리 후 저장하도록 함
    public boolean saveAttachedFile(String compId, String fileName, String savedName, byte[] fileData, String funcName, int funcNo) {
        boolean result = false;
        FileOutputStream fos = null;
        String path = null, s = File.separator, existName = null;
        File file = null;
        int v = 0;

        existName = systemMapper.getAttachedFileName(compId, funcName, funcNo, fileName);
        if(existName != null){
            path = fileStoragePath + s + compId + s + funcName + s + funcNo + s + existName;
            file = new File(path);
            if(file.exists())   file.delete();
            systemMapper.deleteAttachedFile(compId, funcName, funcNo, fileName);
        }

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

    // 업로드된 파일을 임시 저장하는 메서드. 전자결재와 자료실 등 본문이 저장되기 전 파일이 먼저 업로드되는 경우 사용
    public String saveAttachedToTemp(String compId, byte[] fileData) {
        FileOutputStream fos = null;
        String path = null, s = File.separator, savedName = null;
        File file = null;
        int v = 0;

        while(true){
            savedName = createRandomFileName();
            path = fileStoragePath + s + compId + s + "temp" + s + savedName;
            file = new File(path);
            if(!file.exists())  break;
        }

        try{
            fos = new FileOutputStream(file);
            fos.write(fileData);
            fos.close();
        }catch(IOException e){e.printStackTrace();}

        return savedName;
    }

    public int deleteAttachedFile(String compId, String funcName, int no, String fileName) {
        String rootPath = null, path = null, savedName = null, s = File.separator;
        File file = null;

        rootPath = fileStoragePath + s + compId;
        savedName = systemMapper.getAttachedFileName(compId, funcName, no, fileName);

        path = rootPath + s + funcName + s + no + s + savedName;
        file = new File(path);
        if(!file.exists())      return -2;
        else if(file.delete()){
            systemMapper.deleteAttachedFile(compId, funcName, no, fileName);
            return 0;
        }else                    return -1;
    }

    public String getAttachedFileList(String compId, String funcName, int funcNo) {
        String result = "[";
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;
        int x = 0;

        list = systemMapper.getAttachedFileList(compId, funcName, funcNo);
        for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(x > 0)   result += ",";
            result += ("{\"fileName\":\"" + each.get("fileName") + "\",");
            result += ("\"size\":" + each.get("size") + ",");
            result += ("\"removed\":" + !each.get("removed").equals("0") + "}");
        }
        result += "]";

        return result;
    }
    
}
