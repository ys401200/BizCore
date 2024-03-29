package kr.co.bizcore.v1.domain;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.xml.bind.annotation.XmlElement;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public abstract class Domain implements Comparable<Domain> {

    private static final Logger logger = LoggerFactory.getLogger(Domain.class);

    @JsonIgnore
    private static HashMap<String, HashMap<String, String>> fieldMap = null;
    @JsonIgnore
    private static HashMap<String, String> tableMap;

    @XmlElement(nillable = true)
    protected Date created;
    @XmlElement(nillable = true)
    protected Date modified;
    @JsonIgnore
    @XmlElement(nillable = true)
    protected Date deleted;

    public Date getCreated() {
        return created;
    }

    public Date getModified() {
        return modified;
    }

    public Date getDeleted() {
        return deleted;
    }

    public void setCreated(Date v) {
        created = v;
    }

    public void setModified(Date v) {
        modified = v;
    }

    public void setDeleted(Date v) {
        deleted = v;
    }

    public void setCreated(long v) {
        created = new Date(v);
    }

    public void setModified(long v) {
        modified = new Date(v);
    }

    public void setDeleted(long v) {
        deleted = new Date(v);
    }

    // === P R I V A T E _ M E T H O D ===

    // 입력된 객체와 비교하여 값이 다른 필드를 리턴하는 메서드
    private String[] findDefirrentFields(Object target) {
        String[] result = null;
        ArrayList<String> fieldNames = new ArrayList<>();
        Object v1 = null, v2 = null;
        Field[] fields = getAllFields(this);
        String fieldName = null;

        // 입력된 객체가 널이거나 클래스가 다르면 종료함
        if (!getClass().getName().equals(target.getClass().getName()))
            return null;

        for (Field field : fields) {
            field.setAccessible(true);
            fieldName = field.getName();
            if (fieldName.equals("created") || fieldName.equals("modified") || fieldName.equals("deleted"))
                continue;
            try {
                v1 = field.get(this);
                v2 = field.get(target);
                if (!(v1 == null && v2 == null) && v1 != v2 && !v1.equals(v2)) {
                    fieldNames.add(fieldName);
                    logger.debug("[Domain] ::::: " + fieldName);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (fieldNames.size() > 0) {
            result = new String[fieldNames.size()];
            fieldNames.toArray(result);
        }
        return result;
    } // End of findDefirrentFields()

    protected HashMap<String, String> getTableMap() {
        // 비즈코어 1차 리뉴얼 단계에서 기존 DB의 테이블을 사용하기에 테이블명과 컬렴명에 대한 변환이 필요함. 이를 해결하기 위한 변수들
        if (tableMap == null) {
            tableMap = new HashMap<>();

            // 클래스명으로 테이블명을 찾을 수 있도록 미리 세팅함
            tableMap.put("AttachedFile", "bizcore.filebox_attached");
            tableMap.put("Contract", "swc_cont");
            tableMap.put("Estimate", "swc_est");
            tableMap.put("EstimateItem", "swc_estitems");
            tableMap.put("Notice", "bizcore.notice");
            tableMap.put("Procure", "swc_pps");
            tableMap.put("Sopp", "swc_sopp");
            tableMap.put("TradeDetail", "swc_soppdata01");
            tableMap.put("Product", "bizcore.product");
        }
        return tableMap;
    }

    protected HashMap<String, HashMap<String, String>> getFieldMap() {
        HashMap<String, String> column = null;

        if (fieldMap == null) {
            fieldMap = new HashMap<>();

            column = new HashMap<>();
            fieldMap.put("Contract", column);
            column.put("salesType", "conttype");
            column.put("contractType", "cntrctmth");
            column.put("title", "conttitle");
            column.put("endUser", "buyrno");
            column.put("contractAmount", "contamt");
            column.put("profit", "net_profit");
            column.put("employee", "userno");
            column.put("sopp", "soppno");
            column.put("prvCont", "excontno");
            column.put("employee2", "seconduserno");
            column.put("customer", "custno");
            column.put("cipOfCustomer", "custmemberno");
            column.put("detail", "contdesc");
            column.put("cipOfendUser", "buyrmemberno");
            column.put("partner", "ptncno");
            column.put("cipOfPartner", "ptncmemberno");
            column.put("supplier", "supplyno");
            column.put("cipOfSupplier", "supplymemberno");
            column.put("supplied", "supplydate");
            column.put("delivered", "delivdate");
            column.put("taxInclude", "vatyn");
            column.put("startOfPaidMaintenance", "paymaintsdate");
            column.put("endOfPaidMaintenance", "paymaintedate");
            column.put("area", "contarea");
            column.put("typeOfBusiness", "businesstype");
            column.put("created", "regdatetime");
            column.put("modified", "moddatetime");
            column.put("startOfFreeMaintenance", "freemaintsdate");
            column.put("endOfFreeMaintenance", "freemaintedate");
            column.put("saleDate", "contorddate");

            column = new HashMap<>();
            fieldMap.put("AttachedFile", column);
            column.put("idx", "idx");
            column.put("articleNo", "article_no AS ");
            column.put("ognName", "ogn_name");
            column.put("created", "created");
            column.put("modified", "modified");
            column.put("size", "size");
            column.put("removed", "removed");

            column = new HashMap<>();
            column.put("no", "estno");
            column.put("id", "estid");
            column.put("ver", "estver");
            column.put("type", "esttype");
            column.put("title", "esttitle");
            column.put("remark", "estdesc");
            column.put("customer", "custno");
            column.put("sopp", "soppno");
            column.put("writer", "userno");
            column.put("amount", "estamount");
            column.put("tax", "estvat");
            column.put("discount", "estdiscount");
            column.put("total", "esttotal");
            column.put("date", "estdate");
            column.put("created", "regdate");
            column.put("modified", "moddate");
            fieldMap.put("Estimate", column);

            column = new HashMap<>();
            fieldMap.put("EstimateItem", column);
            column.put("no", "estitemno");
            column.put("kind", "itemkinds");
            column.put("title", "itemtitle");
            column.put("customer", "custno");
            column.put("productNo", "productNo");
            column.put("productName", "productName");
            column.put("productSpec", "productSpec");
            column.put("qty", "productqty");
            column.put("price", "productnetprice");
            column.put("tax", "productvat");
            column.put("amount", "productamount");
            column.put("discount", "productdis");
            column.put("total", "producttotal");
            column.put("remark", "productremark");
            column.put("created", "regdate");
            column.put("modified", "moddate");

            column = new HashMap<>();
            fieldMap.put("Procure", column);
            column.put("buyerCode", "buyerCode");
            column.put("buyerName", "buyerName");
            column.put("buyerArea", "buyerArea");
            column.put("buyerAreaCode", "buyerAreaCode");
            column.put("requestNo", "reqno");
            column.put("requestItemCode", "reqitemcode");
            column.put("requestItem", "reqItem");
            column.put("itemNetPrice", "itemnetprice");
            column.put("itemQty", "itemQty");
            column.put("itemUnit", "itemUnit");
            column.put("itemAmount", "itemAmount");
            column.put("title", "contracttitle");
            column.put("modQty", "modQty");
            column.put("modAmount", "modAmount");
            column.put("contractDate", "contractDate");
            column.put("deliveryDate", "deliveryDate");
            column.put("deliveryPlace", "deliveryPlace");
            column.put("sopp", "soppno");

            column = new HashMap<>();
            fieldMap.put("Sopp", column);
            column.put("soppType", "sopptype");
            column.put("contType", "cntrctMth");
            column.put("title", "sopptitle");
            column.put("customer", "buyrno");
            column.put("endUser", "custNo");
            column.put("employee", "userNo");
            column.put("expectedSales", "sopptargetamt");
            column.put("status", "soppstatus");
            column.put("contract", "contno");
            column.put("picOfCustomer", "custMemberNo");
            column.put("ptnc", "ptncno");
            column.put("picOfPtnc", "ptncmemberno");
            column.put("picOfBuyer", "buyrmemberno");
            column.put("detail", "soppDesc");
            column.put("targetDate", "sopptargetdate");
            column.put("startOfMaintenance", "maintenance_s");
            column.put("endOfMaintenance", "maintenance_e");
            column.put("progress", "soppsrate");
            column.put("source", "soppsource");
            column.put("remark", "sopp2desc");
            column.put("businessType", "businessType");

            column = new HashMap<>();
            fieldMap.put("TradeDetail", column);
            column.put("sopp", "soppno");
            column.put("writer", "userno");
            column.put("category", "catno");
            column.put("product", "productno");
            column.put("customer", "salescustno");
            column.put("vatSerial", "vatserial");
            column.put("title", "datatitle");
            column.put("desc", "datadesc");
            column.put("type", "datatype");
            column.put("quantity", "dataquanty");
            column.put("amount", "dataamt");
            column.put("discount", "datadiscount");
            column.put("netPrice", "datanetprice");
            column.put("tax", "datavat");
            column.put("total", "datatotal");
            column.put("remark", "dataremark");
            column.put("endVataDate", "endvatadate");
            column.put("created", "regdatetime");
            column.put("modified", "moddatetime");

            column = new HashMap<>();
            fieldMap.put("Schedule", column);
            column.put("no", "schedNo");
            column.put("writer", "userNo");
            column.put("sopp", "soppNo");
            column.put("customer", "custNo");
            column.put("from", "schedFrom");
            column.put("to", "schedTo");
            column.put("title", "schedTitle");
            column.put("content", "schedDesc");
            column.put("workReport", "schedCheck");
            column.put("type", "schedType");
            column.put("place", "schedPlace");
            column.put("created", "regdatetime");
            column.put("modified", "moddatetime");

            column = new HashMap<>();
            fieldMap.put("ScheduleSales", column);
            column.put("no", "salesNo");
            column.put("writer", "userNo");
            column.put("sopp", "soppNo");
            column.put("customer", "ptncNo");
            column.put("from", "salesFrdatetime");
            column.put("to", "salesTodatetime");
            column.put("title", "salesTitle");
            column.put("content", "salesDesc");
            column.put("workReport", "salesCheck");
            column.put("type", "salesType");
            column.put("place", "salesPlace");
            column.put("partner", "custNo");
            column.put("created", "regdatetime");
            column.put("modified", "moddatetime");

            column = new HashMap<>();
            fieldMap.put("ScheduleTech", column);
            column.put("no", "techdNo");
            column.put("writer", "userNo");
            column.put("sopp", "soppNo");
            column.put("customer", "endCustNo");
            column.put("from", "techdFrom");
            column.put("to", "techdTo");
            column.put("title", "techdTitle");
            column.put("content", "techdDesc");
            column.put("workReport", "techdCheck");
            column.put("type", "techdType");
            column.put("place", "techdPlace");
            column.put("partner", "custNo");
            column.put("contract", "contNo");
            column.put("contractMethod", "cntrctMth");
            column.put("cipOfCustomer", "custmemberNo");
            column.put("supportModel", "techdItemmodel");
            column.put("supportVersion", "techdItemversion");
            column.put("supportStep", "techdSteps");
            column.put("created", "regdatetime");
            column.put("modified", "moddatetime");
        }

        return fieldMap;
    }

    // === P U B L I C _ M E T H O D ===

    public String toJson() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(Include.ALWAYS);
        String result = null;
        try {
            result = mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return result;
    } // End of toJson()

    public int compareTo(Domain d) {
        if (created == null && d.created != null)
            return -1;
        else if (d.created == null && created != null)
            return 1;
        else if (created == null && d.created == null)
            return 0;
        else if (created.getTime() < d.created.getTime())
            return -1;
        else if (d.created.getTime() < created.getTime())
            return 1;
        else
            return 0;
    }

    public boolean equal(Object target) {
        boolean result = false;
        if (findDefirrentFields(target) != null && this.getClass().getName().equals(target.getClass().getName()))
            result = true;
        return result;
    }

    public String createUpdateQuery(Domain target, String tableName) {
        String result = null;
        String className = target.getClass().getName();
        String table = null, column = null;
        String[] tempStr = null;
        HashMap<String, String> tableMap = getTableMap();
        HashMap<String, String> fieldMap = null;
        Field[] targetFields = null;
        Object v1 = null, v2 = null;
        Field field;
        int x = 0;

        tempStr = className.split("\\.");
        className = tempStr[tempStr.length - 1];
        fieldMap = getFieldMap().get(className);
       
        if (fieldMap == null)
            fieldMap = new HashMap<>();
        table = tableMap.get(className) == null ? tableName : tableMap.get(className);
      
        targetFields = getAllFields(this);
      

        for (x = 0; x < targetFields.length; x++) {
            field = targetFields[x];
            field.setAccessible(true);
            column = fieldMap.get(field.getName()) != null ? fieldMap.get(field.getName()) : field.getName();
            if (className.equals("Schedule")) {
                if (field.getName() != null && (field.getName().equals("no") || field.getName().equals("job")
                        || fieldMap.get(field.getName()) == null))
                    continue; // Schedule 클래스에서 job는 테이블을 구분하기 위한 것이므로 생락함
            }
            if (column.equals("created") || column.equals("modified") || column.equals("deleted")
                    || column.equals("no"))
                continue;
            if (column.equals("desc")) {
                column = "`desc`";
            }
            try {
                v1 = field.get(this);
                v2 = field.get(target);

                if (!(v1 == null && v2 == null)
                        && (((v1 == null && v2 != null) || (v1 != null && v2 == null) || v1 != v2) || !v1.equals(v2))) {
                    if (field.getType().getName().equals(String.class.getName())) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + "'" + v2 + "'");
                    } else if (field.getType().getName().equals("int")) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + v2);
                    } else if (field.getType().getName().equals("short")) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + v2);
                    } else if (field.getType().getName().equals("float")) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + v2);
                    } else if (field.getType().getName().equals("long")) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + v2);
                    } else if (field.getType().getName().equals("double")) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + v2);
                    } else if (field.getType().getName().equals("boolean")) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + ((boolean) v2 ? 1 : 0));
                    } else if (field.getType().getName().equals("byte")) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + v2);
                    } else if (field.getType().getName().equals(Date.class.getName())) {
                        if (table.equals("swc_sopp") && (column.equals("sopptargetdate")
                                || column.equals("maintenance_s") || column.equals("maintenance_e"))) {
                            if (result == null)
                                result = "";
                            else
                                result += ", ";
                            if (column.equals("from") || column.equals("to"))
                                result += ("`" + column + "`=" + "'"
                                        + (new java.sql.Timestamp(((Date) v2).getTime())).toString().substring(0, 10)
                                        + "'");
                            else
                                result += (column + "=" + "'"
                                        + (new java.sql.Timestamp(((Date) v2).getTime())).toString().substring(0, 10)
                                        + "'");
                        } else {
                            if (result == null)
                                result = "";
                            else
                                result += ", ";
                            if (column.equals("from") || column.equals("to"))
                                result += ("`" + column + "`=" + "'"
                                        + (new java.sql.Timestamp(((Date) v2).getTime())).toString().substring(0, 10)
                                        + "'");
                            else
                                result += (column + "=" + "'"
                                        + (new java.sql.Timestamp(((Date) v2).getTime())).toString().substring(0, 10)
                                        + "'");
                        }
                    } else if (field.getType().getName().equals(java.sql.Date.class.getName())) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + "'" + (java.sql.Date.class.cast(v2)) + "'");
                    } else if (field.getType().getName().equals(java.sql.Time.class.getName())) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + "'" + (java.sql.Time.class.cast(v2)) + "'");
                    } else if (field.getType().getName().equals(java.sql.Timestamp.class.getName())) {
                        if (result == null)
                            result = "";
                        else
                            result += ", ";
                        result += (column + "=" + "'" + (java.sql.Timestamp.class.cast(v2)) + "'");
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (result != null)
            result = "UPDATE " + table + " SET " + result;

        return result;
    } // End of createUpdateQuery();

    public String createInsertQuery(String tableName, String compId) {
        String result = null, str1 = "", str2 = "";
        String className = this.getClass().getName();
        String[] tempStr = null, comp = new String[2];
        HashMap<String, String> tableMap = getTableMap();
        String table = null;
        HashMap<String, String> fieldMap = null;
        String fieldName = null;
        Field[] targetFields = null;
        Field field = null;
        Object v = null;
        boolean first = true;
        int x = 0;

        tempStr = className.split("\\.");
        className = tempStr[tempStr.length - 1];
        fieldMap = getFieldMap().get(className);
        logger.debug("[DOMAIN] fieldMap ? : " + (fieldMap == null ? "not exist" : fieldMap.size()));

        if (fieldMap == null)
            fieldMap = new HashMap<>();
        table = tableMap.get(className) == null ? tableName : tableMap.get(className);
        targetFields = getAllFields(this);

        if (table.contains("bizcore")) {
            comp[0] = "compId";
            comp[1] = "'" + compId + "'";
        } else {
            comp[0] = "compNo";
            comp[1] = "(SELECT compno FROM swc_company WHERE compid = '" + compId + "')";
        }
        if (compId != null) {
            str1 = comp[0];
            str2 = comp[1];
        } else {
            str1 = "attrib,";
            str2 = "100000,";
        }

        for (x = 0; x < targetFields.length; x++) {
            field = targetFields[x];
            field.setAccessible(true);
            fieldName = fieldMap.get(field.getName()) != null ? fieldMap.get(field.getName()) : field.getName();

            if (!table.contains("bizcore") && fieldName.equals("no"))
                continue;

            if (className.equals("Schedule")) {
                if (field.getName() != null && (field.getName().equals("no") || field.getName().equals("job")
                        || fieldMap.get(field.getName()) == null))
                    continue; // Schedule 클래스에서 job는 테이블을 구분하기 위한 것이므로 생락함
            }

            try {
                v = field.get(this);
                if (v == null)
                    continue;

                if (field.getType().getName().equals(String.class.getName())) {
                    if (fieldName.equals("desc"))
                        str1 += ("," + "`" + fieldName + "`");
                    else
                        str1 += ("," + fieldName);
                    str2 += (",'" + String.class.cast(v) + "'");
                } else if (field.getType().getName().equals("int")) {
                    if (fieldName.equals("no"))
                        str1 += ("," + "`" + fieldName + "`");
                    else
                        str1 += ("," + fieldName);
                    str2 += ("," + (int) v);
                } else if (field.getType().getName().equals("short")) {
                    if (fieldName.equals("no"))
                        str1 += ("," + "`" + fieldName + "`");
                    else
                        str1 += ("," + fieldName);
                    str2 += "," + ((short) v);
                } else if (field.getType().getName().equals("float")) {
                    str1 += ("," + fieldName);
                    str2 += ("," + (float) v);
                } else if (field.getType().getName().equals("long")) {
                    if (fieldName.equals("from") || fieldName.equals("to") || fieldName.equals("no"))
                        str1 += ("," + "`" + fieldName + "`");
                    else
                        str1 += ("," + fieldName);
                    str2 += ("," + (long) v);
                } else if (field.getType().getName().equals("double")) {
                    str1 += ("," + fieldName);
                    str2 += ("," + (double) v);
                } else if (field.getType().getName().equals("boolean")) {
                    str1 += ("," + fieldName);
                    str2 += ("," + ((boolean) v ? 1 : 0));
                } else if (field.getType().getName().equals("byte")) {
                    str1 += ("," + fieldName);
                    str2 += ("," + (byte) v);
                } else if (field.getType().getName().equals(Integer.class.getName())) {
                    str1 += ("," + fieldName);
                    str2 += ("," + (Integer) v);
                } else if (field.getType().getName().equals(Short.class.getName())) {
                    str1 += ("," + fieldName);
                    str2 += "," + ((Short) v);
                } else if (field.getType().getName().equals(Float.class.getName())) {
                    str1 += ("," + fieldName);
                    str2 += ("," + (Float) v);
                } else if (field.getType().getName().equals(Long.class.getName())) {
                    str1 += ("," + fieldName);
                    str2 += ("," + (Long) v);
                } else if (field.getType().getName().equals(Double.class.getName())) {
                    str1 += ("," + fieldName);
                    str2 += ("," + (Double) v);
                } else if (field.getType().getName().equals(Boolean.class.getName())) {
                    str1 += ("," + fieldName);
                    str2 += ("," + ((Boolean) v ? 1 : 0));
                } else if (field.getType().getName().equals(Byte.class.getName())) {
                    str1 += ("," + fieldName);
                    str2 += ("," + (Byte) v);
                } else if (field.getType().getName().equals(Date.class.getName())) {
                    if (className.equals("Sopp") && (fieldName.equals("sopptargetdate")
                            || fieldName.equals("maintenance_s") || fieldName.equals("maintenance_e"))) {
                        if (fieldName.equals("to") || fieldName.equals("from"))
                            str1 += (",`" + fieldName + "`");
                        else
                            str1 += ("," + fieldName);
                        str2 += (",'" + new java.sql.Timestamp(((Date) v).getTime()).toString().substring(0, 10) + "'");
                    } else {
                        if (fieldName.equals("to") || fieldName.equals("from"))
                            str1 += (",`" + fieldName + "`");
                        else
                            str1 += ("," + fieldName);
                        str2 += (",'" + new java.sql.Timestamp(((Date) v).getTime()) + "'");
                    }
                } else if (field.getType().getName().equals(java.sql.Date.class.getName())) {
                    if (fieldName.equals("to") || fieldName.equals("from"))
                        str1 += (",`" + fieldName + "`");
                    else
                        str1 += ("," + fieldName);
                    str2 += (",'" + java.sql.Date.class.cast(v) + "'");
                } else if (field.getType().getName().equals(java.sql.Time.class.getName())) {
                    if (fieldName.equals("to") || fieldName.equals("from"))
                        str1 += (",`" + fieldName + "`");
                    else
                        str1 += ("," + fieldName);
                    str2 += (",'" + java.sql.Time.class.cast(v) + "'");
                } else if (field.getType().getName().equals(java.sql.Timestamp.class.getName())) {
                    if (fieldName.equals("to") || fieldName.equals("from"))
                        str1 += (",`" + fieldName + "`");
                    else
                        str1 += ("," + fieldName);
                    str2 += (",'" + java.sql.Timestamp.class.cast(v) + "'");
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (!str1.equals("") && !str2.equals("")) {
            if (compId == null) {
                str1 = str1.substring(1);
                str2 = str2.substring(1);
            }
            result = "INSERT INTO " + table + "(" + str1 + ") VALUES(" + str2 + ")";
        }

        return result;
    }

    private <T> Field[] getAllFields(T t) {
        Field[] result = null;
        Class<?> clazz = t.getClass();
        ArrayList<Field> fields = new ArrayList<>();
        while (!clazz.getName().contains("Domain")) { // 상위 클래스가 null 이 아닐때까지 모든 필드를 list 에 담는다.
            fields.addAll(Arrays.asList(clazz.getDeclaredFields()));
            clazz = clazz.getSuperclass();
        }
        // return fields;
        if (fields != null) {
            result = new Field[fields.size()];
            fields.toArray(result);
        }
        return result;
    } // End of getAllFields()

    private <T> Field getFieldByName(T t, String fieldName) {
        Field field = null;
        for (Field f : getAllFields(t)) {
            if (f.getName().equals(fieldName)) {
                field = f; // 모든 필드들로부터 fieldName이 일치하는 필드 추출
                break;
            }
        }
        if (field != null) {
            field.setAccessible(true); // 접근 제어자가 private 일 경우
        }
        return field;
    } // End of getFieldByName()

    private <T> T getFieldValue(Object obj, String fieldName) {
        try {
            Field field = getFieldByName(obj, fieldName); // 해당 필드 조회 후
            return (T) field.get(obj); // get 을 이용하여 field value 획득
        } catch (IllegalAccessException e) {
            return null;
        }
    } // End of getFieldValue()

}
