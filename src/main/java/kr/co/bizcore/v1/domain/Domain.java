package kr.co.bizcore.v1.domain;

import java.lang.reflect.Field;
import java.util.Date;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class Domain {

    public String toJson() {
        ObjectMapper mapper = new ObjectMapper();
        String result = null;
        try {
            result = mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return result;
    }

    public String compareAndCreateQuery(Object target, String tableName){
        String result = null;
        Class<?> targetClass = target.getClass();
        Field[] targetFields = targetClass.getDeclaredFields();
        Object targetValue = null, ognValue = null;
        Field targetField = null;
        String fieldName = null;
        boolean first = true;
        int x = 0;
        
        System.out.println("[XXXXXXXXXXXXXXXX] Step : " + 1);
        
        result = " SET ";
        targetFields = target.getClass().getDeclaredFields();

        System.out.println("[XXXXXXXXXXXXXXXX] Length : " + targetFields.length);

        for(x = 0 ; x < targetFields.length ; x++){

            System.out.println("[XXXXXXXXXXXXXXXX] Step : " + 2);

            targetField = targetFields[x];
            targetField.setAccessible(true);
            fieldName = targetField.getName();
            try {
                targetValue = targetField.get(target);
                ognValue = targetField.get(this);

                System.out.println("[XXXXXXXXXXXXXXXX] Step : " + 3);
                System.out.println("[XXXXXXXXXXXXXXXX] Field : " + fieldName);
                System.out.println("[XXXXXXXXXXXXXXXX] value : ogn : " + ognValue);
                System.out.println("[XXXXXXXXXXXXXXXX] value : target : " + targetValue);

                if(targetValue == null && ognValue == null){
                    System.out.println("[XXXXXXXXXXXXXXXX] Step : " + 4);
                    continue;
                }else if(targetValue == null && ognValue != null){
                    System.out.println("[XXXXXXXXXXXXXXXX] Step : " + 5);
                    if(first)   first = false;
                    else        result += ", ";
                    result += (fieldName + "=NULL");
                }else if(!(targetValue == ognValue || targetValue.equals(ognValue))){
                    System.out.println("[XXXXXXXXXXXXXXXX] Step : " + 6);
                    if(first)   first = false;
                    else        result += ", ";
                    
                    if (targetField.getType().getName().equals(String.class.getName())) {
                        result += (fieldName + "='" + String.class.cast(targetValue) + "'");
                    } else if (targetField.getType().getName().equals("int")) {
                        result += (fieldName + "=" + (int)targetValue);
                    } else if (targetField.getType().getName().equals("short")) {
                        result += (fieldName + "=" + (short)targetValue);
                    } else if (targetField.getType().getName().equals("float")) {
                        result += (fieldName + "=" + (float)targetValue);
                    } else if (targetField.getType().getName().equals("long")) {
                        result += (fieldName + "=" + (long)targetValue);
                    } else if (targetField.getType().getName().equals("double")) {
                        result += (fieldName + "=" + (double)targetValue);
                    } else if (targetField.getType().getName().equals("boolean")) {
                        result += (fieldName + "=" + ((boolean)targetValue ? 1 : 0));
                    } else if (targetField.getType().getName().equals("byte")) {
                        result += (fieldName + "=" + (byte)targetValue);
                    } else if (targetField.getType().getName().equals(Date.class.getName())) {
                        result += (fieldName + "='" +  new java.sql.Timestamp(((Date)targetValue).getTime()) + "'");
                    } else if (targetField.getType().getName().equals(java.sql.Date.class.getName())) {
                        result += (fieldName + "='" +  java.sql.Date.class.cast(targetValue) + "'");
                    } else if (targetField.getType().getName().equals(java.sql.Time.class.getName())) {
                        result += (fieldName + "='" +  java.sql.Time.class.cast(targetValue) + "'");
                    } else if (targetField.getType().getName().equals(java.sql.Timestamp.class.getName())) {
                        result += (fieldName + "='" +  java.sql.Timestamp.class.cast(targetValue) + "'");
                    }
                }else{
                    System.out.println("[XXXXXXXXXXXXXXXX] Step : " + 7);
                }
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("[XXXXXXXXXXXXXXXX] Step : " + 999);
            }
        }
        result = "UPDATE " + tableName + result;
        return result;
    } // End of compareAndCreateStatement

    
    
}
