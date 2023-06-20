package kr.co.bizcore.v1.svc;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.bizcore.v1.domain.Dept;
import kr.co.bizcore.v1.mapper.AccountingMapper;
import kr.co.bizcore.v1.mapper.AccountingMapper2;
import kr.co.bizcore.v1.mapper.BoardMapper;
import kr.co.bizcore.v1.mapper.CommonMapper;
import kr.co.bizcore.v1.mapper.ContractMapper;
import kr.co.bizcore.v1.mapper.DeptMapper;
import kr.co.bizcore.v1.mapper.EstimateMapper;
import kr.co.bizcore.v1.mapper.GwFormMapper;
import kr.co.bizcore.v1.mapper.GwMapper;
import kr.co.bizcore.v1.mapper.NotesMapper;
import kr.co.bizcore.v1.mapper.ProcureMapper;
import kr.co.bizcore.v1.mapper.ProductMapper;
import kr.co.bizcore.v1.mapper.ProjectMapper;
import kr.co.bizcore.v1.mapper.SalesMapper;
import kr.co.bizcore.v1.mapper.Schedule2Mapper;
import kr.co.bizcore.v1.mapper.ScheduleMapper;
import kr.co.bizcore.v1.mapper.SoppMapper;
import kr.co.bizcore.v1.mapper.SystemMapper;
import kr.co.bizcore.v1.mapper.TechMapper;
import kr.co.bizcore.v1.mapper.TestMapper;
import kr.co.bizcore.v1.mapper.TradeMapper;
import kr.co.bizcore.v1.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@Transactional(readOnly = false)
@Service
@Slf4j
public abstract class Svc {

    private static final Logger logger = LoggerFactory.getLogger(Svc.class);

    @Autowired
    protected SystemMapper systemMapper;

    @Autowired
    protected UserMapper userMapper;

    @Autowired
    protected DeptMapper deptMapper;

    @Autowired
    protected ScheduleMapper scheduleMapper;

    @Autowired
    protected CommonMapper commonMapper;

    @Autowired
    protected BoardMapper boardMapper;

    @Autowired
    protected SoppMapper soppMapper;

    @Autowired
    protected SalesMapper salesMapper;

    @Autowired
    protected TechMapper techMapper;

    @Autowired
    protected ProcureMapper procureMapper;

    @Autowired
    protected ContractMapper contractMapper;

    @Autowired 
    protected TestMapper testMapper;

    @Autowired
    protected GwFormMapper gwFormMapper;

    @Autowired
    protected TradeMapper tradeMapper;

    @Autowired
    protected AccountingMapper accMapper;

    @Autowired
    protected ProductMapper productMapper;

    @Autowired
    protected GwMapper gwMapper;

    @Autowired
    protected NotesMapper notesMapper;

    @Autowired
    protected EstimateMapper estimateMapper;

    @Autowired
    protected Schedule2Mapper schedule2Mapper;

    @Autowired
    protected AccountingMapper2 accMapper2;

    @Autowired ProjectMapper projectMapper;

    @Autowired
    protected SqlSessionTemplate sqlSession;

    public static String fileStoragePath;

    public static boolean DEBUG;

    protected long timeCorrect;

    protected String html404;
    protected String html500;

    protected DataFactory dataFactory = DataFactory.getFactory();

    public boolean debug(){return DEBUG;}

