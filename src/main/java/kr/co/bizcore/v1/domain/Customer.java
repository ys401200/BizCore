package kr.co.bizcore.v1.domain;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class Customer extends SimpleCustomer{

    private String email;
    private String emailForTaxbill;
    private Integer zipCode;
    private String address;
    private String phone;
    private String fax;
    private String related;
    private String remark1;
    private String remark2;
    private String typeOfBusiness;
    private String itemsOfBusiness;
    private boolean ci_manufacturer;
    private boolean ci_partner;
    private boolean ci_public;
    private boolean ci_civilian;
    private boolean tos_directProcument;
    private boolean tos_indirectProcument;
    private boolean tos_agencyProcument;
    private boolean tos_maintenance;
    private boolean tos_generalCompany;
    private boolean tos_hospital;
    private boolean tos_finance;
    private boolean tos_public;
    private boolean ti_supplier;
    private boolean ti_partner;
    private boolean ti_client;
    private boolean ti_notTrade;

    public String toJson(){
        String result = "{\"no\":" + no + ",";
        result += ("\"name\":\"" + name + "\",");
        result += ("\"taxId\":" + chk(taxId) + ",");
        result += ("\"ceoName\":" + chk(ceoName) + ",");
        result += ("\"email\":" + chk(email) + ",");
        result += ("\"emailForTaxbill\":" + chk(emailForTaxbill) + ",");
        result += ("\"zipCode\":" + zipCode + ",");
        result += ("\"address\":" + address + ",");
        result += ("\"phone\":" + chk(phone) + ",");
        result += ("\"fax\":" + chk(fax) + ",");
        result += ("\"remark1\":" + chk(remark1) + ",");
        result += ("\"remark2\":" + chk(remark2) + ",");
        result += ("\"related\":" + related + ",");

        result += "\"companyInformation\":{";
        result += ("\"manufacturer\":" + ci_manufacturer + ",");
        result += ("\"partner\":" + ci_partner + ",");
        result += ("\"public\":" + ci_public + ",");
        result += ("\"civilian\":" + ci_civilian + "},");

        result += "\"typeOfSales\":{";
        result += ("\"directProcument\":" + tos_directProcument + ",");
        result += ("\"indirectProcument\":" + tos_indirectProcument + ",");
        result += ("\"agencyProcument\":" + tos_agencyProcument + ",");
        result += ("\"maintenance\":" + tos_maintenance + ",");
        result += ("\"generalCompany\":" + tos_generalCompany + ",");
        result += ("\"hospital\":" + tos_hospital + ",");
        result += ("\"finance\":" + tos_finance + ",");
        result += ("\"public\":" + tos_public + "},");

        result += "\"transactionInformation\":{";
        result += ("\"supplier\":" + ti_supplier + ",");
        result += ("\"partner\":" + ti_partner + ",");
        result += ("\"client\":" + ti_client + ",");
        result += ("\"notTrade\":" + ti_notTrade + "}}");

        return result;
    }

    public boolean setJson(String s){
        boolean result = false;
        JSONObject j = null, j2 = null;

        if(s == null)   return result;

        try{
            j = new JSONObject(s);

            no = j.isNull("no") ? -1 : j.getInt("no");
            name = j.isNull("name") ? null : j.getString("name");
            taxId = j.isNull("taxId") ? null : j.getString("taxId");
            ceoName = j.isNull("ceoName") ? null : j.getString("ceoName");
            email = j.isNull("email") ? null : j.getString("email");
            emailForTaxbill = j.isNull("emailForTaxbill") ? null : j.getString("emailForTaxbill");
            zipCode = j.isNull("zipCode") ? -1 : j.getInt("zipCode");
            address = j.isNull("address") ? "[]" : j.getJSONArray("address").toString();
            phone = j.isNull("phone") ? null : j.getString("phone");
            fax = j.isNull("fax") ? null : j.getString("fax");
            related = j.isNull("related") ? "{}" : j.getJSONObject("related").toString();
            remark1 = j.isNull("remark1") ? null : j.getString("remark1");
            remark2 = j.isNull("remark2") ? null : j.getString("remark2");
            typeOfBusiness = j.isNull("typeOfBusiness") ? null : j.getString("typeOfBusiness");
            itemsOfBusiness = j.isNull("itemsOfBusiness") ? null : j.getString("itemsOfBusiness");
            
            if(!j.isNull("companyInformation")){
                j2 = j.getJSONObject("companyInformation");
                ci_manufacturer = j2.isNull("manufacturer") ? false : j2.getBoolean("manufacturer");
                ci_partner = j2.isNull("partner") ? false : j2.getBoolean("partner");
                ci_public = j2.isNull("public") ? false : j2.getBoolean("public");
                ci_civilian = j2.isNull("civilian") ? false : j2.getBoolean("civilian");
            }

            if(!j.isNull("typeOfSales")){
                j2 = j.getJSONObject("typeOfSales");
                tos_directProcument = j2.isNull("directProcument") ? false : j2.getBoolean("directProcument");
                tos_indirectProcument = j2.isNull("indirectProcument") ? false : j2.getBoolean("indirectProcument");
                tos_agencyProcument = j2.isNull("agencyProcument") ? false : j2.getBoolean("agencyProcument");
                tos_maintenance = j2.isNull("maintenance") ? false : j2.getBoolean("maintenance");
                tos_generalCompany = j2.isNull("generalCompany") ? false : j2.getBoolean("generalCompany");
                tos_hospital = j2.isNull("hospital") ? false : j2.getBoolean("hospital");
                tos_finance = j2.isNull("finance") ? false : j2.getBoolean("finance");;
                tos_public = j2.isNull("public") ? false : j2.getBoolean("public");;
            }

            if(!j.isNull("transactionInformation")){
                j2 = j.getJSONObject("transactionInformation");
                ti_supplier = j2.isNull("supplier") ? false : j2.getBoolean("upplier");;
                ti_partner = j2.isNull("partner") ? false : j2.getBoolean("partner");;
                ti_client = j2.isNull("client") ? false : j2.getBoolean("client");;
                ti_notTrade = j2.isNull("notTrade") ? false : j2.getBoolean("notTrade");;
            }
            result = true;
        }catch(JSONException e){e.printStackTrace();}

        return result;
    }

    private String chk(String s){return s == null ? null : "\"" + s + "\"";}
    
}




