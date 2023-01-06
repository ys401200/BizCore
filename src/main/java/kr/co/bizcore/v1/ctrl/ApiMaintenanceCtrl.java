package kr.co.bizcore.v1.ctrl;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.bizcore.v1.domain.Maintenance;
import kr.co.bizcore.v1.svc.MaintenanceService;

@RestController
@RequestMapping("/api/maintenance")
public class ApiMaintenanceCtrl {
    @Autowired
    MaintenanceService maintenanceService;

    @PostMapping("")
    public String insertMaintenance(HttpServletRequest request, @RequestBody String requestbody) {
        String result = null;
        String compId = null, startDate = null, endDate = null;
        int product, contract, customer, engineer;
        JSONObject json = null;
        JSONArray jarr = new JSONArray(requestbody);

        for (int i = 0; i < jarr.length(); i++) {
            json = jarr.getJSONObject(i);
            product = json.getInt("product");
            customer = json.getInt("customer");
            engineer = json.getInt("engineer");
            startDate = json.getString("startDate");
            endDate = json.getString("endDate");
            System.out.println("product >>>" + product);

        }

        return result;

    }

}