    // 부서아이디 존재유무 검증 메서드
    public boolean verifyDeptId(String compId, String deptId){
        return commonMapper.verifyDeptId(compId, deptId) > 0;
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

    public int getCurrentWeek(){
        int result = -1;
        Integer w = null;

        w = (Integer)dataFactory.getData("ALL", "currentWeek");
        if(w == null){
            w = systemMapper.getCurrentWeek();
            dataFactory.setData("ALL", "currentWeek", w, 1800);
        }
        return result;
    } // End of getCurrentWeek()

    public String generateKey() {
        return generateKey(32);
    } // End of generateKey()

    public String createRandomFileName(){
        Calendar cal = Calendar.getInstance();
        String date = null;
        int x = 0, y = 0, z = 0;
        x = cal.get(Calendar.YEAR);
        y = cal.get(Calendar.MONTH) + 1;
        z = cal.get(Calendar.DATE);
        date = "" + x;
        date += (y < 10 ? "0" + y : y);
        date += (z < 10 ? "0" + z : z);
        return date + "_" + createRandomFileName(64);
    }

    // 랜덤 파일명 생성 함수
    private String createRandomFileName(int length){
        byte[] result = null;
        byte[] data = null;
        byte chr = 0;
        int x = 0, y = 0;

        result = new byte[length];
        data = new byte[62];

        chr = 'a';
        while( chr <= 'z')    data[x++] = chr++;

        chr = 'A';
        while( chr <= 'Z')    data[x++] = chr++;

        chr = '0';
        while( chr <= '9')    data[x++] = chr++;

        for(x = 0 ; x < result.length ; x++){
            y = (int)(Math.random() * data.length);
            result[x] = data[y];
        }

        return new String(result);
    } // End of createRandomFileName()

    public String generateKey(int length) {
        byte[] data = null, src = new byte[69];
        int x = 0;
        int t = 0;

        for (x = 0; x < src.length; x++) {
            if (x < 10)
                src[x] = (byte) (x + 48);
            else if (x < 36)
                src[x] = (byte) (x + 55);
            else if (x < 62)
                src[x] = (byte) (x + 61);
            else if (x == 63)
                src[x] = (byte) 33;
            else if (x == 64)
                src[x] = (byte) 43;
            else if (x == 65)
                src[x] = (byte) 126;
            else
                src[x] = (byte) (x - 31);
        }

        data = new byte[length];
        for (x = 0; x < length; x++) {
            t = (int) (Math.random() * src.length);
            data[x] = src[t];
        }

        return new String(data);
    } // End of generateKey()

    public String encSHA256(String str) {
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-256");
            md.update(str.getBytes());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return md == null ? null : bytesToHex(md.digest());
    } // End of encSHA256()

    public String encSHA512(String str) {
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-512");
            md.update(str.getBytes());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return md == null ? null : bytesToHex(md.digest());
    } // End of encSHA256()

    public String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder();
        for (byte b : bytes) {
            builder.append(String.format("%02x", b));
        }
        return builder.toString();
    } // End of bytesToHex()

    public byte[] hexToByteArray(String hex) {
        int x = 0;
        byte[] bytes = null;
        if (hex == null || hex.length() % 2 != 0) {
            return new byte[] {};
        }

        bytes = new byte[hex.length() / 2];
        for (x = 0; x < hex.length(); x += 2) {
            byte value = (byte) Integer.parseInt(hex.substring(x, x + 2), 16);
            bytes[(int) Math.floor(x / 2)] = value;
        }
        return bytes;
    } // End of hexToByteArray()

    public String encAes(String text, String key, String iv) {
        String result = null;
        Cipher cipher = null;
        SecretKeySpec keySpec = null;
        IvParameterSpec ivParamSpec = null;
        byte[] encrypted = null;

        try {
            cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            keySpec = new SecretKeySpec(key.getBytes(), "AES");
            ivParamSpec = new IvParameterSpec(iv.getBytes());
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivParamSpec);
            encrypted = cipher.doFinal(text.getBytes("UTF-8"));
            result = Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    } // End of encAes()

