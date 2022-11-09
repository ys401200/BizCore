package kr.co.bizcore.v1.svc;

import org.apache.ibatis.javassist.compiler.ast.IntConst;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
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
import kr.co.bizcore.v1.domain.Customer;
import kr.co.bizcore.v1.domain.Product;
import kr.co.bizcore.v1.domain.SimpleCustomer;
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

        urls = (List<ConnUrl>) dataFactory.getData("ALL", "connUrl");
        if (urls == null) {
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
    public String getCustomers(String compId, boolean map) {
        String result = null;
        SimpleCustomer each = null;
        List<SimpleCustomer> list = null;
        int x = 0;

        list = commonMapper.getCustomerList(compId);

        if (map) { // 맵 형식
            if (list != null && list.size() > 0) {
                for (x = 0; x < list.size(); x++) {
                    if (result == null)
                        result = "{";
                    else
                        result += ",";
                    each = list.get(x);
                    result += ("\"" + each.getNo() + "\":" + each.toJson());
                }
            }
            result += "}";
        } else { // 배열 형식
            if (list != null && list.size() > 0) {
                for (x = 0; x < list.size(); x++) {
                    if (result == null)
                        result = "[";
                    else
                        result += ",";
                    result += list.get(x).toJson();
                }
            }
            result += "]";
        }
        return result;
    } // End of getCustomers()

    // 일련번호를 받아서 해당 고객사를 전달하느 메서드
    public Customer getCustomer(String compId, int no) {
        Customer result = null;
        result = commonMapper.getCustomeByNo(compId, no);
        return result;
    } // End of getCustomers()

    // 일련번호를 받아서 해당 고객사를 전달하느 메서드
    public String getCustomerByNo(String compId, int no) {
        Customer result = null;
        result = commonMapper.getCustomeByNo(compId, no);
        return result == null ? null : result.toJson();
    } // End of getCustomers()

    // 사업자번호를 받아서 해당 고객사를 전달하느 메서드
    public String getCustomerByTaxId(String compId, String taxId) {
        Customer result = null;
        result = commonMapper.getCustomeByTaxId(compId, taxId);
        return result == null ? null : result.toJson();
    } // End of getCustomers()

    // 고객사 정보를 추가하는 메서드
    public int addCustomer(String compId, Customer customer) {
        int result = -1;
        String sql = null;
        result = getNextNumberFromDB(compId, "bizcore.customer");
        customer.setNo(result);
        sql = customer.createInsertQuery("bizcore.customer", compId);
        result = executeSqlQuery(sql) > 0 ? result : -1;
        return result;
    }

    // 고객사 정보를 수정하는 메서드
    public int modifyCustomer(String compId, Customer customer) {
        int result = -1;
        String sql = null;
        Customer ogn = commonMapper.getCustomeByNo(compId, customer.getNo());
        logger.error("SystemService.modifyCustomer() ::::::: Customer = " + customer.toJson());
        logger.error("SystemService.modifyCustomer() ::::::: ogn = " + ogn.toJson());
        if (ogn == null)
            return -9999;
        sql = ogn.createUpdateQuery(customer, "bizcore.customer") + " WHERE deleted IS NULL AND compId = '" + compId + "' AND no = " + customer.getNo();
        logger.error("SystemService.modifyCustomer() ::::::: sql = " + sql);
        result = executeSqlQuery(sql) > 0 ? result : -1;
        return result;
    }

    // 고객사 정보를 삭제하는 메서드
    public int removeCustomer(String compId, int no) {
        int result = -1;
        result = commonMapper.removeCustomer(compId, no);
        return result;
    }

    public String getBasicInfo(String compId, String userNo, String version) {
        String result = null, company = null, permission = null, t = null;
        String[] data = new String[5];
        List<HashMap<String, String>> list = null;
        Map<String, String> map = null;
        Object[] keyset = null;
        int x = 0;

        // 회사 정보
        map = commonMapper.getCompanyInfo(compId);
        if (map != null) {
            data[0] = map.get("comname");
            data[1] = map.get("comaddress");
            data[2] = map.get("comphone");
            data[3] = map.get("comfax");
            data[4] = map.get("comboss");
            company = "{\"name\":\"" + data[0] + "\",";
            company += ("\"address\":\"" + data[1] + "\",");
            company += ("\"phone\":\"" + data[2] + "\",");
            company += ("\"fax\":\"" + data[3] + "\",");
            company += ("\"ceo\":\"" + data[4] + "\"}");
        }

        // 전사권한
        list = systemMapper.getEmployeeCompPermission(compId, userNo);
        map = new HashMap<>();
        map.put("hr", "0");
        map.put("accounting", "0");
        map.put("docmng", "0");
        map.put("manager", "0");
        if(list != null)    for(x = 0 ; x < list.size() ; x++)  map.put(list.get(x).get("f"), list.get(x).get("p"));
        keyset = map.keySet().toArray();
        permission = "{";
        for(Object o : keyset)  permission += ("\"_" + o + "\":" + (map.get(o).equals("1") + ","));
        // 부서권한
        list = systemMapper.getEmployeeDeptPermission(compId, userNo);
        for(x = 0 ; x < list.size() ; x++){
            map = list.get(x);
            if(t == null){
                t = map.get("dept");
                permission += ("\"" + t + "\":{");
            }else if(!t.equals(map.get("dept"))){
                t = map.get("dept");
                permission += ("},\"" + t + "\":{");
            }else   permission += ",";
            if(map.get("func_id") != null)  result += ("\"" + map.get("func_id") + "\":true");
        }
        permission += "}}";




        result = "{\"my\":" + userNo + ",";
        result += ("\"widget\":[\"notice/0\"],");
        result += ("\"company\":" + company + ",");
        result += ("\"permission\":" + permission + ",");
        result += ("\"version\":\"" + version + "\"");
        result += "}";

        return result;
    } // End of getBasicInfo

    public List<String> getCompanyList() {
        return commonMapper.companyList();
    }

    public String getCommonCode(String compId) {
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
        if (list1 != null && list1.size() > 0)
            for (x = 0; x < list1.size(); x++) { // if * for / Level : 1
                map1 = list1.get(x);
                arr1 = new String[3];
                arr1[0] = map1.get("a");
                arr1[1] = map1.get("b");
                arr1[2] = map1.get("c");
                code1 = new CommonCode(arr1);
                // root.add(code1);
                list2 = commonMapper.getCommonCodeLevel2(code1.getChildSelector(), compId);
                if (list2 != null && list2.size() > 0)
                    for (y = 0; y < list2.size(); y++) { // if * for / Level : 2
                        map2 = list2.get(y);
                        arr2 = new String[3];
                        arr2[0] = map2.get("a");
                        arr2[1] = map2.get("b");
                        arr2[2] = map2.get("c");
                        code2 = new CommonCode(arr2);
                        // code1.addChildren(code2);
                        root.add(code2);
                        list3 = commonMapper.getCommonCodeLevel3(code2.getChildSelector(), compId);
                        if (list3 != null && list3.size() > 0)
                            for (z = 0; z < list3.size(); z++) { // if * for / Level : 3
                                map3 = list3.get(z);
                                arr3 = new String[3];
                                arr3[0] = map3.get("a");
                                arr3[1] = map3.get("b");
                                arr3[2] = map3.get("c");
                                code3 = new CommonCode(arr3);
                                code2.addChildren(code3);
                            } // END /if * for / Level : 3
                    } // END / if * for / Level : 2
            } // END / if * for / Level : 1
              // 3계계 코드 체계에 대한 데이터 가져오기 끝

        // 토드/값이 아닌 코드번호/값 으로 세팅된 코드들에 대한 땜빵코드 / 아래 for(x) 하단의 코드에서 기존 json 에 값 추가코드 작성함
        list3 = commonMapper.getEtcCode(compId);

        if (root != null && root.size() > 0) {
            result = "{";
            for (x = 0; x < root.size(); x++) {
                children = root.get(x).getChildren();
                if (x > 0)
                    result += ",";
                result += ("\"" + root.get(x).getDesc() + "\":{");
                if (children != null && children.size() > 0)
                    for (y = 0; y < children.size(); y++) {
                        if (y > 0)
                            result += ",";
                        result += ("\"" + children.get(y).getValue() + "\":\"" + children.get(y).getDesc() + "\"");
                    }
                result += "}";
                // result += root.get(x).toString();
            }

            // 땜빵코드 시작
            if (list3 == null || list3.size() == 0)
                result += "}";
            else {
                result += ",\"etc\":{";
                for (z = 0; z < list3.size(); z++) {
                    map3 = list3.get(z);
                    if (z > 0)
                        result += ",";
                    result += ("\"" + map3.get("no") + "\":\"" + map3.get("value") + "\"");
                }
                result += "}}";
            }
            // 땜빵코드 종료
        }

        return result;
    } // End of getCommonCode2()

    public long timeCorrection() {
        long t = 0L, server = 0L, db = 0L;
        server = System.currentTimeMillis() / 1000;
        db = systemMapper.getCurrentTimeFromDB();
        t = (db - server) / 60;
        t = t * 60000;
        timeCorrect = t;
        return t;
    } // End of timeCorrection()

    public String getMyInfo(String userNo, String pw, String compId) {
        String result = null;
        String sql1 = "SELECT pw, PASSWORD(?) FROM bizcore.users WHERE compId=? AND no=? AND deleted IS NULL";
        String sql2 = "SELECT userId, userName, rank, UNIX_TIMESTAMP(birthDay)*1000 AS birthDay, gender, email, address, zipCode, homePhone, cellPhone, UNIX_TIMESTAMP(created)*1000 AS created, UNIX_TIMESTAMP(modified)*1000 AS modified FROM bizcore.users WHERE no = ? AND compId = ? AND deleted IS NULL";
        String pw1 = null, pw2 = null;
        String userId = null, userName = null, email = null, address = null, homePhone = null, cellPhone = null;
        Integer zipCode = -1, rank = null, gender = null;
        Long birthDay = null, created = null, modified = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        // DB 컨버팅으로 인한 과도기 코드 작성 // 2022.9.14
        // my = userMapper.getMy(userNo, pw, compId);
        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, pw);
            pstmt.setString(2, compId);
            pstmt.setString(3, userNo);
            rs = pstmt.executeQuery();

            if (!rs.next())
                return null;
            pw1 = rs.getString(1);
            pw2 = rs.getString(2);
            rs.close();
            pstmt.close();

            if (!pw1.equals(pw2) && !encSHA512(pw).equals(pw1))
                return null;

            pstmt = conn.prepareStatement(sql2);
            pstmt.setString(1, userNo);
            pstmt.setString(2, compId);
            rs = pstmt.executeQuery();

            if (!rs.next())
                return null;
            userId = rs.getString("userId");
            userName = rs.getString("userName");
            rank = rs.getInt("rank");
            birthDay = rs.getLong("birthDay");
            gender = rs.getInt("gender");
            email = rs.getString("email");
            address = rs.getString("address");
            zipCode = rs.getInt("zipCode");
            homePhone = rs.getString("homePhone");
            cellPhone = rs.getString("cellPhone");
            created = rs.getLong("created");
            modified = rs.getLong("modified");

            result = "{";
            result += ("\"userId\":\"" + userId + "\",");
            result += ("\"userName\":\"" + userName + "\",");
            result += ("\"rank\":" + rank + ",");
            result += ("\"birthDay\":" + birthDay + ",");
            result += ("\"gender\":" + gender + ",");
            result += ("\"email\":\"" + email + "\",");
            result += ("\"address\":\"" + address + "\",");
            result += ("\"zipCode\":" + zipCode + ",");
            result += ("\"homePhone\":\"" + homePhone + "\",");
            result += ("\"cellPhone\":\"" + cellPhone + "\",");
            result += ("\"created\":" + created + ",");
            result += ("\"modified\":" + modified);
            result += "}";
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return result;
    }

    public int modifyPassword(String old, String neww, String userNo, String compId) {
        return userMapper.modifyMyPw(compId, userNo, encSHA512(old), encSHA512(neww));

    }

    public void modifyMyInfo(String compId, String userNo, String email, String address, String homePhone,
            String cellPhone, Integer zipCode) {
        String temp = null, image = null, s = File.separator;
        File tempFile = null, imageFile = null;
        FileInputStream fin = null;
        FileOutputStream fout = null;
        byte[] buffer = new byte[1024];
        int read = -1;

        temp = fileStoragePath + s + compId + s + "temp" + s + userNo;
        image = fileStoragePath + s + compId + s + "userPicture" + s + userNo;
        tempFile = new File(temp);
        if (tempFile.exists()) {
            imageFile = new File(image);
            if (tempFile.renameTo(imageFile)) { // 1차 : renameTo()로 간단히 이동 시도

            } else { // 실패시 2차 시도 : 파일 읽어서 이동 후 임시 파일 삭제
                try {
                    fin = new FileInputStream(tempFile);
                    fout = new FileOutputStream(imageFile);
                    read = 0;
                    while ((read = fin.read(buffer, 0, buffer.length)) != -1) {
                        fout.write(buffer, 0, read);
                    }
                    fin.close();
                    fout.flush();
                    fout.close();
                    tempFile.delete();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        userMapper.modifyMyInfo(compId, userNo, email, address, homePhone, cellPhone, zipCode);
    }

    // 고객사 담당자 목록을 전달하는 메서드
    public String cipInfo(String compId) {
        String result = null;
        int x = 0;
        List<HashMap<String, String>> list = null;
        HashMap<String, String> each = null;

        list = commonMapper.getCipInfo();
        if (list != null && list.size() > 0)
            for (x = 0; x < list.size(); x++) {
                each = list.get(x);
                if (result == null)
                    result = "{";
                else
                    result += ",";
                result += ("\"" + each.get("no") + "\":{");
                result += ("\"name\":\"" + each.get("name") + "\",");
                result += ("\"rank\":\"" + each.get("rank") + "\",");
                result += ("\"customer\":\"" + each.get("cust") + "\"}");
            }
        if (result != null)
            result += "}";

        return result;

    }

    // 고객사 담당자 이름을 전달하는 메서드
    public String cipInfo(String compId, String no) {
        return commonMapper.getCipName(no);
    }

    // 첨부파일 등을 임시로 저장하는 메서드
    public boolean saveAtteachedToTemp(String compId, String fileName, byte[] fileData) {
        boolean result = false;
        String s = File.separator, compDir = fileStoragePath + s + compId;
        File target = null;
        FileOutputStream fos = null;

        target = new File(compDir + s + "temp" + s + fileName);
        try {
            fos = new FileOutputStream(target);
            fos.write(fileData);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    } // End of saveAtteachedToTemp()

    // 어플리케이션 초기화 시 파일 저장 디렉토리를 검증/생성하기 위한 디렉토리 이름을 가져오는 메서드
    public List<String> getDefaultDirectories() {
        return systemMapper.getDirectoryNames();
    } // getDefaultDirectories()

    // 각 고객시별 디스크 사용량을 확인하는 메서드
    public HashMap<String, Long> checkUsedSpaceOnDisc() {
        HashMap<String, Long> result = null;
        String rootPath = fileStoragePath, s = File.separator, compId = null;
        List<String> companies = getCompanyList();
        Long size = 0L;
        File dir = null;
        int x = 0;

        for (x = 0; x < companies.size(); x++) {
            compId = companies.get(x);
            dir = new File(rootPath + s + compId);
            if (result == null)
                result = new HashMap<>();
            size = checkUsedSpace(dir);
            result.put(compId, size);
        }

        return result;
    } // End of checkUsedSpaceOnDisc

    // 단일 고객시별 디스크 사용량을 확인하는 메서드
    public long checkUsedSpaceOnDisc(String compId) {
        String rootPath = fileStoragePath, s = File.separator;
        long size = 0;
        File dir = null;

        dir = new File(rootPath + s + compId);
        size = checkUsedSpace(dir);

        return size;
    } // End of checkUsedSpaceOnDisc

    private long checkUsedSpace(File file) {
        long size = 0;
        int x = 0;
        File[] dirs = null;
        if (file == null || !file.exists())
            return 0;
        else if (file.isFile())
            file.length();
        else {
            dirs = file.listFiles();
            for (x = 0; x < dirs.length; x++)
                size += dirs[x].length();
        }
        return size;
    } // End of checkUsedSpace

    public String getProductListXX(String compId) {
        String result = null;
        List<Product> list = null;
        int x = 0;

        list = productMapper.getProductList(compId);
        result = "[";
        if (list != null && list.size() > 0)
            for (x = 0; x < list.size(); x++) {
                if (x > 0)
                    result += ",";
                result += list.get(x).toJson();
            }
        result = "]";

        return result;
    } // End of getProductList()

    public String getProductList(String compId) {
        String result = null;
        List<Product> list = null;
        int x = 0;

        list = productMapper.getProductList(compId);
        if (list != null && list.size() > 0) {
            for (x = 0; x < list.size(); x++) {
                if (result == null)
                    result = "[";
                else
                    result += ",";
                result += list.get(x).toJson();
            }
        }
        result += "]";

        return result;
    } // End of getProductList()

    public String getProductList(String compId, int start, int end) {
        String result = null;
        List<Product> list = null;
        int x = 0;

        list = productMapper.getProductListWithStartAndEnd(compId, start, end);
        result = "[";
        if (list != null && list.size() > 0)
            for (x = 0; x < list.size(); x++) {
                if (x > 0)
                    result += ",";
                result += list.get(x).toJson();
            }
        result = "]";

        return result;
    } // End of getProductList()

    public int getProductCount(String compId) {
        return productMapper.getProductCount(compId);
    }

    public Product getProduct(String compId, int no) {
        Product result = null;
        result = productMapper.getProduct(compId, no);
        return result;
    } // End of getProduct()

    public int addProduct(String compId, Product prod) {
        int result = -1;
        String sql = null;
        if (prod != null) {
            sql = prod.createInsertQuery(null, compId);
            result = executeSqlQuery(sql);
        }
        return result;
    } // End of addProduct()

    public int modifyProduct(String compId, int no, Product prod) {
        int result = -1;
        String sql = null;
        Product ogn = null;
        ogn = productMapper.getProduct(compId, no);
        if (ogn != null && prod != null) {
            sql = ogn.createUpdateQuery(prod, "bizcore.product") + " WHERE deleted IS NULL AND compId = '" + compId + "' AND no = " + prod.getNo();
            result = executeSqlQuery(sql);
        }
        return result;
    } // End of modifyProduct()

    public int removeProduct(String compId, int no) {
        int result = -1;
        result = productMapper.removeProduct(compId, no);
        return result;
    } // End of removeProduct()

    // 영업목표 가져오는 메서드
    public String getSalesGoals(String compId, String userNo, int year) {
        String result = null, empNo = null, t1 = null, t2 = null;
        String sql1 = "WITH RECURSIVE r AS(SELECT org_code AS id, org_mcode AS parent FROM swcore.swc_organiz WHERE org_code IN (SELECT dept_id FROM bizcore.user_dept WHERE comp_id = ? AND user_no = ?) AND compno = (SELECT compno FROM swc_company WHERE compid = ?) UNION ALL SELECT org_code AS id, org_mcode AS parent FROM swcore.swc_organiz a INNER JOIN r ON a.org_mcode = r.id) SELECT id FROM r";
        String sql2 = "SELECT CAST(user_no AS CHAR) FROM bizcore.user_dept WHERE comp_id  = ? AND dept_id = ?";
        String sql3 = "SELECT month, goal FROM bizcore.sales_goals WHERE deleted IS NULL AND compId = ? and userNo = ? AND year = ?";
        String sql4 = "SELECT `month`, SUM(goal) FROM bizcore.sales_goals WHERE deleted IS NULL AND compId = ? AND `year` = ? GROUP BY `month`"; // 회사
                                                                                                                                                 // 전체
                                                                                                                                                 // 합계
                                                                                                                                                 // 가져오는
                                                                                                                                                 // 쿼리
        long[] company = new long[12], larr = null;
        HashMap<String, HashMap<String, Long[]>> all = new HashMap<>();
        HashMap<String, Long[]> dept = null;
        Long[] emp = null;
        Long each = null;
        Object[] keyset1 = null;
        Object[] keyset2 = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int x = 0, y = 0, z = 0;

        try {
            conn = sqlSession.getConnection();

            // 사용자의 소속 부서를 가져온다
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, compId);
            pstmt.setString(2, userNo);
            pstmt.setString(3, compId);
            rs = pstmt.executeQuery();
            while (rs.next())
                all.put(rs.getString(1), new HashMap<>());
            rs.close();
            pstmt.close();

            // 부서 아이디 기준 소속 부서원들의 사번을 가져온다
            keyset1 = all.keySet().toArray();
            for (Object o : keyset1) {
                pstmt = conn.prepareStatement(sql2);
                pstmt.setString(1, compId);
                pstmt.setString(2, (String) o);
                rs = pstmt.executeQuery();
                while (rs.next()) {
                    dept = all.get(o);
                    dept.put(rs.getString(1), new Long[12]);
                }
                rs.close();
                pstmt.close();
            }

            // 사번 기준 계획을 가져와서 세팅한다
            for (Object o : keyset1) {
                dept = all.get(o);
                keyset2 = dept.keySet().toArray();
                for (Object n : keyset2) {
                    pstmt = conn.prepareStatement(sql3);
                    pstmt.setString(1, compId);
                    pstmt.setString(2, (String) n);
                    pstmt.setInt(3, year);
                    rs = pstmt.executeQuery();
                    while (rs.next()) {
                        emp = dept.get(n);
                        emp[rs.getInt(1) - 1] = rs.getLong(2);
                    }
                    rs.close();
                    pstmt.close();
                }
            }

            // 회사 전체 합계를 가져온다
            emp = new Long[12];
            pstmt = conn.prepareStatement(sql4);
            pstmt.setString(1, compId);
            pstmt.setInt(2, year);
            rs = pstmt.executeQuery();
            while (rs.next())
                emp[rs.getInt(1) - 1] = rs.getLong(2);

        } catch (SQLException e) {
            e.printStackTrace();
        }

        // 회사 전체 목표 금액
        t1 = "[";
        for (x = 0; x < emp.length; x++) {
            if (x > 0)
                t1 += ",";
            t1 += (emp[x] == null ? 0 : emp[x]);
        }
        t1 += "]";

        x = 0;
        t2 = "";
        for (Object o : keyset1) {
            t2 += ",";
            y = 0;
            t2 += ("\"" + ((String) o) + "\":{");
            dept = all.get(o);
            keyset2 = dept.keySet().toArray();
            for (Object n : keyset2) {
                if (y == 0)
                    y++;
                else
                    t2 += ",";
                emp = dept.get(n);
                t2 += ("\"" + ((String) n) + "\":[");
                for (z = 0; z < emp.length; z++) {
                    if (z > 0)
                        t2 += ",";
                    t2 += emp[z];
                }
                t2 += "]";
            }
            t2 += "}";
        }
        t2 += "}";

        result = "{\"all\":" + t1 + t2;
        return result;
    } // End of getSalesGoals()

    // 영업목표를 설정하는 메서드 / 소속 부서원들만 수정 가능
    public String setSalesGoal(String compId, String userNo, int year, int empNo, long[] goals) {
        String result = null;
        String sql1 = "SELECT count(*) FROM (SELECT DISTINCT user_no AS a FROM bizcore.user_dept WHERE dept_id IN (WITH RECURSIVE CTE AS(SELECT org_code AS id, org_mcode AS parent FROM swcore.swc_organiz WHERE org_code IN (SELECT dept_id FROM bizcore.user_dept WHERE comp_id = ? AND user_no = ?) AND compno = (SELECT compno FROM swc_company WHERE compid = ?) UNION ALL SELECT org_code AS id, org_mcode AS parent FROM swcore.swc_organiz a INNER JOIN CTE ON a.org_mcode = CTE.id) SELECT id FROM CTE)) a WHERE a.a = ?"; // 권한검증
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     // 쿼리
        String sql2 = "SELECT month FROM bizcore.sales_goals WHERE deleted IS NULL AND compId = ? AND userNo = ? AND `year` = ?";
        String sql3 = "UPDATE bizcore.sales_goals SET goal = ?, modified = NOW() WHERE deleted IS NULL AND compId = ? AND userNo = ? AND `year` = ? AND `month` = ?";
        String sql4 = "INSERT INTO bizcore.sales_goals(compId, userNo, `year`, `month`, goal) VALUES(?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        boolean[] barr = null;
        int x = 0, y = 0;

        // 데이터 검증
        if (goals == null || goals.length < 12)
            return result;

        try {
            conn = sqlSession.getConnection();

            // 권한 검증
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, compId);
            pstmt.setString(2, userNo);
            pstmt.setString(3, compId);
            pstmt.setString(4, empNo + "");
            rs = pstmt.executeQuery();
            if (rs.next())
                x = rs.getInt(1);
            else
                x = -1;
            rs.close();
            pstmt.close();
            if (x < 1)
                return "permissionDenied";

            // 기존자료 검색
            barr = new boolean[12];
            pstmt = conn.prepareStatement(sql2);
            pstmt.setString(1, compId);
            pstmt.setString(2, empNo+"");
            pstmt.setInt(3, year);
            rs = pstmt.executeQuery();
            while (rs.next())
                barr[rs.getInt(1) - 1] = true;
            rs.close();
            pstmt.close();

            // 업데이트 또는 인서트 실행
            for (x = 0; x < barr.length; x++) {
                if (barr[x]) { // 기존 데이터 업데이트
                    pstmt = conn.prepareStatement(sql3);
                    pstmt.setLong(1, goals[x]);
                    pstmt.setString(2, compId);
                    pstmt.setString(3, empNo+"");
                    pstmt.setInt(4, year);
                    pstmt.setInt(5, x + 1);
                    y += pstmt.executeUpdate();
                } else { // 신규 입력
                    pstmt = conn.prepareStatement(sql4);
                    pstmt.setString(1, compId);
                    pstmt.setString(2, empNo+"");
                    pstmt.setInt(3, year);
                    pstmt.setInt(4, x + 1);
                    pstmt.setLong(5, goals[x]);
                    y += pstmt.executeUpdate();
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        if (y == 12)
            result = "ok";
        return result;
    }

    // ========================================= 2022년 비즈코어 리뉴얼 파일 데이터 마이그레이션 전용 메서드
    // ====================================

    // SOPP 첨부파일 (DB => storage)
    public int soppFileDownloadAndSave() {
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

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                sopp = rs.getInt(1);
                fileName = rs.getString(2);
                savedName = createRandomFileName();
                blob = rs.getBlob(3);
                isr = blob.getBinaryStream();
                data = isr.readAllBytes();
                isr.close();
                file = new File(path + s + sopp);
                if (!file.exists())
                    file.mkdir();
                file = new File(path + s + sopp + s + savedName);
                fos = new FileOutputStream(file);
                logger.info("[SystemService] Try save file data : " + count + " / " + fileName);
                fos.write(data);
                fos.close();
                saveAttachedData("sopp", sopp, fileName, savedName, file.length());
                count++;
            }

        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
        return count;
    } // End of soppFileDownloadAndSave()

    // 전자결재 첨부파일 (DB => storage)
    public int appDocFileDownloadAndSave() {
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

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                no = rs.getInt(1);
                fileName = rs.getString(2);
                savedName = createRandomFileName();
                blob = rs.getBlob(3);
                isr = blob.getBinaryStream();
                data = isr.readAllBytes();
                isr.close();
                file = new File(path + s + no);
                if (!file.exists())
                    file.mkdir();
                file = new File(path + s + no + s + savedName);
                fos = new FileOutputStream(file);
                logger.info("[SystemService] Try save file data : " + count + " / " + fileName);
                fos.write(data);
                fos.close();
                saveAttachedData("appDoc", no, fileName, savedName, file.length());
                count++;
            }

        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
        return count;
    } // End of appDocFileDownloadAndSave()

    // 계약 첨부파일 (DB => storage)
    public int contractFileDownloadAndSave() {
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

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                no = rs.getInt(1);
                fileName = rs.getString(2);
                savedName = createRandomFileName();
                blob = rs.getBlob(3);
                isr = blob.getBinaryStream();
                data = isr.readAllBytes();
                isr.close();
                file = new File(path + s + no);
                if (!file.exists())
                    file.mkdir();
                file = new File(path + s + no + s + savedName);
                fos = new FileOutputStream(file);
                logger.info("[SystemService] Try save file data : " + count + " / " + fileName);
                fos.write(data);
                fos.close();
                saveAttachedData("contrct", no, fileName, savedName, file.length());
                count++;
            }

        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
        return count;
    } // End of contractFileDownloadAndSave()

    // ======================== P R I V A T E _ M E T H O D
    // ===========================

    // DB에서 dtorage 장치로 이전된 파일에 데해 DB에 저장하는 메서드
    private void saveAttachedData(String funcName, int no, String fileName, String savedName, long size) {
        String sql = "INSERT INTO bizcore.attached(compId, funcName, funcNo, fileName, savedName, `size`) VALUES('vtek', ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, funcName);
            pstmt.setInt(2, no);
            pstmt.setString(3, fileName);
            pstmt.setString(4, savedName);
            pstmt.setLong(5, size);
            if (pstmt.executeUpdate() > 0)
                logger.debug("[SystemService] DB File info insert success : " + fileName);
            else
                logger.warn("[SystemService] DB File info insert fail : " + fileName);
        } catch (SQLException e) {
            e.printStackTrace();
        }

    } // End of saveAttachedData()

    // keepToken을 받아서 로그인 유지 정보를 확인하는 메서드
    public String getKeepLoginUser(String compId, String keepToken) {
        String result = null;
        long now = System.currentTimeMillis();
        result = systemMapper.verifyLoginKeepToken(compId, keepToken, now);
        return result;
    }

    public void removeKeepInfo(String compId, String userNo) {
        systemMapper.deleteKeepTokenByUser(compId, userNo);
    }

    public int insertReport(String docNo, int writer, String formId, String dept, String docBox, String title,
            String confirmNo,
            int status, String readable, String created) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        int result = 0;
        String sql = "INSERT INTO bizcore.doc_app(no,compId, docNo, writer, formId, dept,  docBox,title, confirmNo,status, readable,created) VALUES(?,'vtek', ?, ?, ?, ?, ?,?,?,?,?,?)";

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            int no = getNextNumberFromDB("vtek", "bizcore.doc_app");
            pstmt.setInt(1, no);
            pstmt.setString(2, docNo);
            pstmt.setInt(3, writer);
            pstmt.setString(4, formId);
            pstmt.setString(5, dept);
            pstmt.setString(6, docBox);
            pstmt.setString(7, title);
            pstmt.setString(8, confirmNo);
            pstmt.setInt(9, status);
            pstmt.setString(10, readable);
            pstmt.setString(11, created);
            result = pstmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return result;

    }

    public int insertReportDetail(String docNo, int ordered, int employee, int appType, String read, int isModify,
            String doc, String approved, String retrieved, String rejected, String comment, String appData) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        int result = 0;
        String sql = "INSERT INTO bizcore.doc_app_detail(compId, docNo, ordered, employee, appType, `read`, isModify, doc, approved, retrieved, rejected, comment, appData) VALUES('vtek',?,?,?,?,?,?,?,?,?,?,?,?)";
        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, docNo);
            pstmt.setInt(2, ordered);
            pstmt.setInt(3, employee);
            pstmt.setInt(4, appType);
            pstmt.setString(5, read);
            pstmt.setInt(6, isModify);
            pstmt.setString(7, doc);
            pstmt.setString(8, approved);
            pstmt.setString(9, retrieved);
            pstmt.setString(10, rejected);
            pstmt.setString(11, comment);
            pstmt.setString(12, appData);
            result = pstmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return result;
    }

    public int docFileDownloadAndSave(String docNo) {
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
        String sql = "SELECT docNo AS no, filename AS name, filecontent AS content FROM swcore.swc_businessfiledata WHERE docNo = ? ";
        String sql1 = "select no from bizcore.doc_app where substring(docNo,10) = ?";
        int no = -1;
        int count = 1;

        path = rootPath + s + "vtek" + s + "appDoc";

        try {
            conn = sqlSession.getConnection();
            pstmt = conn.prepareStatement(sql1);
            pstmt.setString(1, docNo);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                no = rs.getInt(1);
            }
            rs.close();
            pstmt.close();

            logger.error("/////////////////////////////////////////////////// no : " + no);

            if(no == -1)    return -99999;

            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, docNo);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                fileName = rs.getString("name");
                savedName = createRandomFileName();
                blob = rs.getBlob("content");
                isr = blob.getBinaryStream();
                data = isr.readAllBytes();
                isr.close();
                file = new File(path + s + no);
                if (!file.exists())
                    file.mkdir();
                file = new File(path + s + no + s + savedName);
                fos = new FileOutputStream(file);
                fos.write(data);
                fos.close();
                saveAttachedData("appDoc", no, fileName, savedName, file.length());
                count++;
                data = null;
            }

        } catch (SQLException | IOException e) {
            e.printStackTrace();
        }
        logger.info("file count end " + count);
        return count;

    } // End of contractFileDownloadAndSave()

}