/*
companyInformation / typeOfSales / transactionInformation
no
name
taxId
ceoName

email
emailForTaxbill
address
phone
fax

zipCode 우편번호
remark1 일반메모
remark2 거래/세무메모

typeOfBusiness 업태
itemsOfBusiness 업종

* 거래여부
-- 업체정보 Company information *
manufacturer 제조사
partner 협력사
publicCustomer 공공
civilianCustomer 민수

-- typeOfSales x
directProcurement 조달-직판
indirectProcurement 조달-간판
agencyProcurement 조달-대행
maintenance 유지보수
generalCompany일반기업
hospital 병원
finance 금융
public 공공기관

-- 거래정보 Transaction information *
공급사
협력사
고객사
거래안함


related
created
modified
deleted

customer = {
    no : number, // Not display
    name : string,
    taxId : string,
    ceoName : string, // 공백포함 금지 // 이 승 우 (X) / 이승우(O)
    email : string,
    emailForTaxbill : string,
    address : array, // [기본주소,상세주소]
    phone : string, 
    fax : string, 
    zipCode : number, // 우편번호
    remark1 : text, // 일반메모
    remark2 : text, // 거래/세무메모
    typeOfBusiness : string, // 업태
    itemsOfBusiness : string, // 업종
    companyInformation : { // 택일 - 라디오버튼
        manufacturer : boolean, // 제조사 -- 업체정보 Company information *
        partner :  boolean, // 협력사 
        publicCustomer : boolean, // 공공
        civilianCustomer : boolean, // 민수
    },
    typeOfSales : { // 영업정보 / 택일 - 라디오버튼
        directProcurement : boolean, // 조달-직판
        indirectProcurement : boolean, // 조달-간판
        agencyProcurement : boolean, // 조달-대행
        maintenance : boolean, // 유지보수
        generalCompany : boolean, // 일반기업
        hospital : boolean, // 병원
        finance : boolean, // 금융
        public : boolean, // 공공기관
    },
    transactionInformation : { // 거래정보 - 다중선택 - 체크박스
        supplier : boolean, // 공급사
        partner : boolean, // 협력사
        client : boolean, // 고객사
        notTrade : boolean, // 거래안함
    },
    related : {JSON STRING},
    created : long,
    modified :  null | 1666684378662,
    deleted :  null | 1666684378662
}


*/