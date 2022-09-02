package kr.co.bizcore.v1.svc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kr.co.bizcore.v1.domain.CommonCode;
import kr.co.bizcore.v1.domain.ConnUrl;
import kr.co.bizcore.v1.domain.SimpleCustomer;
import kr.co.bizcore.v1.domain.User;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SystemService extends Svc {

    private static final Logger logger = LoggerFactory.getLogger(SystemService.class);

    public String test() {
        String result = systemMapper.test();
        return result;
    } // End of test()

    public String getConnUrl() {
        List<ConnUrl> data = null;
        String result = null;
        data = systemMapper.getConnUrl();

        for (ConnUrl each : data) {
            result = each.getConnAddr() + " / " + each.getCompId();
            System.out.println(result);
        }
        return result;
    } // End of getConnUrl()

    // 클라이언트가 접속한 서버 url을 입력받아서 compId를 반환하는 메서드
    public String findCompIdFromConnUrl(String server) {
        List<ConnUrl> urls = null;
        String result = null, t = null;
        ConnUrl each = null;
        int x = 0;

        urls = (List<ConnUrl>)dataFactory.getData("ALL", "connUrl");
        if(urls == null){
            urls = systemMapper.getConnUrl();
            dataFactory.setData("ALL", "connUrl", urls, 300);
        }

        if (urls != null && urls.size() > 0)
            for (x = 0; x < urls.size(); x++) {
                each = urls.get(x);
                t = each.getConnAddr();
                if (t.substring(0, 1).equals("*")) { // 첫 글자가 와인드카드인 경우
                    if (t.contains(server)) {
                        result = each.getCompId();
                        break;
                    }
                } else { // 와일드카드가 아닌 경우
                    if (t.equals(server)) {
                        result = each.getCompId();
                        break;
                    }
                }
            }

        return result;
    } // End oif findCompIdFromConnUrl()

    // 고객사 정보를 전달하는 메서드
    public String getCustomers(String compId){
        String result = null;
        SimpleCustomer each = null;
        List<SimpleCustomer> list = null;
        int x = 0;

        list = commonMapper.getCustomerList(compId);

        if(list != null && list.size() > 0){
            for(x = 0 ; x < list.size() ; x++){
                if(result == null)  result = "{";
                else                result += ",";
                each = list.get(x);
                result += ("\"" + each.getNo() + "\":" + each.toJson());  
            }
        }
        result += "}";

        return result;
    } // End of  getCustomers()

    public String getBasicInfo(String compId, String userNo){
        String result = null;
        String[] data = new String[5];
        Map<String, String> map = null;

        map = commonMapper.getCompanyInfo(compId);

        if(map != null){
            data[0] = map.get("comname");
            data[1] = map.get("comaddress");
            data[2] = map.get("comnamephone");
            data[3] = map.get("comfax");
            data[4] = map.get("comboss");
            result = "{\"my\":" + userNo + ",";
            result += ("\"company\":{");
            result += ("\"name\":\"" + data[0] + "\",");
            result += ("\"address\":\"" + data[1] + "\",");
            result += ("\"phone\":\"" + data[2] + "\",");
            result += ("\"fax\":\"" + data[3] + "\",");
            result += ("\"ceo\":\"" + data[4] + "\"}}");
        }
        return result;
    } // End of getBasicInfo

    public List<String> getCompanyList(){
        return commonMapper.companyList();
    }


    public String getCommonCode(String compId){
        String result = null;
        List<HashMap<String, String>> list1 = null, list2 = null, list3 = null;
        ArrayList<CommonCode> root = null, children = null;
        CommonCode code1 = null, code2 = null, code3 = null;
        HashMap<String, String> map1 = null, map2 = null, map3 = null;
        String[] arr1 = null, arr2 = null, arr3 = null;
        int x = 0, y = 0, z = 0;

        root = new ArrayList<>();
        children = new ArrayList<>();

        list1 = commonMapper.getCommonCodeLevel1(compId);
        if(list1 != null && list1.size() > 0) for(x = 0 ; x < list1.size() ; x++){ //if * for / Level : 1
            map1 = list1.get(x);
            arr1 = new String[3];
            arr1[0] = map1.get("a");
            arr1[1] = map1.get("b");
            arr1[2] = map1.get("c");
            code1 = new CommonCode(arr1);
            //root.add(code1);
            list2 = commonMapper.getCommonCodeLevel2(code1.getChildSelector(), compId);
            if(list2 != null && list2.size() > 0) for(y = 0 ; y < list2.size() ; y++){ //if * for / Level : 2
                map2 = list2.get(y);
                arr2 = new String[3];
                arr2[0] = map2.get("a");
                arr2[1] = map2.get("b");
                arr2[2] = map2.get("c");
                code2 = new CommonCode(arr2);
                //code1.addChildren(code2);
                root.add(code2);
                list3 = commonMapper.getCommonCodeLevel3(code2.getChildSelector(), compId);
                if(list3 != null && list3.size() > 0) for(z = 0 ; z < list3.size() ; z++){ //if * for / Level : 3
                    map3 = list3.get(z);
                    arr3 = new String[3];
                    arr3[0] = map3.get("a");
                    arr3[1] = map3.get("b");
                    arr3[2] = map3.get("c");
                    code3 = new CommonCode(arr3);
                    code2.addChildren(code3);
                }  // END /if * for / Level : 3   
            }  // END / if * for / Level : 2
        }  // END / if * for / Level : 1
        // 3계계 코드 체계에 대한 데이터 가져오기 끝

        // 토드/값이 아닌 코드번호/값 으로 세팅된 코드들에 대한 땜빵코드 / 아래 for(x) 하단의 코드에서 기존 json 에 값 추가코드 작성함
        list3 = commonMapper.getEtcCode(compId);

        if(root != null && root.size() > 0) {
            result = "{";
            for(x = 0 ; x < root.size() ; x++){
                children = root.get(x).getChildren();
                if(x > 0)   result += ",";
                result += ("\"" + root.get(x).getDesc() + "\":{");
                if(children != null && children.size() > 0) for(y = 0 ; y < children.size() ; y++){
                    if(y > 0)   result += ",";
                    result += ("\"" + children.get(y).getValue() + "\":\"" + children.get(y).getDesc() + "\"");
                }
                result += "}";
                //result += root.get(x).toString();
            }

            // 땜빵코드 시작
            if(list3 == null || list3.size() == 0)   result += "}";
            else{
                result += ",\"etc\":{";
                for(z = 0 ; z < list3.size() ; z++){
                    map3 = list3.get(z);
                    if(z > 0)   result += ",";
                    result += ("\"" + map3.get("no") + "\":\"" + map3.get("value") + "\"");
                }
                result += "}}";
            }
            //땜빵코드 종료
        }

        return result;
    } // End of getCommonCode2()

    public void timeCorrection(){
        long t = 0L,  server = 0L, db = 0L;
        server = System.currentTimeMillis() / 1000;
        db = systemMapper.getCurrentTimeFromDB();
        t = (db - server) / 60;
        t = t * 60000;
        timeCorrect = t;
    } // End of timeCorrection()

    public String getMyInfo(String userNo, String pw, String compId){
        String result = null;
        User my = null;

        my = userMapper.getMy(userNo, pw, compId);
        if(my != null)  result = my.toJson();

        return result;
    }

    public void modifyPassword(String old, String neww, String userNo, String compId){
     
        userMapper.modifyMyPw(compId, userNo, old, neww);
     
    }

    public void modifyMyInfo(String compId, String userNo, String email, String phone){
       
       userMapper.modifyMyInfo(phone, email, userNo, compId);
        
    }

    // 고객사 담당자 목록을 전달하는 메서드
    public String cipInfo(String compId){
        String result = null;
        int x = 0;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;

        list = commonMapper.getCipInfo();
        if(list != null && list.size() > 0) for(x = 0 ; x < list.size() ; x++){
            each = list.get(x);
            if(result == null)  result = "{";
            else                result += ",";
            result += ("\"" + each.get("no") + "\":{");
            result += ("\"name\":\"" + each.get("name") + "\",");
            result += ("\"rank\":\"" + each.get("rank") + "\",");
            result += ("\"customer\":\"" + each.get("cust") + "\"}");
        }
        if(result != null)  result += "}";

        return result;

    }

    // 고객사 담당자 이름을 전달하는 메서드
    public String cipInfo(String compId, String no){
        return commonMapper.getCipName(no);
    }

    // 첨부파일 등을 임시로 저장하는 메서드
    public boolean saveAtteachedToTemp(String compId, String fileName, byte[] fileData){
        boolean result = false;
        String s = File.separator, compDir = fileStoragePath + s + compId;
        File target = null;
        FileOutputStream fos = null;

        target = new File(compDir + s + "temp" + s + fileName);
        try {
            fos = new FileOutputStream(target);
            fos.write(fileData);
        } catch (IOException e) {e.printStackTrace();}

        return result;
    } // End of saveAtteachedToTemp()

    // 어플리케이션 초기화 시 파일 저장 디렉토리를 검증/생성하기 위한 디렉토리 이름을 가져오는 메서드
    public List<String> getDefaultDirectories(){
        return systemMapper.getDirectoryNames();
    } // getDefaultDirectories()


    // 각 고객시별 디스크 사용량을 확인하는 메서드
    public HashMap<String, Long> checkUsedSpaceOnDisc(){
        HashMap<String, Long> result = null;
        String rootPath = fileStoragePath, s = File.separator, compId = null;
        List<String> companies = getCompanyList();
        Long size = 0L;
        File dir = null;
        int x = 0;

        for(x = 0 ; x < companies.size() ; x++){
            compId = companies.get(x);
            dir = new File(rootPath + s + compId);
            if(result == null)  result = new HashMap<>(); 
            size = checkUsedSpace(dir);
            result.put(compId, size);
        }

        return result;
    } // End of checkUsedSpaceOnDisc

    // 단일 고객시별 디스크 사용량을 확인하는 메서드
    public long checkUsedSpaceOnDisc(String compId){
        String rootPath = fileStoragePath, s = File.separator;
        long size = 0;
        File dir = null;

        dir = new File(rootPath + s + compId);
        size = checkUsedSpace(dir);

        return size;
    } // End of checkUsedSpaceOnDisc

    private long checkUsedSpace(File file){
        long size = 0;
        int x = 0;
        File[] dirs = null;
        if(file == null || !file.exists()) return 0;
        else if(file.isFile()) file.length();
        else{
            dirs = file.listFiles();
            for(x = 0 ; x < dirs.length ; x++)  size += dirs[x].length();  
        }
        return size;
    } // End of checkUsedSpace

    // ========================================= 2022년 비즈코어 리뉴얼 파일 데이터 마이그레이션 전용 메서드 ====================================

    // SOPP 첨부파일 (DB => storage)
    public int soppFileDownloadAndSave(){
        String rootPath = fileStoragePath, path = null, s = File.separator;
        File file = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        FileOutputStream fos = null;
        InputStream isr = null;
        Blob blob = null;
        byte[] data = null;
        String fileName = null, savedName = null;
        String sql = "SELECT soppno AS sopp, filename AS name, filecontent AS content FROM swcore.swc_soppfiledata WHERE attrib NOT LIKE 'XXX%' AND soppno IN (SELECT DISTINCT soppno FROM swcore.swc_sopp WHERE compno = 100002 AND attrib NOT LIKE 'XXX%')";
        int sopp = -1, count = 1;

        path = rootPath + s + "vtek" + s + "sopp";

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();

            while(rs.next()){
                sopp = rs.getInt(1);
                fileName = rs.getString(2);
                savedName = createRandomFileName();
                blob = rs.getBlob(3);
                isr = blob.getBinaryStream();
                data = isr.readAllBytes();
                isr.close();
                file = new File(path + s + sopp);
                if(!file.exists())  file.mkdir();
                file = new File(path + s + sopp + s + savedName);
                fos = new FileOutputStream(file);
                logger.info("[SystemService] Try save file data : " + count + " / " + fileName);
                fos.write(data);
                fos.close();
                saveAttachedData("sopp", sopp, fileName, savedName, file.length());
                count++;
            }

        }catch(SQLException | IOException e){e.printStackTrace();}
        return count;
    }

    // 전자결재 첨부파일 (DB => storage)
    public int appDocFileDownloadAndSave(){
        String rootPath = fileStoragePath, path = null, s = File.separator;
        File file = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        FileOutputStream fos = null;
        InputStream isr = null;
        Blob blob = null;
        byte[] data = null;
        String fileName = null, savedName = null;
        String sql = "SELECT docno AS no, filename AS name, filecontent AS content FROM swcore.swc_businessfiledata WHERE attrib NOT LIKE 'XXX%' AND docno IN (SELECT docno FROM swcore.swc_businessdoc WHERE attrib NOT LIKE 'XXX%')";
        int no = -1, count = 1;

        path = rootPath + s + "vtek" + s + "appDoc";

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();

            while(rs.next()){
                no = rs.getInt(1);
                fileName = rs.getString(2);
                savedName = createRandomFileName();
                blob = rs.getBlob(3);
                isr = blob.getBinaryStream();
                data = isr.readAllBytes();
                isr.close();
                file = new File(path + s + no);
                if(!file.exists())  file.mkdir();
                file = new File(path + s + no + s + savedName);
                fos = new FileOutputStream(file);
                logger.info("[SystemService] Try save file data : " + count + " / " + fileName);
                fos.write(data);
                fos.close();
                saveAttachedData("appDoc", no, fileName, savedName, file.length());
                count++;
            }

        }catch(SQLException | IOException e){e.printStackTrace();}
        return count;
    }

    // 계약 첨부파일 (DB => storage)
    public int contractFileDownloadAndSave(){
        String rootPath = fileStoragePath, path = null, s = File.separator;
        File file = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        FileOutputStream fos = null;
        InputStream isr = null;
        Blob blob = null;
        byte[] data = null;
        String fileName = null, savedName = null;
        String sql = "SELECT contno AS no, filename AS name, filecontent AS content FROM swcore.swc_contfiledata WHERE contno IN (SELECT contno FROM swcore.swc_cont WHERE attrib NOT LIKE 'XXX%') AND attrib NOT LIKE 'XXX%'";
        int no = -1, count = 1;

        path = rootPath + s + "vtek" + s + "contract";

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();

            while(rs.next()){
                no = rs.getInt(1);
                fileName = rs.getString(2);
                savedName = createRandomFileName();
                blob = rs.getBlob(3);
                isr = blob.getBinaryStream();
                data = isr.readAllBytes();
                isr.close();
                file = new File(path + s + no);
                if(!file.exists())  file.mkdir();
                file = new File(path + s + no + s + savedName);
                fos = new FileOutputStream(file);
                logger.info("[SystemService] Try save file data : " + count + " / " + fileName);
                fos.write(data);
                fos.close();
                saveAttachedData("contrct", no, fileName, savedName, file.length());
                count++;
            }

        }catch(SQLException | IOException e){e.printStackTrace();}
        return count;
    }

    // DB에서 dtorage 장치로 이전된 파일에 데해 DB에 저장하는 메서드
    private void saveAttachedData(String funcName, int no, String fileName, String savedName, long size){
        String sql = "INSERT INTO bizcore.attached(compId, funcName, funcNo, fileName, savedName, `size`) VALUES('vtek', ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1,funcName);
            pstmt.setInt(2, no);
            pstmt.setString(3, fileName);
            pstmt.setString(4, savedName);
            pstmt.setLong(5, size);
            if(pstmt.executeUpdate() > 0)   logger.debug("[SystemService] DB File info insert success : " + fileName);
            else logger.warn("[SystemService] DB File info insert fail : " + fileName);
        }catch(SQLException e){e.printStackTrace();}

    } // End of saveAttachedData()




}