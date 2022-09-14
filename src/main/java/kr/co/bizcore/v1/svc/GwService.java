package kr.co.bizcore.v1.svc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.DocForm;
import kr.co.bizcore.v1.mapper.GwMapper;

@Service
public class GwService extends Svc{

    public String getForms(){
        String result = null;
        List<DocForm> list = null;
        DocForm form = null;
        int x = 0;

        list = gwFormMapper.getFormList();
        for(x = 0 ; x < list.size() ; x++){
            if(x == 0)  result = "[";
            else        result += ",";
            result += list.get(x).toJson();
        }
        if(result != null)  result += "]";
        return result;
    }

    public String getForm(String docId){
        String result = null;
        DocForm form = null;
        form = gwFormMapper.getForm(docId);
        result = form.toJson();
        return result;
    }

    public int addAppDoc(String compId, String dept, String title, String userNo, String sopp, String customer, String readable, String appDoc, String[] files, HashMap<String, String> attached, String[][] appLine) {
        int result = -9999;
        int year = -1, x = -1, read = 0;
        String docNo = null, str = null, savedName = null, rootPath = fileStoragePath, s = File.separator, appData = null;;
        String[] line = null;
        File source = null, target = null;
        Long size = 0L;
        FileInputStream fin = null;
        FileOutputStream fout = null;
        byte[] buffer = new byte[1024];

        year = Calendar.getInstance().get(Calendar.YEAR);
        str = dept + "_" + year + "_";
        docNo = str + gwMapper.getNextDocNo(compId, str + "%");
        result = getNextNumberFromDB(compId, "bizcore.doc_app");

        // 문서 헤더정보 DB입력
        if(gwMapper.addNewDocHeader(result, compId, docNo, userNo, dept, title) < 1)    return -10; // 헤더정보 입력 실패

        // 첨부파일에 대한 처리
        rootPath = rootPath + s + compId;
        if(files != null && files.length > 0)   for(x = 0 ; x < files.length ; x++){
            str = files[x];
            savedName = attached.get(str);
            source = new File(rootPath + s + "temp" + s + savedName);
            target = new File(rootPath + s + "appDoc" + s + savedName);
            if(savedName != null && source.exists()){
                if(source.renameTo(target)){ // 1차 : renameTo()로 간단히 이동 시도
                    systemMapper.setAttachedFileData(compId, "docapp", result, str, savedName, target.length());
                }else{  // 실패시 2차 시도 : 파일 읽어서 이동 후 임시 파일 삭제
                    try {
                        fin = new FileInputStream(source);
                        fout = new FileOutputStream(target);
                        read = 0;
                        while((read = fin.read(buffer, 0, buffer.length)) != -1){
                            fout.write(buffer, 0, read);
                        }
                        fin.close();
                        fout.flush();
                        fout.close();
                        source.delete();
                        systemMapper.setAttachedFileData(compId, "docapp", result, str, savedName, target.length());
                    } catch (Exception e) {e.printStackTrace();}
                }
            }
        }

        // 결재선에 대한 처리
        appData = "{\"sopp\":\"" + sopp + "\",\"customer\":\"" + customer + "\"}";
        if(appLine != null && appLine.length > 0)   for(x = 0 ; x < appLine.length ; x++){
            line = appLine[x];
            if(x == 0)  gwMapper.addNewDocAppLine(compId, docNo, x, line[1], line[0], appDoc, appData);
            else        gwMapper.addNewDocAppLine(compId, docNo, x, line[1], line[0], null, null);
        }        
        
        return result;
    }
    
}
