package kr.co.bizcore.v1.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
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
    
}