    public String decAes(String text, String aesKey, String aesIv) {
        String result = null;
        Cipher cipher = null;
        SecretKeySpec keySpec = null;
        IvParameterSpec ivParamSpec = null;
        byte[] decrypted1 = null, decrypted2 = null;

        try {
            cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            keySpec = new SecretKeySpec(aesKey.getBytes(), "AES");
            ivParamSpec = new IvParameterSpec(aesIv.getBytes());
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivParamSpec);
            decrypted1 = Base64.getDecoder().decode(text.getBytes("UTF-8"));
            decrypted2 = cipher.doFinal(decrypted1);
            result = new String(decrypted2, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    } // End of decAes()

    public byte[] decAesBinary(String text, String key, String iv) {
        byte[] result = null;
        Cipher cipher = null;
        SecretKeySpec keySpec = null;
        IvParameterSpec ivParamSpec = null;
        byte[] decrypted = null;

        try {
            cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            keySpec = new SecretKeySpec(key.getBytes(), "AES");
            ivParamSpec = new IvParameterSpec(iv.getBytes());
            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivParamSpec);
            decrypted = Base64.getDecoder().decode(text.getBytes("UTF-8"));
            decrypted = cipher.doFinal(decrypted);
            result = decrypted;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    } // End of decAes()

    public KeyPair genKeyPair() {
        KeyPair result = null;
        KeyPairGenerator gen = null;

        try {
            gen = KeyPairGenerator.getInstance("RSA");
            gen.initialize(2048, new SecureRandom());
            result = gen.genKeyPair();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    } // End of genKeyPair

    public String encRsa(String text, KeyPair key) {
        String result = null;
        byte[] bytes = null;
        Cipher cipher = null;

        try {
            cipher = Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE, key.getPublic());
            bytes = cipher.doFinal(text.getBytes());
            result = Base64.getEncoder().encodeToString(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    } // End of encRsa()

    // AES 디코딩 메서드
    public String decRsa(String text, KeyPair key) {
        String result = null;
        byte[] bytes = null;
        Cipher cipher = null;

        try {
            cipher = Cipher.getInstance("RSA");
            bytes = Base64.getDecoder().decode(text.getBytes());
            bytes = hexToByteArray(new String(bytes));
            cipher.init(Cipher.DECRYPT_MODE, key.getPrivate());
            bytes = cipher.doFinal(bytes);
            result = new String(bytes, "utf-8");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    } // End of decRsa()

    // 문자 -> 숫자 변환 메서드
    public int strToInt(String str){
        int result = -1;
        try{result = str != null ? Integer.parseInt(str) : -1;
        }catch(NumberFormatException e){e.printStackTrace();}
        return result;
    } // End of strToInt()

    // 입력된 쿼리를 단순 실행하는 메서드 / 리턴값은 엡데이트된 row의 수
    public int executeSqlQuery(String sql){
        int result = -1;
        Connection conn = null;
        PreparedStatement pstmt = null;

        if(sql == null) return result;
        logger.info("[Svc.executeSqlQuery] Running custom SQL query . . .");
        logger.debug("[Svc.executeSqlQuery] SQL Query : " + sql);

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            result = pstmt.executeUpdate();
            logger.debug("[Svc.executeSqlQuery] Updated rows : " + result);
        } catch (SQLException e) {
            e.printStackTrace();
            logger.info("[Svc.executeSqlQuery] Failure Custom SQL Query : " + sql);
        }
        
        return result;
    } // End of executeSqlQuery()

    // 지정한 테이블에서 다음 no 값을 확인해주는 메서드 / DB의 프로시저로 만들경우 모든 테이블에 대해 만들어야 하기에 이렇게 만들어 둠
    public int getNextNumberFromDB(String compId, String tableName){
        int result = -1;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = null;

        if(compId == null || tableName == null){
            logger.debug("[Svc.getNextNumberFromDB] input data is null ::: compId : " + compId + " / tableName : " + tableName);
            return result;
        }

        sql = "SELECT IFNULL(MAX(IFNULL(no, 0)), 0) + 1 AS nextNo FROM " + tableName + " WHERE compid = '" + compId + "'";

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();
            if(rs.next())   result = rs.getInt(1);
            logger.debug("[Svc.getNextNumberFromDB] compId : " + compId + " / table : " + tableName + " / getNextNumber : " + result);
        } catch (SQLException e) {
            e.printStackTrace();
            logger.info("[Svc.getNextNumberFromDB] Fail to execute SQL Query : " + sql);
        }

        return result;
    } // End of getNextNumberFromDB()

    // 회사 고유 암호키를 전달하는 메서드
    public String[] getCompanyAesKey(String compId){
        String[] result = null;
        HashMap<String, String> each = null;
        String aesKey = null, aesIv = null;

        result = (String[])dataFactory.getData(compId, "aesKey");
        if(result == null){
            each = systemMapper.getCompanyAesKey(compId);
            if(each != null){
                aesKey = each.get("aesKey");
                aesIv = each.get("aesIv");
                result = new String[2];
                result[0] = aesKey;
                result[1] = aesIv;
                // factory에 저장
                dataFactory.setData(compId, "aesKey", result, 3600);
            }
        }
        return result;
    } // End of getAesKey()

    // 문자열을 입력받아서 JSON에서 사용할 수 없는 문자를 Unicode로 변경하는 메서드
    public String cvtJsonUnicode(String str){
        return str == null ? null : str.replaceAll("\"", "\\u0022").replaceAll("\r", "").replaceAll("\t", "").replaceAll("\\\\", "\\u005c");
    } // End of cvtJsonUnicode()


    // 임시파일을 지정한 폴더로 이동하는 메서드
    protected long moveTempFile(String compId, String targetDir, String subDir, String savedName){
        long result = -9999;
        String str = null, rootPath = fileStoragePath, dir = null, s = File.separator, appData = null;
        String[] line = null;
        File source = null, target = null;
        Long size = 0L;
        FileInputStream fin = null;
        FileOutputStream fout = null;
        byte[] buffer = new byte[1024];
        int read = -1;

        rootPath = rootPath + s + compId;
        dir = rootPath + s + targetDir;
        target = new File(dir);
        source = new File(rootPath + s + "temp" + s + savedName);

        // 임시파일이 존재하는지 확인합니다. 이동할 임시파일이 존재하지 않으면 나머지 절차는 무의미합니다.
        if(savedName == null || !source.exists()){
            logger.error("Svc.moveTempFile() :::::::::: Not exist temp file. File Move Terminated.");
            return -1;
        }

        // 파일이 저장될 타겟 디렉토리의 존재를 검증합니다. 이는 프로그램 시작 시, 이니셜라이저에서 자동 생성되어야만 합니다.
        if(!target.exists()){
            logger.error("Svc.moveTempFile() :::::::::: Not exist Target Directory. It Must be verify and create Web App Initializer. File Move Terminated.");
            return -2;
        }

        // 타겟 디렉토리 외 서브디렉토리가 입력된 경우 존재하는지 확인하고 없으면 생성합니다. 이는 attached의 funcNo에 해당합니다.
        if(subDir != null){
            dir += (s + subDir);
            target = new File(dir);
            if(!target.exists()){
                if(!target.mkdir()){
                    logger.error("Svc.moveTempFile() :::::::::: Request file move to sub directory under target. But, It not exist and Fail to create. File Move Terminated.");
                    return -3;
                }
            }
        }

        // 파일 이동 시도
        target = new File(dir + s + savedName);
        if(target.exists()){
            logger.error("Svc.moveTempFile() :::::::::: Target file already exists. File Move Terminated.");
            return -4;
        }
    
        if(source.renameTo(target)){ // 1차 : renameTo()로 간단히 이동 시도
            logger.info("Svc.moveTempFile() :::::::::: File move success. use File.renameTo()");
            result = target.length();
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
                logger.info("Svc.moveTempFile() :::::::::: File move success. Read temp file to buffer And write target file.");
                result = target.length();
            } catch (Exception e) {e.printStackTrace();}
        }

        return result;
    } // End of moveTempFile()


     // 최상위 부서를 가져오는 메서드
    public Dept rootDept(String compId, boolean cache){
        Dept result = null;

        if(cache){
            result = (Dept)dataFactory.getData(compId, "rootDept");
            if(result == null && getAndProceedDeptInfo(compId)){
                result = (Dept)dataFactory.getData(compId, "rootDept");
            }
        }else{
            getAndProceedDeptInfo(compId);
            result = (Dept)dataFactory.getData(compId, "rootDept");
        }
        
        return result;
    } // End of rootDept()

    // 전베 부서가 담긴 맵을 가져오는 메서드
    public HashMap<String, Dept> deptMap(String compId){
        HashMap<String, Dept> result = null;
        Dept root = null;

        root = (Dept)dataFactory.getData(compId, "rootDept");
        if(result == null && getAndProceedDeptInfo(compId)){
            result = (HashMap<String, Dept>)dataFactory.getData(compId, "rootDept");
        }
        return result;
    } // End of rootDept()

    // 부서 처리용 프라이빗 메서드
    private boolean getAndProceedDeptInfo(String compId){
        List<Dept> list1 = null;
        List<Map<String, String>> list2 = null;
        Map<String, String> each = null;
        HashMap<String, Dept> deptMap = null;
        Dept root = null, parent = null, dept = null;
        String deptId = null, userNo = null;
        int x = 0;

        deptMap = new HashMap<>();
        list1 = deptMapper.getAllDept(compId);
        list2 = userMapper.getAllDeptInfo(compId);

        // Find of Root Dept AND Create Map
        for(x = 0 ; x < list1.size() ; x++){
            if(list1.get(x).getParent() == null || list1.get(x).getParent().trim().length() == 0){
                root = list1.get(x);
            }
            deptMap.put(list1.get(x).getDeptId(), list1.get(x));
        }

        // set employee number into dept
        for(x = 0 ; x < list2.size() ; x++){
            each = list2.get(x);
            userNo = each.get("userNo");
            deptId = each.get("deptId");
            dept = deptMap.get(deptId);
            if(dept != null)    dept.addEmployee(userNo);
        }

        // set child
        for(x = 0 ; x < list1.size() ; x++){
            if(list1.get(x).equals(root))    continue;
            parent = deptMap.get(list1.get(x).getParent());
            if(parent != null)  parent.addChild(list1.get(x));
        }
        
        dataFactory.setData(compId, "rootDept", root, 180);
        return true;
    } // End of getAndProceedDeptInfo()

} // End of abstract Class === Svc

class DataFactory{

