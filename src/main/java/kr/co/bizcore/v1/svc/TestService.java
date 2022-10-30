package kr.co.bizcore.v1.svc;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.bizcore.v1.domain.Contract;

@Service
@Transactional
public class TestService extends Svc{

    public String test1(){
        return (new Date(testMapper.test().getTime() + timeCorrect)).toString();
    }

    public String test2(){
        String result = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement("SELECT NOW()");
            rs = pstmt.executeQuery();
            if(rs.next())   result = rs.getDate(1).toString();
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return result;
    }

    // 전자결재 문서의 첨부파일을 DB에서 다운받아서 저장하는 메서드
    public void dbToStorageGwFile(){
        String sql1 = "SELECT fileid FROM swcore.swc_businessfiledata WHERE attrib NOT LIKE 'XXX%' AND filename <> ''";
        String sql2 = "SELECT filename, uploaddate, filecontent, docno FROM swcore2.swc_businessfiledata WHERE fileid = ?";
        String dirPath = null;
        String fileName = null;
        String rootPath = "/Users/jbi/Desktop/bizUpload/vtek/appDoc/";
        File file = null;
        File dir = null;
        Blob blob = null;
        byte[] buffer = new byte[1024];
        InputStream is = null;
        FileOutputStream fos = null;
        long fileDate = 0;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        ArrayList<String> ids = new ArrayList<>();
        int delete = 0, create = 0, x = 0, length = -1;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            rs = pstmt.executeQuery();
            while(rs.next()){
                ids.add(rs.getString(1));
            }

            // DB의 파일 ID를 가져온 후 이를 표현하고 다음 작업을 준비함
            System.out.println("[TEST SVC] ::::: get File ID's count : " + ids.size());
            if(rs != null)  rs.close();
            if(pstmt != null)   pstmt.close();

            for(x = 0 ; x < ids.size() ; x++){

                // HTTP 타임아웃 방지
                if(x <= 248) continue;

                pstmt = conn.prepareStatement(sql2);
                pstmt.setString(1, ids.get(x));
                rs = pstmt.executeQuery();
                if(rs.next()){
                    fileName = rs.getString(1);
                    fileDate = rs.getDate(2).getTime();
                    fileDate += rs.getTime(2).getTime();
                    dirPath = rs.getInt(4) + "";
                    dir = new File(rootPath + dirPath);
                    if(!dir.exists())   dir.mkdirs();
                    file = new File(rootPath + dirPath + "/" + fileName);
                    if(file.exists() && file.delete()) delete++;

                    System.out.println("[TEST SVC] count : " + x + " / create : " + create + " / delete : " + delete + " / docno : " + dirPath);

                    blob = rs.getBlob(3);
                    is = blob.getBinaryStream();
                    fos = new FileOutputStream(file);
                    while((length = is.read(buffer)) != -1){
                        fos.write(buffer, 0, length);
                    }
                    file.setLastModified(fileDate);
                    fos.close();
                    is.close();
                    create++;
                }
                if(rs != null)  rs.close();
                if(pstmt != null)   pstmt.close();
                //System.out.println("[TEST SVC] count : " + x + " / create : " + create + " / delete : " + delete + " / docno : " + dirPath);
            }

        }catch(Exception e){e.printStackTrace();}finally{
            try{
                if(rs != null)  rs.close();
                if(pstmt != null)   pstmt.close();
                if(conn != null)    conn.close();
            }catch(Exception e){System.out.println("[ERROR] ===== Closing Error =====");e.printStackTrace();}
        }
    } 

    public String docList(){
        String result = null;
        String sql1 = "SELECT docno AS no, doccruserno AS writer, doctype AS type, doctitle AS title, docstatus AS status, linksoppno AS sopp, linkcustno AS customer, docdesc AS content, docformno AS form, docdrawstatus AS draw, docdate AS created FROM swcore.swc_businessdoc WHERE attrib NOT LIKE 'XXX%' ORDER BY docno DESC";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String xType = null, xTitle = null, xContent = null, xForm = null;
        Date xDate = null;
        int xNo = -1, xWriter = -1, xStatus = -1, xSopp = -1, xCustomer = -1, xDraw = -1;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            rs = pstmt.executeQuery();

            while(rs.next()){
                xNo = rs.getInt(1);
                xWriter = rs.getInt(2);
                xType = rs.getString(3);
                xTitle = rs.getString(4);
                xStatus = rs.getInt(5);
                xSopp = rs.getInt(6);
                xCustomer = rs.getInt(7);
                xContent = rs.getString(8);
                xForm = rs.getString(9);
                xDraw = rs.getInt(10);
                xDate = rs.getDate(11);

                if(result == null)  result = "[";
                else                result += ",";

                result += ("{\"no\":" + xNo + ",");
                result += ("\"writer\":" + xWriter + ",");
                result += ("\"type\":" + (xType == null ? "null" : "\"" + xType + "\"") + ",");
                result += ("\"title\":" + (xTitle == null ? "null" : "\"" + xTitle + "\"") + ",");
                result += ("\"status\":" + xStatus + ",");
                result += ("\"sopp\":" + xSopp + ",");
                result += ("\"customer\":" + xCustomer + ",");
                result += ("\"content\":" + (xContent == null ? "null" : "\"" + xContent.replaceAll("\"", "\\u0022").replaceAll("\t", "\\u0022") + "\"") + ",");
                result += ("\"form\":" + (xForm == null ? "null" : "\"" + xForm + "\"") + ",");
                result += ("\"draw\":" + xDraw + ",");
                result += ("\"created\":" + ( xDate == null ? "null" : xDate.getTime()) + "}");


                xType = null;
                xTitle = null;
                xContent = null;
                xForm = null;
                xDate = null;
                xNo = -1;
                xWriter = -1;
                xStatus = -1;
                xSopp = -1;
                xCustomer = -1;
                xDraw = -1;
            }
            if(result != null)  result += "]";
        }catch(Exception e){e.printStackTrace();}

        return result;
    }

    public String attList(){
        String result = null;
        String sql1 = "SELECT CONCAT('H',CAST(attendId AS CHAR)) AS no, userno AS writer, atttype AS type, attstatus AS status, soppno AS sopp, attdesc AS content, regdate AS created, attstart AS st, attend AS ed FROM swcore.swc_userattend WHERE compno=100002 AND attrib NOT LIKE 'XXX%'";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String xNo = null, xContent = null;
        Date xCreated = null, xStart = null, xEnd = null;
        int xWriter = -1, xType = -1, xStatus = -1;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            rs = pstmt.executeQuery();

            while(rs.next()){
                xNo = rs.getString(1);
                xWriter = rs.getInt(2);
                xType = rs.getInt(3);
                xStatus = rs.getInt(4);
                xContent = rs.getString(5);
                xCreated = rs.getDate(6);
                xStart = rs.getDate(7);
                xEnd = rs.getDate(8);

                if(result == null)  result = "[";
                else                result += ",";

                result += ("{\"no\":" + xNo + ",");
                result += ("\"writer\":" + xWriter + ",");
                result += ("\"type\":" + xType + ",");
                result += ("\"status\":" + xStatus + ",");
                result += ("\"content\":" + (xContent == null ? "null" : "\"" + xContent.replaceAll("\"", "\\u0022").replaceAll("\t", "\\u0022") + "\"") + ",");
                result += ("\"created\":" + (xCreated == null ? "null" :xCreated.getTime()) + ",");
                result += ("\"start\":" + (xStart == null ? "null" : xStart.getTime()) + ",");
                result += ("\"end\":" + (xEnd == null ? "null" : xEnd.getTime()) + "}");
            }
            if(result != null)  result += "]";
        }catch(Exception e){e.printStackTrace();}

        return result;
    }

    public String docData(String docNo){
        String result = null;
        String sql1 = "SELECT custname AS customer, productname AS product, productnetprice AS price, productqty AS qty, productamount AS subtotal, productvat AS tax, producttotal AS total, productremark AS remark, productDate AS dt FROM swcore.swc_businessdocdata WHERE attrib NOT LIKE 'XXX%' AND docno = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String xCustomer = null, xProduct = null, xRemark = null;
        int xQty = -1;
        long xPrice = -1, xSubtotal = -1, xTax = -1, xTotal = -1, xDt = -1;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, docNo);
            rs = pstmt.executeQuery();

            while(rs.next()){
                xCustomer = rs.getString(1);
                xProduct = rs.getString(2).replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "").replaceAll("\"", "\\u0022");
                xPrice = rs.getLong(3);
                xQty = rs.getInt(4);
                xSubtotal = rs.getLong(5);
                xTax = rs.getLong(6);
                xTotal = rs.getLong(7);
                xRemark = rs.getString(8);
                xDt = rs.getDate(9) == null ? -1 : rs.getDate(9).getTime();

                if(result == null)  result = "[";
                else                result += ",";

                result += ("{\"customer\":" + (xCustomer == null ? "null" : "\"" + xCustomer + "\"") + ",");
                result += ("\"product\":" + (xProduct == null ? "null" : "\"" + xProduct + "\"") + ",");
                result += ("\"price\":" + xPrice + ",");
                result += ("\"quantity\":" + xQty + ",");
                result += ("\"subTotal\":" + xSubtotal + ",");
                result += ("\"tax\":" + xTax + ",");
                result += ("\"total\":" + xTotal + ",");
                result += ("\"date\":" + xDt + ",");
                result += ("\"remark\":" + (xRemark == null ? "null" : "\"" + xRemark + "\"") + "}");


                xCustomer = null;
                xProduct = null;
                xRemark = null;
                xQty = -1;
                xPrice = -1;
                xSubtotal = -1;
                xTax = -1;
                xTotal = -1;
                xDt = -1;
            }
            if(result != null)  result += "]";
        }catch(Exception e){e.printStackTrace();}

        return result;
    }

    public String docFile(String docNo){
        String result = null;
        String sql1 = "SELECT fileName FROM swcore.swc_businessfiledata WHERE attrib NOT LIKE 'XXX%' AND docno = ?";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String fileName = null;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, docNo);
            rs = pstmt.executeQuery();
            
            while(rs.next()){
                fileName = rs.getString(1);
                if(result == null)  result = "[";
                else                result += ",";
                result += ("\"" + fileName + "\"");
            }
            if(result != null)  result += "]";
        }catch(Exception e){e.printStackTrace();}

        return result;
    }
    
    public String docApp(String docNo){
        String result = null;
        String sql1 = "SELECT usernocr AS writer, usernois AS request, usernoapp AS app, appstatus AS status, issuedate AS issued, appdate AS approved, appcomment AS comment FROM swcore.swc_businessdocapp WHERE attrib NOT LIKE 'XXX%' AND docno = ? ORDER BY appid";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String xStatus = null, xComment = null;
        Date issued = null, approved = null;
        int xWriter = -1, xRequest = -1, xApp = -1;

        try{
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, docNo);
            rs = pstmt.executeQuery();
            
            while(rs.next()){
                xWriter = rs.getInt(1);
                xRequest = rs.getInt(2);
                xApp = rs.getInt(3);
                xStatus = rs.getString(4);
                issued = rs.getDate(5);
                approved = rs.getDate(6);
                xComment = rs.getString(7);

                if(result == null)  result = "[";
                else                result += ",";
                
                result += ("{\"writer\":" + xWriter + ",");
                result += ("\"request\":" + xRequest + ",");
                result += ("\"app\":" + xApp + ",");
                result += ("\"status\":" + (xStatus == null ? "null" : "\"" + xStatus + "\"") + ",");
                result += ("\"issued\":" + (issued == null ? "null" : issued.getTime() ) + ",");
                result += ("\"approved\":" + (approved == null ? "null" : approved.getTime() ) + ",");
                result += ("\"comment\":" + (xComment == null ? "null" : "\"" + xComment + "\"") + "}");
            }
            if(result != null)  result += "]";
        }catch(Exception e){e.printStackTrace();}

        return result;
    }

    public String testDate(){
        String result = null;
        //Contract cnt = 


        return result;
    }

    public String getEstmInfo() {
        String result = null;
        String sql1 = "SELECT estid no, estver `version`, esttitle title, ifnull(custno,0) customer, ifnull(soppno,0) sopp, userno writer, estamount total, estvat tax, unix_timestamp(estdate)*1000 `date`, unix_timestamp(regdate)*1000 `created`,estno l_estno, esttype l_type from swcore.swc_est where attrib not like 'XXX%' and compno = 100002";
        String sql2 = "";
        String sql3 = "";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        HashMap<String, JSONObject> estms = new HashMap<>();
        JSONObject item = null, version = null, estm = null;
        JSONArray items = null;
        String xNo = null, xTitle = null, xlType = null;
        long xDate = 0, xCreated = 0;
        int xVersion = 0, xCustomer = 0, xSopp = 0, xWriter = 0, xTotl = 0, xTotal = 0, xlEstno = 0, xVat = 0, zVersion = 0, zQuantity = 0, zPrice = 0;
        boolean zVat = false;

        try{
            conn = sqlSession.getConnection();

            // 견적 마스터 목록
            pstmt = conn.prepareStatement(sql1);
            rs = pstmt.executeQuery();
            while(rs.next()){
                xNo = rs.getString("no");
                xTitle = rs.getString("title");
                xlType = rs.getString("l_type");
                xVersion = rs.getInt("version");
                xCustomer = rs.getInt("customer");
                xSopp = rs.getInt("sopp");
                xWriter = rs.getInt("writer");
                xTotal = rs.getInt("customer");
                xVat = rs.getInt("tax");
                xDate = rs.getLong("date");
                xCreated = rs.getLong("created");

                estm = new JSONObject();
                estm.put("no", xNo);
                estm.put("title", xTitle);
                estm.put("lType", xlType);
                estm.put("version", xVersion);
                estm.put("customer", xCustomer);
                estm.put("sopp", xSopp);
                estm.put("writer", xWriter);
                estm.put("total", xTotal);
                estm.put("vat", xVat);
                estm.put("date", xDate);
                estm.put("created", xCreated);
                estms.put(xNo, estm);
            }

            // 견적 상세 정보
        }catch(SQLException e){e.printStackTrace();}
        
        return result;
    }
}
