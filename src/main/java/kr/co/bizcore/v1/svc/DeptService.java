package kr.co.bizcore.v1.svc;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.bizcore.v1.domain.Dept;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DeptService extends Svc {

    private static final Logger logger = LoggerFactory.getLogger(DeptService.class);

    public Dept rootDept(String compId){
        Dept result = null;

        result = (Dept)dataFactory.getData(compId, "rootDept");
        if(result == null && getAndProceedDeptInfo(compId)){
            result = (Dept)dataFactory.getData(compId, "rootDept");
        }
        return result;
    } // End of rootDept()

    public HashMap<String, Dept> deptMap(String compId){
        HashMap<String, Dept> result = null;
        Dept root = null;

        root = (Dept)dataFactory.getData(compId, "rootDept");
        if(result == null && getAndProceedDeptInfo(compId)){
            result = (HashMap<String, Dept>)dataFactory.getData(compId, "rootDept");
        }
        return result;
    } // End of rootDept()

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

    public String getDeptJson(String compId){
        String result = null, name = null;
        Dept root = null;
        HashMap<String, Dept> map = null;
        Object[] keySet = null;

        root = rootDept(compId);
        map = root.getMap();
        result = "{";
        keySet = map.keySet().toArray();
        for(Object key : keySet){
            name = (String)key;
            if(result.length() > 2) result += ",";
            result += ("\"" + name + "\":" + map.get(name).toJsonSingle());
        }
        result += "}";
        
        result = "{\"root\":\"" + root.getDeptId() + "\",\"dept\":" + result + "}";
        return result;
    } // End of getDeptJson()

} // End of Class === DeptService
