package kr.co.bizcore.v1.svc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.mapper.CommonMapper;
import kr.co.bizcore.v1.mapper.DeptMapper;
import kr.co.bizcore.v1.mapper.ScheduleMapper;
import kr.co.bizcore.v1.mapper.SystemMapper;
import kr.co.bizcore.v1.mapper.UserMapper;
import kr.co.bizcore.v1.util.UploadedFileStorage;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@Service
public abstract class Svc {
    
    @Autowired
    protected UploadedFileStorage fileStorage;

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

    public static boolean DEBUG;

    protected DataFactory dataFactory = DataFactory.getFactory();

    public boolean debug(){return DEBUG;}

    public String generateKey() {
        return generateKey(32);
    } // End of generateKey()

    public String createRandomFileName(){return createRandomFileName(64);}

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

    public String decAes(String text, String key, String iv) {
        String result = null;
        Cipher cipher = null;
        SecretKeySpec keySpec = null;
        IvParameterSpec ivParamSpec = null;
        byte[] decrypted1 = null, decrypted2 = null;

        try {
            cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            keySpec = new SecretKeySpec(key.getBytes(), "AES");
            ivParamSpec = new IvParameterSpec(iv.getBytes());
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
