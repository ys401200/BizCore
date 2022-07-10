package kr.co.bizcore.v1.svc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.mapper.SystemMapper;
import kr.co.bizcore.v1.mapper.UserMapper;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.Security;
import java.util.Base64;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

@Service
public abstract class Svc {

    @Autowired
    protected SystemMapper systemMapper;

    @Autowired
    protected UserMapper userMapper;

    public String generateKey() {
        return generateKey(32);
    } // End of generateKey()

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
    } // End of enc()

    public String decAes(String text, String key, String iv) {
        String result = null;
        Cipher cipher = null;
        SecretKeySpec keySpec = null;
        IvParameterSpec ivParamSpec = null;
        byte[] decrypted1 = null, decrypted2 = null;

        System.out.println("[TEST] :::::::::: text ///" + text + "///");
        System.out.println("[TEST] :::::::::: ket ///" + key + "///");
        System.out.println("[TEST] :::::::::: iv ///" + iv + "///");

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
    } // End of dec()

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
    } // End of enc()

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
    } // End of dec()

}