    private static HashMap<String, DataFactory> rootFactory = new HashMap<>();
    private HashMap<String, DataSet> dataSet = null;
    private static DataFactory instance = new DataFactory("ALL");
    
    private DataFactory(String compId){
        dataSet = new HashMap<>();
        rootFactory.put(compId, this);
    }

    public static DataFactory getFactory(){
        return instance;
    } // End of getFactory()

    public void setData(String compId, String dataName, Object data, int lifeTime){
        DataFactory factory = null;
        DataSet set = null;
        factory = rootFactory.get("compId");
        if(factory == null && compId != null && compId.length() > 0){
            factory = new DataFactory(compId);
            set = factory.dataSet.get(dataName);
            if(set == null){
                set = new DataSet();
                factory.dataSet.put(dataName, set);
                set.setData(data);
                set.setData(data);
                if(lifeTime > 0)    set.setLifeTime(lifeTime);
            }
        }
    } // End of setData()

    public Object getData(String compId, String dataName){
        Object result = null;
        DataSet set = null;
        DataFactory factory = null;

        factory = rootFactory.get(compId);
        if(factory != null){
            set = factory.dataSet.get(dataName);
            if(set != null) result = set.getData();
        }
        return result;
    } // End of getData()

    private int strToInt(String str){
        int result = -1;
        try{result = str != null ? Integer.parseInt(str) : -1;
        }catch(NumberFormatException e){e.printStackTrace();}
        return result;
    }

    private long strToLong(String str){
        long result = -1;
        try{result = str != null ? Long.parseLong(str) : -1;
        }catch(NumberFormatException e){e.printStackTrace();}
        return result;
    }

} // End of Class === DataFactory

class DataSet{
    private int lifeTime = 60;
    private long setTime;
    private Object data;

    public void setLifeTime(int second){lifeTime = second <= 0 ? 0 : second;}
    public void timeSet(){setTime = System.currentTimeMillis();}
    public void setData(Object data){this.data = data;setTime = System.currentTimeMillis();}

    public Object getData(){
        return System.currentTimeMillis() + lifeTime * 1000 < setTime ? null : data;
    } // End of getData()
} // End of Class === DataSet
